---
kind: '📌 Docs'
---
# Design system principles

NOTE: This doc is a work in progress...

## TODO: translate, rework and organize those

### Un composant ne doit pas limiter en largeur une partie de ses contenus

* C'est plutôt à ceux qui utilisent le composant (la console) d'appliquer une limite en largeur
* TODO Il faut qu'on ajoute une largeur max dans le Storybook pour avoir de base un exemple raisonnable (75em)
  * Avec un sytème "page word" (bord gris, fond blanc) voir capture d'écran
* Info, un contenu à l'interieur d'un bloc peut très bien avoir une largeur liée au contenu (tableau de liste des factures)
* Les composants inline (type bouton...) prenne de base la taille de leur contenu
  * On doit pouvoir la forcer

### En mode waiting, on passe le bouton qui vient d'être cliqué en waiting

* Ça le rend automatiquement disabled (en plus de l'animation)

### En mode waiting, on passe le formulaire en disabled

* On fait le minimum nécessaire (c'est quoi les trucs conflit avec l'action en cours ?)
  * On se permet d'oublier les cas à la marge qui n'arrivent quasi jamais (ajout d'une clé SSH qu'on est en train de supprimer)
* Dans le cadre de liste avec chaque ligne ayant des actions, toutes les actions de la ligne sont disabled
  * Dans certains cas, il sera peut-être pertinent de passer toute la liste ou tout un composant en disabled
    * => exemple grafana

### En mode waiting, dans le cadre d'une liste d'item, on passe la ligne en "grisé"

* on applique une opacité 0.5 (à mettre dans une variable dans le thème) sur toute la ligne (sauf boutons qui sont déjà disabled)
* on laisse les boutons tranquille (ils sont déjà disabled)

### En mode waiting suite à une action sur un item de liste, si la ligne contient une icône et que son état post-waiting est indéterminé, on peut remplacer l'icône par un loader

* C'est très rare (à utiliser avec modération)
* exemple de cc-tcp-redirection-form

### Quand on a un cc-block (ou un cc-block-section) avec une liste d'items, on met le nombre dans le titre
* 
* On peut peut-être éviter de le mettre quand il y a moins que 3 items

### Quand on a un système de filtres qui s'applique sur une liste d'items

* dans certaines conditions, on peut se permettre de cacher tout ou partie des filtres
  * Ça peut être lié au nombre d'items dans la liste
  * Ça peut être lié à l'utilité d'un filtre en particulier
  * Ça peut être lié à la taille du bloc
  * Attention à ne pas perturber les utilisateurs sur la présence ou non (apparition soudaine) de ce système de filtres
    * Il faut considérer comment le nombre d'items va varier dans le temps et au fur et à mesure des usages
* exemple liste orga members

### Quand on a une liste d'items dans un cc-block

* On essaye de materialiser la répétition avec une icône (un peu comme une liste à puce)
  * Attention aux icônes qui n'ont pas vraiment de sens
    * À voir ce qu'on fait quand on a pas vraiment d'icône
  * ?? Est-ce toujours nécessaire d'avoir une ligne horizontale dans ce cas ?
* Dans la plupart des cas, la répétition via l'icône (et le reste de chaque ligne) suffira à identifier les items
  * On se réserve la possibilité d'utiliser une ligne grise fine entre chaque item
  * COMMENTAIRE D'IMPLEM pour plus tard vv
  * On n'utilise pas de `<hr>` et on privilégie un border bottom (sauf sur le dernier)
  * couleur : --color-grey-15 en dur (à bouger dans un design token de bordure "decision")

### le cc-block-section est un super outil pour ajouter un peu de contexte et d'explication sur nos composants/fonctionnalités

* On essaye de soigner les petits texte d'explication sur la gauche

### le cc-block-section n'est pas forcément pertinent :

* si on a pas grand chose à dire dans le slot "info" (on évite d'écrire un texte juste pour combler du vide)
* si le slot par defaut a besoin de beaucoup de largeur
* si le slot par défaut est très haut

### On évite de faire des trucs qui ressemble à des boutons

* Pour les petits "badges", on peut envisager des bords arrondis à 50%
  * TODO faire un composant cc-badge
* Attention aux icônes décoratives dans les listes qui sont dans des ronds
  * Ça ressemble trop à un bouton icon-only

### Comment choisir entre skeleton et loader ?

* Skeleton
  * quand on "sait" que le changement entre skeleton/loaded ne va pas clignoter
    * exemple => cc-tile-deployments
    * Pour les listes, si on peut prédire le nombre d'items moyen on passe en skeleton avec un nombre proche de la réalité
  * on privilégie le skeleton pour le chargement
* Loader
  * quand l'état loaded (après l'état skeleton) a plusieurs formes qui sont très/trop différentes
    * exemple => cc-tile-instances (le stopped est courant mais très différent de running)
  * dans une liste, quand c'est difficile de déterminer le nombre d'items
  * on privilégie le loader pour les actions utilisateur de type update/delete si nécessaire
    * exemple => cc-env-var-form

### Quand un composant est en mode skeleton, sur quels éléments applique t-on le pattern "gris qui clignotte" ?

* Tout les contenus "statiques" ne sont pas concernés (il peuvent apparaitre tel quel)
  * Textes
  * Liens (vers la doc par exemple)
  * Icônes et images
* Les élements de formulaire ne sont pas pas concernés (ils sont utilisables/disponibles)
  * exemple => cc-email (on peut commencer à ajouter un email secondaire pendant le chargement des emails secondaires)
  * exception => cc-env-var-form (on met une partie des boutons en disabled car dans le cas présent, ça n'a pas de sens tant que la liste n'est pas chargée)
* Les éléments qui sont récupérés depuis l'API sont concernés et s'affichent comme des "blocs gris qui clignottent"

### On ne disable pas des boutons si le formulaire est vide

* exemple => cc-email, pour l'ajout d'un email le bouton submit est disponible même si le champ texte est vide
  * c'est après le clic sur submit qu'on affiche une erreur
* TODO liens a11y
* TODO fix env var form
  * (bouton reset et submit)
* TODO fix env var create ??
  * sur le add et l'affichage d'erreur

### On ne valide pas le formulaire (au sens, afficher les erreurs de chaque champ) pendant la saisie

* On le fait uniquement lors de la soumission
* Exception pour le mode un peu mini IDE du mode expert des vars d'env

### Comment découper les composants ?

* Plusieurs composants imbriqués
  * Pratique pour avoir des stories différentes pour les sous composants
  * Verbeux niveau code et docs
  * impact de perf sur smart CDN (nb de requête)
    * on pourrait très bien décider de grouper plusieurs composants par fichier à marge
* Un seul composant avec potentiellement des sub-render
  * On peut partager du CSS dans le même Shadow DOM
  * le sub render a du sens sur les composants qui ont une version small vs large
* Penser à l'impact sur les tests et la complexité du code
* (flo) regrouper dans le cas des membres d'orgas aurait un impact négatif sur la complexité
* (bob) c'est souvent du cas par cas
* (bob) qu'est ce qui impact notre DX (au sein de l'équipe) et l'UX du Design System et de l'utilisateur final
  * et normalement on vise UX > DX
