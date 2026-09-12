// Jour Zéro — le serveur de rappels.
//
// Un seul petit programme qui fait deux choses :
//   1. il reçoit les abonnements envoyés par l'app (fetch)
//   2. toutes les heures, il envoie un rappel à ceux dont c'est l'heure (scheduled)
//
// Il tourne chez Cloudflare, sur leur offre gratuite. Il n'y a pas de machine
// à entretenir : le code dort et se réveille quand on l'appelle.

import { buildPushHTTPRequest } from "@pushforge/builder";

// On autorise l'app à nous parler depuis son adresse. Sans ça, le navigateur
// bloque la requête : c'est la règle du CORS.
function entetes(origine) {
    return {
        "Access-Control-Allow-Origin": origine || "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };
}

// L'adresse de push est longue et contient des caractères qui ne vont pas
// dans une clé. On en fait une empreinte courte et stable.
async function empreinte(texte) {
    const octets = new TextEncoder().encode(texte);
    const hache = await crypto.subtle.digest("SHA-256", octets);

    return [...new Uint8Array(hache)]
        .slice(0, 16)
        .map(function (octet) { return octet.toString(16).padStart(2, "0"); })
        .join("");
}

export default {

    async fetch(requete, env) {
        const origine = requete.headers.get("Origin");

        if (requete.method === "OPTIONS") {
            return new Response(null, { headers: entetes(origine) });
        }

        const chemin = new URL(requete.url).pathname;

        if (chemin === "/abonnement" && requete.method === "POST") {
            let recu;

            try {
                recu = await requete.json();
            } catch (erreur) {
                return new Response(JSON.stringify({ erreur: "corps illisible" }), {
                    status: 400,
                    headers: entetes(origine)
                });
            }

            if (!recu.abonnement || !recu.abonnement.endpoint) {
                return new Response(JSON.stringify({ erreur: "abonnement manquant" }), {
                    status: 400,
                    headers: entetes(origine)
                });
            }

            const cle = await empreinte(recu.abonnement.endpoint);

            // Deux informations, pas une de plus : où joindre ce téléphone,
            // et à quelles heures. Ni prénom, ni compteur, ni journal — le
            // message est composé sur l'appareil par le service worker.
            const heures = Array.isArray(recu.heuresUTC)
                ? recu.heuresUTC.map(Number).filter(function (h) {
                    return h >= 0 && h <= 23;
                })
                : [];

            await env.ABONNEMENTS.put(cle, JSON.stringify({
                abonnement: recu.abonnement,
                heuresUTC: heures,
                maj: new Date().toISOString()
            }));

            return new Response(JSON.stringify({ etat: "enregistré" }), {
                headers: entetes(origine)
            });
        }

        // Un declencheur manuel, pour tester sans attendre l'heure dite.
        // Protege par un mot de passe depose en secret : sans lui, la route
        // n'existe pas.
        if (chemin === "/envoyer-maintenant") {
            const donne = new URL(requete.url).searchParams.get("cle");

            if (!env.CLE_TEST || donne !== env.CLE_TEST) {
                return new Response("non", { status: 404 });
            }

            const envoyes = await envoyerLesRappels(env, true);

            return new Response(JSON.stringify({ envoyes: envoyes }), {
                headers: entetes(origine)
            });
        }

        return new Response(JSON.stringify({ etat: "Jour Zéro, serveur de rappels" }), {
            headers: entetes(origine)
        });
    },

    // Cloudflare appelle cette fonction toutes les heures (voir wrangler.toml).
    async scheduled(evenement, env, contexte) {
        contexte.waitUntil(envoyerLesRappels(env));
    }
};

async function envoyerLesRappels(env, toutLeMonde) {
    const heure = new Date().getUTCHours();
    const liste = await env.ABONNEMENTS.list();
    let envoyes = 0;

    for (const entree of liste.keys) {
        const brut = await env.ABONNEMENTS.get(entree.name);

        if (!brut) {
            continue;
        }

        const fiche = JSON.parse(brut);

        const heures = fiche.heuresUTC || [];

        if (!toutLeMonde && heures.indexOf(heure) === -1) {
            continue;
        }

        try {
            const { endpoint, headers, body } = await buildPushHTTPRequest({
                privateJWK: JSON.parse(env.CLE_PRIVEE_VAPID),
                subscription: fiche.abonnement,
                message: {
                    // Un signal vide : le texte est écrit par le téléphone.
                    // Ce qui suit ne sert que si le service worker échoue.
                    payload: { titre: "Jour Zéro", corps: "Comment s'est passée ta journée ?" },
                    adminContact: env.CONTACT,
                    options: { ttl: 14400, urgency: "normal" }
                }
            });

            const reponse = await fetch(endpoint, { method: "POST", headers, body });
            envoyes++;

            // 404 ou 410 : l'abonnement n'existe plus (app désinstallée,
            // notifications coupées). On fait le ménage.
            if (reponse.status === 404 || reponse.status === 410) {
                await env.ABONNEMENTS.delete(entree.name);
            }
        } catch (erreur) {
            // Un envoi raté ne doit pas empêcher les suivants.
            console.log("envoi impossible", entree.name, erreur.message);
        }
    }

    return envoyes;
}
