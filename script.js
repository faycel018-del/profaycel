// PROFAYCEL - Commit test


// =====================================================
// PROFAYCEL - JavaScript principal
// =====================================================

console.log("Profaycel fonctionne !");
// =====================================================
// TOAST NOTIFICATIONS
// =====================================================

function showToast(message, type = "info") {

    console.log("showToast appelé :", message, type);

    // نصنعوا container إذا ما كانش
    let container = document.getElementById("toast-container");

    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "toast-container";

        // نضمنوا position مباشرة
        container.style.position = "fixed";
        container.style.top = "20px";
        container.style.right = "20px";
        container.style.left = "auto";
        container.style.bottom = "auto";
        container.style.zIndex = "9999";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "10px";
        container.style.pointerEvents = "none";

        document.body.appendChild(container);
    }

    // نصنعوا Toast
    const toast = document.createElement("div");
    toast.className = "toast toast-" + type;

    // نضمنوا style مباشرة
    toast.style.minWidth = "280px";
    toast.style.maxWidth = "380px";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.gap = "12px";
    toast.style.padding = "14px 18px";
    toast.style.background = "#ffffff";
    toast.style.borderRadius = "12px";
    toast.style.boxShadow = "0 20px 50px rgba(15, 23, 42, 0.12)";
    toast.style.color = "#0f172a";
    toast.style.fontSize = "0.92rem";
    toast.style.fontWeight = "600";
    toast.style.pointerEvents = "auto";
    toast.style.transform = "translateX(120%)";
    toast.style.opacity = "0";
    toast.style.transition = "transform 0.3s ease, opacity 0.3s ease";

    // الأيقونة واللون حسب النوع
    let icon = "ℹ️";
    let borderColor = "#2563eb";

    if (type === "success") {
        icon = "✅";
        borderColor = "#22c55e";
    }

    if (type === "error") {
        icon = "❌";
        borderColor = "#dc2626";
    }

    if (type === "warning") {
        icon = "⚠️";
        borderColor = "#f59e0b";
    }

    toast.style.borderLeft = "4px solid " + borderColor;

    toast.innerHTML =
        '<div style="width:24px;height:24px;flex:0 0 24px;display:flex;align-items:center;justify-content:center;font-size:1rem;color:' + borderColor + '">' + icon + '</div>' +
        '<div style="flex:1;line-height:1.4;">' + message + '</div>';

    // نزيدوه في الكونتينر
    container.appendChild(toast);

    console.log("Toast ajouté au DOM :", toast);

    // نضيفوا show
    setTimeout(function () {
        toast.style.transform = "translateX(0)";
        toast.style.opacity = "1";
    }, 10);

    // نحذفوه
    setTimeout(function () {

        toast.style.transform = "translateX(120%)";
        toast.style.opacity = "0";

        setTimeout(function () {
            toast.remove();
        }, 300);

    }, 4000);

}
// =====================================================
// CHARGEMENT DYNAMIQUE DE SUPABASE
// =====================================================

(function loadSupabase() {

    if (typeof window.supabase !== "undefined") {
        console.log("Supabase déjà chargé.");
        return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script.async = true;

    script.onload = function () {

        console.log("Supabase JS chargé !");

        const config = document.createElement("script");
        config.src = "supabase.js";
        config.async = true;

        config.onload = function () {
            console.log("supabase.js chargé !");
        };

        config.onerror = function () {
            console.error("Erreur de chargement de supabase.js");
        };

        document.head.appendChild(config);

    };

    script.onerror = function () {
        console.error("Erreur de chargement de Supabase JS.");
    };

    document.head.appendChild(script);

})();


// =====================================================
// APPLICATION INSTALLABLE (PWA)
// =====================================================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", function () {

        navigator.serviceWorker.register("sw.js").catch(function (error) {
            console.error("Erreur service worker:", error);
        });

    });

}

(function setupInstallButton() {

    let deferredPrompt = null;

    window.addEventListener("beforeinstallprompt", function (event) {

        event.preventDefault();
        deferredPrompt = event;

        if (document.querySelector(".install-app-button")) {
            return;
        }

        const button = document.createElement("button");
        button.type = "button";
        button.className = "install-app-button";
        button.textContent = "📲 Installer l'application";

        button.addEventListener("click", async function () {

            if (!deferredPrompt) {
                return;
            }

            deferredPrompt.prompt();
            await deferredPrompt.userChoice;
            deferredPrompt = null;
            button.remove();

        });

        document.body.appendChild(button);

    });

    window.addEventListener("appinstalled", function () {

        const button = document.querySelector(".install-app-button");

        if (button) {
            button.remove();
        }

    });

})();


// iPhone / iPad : Safari ne propose pas d'installation automatique,
// on affiche donc les étapes « Partager → Sur l'écran d'accueil »
(function setupInstallIOS() {

    const ua = window.navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(ua) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const dejaInstallee = window.navigator.standalone === true ||
        window.matchMedia("(display-mode: standalone)").matches;

    if (!isIOS || dejaInstallee) {
        return;
    }

    const isSafari = !/CriOS|FxiOS|EdgiOS|OPiOS|GSA|FBAN|FBAV|Instagram/.test(ua);

    function ouvrirAide() {

        const overlay = document.createElement("div");
        overlay.className = "modal-overlay active";

        const etapes = isSafari
            ? `
                <ol class="ios-etapes">
                    <li>Touchez <strong>Partager</strong> <span aria-hidden="true">⬆️</span> en bas de l'écran.</li>
                    <li>Choisissez <strong>« Sur l'écran d'accueil »</strong> <span aria-hidden="true">➕</span>.</li>
                    <li>Touchez <strong>Ajouter</strong> en haut à droite.</li>
                </ol>
            `
            : `
                <p>Sur iPhone, l'installation se fait depuis <strong>Safari</strong>.</p>
                <ol class="ios-etapes">
                    <li>Copiez cette adresse : <strong>${SITE_URL}</strong></li>
                    <li>Ouvrez-la dans <strong>Safari</strong>.</li>
                    <li>Touchez <strong>Partager</strong> ⬆️, puis <strong>« Sur l'écran d'accueil »</strong>.</li>
                </ol>
            `;

        overlay.innerHTML = `
            <div class="modal-box">
                <div class="modal-header">
                    <h2>Installer Profaycel</h2>
                    <button type="button" class="modal-close" aria-label="Fermer">✕</button>
                </div>
                ${etapes}
                <p dir="rtl" class="ios-etapes-ar">
                    من <strong>Safari</strong>: اضغط ⬆️ <strong>Partager</strong>،
                    ومن بعد <strong>Sur l'écran d'accueil</strong>، ومن بعد <strong>Ajouter</strong>.
                </p>
            </div>
        `;

        function fermer() {
            overlay.remove();
        }

        overlay.querySelector(".modal-close").addEventListener("click", fermer);

        overlay.addEventListener("click", function (event) {
            if (event.target === overlay) {
                fermer();
            }
        });

        document.body.appendChild(overlay);

    }

    function ajouterBouton() {

        if (document.querySelector(".install-app-button")) {
            return;
        }

        const button = document.createElement("button");
        button.type = "button";
        button.className = "install-app-button";
        button.textContent = "📲 Installer l'application";
        button.addEventListener("click", ouvrirAide);

        document.body.appendChild(button);

    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", ajouterBouton);
    } else {
        ajouterBouton();
    }

})();


// Compte administrateur (la base de données vérifie aussi cet email)
const ADMIN_EMAIL = "faycel.khlifiii@gmail.com";

// Adresse publique du site (pour les messages WhatsApp)
const SITE_URL = "https://faycel018-del.github.io/profaycel/";

// Une mensualité couvre 4 séances
const SEANCES_PAR_MOIS = 4;

// Séances faites, période en cours et état du paiement d'un élève
// (eleve.presences et eleve.paiements viennent de la requête Supabase)
function suiviEleve(eleve) {

    const presents = (eleve.presences || []).filter(function (p) {
        return p.present;
    }).length;

    const total = (eleve.seances_anterieures || 0) + presents;
    const moisPayes = (eleve.paiements || []).length;
    const periode = total === 0 ? 0 : ((total - 1) % SEANCES_PAR_MOIS) + 1;
    const paye = moisPayes * SEANCES_PAR_MOIS >= total;

    let paiement;

    if (total === 0 && moisPayes === 0) {
        paiement = "—";
    } else if (paye) {
        paiement = "✅ Payé";
    } else {
        paiement = "⚠️ Paiement attendu";
    }

    return {
        total: total,
        periode: periode,
        moisPayes: moisPayes,
        paye: paye,
        paiement: paiement,
        seancesCouvertes: moisPayes * SEANCES_PAR_MOIS
    };

}

// Ordre d'affichage des classes
const ORDRE_CLASSES = ["7 أساسي", "8 أساسي", "9 أساسي", "1 ثانوي", "2 ثانوي", "3 ثانوي", "باكالوريا"];

function trierClasses(a, b) {

    const ia = ORDRE_CLASSES.indexOf(a);
    const ib = ORDRE_CLASSES.indexOf(b);

    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;

    return ia - ib;

}

// Regroupe une liste par classe, dans l'ordre des classes
function grouperParClasse(liste, classeDe) {

    const groupes = {};

    liste.forEach(function (item) {
        const classe = classeDe(item) || "Sans classe";
        groupes[classe] = groupes[classe] || [];
        groupes[classe].push(item);
    });

    return Object.keys(groupes).sort(trierClasses).map(function (classe) {
        return { classe: classe, items: groupes[classe] };
    });

}

// Onglets « Présentiel / À distance » (élèves et parents)
function setupModeTabs(onChange) {

    let mode = "presentiel";

    try {
        mode = localStorage.getItem("profaycel_mode_admin") || "presentiel";
    } catch (e) {
        mode = "presentiel";
    }

    const tabs = document.querySelectorAll(".mode-tab");

    function activer(nouveau) {

        mode = nouveau;

        tabs.forEach(function (tab) {
            tab.classList.toggle("active", tab.dataset.mode === mode);
            tab.setAttribute("aria-selected", tab.dataset.mode === mode ? "true" : "false");
        });

        try {
            localStorage.setItem("profaycel_mode_admin", mode);
        } catch (e) {
            // ignoré
        }

        onChange(mode);

    }

    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            activer(tab.dataset.mode);
        });
    });

    activer(mode);

    return function () {
        return mode;
    };

}


// Lien WhatsApp vers le parent, avec le code d'accès de l'élève
function lienWhatsAppCode(eleve) {

    const parent = eleve.parents;

    if (!parent || !parent.telephone || !eleve.code_acces) {
        return null;
    }

    const telephone = parent.telephone.replace(/\D/g, "");

    const message =
        "السلام عليكم " + parent.prenom + " 🌸\n" +
        "هذا الأستاذ فيصل. ولّات عندنا منصة باش تتبّع قراية " + eleve.prenom +
        ": الحصص، الحضور، الخلاص والسلاسل.\n\n" +
        "1️⃣ ادخل هنا: " + SITE_URL + "register.html\n" +
        "2️⃣ اختار « Parent » وسجّل (بـ Google ولا بالإيميل)\n" +
        "3️⃣ في فضاء الولي، اكتب الكود هذا: " + eleve.code_acces + "\n\n" +
        "وكان عندك أي سؤال أنا موجود 🙏";

    return "https://wa.me/" + telephone + "?text=" + encodeURIComponent(message);

}