* (hub) => il nous faut un système pour forcé le regroupement de fichier dans le smart CDN

```
[
  { name: "env-vars": ["cc-env-var-form", "cc-env-var-create"] }
]
```

### Plusieurs cc-block vs un seul cc-block avec des sections ?

* pas de section si le contenu du formulaire est très large
* pas de section si on en a une avec texte d'infos et pas l'autre
* (bob) les sections sont très adaptés à l'écran de config (avec le texte d'infos)
* si 2 blocks ont du sens entre eux, on sûrement besoin d'un seul avec des sections
  * exemples et contre exemples

### Comment organiser l'aide / docs dans un cc-block ?

* Est-ce qu'on met un texte en haut ?
  * Est-ce qu'on le fait si on a plusieurs cc-block-sections ?
* Comment est-ce qu'on le met en avant ?
  * Est-ce qu'on doit utiliser un cc-notice ?
* Est-ce qu'on commence tout de suite le lien vers la doc en bas à droite (CloudFlare style) ?
* !! en fait, on va bouger ces détails dans la doc du nouveau cc-block et cc-block-section
  * (bob) info globales en haut
  * (bob) info spécifique à la section dans la section
  * (bob) simple lien vers la doc en bas à droite
    * (flo) il faut un lien plus précis que juste "documentation"
    * (pierre) on peut imaginer qu'il y ai plusieurs liens plusieurs pages de doc
