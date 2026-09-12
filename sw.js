// Jour Zéro — le service worker.
//
// Ce fichier ne tourne pas dans la page : il tourne à côté, sur le téléphone,
// et il reste vivant même quand l'app est fermée. C'est lui qui reçoit les
// notifications envoyées par le serveur et qui les affiche.

self.addEventListener("install", function () {
    // On prend la main tout de suite au lieu d'attendre la fermeture des pages.
    self.skipWaiting();
});

self.addEventListener("activate", function (evenement) {
    evenement.waitUntil(self.clients.claim());
});

// ATTENTION : si un push arrive et qu'aucune notification n'est affichée, iOS
// considère que l'app envoie des messages silencieux et coupe l'abonnement.
// D'où le waitUntil, et le message par défaut si le serveur n'envoie rien.
self.addEventListener("push", function (evenement) {
    let contenu = {};

    try {
        contenu = evenement.data ? evenement.data.json() : {};
    } catch (erreur) {
        contenu = {};
    }

    const titre = contenu.titre || "Jour Zéro";
    const corps = contenu.corps || "Comment s'est passée ta journée ?";

    evenement.waitUntil(
        self.registration.showNotification(titre, {
            body: corps,
            icon: "icone-192.png",
            badge: "icone-192.png",
            tag: "jour-zero",
            data: { url: "./" }
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