document.addEventListener("DOMContentLoaded", function () {

    // =================================================
    // 1. ELEMENTS PRINCIPAUX
    // =================================================

    const header = document.querySelector(".header");
    const navigation = document.querySelector(".navigation");
    const menuButton = document.querySelector(".mobile-menu-button");


    // =================================================
    // 2. MENU MOBILE
    // =================================================

    if (header && navigation && menuButton) {

        menuButton.addEventListener("click", function () {

            const isOpen = navigation.classList.toggle("menu-open");
            header.classList.toggle("menu-open", isOpen);

            menuButton.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            menuButton.setAttribute(
                "aria-label",
                isOpen ? "Fermer le menu" : "Ouvrir le menu"
            );

        });


        const navigationLinks = navigation.querySelectorAll("a");

        navigationLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                header.classList.remove("menu-open");
                navigation.classList.remove("menu-open");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuButton.setAttribute(
                    "aria-label",
                    "Ouvrir le menu"
                );

            });

        });


        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {

                header.classList.remove("menu-open");
                navigation.classList.remove("menu-open");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuButton.setAttribute(
                    "aria-label",
                    "Ouvrir le menu"
                );

            }

        });


        window.addEventListener("resize", function () {

            if (window.innerWidth > 800) {

                header.classList.remove("menu-open");
                navigation.classList.remove("menu-open");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuButton.setAttribute(
                    "aria-label",
                    "Ouvrir le menu"
                );

            }

        });

    }


    // =================================================
    // 3. SMOOTH SCROLL
    // =================================================

    const internalLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    internalLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#" ||
                targetId.length <= 1
            ) {
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (targetElement) {

                event.preventDefault();

                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    // =================================================
    // 4. BOUTON "RETOUR EN HAUT"
    // =================================================

    const backToTopButton = document.createElement("button");

    backToTopButton.type = "button";
    backToTopButton.className = "back-to-top";
    backToTopButton.setAttribute(
        "aria-label",
        "Retour en haut"
    );
    backToTopButton.innerHTML = "↑";

    document.body.appendChild(backToTopButton);


    function updateBackToTopButton() {

        if (window.scrollY > 400) {

            backToTopButton.classList.add("show");

        } else {

            backToTopButton.classList.remove("show");

        }

    }

    window.addEventListener(
        "scroll",
        updateBackToTopButton,
        { passive: true }
    );

    updateBackToTopButton();


    backToTopButton.addEventListener(
        "click",
        function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    backToTopButton.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        }
    );


    // =================================================
    // 5. BOUTON CONNEXION / DÉCONNEXION (AUTO)
    // =================================================

    let headerActions = document.querySelector(".header-actions");

    if (!headerActions) {

        const headerContainer = document.querySelector(".header-container")
            || document.querySelector(".header");

        if (headerContainer) {

            headerActions = document.createElement("div");
            headerActions.className = "header-actions";

            headerContainer.appendChild(headerActions);

            console.log("header-actions créé automatiquement.");

        }

    }

    if (headerActions) {

        function updateAuthButton() {

            if (!window.supabaseClient) {
                setTimeout(updateAuthButton, 200);
                return;
            }

            window.supabaseClient.auth.getSession().then(function (result) {

                const session = result.data.session;

                const oldButton = headerActions.querySelector(".header-login-button");
                if (oldButton) {
                    oldButton.remove();
                }

                const oldLogout = headerActions.querySelector(".header-logout-button");
                if (oldLogout) {
                    oldLogout.remove();
                }

                // Les anciens boutons « Espace Élève / Espace Parent / Administration »
                // sont remplacés par un seul bouton « Mon espace » selon le rôle
                headerActions.querySelectorAll(
                    'a[href="eleve.html"], a[href="parent.html"], a[href="admin.html"], .header-space-button, .header-register-button'
                ).forEach(function (lien) {
                    lien.remove();
                });

                if (session) {

                    const role = session.user.user_metadata.role;

                    const espaceLink = document.createElement("a");
                    espaceLink.className = "header-button header-space-button";
                    espaceLink.textContent = "🏠 Mon espace";
                    espaceLink.href = role === "admin"
                        ? "admin.html"
                        : role === "parent" ? "parent.html" : "eleve.html";

                    headerActions.insertBefore(espaceLink, headerActions.firstChild);

                    const logoutLink = document.createElement("a");
                    logoutLink.href = "#";
                    logoutLink.className = "header-button header-logout-button";
                    logoutLink.textContent = "Déconnexion";

                    logoutLink.addEventListener("click", async function (event) {

                        event.preventDefault();

                        await window.supabaseClient.auth.signOut();

                        window.location.href = "index.html";

                    });

                    headerActions.insertBefore(
                        logoutLink,
                        espaceLink.nextSibling
                    );

                } else {

                    const registerLink = document.createElement("a");
                    registerLink.href = "register.html";
                    registerLink.className = "header-button header-register-button";
                    registerLink.textContent = "Inscription";

                    headerActions.insertBefore(
                        registerLink,
                        headerActions.firstChild
                    );


                    const loginLink = document.createElement("a");
                    loginLink.href = "login.html";
                    loginLink.className = "header-button header-login-button";
                    loginLink.textContent = "Connexion";

                    headerActions.insertBefore(
                        loginLink,
                        registerLink.nextSibling
                    );

                }

            });

        }

        updateAuthButton();

    }


    // =================================================
    // 5b. MENU MOBILE — BOUTONS DANS LE MENU ☰
    // =================================================

    if (headerActions && navigation) {

        const parentOrigine = headerActions.parentNode;
        const suivantOrigine = headerActions.nextSibling;
        const ecranMobile = window.matchMedia("(max-width: 800px)");

        function placerActions() {

            if (ecranMobile.matches) {
                navigation.appendChild(headerActions);
            } else if (headerActions.parentNode !== parentOrigine) {
                parentOrigine.insertBefore(headerActions, suivantOrigine);
            }

        }

        placerActions();

        if (ecranMobile.addEventListener) {
            ecranMobile.addEventListener("change", placerActions);
        } else {
            ecranMobile.addListener(placerActions);
        }

    }


    // =================================================
    // 6. INSCRIPTION (register.html)
    // =================================================

    const registerForm = document.getElementById("register-form");

    if (registerForm) {

        const roleSelectInscription = document.getElementById("role");
        const niveauGroup = document.getElementById("niveau-group");

        function majChoixNiveau() {
            const estEleve = roleSelectInscription.value === "eleve";
            niveauGroup.hidden = !estEleve;
            document.getElementById("niveau").required = estEleve;
        }

        roleSelectInscription.addEventListener("change", majChoixNiveau);
        majChoixNiveau();

        registerForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim().toLowerCase();
            const password = document.getElementById("password").value;
            const passwordConfirm = document.getElementById("password-confirm").value;
            let role = document.getElementById("role").value;
            const niveau = document.getElementById("niveau").value;

            if (role === "admin" && email !== ADMIN_EMAIL) {
                showToast("Vous n'êtes pas autorisé à créer un compte Admin.", "error");
                return;
            }

            if (email === ADMIN_EMAIL) {
                role = "admin";
            }

            if (!name || !email || !password || !passwordConfirm || !role) {
                showToast("Veuillez remplir tous les champs.", "warning");
                return;
            }

            if (role === "eleve" && !niveau) {
                showToast("Choisissez votre niveau.", "warning");
                return;
            }

            if (password !== passwordConfirm) {
                showToast("Les mots de passe ne correspondent pas.", "error");
                return;
            }

            if (password.length < 6) {
                showToast("Le mot de passe doit contenir au moins 6 caractères.", "warning");
                return;
            }

            if (!window.supabaseClient) {
                showToast("Erreur : Supabase non connecté.", "error");
                return;
            }

            const { data, error } = await window.supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        nom: name,
                        role: role,
                        niveau: role === "eleve" ? niveau : ""
                    }
                }
            });

            if (error) {
                console.error("Erreur inscription:", error);
                showToast("Erreur : " + error.message, "error");
                return;
            }

            console.log("Inscription réussie:", data);

            showToast("Compte créé avec succès !", "success");

            setTimeout(function () {
                window.location.href = "login.html";
            }, 1500);

        });

    }


    // =================================================
    // 7. CONNEXION (login.html)
    // =================================================

    const loginForm = document.getElementById("login-form");

    if (loginForm) {

        loginForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            if (!email || !password) {
                showToast("Veuillez remplir tous les champs.", "warning");
                return;
            }

            if (!window.supabaseClient) {
                showToast("Erreur : Supabase non connecté.", "error");
                return;
            }

            const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                console.error("Erreur connexion:", error);
                showToast("Erreur : " + error.message, "error");
                return;
            }

            console.log("Connexion réussie:", data);

            showToast("Connexion réussie !", "success");

            const userRole = data.user.user_metadata.role;

            setTimeout(function () {

                if (userRole === "admin") {
                    window.location.href = "admin.html";
                } else if (userRole === "parent") {
                    window.location.href = "parent.html";
                } else {
                    window.location.href = "eleve.html";
                }

            }, 800);

        });

    }


    // =================================================
    // 7b. CONNEXION AVEC GOOGLE (login.html + register.html)
    // =================================================

    const btnGoogle = document.getElementById("btn-google");

    function redirectByRole(role) {

        if (role === "admin") {
            window.location.href = "admin.html";
        } else if (role === "parent") {
            window.location.href = "parent.html";
        } else {
            window.location.href = "eleve.html";
        }

    }

    if (btnGoogle) {

        btnGoogle.addEventListener("click", async function () {

            if (!window.supabaseClient) {
                showToast("Erreur : Supabase non connecté.", "error");
                return;
            }

            // Sur la page d'inscription, on garde le rôle choisi
            // pour l'appliquer au retour de Google
            const roleSelect = document.getElementById("role");

            if (roleSelect) {

                if (!roleSelect.value) {
                    showToast("Choisissez d'abord : Élève, Parent ou Enseignant.", "warning");
                    roleSelect.focus();
                    return;
                }

                const niveauSelect = document.getElementById("niveau");

                if (roleSelect.value === "eleve" && niveauSelect && !niveauSelect.value) {
                    showToast("Choisissez votre niveau.", "warning");
                    niveauSelect.focus();
                    return;
                }

                try {
                    localStorage.setItem("profaycel_role_google", roleSelect.value);
                    localStorage.setItem("profaycel_niveau_google",
                        roleSelect.value === "eleve" && niveauSelect ? niveauSelect.value : "");
                } catch (e) {
                    console.warn("localStorage indisponible:", e);
                }

            }

            const { error } = await window.supabaseClient.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: new URL("login.html", window.location.href).href
                }
            });

            if (error) {
                console.error("Erreur Google:", error);
                showToast("Erreur : " + error.message, "error");
            }

        });

    }


    // Retour de Google sur login.html : on fixe le rôle puis on redirige
    if (loginForm) {

        async function finishGoogleLogin() {

            if (!window.supabaseClient) {
                setTimeout(finishGoogleLogin, 200);
                return;
            }

            const { data } = await window.supabaseClient.auth.getSession();
            const session = data.session;

            if (!session) {
                return;
            }

            const user = session.user;
            const email = (user.email || "").toLowerCase();
            let role = user.user_metadata.role;

            if (!role) {

                let niveau = "";

                try {
                    role = localStorage.getItem("profaycel_role_google");
                    niveau = localStorage.getItem("profaycel_niveau_google") || "";
                    localStorage.removeItem("profaycel_role_google");
                    localStorage.removeItem("profaycel_niveau_google");
                } catch (e) {
                    role = null;
                }

                role = role || "eleve";

                if (email === ADMIN_EMAIL) {
                    role = "admin";
                } else if (role === "admin") {
                    role = "eleve";
                }

                const { error } = await window.supabaseClient.auth.updateUser({
                    data: { role: role, niveau: role === "eleve" ? niveau : "" }
                });

                if (error) {
                    console.error("Erreur enregistrement rôle:", error);
                }

            }

            redirectByRole(role);

        }

        finishGoogleLogin();

    }


    // =================================================
    // 8. PROTECTION DES PAGES PRIVÉES (AVEC RÔLES)
    // =================================================

    const pageRoles = {

        "eleve.html": ["eleve", "admin"],
        "parent.html": ["parent", "admin"],

        "admin.html": ["admin"],
        "eleves.html": ["admin"],
        "parents.html": ["admin"],
        "classes.html": ["admin"],
        "seances-admin.html": ["admin"],
        "presence-admin.html": ["admin"],
        "documents-admin.html": ["admin"]

    };

let currentPage = window.location.pathname.split("/").pop();

// إذا فارغة (الصفحة الرئيسية)
if (!currentPage || currentPage === "") {
    currentPage = "index.html";
}

// إذا مافيهاش .html (Netlify يحذفها)
if (!currentPage.includes(".")) {
    currentPage = currentPage + ".html";
}

