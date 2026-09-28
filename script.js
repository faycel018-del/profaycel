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

            const isOpen = header.classList.toggle("menu-open");

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

                if (session) {

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
                        headerActions.firstChild
                    );

                } else {

                    const loginLink = document.createElement("a");
                    loginLink.href = "login.html";
                    loginLink.className = "header-button header-login-button";
                    loginLink.textContent = "Connexion";

                    headerActions.insertBefore(
                        loginLink,
                        headerActions.firstChild
                    );

                }

            });

        }

        updateAuthButton();

    }


    // =================================================
    // 6. INSCRIPTION (register.html)
    // =================================================

    const registerForm = document.getElementById("register-form");

    if (registerForm) {

        registerForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const passwordConfirm = document.getElementById("password-confirm").value;
            let role = document.getElementById("role").value;

            const ADMIN_EMAIL = "faycel018@gmail.com";

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
                        role: role
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
    // 8. PROTECTION DES PAGES PRIVÉES (AVEC RÔLES)
    // =================================================

    const pageRoles = {

        "eleve.html": ["eleve", "admin"],
        "parent.html": ["parent", "admin"],

        "admin.html": ["admin"],
        "eleves.html": ["admin"],
        "parents.html": ["admin"],
        "classes.html": ["admin"],
        "cours-admin.html": ["admin"],
        "devoirs-admin.html": ["admin"],
        "seances-admin.html": ["admin"],
        "presence-admin.html": ["admin"],
        "resultats-admin.html": ["admin"],
        "documents-admin.html": ["admin"],
        "annonces-admin.html": ["admin"]

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


        function loadEleves() {

            if (!window.supabaseClient) {
                setTimeout(loadEleves, 200);
                return;
            }

            window.supabaseClient
                .from("eleves")
                .select("*")
                .order("created_at", { ascending: false })
                .then(function (result) {

                    if (result.error) {
                        console.error("Erreur chargement élèves:", result.error);
                        return;
                    }

                    const eleves = result.data;

                    console.log("Élèves chargés:", eleves.length);

                    if (eleves.length === 0) {
                        elevesGrid.innerHTML = "<p>Aucun élève enregistré.</p>";
                        return;
                    }

                    elevesGrid.innerHTML = eleves.map(function (eleve) {

                        const actionsHTML = currentUserRole === "admin"
                            ? `
                                <div class="card-actions">
                                    <button
                                        type="button"
                                        class="btn-edit"
                                        data-id="${eleve.id}">
                                        ✏️ Modifier
                                    </button>
                                    <button
                                        type="button"
                                        class="btn-delete"
                                        data-id="${eleve.id}">
                                        🗑️ Supprimer
                                    </button>
                                </div>
                            `
                            : "";

                        return `
                            <article class="student-dashboard-card">
                                <div class="dashboard-card-icon">
                                    👨‍🎓
                                </div>
                                <h3>
                                    ${eleve.prenom} ${eleve.nom}
                                </h3>
                                <p>
                                    <strong>Classe :</strong> ${eleve.classe || "—"}
                                    <br>
                                    <strong>Email :</strong> ${eleve.email || "—"}
                                    <br>
                                    <strong>Téléphone :</strong> ${eleve.telephone || "—"}
                                    <br>
                                    <strong>Statut :</strong> ${eleve.statut || "—"}
                                </p>
                                ${actionsHTML}
                            </article>
                        `;

                    }).join("");

                    attachCardEvents(eleves);

                });

        }


        function attachCardEvents(eleves) {

            document.querySelectorAll(".btn-edit").forEach(function (btn) {

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
                    document.querySelector("#eleve-classe").value = eleve.classe || "";
                    document.querySelector("#eleve-statut").value = eleve.statut || "actif";

                    modalTitle.textContent = "Modifier un élève";

                    eleveModal.classList.add("active");

                });

            });

            document.querySelectorAll(".btn-delete").forEach(function (btn) {

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
                classe: document.querySelector("#eleve-classe").value.trim(),
                statut: document.querySelector("#eleve-statut").value
            };

            if (!data.nom || !data.prenom) {
                showToast("Veuillez remplir le nom et le prénom.", "warning");
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

        function loadParents() {

            if (!window.supabaseClient) {
                setTimeout(loadParents, 200);
                return;
            }

            window.supabaseClient
                .from("parents")
                .select("*")
                .order("created_at", { ascending: false })
                .then(function (result) {

                    if (result.error) {
                        console.error("Erreur chargement parents:", result.error);
                        return;
                    }

                    const parents = result.data;

                    console.log("Parents chargés:", parents.length);

                    if (parents.length === 0) {
                        parentsGrid.innerHTML = "<p>Aucun parent enregistré.</p>";
                        return;
                    }

                    parentsGrid.innerHTML = parents.map(function (parent) {

                        return `
                            <article class="student-dashboard-card">
                                <div class="dashboard-card-icon">
                                    👨
                                </div>
                                <h3>
                                    ${parent.prenom} ${parent.nom}
                                </h3>
                                <p>
                                    <strong>Email :</strong> ${parent.email || "—"}
                                    <br>
                                    <strong>Téléphone :</strong> ${parent.telephone || "—"}
                                    <br>
                                    <strong>Statut :</strong> ${parent.statut || "—"}
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

                    }).join("");

                    attachParentEvents(parents);

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
    // 12. AFFICHER LES COURS (cours-admin.html)
    // =================================================

    const coursGrid = document.querySelector("#cours-grid");

    if (coursGrid) {

        function loadCours() {

            if (!window.supabaseClient) {
                setTimeout(loadCours, 200);
                return;
            }

            window.supabaseClient
                .from("cours")
                .select("*")
                .order("created_at", { ascending: false })
                .then(function (result) {

                    if (result.error) {
                        console.error("Erreur chargement cours:", result.error);
                        return;
                    }

                    const cours = result.data;

                    console.log("Cours chargés:", cours.length);

                    if (cours.length === 0) {
                        coursGrid.innerHTML = "<p>Aucun cours enregistré.</p>";
                        return;
                    }

                    coursGrid.innerHTML = cours.map(function (cour) {

                        return `
                            <article class="student-dashboard-card">
                                <div class="dashboard-card-icon">
                                    📚
                                </div>
                                <h3>
                                    ${cour.titre}
                                </h3>
                                <p>
                                    <strong>Matière :</strong> ${cour.matiere || "—"}
                                    <br>
                                    <strong>Niveau :</strong> ${cour.niveau || "—"}
                                    <br>
                                    <strong>Classe :</strong> ${cour.classe || "—"}
                                    <br>
                                    <strong>Statut :</strong> ${cour.statut || "—"}
                                </p>
                                <a href="#">
                                    Voir le cours →
                                </a>
                            </article>
                        `;

                    }).join("");

                });

        }

        loadCours();

    }


    // =================================================
    // 13. AFFICHER LES DEVOIRS (devoirs-admin.html)
    // =================================================

    const devoirsGrid = document.querySelector("#devoirs-grid");

    if (devoirsGrid) {

        function loadDevoirs() {

            if (!window.supabaseClient) {
                setTimeout(loadDevoirs, 200);
                return;
            }

            window.supabaseClient
                .from("devoirs")
                .select("*")
                .order("created_at", { ascending: false })
                .then(function (result) {

                    if (result.error) {
                        console.error("Erreur chargement devoirs:", result.error);
                        return;
                    }

                    const devoirs = result.data;

                    console.log("Devoirs chargés:", devoirs.length);

                    if (devoirs.length === 0) {
                        devoirsGrid.innerHTML = "<p>Aucun devoir enregistré.</p>";
                        return;
                    }

                    devoirsGrid.innerHTML = devoirs.map(function (devoir) {

                        return `
                            <article class="student-dashboard-card">
                                <div class="dashboard-card-icon">
                                    📝
                                </div>
                                <h3>
                                    ${devoir.titre}
                                </h3>
                                <p>
                                    <strong>Matière :</strong> ${devoir.matiere || "—"}
                                    <br>
                                    <strong>Classe :</strong> ${devoir.classe || "—"}
                                    <br>
                                    <strong>Date limite :</strong> ${devoir.date_limite || "—"}
                                    <br>
                                    <strong>Statut :</strong> ${devoir.statut || "—"}
                                </p>
                                <a href="#">
                                    Voir le devoir →
                                </a>
                            </article>
                        `;

                    }).join("");

                });

        }

        loadDevoirs();

    }


    // =================================================
    // 14. AFFICHER LES SÉANCES (seances-admin.html)
    // =================================================

    const seancesGrid = document.querySelector("#seances-grid");

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

                    if (seances.length === 0) {
                        seancesGrid.innerHTML = "<p>Aucune séance planifiée.</p>";
                        return;
                    }

                    seancesGrid.innerHTML = seances.map(function (seance) {

                        return `
                            <article class="student-dashboard-card">
                                <div class="dashboard-card-icon">
                                    📅
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
                                    <a href="#">
                                        Voir la séance →
                                    </a>
                                </div>
                            </article>
                        `;

                    }).join("");

                });

        }

        loadSeances();

    }


    // =================================================
    // 15. AFFICHER LES SÉANCES (presence-admin.html)
    // =================================================

    const presenceGrid = document.querySelector("#presence-grid");

    if (presenceGrid) {

        function loadPresenceSeances() {

            if (!window.supabaseClient) {
                setTimeout(loadPresenceSeances, 200);
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

                    console.log("Séances (présence) chargées:", seances.length);

                    if (seances.length === 0) {
                        presenceGrid.innerHTML = "<p>Aucune séance disponible.</p>";
                        return;
                    }

                    presenceGrid.innerHTML = seances.map(function (seance) {

                        return `
                            <article class="student-dashboard-card">
                                <div class="dashboard-card-icon">
                                    📅
                                </div>
                                <div>
                                    <h3>
                                        ${seance.matiere} — ${seance.classe || "—"}
                                    </h3>
                                    <p>
                                        <strong>Date :</strong> ${seance.date_seance || "—"}
                                    </p>
                                    <p>
                                        <strong>Heure :</strong> ${seance.heure_debut || "—"} – ${seance.heure_fin || "—"}
                                    </p>
                                    <p>
                                        <strong>Salle :</strong> ${seance.salle || "—"}
                                    </p>
                                    <a href="#">
                                        Faire l'appel →
                                    </a>
                                </div>
                            </article>
                        `;

                    }).join("");

                });

        }

        loadPresenceSeances();

    }


    // =================================================
    // 16. AFFICHER LES RÉSULTATS (resultats-admin.html)
    // =================================================

    const resultatsGrid = document.querySelector("#resultats-grid");

    if (resultatsGrid) {

        function loadResultats() {

            if (!window.supabaseClient) {
                setTimeout(loadResultats, 200);
                return;
            }

            window.supabaseClient
                .from("resultats")
                .select("*")
                .order("created_at", { ascending: false })
                .then(function (result) {

                    if (result.error) {
                        console.error("Erreur chargement résultats:", result.error);
                        return;
                    }

                    const resultats = result.data;

                    console.log("Résultats chargés:", resultats.length);

                    if (resultats.length === 0) {
                        resultatsGrid.innerHTML = "<p>Aucune évaluation enregistrée.</p>";
                        return;
                    }

                    resultatsGrid.innerHTML = resultats.map(function (resultat) {

                        return `
                            <article class="student-dashboard-card">
                                <div class="dashboard-card-icon">
                                    📊
                                </div>
                                <div>
                                    <h3>
                                        ${resultat.evaluation || "Évaluation"}
                                    </h3>
                                    <p>
                                        <strong>Matière :</strong> ${resultat.matiere || "—"}
                                    </p>
                                    <p>
                                        <strong>Note :</strong> ${resultat.note || "—"} / ${resultat.bareme || "—"}
                                    </p>
                                    <p>
                                        <strong>Date :</strong> ${resultat.date_evaluation || "—"}
                                    </p>
                                    <a href="#">
                                        Voir les résultats →
                                    </a>
                                </div>
                            </article>
                        `;

                    }).join("");

                });

        }

        loadResultats();

    }


    // =================================================
    // 17. AFFICHER LES DOCUMENTS (documents-admin.html)
    // =================================================

    const documentsGrid = document.querySelector("#documents-grid");

    if (documentsGrid) {

        function loadDocuments() {

            if (!window.supabaseClient) {
                setTimeout(loadDocuments, 200);
                return;
            }

            window.supabaseClient
                .from("documents")
                .select("*")
                .order("created_at", { ascending: false })
                .then(function (result) {

                    if (result.error) {
                        console.error("Erreur chargement documents:", result.error);
                        return;
                    }

                    const documents = result.data;

                    console.log("Documents chargés:", documents.length);

                    if (documents.length === 0) {
                        documentsGrid.innerHTML = "<p>Aucun document enregistré.</p>";
                        return;
                    }

                    documentsGrid.innerHTML = documents.map(function (doc) {

                        return `
                            <article class="student-dashboard-card">
                                <div class="dashboard-card-icon">
                                    📄
                                </div>
                                <div>
                                    <h3>
                                        ${doc.nom}
                                    </h3>
                                    <p>
                                        <strong>Type :</strong> ${doc.type_fichier || "—"}
                                    </p>
                                    <p>
                                        <strong>Classe :</strong> ${doc.classe || "—"}
                                    </p>
                                    <p>
                                        <strong>Statut :</strong> ${doc.statut || "—"}
                                    </p>
                                    <a href="#">
                                        Gérer le document →
                                    </a>
                                </div>
                            </article>
                        `;

                    }).join("");

                });

        }

        loadDocuments();

    }


    // =================================================
    // 18. AFFICHER LES ANNONCES (annonces-admin.html)
    // =================================================

    const annoncesGrid = document.querySelector("#annonces-grid");

    if (annoncesGrid) {

        function loadAnnonces() {

            if (!window.supabaseClient) {
                setTimeout(loadAnnonces, 200);
                return;
            }

            window.supabaseClient
                .from("annonces")
                .select("*")
                .order("created_at", { ascending: false })
                .then(function (result) {

                    if (result.error) {
                        console.error("Erreur chargement annonces:", result.error);
                        return;
                    }

                    const annonces = result.data;

                    console.log("Annonces chargées:", annonces.length);

                    if (annonces.length === 0) {
                        annoncesGrid.innerHTML = "<p>Aucune annonce enregistrée.</p>";
                        return;
                    }

                    annoncesGrid.innerHTML = annonces.map(function (annonce) {

                        return `
                            <article class="student-dashboard-card">
                                <div class="dashboard-card-icon">
                                    📢
                                </div>
                                <div>
                                    <h3>
                                        ${annonce.titre}
                                    </h3>
                                    <p>
                                        <strong>Type :</strong> ${annonce.type_annonce || "—"}
                                    </p>
                                    <p>
                                        <strong>Destinataires :</strong> ${annonce.destinataires || "—"}
                                    </p>
                                    <p>
                                        <strong>Statut :</strong> ${annonce.statut || "—"}
                                    </p>
                                    <a href="#">
                                        Gérer l'annonce →
                                    </a>
                                </div>
                            </article>
                        `;

                    }).join("");

                });

        }

        loadAnnonces();

    }


    // =================================================
    // 19. ESPACE PARENT — AFFICHER L'ENFANT
    // =================================================

    const parentNameEl = document.querySelector("#parent-name");
    const parentChildNameEl = document.querySelector("#parent-child-name");
    const parentChildClasseEl = document.querySelector("#parent-child-classe");

    if (parentNameEl && parentChildNameEl && parentChildClasseEl) {

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

            const userId = session.user.id;

            console.log("User ID:", userId);

            const { data: parents, error: errParent } = await window.supabaseClient
                .from("parents")
                .select("*")
                .eq("user_id", userId);

            if (errParent) {
                console.error("Erreur chargement parent:", errParent);
                return;
            }

            if (!parents || parents.length === 0) {
                console.log("Aucun parent associé à cet utilisateur.");
                parentNameEl.textContent = "Bienvenue dans votre espace";
                parentChildNameEl.textContent = "Aucun enfant associé";
                parentChildClasseEl.textContent = "—";
                return;
            }

            const parent = parents[0];

            console.log("Parent:", parent);

            parentNameEl.textContent = `Bienvenue, ${parent.prenom} ${parent.nom}`;

            const { data: enfants, error: errEnfants } = await window.supabaseClient
                .from("eleves")
                .select("*")
                .eq("parent_id", parent.id);

            if (errEnfants) {
                console.error("Erreur chargement enfants:", errEnfants);
                return;
            }

            console.log("Enfants:", enfants);

            if (!enfants || enfants.length === 0) {
                parentChildNameEl.textContent = "Aucun enfant associé";
                parentChildClasseEl.textContent = "—";
                return;
            }

            const enfant = enfants[0];

            parentChildNameEl.textContent = `${enfant.prenom} ${enfant.nom}`;
            parentChildClasseEl.textContent = `Classe : ${enfant.classe || "—"}`;

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
                eleveNameEl.textContent = "Bienvenue";
                eleveClasseEl.textContent = "Aucune classe associée";
                eleveStatutEl.textContent = "—";
                return;
            }

            const eleve = eleves[0];

            console.log("Élève:", eleve);

            eleveNameEl.textContent = `${eleve.prenom} ${eleve.nom}`;
            eleveClasseEl.textContent = `Classe : ${eleve.classe || "—"}`;
            eleveStatutEl.textContent = eleve.statut || "—";

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
                { name: "cours", element: "#stats-cours" },
                { name: "devoirs", element: "#stats-devoirs" },
                { name: "seances", element: "#stats-seances" },
                { name: "documents", element: "#stats-documents" },
                { name: "annonces", element: "#stats-annonces" }
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
