// Jour Zéro — le service worker.
//
// Ce fichier ne tourne pas dans la page : il tourne à côté, sur le téléphone,
// et il reste vivant quand l'app est fermée. C'est lui qui reçoit les
// notifications envoyées par le serveur et qui les affiche.
//
// Point important : le serveur ne sait RIEN de toi. Il envoie un signal vide.
// C'est ici, sur ton téléphone, que le message est composé avec ton nombre de
// jours et ce que tu as déjà noté. Tes données ne partent jamais.

const RANGEMENT_ETAT = "jour-zero-etat";
const ADRESSE_ETAT = "./etat.json";

// Les mêmes conseils que dans l'app, pour les jours où tu as déjà noté.
const ASTUCES = [
    "Une envie dure rarement plus d'un quart d'heure.",
    "Change de pièce, change de rue. L'envie est souvent accrochée à un endroit.",
    "Occupe tes mains. Ça marche mieux que d'essayer de ne pas y penser.",
    "Avoir envie n'est pas avoir craqué.",
    "Sors marcher dix minutes. L'envie tiendra rarement le trajet."
];

self.addEventListener("install", function () {
    // On prend la main tout de suite au lieu d'attendre la fermeture des pages.
    self.skipWaiting();
});

self.addEventListener("activate", function (evenement) {
    evenement.waitUntil(self.clients.claim());
});

// Ce que la page a laissé pour nous : son compteur et sa dernière note.
async function lireEtat() {
    try {
        const rangement = await caches.open(RANGEMENT_ETAT);
        const reponse = await rangement.match(ADRESSE_ETAT);

        if (!reponse) {
            return null;
        }

        return await reponse.json();
    } catch (erreur) {
        return null;
    }
}

// Le message dépend de ce que tu as déjà fait aujourd'hui : s'il te manque
// une note, on te la demande ; sinon on ne redemande rien, on t'encourage.
function composer(etat) {
    if (!etat) {
        return {
            titre: "Jour Zéro",
            corps: "Comment s'est passée ta journée ?"
        };
    }

    const jours = etat.jours;
    const titre = jours === 1 ? "1 jour" : jours + " jours";

    if (etat.noteAujourdhui) {
        const numero = Math.floor(Math.random() * ASTUCES.length);
        return { titre: titre, corps: ASTUCES[numero] };
    }

    return { titre: titre, corps: "Comment s'est passée ta journée ?" };
}

// ATTENTION : si un push arrive et qu'aucune notification n'est affichée, iOS
// considère que l'app envoie des messages silencieux et coupe l'abonnement.
// D'où le waitUntil, et le message par défaut si rien n'est lisible.
self.addEventListener("push", function (evenement) {
    evenement.waitUntil(
        lireEtat().then(function (etat) {
            const message = composer(etat);

            return self.registration.showNotification(message.titre, {
                body: message.corps,
                icon: "icone-192.png",
                badge: "icone-192.png",
                tag: "jour-zero",
                data: { url: "./" }
            });
        })
    );
});

// Toucher la notification ouvre l'app, ou la ramène au premier plan si elle
// est déjà ouverte quelque part.
self.addEventListener("notificationclick", function (evenement) {
    evenement.notification.close();

    evenement.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true })
            .then(function (fenetres) {
                for (let i = 0; i < fenetres.length; i++) {
                    if ("focus" in fenetres[i]) {
                        return fenetres[i].focus();
                    }
                }

                if (self.clients.openWindow) {
                    return self.clients.openWindow("./");
                }
            })
    );
});
