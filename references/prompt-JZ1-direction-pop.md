# Prompt JZ-1 — Jour Zéro : une direction visuelle pop, colorée et fun

Avant de coder : `git add -A && git commit -m "avant JZ-1"`. Utilise les skills du plugin Studio : `direction-artistique` (cadre et brief), `typographie`, `dessin-svg` et `images`. Lis d'abord `index.html` (tout le CSS et le JS y sont), `sw.js`, `manifest.json`, `jour-zero-mark.svg`, `jour-zero-banniere.svg` et `serveur/`. Aujourd'hui l'app est jugée **trop classique** : thème sobre, Anton pour les titres, Space Mono (chasse fixe) pour tout le reste, Permanent Marker pour le logo, mark calendrier vert avec un trait orange. Je veux la même **énergie visuelle que mon app Braise** (fond sombre, accent flamme, cartes très arrondies et aérées, gros chiffres, typo à niaque, images d'ambiance) mais en version **pop, colorée et fun**.

## Règle de couleur : on garde le vert de base

**Le vert actuel de Jour Zéro reste la couleur d'identité de l'app.** Relève sa valeur exacte dans le CSS d'`index.html` (couleur des cases vertes du calendrier, du mark, des boutons et des succès) et garde-la telle quelle comme couleur principale (variable `--vert`). La flamme orange reste l'accent secondaire (aujourd'hui, le trait en diagonale du mark, les alertes douces). Les couleurs vives « pop » ne sont que des **touches** autour du vert (autocollants, confettis, badges), jamais un remplacement : en un coup d'œil, on doit reconnaître que c'est toujours Jour Zéro.

## Règles qui ne bougent pas (très importantes)

- **Les données des gens ne doivent rien perdre.** Garde exactement le même format de stockage (`localStorage`, export/import, sauvegarde, serveur de rappels). Aucune migration cassante : une personne qui a 40 jours de série doit retrouver ses 40 jours après la mise à jour.
- **Le fun ne se moque jamais de la personne ni de l'envie de fumer.** Humour complice et chaleureux, jamais culpabilisant, jamais de blague sur une rechute. Quand un jour est remis à zéro, ou dans le moment d'une envie forte, le ton est calme et doux, sans animations criardes ni blagues.
- **Pas de feuille de cannabis en vedette** (décision déjà prise : une couleur suggère, un dessin déclare). Le vert peut exister, la feuille dessinée en grand non.
- Rien de personnel ne doit apparaître dans les contenus publics (page d'accueil, partages, captures) : pas de motivation privée, pas de chiffres réels.
- Les clés restent côté serveur ; aucune police ni image chargée depuis un lien externe sans l'héberger (voir plus bas).

## Inspirations (à regarder avant tout)

Trois captures d'applications sont dans `references/inspiration/` : `inspiration-1-rouge.jpg` (cartes rouges très arrondies, grosse typo, barre d'onglets en pastille sombre), `inspiration-2-lueur-sombre.jpg` (fond sombre avec grande lueur orange dégradée, sélecteur de jours en cercles, gros chiffre, bouton central rond dans la barre, grain léger) et `inspiration-3-vert-verre.jpg` (dégradé vert doux, cartes en verre dépoli, barre de progression avec partie hachurée, jours en pastilles, barre d'onglets flottante en pilule). Ouvre-les et regarde-les vraiment.

À reprendre comme **idées de style** (jamais copier un écran, un logo, une photo, un visage, un nom ou un texte) :
- des **cartes très arrondies avec effet verre dépoli** (`backdrop-filter: blur`, bord clair fin, ombre douce) posées sur un **grand dégradé lumineux** : ici, une lueur **verte** (le vert de base) sur fond sombre, avec une touche d'orange ;
- un **sélecteur de jours** en pastilles ou cercles pour la bande des jours (jour actuel mis en valeur, jours validés en vert plein, jours à venir en creux, jours ratés doux et jamais rouges) ;
- une **barre de progression** vers le prochain palier avec la partie restante **hachurée** ;
- un **gros chiffre central** (le nombre de jours) très lisible, entouré d'un anneau ou d'un halo ;
- une **barre d'onglets flottante en pilule**, avec le bouton principal rond au centre (le bouton d'action de l'app) ;
- un **grain** discret sur les fonds pour éviter l'aspect plat ;
- de la couleur vive en **touches** (pastilles, badges, étiquettes inclinées) pour le côté fun.
Fais ressortir le fun par les formes, les couleurs en touches, les animations et les textes complices, pas par une surcharge.

## 1. Montre-moi 3 pistes avant de généraliser (page d'essai)

Crée `essai-style.html` (une page à part) qui montre le même écran « Aujourd'hui » (gros compteur de jours, bouton principal, une carte d'astuce, la bande des jours, une célébration de palier) dans 3 directions, toutes sur **fond sombre profond** avec **accent flamme** et des **couleurs vives** en renfort :

- **Piste A — Verre et lueur verte** (inspirée des captures 2 et 3) : fond sombre avec une grande lueur dégradée **verte** (le vert de base) et une touche d'orange flamme, cartes en verre dépoli, jours en pastilles, barre de progression hachurée, barre d'onglets flottante en pilule, grain léger ; fun par les confettis, les stickers et les textes.
- **Piste B — Pop électrique** : fond presque noir, **vert de base** en couleur principale, orange flamme en accent, avec rose bonbon, jaune citron et bleu électrique en touches ; formes très rondes, autocollants (« stickers ») avec légère rotation, bordures épaisses, ombres décalées façon BD, cartes pleines très colorées (inspirée de la capture 1).
- **Piste C — Sport streetwear** : noir + **vert de base** + flamme orange en accent, énorme typo condensée en majuscules avec trait de soulignement, étiquettes inclinées, textes de tampon.

Pour chaque piste : palette en variables CSS, 2 polices maximum + une chasse fixe pour les chiffres, tous **hébergés dans le projet** (`.woff2` dans `fonts/`, `OFL.txt` à côté, `font-display: swap`) et des polices de repli proches. Polices libres uniquement (SIL OFL). Contraste d'au moins 4,5:1 pour le texte. Fais une capture de chaque piste avec Playwright (390 px de large) dans `references/style/`, regarde-les, déploie la page d'essai et **arrête-toi** : je te dirai « A, B ou C ». Ne change rien d'autre tant que je n'ai pas choisi.

## 2. Après mon choix : appliquer partout

- **Palette et composants** : variables CSS pour tout (fonds, cartes, accents, états). Cartes très arrondies, plus d'espace, boutons gros et tactiles (zone de toucher d'au moins 48 px), icônes de la barre d'onglets redessinées dans le nouveau style.
- **Typographie** : titres en majuscules, gros, avec un trait de soulignement, chiffres alignés en chasse fixe, textes courts et percutants (un conseil lu en pleine envie de fumer doit se lire d'un coup d'œil, comme déjà décidé). Échelle de tailles en variables CSS (ratio 1,25), pas de taille en dur.
- **Compteur de jours** : le grand chiffre devient le héros de l'écran, avec une animation douce (le chiffre « rebondit » au changement, un halo qui pulse doucement) ; `prefers-reduced-motion` : tout reste fixe.
- **Célébrations de paliers** (1, 3, 7, 14, 30, 60, 90, 180, 365 jours) : une vraie petite fête, courte et jolie (confettis ou étincelles aux couleurs de la piste, un autocollant « palier » à collectionner, une phrase complice). Dure moins de 3 secondes, se ferme d'un toucher, jamais bloquante.
- **Autocollants à collectionner** (stickers) : une petite collection de badges rigolos et originaux pour les paliers et les moments (première semaine, première envie surmontée, X jours d'affilée, etc.), en SVG original, dans le style de la piste choisie. Pas de personnage ni de logo d'une autre marque. Page « Collection » avec ceux débloqués en couleur, les autres en silhouette.
- **Textes complices** : réécris les messages de l'app (compteur, notifications, astuces, écrans vides, confirmations) sur un ton chaleureux et un peu taquin, court. Garde les mêmes informations et la même sécurité (renvoie vers de l'aide en cas de détresse comme avant). Fournis les nouveaux textes dans un fichier à part (`textes.js` ou un objet unique) pour que je puisse les relire et les changer facilement.
- **Images d'ambiance** : quelques images sombres et colorées cohérentes avec chaque écran (Aujourd'hui, Repères, Collection, Réglages, écrans vides), générées avec le skill `images` (Workers AI, fichier `~/.config/studio/cloudflare.env` nécessaire ; si absent, **arrête-toi et dis-moi comment le créer**, ne recycle rien). Pas de visage net, pas de cannabis, pas de fumée dessinée comme glorification. `.webp` légers (moins de 45 Ko), `loading="lazy"`, dimensions fixes.
- **Mark et icône** : ne refais pas le logo toi-même. Garde provisoirement l'actuel ; je t'enverrai un nouveau logo plus fun (généré à part) que tu intégreras dans un prompt suivant.
- **Polices hébergées** : retire les `<link>` Google Fonts, héberge les polices dans `fonts/` et ajoute-les au cache de `sw.js` (l'app doit marcher hors ligne comme avant). Incrémente la version du cache.
- **Barre d'onglets, bandeau d'installation, écran d'installation, installation sur l'écran d'accueil** : même nouveau style.

## 3. Vérifier

- Parcours chaque écran (Aujourd'hui, les autres onglets, Repères, Réglages, bandeau et écran d'installation, bilan quotidien, notifications dans les réglages) en 390 px et en 320 px : rien de coupé, rien qui déborde, contraste suffisant.
- Une personne avec des données existantes (simule-en une avec plusieurs mois) retrouve tout, y compris l'export/import.
- Mode `prefers-reduced-motion` testé. Dark mode système : l'app reste sombre dans tous les cas.
- Poids total de la page et des polices raisonnable (polices moins de 150 Ko, images moins de 1 Mo au total).
- Captures avant/après dans `references/style/`.

## Tests
- `essai-style.html` montre bien 3 pistes distinctes avec les vraies polices, et rien d'autre n'a changé avant mon choix.
- Après mon choix : plus d'ancienne palette ni de police externe ; tous les paliers fêtent correctement ; la collection de stickers se remplit.
- Aucune donnée perdue entre l'ancienne et la nouvelle version.
- Déploie (`npx wrangler deploy` pour le serveur de rappels si tu y touches, et la publication habituelle de la page) seulement quand tout passe, puis résume ce qui a changé.
