# Prompt JZ-2 — Jour Zéro : retouches après la direction pop

Avant de coder : `git add -A && git commit -m "avant JZ-2"`. Le nouveau style (JZ-1) me plaît, on garde la direction. Lis d'abord `index.html` (CSS et JS), `textes.js` et la page des récompenses/collection pour voir comment tout est construit. Ce sont des retouches ciblées : ne change pas ce qui marche.

## 1. La pastille « 30 jours » est moche

La petite pastille qui affiche « 30 jours » (le compteur de jours) n'est pas belle. Refais-la :

- Cherche d'abord ce qu'elle dit exactement et où elle est. Je préfère qu'elle montre **ce qui reste** (« J12 sur 30 », « encore 18 jours ») plutôt qu'un chiffre fixe qui ne dit rien.
- Design : plus gros, plus lisible, dans le style pop de l'app (forme franche, bordure ou ombre marquée, chiffre en gros et petit texte dessous). Pas une petite capsule perdue.
- Propose une petite barre ou un anneau de progression si ça se fait proprement. Texte bien centré, bon contraste, vérifie sur iPhone 390 px.

## 2. Remets de l'ORANGE

Depuis le nouveau style, il n'y a plus que du vert et du blanc. Je veux **retrouver l'orange qu'on avait avant** (reprends exactement la teinte d'origine dans l'historique git ou dans les variables CSS), en plus du vert, pas à la place.

- Le vert reste la couleur principale. L'orange devient la couleur d'accent chaude : boutons d'action principaux, éléments « à faire maintenant », badges, étincelles et petits détails, sélection du moment actuel.
- Répartition indicative : vert 60 %, fond sombre ou clair selon le thème, orange 15 à 20 %, un peu de blanc pour respirer. À toi d'ajuster pour que ça reste harmonieux.
- Garde le contraste du texte lisible (vérifie le texte blanc sur orange).
- Mets les deux couleurs dans des variables CSS (`--vert`, `--orange`) et utilise-les partout, pas de valeurs en dur dispersées.

## 3. Images de la journée et du plan

L'image de la journée est bien, mais c'est presque la même que celle du plan. Rien d'obligatoire, mais si tu peux sans que ça pèse, donne-leur un petit détail ou une teinte différente (par exemple orange pour « ma journée » et vert pour « mon plan ») pour qu'on les distingue au premier coup d'œil. Si c'est compliqué, laisse tel quel.

## 4. Collection : refaire le design des jetons

J'aime l'idée et l'ambiance de la collection, je veux la garder, mais **je n'aime pas le design des petits jetons** : ils ne sont pas beaux, la typo à l'intérieur est moche et mal centrée.

- Refais chaque jeton comme un vrai **badge/médaille** : forme franche et soignée (écusson, médaille, étoile, hexagone... au choix, mais cohérent), bordure épaisse, léger relief, petit reflet, ombre portée. Un seul langage visuel pour tous.
- Icône ou emoji bien centré au milieu, nom en dessous, **parfaitement centrés** (utilise flex ou grid, pas de décalage). Typo du nouveau style, taille adaptée, jamais coupée même avec un nom long.
- Trois états lisibles : **verrouillé** (silhouette grise, point d'interrogation ou cadenas), **débloqué** (couleurs pleines, avec un petit éclat), **nouveau** (petite pastille orange « NEW »). Animation courte quand on en débloque un (pas besoin de plus).
- Cadre de couleur selon le niveau (voir 5) : bronze, argent, or, etc.

## 5. Collection : des niveaux tous les 5 badges

Il n'y a que 14 badges, et quand on les a tous, c'est fini. Je veux de la **progression dans le temps** :

- Tous les **5 badges débloqués**, on passe un **niveau** (niveau 1 à 5 badges, niveau 2 à 10, niveau 3 à 15, etc.). Affiche en haut de la collection un grand bandeau « Niveau X » avec une barre qui montre la progression vers le suivant (« 3 / 5 badges avant le niveau 3 »).
- Donne un **nom à chaque niveau** (par exemple Débutant, Régulier, Motivé, Solide, Machine, Légende... à toi de proposer une dizaine, sans stéréotype lourd ni référence à une marque) et une petite récompense visuelle qui change : couleur du cadre des jetons, ou de l'en-tête.
- Il y a 14 badges aujourd'hui : cela donne 2 niveaux, et un troisième à 15. Pour que la progression continue, **ajoute de nouveaux badges** (au moins 16 de plus, pour atteindre une trentaine) qui se débloquent sur le **long terme** : séries de jours (7, 14, 30, 60, 100 jours d'affilée), nombre total de journées complétées, premiers essais (première semaine, première fois qu'on adapte son plan, etc.), jours de fidélité, régularité le matin, etc. Vérifie ce qui est réellement mesurable dans les données de l'app (n'invente pas de condition qu'on ne peut pas calculer) et note les conditions de chaque badge clairement dans le code.
- Les nouveaux badges doivent **se débloquer rétroactivement** si les données de l'utilisateur le permettent (il ne doit pas perdre ce qu'il a déjà), et sans casser les badges déjà gagnés (données existantes dans le stockage local : migration propre, pas de perte).
- Quand on monte de niveau : petit écran de félicitation (nom du niveau, nouveau cadre), une seule fois.

## Tests

- Playwright (viewport iPhone 390 px) : capture de l'accueil, de la pastille, de la collection (verrouillé / débloqué / nouveau), du bandeau de niveau.
- Test de la progression : avec 4, 5, 9, 10, 14, 15 badges, le niveau et la barre sont corrects.
- Test de migration : un stockage local avec les anciens badges gagnés ne perd rien après la mise à jour.
- Vérifie que l'orange et le vert sont bien tous les deux présents sur chaque écran principal, texte lisible.
- Mets à jour le cache du service worker (`sw.js`) pour que la nouvelle version s'installe sur les téléphones.
- Déploie seulement quand tout passe, puis résume ce que tu as changé, la liste des nouveaux badges avec leurs conditions, et ce que tu n'as pas pu vérifier sur un vrai iPhone.
