// =====================================================
// PROFAYCEL — Langue : français / العربية
// Le site est écrit en français ; en arabe, chaque texte
// (y compris celui ajouté par script.js) est traduit grâce
// au dictionnaire ci-dessous. Les pages d'administration
// restent en français.
// =====================================================

(function () {

    const CLE_LANGUE = "profaycel_lang";

    const PAGES_ADMIN = [
        "admin.html", "eleves.html", "parents.html", "classes.html",
        "seances-admin.html", "presence-admin.html", "documents-admin.html"
    ];

    let page = window.location.pathname.split("/").pop() || "index.html";

    if (!page.includes(".")) {
        page += ".html";
    }

    const estAdmin = PAGES_ADMIN.includes(page);

    function lireLangue() {
        try {
            return localStorage.getItem(CLE_LANGUE);
        } catch (e) {
            return null;
        }
    }

    function ecrireLangue(langue) {
        try {
            localStorage.setItem(CLE_LANGUE, langue);
        } catch (e) {
            // navigation privée : la langue ne sera pas retenue
        }
    }

    const langueChoisie = lireLangue();
    const langue = estAdmin ? "fr" : (langueChoisie === "ar" ? "ar" : "fr");

    window.PF_LANGUE = langue;


    // -------------------------------------------------
    // Dictionnaire français → arabe
    // -------------------------------------------------

    const AR = {

        // En-tête, menu, pied de page
        "Accueil": "الرئيسية",
        "À propos": "من أنا",
        "Cours": "الدروس",
        "Robotique": "الروبوتيك",
        "Projets": "المشاريع",
        "Ressources": "الموارد",
        "Contact": "اتصل بي",
        "Qui suis-je": "من أنا",
        "Mes cours": "ما أُدرّسه",
        "Espaces": "الفضاءات",
        "Mes livres": "مؤلّفاتي",
        "Connexion": "تسجيل الدخول",
        "Inscription": "إنشاء حساب",
        "Déconnexion": "تسجيل الخروج",
        "🏠 Mon espace": "🏠 فضائي",
        "Espace Élève": "فضاء التلميذ",
        "Espace Parent": "فضاء الوليّ",
        "Administration": "الإدارة",
        "Écrire": "راسلني",
        "Ouvrir le menu": "فتح القائمة",
        "Fermer le menu": "غلق القائمة",
        "Retour en haut": "العودة إلى الأعلى",
        "Politique de confidentialité": "سياسة الخصوصية",
        "© 2026 Profaycel. Tous droits réservés.": "© 2026 Profaycel. جميع الحقوق محفوظة.",
        "© 2026 Profaycel — Tous droits réservés.": "© 2026 Profaycel. جميع الحقوق محفوظة.",
        "Éducation • Technologie • Robotique": "تعليم • تكنولوجيا • روبوتيك",
        "Professeur Faycel Khlifi — Maths & Technologie": "الأستاذ فيصل الخليفي: رياضيات وتكنولوجيا",
        "📲 Installer l'application": "📲 تثبيت التطبيق",
        "Installer Profaycel": "تثبيت Profaycel",

        // Accueil
        "Inscriptions ouvertes · en salle et à distance": "التسجيل مفتوح · حضوريًّا وعن بُعد",
        "Professeur Faycel Khlifi": "الأستاذ فيصل الخليفي",
        "Ingénieur · Professeur de mathématiques et de technologie": "مهندس · أستاذ رياضيات وتكنولوجيا",
        "J'enseigne à votre enfant": "أُعلّم ابنك",
        "à comprendre": "ليفهم",
        ",": "،",
        "pas à apprendre par cœur.": "لا ليحفظ.",
        "💬 Inscrire mon enfant": "💬 سجّل ابنك",
        "🎥 Cours à distance": "🎥 الدراسة عن بُعد",
        "ans d'enseignement": "سنوات في التدريس",
        "livres de mathématiques": "كتب في الرياضيات",
        "niveaux : 7ème, 8ème, 9ème et 1ère secondaire": "مستويات: السابعة والثامنة والتاسعة أساسي والأولى ثانوي",
        "en salle et à distance": "حضوريًّا وعن بُعد",
        "Un ingénieur qui a choisi l'enseignement": "مهندس اختار التعليم",
        "Je veux que l'élève comprenne pourquoi, pas seulement comment. Mon expérience d'ingénieur rend les mathématiques et la technologie simples et concrètes.":
            "أحرص على أن يفهم التلميذ لماذا، لا كيف فقط. أوظّف خبرتي الهندسية لأجعل الرياضيات والتكنولوجيا مادّتين يسيرتين وقريبتين من الواقع.",
        "Ingénieur d'État en génie électrique": "مهندس دولة في الهندسة الكهربائية",
        "Licence en électronique, électrotechnique et automatique": "إجازة في الإلكترونيك والكهروتقنية والآلية",
        "Fondateur de FH Academy Center, depuis 2019": "مؤسّس FH Academy Center منذ 2019",
        "Professeur de technologie : électronique, Arduino et robotique": "أستاذ تكنولوجيا: الإلكترونيك وArduino والروبوتيك",
        "Auteur de la série « Le petit ingénieur en mathématiques »": "مؤلّف سلسلة «المهندس الصغير في الرياضيات»",
        "Cours de mathématiques par niveau": "دروس في الرياضيات حسب المستوى",
        "7ème année de base": "السابعة أساسي",
        "8ème année de base": "الثامنة أساسي",
        "9ème année de base": "التاسعة أساسي",
        "1ère année secondaire": "الأولى ثانوي",
        "Cours, exercices et devoirs": "دروس وتمارين وفروض",
        "Préparation au concours national": "الاستعداد للمناظرة الوطنية",
        "Des bases solides pour le lycée": "أسس متينة للمرحلة الثانوية",
        "En salle": "حضوريًّا",
        "Petits groupes ; le parent suit les présences et les paiements sur le site.": "مجموعات صغيرة، ويتابع الوليّ الحضور والخلاص عبر الموقع.",
        "À distance": "عن بُعد",
        "Séances en direct par vidéo, et les séries de ton niveau dans ton espace.": "حصص مباشرة بالفيديو، وسلاسل مستواك في فضائك الخاص.",
        "La plateforme éducative": "المنصّة التعليمية",
        "Choisissez l'espace qui vous correspond": "اختر الفضاء المناسب لك",
        "Une seule plateforme réunit l'élève, le parent et le professeur, pour un suivi précis et une communication continue.":
            "منصّة واحدة تجمع التلميذ والوليّ والأستاذ، لمتابعة دقيقة وتواصل مستمر.",
        "Espace élève": "فضاء التلميذ",
        "Séances à venir et lien en direct": "الحصص القادمة ورابط البثّ المباشر",
        "Les séries d'exercices de ton niveau": "سلاسل التمارين الخاصة بمستواك",
        "En salle ou à distance": "حضوريًّا أو عن بُعد",
        "Connexion élève": "دخول التلميذ",
        "Espace parent": "فضاء الوليّ",
        "Présences et absences de votre enfant": "متابعة حضور ابنك وغيابه",
        "Situation des paiements mensuels": "وضعية الخلاص الشهري",
        "Séries et prochaine séance": "السلاسل والحصّة القادمة",
        "🔑 Le code d'accès vous est envoyé par le professeur sur WhatsApp": "🔑 يصلك رمز الدخول من الأستاذ عبر واتساب",
        "Connexion parent": "دخول الوليّ",
        "Cours à distance": "الدراسة عن بُعد",
        "Inscris-toi et choisis ton niveau": "سجّل واختر مستواك الدراسي",
        "Séances en direct par vidéo": "حصص مباشرة بالفيديو",
        "Sur téléphone ou ordinateur": "من الهاتف أو الحاسوب",
        "S'inscrire maintenant": "سجّل الآن",
        "La série « Le petit ingénieur en mathématiques »": "سلسلة «المهندس الصغير في الرياضيات»",
        "Recueil du professeur Faycel, avec corrigés, pour la 7ème, la 8ème et la 9ème année de base.":
            "تجميع الأستاذ فيصل، مع الإصلاح، للسنوات السابعة والثامنة والتاسعة أساسي.",
        "🛒 Commander": "🛒 اطلب الكتاب",
        "Exercices": "تمارين",
        "Devoirs de contrôle 3+4": "فروض مراقبة 3+4",
        "Devoirs de synthèse 2": "فروض تأليفية 2",
        "80 % modèles": "80% نموذجي",
        "✔ Avec corrigés": "✔ مع الإصلاح",
        "Modèles : Sfax · Gabès · Mégrine · Ali Trad · Siliana · Lac · Le Kef": "نماذج: صفاقس · قابس · مقرين · علي طراد · سليانة · البحيرة · الكاف",
        "Ma méthode": "طريقتي",
        "Ma méthode d'enseignement": "منهجيتي في التدريس",
        "Comprendre avant de mémoriser": "الفهم قبل الحفظ",
        "Chaque leçon part de l'idée, puis viennent les exercices.": "ينطلق كلّ درس من الفكرة، ثمّ تأتي التمارين.",
        "Un suivi pour chaque élève": "متابعة كلّ تلميذ",
        "Petits groupes et devoirs de toute l'année, avec corrigés.": "مجموعات صغيرة، وفروض السنة كاملة مع الإصلاح.",
        "Le parent toujours informé": "الوليّ على اطّلاع دائم",
        "Présences, paiements et séries dans l'espace parent du site.": "الحضور والخلاص والسلاسل في فضاء الوليّ على الموقع.",
        "Suivez-moi et contactez-moi": "تابعني وتواصل معي",
        "Cours, conseils et vidéos sur les réseaux sociaux": "دروس ونصائح ومقاطع فيديو على شبكات التواصل",
        "Le petit ingénieur en mathématiques — 7ème année": "المهندس الصغير في الرياضيات: السابعة أساسي",
        "Le petit ingénieur en mathématiques — 8ème année": "المهندس الصغير في الرياضيات: الثامنة أساسي",
        "Le petit ingénieur en mathématiques — 9ème année": "المهندس الصغير في الرياضيات: التاسعة أساسي",
        "Profaycel | Professeur Faycel Khlifi — Maths & Technologie": "Profaycel | الأستاذ فيصل الخليفي: رياضيات وتكنولوجيا",

        // Connexion
        "CONNEXION": "تسجيل الدخول",
        "Bon retour sur": "مرحبًا بعودتك إلى",
        "Profaycel.": "Profaycel",
        "Connectez-vous pour accéder à votre espace.": "سجّل دخولك للوصول إلى فضائك.",
        "Adresse email": "البريد الإلكتروني",
        "Mot de passe": "كلمة المرور",
        "Se souvenir de moi": "تذكّرني",
        "Mot de passe oublié ?": "نسيت كلمة المرور؟",
        "Se connecter →": "← تسجيل الدخول",
        "ou": "أو",
        "Continuer avec Google": "المتابعة باستخدام Google",
        "Pas encore de compte ?": "ليس لديك حساب بعد؟",
        "Créer un compte": "أنشئ حسابًا",
        "← Retour à l'accueil": "→ العودة إلى الرئيسية",
        "votre@email.com": "votre@email.com",
        "Votre mot de passe": "كلمة المرور",
        "Connexion | Profaycel": "تسجيل الدخول | Profaycel",

        // Inscription
        "INSCRIPTION": "إنشاء حساب",
        "Créer votre": "أنشئ",
        "compte Profaycel.": "حسابك في Profaycel.",
        "Rejoignez Profaycel et accédez à votre espace personnel.": "انضمّ إلى Profaycel وادخل إلى فضائك الشخصي.",
        "Nom complet": "الاسم واللقب",
        "Je suis": "أنا",
        "-- Choisir --": "-- اختر --",
        "Élève": "تلميذ",
        "Parent": "وليّ",
        "Enseignant / Admin": "أستاذ / إدارة",
        "Mon niveau": "مستواي",
        "Confirmer le mot de passe": "تأكيد كلمة المرور",
        "J'accepte les conditions d'utilisation et la": "أوافق على شروط الاستخدام و",
        "politique de confidentialité": "سياسة الخصوصية",
        "Créer mon compte →": "← إنشاء حسابي",
        "S'inscrire avec Google": "التسجيل باستخدام Google",
        "Vous avez déjà un compte ?": "لديك حساب؟",
        "Se connecter": "سجّل الدخول",
        "Votre nom complet": "الاسم واللقب",
        "Créez un mot de passe": "أنشئ كلمة مرور",
        "Confirmez le mot de passe": "أكّد كلمة المرور",
        "Inscription | Profaycel": "إنشاء حساب | Profaycel",

        // Page introuvable
        "Oups, cette page": "عذرًا، هذه الصفحة",
        "n'existe pas.": "غير موجودة.",
        "La page que vous recherchez a peut-être été déplacée, supprimée, ou l'adresse est incorrecte.":
            "ربّما نُقلت الصفحة التي تبحث عنها أو حُذفت، أو أنّ العنوان غير صحيح.",
        "Nous contacter": "اتصل بنا",
        "Page introuvable | Profaycel": "الصفحة غير موجودة | Profaycel",

        // Confidentialité
        "CONFIDENTIALITÉ": "الخصوصية",
        "Comment Profaycel utilise et protège vos données. Dernière mise à jour : 11 octobre 2026.":
            "كيف تستعمل Profaycel بياناتك وتحميها. آخر تحديث: 11 أكتوبر 2026.",
        "DONNÉES": "البيانات",
        "Les informations que nous collectons": "المعلومات التي نجمعها",
        "Nom, prénom et adresse email, lors de la création du compte (directement ou avec Google).":
            "الاسم واللقب والبريد الإلكتروني عند إنشاء الحساب (مباشرة أو عبر Google).",
        "Classe, rôle (élève, parent ou enseignant) et lien entre un parent et son enfant.":
            "القسم والصفة (تلميذ أو وليّ أو أستاذ) والربط بين الوليّ وابنه.",
        "Informations pédagogiques : séances, présence, devoirs et résultats.":
            "المعلومات البيداغوجية: الحصص والحضور والفروض والنتائج.",
        "UTILISATION": "الاستعمال",
        "Pourquoi nous les utilisons": "لماذا نستعملها",
        "Ces informations servent uniquement à faire fonctionner la plateforme : vous connecter, afficher vos cours et vos séances en ligne, et permettre aux parents de suivre la scolarité de leur enfant. Elles ne sont ni vendues, ni utilisées pour de la publicité.":
            "تُستعمل هذه المعلومات لتشغيل المنصّة فقط: تسجيل دخولك، وعرض دروسك وحصصك عن بُعد، وتمكين الأولياء من متابعة دراسة أبنائهم. لا تُباع ولا تُستعمل لأغراض إشهارية.",
        "CONNEXION AVEC GOOGLE": "الدخول عبر GOOGLE",
        "Ce que Google nous transmet": "ما يرسله لنا Google",
        "Si vous choisissez « Continuer avec Google », nous recevons seulement votre nom, votre adresse email et votre photo de profil. Nous n'avons accès ni à vos emails, ni à vos fichiers, ni à vos contacts.":
            "إذا اخترت «المتابعة باستخدام Google» فإنّنا نتلقّى اسمك وبريدك الإلكتروني وصورتك الشخصية فقط، ولا نطّلع على رسائلك ولا ملفّاتك ولا جهات اتصالك.",
        "STOCKAGE": "الحفظ",
        "Où sont conservées les données": "أين تُحفظ البيانات",
        "Les données sont hébergées par Supabase, dans un centre de données situé dans l'Union européenne (Francfort). L'accès est protégé : chaque élève ne voit que ses propres informations, et chaque parent uniquement celles de ses enfants.":
            "تُستضاف البيانات لدى Supabase في مركز بيانات داخل الاتحاد الأوروبي (فرانكفورت). الوصول إليها محميّ: لا يرى كلّ تلميذ إلّا معلوماته، ولا يرى كلّ وليّ إلّا معلومات أبنائه.",
        "COURS EN LIGNE": "الدروس عن بُعد",
        "Séances vidéo": "حصص الفيديو",
        "Les séances en ligne ont lieu sur Jitsi Meet (ou un autre service indiqué par l'enseignant). Profaycel n'enregistre pas les séances.":
            "تُقام الحصص عن بُعد على Jitsi Meet (أو خدمة أخرى يحدّدها الأستاذ)، ولا تسجّل Profaycel الحصص.",
        "VOS DROITS": "حقوقك",
        "Consulter ou supprimer vos données": "الاطّلاع على بياناتك أو حذفها",
        "Vous pouvez demander à tout moment l'accès, la correction ou la suppression de vos données et de votre compte en nous écrivant depuis la page":
            "يمكنك في أيّ وقت طلب الاطّلاع على بياناتك أو تصحيحها أو حذفها هي وحسابك، بمراسلتنا من صفحة",
        "ou à": "أو على",
        "Confidentialité | Profaycel": "الخصوصية | Profaycel",

        // Espace élève
        "ESPACE PERSONNEL": "الفضاء الشخصي",
        "Bienvenue dans ton espace élève": "مرحبًا بك في فضاء التلميذ",
        "Retrouvez ici vos cours, devoirs, résultats, documents et informations importantes.":
            "تجد هنا دروسك وفروضك ونتائجك ووثائقك وأهمّ المعلومات.",
        "Statut": "الصيغة",
        "💻 À distance": "💻 عن بُعد",
        "🏫 Présentiel": "🏫 حضوريًّا",
        "Niveau : à choisir": "المستوى: لم يُحدَّد بعد",
        "Niveau : —": "المستوى: —",
        "Niveau :": "المستوى:",
        "MON NIVEAU": "مستواي",
        "Choisis ton niveau": "اختر مستواك",
        "Tu verras ensuite uniquement les séances et les documents de ton niveau.": "ستظهر لك بعد ذلك حصص مستواك ووثائقه فقط.",
        "Valider": "تأكيد",
        "CODE D'ACCÈS": "رمز الدخول",
        "🏫 Élèves en présentiel uniquement": "🏫 خاصّ بتلاميذ الدروس الحضورية",
        "Vous suivez les cours en salle avec le professeur ? Entrez le code reçu par WhatsApp (exemple : PF-AB12CD).":
            "هل تدرس حضوريًّا مع الأستاذ؟ أدخل الرمز الذي وصلك عبر واتساب (مثال: PF-AB12CD).",
        "Les élèves inscrits en ligne n'ont pas besoin de code.": "التلاميذ المسجّلون عن بُعد لا يحتاجون إلى رمز.",
        "Mes prochaines séances": "حصصي القادمة",
        "Cliquez sur « Rejoindre le cours » à l'heure de la séance pour suivre le cours à distance.":
            "اضغط على «الالتحاق بالحصة» في موعدها لمتابعة الدرس عن بُعد.",
        "Aucune séance prévue pour le moment.": "لا توجد حصص مبرمجة حاليًّا.",
        "Impossible de charger les séances.": "تعذّر تحميل الحصص.",
        "● En direct": "● مباشر",
        "Date :": "التاريخ:",
        "Heure :": "الساعة:",
        "Lieu :": "المكان:",
        "En ligne": "عن بُعد",
        "🎥 Rejoindre le cours": "🎥 الالتحاق بالحصة",
        "DOCUMENTS": "الوثائق",
        "📁 Mes documents": "📁 وثائقي",
        "Les séries d'exercices de ton niveau.": "سلاسل التمارين الخاصة بمستواك.",
        "Choisis ton niveau ci-dessus pour voir tes documents.": "اختر مستواك أعلاه لتظهر لك وثائقك.",
        "Tes documents apparaîtront ici dès que ton niveau sera connu.": "ستظهر وثائقك هنا حالما يُحدَّد مستواك.",
        "Aucun document pour le moment.": "لا توجد وثائق حاليًّا.",
        "Aucune série pour le moment.": "لا توجد سلاسل حاليًّا.",
        "Impossible de charger les documents.": "تعذّر تحميل الوثائق.",
        "Série d'exercices": "سلسلة تمارين",
        "Document": "وثيقة",
        "📄 Ouvrir": "📄 فتح",
        "Tous les niveaux": "كلّ المستويات",
        "Chargement...": "جارٍ التحميل...",
        "Accéder aux cours et aux contenus pédagogiques.": "الوصول إلى الدروس والمحتوى البيداغوجي.",
        "Voir les cours →": "← عرض الدروس",
        "Mes devoirs": "فروضي",
        "Retrouvez vos exercices, devoirs et travaux à réaliser.": "تجد هنا تمارينك وفروضك والأعمال المطلوبة.",
        "Voir les devoirs →": "← عرض الفروض",
        "Mes résultats": "نتائجي",
        "Consultez vos évaluations et votre progression.": "اطّلع على تقييماتك وتقدّمك.",
        "Voir les résultats →": "← عرض النتائج",
        "Mes séances": "حصصي",
        "Consultez vos séances et votre présence.": "اطّلع على حصصك وحضورك.",
        "Voir les séances →": "← عرض الحصص",
        "Mes documents": "وثائقي",
        "Retrouvez vos fichiers, supports et documents.": "تجد هنا ملفّاتك ووثائقك.",
        "Voir les documents →": "← عرض الوثائق",
        "Annonces": "الإعلانات",
        "Consultez les dernières informations importantes.": "اطّلع على آخر المستجدّات المهمّة.",
        "Voir les annonces →": "← عرض الإعلانات",
        "Espace Élève | Profaycel": "فضاء التلميذ | Profaycel",
        "Bienvenue": "مرحبًا",

        // Espace parent
        "ESPACE PARENT": "فضاء الوليّ",
        "Suivez la progression de votre enfant": "تابع تقدّم ابنك",
        "Retrouvez facilement les informations importantes concernant les cours, les résultats, les absences, les devoirs et le suivi pédagogique de votre enfant.":
            "تجد بسهولة أهمّ المعلومات المتعلّقة بدروس ابنك ونتائجه وغياباته وفروضه ومتابعته البيداغوجية.",
        "PARENT": "الوليّ",
        "Bienvenue dans votre espace": "مرحبًا بك في فضائك",
        "Vous pouvez consulter ici les principales informations relatives à la scolarité de votre enfant.":
            "يمكنك هنا الاطّلاع على أهمّ المعلومات المتعلّقة بدراسة ابنك.",
        "Compte": "الحساب",
        "Actif": "مفعّل",
        "MON ENFANT": "ابني",
        "Classe :": "القسم:",
        "Prochaine séance": "الحصّة القادمة",
        "Pas encore programmée": "لم تُبرمج بعد",
        "🎥 Lien du cours": "🎥 رابط الحصة",
        "Présences": "الحضور",
        "Les présences apparaîtront ici après chaque séance.": "يظهر الحضور هنا بعد كلّ حصة.",
        "Séries d'exercices": "سلاسل التمارين",
        "✅ Payé": "✅ تمّ الخلاص",
        "⚠️ Paiement attendu": "⚠️ في انتظار الخلاص",
        "—": "—",
        "Lier mon enfant": "ربط حساب ابني",
        "Lier un autre enfant": "ربط ابن آخر",
        "Entrez le code reçu par WhatsApp de la part du professeur (exemple : PF-AB12CD).":
            "أدخل الرمز الذي أرسله لك الأستاذ عبر واتساب (مثال: PF-AB12CD).",
        "Les cours": "الدروس",
        "Consultez les cours et les ressources pédagogiques disponibles pour votre enfant.": "اطّلع على الدروس والموارد البيداغوجية المتاحة لابنك.",
        "Consulter →": "← اطّلاع",
        "Présence & absences": "الحضور والغياب",
        "Suivez la présence de votre enfant et consultez son historique d'absences.": "تابع حضور ابنك واطّلع على سجلّ غياباته.",
        "Résultats": "النتائج",
        "Consultez les notes, évaluations et l'évolution des résultats.": "اطّلع على الأعداد والتقييمات وتطوّر النتائج.",
        "Devoirs": "الفروض",
        "Retrouvez les devoirs, exercices et travaux demandés.": "تجد هنا الفروض والتمارين والأعمال المطلوبة.",
        "Documents": "الوثائق",
        "Accédez aux documents et fichiers importants concernant votre enfant.": "الوصول إلى الوثائق والملفّات المهمّة الخاصة بابنك.",
        "Retrouvez les informations, annonces et communications importantes.": "تجد هنا المعلومات والإعلانات والمراسلات المهمّة.",
        "COMMUNICATION": "التواصل",
        "Besoin d'une information ?": "هل تحتاج إلى معلومة؟",
        "Pour toute question concernant votre enfant, vous pouvez contacter directement Profaycel.": "لأيّ سؤال يخصّ ابنك، يمكنك التواصل مباشرة مع Profaycel.",
        "Contacter": "تواصل معنا",
        "Espace Parent | Profaycel": "فضاء الوليّ | Profaycel",

        // Messages (script.js)
        "Veuillez remplir tous les champs.": "يُرجى تعمير كلّ الخانات.",
        "Les mots de passe ne correspondent pas.": "كلمتا المرور غير متطابقتين.",
        "Le mot de passe doit contenir au moins 6 caractères.": "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل.",
        "Choisissez votre niveau.": "اختر مستواك.",
        "Choisissez d'abord : Élève, Parent ou Enseignant.": "اختر أوّلًا: تلميذ أو وليّ أو أستاذ.",
        "Vous n'êtes pas autorisé à créer un compte Admin.": "لا يمكنك إنشاء حساب إدارة.",
        "Compte créé avec succès !": "تمّ إنشاء الحساب بنجاح!",
        "Connexion réussie !": "تمّ تسجيل الدخول بنجاح!",
        "Erreur : Supabase non connecté.": "خطأ: تعذّر الاتصال بالخادم.",
        "Niveau enregistré ✅": "تمّ حفظ المستوى ✅",
        "Code invalide": "الرمز غير صحيح",
        "Non connecté": "يجب تسجيل الدخول أوّلًا",
        "Cet élève est déjà lié à un autre compte parent": "هذا التلميذ مرتبط بحساب وليّ آخر",
        "Ce code est déjà utilisé par un autre compte élève": "هذا الرمز مستعمل في حساب تلميذ آخر",
        "Niveau déjà choisi : demandez au professeur pour le changer": "المستوى محدّد مسبقًا: اطلب من الأستاذ تغييره",
        "Niveau inconnu": "مستوى غير معروف",
        "Erreur : Invalid login credentials": "خطأ: البريد الإلكتروني أو كلمة المرور غير صحيحة",
        "Erreur : Email not confirmed": "خطأ: لم يتمّ تأكيد البريد الإلكتروني بعد",
        "Erreur : User already registered": "خطأ: هذا البريد الإلكتروني مسجّل مسبقًا",

        // Documents (trimestres, matières, visionneuse)
        "Trimestre 1": "الثلاثي الأوّل",
        "Trimestre 2": "الثلاثي الثاني",
        "Trimestre 3": "الثلاثي الثالث",
        "Autres documents": "وثائق أخرى",
        "Mathématiques": "الرياضيات",
        "Technologie": "التكنولوجيا",
        "Informatique": "الإعلامية",
        "Correction": "إصلاح",
        "Cours": "درس",
        "Devoir": "فرض",
        "Document": "وثيقة",
        "👁️ Voir": "👁️ عرض",
        "⬇️ Télécharger": "⬇️ تحميل",
        "Fermer": "إغلاق",
        "Précédente": "السابقة",
        "Suivante": "التالية",
        "💬 Contacter sur WhatsApp": "💬 التواصل عبر واتساب",

        // Espace élève (niveau, code, documents)
        "Tes séances et tes documents, au même endroit.": "حصصك ووثائقك في مكان واحد.",
        "Ton espace sera préparé pour ton niveau : séances et documents.": "سيُهيّأ فضاؤك حسب مستواك: الحصص والوثائق.",
        "🏫 Tu étudies en présentiel avec le professeur ? Entre ton code": "🏫 هل تدرس حضوريًّا مع الأستاذ؟ أدخل رمزك",
        "Choisis la matière, puis le trimestre.": "اختر المادّة ثمّ الثلاثي.",
        "Bientôt": "قريبًا",
        "Autres matières": "بقية المواد",

        // Choix de la langue
        "Choisissez votre langue": "اختر لغتك"

    };

    // Textes qui contiennent une valeur (nom, nombre, date…)
    const MOTIFS = [
        [/^Bienvenue, (.+)$/, "مرحبًا، $1"],
        [/^(\d+) séance\(s\)$/, "$1 حصة"],
        [/^Ce mois : (\d+) \/ (\d+)$/, "هذا الشهر: $1 / $2"],
        [/^(\d+) mois payé\(s\) · (\d+) DT \/ mois$/, "$1 شهر مدفوع · $2 د / الشهر"],
        [/^(\d{4}-\d{2}-\d{2}) à (\d{2}:\d{2})$/, "$1 على الساعة $2"],
        [/^✅ Présent\(e\) — (.+?) ·$/, "✅ حاضر — $1 ·"],
        [/^❌ Absent\(e\) — (.+?) ·$/, "❌ غائب — $1 ·"],
        [/^Compte lié à (.+) ✅$/, "تمّ ربط الحساب بـ $1 ✅"],
        [/^👁️ Voir \((\d+) pages\)$/, "👁️ عرض ($1 صفحات)"],
        [/^Page (\d+) \/ (\d+)$/, "الصفحة $1 / $2"],
        [/^(.+) · (Mathématiques|Technologie|Informatique)$/, function (tout, type, matiere) { return (AR[type] || type) + " · " + AR[matiere]; }],
        [/^(\d+) document\(s\)$/, function (tout, n) {
            n = Number(n);
            return n === 1 ? "وثيقة واحدة" : n === 2 ? "وثيقتان" : n <= 10 ? n + " وثائق" : n + " وثيقة";
        }],
        [/^Série n°(\d+)$/, "سلسلة عدد $1"],
        [/^Correction de la série n°(\d+)$/, "إصلاح سلسلة عدد $1"],
        [/^Cours n°(\d+)$/, "درس عدد $1"],
        [/^Devoir n°(\d+)$/, "فرض عدد $1"],
        [/^Erreur : (.+)$/, "خطأ: $1"]
    ];

    function normaliser(texte) {
        return texte.replace(/\s+/g, " ").trim();
    }

    function traduire(texte) {

        if (langue !== "ar" || !texte) {
            return texte;
        }

        const cle = normaliser(texte);

        if (Object.prototype.hasOwnProperty.call(AR, cle)) {
            return AR[cle];
        }

        for (const [motif, remplacement] of MOTIFS) {
            if (motif.test(cle)) {
                const resultat = cle.replace(motif, remplacement);
                // le message d'erreur lui-même peut être connu
                return resultat.replace(/^خطأ: (.+)$/, function (tout, message) {
                    return AR[message] ? "خطأ: " + AR[message] : tout;
                });
            }
        }

        return texte;

    }

    // Utilisable depuis script.js (messages, toasts…)
    window.t = traduire;


    // -------------------------------------------------
    // Messages WhatsApp (liens data-wa)
    // -------------------------------------------------

    const NUMERO_WHATSAPP = "21697699271";

    const MESSAGES_WA = {
        inscription: {
            fr: "Bonjour Professeur Faycel, je souhaite inscrire mon enfant à vos cours.",
            ar: "السلام عليكم أستاذ فيصل، أرغب في تسجيل ابني في دروسكم."
        },
        livre7: {
            fr: "Bonjour Professeur Faycel, je souhaite commander le livre « Le petit ingénieur en mathématiques » — 7ème année de base.",
            ar: "السلام عليكم أستاذ فيصل، أرغب في طلب كتاب «المهندس الصغير في الرياضيات»، السابعة أساسي."
        },
        livre8: {
            fr: "Bonjour Professeur Faycel, je souhaite commander le livre « Le petit ingénieur en mathématiques » — 8ème année de base.",
            ar: "السلام عليكم أستاذ فيصل، أرغب في طلب كتاب «المهندس الصغير في الرياضيات»، الثامنة أساسي."
        },
        livre9: {
            fr: "Bonjour Professeur Faycel, je souhaite commander le livre « Le petit ingénieur en mathématiques » — 9ème année de base.",
            ar: "السلام عليكم أستاذ فيصل، أرغب في طلب كتاب «المهندس الصغير في الرياضيات»، التاسعة أساسي."
        },
        contact: {
            fr: "Bonjour Professeur Faycel,",
            ar: "السلام عليكم أستاذ فيصل،"
        }
    };

    function preparerLiensWhatsApp() {

        document.querySelectorAll("[data-wa]").forEach(function (lien) {

            const message = MESSAGES_WA[lien.dataset.wa];

            if (message) {
                lien.href = "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(message[langue]);
            }

        });

    }


    // -------------------------------------------------
    // Traduction de la page
    // -------------------------------------------------

    const ATTRIBUTS = ["placeholder", "aria-label", "title", "alt"];

    function traduireNoeud(racine) {

        if (racine.nodeType === Node.TEXT_NODE) {
            traduireTexte(racine);
            return;
        }

        if (racine.nodeType !== Node.ELEMENT_NODE || racine.closest("[data-no-i18n], script, style")) {
            return;
        }

        traduireAttributs(racine);
        racine.querySelectorAll("*").forEach(traduireAttributs);

        const marcheur = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT);
        const noeuds = [];
        let noeud;

        while ((noeud = marcheur.nextNode())) {
            noeuds.push(noeud);
        }

        noeuds.forEach(traduireTexte);

    }

    function traduireTexte(noeud) {

        const parent = noeud.parentElement;

        if (!parent || parent.closest("[data-no-i18n], script, style")) {
            return;
        }

        const valeur = noeud.nodeValue;

        if (!valeur || !valeur.trim()) {
            return;
        }

        const traduit = traduire(valeur);

        if (traduit !== valeur) {
            const debut = valeur.match(/^\s*/)[0];
            const fin = valeur.match(/\s*$/)[0];
            noeud.nodeValue = debut + traduit + fin;
        }

    }

    function traduireAttributs(element) {

        ATTRIBUTS.forEach(function (attribut) {

            const valeur = element.getAttribute(attribut);

            if (valeur) {
                const traduit = traduire(valeur);
                if (traduit !== valeur) {
                    element.setAttribute(attribut, traduit);
                }
            }

        });

    }


    // -------------------------------------------------
    // Bouton « ع | FR » et choix au premier passage
    // -------------------------------------------------

    function changerLangue(nouvelle) {

        ecrireLangue(nouvelle);

        if (nouvelle !== langue) {
            window.location.reload();
        }

    }

    function ajouterBoutonLangue() {

        const actions = document.querySelector(".header-actions");

        if (!actions || actions.querySelector(".lang-switch")) {
            return;
        }

        const bouton = document.createElement("div");
        bouton.className = "lang-switch";
        bouton.setAttribute("data-no-i18n", "");
        bouton.innerHTML =
            '<button type="button" data-l="ar" lang="ar">ع</button>' +
            '<button type="button" data-l="fr">FR</button>';

        bouton.querySelectorAll("button").forEach(function (b) {
            b.classList.toggle("on", b.dataset.l === langue);
            b.addEventListener("click", function () {
                changerLangue(b.dataset.l);
            });
        });

        actions.appendChild(bouton);

    }

    function proposerChoixLangue() {

        const fond = document.createElement("div");
        fond.className = "modal-overlay active lang-choice";
        fond.setAttribute("data-no-i18n", "");
        fond.innerHTML =
            '<div class="modal-box lang-choice-box">' +
                '<div class="lang-choice-logo">Pro<span>faycel</span></div>' +
                '<p><span lang="ar" dir="rtl">اختر لغتك</span> · Choisissez votre langue</p>' +
                '<div class="lang-choice-buttons">' +
                    '<button type="button" data-l="ar" lang="ar">العربية</button>' +
                    '<button type="button" data-l="fr">Français</button>' +
                '</div>' +
            '</div>';

        fond.querySelectorAll("button").forEach(function (b) {
            b.addEventListener("click", function () {
                ecrireLangue(b.dataset.l);
                if (b.dataset.l === langue) {
                    fond.remove();
                } else {
                    window.location.reload();
                }
            });
        });

        document.body.appendChild(fond);

    }


    // -------------------------------------------------
    // Démarrage
    // -------------------------------------------------

    if (langue === "ar") {

        document.documentElement.lang = "ar";
        document.documentElement.dir = "rtl";

        const police = document.createElement("link");
        police.rel = "stylesheet";
        police.href = "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap";
        document.head.appendChild(police);

        document.title = traduire(document.title);

    }

    function demarrer() {

        preparerLiensWhatsApp();

        if (langue === "ar") {

            traduireNoeud(document.body);

            // Textes ajoutés ensuite par script.js (cartes, messages…)
            new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.type === "characterData") {
                        traduireTexte(mutation.target);
                    } else {
                        mutation.addedNodes.forEach(traduireNoeud);
                    }
                });
            }).observe(document.body, { childList: true, subtree: true, characterData: true });

        }

        if (!estAdmin) {

            ajouterBoutonLangue();

            if (langueChoisie !== "ar" && langueChoisie !== "fr") {
                proposerChoixLangue();
            }

        }

    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            setTimeout(demarrer, 0);
        });
    } else {
        setTimeout(demarrer, 0);
    }

})();