console.log("Page actuelle:", currentPage);
    if (pageRoles[currentPage]) {

        function checkAuth() {

            if (!window.supabaseClient) {
                setTimeout(checkAuth, 200);
                return;
            }

            window.supabaseClient.auth.getSession().then(function (result) {

                const session = result.data.session;

                if (!session) {

                    console.log("Accès refusé : non connecté.");

                    window.location.href = "login.html";
                    return;

                }

                const userRole = session.user.user_metadata.role;

                console.log("Rôle utilisateur :", userRole);

                const allowedRoles = pageRoles[currentPage];

                if (!allowedRoles.includes(userRole)) {

                    console.log("Accès refusé : rôle non autorisé.");

                    if (userRole === "eleve") {
                        window.location.href = "eleve.html";
                    } else if (userRole === "parent") {
                        window.location.href = "parent.html";
                    } else if (userRole === "admin") {
                        window.location.href = "admin.html";
                    } else {
                        window.location.href = "index.html";
                    }

                }

            });

        }

        checkAuth();

    }


    // =================================================
    // 9. ÉLÈVES — AFFICHER + AJOUTER + MODIFIER + SUPPRIMER
    // =================================================

    const elevesGrid = document.querySelector("#eleves-grid");
    const eleveModal = document.querySelector("#eleve-modal");
    const eleveForm = document.querySelector("#eleve-form");
    const modalTitle = document.querySelector("#modal-title");
    const btnAddEleve = document.querySelector("#btn-add-eleve");
    const modalClose = document.querySelector("#modal-close");
    const modalCancel = document.querySelector("#modal-cancel");

    if (elevesGrid) {

        let currentUserRole = null;

        async function getUserRole() {

            if (!window.supabaseClient) {
                setTimeout(getUserRole, 200);
                return;
            }

            const { data: sessionData } = await window.supabaseClient.auth.getSession();
            const session = sessionData.session;

            if (session) {
                currentUserRole = session.user.user_metadata.role;
            }

            console.log("Role actuel:", currentUserRole);

        }

        getUserRole();


        let elevesCharges = null;

        function carteEleve(eleve) {

                        const actionsHTML = currentUserRole === "admin"
                            ? `
                                <div class="card-actions">
                                    <button
                                        type="button"
                                        class="btn-edit btn-paiement"
                                        data-id="${eleve.id}">
                                        💰 + Paiement
                                    </button>
                                    <button
                                        type="button"
                                        class="btn-edit"
                                        data-id="${eleve.id}">
                                        ✏️
                                    </button>
                                    <button
                                        type="button"
                                        class="btn-delete"
                                        data-id="${eleve.id}">
                                        🗑️
                                    </button>
                                </div>
                            `
                            : "";

                        const suivi = suiviEleve(eleve);
                        const parent = eleve.parents;
                        const whatsapp = lienWhatsAppCode(eleve);

                        return `
                            <article class="student-dashboard-card">
                                <div class="dashboard-card-icon">
                                    👨‍🎓
                                </div>
                                <h3 dir="auto">
                                    ${eleve.prenom} ${eleve.nom}
                                </h3>
                                <p>
                                    <strong>Classe :</strong> <bdi>${eleve.classe || "—"}</bdi>
                                    <br>
                                    ${eleve.mode === "distance"
                                        ? `<strong>Email :</strong> ${eleve.email || "—"}
                                    <br>
                                    <strong>Inscrit le :</strong> ${eleve.created_at ? eleve.created_at.slice(0, 10) : "—"}`
                                        : `<strong>Parent :</strong> <span dir="auto">${parent ? parent.prenom + (parent.lien_parente ? " (" + parent.lien_parente + ")" : "") : "—"}</span>
                                    <br>
                                    <strong>Téléphone :</strong> ${parent && parent.telephone ? parent.telephone : (eleve.telephone || "—")}`}
                                    <br>
                                    <strong>Séances :</strong> ${suivi.total} (ce mois : ${suivi.periode} / ${SEANCES_PAR_MOIS})
                                    <br>
                                    <strong>Paiement :</strong> ${suivi.paiement} · ${suivi.moisPayes} mois
                                    <br>
                                    <strong>Code :</strong> <code>${eleve.code_acces || "—"}</code>
                                </p>
                                ${whatsapp ? `<a href="${whatsapp}" target="_blank" rel="noopener" class="button whatsapp-button">💬 Envoyer le code au parent</a>` : ""}
                                ${actionsHTML}
                            </article>
                        `;

                    }


        function afficherEleves() {

            if (!elevesCharges) {
                elevesGrid.innerHTML = "<p>Chargement...</p>";
                return;
            }

            const mode = modeEleves ? modeEleves() : "presentiel";

            const presentiels = elevesCharges.filter(function (e) { return e.mode !== "distance"; });
            const distances = elevesCharges.filter(function (e) { return e.mode === "distance"; });

            document.querySelector("#eleves-count-presentiel").textContent = `(${presentiels.length})`;
            document.querySelector("#eleves-count-distance").textContent = `(${distances.length})`;

            const liste = mode === "distance" ? distances : presentiels;

            if (liste.length === 0) {
                elevesGrid.innerHTML = mode === "distance"
                    ? "<p>Aucun élève inscrit à distance pour le moment.</p>"
                    : "<p>Aucun élève en présentiel.</p>";
                return;
            }

            elevesGrid.innerHTML = grouperParClasse(liste, function (e) { return e.classe; }).map(function (groupe) {
                return `
                    <h2 class="classe-titre"><bdi>${groupe.classe}</bdi> <span>${groupe.items.length} élève(s)</span></h2>
                    <div class="student-dashboard-grid">${groupe.items.map(carteEleve).join("")}</div>
                `;
            }).join("");

            attachCardEvents(elevesCharges);

        }


        let modeEleves = null;


        function loadEleves() {

            if (!window.supabaseClient) {
                setTimeout(loadEleves, 200);
                return;
            }

            window.supabaseClient
                .from("eleves")
                .select("*, parents(prenom, nom, telephone, lien_parente), presences(present), paiements(id)")
                .neq("statut", "archive")
                .order("prenom", { ascending: true })
                .then(function (result) {

                    if (result.error) {
                        console.error("Erreur chargement élèves:", result.error);
                        return;
                    }

                    const eleves = result.data;

                    console.log("Élèves chargés:", eleves.length);

                    elevesCharges = eleves;
                    afficherEleves();

                });

        }


        function attachCardEvents(eleves) {

            document.querySelectorAll("#eleves-grid .btn-paiement").forEach(function (btn) {

                btn.addEventListener("click", async function () {

                    const eleve = eleves.find(function (e) {
                        return e.id == btn.dataset.id;
                    });

                    if (!eleve) return;

                    const montant = eleve.tarif_mensuel || 100;

                    if (!confirm(`Enregistrer un paiement de ${montant} DT pour ${eleve.prenom} (${eleve.classe || ""}) ?`)) {
                        return;
                    }

                    const { error } = await window.supabaseClient
                        .from("paiements")
                        .insert([{ eleve_id: eleve.id, montant: montant }]);

                    if (error) {
                        console.error("Erreur paiement:", error);
                        showToast("Erreur : " + error.message, "error");
                        return;
                    }

                    showToast("Paiement enregistré !", "success");
                    loadEleves();

                });

            });

            document.querySelectorAll("#eleves-grid .btn-edit:not(.btn-paiement)").forEach(function (btn) {

                btn.addEventListener("click", function () {

                    const id = btn.dataset.id;
                    const eleve = eleves.find(function (e) {
                        return e.id == id;
                    });

                    if (!eleve) return;

                    document.querySelector("#eleve-id").value = eleve.id;
                    document.querySelector("#eleve-nom").value = eleve.nom;
                    document.querySelector("#eleve-prenom").value = eleve.prenom;
                    document.querySelector("#eleve-email").value = eleve.email || "";
                    document.querySelector("#eleve-telephone").value = eleve.telephone || "";
                    choisirClasse(eleve.classe || "");
                    document.querySelector("#eleve-mode").value = eleve.mode || "presentiel";
                    document.querySelector("#eleve-statut").value = eleve.statut || "actif";

                    modalTitle.textContent = "Modifier un élève";

                    eleveModal.classList.add("active");

                });

            });

            document.querySelectorAll("#eleves-grid .btn-delete").forEach(function (btn) {

                btn.addEventListener("click", async function () {

                    const id = btn.dataset.id;

                    if (!confirm("Voulez-vous vraiment supprimer cet élève ?")) {
                        return;
                    }

                    const { error } = await window.supabaseClient
                        .from("eleves")
                        .delete()
                        .eq("id", id);

                    if (error) {
                        console.error("Erreur suppression:", error);
                        showToast("Erreur : " + error.message, "error");
                        return;
                    }

                    console.log("Élève supprimé:", id);
                    showToast("Élève supprimé !", "success");

                    loadEleves();

                });

            });

        }


        setTimeout(function () {

            if (currentUserRole !== "admin" && btnAddEleve) {
                btnAddEleve.style.display = "none";
            }

        }, 500);


        if (btnAddEleve) {

            btnAddEleve.addEventListener("click", function () {

                eleveForm.reset();
                document.querySelector("#eleve-id").value = "";
                document.querySelector("#eleve-mode").value = modeEleves ? modeEleves() : "presentiel";

                modalTitle.textContent = "Ajouter un élève";

                eleveModal.classList.add("active");

            });

        }


        function closeModal() {
            eleveModal.classList.remove("active");
            eleveForm.reset();
            document.querySelector("#eleve-id").value = "";
        }

        if (modalClose) {
            modalClose.addEventListener("click", closeModal);
        }

        if (modalCancel) {
            modalCancel.addEventListener("click", closeModal);
        }

        eleveModal.addEventListener("click", function (event) {
            if (event.target === eleveModal) {
                closeModal();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && eleveModal.classList.contains("active")) {
                closeModal();
            }
        });


        eleveForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const id = document.querySelector("#eleve-id").value;

            const data = {
                nom: document.querySelector("#eleve-nom").value.trim(),
                prenom: document.querySelector("#eleve-prenom").value.trim(),
                email: document.querySelector("#eleve-email").value.trim(),
                telephone: document.querySelector("#eleve-telephone").value.trim(),
                classe: document.querySelector("#eleve-classe").value,
                mode: document.querySelector("#eleve-mode").value,
                statut: document.querySelector("#eleve-statut").value
            };

            if (!data.prenom) {
                showToast("Veuillez remplir le prénom.", "warning");
                return;
            }

            if (id) {

                const { error } = await window.supabaseClient
                    .from("eleves")
                    .update(data)
                    .eq("id", id);

                if (error) {
                    console.error("Erreur modification:", error);
                    showToast("Erreur : " + error.message, "error");
                    return;
                }

                console.log("Élève modifié:", id);
                showToast("Élève modifié !", "success");

            } else {

                const { error } = await window.supabaseClient
                    .from("eleves")
                    .insert([data]);

                if (error) {
                    console.error("Erreur ajout:", error);
                    showToast("Erreur : " + error.message, "error");
                    return;
                }

                console.log("Élève ajouté");
                showToast("Élève ajouté !", "success");

            }

            closeModal();
            loadEleves();

        });


        const eleveClasseSelect = document.querySelector("#eleve-classe");

        // Sélectionne une classe, en l'ajoutant à la liste si elle n'y est pas
        function choisirClasse(classe) {

            if (classe && !Array.from(eleveClasseSelect.options).some(function (o) { return o.value === classe; })) {
                const option = document.createElement("option");
                option.value = classe;
                option.textContent = classe;
                eleveClasseSelect.appendChild(option);
            }

            eleveClasseSelect.value = classe;

        }

        function loadClassesEleve() {

            if (!window.supabaseClient) {
                setTimeout(loadClassesEleve, 200);
                return;
            }

            window.supabaseClient
                .from("classes")
                .select("nom")
                .then(function (result) {

                    (result.data || []).map(function (c) { return c.nom; }).sort(trierClasses).forEach(function (nom) {
                        const option = document.createElement("option");
                        option.value = nom;
                        option.textContent = nom;
                        eleveClasseSelect.appendChild(option);
                    });

                });

        }

        loadClassesEleve();

        modeEleves = setupModeTabs(afficherEleves);

        loadEleves();

    }


    // =================================================
    // 10. PARENTS — AFFICHER + AJOUTER + MODIFIER + SUPPRIMER
    // =================================================

    const parentsGrid = document.querySelector("#parents-grid");
    const parentModal = document.querySelector("#parent-modal");
    const parentForm = document.querySelector("#parent-form");
    const parentModalTitle = document.querySelector("#parent-modal-title");
    const btnAddParent = document.querySelector("#btn-add-parent");
    const parentModalClose = document.querySelector("#parent-modal-close");
    const parentModalCancel = document.querySelector("#parent-modal-cancel");
    const parentEnfantSelect = document.querySelector("#parent-enfant");

    if (parentsGrid) {

        let parentsCharges = null;
        let modeParents = null;

        function carteParent(parent) {

            const enfants = (parent.eleves || []).map(function (e) {
                return `<bdi>${e.prenom} ${e.nom}</bdi>${e.classe ? " (" + e.classe + ")" : ""}`;
            }).join(", ");

            return `
                <article class="student-dashboard-card">
                    <div class="dashboard-card-icon">
                        👪
                    </div>
                    <h3 dir="auto">
                        ${parent.prenom} ${parent.nom}${parent.lien_parente ? " (" + parent.lien_parente + ")" : ""}
                    </h3>
                    <p>
                        <strong>Enfant(s) :</strong> ${enfants || "—"}
                        <br>
                        <strong>Téléphone :</strong> ${parent.telephone || "—"}
                        <br>
                        <strong>Email :</strong> ${parent.email || "—"}
                        <br>
                        <strong>Compte sur le site :</strong> ${parent.user_id ? "✅ Inscrit" : "⏳ Pas encore inscrit"}
                    </p>
                    <div class="card-actions">
                        <button
                            type="button"
                            class="btn-edit"
                            data-id="${parent.id}">
                            ✏️ Modifier
                        </button>
                        <button
                            type="button"
                            class="btn-delete"
                            data-id="${parent.id}">
                            🗑️ Supprimer
                        </button>
                    </div>
                </article>
            `;

        }


        function afficherParents() {

            if (!parentsCharges) {
                parentsGrid.innerHTML = "<p>Chargement...</p>";
                return;
            }

            const mode = modeParents ? modeParents() : "presentiel";

            // Présentiel : parent d'au moins un élève du cours en salle
            const estPresentiel = function (parent) {
                return (parent.eleves || []).some(function (e) { return e.mode !== "distance"; });
            };

            const presentiels = parentsCharges.filter(estPresentiel);
            const enLigne = parentsCharges.filter(function (p) { return !estPresentiel(p); });

            document.querySelector("#parents-count-presentiel").textContent = `(${presentiels.length})`;
            document.querySelector("#parents-count-distance").textContent = `(${enLigne.length})`;

            const liste = mode === "distance" ? enLigne : presentiels;

            if (liste.length === 0) {
                parentsGrid.innerHTML = mode === "distance"
                    ? "<p>Aucun parent inscrit en ligne pour le moment.</p>"
                    : "<p>Aucun parent en présentiel.</p>";
                return;
            }

            const classeDe = function (parent) {
                const enfant = (parent.eleves || []).find(function (e) { return e.mode !== "distance"; }) || (parent.eleves || [])[0];
                return enfant ? enfant.classe : "";
            };

            const groupes = grouperParClasse(liste, mode === "distance"
                ? function () { return "Inscrits en ligne"; }
                : classeDe);

            parentsGrid.innerHTML = groupes.map(function (groupe) {
                return `
                    <h2 class="classe-titre"><bdi>${groupe.classe}</bdi> <span>${groupe.items.length} parent(s)</span></h2>
                    <div class="student-dashboard-grid">${groupe.items.map(carteParent).join("")}</div>
                `;
            }).join("");

            attachParentEvents(parentsCharges);

        }


        function loadParents() {

            if (!window.supabaseClient) {
                setTimeout(loadParents, 200);
                return;
            }

            window.supabaseClient
                .from("parents")
                .select("*, eleves(prenom, nom, classe, mode)")
                .order("prenom", { ascending: true })
                .then(function (result) {

                    if (result.error) {
                        console.error("Erreur chargement parents:", result.error);
                        return;
                    }

                    parentsCharges = result.data;
                    afficherParents();

                });

        }


        function loadEnfantsSelect() {

            if (!window.supabaseClient) {
                setTimeout(loadEnfantsSelect, 200);
                return;
            }

            window.supabaseClient
                .from("eleves")
                .select("id, nom, prenom")
                .order("prenom", { ascending: true })
                .then(function (result) {

                    if (result.error) {
                        console.error("Erreur chargement élèves:", result.error);
                        return;
                    }

                    const eleves = result.data;

                    parentEnfantSelect.innerHTML = '<option value="">-- Aucun --</option>';

                    eleves.forEach(function (eleve) {

                        const option = document.createElement("option");
                        option.value = eleve.id;
                        option.textContent = `${eleve.prenom} ${eleve.nom}`;

                        parentEnfantSelect.appendChild(option);

                    });

                });

        }


        function attachParentEvents(parents) {

            document.querySelectorAll("#parents-grid .btn-edit").forEach(function (btn) {

                btn.addEventListener("click", function () {

                    const id = btn.dataset.id;
                    const parent = parents.find(function (p) {
                        return p.id == id;
                    });

                    if (!parent) return;

                    document.querySelector("#parent-id").value = parent.id;
                    document.querySelector("#parent-nom").value = parent.nom;
                    document.querySelector("#parent-prenom").value = parent.prenom;
                    document.querySelector("#parent-email").value = parent.email || "";
                    document.querySelector("#parent-telephone").value = parent.telephone || "";
                    document.querySelector("#parent-statut").value = parent.statut || "actif";

                    parentModalTitle.textContent = "Modifier un parent";

                    parentModal.classList.add("active");

                });

            });

            document.querySelectorAll("#parents-grid .btn-delete").forEach(function (btn) {

                btn.addEventListener("click", async function () {

                    const id = btn.dataset.id;

                    if (!confirm("Voulez-vous vraiment supprimer ce parent ?")) {
                        return;
                    }

                    const { error } = await window.supabaseClient
                        .from("parents")
                        .delete()
                        .eq("id", id);

                    if (error) {
                        console.error("Erreur suppression:", error);
                        showToast("Erreur : " + error.message, "error");
                        return;
                    }

                    console.log("Parent supprimé:", id);
                    showToast("Parent supprimé !", "success");

                    loadParents();

                });

            });

        }


        if (btnAddParent) {

            btnAddParent.addEventListener("click", function () {

                parentForm.reset();
                document.querySelector("#parent-id").value = "";

                parentModalTitle.textContent = "Ajouter un parent";

                parentModal.classList.add("active");

            });

        }


        function closeParentModal() {
            parentModal.classList.remove("active");
            parentForm.reset();
            document.querySelector("#parent-id").value = "";
        }

        if (parentModalClose) {
            parentModalClose.addEventListener("click", closeParentModal);
        }

        if (parentModalCancel) {
            parentModalCancel.addEventListener("click", closeParentModal);
        }

        parentModal.addEventListener("click", function (event) {
            if (event.target === parentModal) {
                closeParentModal();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && parentModal.classList.contains("active")) {
                closeParentModal();
            }
        });


        parentForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const id = document.querySelector("#parent-id").value;
            const enfantId = document.querySelector("#parent-enfant").value;

            const data = {
                nom: document.querySelector("#parent-nom").value.trim(),
                prenom: document.querySelector("#parent-prenom").value.trim(),
                email: document.querySelector("#parent-email").value.trim(),
                telephone: document.querySelector("#parent-telephone").value.trim(),
                statut: document.querySelector("#parent-statut").value
            };

            if (!data.nom || !data.prenom) {
                showToast("Veuillez remplir le nom et le prénom.", "warning");
                return;
            }

            if (id) {

                const { error } = await window.supabaseClient
                    .from("parents")
                    .update(data)
                    .eq("id", id);

                if (error) {
                    console.error("Erreur modification:", error);
                    showToast("Erreur : " + error.message, "error");
                    return;
                }

                if (enfantId) {

                    const { error: errEnfant } = await window.supabaseClient
                        .from("eleves")
                        .update({ parent_id: id })
                        .eq("id", enfantId);

                    if (errEnfant) {
                        console.error("Erreur liaison enfant:", errEnfant);
                    }

                }

                console.log("Parent modifié:", id);
                showToast("Parent modifié !", "success");

            } else {

                const { data: newParent, error } = await window.supabaseClient
                    .from("parents")
                    .insert([data])
                    .select();

                if (error) {
                    console.error("Erreur ajout:", error);
                    showToast("Erreur : " + error.message, "error");
                    return;
                }

                if (enfantId && newParent && newParent[0]) {

                    const { error: errEnfant } = await window.supabaseClient
                        .from("eleves")
                        .update({ parent_id: newParent[0].id })
                        .eq("id", enfantId);

                    if (errEnfant) {
                        console.error("Erreur liaison enfant:", errEnfant);
                    }

                }

                console.log("Parent ajouté");
                showToast("Parent ajouté !", "success");

            }

            closeParentModal();
            loadParents();

        });


        modeParents = setupModeTabs(afficherParents);

        loadParents();
        loadEnfantsSelect();

    }


    // =================================================
    // 11. CLASSES — AFFICHER + AJOUTER + MODIFIER + SUPPRIMER
    // =================================================

    const classesGrid = document.querySelector("#classes-grid");
    const classeModal = document.querySelector("#classe-modal");
    const classeForm = document.querySelector("#classe-form");
    const classeModalTitle = document.querySelector("#classe-modal-title");
    const btnAddClasse = document.querySelector("#btn-add-classe");
    const classeModalClose = document.querySelector("#classe-modal-close");
    const classeModalCancel = document.querySelector("#classe-modal-cancel");

    if (classesGrid) {

        function loadClasses() {

            if (!window.supabaseClient) {
                setTimeout(loadClasses, 200);
                return;
            }

            window.supabaseClient
                .from("classes")
                .select("*")
                .order("created_at", { ascending: false })
                .then(function (result) {

                    if (result.error) {
                        console.error("Erreur chargement classes:", result.error);
                        return;
                    }

                    const classes = result.data;

                    console.log("Classes chargées:", classes.length);

                    if (classes.length === 0) {
                        classesGrid.innerHTML = "<p>Aucune classe enregistrée.</p>";
                        return;
                    }

                    classesGrid.innerHTML = classes.map(function (classe) {

                        return `
                            <article class="student-dashboard-card">
                                <div class="dashboard-card-icon">
                                    🏫
                                </div>
                                <h3>
                                    ${classe.nom}
                                </h3>
                                <p>
                                    <strong>Niveau :</strong> ${classe.niveau || "—"}
                                    <br>
                                    <strong>Groupe :</strong> ${classe.groupe || "—"}
                                    <br>
                                    <strong>Enseignant :</strong> ${classe.enseignant || "—"}
                                    <br>
                                    <strong>Statut :</strong> ${classe.statut || "—"}
                                </p>
                                <div class="card-actions">
                                    <button
                                        type="button"
                                        class="btn-edit"
                                        data-id="${classe.id}">
                                        ✏️ Modifier
                                    </button>
                                    <button
                                        type="button"
                                        class="btn-delete"
                                        data-id="${classe.id}">
                                        🗑️ Supprimer
                                    </button>
                                </div>
                            </article>
                        `;

                    }).join("");

                    attachClasseEvents(classes);

                });

        }


        function attachClasseEvents(classes) {

            document.querySelectorAll("#classes-grid .btn-edit").forEach(function (btn) {

                btn.addEventListener("click", function () {

                    const id = btn.dataset.id;
                    const classe = classes.find(function (c) {
                        return c.id == id;
                    });

                    if (!classe) return;

                    document.querySelector("#classe-id").value = classe.id;
                    document.querySelector("#classe-nom").value = classe.nom;
                    document.querySelector("#classe-niveau").value = classe.niveau || "";
                    document.querySelector("#classe-groupe").value = classe.groupe || "";
                    document.querySelector("#classe-enseignant").value = classe.enseignant || "";
                    document.querySelector("#classe-statut").value = classe.statut || "active";

                    classeModalTitle.textContent = "Modifier une classe";

                    classeModal.classList.add("active");

                });

            });

            document.querySelectorAll("#classes-grid .btn-delete").forEach(function (btn) {

                btn.addEventListener("click", async function () {

                    const id = btn.dataset.id;

                    if (!confirm("Voulez-vous vraiment supprimer cette classe ?")) {
                        return;
                    }

                    const { error } = await window.supabaseClient
                        .from("classes")
                        .delete()
                        .eq("id", id);

                    if (error) {
                        console.error("Erreur suppression:", error);
                        showToast("Erreur : " + error.message, "error");
                        return;
                    }

                    console.log("Classe supprimée:", id);
                    showToast("Classe supprimée !", "success");

                    loadClasses();

                });

            });

        }


        if (btnAddClasse) {

            btnAddClasse.addEventListener("click", function () {

                classeForm.reset();
                document.querySelector("#classe-id").value = "";

                classeModalTitle.textContent = "Ajouter une classe";

                classeModal.classList.add("active");

            });

        }


        function closeClasseModal() {
            classeModal.classList.remove("active");
            classeForm.reset();
            document.querySelector("#classe-id").value = "";
        }

        if (classeModalClose) {
            classeModalClose.addEventListener("click", closeClasseModal);
        }

        if (classeModalCancel) {
            classeModalCancel.addEventListener("click", closeClasseModal);
        }

        classeModal.addEventListener("click", function (event) {
            if (event.target === classeModal) {
                closeClasseModal();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && classeModal.classList.contains("active")) {
                closeClasseModal();
            }
        });


        classeForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const id = document.querySelector("#classe-id").value;

            const data = {
                nom: document.querySelector("#classe-nom").value.trim(),
                niveau: document.querySelector("#classe-niveau").value.trim(),
                groupe: document.querySelector("#classe-groupe").value.trim(),
                enseignant: document.querySelector("#classe-enseignant").value.trim(),
                statut: document.querySelector("#classe-statut").value
            };

            if (!data.nom) {
                showToast("Veuillez remplir le nom de la classe.", "warning");
                return;
            }

            if (id) {

                const { error } = await window.supabaseClient
                    .from("classes")
                    .update(data)
                    .eq("id", id);

                if (error) {
                    console.error("Erreur modification:", error);
                    showToast("Erreur : " + error.message, "error");
                    return;
                }

                console.log("Classe modifiée:", id);
                showToast("Classe modifiée !", "success");

            } else {

                const { error } = await window.supabaseClient
                    .from("classes")
                    .insert([data]);

                if (error) {
                    console.error("Erreur ajout:", error);
                    showToast("Erreur : " + error.message, "error");
                    return;
                }

                console.log("Classe ajoutée");
                showToast("Classe ajoutée !", "success");

            }

            closeClasseModal();
            loadClasses();

        });


        loadClasses();

    }


    // =================================================
    // 14. SÉANCES — AFFICHER + AJOUTER + MODIFIER + SUPPRIMER
    //     (seances-admin.html, avec lien de cours en ligne)
    // =================================================

    const seancesGrid = document.querySelector("#seances-grid");
    const seanceModal = document.querySelector("#seance-modal");
    const seanceForm = document.querySelector("#seance-form");
    const seanceModalTitle = document.querySelector("#seance-modal-title");
    const btnAddSeance = document.querySelector("#btn-add-seance");
    const seanceModalClose = document.querySelector("#seance-modal-close");
    const seanceModalCancel = document.querySelector("#seance-modal-cancel");
    const seanceClasseSelect = document.querySelector("#seance-classe");
    const btnGenererLien = document.querySelector("#btn-generer-lien");

    if (seancesGrid) {

        function loadSeances() {

            if (!window.supabaseClient) {
                setTimeout(loadSeances, 200);
                return;
            }

            window.supabaseClient
                .from("seances")
                .select("*")
                .order("date_seance", { ascending: true })
                .then(function (result) {

                    if (result.error) {
                        console.error("Erreur chargement séances:", result.error);
                        return;
                    }

                    const seances = result.data;

                    console.log("Séances chargées:", seances.length);

                    updateSeancesStats(seances);

                    if (seances.length === 0) {
                        seancesGrid.innerHTML = "<p>Aucune séance planifiée.</p>";
                        return;
                    }

                    seancesGrid.innerHTML = seances.map(function (seance) {

                        const lien = seance.lien_visio
                            ? `<a href="${seance.lien_visio}" target="_blank" rel="noopener" class="button button-primary seance-join">
                                   🎥 Démarrer le cours
                               </a>`
                            : "";

                        return `
                            <article class="student-dashboard-card">
                                <div class="dashboard-card-icon">
                                    ${seance.lien_visio ? "🎥" : "📅"}
                                </div>
                                <div>
                                    <h3>
                                        ${seance.matiere}
                                    </h3>
                                    <p>
                                        <strong>Classe :</strong> ${seance.classe || "—"}
                                        <br>
                                        <strong>Date :</strong> ${seance.date_seance || "—"}
                                        <br>
                                        <strong>Heure :</strong> ${seance.heure_debut || "—"} – ${seance.heure_fin || "—"}
                                        <br>
                                        <strong>Salle :</strong> ${seance.salle || "—"}
                                        <br>
                                        <strong>Statut :</strong> ${seance.statut || "—"}
                                    </p>
                                    ${lien}
                                </div>
                                <div class="card-actions">
                                    <button
                                        type="button"
                                        class="btn-edit"
                                        data-id="${seance.id}">
                                        ✏️ Modifier
                                    </button>
                                    <button
                                        type="button"
                                        class="btn-delete"
                                        data-id="${seance.id}">
                                        🗑️ Supprimer
                                    </button>
                                </div>
                            </article>
                        `;

                    }).join("");

                    attachSeanceEvents(seances);

                });

        }


        function updateSeancesStats(seances) {

            const today = new Date().toISOString().slice(0, 10);

            const prevues = document.querySelector("#stats-seances-prevues");
            const terminees = document.querySelector("#stats-seances-terminees");
            const aVenir = document.querySelector("#stats-seances-a-venir");

            if (prevues) {
                prevues.textContent = seances.length;
            }

            if (terminees) {
                terminees.textContent = seances.filter(function (s) {
                    return s.statut === "terminée";
                }).length;
            }

            if (aVenir) {
                aVenir.textContent = seances.filter(function (s) {
                    return s.date_seance && s.date_seance >= today && s.statut !== "annulée";
                }).length;
            }

        }


        function loadClassesSelect() {

            if (!seanceClasseSelect) {
                return;
            }

            if (!window.supabaseClient) {
                setTimeout(loadClassesSelect, 200);
                return;
            }

            window.supabaseClient
                .from("classes")
                .select("nom")
                .order("nom", { ascending: true })
                .then(function (result) {

                    if (result.error) {
                        console.error("Erreur chargement classes:", result.error);
                        return;
                    }

                    result.data.forEach(function (classe) {

                        const option = document.createElement("option");
                        option.value = classe.nom;
                        option.textContent = classe.nom;
                        seanceClasseSelect.appendChild(option);

                    });

                });

        }


        // Lien Jitsi Meet : gratuit, sans compte pour les élèves
        function genererLienJitsi() {

            const random = Math.random().toString(36).slice(2, 10);

            return "https://meet.jit.si/Profaycel-" + random;

        }


        function attachSeanceEvents(seances) {

            document.querySelectorAll("#seances-grid .btn-edit").forEach(function (btn) {

                btn.addEventListener("click", function () {

                    const id = btn.dataset.id;

                    const seance = seances.find(function (s) {
                        return String(s.id) === String(id);
                    });

                    if (!seance) {
                        return;
                    }

                    document.querySelector("#seance-id").value = seance.id;
                    document.querySelector("#seance-matiere").value = seance.matiere || "";
                    seanceClasseSelect.value = seance.classe || "";
                    document.querySelector("#seance-date").value = seance.date_seance || "";
                    document.querySelector("#seance-debut").value = seance.heure_debut || "";
                    document.querySelector("#seance-fin").value = seance.heure_fin || "";
                    document.querySelector("#seance-salle").value = seance.salle || "";
                    document.querySelector("#seance-lien").value = seance.lien_visio || "";
                    document.querySelector("#seance-statut").value = seance.statut || "prévue";

                    seanceModalTitle.textContent = "Modifier une séance";

                    seanceModal.classList.add("active");

                });

            });

            document.querySelectorAll("#seances-grid .btn-delete").forEach(function (btn) {

                btn.addEventListener("click", async function () {

                    const id = btn.dataset.id;

                    if (!confirm("Voulez-vous vraiment supprimer cette séance ?")) {
                        return;
                    }

                    const { error } = await window.supabaseClient
                        .from("seances")
                        .delete()
                        .eq("id", id);

                    if (error) {
                        console.error("Erreur suppression:", error);
                        showToast("Erreur : " + error.message, "error");
                        return;
                    }

                    console.log("Séance supprimée:", id);
                    showToast("Séance supprimée !", "success");

                    loadSeances();

                });

            });

        }


        if (btnAddSeance) {

            btnAddSeance.addEventListener("click", function () {

                seanceForm.reset();
                document.querySelector("#seance-id").value = "";
                document.querySelector("#seance-salle").value = "En ligne";
                document.querySelector("#seance-lien").value = genererLienJitsi();

                seanceModalTitle.textContent = "Nouvelle séance";

                seanceModal.classList.add("active");

            });

        }


        if (btnGenererLien) {

            btnGenererLien.addEventListener("click", function () {
                document.querySelector("#seance-lien").value = genererLienJitsi();
            });

        }


        function closeSeanceModal() {
            seanceModal.classList.remove("active");
            seanceForm.reset();
            document.querySelector("#seance-id").value = "";
        }

        if (seanceModal) {

            if (seanceModalClose) {
                seanceModalClose.addEventListener("click", closeSeanceModal);
            }

            if (seanceModalCancel) {
                seanceModalCancel.addEventListener("click", closeSeanceModal);
            }

            seanceModal.addEventListener("click", function (event) {
                if (event.target === seanceModal) {
                    closeSeanceModal();
                }
            });

            document.addEventListener("keydown", function (event) {
                if (event.key === "Escape" && seanceModal.classList.contains("active")) {
                    closeSeanceModal();
                }
            });


            seanceForm.addEventListener("submit", async function (event) {

                event.preventDefault();

                const id = document.querySelector("#seance-id").value;

                const data = {
                    matiere: document.querySelector("#seance-matiere").value.trim(),
                    classe: seanceClasseSelect.value,
                    date_seance: document.querySelector("#seance-date").value || null,
                    heure_debut: document.querySelector("#seance-debut").value || null,
                    heure_fin: document.querySelector("#seance-fin").value || null,
                    salle: document.querySelector("#seance-salle").value.trim(),
                    lien_visio: document.querySelector("#seance-lien").value.trim() || null,
                    statut: document.querySelector("#seance-statut").value
                };

                if (!data.matiere || !data.date_seance) {
                    showToast("Veuillez remplir la matière et la date.", "warning");
                    return;
                }

                let error;

                if (id) {

                    ({ error } = await window.supabaseClient
                        .from("seances")
                        .update(data)
                        .eq("id", id));

                } else {

                    ({ error } = await window.supabaseClient
                        .from("seances")
                        .insert([data]));

                }

                if (error) {
                    console.error("Erreur enregistrement séance:", error);
                    showToast("Erreur : " + error.message, "error");
                    return;
                }

                showToast(id ? "Séance modifiée !" : "Séance ajoutée !", "success");

                closeSeanceModal();
                loadSeances();

            });

            loadClassesSelect();

        }

        loadSeances();

    }


    // =================================================
    // 15. AFFICHER LES SÉANCES (presence-admin.html)
    // =================================================

    const presenceGrid = document.querySelector("#presence-grid");
    const appelModal = document.querySelector("#appel-modal");
    const appelForm = document.querySelector("#appel-form");
    const appelListe = document.querySelector("#appel-liste");

    if (presenceGrid) {

        let seanceAppel = null;

        function loadPresenceSeances() {

            if (!window.supabaseClient) {
                setTimeout(loadPresenceSeances, 200);
                return;
            }

            window.supabaseClient
                .from("seances")
                .select("*, presences(present)")
                .order("date_seance", { ascending: false })
                .then(function (result) {

                    if (result.error) {
                        console.error("Erreur chargement séances:", result.error);
                        return;
                    }

                    const seances = result.data;

                    console.log("Séances (présence) chargées:", seances.length);

                    if (seances.length === 0) {
                        presenceGrid.innerHTML = "<p>Aucune séance disponible.</p>";
                        return;
                    }

                    presenceGrid.innerHTML = seances.map(function (seance) {

                        const appel = seance.presences || [];
                        const presents = appel.filter(function (p) { return p.present; }).length;

                        const resume = appel.length > 0
                            ? `✅ ${presents} présent(s) · ❌ ${appel.length - presents} absent(s)`
                            : "Appel pas encore fait";

                        return `
                            <article class="student-dashboard-card">
                                <div class="dashboard-card-icon">
                                    📅
                                </div>
                                <div>
                                    <h3 dir="auto">
                                        ${seance.matiere} — ${seance.classe || "Toutes les classes"}
                                    </h3>
                                    <p>
                                        <strong>Date :</strong> ${seance.date_seance || "—"}
                                    </p>
                                    <p>
                                        <strong>Heure :</strong> ${seance.heure_debut ? seance.heure_debut.slice(0, 5) : "—"} – ${seance.heure_fin ? seance.heure_fin.slice(0, 5) : "—"}
                                    </p>
                                    <p>
                                        <strong>Appel :</strong> ${resume}
                                    </p>
                                    <button
                                        type="button"
                                        class="button button-primary seance-join btn-appel"
                                        data-id="${seance.id}">
                                        ${appel.length > 0 ? "✏️ Modifier l'appel" : "📋 Faire l'appel"}
                                    </button>
                                </div>
                            </article>
                        `;

                    }).join("");

                    document.querySelectorAll(".btn-appel").forEach(function (btn) {

                        btn.addEventListener("click", function () {

                            const seance = seances.find(function (s) {
                                return String(s.id) === btn.dataset.id;
                            });

                            if (seance) {
                                ouvrirAppel(seance);
                            }

                        });

                    });

                });

        }


        async function ouvrirAppel(seance) {

            seanceAppel = seance;

            document.querySelector("#appel-title").textContent =
                `Appel — ${seance.matiere} (${seance.date_seance || ""})`;

            appelListe.innerHTML = "<p>Chargement...</p>";
            appelModal.classList.add("active");

            let query = window.supabaseClient
                .from("eleves")
                .select("id, prenom, nom, classe")
                .eq("statut", "actif")
                .order("classe", { ascending: true })
                .order("prenom", { ascending: true });

            if (seance.classe) {
                query = query.eq("classe", seance.classe);
            }

            const [{ data: eleves, error }, { data: appel }] = await Promise.all([
                query,
                window.supabaseClient
                    .from("presences")
                    .select("eleve_id, present")
                    .eq("seance_id", seance.id)
            ]);

            if (error) {
                console.error("Erreur chargement élèves:", error);
                appelListe.innerHTML = "<p>Impossible de charger les élèves.</p>";
                return;
            }

            if (!eleves || eleves.length === 0) {
                appelListe.innerHTML = "<p>Aucun élève dans cette classe.</p>";
                return;
            }

            const dejaFait = {};

            (appel || []).forEach(function (p) {
                dejaFait[p.eleve_id] = p.present;
            });

            appelListe.innerHTML = eleves.map(function (eleve) {

                const coche = dejaFait[eleve.id] === undefined ? true : dejaFait[eleve.id];

                return `
                    <label class="appel-eleve">
                        <input type="checkbox" value="${eleve.id}" ${coche ? "checked" : ""}>
                        <span dir="auto">${eleve.prenom} ${eleve.nom}</span>
                        <small>${seance.classe ? "" : eleve.classe || ""}</small>
                    </label>
                `;

            }).join("");

        }


        function fermerAppel() {
            appelModal.classList.remove("active");
            seanceAppel = null;
        }

        if (appelModal) {

            document.querySelector("#appel-close").addEventListener("click", fermerAppel);
            document.querySelector("#appel-cancel").addEventListener("click", fermerAppel);

            appelModal.addEventListener("click", function (event) {
                if (event.target === appelModal) {
                    fermerAppel();
                }
            });

            appelForm.addEventListener("submit", async function (event) {

                event.preventDefault();

                if (!seanceAppel) {
                    return;
                }

                const lignes = Array.from(appelListe.querySelectorAll("input[type=checkbox]")).map(function (box) {
                    return {
                        seance_id: seanceAppel.id,
                        eleve_id: Number(box.value),
                        present: box.checked
                    };
                });

                if (lignes.length === 0) {
                    fermerAppel();
                    return;
                }

                const { error } = await window.supabaseClient
                    .from("presences")
                    .upsert(lignes, { onConflict: "seance_id,eleve_id" });

                if (error) {
                    console.error("Erreur appel:", error);
                    showToast("Erreur : " + error.message, "error");
                    return;
                }

                showToast("Appel enregistré !", "success");
                fermerAppel();
                loadPresenceSeances();

            });

        }

        loadPresenceSeances();

    }


    // =================================================
    // 17. DOCUMENTS — ENVOYER, PUBLIER / MASQUER, SUPPRIMER (documents-admin.html)
    // =================================================

    const docForm = document.querySelector("#doc-form");

    if (docForm) {

        const BUCKET = "documents";
        const inputFichiers = document.querySelector("#doc-fichiers");
        const apercu = document.querySelector("#doc-apercu");
        const inputLien = document.querySelector("#doc-lien");
        const inputTitre = document.querySelector("#doc-titre");
        const progression = document.querySelector("#doc-progression");
        const boutonEnvoyer = document.querySelector("#doc-envoyer");
        const liste = document.querySelector("#documents-liste");

        let fichiersChoisis = [];
        let titreModifie = false;
        let documentsCharges = [];


        // --- Groupes de boutons « choix » (niveau, trimestre, matière, type, filtre) ---

        function activerChoix(groupe, onChange) {

            groupe.addEventListener("click", function (event) {

                const bouton = event.target.closest("button[data-v]");

                if (!bouton) {
                    return;
                }

                groupe.querySelectorAll("button").forEach(function (b) {
                    b.classList.toggle("on", b === bouton);
                });

                groupe.dataset.valeur = bouton.dataset.v;

                if (onChange) {
                    onChange(bouton.dataset.v);
                }

            });

        }

        function valeur(id) {
            return document.querySelector(id).dataset.valeur;
        }

        const inputNumero = document.querySelector("#doc-numero");
        let numeroModifie = false;

        function memeRubrique(d) {
            return (d.classe || "") === valeur("#doc-niveau") &&
                String(d.trimestre || "") === valeur("#doc-trimestre") &&
                (d.matiere || "") === valeur("#doc-matiere");
        }

        // Série : numéro suivant. Correction : la dernière série sans correction.
        function numeroParDefaut() {

            const type = valeur("#doc-type");
            const docs = documentsCharges.filter(memeRubrique);
            const numeros = function (t) {
                return docs.filter(function (d) { return d.type_fichier === t && d.numero; })
                    .map(function (d) { return d.numero; });
            };

            if (type === "Correction") {
                const corriges = numeros("Correction");
                const series = numeros("Série d'exercices").filter(function (n) { return !corriges.includes(n); });
                if (series.length > 0) {
                    return Math.min.apply(null, series);
                }
                return Math.max.apply(null, [0].concat(numeros("Série d'exercices"))) || 1;
            }

            return Math.max.apply(null, [0].concat(numeros(type))) + 1;

        }

        function titreParDefaut() {

            const n = inputNumero.value || 1;
            const noms = {
                "Série d'exercices": "Série n°",
                "Correction": "Correction de la série n°",
                "Cours": "Cours n°",
                "Devoir": "Devoir n°"
            };

            return (noms[valeur("#doc-type")] || "Document n°") + n;

        }

        function majTitre() {
            if (!numeroModifie) {
                inputNumero.value = numeroParDefaut();
            }
            if (!titreModifie) {
                inputTitre.value = titreParDefaut();
            }
        }

        function changerNumero(valeurNumero) {
            inputNumero.value = Math.max(1, Math.min(50, valeurNumero || 1));
            numeroModifie = true;
            if (!titreModifie) {
                inputTitre.value = titreParDefaut();
            }
        }

        document.querySelector("#doc-numero-moins").addEventListener("click", function () {
            changerNumero(Number(inputNumero.value) - 1);
        });

        document.querySelector("#doc-numero-plus").addEventListener("click", function () {
            changerNumero(Number(inputNumero.value) + 1);
        });

        inputNumero.addEventListener("input", function () {
            numeroModifie = true;
            if (!titreModifie) {
                inputTitre.value = titreParDefaut();
            }
        });

        inputTitre.addEventListener("input", function () {
            titreModifie = inputTitre.value.trim() !== "";
        });

        ["#doc-niveau", "#doc-trimestre", "#doc-matiere", "#doc-type"].forEach(function (id) {
            activerChoix(document.querySelector(id), function () {
                numeroModifie = false;
                majTitre();
            });
        });

        activerChoix(document.querySelector("#doc-filtre"), afficherDocuments);


        // --- Niveaux : à partir des classes ---

        function chargerNiveaux() {

            if (!window.supabaseClient) {
                setTimeout(chargerNiveaux, 200);
                return;
            }

            window.supabaseClient
                .from("classes")
                .select("nom")
                .then(function (result) {

                    const noms = (result.data || []).map(function (c) { return c.nom; }).sort(trierClasses);
                    const groupe = document.querySelector("#doc-niveau");
                    const filtre = document.querySelector("#doc-filtre");

                    noms.forEach(function (nom, index) {

                        const b = document.createElement("button");
                        b.type = "button";
                        b.dataset.v = nom;
                        b.textContent = nom;
                        groupe.insertBefore(b, groupe.lastElementChild);

                        const f = b.cloneNode(true);
                        filtre.appendChild(f);

                        // le premier niveau est choisi par défaut
                        if (index === 0) {
                            groupe.querySelectorAll("button").forEach(function (x) { x.classList.remove("on"); });
                            b.classList.add("on");
                            groupe.dataset.valeur = nom;
                        }

                    });

                    majTitre();

                });

        }


        // --- Fichiers choisis : aperçu ---

        inputFichiers.addEventListener("change", function () {

            Array.from(inputFichiers.files).forEach(function (f) {
                fichiersChoisis.push(f);
            });

            inputFichiers.value = "";
            afficherApercu();

        });

        function afficherApercu() {

            apercu.innerHTML = "";

            fichiersChoisis.forEach(function (f, index) {

                const item = document.createElement("div");
                item.className = "doc-apercu-item";

                if (f.type.startsWith("image/")) {
                    const img = document.createElement("img");
                    img.src = URL.createObjectURL(f);
                    img.alt = "";
                    item.appendChild(img);
                } else {
                    const ic = document.createElement("span");
                    ic.className = "doc-apercu-pdf";
                    ic.textContent = "PDF";
                    item.appendChild(ic);
                }

                const num = document.createElement("small");
                num.textContent = fichiersChoisis.length > 1 ? `Page ${index + 1}` : f.name;
                item.appendChild(num);

                const retirer = document.createElement("button");
                retirer.type = "button";
                retirer.className = "doc-apercu-retirer";
                retirer.setAttribute("aria-label", "Retirer");
                retirer.textContent = "✕";
                retirer.addEventListener("click", function () {
                    fichiersChoisis.splice(index, 1);
                    afficherApercu();
                });
                item.appendChild(retirer);

                apercu.appendChild(item);

            });

        }

        document.querySelector("#doc-lien-toggle").addEventListener("click", function () {
            inputLien.hidden = !inputLien.hidden;
            if (!inputLien.hidden) {
                inputLien.focus();
            }
        });


        // --- Photos : réduites avant l'envoi (plus rapide, moins de place) ---

        function reduireImage(fichier) {

            return new Promise(function (resolve) {

                if (!fichier.type.startsWith("image/") || fichier.type === "image/gif") {
                    resolve(fichier);
                    return;
                }

                const img = new Image();

                img.onload = function () {

                    const max = 2000;
                    const ratio = Math.min(1, max / Math.max(img.width, img.height));

                    if (ratio === 1 && fichier.size < 1500000) {
                        resolve(fichier);
                        return;
                    }

                    const canvas = document.createElement("canvas");
                    canvas.width = Math.round(img.width * ratio);
                    canvas.height = Math.round(img.height * ratio);
                    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);

                    canvas.toBlob(function (blob) {
                        resolve(blob ? new File([blob], fichier.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }) : fichier);
                    }, "image/jpeg", 0.85);

                };

                // HEIC et autres formats illisibles : envoyés tels quels
                img.onerror = function () {
                    resolve(fichier);
                };

                img.src = URL.createObjectURL(fichier);

            });

        }

        function nomFichier(fichier, index) {

            const ext = (fichier.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
            const hasard = Math.random().toString(36).slice(2, 8);

            return `${Date.now()}-${hasard}-${index + 1}.${ext}`;

        }


        // --- Publier ---

        docForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const lien = inputLien.value.trim();

            if (fichiersChoisis.length === 0 && !lien) {
                showToast("Choisissez une photo, un PDF ou collez un lien.", "warning");
                return;
            }

            const titre = inputTitre.value.trim() || titreParDefaut();

            boutonEnvoyer.disabled = true;
            progression.hidden = false;

            const fichiers = [];

            try {

                for (let i = 0; i < fichiersChoisis.length; i++) {

                    progression.textContent = `Envoi ${i + 1} / ${fichiersChoisis.length}…`;

                    const fichier = await reduireImage(fichiersChoisis[i]);
                    // « 7ème année de base » → « 7eme-annee-de-base »
                    const dossier = (valeur("#doc-niveau") || "tous")
                        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                        .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "tous";
                    const chemin = `${dossier}/${nomFichier(fichier, i)}`;

                    const { error } = await window.supabaseClient.storage
                        .from(BUCKET)
                        .upload(chemin, fichier, { contentType: fichier.type || "application/octet-stream" });

                    if (error) {
                        throw error;
                    }

                    const { data } = window.supabaseClient.storage.from(BUCKET).getPublicUrl(chemin);

                    fichiers.push({ url: data.publicUrl, chemin: chemin, type: fichier.type });

                }

                progression.textContent = "Enregistrement…";

                const { error } = await window.supabaseClient
                    .from("documents")
                    .insert([{
                        nom: titre,
                        type_fichier: valeur("#doc-type"),
                        classe: valeur("#doc-niveau"),
                        niveau: valeur("#doc-niveau"),
                        trimestre: Number(valeur("#doc-trimestre")),
                        numero: Number(inputNumero.value) || null,
                        matiere: valeur("#doc-matiere"),
                        statut: document.querySelector("#doc-visible").checked ? "publie" : "masque",
                        lien: lien || null,
                        fichiers: fichiers
                    }]);

                if (error) {
                    throw error;
                }

                showToast("Document publié ✅", "success");

                fichiersChoisis = [];
                afficherApercu();
                inputLien.value = "";
                inputLien.hidden = true;
                titreModifie = false;
                numeroModifie = false;

                await chargerDocuments();
                majTitre();

            } catch (erreur) {

                console.error("Erreur envoi document:", erreur);
                showToast("Erreur : " + (erreur.message || erreur), "error");

                // ne pas laisser de fichiers orphelins si l'enregistrement échoue
                if (fichiers.length > 0) {
                    await window.supabaseClient.storage.from(BUCKET).remove(fichiers.map(function (f) { return f.chemin; }));
                }

            } finally {

                boutonEnvoyer.disabled = false;
                progression.hidden = true;

            }

        });


        // --- Liste des documents ---

        async function chargerDocuments() {

            if (!window.supabaseClient) {
                setTimeout(chargerDocuments, 200);
                return;
            }

            const { data, error } = await window.supabaseClient
                .from("documents")
                .select("*")
                .order("trimestre", { ascending: true })
                .order("numero", { ascending: true, nullsFirst: false })
                .order("created_at", { ascending: true });

            if (error) {
                console.error("Erreur chargement documents:", error);
                liste.innerHTML = "<p>Impossible de charger les documents.</p>";
                return;
            }

            documentsCharges = data || [];

            const statsDocs = document.querySelector("#stats-documents");
            if (statsDocs) {
                statsDocs.textContent = documentsCharges.length;
            }

            afficherDocuments();

        }

        function afficherDocuments() {

            const filtre = valeur("#doc-filtre");

            const docs = documentsCharges.filter(function (d) {
                return filtre === "*" || (d.classe || "") === filtre;
            });

            if (docs.length === 0) {
                liste.innerHTML = "<p>Aucun document pour le moment.</p>";
                return;
            }

            liste.innerHTML = grouperParClasse(docs, function (d) { return d.classe || "Tous les niveaux"; }).map(function (groupe) {

                const parTrimestre = {};

                groupe.items.forEach(function (d) {
                    const t = d.trimestre ? `Trimestre ${d.trimestre}` : "Sans trimestre";
                    (parTrimestre[t] = parTrimestre[t] || []).push(d);
                });

                return `
                    <h3 class="classe-titre"><bdi>${groupe.classe}</bdi> <span>${groupe.items.length} document(s)</span></h3>
                    ${Object.keys(parTrimestre).sort().map(function (t) {
                        return `
                            <h4 class="doc-trimestre-titre">${t}</h4>
                            <div class="doc-liste">${parTrimestre[t].map(ligneDocument).join("")}</div>
                        `;
                    }).join("")}
                `;

            }).join("");

        }

        function ligneDocument(d) {

            const fichiers = d.fichiers || [];
            const image = fichiers.find(function (f) { return (f.type || "").startsWith("image/"); });
            const visible = d.statut === "publie";

            const vignette = image
                ? `<img src="${image.url}" alt="" loading="lazy">`
                : `<span>${fichiers.length > 0 ? "PDF" : "🔗"}</span>`;

            return `
                <div class="doc-ligne${visible ? "" : " doc-masque"}" data-id="${d.id}">
                    <a class="doc-vignette" href="${(fichiers[0] && fichiers[0].url) || d.lien || "#"}" target="_blank" rel="noopener">${vignette}</a>
                    <div class="doc-infos">
                        <strong dir="auto">${d.nom}</strong>
                        <small>${d.type_fichier || "Document"}${d.numero ? ` n°${d.numero}` : ""} · ${d.matiere || "—"}${fichiers.length > 1 ? ` · ${fichiers.length} pages` : ""}</small>
                        <small class="doc-etat">${visible ? "👁️ Visible par les élèves" : "🙈 Masqué"}</small>
                    </div>
                    <div class="doc-actions">
                        <button type="button" class="btn-edit" data-action="visible">${visible ? "🙈 Masquer" : "👁️ Publier"}</button>
                        <button type="button" class="btn-edit" data-action="renommer">✏️</button>
                        <button type="button" class="btn-delete" data-action="supprimer">🗑️</button>
                    </div>
                </div>
            `;

        }

        liste.addEventListener("click", async function (event) {

            const bouton = event.target.closest("button[data-action]");

            if (!bouton) {
                return;
            }

            const ligne = bouton.closest(".doc-ligne");
            const doc = documentsCharges.find(function (d) { return String(d.id) === ligne.dataset.id; });

            if (!doc) {
                return;
            }

            const action = bouton.dataset.action;
            let error = null;

            if (action === "visible") {

                ({ error } = await window.supabaseClient
                    .from("documents")
                    .update({ statut: doc.statut === "publie" ? "masque" : "publie" })
                    .eq("id", doc.id));

            } else if (action === "renommer") {

                const nom = prompt("Nouveau titre :", doc.nom);

                if (!nom || !nom.trim() || nom.trim() === doc.nom) {
                    return;
                }

                ({ error } = await window.supabaseClient
                    .from("documents")
                    .update({ nom: nom.trim() })
                    .eq("id", doc.id));

            } else if (action === "supprimer") {

                if (!confirm(`Supprimer « ${doc.nom} » ? Les élèves ne le verront plus.`)) {
                    return;
                }

                const chemins = (doc.fichiers || []).map(function (f) { return f.chemin; }).filter(Boolean);

                ({ error } = await window.supabaseClient
                    .from("documents")
                    .delete()
                    .eq("id", doc.id));

                if (!error && chemins.length > 0) {
                    const retrait = await window.supabaseClient.storage.from(BUCKET).remove(chemins);
                    if (retrait.error) {
                        console.error("Fichiers non retirés:", retrait.error);
                    }
                }

            }

            if (error) {
                console.error("Erreur document:", error);
                showToast("Erreur : " + error.message, "error");
                return;
            }

            showToast(action === "supprimer" ? "Document supprimé" : "Document mis à jour ✅", "success");
            chargerDocuments();

        });


        // ouvrir directement le formulaire depuis le tableau de bord
        if (window.location.hash === "#ajouter") {
            setTimeout(function () {
                document.querySelector("#doc-drop").scrollIntoView({ behavior: "smooth", block: "center" });
            }, 300);
        }

        chargerNiveaux();
        chargerDocuments();

    }


    // =================================================
    // 19. ESPACE PARENT — AFFICHER L'ENFANT
    // =================================================

    const parentNameEl = document.querySelector("#parent-name");
    const parentEnfantsEl = document.querySelector("#parent-enfants");


    // Formulaire « code d'accès » (espace parent et espace élève)
    document.querySelectorAll(".code-form:not(#niveau-form)").forEach(function (form) {

        form.addEventListener("submit", async function (event) {

            event.preventDefault();

            const input = form.querySelector(".code-input");
            const code = input.value.trim();

            if (!code) {
                return;
            }

            const { data, error } = await window.supabaseClient
                .rpc("utiliser_code", { code: code });

            if (error) {
                console.error("Erreur code:", error);
                showToast(error.message || "Code invalide", "error");
                return;
            }

            showToast(`Compte lié à ${data.prenom} ✅`, "success");

            setTimeout(function () {
                window.location.reload();
            }, 1200);

        });

    });


    // Séries publiées pour une classe (et celles sans classe)
    function requeteDocuments(classe) {

        let query = window.supabaseClient
            .from("documents")
            .select("*")
            .eq("statut", "publie")
            .order("created_at", { ascending: true });

        query = classe
            ? query.or(`classe.eq."${classe}",classe.is.null,classe.eq.""`)
            : query.or(`classe.is.null,classe.eq.""`);

        return query;

    }


    // Documents publiés : matière → trimestre → série et sa correction
    const MATIERES = [
        { nom: "Mathématiques", icone: "📐" },
        { nom: "Technologie", icone: "🔧" }
    ];

    const ORDRE_TYPES = ["Série d'exercices", "Correction", "Cours", "Devoir"];
    const ICONES_TYPES = { "Série d'exercices": "📝", "Correction": "✅", "Cours": "📘", "Devoir": "🧪" };

    function boutonsDocument(doc) {

        const fichiers = doc.fichiers || [];
        const images = fichiers.filter(function (f) { return (f.type || "").startsWith("image/"); });
        const autres = fichiers.filter(function (f) { return !(f.type || "").startsWith("image/"); });

        let boutons = "";

        if (images.length > 0) {
            boutons += `<button type="button" class="button button-primary seance-join doc-voir" data-images="${encodeURIComponent(JSON.stringify(images.map(function (f) { return f.url; })))}">👁️ Voir${images.length > 1 ? ` (${images.length} pages)` : ""}</button>`;
        }

        autres.forEach(function (f) {
            boutons += `<a href="${f.url}" target="_blank" rel="noopener" class="button button-primary seance-join">📄 Ouvrir</a>`;
        });

        if (doc.lien) {
            boutons += `<a href="${doc.lien}" target="_blank" rel="noopener" class="button button-primary seance-join">📄 Ouvrir</a>`;
        }

        return boutons;

    }

    function htmlListeTrimestre(docs) {

        // une « paire » = la série n°X et sa correction (même numéro)
        const paires = [];
        const parNumero = {};

        docs.forEach(function (doc) {
            if (doc.numero) {
                if (!parNumero[doc.numero]) {
                    parNumero[doc.numero] = [];
                    paires.push({ numero: doc.numero, docs: parNumero[doc.numero] });
                }
                parNumero[doc.numero].push(doc);
            } else {
                paires.push({ numero: 999, docs: [doc] });
            }
        });

        paires.sort(function (a, b) { return a.numero - b.numero; });

        return paires.map(function (paire) {

            paire.docs.sort(function (a, b) {
                return ORDRE_TYPES.indexOf(a.type_fichier) - ORDRE_TYPES.indexOf(b.type_fichier);
            });

            return `<div class="docs-paire">${paire.docs.map(function (doc) {
                return `
                    <div class="docs-item${doc.type_fichier === "Correction" ? " docs-item-correction" : ""}">
                        <span class="docs-item-ic">${ICONES_TYPES[doc.type_fichier] || "📄"}</span>
                        <div class="docs-item-texte">
                            <strong dir="auto">${doc.nom}</strong>
                            <small>${doc.type_fichier || "Document"}</small>
                        </div>
                        <div class="doc-boutons">${boutonsDocument(doc)}</div>
                    </div>
                `;
            }).join("")}</div>`;

        }).join("");

    }

    function htmlDocuments(documents) {

        documents = documents || [];

        // matières : les deux principales, puis celles qui ont des documents
        const matieres = MATIERES.slice();

        documents.forEach(function (doc) {
            if (doc.matiere && !matieres.some(function (m) { return m.nom === doc.matiere; })) {
                matieres.push({ nom: doc.matiere, icone: "📚" });
            }
        });

        const docsDe = function (matiere) {
            return documents.filter(function (doc) {
                return (doc.matiere || "Mathématiques") === matiere;
            });
        };

        const active = (matieres.find(function (m) { return docsDe(m.nom).length > 0; }) || matieres[0]).nom;

        const onglets = matieres.map(function (m) {

            const n = docsDe(m.nom).length;

            return `
                <button type="button" class="docs-matiere${m.nom === active ? " on" : ""}" data-matiere="${m.nom}"${n === 0 ? " disabled" : ""}>
                    <span class="docs-matiere-ic">${m.icone}</span>
                    <strong>${m.nom}</strong>
                    <small>${n === 0 ? "Bientôt" : `${n} document(s)`}</small>
                </button>
            `;

        }).join("") + `
            <div class="docs-matiere docs-matiere-bientot">
                <span class="docs-matiere-ic">📚</span>
                <strong>Autres matières</strong>
                <small>Bientôt</small>
            </div>
        `;

        const panneaux = matieres.map(function (m) {

            const docs = docsDe(m.nom);
            const parTrimestre = { 1: [], 2: [], 3: [] };

            docs.forEach(function (doc) {
                (parTrimestre[doc.trimestre || 1] = parTrimestre[doc.trimestre || 1] || []).push(doc);
            });

            const premier = [1, 2, 3].find(function (t) { return parTrimestre[t].length > 0; }) || 1;

            const boutons = [1, 2, 3].map(function (t) {
                const vide = parTrimestre[t].length === 0;
                return `
                    <button type="button" class="docs-trimestre${t === premier ? " on" : ""}" data-trimestre="${t}"${vide ? " disabled" : ""}>
                        <span>Trimestre ${t}</span>${vide ? ` <small>Bientôt</small>` : ""}
                    </button>
                `;
            }).join("");

            const listes = [1, 2, 3].map(function (t) {
                return `<div class="docs-liste" data-trimestre="${t}"${t === premier ? "" : " hidden"}>${htmlListeTrimestre(parTrimestre[t])}</div>`;
            }).join("");

            return `
                <div class="docs-panneau" data-matiere="${m.nom}"${m.nom === active ? "" : " hidden"}>
                    <div class="docs-trimestres">${boutons}</div>
                    ${docs.length === 0 ? "<p>Aucun document pour le moment.</p>" : listes}
                </div>
            `;

        }).join("");

        return `<div class="docs-bloc"><div class="docs-matieres">${onglets}</div>${panneaux}</div>`;

    }

    // onglets matière / trimestre (espace élève et parent)
    document.addEventListener("click", function (event) {

        const matiere = event.target.closest(".docs-matiere[data-matiere]");
        const trimestre = event.target.closest(".docs-trimestre");

        if (matiere && !matiere.disabled) {

            const bloc = matiere.closest(".docs-bloc");

            bloc.querySelectorAll(".docs-matiere").forEach(function (b) {
                b.classList.toggle("on", b === matiere);
            });

            bloc.querySelectorAll(".docs-panneau").forEach(function (p) {
                p.hidden = p.dataset.matiere !== matiere.dataset.matiere;
            });

        }

        if (trimestre && !trimestre.disabled) {

            const panneau = trimestre.closest(".docs-panneau");

            panneau.querySelectorAll(".docs-trimestre").forEach(function (b) {
                b.classList.toggle("on", b === trimestre);
            });

            panneau.querySelectorAll(".docs-liste").forEach(function (l) {
                l.hidden = l.dataset.trimestre !== trimestre.dataset.trimestre;
            });

        }

    });


    // Visionneuse : photos des séries en plein écran (glisser ou flèches)
    document.addEventListener("click", function (event) {

        const bouton = event.target.closest(".doc-voir");

        if (!bouton) {
            return;
        }

        const images = JSON.parse(decodeURIComponent(bouton.dataset.images));
        let index = 0;

        const fond = document.createElement("div");
        fond.className = "doc-viewer";
        fond.innerHTML = `
            <div class="doc-viewer-barre">
                <span class="doc-viewer-num"></span>
                <a class="doc-viewer-telecharger" target="_blank" rel="noopener" download>⬇️ Télécharger</a>
                <button type="button" class="doc-viewer-fermer" aria-label="Fermer">✕</button>
            </div>
            <div class="doc-viewer-zone">
                <button type="button" class="doc-viewer-nav doc-viewer-prec" aria-label="Précédente">‹</button>
                <img alt="">
                <button type="button" class="doc-viewer-nav doc-viewer-suiv" aria-label="Suivante">›</button>
            </div>
        `;

        const img = fond.querySelector("img");

        function montrer(i) {
            index = (i + images.length) % images.length;
            img.src = images[index];
            fond.querySelector(".doc-viewer-telecharger").href = images[index];
            fond.querySelector(".doc-viewer-num").textContent = images.length > 1 ? `Page ${index + 1} / ${images.length}` : "";
            fond.querySelectorAll(".doc-viewer-nav").forEach(function (n) { n.hidden = images.length < 2; });
        }

        function fermer() {
            fond.remove();
            document.removeEventListener("keydown", clavier);
            document.body.style.overflow = "";
        }

        function clavier(e) {
            if (e.key === "Escape") fermer();
            if (e.key === "ArrowRight") montrer(index + 1);
            if (e.key === "ArrowLeft") montrer(index - 1);
        }

        fond.querySelector(".doc-viewer-fermer").addEventListener("click", fermer);
        fond.querySelector(".doc-viewer-prec").addEventListener("click", function () { montrer(index - 1); });
        fond.querySelector(".doc-viewer-suiv").addEventListener("click", function () { montrer(index + 1); });

        let departX = null;
        img.addEventListener("touchstart", function (e) { departX = e.touches[0].clientX; }, { passive: true });
        img.addEventListener("touchend", function (e) {
            if (departX === null) return;
            const dx = e.changedTouches[0].clientX - departX;
            if (Math.abs(dx) > 50) montrer(index + (dx < 0 ? 1 : -1));
            departX = null;
        });

        document.addEventListener("keydown", clavier);
        document.body.style.overflow = "hidden";
        document.body.appendChild(fond);
        montrer(0);

    });


    if (parentNameEl && parentEnfantsEl) {

        async function loadParentSpace() {

            if (!window.supabaseClient) {
                setTimeout(loadParentSpace, 200);
                return;
            }

            const { data: sessionData } = await window.supabaseClient.auth.getSession();
            const session = sessionData.session;

            if (!session) {
                console.log("Pas de session.");
                return;
            }

            const codeCard = document.querySelector("#parent-code-card");

            const { data: parents, error: errParent } = await window.supabaseClient
                .from("parents")
                .select("*")
                .eq("user_id", session.user.id);

            if (errParent) {
                console.error("Erreur chargement parent:", errParent);
                return;
            }

            if (!parents || parents.length === 0) {
                parentEnfantsEl.innerHTML = "";
                codeCard.hidden = false;
                return;
            }

            const parent = parents[0];

            parentNameEl.textContent = `Bienvenue, ${parent.prenom} ${parent.nom}`.trim();

            const { data: enfants, error: errEnfants } = await window.supabaseClient
                .from("eleves")
                .select("*, presences(present, seances(date_seance, matiere)), paiements(date_paiement, montant)")
                .eq("parent_id", parent.id)
                .order("prenom", { ascending: true });

            if (errEnfants) {
                console.error("Erreur chargement enfants:", errEnfants);
                return;
            }

            // Toujours possible de lier un autre enfant
            codeCard.hidden = false;
            codeCard.querySelector("h2").textContent =
                enfants && enfants.length > 0 ? "Lier un autre enfant" : "Lier mon enfant";

            if (!enfants || enfants.length === 0) {
                parentEnfantsEl.innerHTML = "";
                return;
            }

            const now = new Date();
            const today = now.getFullYear() + "-" +
                String(now.getMonth() + 1).padStart(2, "0") + "-" +
                String(now.getDate()).padStart(2, "0");

            const blocs = await Promise.all(enfants.map(async function (enfant) {

                const [{ data: seances }, { data: documents }] = await Promise.all([
                    window.supabaseClient
                        .from("seances")
                        .select("*")
                        .gte("date_seance", today)
                        .neq("statut", "annulée")
                        .or(`classe.eq."${enfant.classe}",classe.is.null,classe.eq.""`)
                        .order("date_seance", { ascending: true })
                        .order("heure_debut", { ascending: true })
                        .limit(1),
                    requeteDocuments(enfant.classe)
                ]);

                const suivi = suiviEleve(enfant);
                const prochaine = seances && seances[0];

                const historique = (enfant.presences || [])
                    .filter(function (p) { return p.seances; })
                    .sort(function (a, b) {
                        return (b.seances.date_seance || "").localeCompare(a.seances.date_seance || "");
                    })
                    .slice(0, 8);

                const historiqueHTML = historique.length > 0
                    ? `<ul class="historique-presences">${historique.map(function (p) {
                        return `<li>${p.present ? "✅ Présent(e)" : "❌ Absent(e)"} — ${p.seances.date_seance} · <span dir="auto">${p.seances.matiere}</span></li>`;
                    }).join("")}</ul>`
                    : "<p>Les présences apparaîtront ici après chaque séance.</p>";

                return `
                    <section class="student-welcome-card is-stacked">

                        <span class="student-label">MON ENFANT</span>

                        <h2 dir="auto">${enfant.prenom} ${enfant.nom}</h2>

                        <p>Classe : <bdi>${enfant.classe || "—"}</bdi></p>

                        <div class="student-dashboard-grid">

                            <article class="student-dashboard-card">
                                <div class="dashboard-card-icon">📅</div>
                                <div>
                                    <h3>${suivi.total} séance(s)</h3>
                                    <p>Ce mois : ${suivi.periode} / ${SEANCES_PAR_MOIS}</p>
                                </div>
                            </article>

                            <article class="student-dashboard-card">
                                <div class="dashboard-card-icon">💰</div>
                                <div>
                                    <h3>${suivi.paiement}</h3>
                                    <p>${suivi.moisPayes} mois payé(s) · ${enfant.tarif_mensuel || 100} DT / mois</p>
                                </div>
                            </article>

                            <article class="student-dashboard-card">
                                <div class="dashboard-card-icon">🔜</div>
                                <div>
                                    <h3>Prochaine séance</h3>
                                    <p>${prochaine
                                        ? `${prochaine.date_seance} à ${prochaine.heure_debut ? prochaine.heure_debut.slice(0, 5) : "—"}<br><span dir="auto">${prochaine.matiere}</span>`
                                        : "Pas encore programmée"}</p>
                                    ${prochaine && prochaine.lien_visio ? `<a href="${prochaine.lien_visio}" target="_blank" rel="noopener" class="button button-primary seance-join">🎥 Lien du cours</a>` : ""}
                                </div>
                            </article>

                        </div>

                        <h3 class="documents-niveau">Présences</h3>
                        ${historiqueHTML}

                        <h3 class="documents-niveau">Séries d'exercices</h3>
                        ${htmlDocuments(documents)}

                    </section>
                `;

            }));

            parentEnfantsEl.innerHTML = blocs.join("");

        }

        loadParentSpace();

    }


    // =================================================
    // 20. ESPACE ÉLÈVE — AFFICHER LES INFOS
    // =================================================

    const eleveNameEl = document.querySelector("#eleve-name");
    const eleveClasseEl = document.querySelector("#eleve-classe");
    const eleveStatutEl = document.querySelector("#eleve-statut");

    if (eleveNameEl && eleveClasseEl && eleveStatutEl) {

        const niveauChoix = document.querySelector("#niveau-choix");

        if (niveauChoix) {

            niveauChoix.addEventListener("click", async function (event) {

                const bouton = event.target.closest("button[data-niveau]");

                if (!bouton) {
                    return;
                }

                niveauChoix.querySelectorAll("button").forEach(function (b) {
                    b.disabled = true;
                });

                bouton.classList.add("on");

                const { error } = await window.supabaseClient
                    .rpc("choisir_niveau", { niveau: bouton.dataset.niveau });

                if (error) {
                    console.error("Erreur niveau:", error);
                    showToast(error.message, "error");
                    niveauChoix.querySelectorAll("button").forEach(function (b) {
                        b.disabled = false;
                    });
                    bouton.classList.remove("on");
                    return;
                }

                showToast("Niveau enregistré ✅", "success");

                setTimeout(function () {
                    window.location.reload();
                }, 800);

            });

        }


        async function loadEleveSpace() {

            if (!window.supabaseClient) {
                setTimeout(loadEleveSpace, 200);
                return;
            }

            const { data: sessionData } = await window.supabaseClient.auth.getSession();
            const session = sessionData.session;

            if (!session) {
                console.log("Pas de session.");
                return;
            }

            const userId = session.user.id;

            console.log("User ID:", userId);

            const { data: eleves, error: errEleve } = await window.supabaseClient
                .from("eleves")
                .select("*")
                .eq("user_id", userId);

            if (errEleve) {
                console.error("Erreur chargement élève:", errEleve);
                return;
            }

            if (!eleves || eleves.length === 0) {
                console.log("Aucun élève associé à cet utilisateur.");
                const meta = session.user.user_metadata || {};
                eleveNameEl.textContent = meta.nom || meta.full_name || "Bienvenue";
                eleveClasseEl.textContent = "Niveau : —";
                eleveStatutEl.textContent = "—";
                document.querySelector("#eleve-code-card").hidden = false;
                document.querySelector("#eleve-documents-intro").textContent =
                    "Tes documents apparaîtront ici dès que ton niveau sera connu.";
                loadEleveSeances(null);
                loadEleveDocuments(null);
                return;
            }

            const eleve = eleves[0];

            console.log("Élève:", eleve);

            eleveNameEl.textContent = `${eleve.prenom} ${eleve.nom}`.trim();
            eleveClasseEl.innerHTML = eleve.classe
                ? `Niveau : <bdi>${eleve.classe}</bdi>`
                : "Niveau : à choisir";
            eleveStatutEl.textContent = eleve.mode === "distance" ? "💻 À distance" : "🏫 Présentiel";

            if (eleve.mode === "distance") {

                // Un élève inscrit en ligne qui suit aussi les cours en salle peut entrer son code
                document.querySelector("#eleve-code-card").hidden = false;

                if (!eleve.classe) {
                    document.querySelector("#eleve-niveau-card").hidden = false;
                    document.body.classList.add("niveau-a-choisir");
                }

            }

            loadEleveSeances(eleve.classe);
            loadEleveDocuments(eleve.classe);

        }


        // Séries d'exercices publiées, regroupées par niveau
        async function loadEleveDocuments(classe) {

            const container = document.querySelector("#eleve-documents");

            if (!container) {
                return;
            }

            const { data: documents, error } = await requeteDocuments(classe);

            if (error) {
                console.error("Erreur chargement documents:", error);
                container.innerHTML = "<p>Impossible de charger les documents.</p>";
                return;
            }

            container.innerHTML = htmlDocuments(documents);

        }


        // Séances à venir de la classe de l'élève (ou de toutes les classes)
        async function loadEleveSeances(classe) {

            const container = document.querySelector("#eleve-seances");

            if (!container) {
                return;
            }

            const now = new Date();
            const today = now.getFullYear() + "-" +
                String(now.getMonth() + 1).padStart(2, "0") + "-" +
                String(now.getDate()).padStart(2, "0");

            let query = window.supabaseClient
                .from("seances")
                .select("*")
                .gte("date_seance", today)
                .neq("statut", "annulée")
                .order("date_seance", { ascending: true })
                .order("heure_debut", { ascending: true });

            query = classe
                ? query.or(`classe.eq."${classe}",classe.is.null,classe.eq.""`)
                : query.or(`classe.is.null,classe.eq.""`);

            const { data: seances, error } = await query;

            if (error) {
                console.error("Erreur chargement séances élève:", error);
                container.innerHTML = "<p>Impossible de charger les séances.</p>";
                return;
            }

            if (!seances || seances.length === 0) {
                container.innerHTML = "<p>Aucune séance prévue pour le moment.</p>";
                return;
            }

            const heureActuelle = now.toTimeString().slice(0, 5);

            container.innerHTML = seances.map(function (seance) {

                const enDirect = seance.date_seance === today
                    && seance.heure_debut && seance.heure_fin
                    && seance.heure_debut.slice(0, 5) <= heureActuelle
                    && heureActuelle <= seance.heure_fin.slice(0, 5);

                const bouton = seance.lien_visio
                    ? `<a href="${seance.lien_visio}" target="_blank" rel="noopener" class="button button-primary seance-join">
                           🎥 Rejoindre le cours
                       </a>`
                    : "";

                return `
                    <article class="student-dashboard-card${enDirect ? " seance-live" : ""}">
                        <div class="dashboard-card-icon">
                            ${seance.lien_visio ? "🎥" : "📅"}
                        </div>
                        <div>
                            ${enDirect ? '<span class="seance-live-badge">● En direct</span>' : ""}
                            <h3>
                                ${seance.matiere}
                            </h3>
                            <p>
                                <strong>Date :</strong> ${seance.date_seance}
                                <br>
                                <strong>Heure :</strong> ${seance.heure_debut ? seance.heure_debut.slice(0, 5) : "—"} – ${seance.heure_fin ? seance.heure_fin.slice(0, 5) : "—"}
                                <br>
                                <strong>Lieu :</strong> ${seance.salle || "—"}
                            </p>
                            ${bouton}
                        </div>
                    </article>
                `;

            }).join("");

        }

        loadEleveSpace();

    }


    // =================================================
    // 21. ADMIN — STATISTIQUES
    // =================================================

    const statsEleves = document.querySelector("#stats-eleves");

    if (statsEleves) {

        async function loadStats() {

            if (!window.supabaseClient) {
                setTimeout(loadStats, 200);
                return;
            }

            const tables = [
                { name: "eleves", element: "#stats-eleves" },
                { name: "parents", element: "#stats-parents" },
                { name: "classes", element: "#stats-classes" },
                { name: "seances", element: "#stats-seances" },
                { name: "documents", element: "#stats-documents" }
            ];

            for (const table of tables) {

                const { count, error } = await window.supabaseClient
                    .from(table.name)
                    .select("*", { count: "exact", head: true });

                if (error) {
                    console.error(`Erreur stats ${table.name}:`, error);
                    continue;
                }

                const el = document.querySelector(table.element);

                if (el) {
                    el.textContent = count;
                }

                console.log(`Stats ${table.name}:`, count);

            }

        }

        loadStats();

    }



});
