# YUNIMOBILE-0011B — Préparation du nettoyage disque Android

- **Statut** : terminé — espace suffisant, aucune suppression effectuée
- **Créé le** : 2026-10-11 (Europe/Paris)
- **Référence** : ticket CTO fourni en conversation ; présent fichier enregistré avant mesures.

## Objectif et périmètre

Préparer une liste exacte remesurée pour atteindre 12 Gio libres, idéalement 16 Gio.
Lecture seule hors de ce ticket, `docs/engineering/disk-cleanup-plan.md` et
`.loop/state.md`. Branche autorisée : `chore/yunimobile-0011b-disk-cleanup`.
Aucune suppression, déplacement, installation, arrêt de processus, push, build,
ADB ou changement de configuration. La décision CTO de clôture autorise uniquement
l'indexation explicite des trois documents et leur commit local.

## Références et état initial

Audit `docs/engineering/android-environment-audit.md` et ticket 0011A lus.
Préconditions propres Codex : main ; HEAD = origin/main =
`3ae8bdbb970b0f4e0df796a6864e405a05ba0241` ; status porcelain vide.

## Protections

Conserver Yunimobile et ses dépendances, dépôts Yunicity et fichiers suivis,
Studio/SDK/NDK, store pnpm partagé, node_modules actifs, Docker/WSL, données
personnelles/système et références Git. Usage incertain : exclu des recommandations.
pip-unpack : comptage des enfants directs uniquement, aucune ouverture.

## Plan et critères

- [x] Trois mesures libres sur 40 secondes : 20:52:51, 20:53:11, 20:53:31.
- [x] Métadonnées, tailles, liens, Git, processus et limites documentés.
- [x] Lots A/B/C/D exacts ; projections 12/16 Gio sans double comptage.
- [x] Diff relu, diff --check réussi, seulement trois documents non indexés.

## Actions et revue

Création de branche réalisée pendant la préparation. Clôture documentaire et
commit local autorisés par le CTO ; aucun push/merge/installation/nettoyage.
Auto-vérification propre réalisée ; décision CTO de clôture reçue en conversation.

## Résultats et preuves propres Codex

Plan et chemins exacts : `docs/engineering/disk-cleanup-plan.md`.
Commandes de départ `git status --porcelain`, `git branch --show-current`,
`git rev-parse HEAD origin/main` : arbre propre, main, SHA attendu identique.
`git switch -c chore/yunimobile-0011b-disk-cleanup` : exit 0.

`DriveInfo.AvailableFreeSpace` : trois mesures 16 602 124 288,
16 601 509 888 et 16 600 920 064 octets. Mesure finale à 21:11:41 :
16 508 424 192 octets (15,375 Gio), base prudente des projections.
Les variations externes ne sont pas un gain de nettoyage.

Inventaire Python `-B` en mémoire : 178 chemins principaux, 45 existants,
133 absents ; métadonnées et tailles, reparse non suivis, identités et nlink,
Git en lecture seule avec GIT_OPTIONAL_LOCKS=0. Inventaire complémentaire
des caches Next/Expo de Yunicity et journaux/caches locaux. Allocation NTFS
FileStandardInfo mesurée pour A/B et C1, zéro erreur, aucun lien multiple.
Parent/store/v3 pnpm et SDK/images imbriqués, aucun gain retenu.

`Get-CimInstance Win32_Process` : première lecture confinée refusée ; lecture
hors confinement réussie sans changement Windows ni arrêt de processus.
VS Code et deux installateurs actifs, Node/Next dans Yunicity, certaines
extensions `.obsolete` encore exécutées. Relevé final confirme leur présence.
Comptage enfants directs Temp : zéro pip-unpack ; aucune ouverture de ces dossiers.
Recherche ciblée vidéo/pytest sans candidat exact retrouvé.

Lot A : cinq bundles/journaux, 26 490 816 octets alloués ; perte des preuves
historiques à accepter. Lot B : sept caches locaux, 134 962 416 octets alloués.
A+B : gain indicatif 161 453 232 octets, espace projeté 15,525 Gio.
Pour 12 Gio : ensemble minimal vide, seuil déjà atteint.
Pour 16 Gio : manque 671 444 992 octets à la base finale ; aucun ensemble
actuellement recommandé suffisant. C1 seul donnerait 16,409 Gio après
fermeture autorisée et preuve d'inactivité ; scénario non validé actuellement,
pas une autorisation ou recommandation de supprimer un élément d'usage incertain.
Autres C et D non recommandés ; protections absolues conservées.

## Limites et revue

Temp : mesure partielle, un accès/contrôle en erreur et deux reparse exclus,
conservé sans proposition. Taille occupée certifiée seulement pour A/B/C1,
hors métadonnées NTFS ; ailleurs taille apparente et stockée/compressée.
Horodatages de racines ; recherche ciblée, pas recherche globale de fichiers
personnels. Les listes de processus ne certifient pas l'absence de handles.
Les anciennes preuves de build/audit ne sont pas régénérables à l'identique.
Aucune garantie d'atteindre 16 Gio dans l'état actuel.
Auto-vérification documentaire propre ; revue indépendante non exécutée,
CTO attendu. Aucun test applicatif nécessaire pour ce plan documentaire.
`git diff --check` : exit 0 sans sortie. Les trois documents lus et contrôlés
séparément pour UTF-8, newline finale et espaces terminaux (zéro anomalie),
car deux sont non suivis et ne figurent pas dans le diff standard.
`git status --branch --short` : branche 0011B, seulement les trois documents
attendus ; `git diff --cached --name-only` vide. HEAD et origin/main inchangés.

## Arrêt de la passe de préparation (historique)

Seuls ce ticket, le plan et .loop/state.md écrits ; branche créée, HEAD inchangé.
Aucun index, commit, push, merge, suppression, déplacement, installation,
arrêt de processus, nettoyage, ADB ou build. Décision CTO attendue avant
toute phase de fermeture ou suppression ; aucun ticket suivant lancé.

## Décision CTO de clôture — 2026-10-11

Espace retenu pour la décision : 15,375 Gio mesurés à 21:11:41 Europe/Paris.
Le seuil minimum de 12 Gio est atteint ; aucune suppression nécessaire.
Ne pas exécuter les lots A, B, C ou D. CachedExtensionVSIXs reste intact :
VS Code et ses installateurs sont actifs dans le relevé. Aucun nettoyage exécuté ;
la différence avec la mesure précédente n'est pas attribuée à ce ticket.

Remesurer l'espace avant toute génération ou build Android. Ne pas commencer
le build avec moins de 12 Gio libres. Pendant le build, arrêter si l'espace
approche 5 Gio lorsque cela peut être fait sans corrompre une opération en cours.
Ces consignes sont des garde-fous futurs, sans autorisation de build ici.

Prochaine étape proposée : YUNIMOBILE-0011C — configuration Java/Android et
vérification d'un appareil physique, sans build dans un premier temps. Non lancé.

Clôture limitée aux trois documents : UTF-8, LF, newline finale, absence de donnée
sensible et chemins limités à la traçabilité du plan ; contrôles Git proportionnés.
Indexation explicite et `git diff --cached --check` avant commit local :
`docs: assess disk capacity for Android build`, corps `Ticket: YUNIMOBILE-0011B`.
Vérifier ensuite SHA, arbre propre, avance d'un commit sur main, main/origin/main
inchangés au merge 3ae8bdb et espace libre final. Aucun push, fusion ou nettoyage.