* (pierre) on peut imaginer que le "slot" dédié à la doc / info puisse avoir des notics autre que juste info
* (flo) "des fois, trop d'aide, c'est trop"

<!-- 2022-06-06 -->

### Emplacement de messages d'erreur ?

* Dans la zone d'erreur du champ de formulaire ?
  * Erreur spécifique à la saisie du champ en question (la plupart du temps suite à une validation côté client, en attendant d'avoir des APIs capables de fournir ce genre de détails)
  * Ces messages d'erreur se déclenchent après la première tentative de soumission d'un formulaire
  * Ces messages disparaissent s'ils ne sont plus pertinent après deuxième tentative de soumission du formulaire
  * => exemples
* Dans un notice un peu plus global ?
  * Utiliser quand un appel de chargement de données foire à la place du contenu à afficher
    * à priori en mode danger (à voir en fonction des cas)
  * Utiliser dans le cadre d'une validation client impliquant plusieurs champs et où les slots d'erreur des champs ne sont pas pertinents
    * Ça pourrait aussi être suite à une validation côté serveur (encore faut-il que l'API puissent nous donner l'info détaillée avec une 400 Bad Request)
  * => exemples
* Dans un toast hors du composant ?
  * Ne pas utiliser pour une erreur de chargement
  * Utiliser lors d'une erreur de sauvegarde/maj (avec un A/R API qui foire) (danger)
  * => exemples

### Quand est-ce qu'on peut se permettre de ne pas faire d'état de chargement ?

* est-ce qu'il y a un aller/retour réseau ?
  * NON => la plupart des composants bas-niveau (atoms...) => pas besoin
    * cc-block, cc-notice...
  * OUI => la plupart des composants métier qui affichent de la donnée
    * il faut penser à l'état skeleton/loading...
    * contre exemple : liste des emails secondaires du cc-email-list
      * ^^ l'état chargé est ~95% du temps "vide"

### Quand est-ce qu'on peut se permettre de ne pas faire d'état vide (empty) ?

* Est-ce qu'il y a une liste de choses à afficher ?
  * Si oui, est-ce qu'elle peut-être vide
    * Liste backup, liste de vars d'env...
  * Si non, on a probablement pas besoin d'état empty
* L'idée est d'éviter de créer un message traduit qui ne servira jamais
  * Liste des cc-article-card (le RSS ne sera "jamais" vide)
  * Liste des membres d'une orga (il y aura toujours au moins toi)

### Quand il y a des listes, est-ce qu'il faut mettre en valeur les filtres différemment sur le nouveau cc-block ?

* On redirige cette question/discussion pour la suite et le nouveau cc-block

### Quand on a des filtres sur une liste, comment indique t-on qu'il est appliqué ?

* On redirige cette question/discussion pour la suite et le nouveau cc-block
  * fond différent ??
  * compteur type x/total ??
  * mention qq part "il y a N éléments masqués" ou autre

<!-- 2022-06-22 -->

### Outlined ou pas ?

* Pour les éléments qui se répète => outlined [ALL]
* Sur un form, action principale en pleine, les autres en outlined
  * ex : boite de dialogue confirmation en plein, annuler en outlined
  * TODO : réfléchir à remettre en cause la couleur de simple
  * TODO : dans la réfléxion du cc-dialog, on testera le button sans bordures
    * ça donnerai plus de possibilité pour des niveaux de hierachie entre l'importance de certaines actions [RT]
    * a balancer avec l'usage du bouton link
* Bien se poser la question de l'importance d'une action

### Bouton bouton ou bouton link ?

* Rappel niveau sémantique :
  * Une action => un bouton
  * Une navigation => un lien
* Attention au fait que si ça ressemble à un lien, on s'attend à pouvoir ouvrir dans un nouvel onglet ou autre
* Le bouton link, c'est un niveau de hiérachie d'importance d'action supplémentaire
  * "Plus on a d'actions possibles, moins on veut qu'elles soient dans ta face"
  * Les actions peut courantes ont intêret à être moins mises en avant avec un button type link
    * ex: renvoyer un email
* Le button en mode link peut aussi être utilisé quand on veut qu'une action soit au même niveau d'importance qu'un lien
  * ex: backups

### Comment choisir quel mode de bouton ?

* simple : actions pas principales, qu'on ne veut vraiment pas mettre très en avant
  * ex: annulation, reset
  * TODO => il faut que le "simple" ressorte moins (que le primary)
  * TODO => creuser le simple vs primary outlined
* primary
  * à utiliser pour les actions principales en général
* success
  * utile pour différencier deux actions principales et en mettre une en avant (par rapport au primary)
    * ex: soumission du form env var
  * "joker CTA" pour attirer l'utilisateur sur une action (le plus souvent, positive, créatrice)
    * ex: grafana, creation d'app
  * ?? : renommer le mode success
* warning : on va décourager son usage (et ensuite le virer)
* danger : action destructrice
  * ex: suppression, stop, désactivation...
  * note : le danger "en plein" attire beaucoup l'œil mais c'est parfois ce qu'on recherche, il faut faire attention aux autres actions environantes

<!-- TODO 2022-07-12 -->

### Icône ou pas ?

* Sur un bouton, jamais d'icône only
  * Sauf si contrainte d'espace et qu'on estime que l'icône est "assez connue"
    * poubelle pour suppression
    * crayon pour éditer
    * croix pour annuler
    * "coche" pour valider
    * plus pour augmenter (pricing, input number)
    * moins pour augmenter (pricing, input number)
* le plus souvent, on essaiera d'associer au texte une icône
  * si on n'a vraiment pas de place, on peut garder texte seulement
  * dans d'autres cas qui l'illustreront au fur et à mesure, on pourra faire d'autres exceptions
    * ex: sur un formulaire type configuration de profil => ce n'est pas forcément utile sur le submit (indication)
    * ex: sur un confirm en modale, ça peut être pertinent
  * l'association icone/texte peut permettre d'enfoncer le clou et aider à reconnaitre l'icône ailleurs
  * si on ne trouve pas d'icône pertinente, on n'essaye pas de traffiquer un truc inconpréhensible => pas grave, pas d'icône
  * l'utilisation d'icône peut permettre de hiérarchiser les boutons dans le cadre d'un formulaire un peu riche/dense/complexe

* !! chercher de la littérature sur le sujet des icônes
  * https://www.nngroup.com/topic/icons/

### Emplacement du "formulaire d'ajout" dans le cadre d'un composant liste + ajout ?

* Se poser la question de l'action principale (ou la plus importante, fréquente)
* on a trois exemples différents qui ont chacun une pertinence
  * orga members => cc-block à part au dessus de la liste (qui a son propre cc-block)
  * ssh keys => cc-block-section au dessus de la liste
  * email secondaire => dans la même cc-block-section, en dessous de la liste
* dans le cadre de liste avec ajout simple à la liste
  * on aime bien "en bas", mais ce n'est pas plus tranché que ça
  * quand la partie ajout est utilisée de manière répétée (en masse), mettre l'ajout en haut permet d'éviter des changements de scroll/position
  * la présence d'une pagination en bas par exemple peut pousser à mettre l'ajout en haut (à discuter)

### À propos des barres de défilement

* on évite les zones scrollable imbriquées
  * le plus souvent le composant n'a pas de zone scrollable et c'est la page qui l'utilise qui l'est
  * dans certain cas, le composant a une zone scrollable et on l'utilise de manière à éviter les zones scrollables imbriquées (ex: logs)

### Comment est-ce qu'on reset un composant ?

* Dans la définition smart d'un composant, avant de charger des données, on s'assure de remettre le composant à son état inital
  * Attention, parfois un composant a plusieurs parties indépendantes qui contiennent des données
    * => plusieurs `resetXXX()` indépendants
  * Actuellement, c'est à l'utilisateur de remettre chaque propriété à un état par défaut
  * Il nous faudrait une méthode `resetData()` (ou autre) qui porte cette responsabilité sur chaque composant de ne reset que les parties qui charge des données
    * Une fois le système de propriété `state` en place, la méthode `resetData` consistera simplement à repasser le state à `loading` et une ou 2 props à null.
* Ne pas confondre le besoin de `resetData()` pour charger des données très différentes dans un composant et le `resetForm()` nécéssaire après une création ou pour l'utilisateur

### Comment est-ce qu'on reset un formulaire ?

* On peut le faire via la méthode `resetForm()` ou `resetFormXXX()` en fonction des composants
* On expose une bonne partie de l'état des formulaires pour pouvoir déclencher l'affichage d'erreur spécifiques sur certains champs
  * C'est pratique pour certaines stories (cas d'erreur...)
  * C'est pas avec ça qu'on reset un formulaire => `resetForm()`

