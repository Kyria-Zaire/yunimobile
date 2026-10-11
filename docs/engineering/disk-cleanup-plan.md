# Plan de nettoyage disque — YUNIMOBILE-0011B

Date : 2026-10-11, Europe/Paris. Préparation en lecture seule par Codex.
Aucune suppression effectuée. Décision CTO : clôture sans exécuter les lots.
Statut : **terminé — espace suffisant, aucune suppression effectuée**.

## Préconditions et mesures propres

Départ : main ; HEAD = origin/main =
`3ae8bdbb970b0f4e0df796a6864e405a05ba0241` ; `git status --porcelain` vide.
Branche créée : `chore/yunimobile-0011b-disk-cleanup`.
Le ticket 0011B a été enregistré avant les mesures. Audit et ticket 0011A lus.

Commande : trois lectures de `[IO.DriveInfo]::new('C:\').AvailableFreeSpace`, espacées
par deux attentes de 20 secondes ; conversion horaire Europe/Paris.

| Heure | Octets libres |
|---|---:|
| 20:52:51 | 16 602 124 288 |
| 20:53:11 | 16 601 509 888 |
| 20:53:31 | 16 600 920 064 |

Le minimum initial des trois mesures est de 15,461 Gio environ ; la projection
finale utilise la mesure finale plus basse indiquée en fin de rapport.
Le seuil de 12 Gio est déjà atteint, sans nettoyage. Les variations ultérieures
ne sont pas attribuées à cet inventaire.

## Méthode et limites

Python `-B` exécuté depuis une chaîne en mémoire, aucune création de script,
cache ou journal. Métadonnées seulement : `os.stat(follow_symlinks=False)`,
attribut REPARSE_POINT sur cibles et ancêtres ; jonctions/liens ignorés.
Identités `(st_dev, st_ino)` dédupliquées, `st_nlink` contrôlé directement.
`GetCompressedFileSizeW` mesure la taille stockée/compressée des fichiers.
Elle ne mesure pas les métadonnées NTFS ni nécessairement les derniers clusters
alloués : la taille occupée complète n'est donc pas certifiée. Le gain indicatif
exclut les fichiers à plusieurs liens physiques ; une mesure incomplète n'est
jamais assimilée à un dossier vide. Cibles imbriquées non additionnées.

Contrôle Git par recherche de `.git` dans les ancêtres et dans les dossiers
inventoriés, puis `git ls-files -z -- <chemin>` avec `GIT_OPTIONAL_LOCKS=0`.
Sans dépôt ancêtre ni métadonnées Git descendantes : aucun suivi Git trouvé.
Aucun contenu de fichier utilisateur, secret ou `.env` lu.

