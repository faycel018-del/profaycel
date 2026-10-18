#!/usr/bin/env python3
"""Turn a PowerPoint into images, one per click: every slide at every animation step.

usage: deck_steps.py deck.pptx outdir [--width 1920] [--slides 4,5,8]
output: outdir/s04_k00.png, s04_k01.png ...  plus outdir/steps.json  {"4": 2, ...} (number of clicks per slide)

How it works: parse the main sequence (mainSeq) of each slide. Shapes with an entrance effect stay hidden
until their click; shapes with an exit effect (like the "?" buttons) disappear on their click.
For each step k we build a copy of the deck with the hidden shapes deleted, then render it with LibreOffice.
"""
import argparse, json, re, shutil, subprocess, tempfile, zipfile
from pathlib import Path
from lxml import etree

NS = {"p": "http://schemas.openxmlformats.org/presentationml/2006/main",
      "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
      "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}


def click_groups(root):
    """[[(spid, 'entr'|'exit'), ...] per click]; group 0 = automatic effects at slide start."""
    seq = root.find(".//p:cTn[@nodeType='mainSeq']/p:childTnLst", NS)
    groups = [[]]
    if seq is None:
        return groups
    for par in seq.findall("p:par", NS):
        conds = par.findall("p:cTn/p:stCondLst/p:cond", NS)
        auto = any(c.get("evt") == "onBegin" for c in conds)
        effects = []
        for ctn in par.iter("{%s}cTn" % NS["p"]):
            cls = ctn.get("presetClass")
            if cls in ("entr", "exit"):
                for t in ctn.iterfind(".//p:spTgt", NS):
                    effects.append((t.get("spid"), cls))
        if auto:
            groups[0] += effects
        else:
            groups.append(effects)
    return groups


def hidden_at(groups, k):
    """Set of shape ids hidden after k clicks."""
    state = {}
    for spid, cls in (e for g in groups for e in g):  # initial state comes from the first effect
        state.setdefault(spid, cls == "exit")  # entr first → starts hidden(False=hidden); exit first → visible
    vis = {s: v for s, v in state.items()}
    for g in groups[:k + 1]:
        for spid, cls in g:
            vis[spid] = cls == "entr"
    return {s for s, v in vis.items() if not v}


def strip_shapes(xml, hide):
    root = etree.fromstring(xml)
    for el in list(root.iter("{%s}cNvPr" % NS["p"])):
        if el.get("id") in hide:
            shape = el.getparent().getparent()  # cNvPr → nvSpPr → sp/pic/grpSp/cxnSp
            shape.getparent().remove(shape)
    t = root.find("p:timing", NS)
    if t is not None:
        root.remove(t)
    return etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("deck"); ap.add_argument("out")
    ap.add_argument("--width", type=int, default=1920)
    ap.add_argument("--slides", default="")
    a = ap.parse_args()
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    z = zipfile.ZipFile(a.deck)
    names = {n: z.read(n) for n in z.namelist()}

    # slide order from presentation.xml → rels
    pres = etree.fromstring(names["ppt/presentation.xml"])
    rels = etree.fromstring(names["ppt/_rels/presentation.xml.rels"])
    rid2target = {r.get("Id"): r.get("Target") for r in rels}
    order = [("ppt/" + rid2target[s.get("{%s}id" % NS["r"])]) for s in pres.find("p:sldIdLst", NS)]
    wanted = {int(x) for x in a.slides.split(",") if x} or set(range(1, len(order) + 1))

    info = {}
    for i, path in enumerate(order, 1):
        if i in wanted:
            info[i] = click_groups(etree.fromstring(names[path]))
    steps = {i: len(g) - 1 for i, g in info.items()}
    (out / "steps.json").write_text(json.dumps(steps, indent=1))
    print("clicks per slide:", steps)

    with tempfile.TemporaryDirectory() as tmp:
        for k in range(max(steps.values()) + 1):
            active = [i for i in info if steps[i] >= k]
            # keep only the slides that have a step k
            p = etree.fromstring(names["ppt/presentation.xml"])
            lst = p.find("p:sldIdLst", NS)
            for idx, s in enumerate(list(lst), 1):
                if idx not in active:
                    lst.remove(s)
            deck = Path(tmp) / f"k{k:02d}.pptx"
            with zipfile.ZipFile(deck, "w", zipfile.ZIP_DEFLATED) as w:
                for n, data in names.items():
                    if n == "ppt/presentation.xml":
                        data = etree.tostring(p, xml_declaration=True, encoding="UTF-8", standalone=True)
                    elif n in order and order.index(n) + 1 in active:
                        data = strip_shapes(data, hidden_at(info[order.index(n) + 1], k))
                    w.writestr(n, data)
            subprocess.run(["soffice", "--headless", "--convert-to", "pdf", "--outdir", tmp, str(deck)],
                           check=True, capture_output=True, timeout=600)
            subprocess.run(["pdftoppm", "-png", "-scale-to-x", str(a.width), "-scale-to-y", "-1",
                            str(deck.with_suffix(".pdf")), f"{tmp}/r{k:02d}"], check=True)
            pages = sorted(Path(tmp).glob(f"r{k:02d}-*.png"))
            for slide_no, page in zip(active, pages):
                shutil.move(page, out / f"s{slide_no:02d}_k{k:02d}.png")
            print(f"step {k}: {len(active)} slides")
    print(out)


if __name__ == "__main__":
    main()