### Comment nommer un composant ? (et le classement en dossier)

* Il faut faire attention à ce qu'on puisse comprendre qu'un component est un gros machin qui gère des trucs vs un petit composant d'affichage
* Il faudrait peut-être éviter les suffixes visuels et se baser sur les fonctionnels

#### atom + display

cc-addon-credentials.js
cc-article-card.js
cc-badge.js
cc-beta.js
cc-block-section.js
cc-block.js
cc-button.js
cc-datetime-relative.js
cc-doc-card.js
cc-elasticsearch-info.js
cc-error.js
cc-expand.js
cc-flex-gap.js
cc-header-addon.js
cc-header-app.js
cc-header-orga.js
cc-heptapod-info.js
cc-html-frame.js
cc-img.js
cc-invoice.js
cc-tile-consumption.js
cc-tile-deployments.js
cc-tile-instances.js
cc-tile-requests.js
cc-tile-scalability.js
cc-tile-status-codes.js
cc-toggle.js
cc-zone.js
cc-warning-payment.js
cc-link.js
cc-loader.js
cc-logsmap.js
cc-map-marker-dot.js
cc-map-marker-server.js
cc-map.js
cc-matomo-info.js
cc-overview.js
cc-select.js
cc-smart-container.js

#### form

cc-addon-admin.js
cc-env-var-form.js
cc-grafana-info.js