Processus : `Get-CimInstance Win32_Process`, filtrage en mémoire des noms et
chemins candidats ; arguments complets non affichés. Première lecture confinée
refusée ; lecture autorisée hors confinement réussie, sans lancement administrateur.
VS Code, ses deux processus d'installation, Codex et Claude actifs. Trois Node
visibles (121760, 110280, 57000) associés à des chemins Yunicity ; aucun ne mentionne
les caches temporaires 0007/0009/0010. Next actif dans `yunicity-wt-pr202-ci`.
Aucun Python/uv/pip, Java/Gradle, ffmpeg/pytest visible dans le relevé initial
(avant lancement du Python d'inventaire). Une liste de processus ne certifie pas
l'absence de handles ni l'inactivité future ; refaire les garde-fous immédiatement
avant toute éventuelle suppression. Ne pas arrêter de processus dans cette passe.

pip-unpack : comptage des seuls enfants directs de Temp, zéro trouvé.
Aucun ouvert, aucun proposé. Aucun enfant direct nommé vidéo/ffmpeg/pytest trouvé
dans Temp ou C:\tmp ; aucun chemin vidéo/pytest antérieur précis retrouvé par
`rg -n -i 'video|pytest|ffmpeg' .loop docs/engineering`. Recherche ciblée,
pas une garantie d'absence sur tout le disque ; aucun temporaire anonyme proposé.

## Protections et décision

Conserver Yunimobile et son node_modules, les dépôts Yunicity, leurs fichiers
suivis et caches, Studio/SDK/build-tools/platform-tools/NDK, le store pnpm partagé,
les dépendances actives, Docker/WSL/VHDX/swap, les données système/personnelles
et toutes les références Git. Aucun gain de ces éléments ne finance le plan.
Les références techniques 0007/0009 et traces 0009a restent conservées ; la fusion
ne prouve pas, à elle seule, leur obsolescence documentaire.

## Lots et garde-fous

Les lots ci-dessous sont des objets de revue, pas des commandes exécutables.
Avant toute suppression future : autorisation CTO sur chemins exacts, nouvelle
mesure libre, résolution absolue et contrôle des ancêtres, refus de tout reparse
inattendu, contrôle Git/fichiers suivis, nouvelle mesure des liens physiques,
vérification de l'absence de processus/installation et d'usage incertain,
confirmation de la perte acceptée, suppression native Windows limitée aux
chemins approuvés. Ne jamais utiliser de joker ni rediriger vers une cible liée.

### Lot A — artefacts temporaires Yunimobile

Bundles/journaux historiques des diagnostics et de l'extraction : potentiellement
obsolètes pour le développement, mais conservés comme preuves. Effet : perte
des sorties originales. Un nouvel export Metro peut recréer un bundle après
autorisation de build/export ; il ne recrée pas la preuve historique. Les mesures
et sorties anciennes ne sont pas régénérables à l'identique : acceptation CTO
expresse de cette perte avant sélection du lot.

### Lot B — caches de build régénérables et inactifs

Caches Metro et caches npm propres aux diagnostics sous C:\tmp uniquement.
Régénération par les commandes Expo/Metro/doctor du ticket d'origine, lors d'une
future exécution autorisée ; peut exiger téléchargement. Vérifier qu'aucun
processus ne réutilise ces chemins ; conserver code, lockfiles et dépendances.
Caches Next/Turbo dans Yunicity ou Yunimobile exclus, même non suivis.
Gradle absent s'il est confirmé par l'inventaire : aucun gain à prévoir.

### Lot C — caches d'outils liés à VS Code

CachedExtensionVSIXs, anciennes extensions marquées `.obsolete` et absentes
du registre actif : inventaire seulement pendant cette passe. VS Code, agents
et installation actifs, donc gain recommandé nul aujourd'hui. Une version peut
être marquée obsolète tout en étant exécutée ; le marqueur ne suffit pas.
Conséquence d'un nettoyage ultérieurement validé : perte de cache/ancienne version,
nouveau téléchargement ou réinstallation pour restauration. Refaire les contrôles
après fermeture complète autorisée, y compris installateurs et sessions d'agents.

### Lot D — facultatifs/incertains, non recommandés

Copies complètes 0007/0009, traces de réécriture 0009a, cache npm global, résidus
non enregistrés d'extensions et temporaires d'origine inconnue : conserver.
Copie 0007 : ancien abandon après refus d'accès, pas de changement d'ACL proposé.
Copie 0009 : référence technique ; liens physiques avec dépendances partagées.
Aucun processus associé visible pour les copies 0007/0009 et les traces 0009a,
mais leur utilité documentaire justifie leur conservation. Temp est associé
aux installateurs VS Code visibles et reste intégralement conservé.
Cache npm global : installations/processus Node présents, usage non certifié.
Restauration de sources/copies ou preuves non garantie ; les caches npm se
reconstruiraient lors d'une installation autorisée avec accès réseau.
Le store pnpm est une protection absolue, pas un candidat facultatif.

## Liste exacte des artefacts A et caches B

Tous les chemins ci-dessous existent, sont des dossiers ordinaires et n'ont
aucun reparse dans leurs ancêtres ou descendants mesurés, aucun accès refusé,
aucun lien physique multiple, aucun dépôt Git ou fichier suivi détecté.
Aucun processus visible associé lors du relevé ; garde-fous généraux à refaire.
Les conséquences/régénérations de chaque ligne sont celles de son lot ci-dessus.
Pour A/B, mesure complémentaire propre de l'allocation NTFS via
`CreateFileW` (accès contenu nul, partage lecture/écriture/suppression) et
`GetFileInformationByHandleEx(FileStandardInfo).AllocationSize`, handles refermés.
Aucun contenu lu. Zéro erreur, identités dédupliquées, `NumberOfLinks=1` pour les
gains retenus. Métadonnées NTFS et activité future peuvent modifier le gain réel.
Pour A1/A2 : accepter spécifiquement la perte de preuves 0007/0009 avant décision.

| N° | Chemin absolu | Apparente, octets | Allouée / gain indicatif, octets | Dernière modification UTC |
|---|---|---:|---:|---|
| A1 | `C:\tmp\yunimobile-0007-diag\logs` | 18393732 | 18440088 / 18440088 | 2026-10-02 01:01:53 |
| A2 | `C:\tmp\yunimobile-0009-extract\logs` | 193276 | 224024 / 224024 | 2026-10-02 03:07:47 |
| A3 | `C:\tmp\yunimobile-0010-logs` | 308919 | 346528 / 346528 | 2026-10-02 10:55:59 |
| A4 | `C:\tmp\yunimobile-0010b-dist-android` | 6448632 | 6477392 / 6477392 | 2026-10-02 11:45:05 |
| A5 | `C:\tmp\yunimobile-0010b-logs` | 942921 | 1002784 / 1002784 | 2026-10-02 12:27:32 |

| N° | Chemin absolu | Apparente, octets | Allouée / gain indicatif, octets | Dernière modification UTC |
|---|---|---:|---:|---|
| B1 | `C:\tmp\yunimobile-0007-diag\npm-cache-0008` | 2687435 | 2764032 / 2764032 | 2026-10-02 01:46:31 |
| B2 | `C:\tmp\yunimobile-0009-extract\.npm-cache-doctor` | 2686698 | 2764032 / 2764032 | 2026-10-02 02:52:35 |
| B3 | `C:\tmp\yunimobile-0009-extract\.tmp-metro` | 37393680 | 41302096 / 41302096 | 2026-10-02 03:00:02 |
| B4 | `C:\tmp\yunimobile-0010-doctor-cache` | 2686188 | 2764032 / 2764032 | 2026-10-02 10:42:30 |
| B5 | `C:\tmp\yunimobile-0010-metro-temp` | 37392838 | 41302096 / 41302096 | 2026-10-02 10:50:07 |
| B6 | `C:\tmp\yunimobile-0010b-doctor-cache` | 2686209 | 2764032 / 2764032 | 2026-10-02 11:37:33 |
| B7 | `C:\tmp\yunimobile-0010b-metro-temp` | 37392901 | 41302096 / 41302096 | 2026-10-02 11:45:04 |

## Caches Next et Expo des dépôts Yunicity : conservés

Inventaire ciblé des emplacements conventionnels Next/Turbo/Expo à la racine,
sous frontend et frontend/apps/{web,mobile} des dossiers Yunicity visibles.
Les chemins existants ci-dessous sont tous des dossiers, sans reparse ni erreurs,
sans liens physiques multiples dans ce relevé. Ils appartiennent à des dépôts
Git ; leurs caches recensés ne sont pas suivis. Ils restent protégés, sans
proposition de suppression ni gain intégré. Aucun cache Turbo trouvé à ces
emplacements ; absence globale non démontrée. Régénération Next/Expo possible
par build/démarrage autorisé, mais hors de ce plan.

| Chemin absolu | Apparente / stockée, octets | Modification UTC | Git / usage |
|---|---:|---|---|
| `C:\Users\kyria\yunicity-wt-auth02a\frontend\apps\mobile\.expo` | 23012 / 23012 | 2026-09-11 14:16:53 | Dépôt Yunicity, 0 suivi ; usage non certifié ; gain recommandé 0 |
| `C:\Users\kyria\yunicity-wt-auth02a\frontend\apps\web\.next` | 692622 / 692622 | 2026-09-11 14:16:29 | Dépôt Yunicity, 0 suivi ; usage non certifié ; gain recommandé 0 |
| `C:\Users\kyria\yunicity-wt-auth03\frontend\apps\mobile\.expo` | 22910 / 22910 | 2026-09-11 10:02:01 | Dépôt Yunicity, 0 suivi ; usage non certifié ; gain recommandé 0 |
| `C:\Users\kyria\yunicity-wt-auth03\frontend\apps\web\.next` | 685719 / 685719 | 2026-09-11 10:01:37 | Dépôt Yunicity, 0 suivi ; usage non certifié ; gain recommandé 0 |
| `C:\Users\kyria\yunicity-wt-auth04a\frontend\apps\mobile\.expo` | 23011 / 23011 | 2026-09-11 11:27:39 | Dépôt Yunicity, 0 suivi ; usage non certifié ; gain recommandé 0 |
| `C:\Users\kyria\yunicity-wt-auth04a\frontend\apps\web\.next` | 689821 / 689821 | 2026-09-11 11:27:20 | Dépôt Yunicity, 0 suivi ; usage non certifié ; gain recommandé 0 |
| `C:\Users\kyria\yunicity-wt-c3-videos-final\frontend\apps\mobile\.expo` | 23828 / 23828 | 2026-09-04 21:08:03 | Dépôt Yunicity, 0 suivi ; usage non certifié ; gain recommandé 0 |
| `C:\Users\kyria\yunicity-wt-c3-videos-final\frontend\apps\web\.next` | 705757 / 705757 | 2026-09-04 21:08:28 | Dépôt Yunicity, 0 suivi ; usage non certifié ; gain recommandé 0 |
| `C:\Users\kyria\yunicity-wt-media01\frontend\apps\web\.next` | 697641 / 697641 | 2026-09-13 19:13:25 | Dépôt Yunicity, 0 suivi ; usage non certifié ; gain recommandé 0 |
| `C:\Users\kyria\yunicity-wt-media01b-fix\frontend\apps\web\.next` | 711544 / 711544 | 2026-09-14 06:48:58 | Dépôt Yunicity, 0 suivi ; usage non certifié ; gain recommandé 0 |
| `C:\Users\kyria\yunicity-wt-media01c-fix\frontend\apps\web\.next` | 712214 / 712214 | 2026-09-14 09:40:03 | Dépôt Yunicity, 0 suivi ; usage non certifié ; gain recommandé 0 |
| `C:\Users\kyria\yunicity-wt-media02\frontend\apps\web\.next` | 11992 / 11992 | 2026-09-14 11:18:46 | Dépôt Yunicity, 0 suivi ; usage non certifié ; gain recommandé 0 |
| `C:\Users\kyria\yunicity-wt-pr202-ci\frontend\apps\mobile\.expo` | 23114 / 23114 | 2026-09-05 11:48:17 | Dépôt Yunicity, 0 suivi ; Next actif ; gain recommandé 0 |
| `C:\Users\kyria\yunicity-wt-pr202-ci\frontend\apps\web\.next-build` | 539826875 / 539826875 | 2026-10-11 17:29:47 | Dépôt Yunicity, 0 suivi ; Next actif ; gain recommandé 0 |
| `C:\Users\kyria\yunicity-wt-temoin\frontend\apps\web\.next-build` | 538410783 / 538410783 | 2026-10-11 16:14:46 | Dépôt Yunicity, 0 suivi ; usage non certifié ; gain recommandé 0 |
| `C:\Users\kyria\yunicity\frontend\.next` | 138 / 138 | 2026-08-27 16:05:43 | Dépôt Yunicity, 0 suivi ; usage non certifié ; gain recommandé 0 |
| `C:\Users\kyria\yunicity\frontend\apps\mobile\.expo` | 48241 / 48241 | 2026-05-19 05:07:08 | Dépôt Yunicity, 0 suivi ; usage non certifié ; gain recommandé 0 |

## Inventaire complémentaire remesuré

178 chemins contrôlés dans le relevé principal : 45 existants, 133 absents.
Les tailles ci-dessous sont celles du 11 octobre, pas celles de l'audit 0011A.
Horodatage de la dernière modification de la racine, en UTC. La taille stockée
est celle de l'API de compression, sans certification des clusters ; A/B et C1
ont en plus une mesure AllocationSize détaillée. Aucun gain protégé n'est intégré.
Temp : mesure partielle (1 erreur, 2 reparse exclus), conservé intégralement ;
aucun contenu ni nom de fichier personnel rapporté. Node.exe : ancêtre lié,
taille non mesurée, conservé. Parent pnpm/store/v3, SDK/system-images et copies/
sous-caches sont imbriqués : ne jamais les additionner.

| Chemin absolu | Type | Apparente / stockée, octets | Octets à liens multiples | Reparse / erreurs | Modification UTC | Git | Décision |
|---|---|---:|---:|---|---|---|---|
| `C:\Program Files\Android\Android Studio` | dossier | 3306769162 / 3306769162 | 0 | 0 / 0 | 2025-11-03 13:03:07 | aucun trouvé | Protégé ; hors suppression ; gain 0 |
| `C:\Program Files\Eclipse Adoptium\jdk-21.0.6.7-hotspot` | dossier | 343047436 / 343047436 | 0 | 0 / 0 | 2025-03-05 11:32:47 | aucun trouvé | Protégé ; hors suppression ; gain 0 |
| `C:\Program Files\Java\jdk-23` | dossier | 400806120 / 400806120 | 0 | 0 / 0 | 2025-03-04 20:34:52 | aucun trouvé | Protégé ; hors suppression ; gain 0 |
| `C:\Users\kyria\.vscode\extensions\.00bec70c-3400-48c9-b46f-026cf7d9b212` | dossier | 21565528 / 21565528 | 0 | 0 / 0 | 2026-03-17 19:58:40 | aucun trouvé | D ; résidu non enregistré ; usage incertain ; gain 0 |
| `C:\Users\kyria\.vscode\extensions\.02470642-7d53-4d29-8daa-ff11cede4834` | dossier | 9822972 / 9822972 | 0 | 0 / 0 | 2026-03-17 19:58:39 | aucun trouvé | D ; résidu non enregistré ; usage incertain ; gain 0 |
| `C:\Users\kyria\.vscode\extensions\.39a100e9-a05f-4f14-903e-60b5c5fc2782` | dossier | 11238079 / 11238079 | 0 | 0 / 0 | 2026-03-17 19:58:38 | aucun trouvé | D ; résidu non enregistré ; usage incertain ; gain 0 |
| `C:\Users\kyria\.vscode\extensions\.56e40983-18b5-4faa-832c-afa24d99d44a` | dossier | 6815305 / 6815305 | 0 | 0 / 0 | 2026-03-17 19:58:39 | aucun trouvé | D ; résidu non enregistré ; usage incertain ; gain 0 |
| `C:\Users\kyria\.vscode\extensions\.8a638f7b-a634-452a-ada1-e1c11e381b28` | dossier | 22332533 / 22332533 | 0 | 0 / 0 | 2026-03-17 19:58:38 | aucun trouvé | D ; résidu non enregistré ; usage incertain ; gain 0 |
| `C:\Users\kyria\.vscode\extensions\.902d456e-c801-45a1-9268-e29b011ed5ca` | dossier | 4134323 / 4134323 | 0 | 0 / 0 | 2026-03-17 19:58:36 | aucun trouvé | D ; résidu non enregistré ; usage incertain ; gain 0 |
| `C:\Users\kyria\.vscode\extensions\.98de868b-e740-46c1-8234-adce4f1c8db6` | dossier | 37793689 / 37793689 | 0 | 0 / 0 | 2026-03-17 19:58:33 | aucun trouvé | D ; résidu non enregistré ; usage incertain ; gain 0 |
| `C:\Users\kyria\.vscode\extensions\.b0890224-9589-4793-b23f-2db58d9202e3` | dossier | 24790503 / 24790503 | 0 | 0 / 0 | 2026-03-17 19:58:36 | aucun trouvé | D ; résidu non enregistré ; usage incertain ; gain 0 |
| `C:\Users\kyria\.vscode\extensions\.d2061fe9-0d7e-47f3-baef-af202494c11b` | dossier | 13154039 / 13154039 | 0 | 0 / 0 | 2026-03-17 19:58:40 | aucun trouvé | D ; résidu non enregistré ; usage incertain ; gain 0 |
| `C:\Users\kyria\.vscode\extensions\.e673b914-8b69-4232-ba40-4f36a8935348` | dossier | 26866630 / 26866630 | 0 | 0 / 0 | 2026-03-17 19:58:38 | aucun trouvé | D ; résidu non enregistré ; usage incertain ; gain 0 |
| `C:\Users\kyria\.vscode\extensions\.fe8f2cc6-96cf-41ad-9e7e-5c162c5cf9cc` | dossier | 26494128 / 26494128 | 0 | 0 / 0 | 2026-03-17 19:58:37 | aucun trouvé | D ; résidu non enregistré ; usage incertain ; gain 0 |
| `C:\Users\kyria\.vscode\extensions\anthropic.claude-code-2.1.295-win32-x64` | dossier | 271215251 / 271215251 | 0 | 0 / 0 | 2026-10-09 10:00:45 | aucun trouvé | C ; obsolète marqué ; usage actuel ou incertain ; gain 0 |
| `C:\Users\kyria\.vscode\extensions\codium.codium-2.2.6` | dossier | 20189302 / 20189302 | 0 | 0 / 0 | 2026-09-02 11:24:59 | aucun trouvé | C ; obsolète marqué ; usage actuel ou incertain ; gain 0 |
| `C:\Users\kyria\.vscode\extensions\openai.chatgpt-26.1002.51308-win32-x64` | dossier | 1443498580 / 1443498580 | 0 | 0 / 0 | 2026-10-07 12:06:37 | aucun trouvé | C ; obsolète marqué ; usage actuel ou incertain ; gain 0 |
| `C:\Users\kyria\.vscode\extensions\rangav.vscode-thunder-client-2.41.5` | dossier | 7009924 / 7009924 | 0 | 0 / 0 | 2026-10-01 05:04:48 | aucun trouvé | C ; obsolète marqué ; usage actuel ou incertain ; gain 0 |
| `C:\Users\kyria\.vscode\extensions\redhat.vscode-yaml-1.24.0` | dossier | 3709004 / 3709004 | 0 | 0 / 0 | 2026-07-08 09:02:26 | aucun trouvé | C ; obsolète marqué ; usage actuel ou incertain ; gain 0 |
| `C:\Users\kyria\.vscode\extensions\sixth.sixth-ai-0.3.9` | dossier | 68411680 / 68411680 | 0 | 0 / 0 | 2026-10-09 10:00:16 | aucun trouvé | C ; obsolète marqué ; usage actuel ou incertain ; gain 0 |
| `C:\Users\kyria\.vscode\extensions\vue.volar-3.3.12` | dossier | 4270862 / 4270862 | 0 | 0 / 0 | 2026-10-03 10:54:29 | aucun trouvé | C ; obsolète marqué ; usage actuel ou incertain ; gain 0 |
| `C:\Users\kyria\AppData\Local\Android\Sdk` | dossier | 6847647018 / 6847647018 | 0 | 0 / 0 | 2025-11-14 16:31:27 | aucun trouvé | Protégé ; hors suppression ; gain 0 |
| `C:\Users\kyria\AppData\Local\Android\Sdk\system-images` | dossier | 2266184157 / 2266184157 | 0 | 0 / 0 | 2025-11-14 15:56:53 | aucun trouvé | Protégé ; hors suppression ; gain 0 |
| `C:\Users\kyria\AppData\Local\Temp` | dossier | 924125143 / 924019473 | 0 | 2 / 1 | 2026-10-11 18:54:39 | aucun trouvé | Protégé ; hors suppression ; gain 0 |
| `C:\Users\kyria\AppData\Local\npm-cache` | dossier | 1483584067 / 1483584067 | 0 | 0 / 0 | 2026-08-27 14:32:21 | aucun trouvé | D ; référence/preuve ou cache global incertain ; gain 0 |
| `C:\Users\kyria\AppData\Local\pnpm` | dossier | 9485024554 / 9450556833 | 3392313780 | 0 / 0 | 2026-10-11 15:25:38 | aucun trouvé | Protégé ; hors suppression ; gain 0 |
| `C:\Users\kyria\AppData\Local\pnpm\store` | dossier | 9378638683 / 9376347797 | 3350039854 | 0 / 0 | 2026-09-12 20:47:10 | aucun trouvé | Protégé ; hors suppression ; gain 0 |
| `C:\Users\kyria\AppData\Local\pnpm\store\v3` | dossier | 6552062150 / 6552062150 | 1091088902 | 0 / 0 | 2026-05-18 21:22:22 | aucun trouvé | Protégé ; hors suppression ; gain 0 |
| `C:\Users\kyria\AppData\Roaming\Code\CachedExtensionVSIXs` | dossier | 1110716557 / 1110716557 | 0 | 0 / 0 | 2026-10-11 14:59:16 | aucun trouvé | C1 ; VS Code/installateurs actifs ; gain recommandé 0 |
| `C:\Users\kyria\yunimobile\node_modules` | dossier | 328117759 / 308502084 | 327442068 | 0 / 0 | 2026-10-02 11:25:58 | 0 suivi, dépôt C:\Users\kyria\yunimobile | Protégé ; hors suppression ; gain 0 |
| `C:\tmp\yunimobile-0007-diag` | dossier | 963738731 / 963738731 | 0 | 4 / 0 | 2026-10-02 01:16:00 | aucun trouvé | D ; référence/preuve ou cache global incertain ; gain 0 |
| `C:\tmp\yunimobile-0009-extract` | dossier | 370722030 / 351104161 | 327371188 | 4 / 0 | 2026-10-02 02:54:44 | aucun trouvé | D ; référence/preuve ou cache global incertain ; gain 0 |
| `C:\tmp\yunimobile-0009a` | dossier | 19727 / 19727 | 0 | 0 / 0 | 2026-10-02 08:45:55 | aucun trouvé | D ; référence/preuve ou cache global incertain ; gain 0 |

C1 : allocation NTFS complémentaire 1 110 786 048 octets, 33 fichiers,
zéro erreur, pas de lien multiple. Gain potentiel conditionnel uniquement ;
usage pendant l'installation de VS Code non certifié, donc exclu aujourd'hui.
Les extensions `.obsolete` 2.1.295 de Claude, 26.1002.51308 de Codex,
redhat.vscode-yaml-1.24.0 et vue.volar-3.3.12 sont encore exécutées dans le
relevé de processus. Même marquées obsolètes et absentes du registre actuel,
elles ne sont pas proposées. Les trois autres versions marquées restantes
ont un usage incertain dans les sessions ouvertes, même décision.

Régénération/conséquences pour les lignes C : réinstallation/téléchargement
d'extension ou de VSIX après autorisation ; perte du cache et du retour immédiat
à l'ancienne version. Lignes D résidu : provenance/restauration non établies.
Lignes D copies : conserver code, dépendances et preuves ; aucune régénération
historique garantie. Lignes protégées : aucune méthode de suppression proposée.
Garde-fous communs à refaire sur chaque chemin ; l'activité inconnue interdit
la recommandation. Mesure d'occupation exacte non exécutée sur les gros chemins
protégés, car leur allocation ne change pas la sélection des lots.

## Absences constatées

133 chemins absents dans le relevé principal : anciennes versions d'extensions
signalées dans l'audit 0011A ou par `.obsolete`, Gradle, AVD et caches testés.
Aucune taille ancienne reprise, aucun gain retenu. Les chemins inexistants sans
utilité pour la décision de clôture ne sont pas reproduits individuellement.
Comptage pip-unpack : zéro enfant direct, aucun ouvert ni proposé. Recherche
vidéo/pytest ciblée, sans preuve d'absence globale.

## Projections de préparation (historiques, lots non retenus)

Mesure finale propre : 21:11:41 Europe/Paris, 16 508 424 192 octets libres,
soit **15,375 Gio** environ. Elle est inférieure aux mesures initiales et devient
la base prudente ; variations externes pendant le relevé, aucun nettoyage effectué.
1 Gio = 1 073 741 824 octets. Sommes sans doubles comptes, à remesurer avant décision.

| Ensemble | Gain indicatif, octets | Espace libre projeté | Sélection |
|---|---:|---:|---|
| Aucun lot | 0 | 15,375 Gio | **Minimum pour 12 Gio : ensemble vide** |
| A seul (5 chemins) | 26 490 816 | 15.399 Gio | Facultatif, accepter perte de preuves |
| B seul (7 chemins) | 134 962 416 | 15.500 Gio | Facultatif, caches locaux ; garde-fous |
| A+B | 161 453 232 | 15.525 Gio | Approche 16 Gio sans les atteindre |
| C1 seul, si ultérieurement confirmé inactif | 1 110 786 048 | 16.409 Gio | Scénario conditionnel, **non recommandé dans l'état actuel** |
| D / autres C / protections | 0 retenu | Aucun gain retenu | Non recommandés |

Pour 16 Gio, il manque aujourd'hui 671444992 octets, environ 0.625 Gio.
Aucun ensemble actuellement recommandé ne prouve l'atteinte de 16 Gio.
Après fermeture autorisée et vérification d'inactivité certaine, le sous-lot C1
seul serait le plus petit ensemble de lots de cette liste permettant 16 Gio ;
A/B ne seraient pas nécessaires. Ce calcul ne constitue pas une proposition de
supprimer un cache d'usage incertain : le CTO doit d'abord décider de cette phase
et une nouvelle lecture seule doit lever l'incertitude avant autorisation exacte.
Ne pas élargir le plan vers le store pnpm ou les éléments protégés.

## Vérification et arrêt de la préparation (historique)

Auto-vérification propre Codex : tableaux/sommes relus, séparation fait/hypothèse,
protections et absence de double comptage. Revue indépendante non réalisée ;
revue CTO attendue. Aucun nettoyage, arrêt de processus, ADB, installation,
build, indexation, commit, push ou suppression de référence. Seule branche créée
et trois documents écrits. État final : à revoir — plan préparé, aucune suppression
effectuée. Contrôles documentaires et Git finaux consignés dans le ticket.

## Décision CTO de clôture — 2026-10-11

15,375 Gio disponibles à la mesure retenue pour la clôture ; seuil minimum de
12 Gio atteint. **Aucune suppression nécessaire ; ne pas exécuter A, B, C ou D.**
Les projections précédentes restent des hypothèses de préparation abandonnées.
CachedExtensionVSIXs reste intact, car VS Code et ses installateurs sont actifs
dans le relevé. Aucun nettoyage effectué ; la différence avec la mesure précédente
n'est pas attribuée au ticket. La mesure finale après commit sera rapportée
séparément ; elle n'est pas un gain de suppression.

Remesurer avant toute génération ou build Android. Ne pas commencer le build
si moins de 12 Gio sont libres. Pendant le build, arrêter si l'espace approche
5 Gio lorsque cela peut être fait sans corrompre une opération en cours.
Aucune génération ni build autorisé ou lancé par cette clôture.

Prochaine étape proposée : **YUNIMOBILE-0011C — configuration Java/Android et
vérification d'un appareil physique, sans build dans un premier temps**. Non lancé.
Clôture documentaire avec indexation explicite des trois fichiers et commit local
autorisé par le CTO ; aucun push, merge, arrêt de processus, installation ou nettoyage.
