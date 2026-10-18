// Studio 360 motion library: animation is a pure function of time (seek(t)) → deterministic frame-by-frame rendering.
// The page defines: window.SCENES (from timings.js) and window.draw(t). The renderer calls window.seek(t) on each frame.
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const ease = {
  out: p => 1 - Math.pow(1 - p, 3),
  inOut: p => (p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
  back: p => { const c = 1.9; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); },
  elastic: p => (p === 0 || p === 1 ? p : Math.pow(2, -10 * p) * Math.sin((p * 10 - .75) * (2 * Math.PI) / 3) + 1),
};
// progress 0→1 between t0 and t0+d
const prog = (t, t0, d, e = ease.out) => e(clamp((t - t0) / d));
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const S = id => window.SCENES.find(s => s.id === id);              // {id, start, end, words:[{w,s,e}]}
const W = (id, i) => { const s = S(id); const w = s.words[Math.min(i, s.words.length - 1)]; return w ? w.s : s.start; };
const style = (el, o) => { if (typeof el === 'string') el = $(el); if (el) Object.assign(el.style, o); };

// pop-in: opacity + scale with overshoot
function popIn(el, t, t0, d = .45, from = .6) {
  const p = clamp((t - t0) / d);
  style(el, { opacity: clamp(p * 2.5), transform: `scale(${lerp(from, 1, ease.back(p))})` });
}

// karaoke subtitles: 3-word groups, the current word in the accent color (the browser renders Arabic correctly)
function subtitles(t, el = '#subs', size = 3) {
  const box = typeof el === 'string' ? $(el) : el; if (!box) return;
  let html = '';
  for (const s of window.SCENES) {
    if (t < s.start || t > s.end || s.nosubs) continue;
    for (let i = 0; i < s.words.length; i += size) {
      const g = s.words.slice(i, i + size);
      const gEnd = (s.words[i + size] || {}).s || g[g.length - 1].e + .25;
      if (t >= g[0].s && t < gEnd) {
        const cur = g.findIndex((w, j) => t >= w.s && t < ((g[j + 1] || {}).s || gEnd));
        html = g.map((w, j) => `<span class="${j === cur ? 'hi' : ''}">${w.w}</span>`).join(' ');
        const p = clamp((t - g[0].s) / .18);
        box.style.transform = `scale(${lerp(.85, 1, ease.back(p))})`;
      }
    }
  }
  if (box.innerHTML !== html) box.innerHTML = html;
}

function progressBar(t, el = '#progress') {
  const end = window.SCENES[window.SCENES.length - 1].end;
  style(el, { width: `${clamp(t / end) * 100}%` });
}

window.seek = async t => { window.draw(t); await document.fonts.ready; };