#### input

cc-addon-elasticsearch-options.js
cc-addon-jenkins-options.js
cc-addon-mongodb-options.js
cc-addon-mysql-options.js
cc-addon-postgresql-options.js
cc-addon-redis-options.js
cc-addon-encryption-at-rest-option.js
cc-addon-option-form.js
cc-addon-option.js
cc-env-var-create.js
cc-env-var-editor-expert.js
cc-env-var-editor-json.js
cc-env-var-editor-simple.js
cc-env-var-input.js
cc-input-number.js
cc-input-text.js

#### list (readonly)

cc-addon-backups.js
cc-addon-features.js
cc-addon-linked-apps.js
cc-article-list.js
cc-doc-list.js
cc-invoice-list.js
cc-invoice-table.js

#### list + form


#### misc

cc-tcp-redirection-form.js
cc-tcp-redirection.js

cc-zone.js
cc-zone-input.js

cc-pricing-product.js
cc-pricing-table.js

cc-env-var-linked-services.js
cc-jenkins-info.js

cc-pricing-estimation.js
cc-pricing-header.js
cc-pricing-page.js
cc-pricing-product-consumption.js


* Pluriel ou pas ?
  * cc-addon-backups.js
  * cc-addon-features.js
  * cc-addon-linked-apps.js
* Suffixe `-list` ?
  * cc-article-list.js
  * cc-doc-list.js
  * cc-invoice-list.js
  * cc-ssh-key-list.js
  * cc-orga-member-list.js
* Suffixe `-form` ?
  * cc-env-var-form.js
  * cc-addon-option-form.js
  * cc-tcp-redirection-form.js
* Suffixe `-input` ?
  * cc-env-var-input.js
  * cc-zone-input.js
* Suffixe `-card` ?
  * cc-article-card.js
  * cc-doc-card.js
  * cc-orga-member-card.js

## UX Writing

Doc de travail un peu fourre tout pour l'instant

* e-mail (FR) vs email (EN)
* email vs email address
* signe de ponctuation FR/EN
* placement du symbole monétaire
