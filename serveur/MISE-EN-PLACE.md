# Le serveur de rappels — mise en place

À faire une seule fois. Tout se passe dans le Terminal, depuis ce dossier.

```
cd ~/Code/jour-zero/serveur
```

---

## 1. Le compte Cloudflare

Va sur **cloudflare.com**, crée un compte gratuit. C'est à toi de le faire :
je ne crée pas de compte à ta place.

Aucune carte bancaire n'est demandée pour l'offre gratuite.

---

## 2. Installer les outils

```
npm install
```

Ça télécharge deux choses : `wrangler`, l'outil qui parle à Cloudflare, et
`@pushforge/builder`, la bibliothèque qui fabrique les notifications.

Puis connecte l'outil à ton compte :

```
npx wrangler login
```

Une page s'ouvre dans le navigateur, tu autorises, c'est fini.

---

## 3. Générer les clés VAPID

```
npx @pushforge/builder vapid
```

Tu obtiens **deux clés**.

- La **publique** part dans le code de l'app : `const CLE_PUBLIQUE_VAPID = "..."`
  dans `index.html`. Elle est faite pour être lue par tout le monde.
- La **privée** ne va que dans Cloudflare, à l'étape 5. Jamais dans un fichier
  du dépôt, jamais dans un message. C'est elle qui prouve que les rappels
  viennent bien de Jour Zéro.

---

## 4. Créer le rangement des abonnements

```
npx wrangler kv namespace create ABONNEMENTS
```

La commande affiche un identifiant. Recopie-le dans `wrangler.toml`, à la
place de `A_REMPLIR`.

---

## 5. Déposer la clé privée

```
npx wrangler secret put CLE_PRIVEE_VAPID
```

Colle la clé privée **entière**, telle quelle, y compris les accolades.
Elle est chiffrée chez Cloudflare : même toi, tu ne pourras plus la relire.
Garde-en une copie quelque part de sûr.

---

## 6. Mettre en ligne

```
npx wrangler deploy
```

L'outil affiche l'adresse de ton serveur, du genre :

```
https://jour-zero-rappels.TON-COMPTE.workers.dev
```

Recopie-la dans `index.html` : `const ADRESSE_SERVEUR = "..."`.

---

## 7. Brancher l'app

Dans `index.html`, deux constantes à remplir, tout en haut du script :

```js
const CLE_PUBLIQUE_VAPID = "";   // étape 3
const ADRESSE_SERVEUR = "";      // étape 6
```

Puis :

```
cd ~/Code/jour-zero
git add .
git commit -m "Branchement du serveur de rappels"
git push
```

---

## 8. Vérifier

1. Sur ton téléphone, **supprime l'icône de Jour Zéro** et réinstalle l'app
   depuis Safari. C'est nécessaire pour que le nouveau service worker soit pris.
2. Ouvre l'app depuis l'icône — pas depuis Safari, sinon iOS refuse le push.
3. Réglages → Notifications → autorise.
4. Le rappel partira à l'heure que tu as choisie.

Pour voir ce que fait le serveur en direct :

```
cd ~/Code/jour-zero/serveur
npx wrangler tail
```

---

## Si ça ne part pas

- **Rien ne s'affiche à l'heure dite** : vérifie l'heure choisie dans Réglages,
  et regarde `npx wrangler tail` au moment où l'heure tombe.
- **« abonnement manquant »** : l'app n'a pas réussi à s'abonner. Sur iPhone,
  c'est presque toujours qu'elle a été ouverte depuis Safari et non depuis
  l'icône de l'écran d'accueil.
- **Ça marchait puis plus rien** : iOS coupe l'abonnement si une notification
  arrive sans rien afficher. Le service worker affiche toujours quelque chose,
  mais si tu le modifies un jour, garde cette règle en tête.

---

## Ce que ça coûte

Rien. L'offre gratuite de Cloudflare autorise 100 000 requêtes par jour et
1 Go de stockage. Un rappel quotidien pour quelques personnes en consomme une
poignée. Le service de push d'Apple est gratuit et ne demande aucun compte
développeur.
