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

// Les textes des notifications viennent du meme fichier que ceux de l'app.
importScripts("textes.js");

const MATIN = TEXTES.notifications.matin;
const ASTUCES = TEXTES.notifications.astuces;

// ---------- L'app hors ligne ----------
//
// La page, ses textes, ses polices et ses images sont gardes sur le
// telephone. Changer le numero de version force le telechargement de tout
// ce qui suit a la prochaine ouverture ; l'ancienne copie est alors effacee.
// Le rangement de l'etat (RANGEMENT_ETAT) n'est jamais touche : c'est lui qui
// permet de composer les notifications.
const VERSION_APP = "jour-zero-app-v3";
const FICHIERS_APP = [
    "./",
    "index.html",
    "textes.js",
    "manifest.json",
    "jour-zero-mark.svg",
    "jour-zero-banniere.svg",
    "icone-180.png",
    "icone-192.png",
    "icone-512.png",
    "fonts/bricolage-grotesque-800.woff2",
    "fonts/outfit-400.woff2",
    "fonts/outfit-600.woff2",
    "fonts/dm-mono-500.woff2",
    "images/ambiance-aujourdhui.webp",
    "images/ambiance-reperes.webp",
    "images/ambiance-collection.webp",
    "images/ambiance-reglages.webp",
    "images/ambiance-vide.webp"
];

self.addEventListener("install", function (evenement) {
    // On prend la main tout de suite au lieu d'attendre la fermeture des pages.
    self.skipWaiting();

    // Un fichier qui manque ne doit pas empecher les autres d'etre gardes :
    // on les range un par un plutot qu'avec addAll, qui echoue en bloc.
    evenement.waitUntil(
        caches.open(VERSION_APP).then(function (rangement) {
            return Promise.all(FICHIERS_APP.map(function (fichier) {
                return rangement.add(new Request(fichier, { cache: "reload" })).catch(function () {});
            }));
        })
    );
});

self.addEventListener("activate", function (evenement) {
    evenement.waitUntil(
        caches.keys().then(function (noms) {
            return Promise.all(noms.map(function (nom) {
                if (nom.indexOf("jour-zero-app-") === 0 && nom !== VERSION_APP) {
                    return caches.delete(nom);
                }
            }));
        }).then(function () {
            return self.clients.claim();
        })
    );
});

// La page et les textes : le reseau d'abord, pour recevoir les mises a jour,
// la copie gardee si on est hors ligne. Les polices et images : la copie
// d'abord, elles ne changent pas. Rien de ce qui part vers le serveur de
// rappels ne passe par ici.
self.addEventListener("fetch", function (evenement) {
    const requete = evenement.request;

    if (requete.method !== "GET" || new URL(requete.url).origin !== self.location.origin) {
        return;
    }

    const page = requete.mode === "navigate" || /\.(html|js|json)$/.test(new URL(requete.url).pathname);

    if (page) {
        evenement.respondWith(
            fetch(requete).then(function (reponse) {
                if (reponse.ok) {
                    const copie = reponse.clone();
                    caches.open(VERSION_APP).then(function (rangement) {
                        rangement.put(requete, copie);
                    });
                }
                return reponse;
            }).catch(function () {
                return caches.match(requete, { ignoreSearch: true }).then(function (garde) {
                    return garde || caches.match("./", { ignoreSearch: true });
                });
            })
        );
        return;
    }

    evenement.respondWith(
        caches.match(requete, { ignoreSearch: true }).then(function (garde) {
            return garde || fetch(requete).then(function (reponse) {
                if (reponse.ok) {
                    const copie = reponse.clone();
                    caches.open(VERSION_APP).then(function (rangement) {
                        rangement.put(requete, copie);
                    });
                }
                return reponse;
            });
        })
    );
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
function auHasard(liste) {
    return liste[Math.floor(Math.random() * liste.length)];
}

// Le serveur n'indique pas s'il s'agit du rappel du matin ou du soir : le
// téléphone regarde sa propre horloge. Une information de moins à transmettre.
function composer(etat) {
    const matin = new Date().getHours() < 12;

    if (!etat) {
        return {
            titre: "Jour Zéro",
            corps: matin ? auHasard(MATIN) : TEXTES.notifications.soir
        };
    }

    // Avant le jour J : on ne demande pas de noter une journee qui n'a pas
    // encore commence, on rappelle l'echeance.
    if (etat.preparation) {
        const restants = Math.abs(etat.jours);

        return {
            titre: restants === 1
                ? TEXTES.notifications.demain
                : texteAvec(TEXTES.notifications.dansNJours, { n: restants }),
            corps: restants === 1
                ? TEXTES.notifications.demainTexte
                : TEXTES.notifications.dansNJoursTexte
        };
    }

    const jours = etat.jours;
    const titre = jours === 1 ? "1 jour" : jours + " jours";

    if (matin) {
        return { titre: titre, corps: auHasard(MATIN) };
    }

    if (etat.noteAujourdhui) {
        return { titre: titre, corps: auHasard(ASTUCES) };
    }

    return { titre: titre, corps: TEXTES.notifications.soir };
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
