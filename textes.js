// Jour Zéro — tous les textes de l'app, au même endroit.
//
// Ce fichier est lu par la page ET par le service worker (pour composer les
// notifications). Il ne doit donc contenir que des données : pas de document,
// pas de window, pas de fonction qui touche à la page.
//
// Le ton : complice et chaleureux, un peu taquin quand tout va bien. Jamais
// de blague sur une rechute, jamais de reproche. Quand quelqu'un craque ou
// lutte contre une envie, on parle doucement et on va droit au but.
//
// {n} est remplacé par un nombre, {prenom} par le prénom.

const TEXTES = {

    // ---------- Le compteur ----------
    compteur: {
        un: "jour sans consommer",
        plusieurs: "jours sans consommer",
        avantUn: "jour avant ton jour zéro",
        avantPlusieurs: "jours avant ton jour zéro",
        prochainPalier: "Prochain palier : {n} jours",
        prochainPalierUn: "Prochain palier : 1 jour",
        tousPaliers: "Tous les paliers passés. Tu joues hors catégorie.",
        objectifAtteint: "Objectif atteint : {n} jours. Respect.",
        objectifUnJour: "Plus qu'un jour avant ton objectif de {n}.",
        objectifReste: "Encore {reste} jours avant ton objectif de {n}."
    },

    // La raison choisie à l'inscription, rappelée sous le compteur. Elle ne
    // s'affiche que sur l'appareil, jamais dans un partage ou une capture.
    raisons: {
        permis: "Pour récupérer ton permis.",
        sante: "Pour ta santé.",
        argent: "Pour ton porte-monnaie.",
        sommeil: "Pour mieux dormir."
    },

    // ---------- Les salutations du bilan ----------
    salut: {
        matin: { mot: "Bonjour", question: "la journée s'annonce comment ?" },
        aprem: { mot: "Salut", question: "ça se passe comment jusqu'ici ?" },
        soir: { mot: "Bonsoir", question: "c'était comment, aujourd'hui ?" }
    },

    // ---------- Les chiffres ----------
    stats: {
        argent: "CHF gardés",
        envies: "envies tenues",
        serie: "meilleure série"
    },

    // ---------- Les boutons ----------
    boutons: {
        envie: "Résister à l'envie",
        ecart: "J'ai craqué",
        noter: "Noter ce moment",
        confirmer: "Confirmer",
        annuler: "Annuler"
    },

    // ---------- Quand l'envie monte ----------
    // Lu en pleine envie : une phrase, qui se lit d'un coup d'œil.
    astucesEnvie: [
        "Une envie dure rarement plus d'un quart d'heure. Tiens une heure, pas toute ta vie.",
        "Change de pièce, change de rue. L'envie est souvent accrochée à un endroit.",
        "Occupe tes mains. Ça marche mieux que d'essayer de ne pas y penser.",
        "Avoir envie n'est pas avoir craqué.",
        "Un grand verre d'eau, et respire lentement. Ça passe.",
        "Un jour à la fois. Ne compte pas ceux qui restent.",
        "Sors marcher dix minutes. L'envie tiendra rarement le trajet.",
        "Regarde ton compteur. C'est ça que tu protèges, là, maintenant."
    ],

    // ---------- Quand on a craqué ----------
    // Calme, doux, sans reproche. Jamais de blague ici.
    messagesEcart: [
        "Un écart n'efface pas ce que tu as tenu avant.",
        "Ça arrive. Ce qui compte, c'est l'heure qui vient.",
        "Note ce qui s'est passé juste avant. C'est là qu'est l'info utile.",
        "Demain matin, tu es déjà à un jour.",
        "Tu n'as pas tout perdu. Tu as juste un jour à refaire."
    ],
    ecartAnnule: "Écart annulé. On fait comme si de rien n'était.",
    ecartQuand: "C'était quand ?",
    ecartAvant: "Qu'est-ce qui s'est passé juste avant ?",
    ecartAvantAide: "Où tu étais, avec qui, ce qui a déclenché.",

    // ---------- Le bilan de la journée ----------
    bilan: {
        choisirNiveau: "Choisis d'abord : facile, moyen ou difficile.",
        note: "Noté. Merci de passer.",
        noteAide: "Un mot sur ce moment, si tu veux.",
        surLaJournee: "sur la journée",
        envieResistee: "envie tenue",
        consommation: "consommation"
    },

    // ---------- Les écrans vides ----------
    vides: {
        carnet: "Ton carnet se remplira à partir de ton jour zéro. Pour l'instant, il t'attend.",
        bilanPeriode: "Note tes moments quelques jours : je te dirai <strong>à quelle heure</strong> c'est le plus dur pour toi.",
        collection: "Pas encore d'autocollant. Le premier arrive vite : il suffit d'un jour.",
        jourDetail: "Touche un carré pour revoir la journée."
    },

    // ---------- Les paliers : la petite fête ----------
    celebrations: {
        1: { titre: "Premier jour !", texte: "Vingt-quatre heures. Le compteur tourne, et c'est toi qui l'as lancé." },
        3: { titre: "Trois jours", texte: "Le corps râle un peu, c'est normal : il se réajuste. Toi, tu tiens." },
        7: { titre: "Une semaine !", texte: "Sept jours. Le plus dur est derrière toi, et tu étais là pour chacun." },
        14: { titre: "Deux semaines", texte: "Le sommeil et l'humeur reviennent en général maintenant. Profite." },
        30: { titre: "Un mois !", texte: "Trente jours. Ce n'est plus un essai, c'est une habitude." },
        60: { titre: "Deux mois", texte: "Soixante jours. Regarde ton carnet : tu as traversé des journées pas simples." },
        90: { titre: "Trois mois", texte: "À ce stade, c'est ta nouvelle normale. Elle te va bien." },
        180: { titre: "Six mois", texte: "Une demi-année. On ne va pas en faire un discours : chapeau." },
        365: { titre: "Un an !", texte: "Trois cent soixante-cinq jours. Jour zéro, c'était il y a un an." }
    },
    objectifFete: { titre: "Objectif atteint", texte: "Tu t'étais donné {n} jours. Tu y es." },
    feteFermer: "Touche pour fermer",
    nouveauSticker: "Nouvel autocollant : {nom}. Il t'attend dans ta collection.",

    // ---------- La collection d'autocollants ----------
    // Chaque autocollant se gagne une fois et ne se perd plus.
    stickers: {
        titre: "Ta collection",
        compte: "{n} sur {total}",
        verrouille: "À débloquer",
        liste: [
            { id: "j1", nombre: 1, mot: "JOUR", nom: "Premier jour", indice: "Tenir une journée." },
            { id: "j3", nombre: 3, mot: "JOURS", nom: "Trois jours", indice: "Tenir trois jours d'affilée." },
            { id: "j7", nombre: 7, mot: "JOURS", nom: "Première semaine", indice: "Une semaine d'affilée." },
            { id: "j14", nombre: 14, mot: "JOURS", nom: "Deux semaines", indice: "Deux semaines d'affilée." },
            { id: "j30", nombre: 30, mot: "JOURS", nom: "Un mois", indice: "Trente jours d'affilée." },
            { id: "j60", nombre: 60, mot: "JOURS", nom: "Deux mois", indice: "Soixante jours d'affilée." },
            { id: "j90", nombre: 90, mot: "JOURS", nom: "Trois mois", indice: "Quatre-vingt-dix jours d'affilée." },
            { id: "j180", nombre: 180, mot: "JOURS", nom: "Six mois", indice: "Une demi-année d'affilée." },
            { id: "j365", nombre: 365, mot: "JOURS", nom: "Un an", indice: "Une année entière." },
            { id: "envie1", dessin: "main", mot: "TENU", nom: "Première envie tenue", indice: "Tenir face à une envie." },
            { id: "envie10", dessin: "mains", mot: "×10", nom: "Dix envies tenues", indice: "Dix envies, dix fois non." },
            { id: "moment1", dessin: "crayon", mot: "NOTÉ", nom: "Premier moment noté", indice: "Noter comment se passe ta journée." },
            { id: "abri", dessin: "bouclier", mot: "À L'ABRI", nom: "Données à l'abri", indice: "Exporter une sauvegarde." },
            { id: "toujours", dessin: "soleil", mot: "ENCORE", nom: "Toujours là", indice: "Repartir et tenir trois jours." }
        ]
    },

    // ---------- Les réglages : confirmations ----------
    reglages: {
        dateFuture: "C'est noté. L'app t'attend jusque-là.",
        date: "Date d'arrêt enregistrée.",
        objectifRetire: "Objectif retiré. Liberté totale.",
        objectif: "Objectif enregistré.",
        depense: "Dépense enregistrée.",
        aucunRappel: "Aucun rappel : silence radio.",
        unRappel: "Un rappel par jour.",
        deuxRappels: "Deux rappels par jour, matin et soir.",
        notifOk: "C'est bon. Ton rappel arrivera à l'heure choisie.",
        notifAutorisees: "Notifications autorisées sur cet appareil.",
        notifRefusees: "Tu as refusé les notifications. Pour changer d'avis : Réglages iOS → Jour Zéro → Notifications.",
        notifImpossible: "Ce navigateur ne sait pas afficher de notifications.",
        sauvegardeJamais: "Tu n'as jamais exporté tes données. Un copier-coller gardé quelque part, et tu ne risques plus de tout perdre.",
        sauvegardeAujourdhui: "Dernière sauvegarde aujourd'hui. Bien joué.",
        sauvegardeHier: "Dernière sauvegarde hier.",
        sauvegardeIlYa: "Dernière sauvegarde il y a {n} jours.",
        exportPret: "Ton code est prêt et déjà sélectionné. Copie-le maintenant (⌘C sur Mac, appui long puis Copier sur téléphone) et envoie-le-toi.",
        importVide: "Le cadre est vide. Colle d'abord le code que tu t'es envoyé.",
        importIllisible: "Ce code n'est pas lisible. Vérifie que tu l'as copié en entier.",
        importConfirmer: "Remplacer les données de cet appareil par celles du code ? Ce qui est sur cet appareil sera perdu.",
        importOk: "Données importées. La page se recharge."
    },

    // ---------- Les notifications ----------
    // Composées sur le téléphone, par le service worker.
    notifications: {
        matin: [
            "Une journée de plus commence. Une seule à la fois.",
            "Aujourd'hui aussi, c'est jouable.",
            "Le plus dur est souvent le soir. Tu le sais, c'est déjà ça.",
            "Rien de spécial à faire. Juste ne pas commencer.",
            "Si une envie monte aujourd'hui, tu as un bouton pour ça."
        ],
        soir: "Alors, cette journée ? Une touche suffit.",
        astuces: [
            "Une envie dure rarement plus d'un quart d'heure.",
            "Change de pièce, change de rue. L'envie est souvent accrochée à un endroit.",
            "Occupe tes mains. Ça marche mieux que d'essayer de ne pas y penser.",
            "Avoir envie n'est pas avoir craqué.",
            "Sors marcher dix minutes. L'envie tiendra rarement le trajet."
        ],
        demain: "Demain, jour zéro",
        demainTexte: "C'est demain. Tu as tout ce qu'il faut.",
        dansNJours: "Dans {n} jours",
        dansNJoursTexte: "Ton jour zéro approche. Prépare-le, ça compte.",
        test: "Voilà à quoi ressemblera ton rappel."
    },

    // ---------- Les astuces de l'écran Repères ----------
    // La dernière rubrique renvoie vers de l'aide : elle doit rester.
    astuces: [
        {
            titre: "Quand l'envie monte",
            liste: [
                "Une envie dure rarement plus d'un quart d'heure. Tiens une heure, pas toute ta vie.",
                "Change de pièce, change de rue. L'envie est souvent accrochée à un endroit.",
                "Occupe tes mains. Ça marche mieux que d'essayer de ne pas y penser.",
                "Avoir envie n'est pas avoir craqué. La ressentir ne veut pas dire que tu as échoué."
            ]
        },
        {
            titre: "Avec les potes qui fument",
            liste: [
                "Décide avant d'y aller. Sur place, c'est trop tard pour réfléchir.",
                "Les premières semaines, évite si tu peux. Pas de la faiblesse : de la stratégie.",
                "Dis-le à un seul pote du groupe. Tu as un allié au lieu d'être seul contre l'ambiance.",
                "L'alcool fait tomber tes défenses avant le cannabis. Surveille-le en premier."
            ]
        },
        {
            titre: "Les premiers jours",
            liste: [
                "Le plus dur tombe vers le 4e-6e jour, puis ça redescend. C'est de la chimie, pas de la volonté.",
                "Sommeil pourri, irritabilité, rêves bizarres : c'est le sevrage, pas toi qui changes de personnalité.",
                "Un jour à la fois. Ne compte pas ceux qui restent."
            ]
        },
        {
            titre: "Au quotidien",
            liste: [
                "Bouge. La fatigue physique remplace celle que tu allais chercher dans le joint.",
                "Vide la maison. Ce qui traîne finit toujours par servir.",
                "Regarde ce que tu économises. Le chiffre fait plus d'effet que les bonnes intentions.",
                "Si tu remplaces par la cigarette, tu changes juste de dépendance."
            ]
        },
        {
            titre: "Quand ça ne suffit pas",
            liste: [
                "Demander de l'aide n'est pas un échec. En Suisse, Stop-Cannabis.ch et ton médecin sont gratuits et confidentiels."
            ]
        }
    ]
};

// Remplace {n}, {nom}… dans un texte.
function texteAvec(modele, valeurs) {
    return modele.replace(/\{(\w+)\}/g, function (tout, cle) {
        return valeurs[cle] !== undefined ? valeurs[cle] : tout;
    });
}
