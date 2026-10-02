# Compatibilité Expo SDK 54 de la base mobile

Diagnostic YUNIMOBILE-0008, 2026-10-02, Claude Code. Copie isolée de YUNIMOBILE-0007,
sans modification ni réparation du projet.

## Résumé

| Contrôle | Code de sortie | Résultat |
|---|---|---|
| `expo install --check` (CLI 54.0.24, pnpm) | 1 | 4 paquets en retard de version corrective (patch) dans SDK 54 |
| `expo-doctor` 1.20.4 `--verbose` | 1 | 15 contrôles réussis sur 18, 3 en échec |
| Matrice déclaré / verrouillé / installé (dépendances directes) | — | 29 sur 29 cohérentes |

Les contrôles n'ont détecté aucune incompatibilité explicite avec Expo SDK 54, en
dehors de quatre écarts de versions correctives. Aucun build ou comportement
d'exécution n'est encore prouvé. Les deux autres constats, les emplacements
multiples de React et la configuration Metro, viennent de la configuration du
monorepo, pas du code mobile.

**Décision CTO (2026-10-02)** : option A approuvée sous la forme d'une extraction
contrôlée (voir § 11).

## 1. Environnement

| Élément | Valeur |
|---|---|
| Source | `C:\Users\kyria\yunicity` @ `ee57ce1dfc37835a47335e56338578471a95ec7d`, inchangée avant et après (HEAD, branche, statut avec non suivis, stashes, toutes les refs) |
| Copie | `C:\tmp\yunimobile-0007-diag\src\frontend` (YUNIMOBILE-0007) |
| Application | `apps/mobile` |
| Journaux | `C:\tmp\yunimobile-0007-diag\logs\YUNIMOBILE-0008\` |
| Node.js | v24.18.1 (`C:\nvm4w\nodejs`) |
| npm | 11.16.0 ; registre `https://registry.npmjs.org/` |
| pnpm | 10.16.1 global ; le projet déclare `pnpm@9.15.9` (`packageManager`) |
| Expo | 54.0.34 ; `@expo/cli` 54.0.24 ; `expo-modules-autolinking` 3.0.25 ; `@expo/config` 12.0.13 |
| React Native | 0.81.5 |
| React | 19.1.0 (`apps/mobile/node_modules`) ; 18.3.1 (racine `frontend/node_modules`) |
| Expo Router | 6.0.23 |
| TypeScript | 5.9.3 |
| Espace libre `C:` | 4,288 Gio avant ; 4,272 Gio après |

## 2. expo-doctor : provenance et intégrité

Métadonnées lues avec `npm view` en lecture seule, avec un cache dédié
(`C:\tmp\yunimobile-0007-diag\npm-cache-0008`) :

| Champ | Valeur |
|---|---|
| `name` | `expo-doctor` |
| `version` | `1.20.4` (version courante au 2026-10-02 ; `time.modified` 2026-09-29) |
| `repository` | `git+https://github.com/expo/expo.git`, dossier `packages/expo-doctor` |
| `license` | MIT |
| `engines.node` | `^20.19.4 \|\| ^22.13.0 \|\| ^24.3.0 \|\| >= 25.0.0` (Node 24.18.1 compatible) |
| `dist.integrity` | `sha512-Jm1lIqVdO8br9wiqTg5QhJ1u4zLWAhoue4bXsEuzW543vC3XY+U0cpEOmiLkvJhTTgZgIK+24l4i8VzyZ2VLMg==` |
| `dist.tarball` | `https://registry.npmjs.org/expo-doctor/-/expo-doctor-1.20.4.tgz` |
| Mainteneurs | comptes de l'équipe Expo (dont `expoadmin`, `expo-bot`) |

Paquet officiel Expo : dépôt `expo/expo`, registre npm public, mainteneurs Expo.
Le `package-lock.json` créé par `npm exec` dans le cache dédié (`_npx`) indique
`expo-doctor` 1.20.4, avec une intégrité identique à `dist.integrity`.

## 3. Commandes et codes de sortie

Dossier : `C:\tmp\yunimobile-0007-diag\src\frontend\apps\mobile`

| Contrôle | Commande exacte | Début → fin | Code |
|---|---|---|---|
| `expo install --check` | `CI=1 EXPO_NO_TELEMETRY=1 node ../../node_modules/expo/bin/cli install --check --pnpm` | 03:44:58 → 03:45:17 | **1** |
| `expo-doctor` | `CI=1 EXPO_NO_TELEMETRY=1 npm_config_cache=C:\tmp\yunimobile-0007-diag\npm-cache-0008 npm exec --yes --package=expo-doctor@1.20.4 -- expo-doctor --verbose` | 03:45:37 → 03:47:50 | **1** |

- Le CLI Expo utilisé est celui installé dans la copie, pas `npx expo`. D'après son
  code (`install/checkPackages.js`, `utils/interactive.js`), `--check` sans `--fix`
  ne propose une correction qu'en mode interactif ; avec `CI=1`, il rapporte seulement
  et sort avec le code 1 si des dépendances sont en retard. Aucune proposition n'a
  été faite ni acceptée.
- Un code 1 est la sortie prévue des deux outils quand ils détectent un écart ; ce
  n'est pas un échec d'exécution.
- Sorties brutes : `expo-install-check.log`, `expo-doctor.log` (et `.meta`).

## 4. Résultats

### `expo install --check`

```text
The following packages should be updated for best compatibility with the installed expo version:
  expo@54.0.34 - expected version: ~54.0.37
  expo-constants@18.0.13 - expected version: ~18.0.14
  expo-font@14.0.11 - expected version: ~14.0.12
  expo-router@6.0.23 - expected version: ~6.0.24
Your project may not work correctly until you install the expected versions of the packages.
Found outdated dependencies
```

### `expo-doctor` (18 contrôles)

Réussis (15) : configuration du projet ; fichiers d'environnement non commités ;
`package.json` ; configuration Expo ; exigences de version pour les stores ;
présence du lockfile ; paquets à ne pas installer directement ; champs de config non
synchronisés (projet non CNG) ; versions npm/yarn ; versions des outils natifs ;
schéma `app.json` ; dépendances pair ; paquets de support des modules natifs ; CLI
global hérité ; validation React Native Directory.

En échec (3) :

1. **Metro config** : `"watchFolders" does not contain all entries from Expo's
   defaults`. Le `metro.config.js` remplace `watchFolders` par la racine du monorepo.
2. **Dépendances dupliquées** :
   - `react` : 58 emplacements, dont 57 en 19.1.0 (`apps/mobile/node_modules/react`
     et des `node_modules/react` imbriqués sous `expo`, `react-native`,
     `expo-router`, `react-native-reanimated`, `react-native-worklets`,
     `@rnmapbox/maps`, `react-native-screens`, `react-native-svg`, `@react-navigation/*`,
     `@radix-ui/*`, etc.) et 1 en 18.3.1 (`frontend/node_modules/react`) ;
   - `react-dom` : 11 emplacements en 19.1.0 (mobile, `@radix-ui/*`, `vaul`).
3. **Versions attendues par le SDK** : les 4 écarts de correctif de
   `expo install --check` (« Patch version mismatches »).

Liste complète des emplacements : `expo-doctor.log`.

## 5. Classification

| # | Constat | Classe | Nature | Cause |
|---|---|---|---|---|
| 1 | 58 emplacements de React : 57 copies de React 19.1.0 imbriquées + React 18.3.1 à la racine | **Risque de résolution à éliminer pendant l'extraction**, puis à vérifier par le bundle et le dev build | Problème de monorepo | **Démontrée pour la disposition** : la racine `frontend/package.json` dépend de React 18.3.1 (web/admin) et force `mobile>react: 19.1.0` par override ; avec `node-linker=hoisted`, React 19 ne peut pas être remonté à la racine et il est imbriqué sous chaque dépendant. La même disposition existe dans la source (vérifiée sur 5 chemins et la racine) : ce n'est pas un artefact de la copie. **Non démontré** : la présence de ces emplacements ne prouve pas que plusieurs instances de React seront chargées dans le bundle ou à l'exécution. Aucun bundle ni build. |
| 2 | `react-dom` dupliqué (11 emplacements, même version) | Dette non bloquante | Problème de monorepo | Dépendances web d'`expo-router` (`@radix-ui/*`, `vaul`) ; concerne la cible web. Effet sur Android/iOS non établi. |
| 3 | `watchFolders` ne contient pas les valeurs par défaut d'Expo | **À ne pas reprendre tel quel** dans le projet autonome | Configuration propre au monorepo | `watchFolders` pointe vers la racine du workspace : c'est cohérent avec le fonctionnement actuel en monorepo (cf. audit § 4). Ce n'est pas un défaut d'exécution démontré ; aucun bundle Metro exécuté. Le projet autonome repartira d'une configuration Metro adaptée. |
| 4 | 4 paquets en retard de correctif (`expo`, `expo-constants`, `expo-font`, `expo-router`) | À corriger avant dev build | Pas une incompatibilité de SDK : ce sont des correctifs du même SDK 54 | Les versions attendues sont fournies par le service Expo au moment de l'exécution ; le lockfile date d'avant ces correctifs. Coût attendu faible, non mesuré. |
| 5 | 15 contrôles `expo-doctor` réussis, dont la validation React Native Directory et les dépendances pair | Information | — | — |
| 6 | `react-native-worklets@0.8.3` et `@react-native/metro-config@0.85.3` (dépendances transitives, signalées par l'audit) | Information / non vérifiable | — | Verrouillé = installé (`transitive-check.txt`). Aucun des deux outils ne les signale ; leur compatibilité avec RN 0.81.5 n'est pas établie par ces contrôles. |

Aucun constat n'est classé **BLOQUANT** : aucun résultat n'empêche raisonnablement
une extraction. Aucun **faux positif de la copie** n'a été identifié : la disposition
de `node_modules` signalée existe dans la source.

## 6. Matrice déclaré / verrouillé / installé

Dépendances directes de `apps/mobile/package.json`, comparées avec l'importer
`apps/mobile` de `pnpm-lock.yaml` (version sans suffixe de pairs) et avec la version
résolue depuis le package mobile en suivant l'ordre de recherche de Node
(`dependency-matrix.js`, `dependency-matrix.md`).

| Section | Paquet | Déclaré | Verrouillé | Installé | Emplacement |
|---|---|---|---|---|---|
| dep | `@expo/metro-runtime` | `~6.1.2` | 6.1.2 | 6.1.2 | `node_modules` |
| dep | `@rnmapbox/maps` | `^10.3.1` | 10.3.1 | 10.3.1 | `node_modules` |
| dep | `@yunicity/types` | `workspace:*` | `link:../../packages/types` | 0.0.0 | `apps/mobile/node_modules` (jonction interne) |
| dep | `@yunicity/ui` | `workspace:*` | `link:../../packages/ui` | 0.0.0 | idem |
| dep | `@yunicity/utils` | `workspace:*` | `link:../../packages/utils` | 0.0.0 | idem |
| dep | `expo` | `~54.0.34` | 54.0.34 | 54.0.34 | `node_modules` |
| dep | `expo-camera` | `~17.0.10` | 17.0.10 | 17.0.10 | `node_modules` |
| dep | `expo-constants` | `~18.0.13` | 18.0.13 | 18.0.13 | `node_modules` |
| dep | `expo-device` | `^8.0.10` | 8.0.10 | 8.0.10 | `node_modules` |
| dep | `expo-font` | `~14.0.11` | 14.0.11 | 14.0.11 | `node_modules` |
| dep | `expo-linking` | `~8.0.12` | 8.0.12 | 8.0.12 | `node_modules` |
| dep | `expo-notifications` | `^0.32.17` | 0.32.17 | 0.32.17 | `node_modules` |
| dep | `expo-router` | `~6.0.23` | 6.0.23 | 6.0.23 | `node_modules` |
| dep | `expo-secure-store` | `~15.0.8` | 15.0.8 | 15.0.8 | `node_modules` |
| dep | `expo-splash-screen` | `~31.0.13` | 31.0.13 | 31.0.13 | `node_modules` |
| dep | `expo-status-bar` | `~3.0.9` | 3.0.9 | 3.0.9 | `node_modules` |
| dep | `react` | `19.1.0` | 19.1.0 | 19.1.0 | `apps/mobile/node_modules` |
| dep | `react-dom` | `19.1.0` | 19.1.0 | 19.1.0 | `apps/mobile/node_modules` |
| dep | `react-native` | `0.81.5` | 0.81.5 | 0.81.5 | `node_modules` |
| dep | `react-native-qrcode-svg` | `^6.3.21` | 6.3.21 | 6.3.21 | `node_modules` |
| dep | `react-native-reanimated` | `~4.1.1` | 4.1.7 | 4.1.7 | `node_modules` |
| dep | `react-native-safe-area-context` | `~5.6.0` | 5.6.2 | 5.6.2 | `node_modules` |
| dep | `react-native-screens` | `~4.16.0` | 4.16.0 | 4.16.0 | `node_modules` |
| dep | `react-native-svg` | `15.12.1` | 15.12.1 | 15.12.1 | `node_modules` |
| dev | `@babel/core` | `^7.27.1` | 7.29.0 | 7.29.0 | `node_modules` |
| dev | `@types/react` | `~19.1.0` | 19.1.17 | 19.1.17 | `apps/mobile/node_modules` |
| dev | `eslint` | `^8.57.1` | 8.57.1 | 8.57.1 | `apps/mobile/node_modules` |
| dev | `eslint-config-expo` | `~10.0.0` | 10.0.0 | 10.0.0 | `node_modules` |
| dev | `typescript` | `^5.8.3` | 5.9.3 | 5.9.3 | `node_modules` |

Résultat : **29 sur 29 cohérentes** (specifier du lock = déclaré ; installé =
verrouillé). Cette vérification ne porte **que sur les dépendances directes** :
la cohérence de l'ensemble du lockfile (dépendances transitives) n'est pas établie.

## 7. Changements observés

Inventaires avant et après (`*-before.txt` / `*-after.txt`) :

| Élément | Résultat |
|---|---|
| 25 fichiers de configuration et manifestes (`package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `app.json`, `tsconfig*`, `metro.config.js`, `babel.config.js`, `.eslintrc.js`, `.npmrc`) | SHA-256 identiques |
| 2 551 fichiers de la copie hors `node_modules` (code et configurations) | SHA-256 identiques |
| Arbre complet de la copie : 65 337 fichiers (chemin, taille, date ; `robocopy /L /XJ`) | identique |
| `.expo`, `android`, `ios` | absents avant et après |
| Cache dédié `npm-cache-0008` (hors `src`) | créé : 84 fichiers, 2,6 Mio (`_cacache`, `_npx`, `_logs`) |
| Cache npm global | aucun fichier modifié |
| **`~/.expo` (hors périmètre)** | **Effet de bord observé des outils Expo** : 4 fichiers de cache HTTP écrits, `versions-cache/7df01463…` à 03:45:16 (`expo install --check`) et `native-modules-cache/4eac05f0…` à 03:47:25 (`expo-doctor`), chacun `-body.bin` + `-info.json`. Conservés sur décision CTO ; ni lus ni supprimés. Ils ne modifient ni la copie, ni le dépôt source, ni `yunimobile`. |

La première liste de l'arbre (`find -printf`) a dépassé la limite de temps ; elle a
été refaite avec `robocopy /L`, avant toute exécution des outils Expo.

## 8. Limites

- Aucun bundle Metro, prebuild ni dev build : les effets des constats 1 et 3 ne sont
  pas observés.
- Les versions attendues par le SDK dépendent du service Expo au moment de
  l'exécution ; un autre jour peut donner d'autres écarts de correctif.
- La matrice ne couvre que les dépendances directes.
- `node_modules` est une copie de l'installation locale de la source, dont la
  conformité complète au lockfile n'est pas vérifiée (aucune réinstallation).
- Le comportement de pnpm dans `expo-doctor` (version utilisée, commandes lancées)
  n'est pas tracé.
- Les outils Expo ont écrit des caches dans `~/.expo`, hors du dossier de journaux
  autorisé (effet de bord consigné au § 7, fichiers conservés).
- Contrôles propres de Claude, sans réexécution indépendante.

## 9. Conséquences pour les options A et B

Constats, sans décision :

- Les dépendances directes sont cohérentes (déclaré / verrouillé / installé) et les
  contrôles n'ont détecté aucune incompatibilité explicite avec Expo SDK 54, en
  dehors de quatre écarts de versions correctives. Aucun build ou comportement
  d'exécution n'est encore prouvé. Ces contrôles ne donnent pas de raison de
  compatibilité de repartir d'une nouvelle base (B).
- Les problèmes relevés viennent de l'intégration au monorepo : React 18 à la racine
  pour web et admin, override vers React 19 pour le mobile, et `metro.config.js`
  adapté au workspace. Dans une extraction (A) vers un dépôt dédié, ces éléments
  seraient à reconstruire : un seul React, une configuration Metro par défaut. Leur
  disparition reste à démontrer par une installation et un bundle dans le nouveau
  dépôt.
- Ces résultats sont cohérents avec l'hypothèse A et ne la contredisent pas ; ils ne
  prouvent pas qu'un dev build fonctionnera.

## 10. Prochaine étape

Non lancée : **YUNIMOBILE-0009 — preuve d'extraction autonome et bundle Metro
Android**.

## 11. Décision CTO (2026-10-02)

Option A approuvée sous la forme d'une **extraction contrôlée** :

- réutiliser le code mobile existant : écrans, routes, composants et logique ;
- ne pas copier aveuglément la structure du monorepo ;
- construire une application Expo autonome dans `yunimobile` ;
- remplacer progressivement les imports `@yunicity/*` par des modules explicitement
  repris ou par des packages dont le partage est justifié ;
- utiliser une seule version et une seule résolution de React compatibles avec
  Expo SDK 54 ;
- repartir d'une configuration Metro adaptée à un projet autonome ;
- aligner les quatre dépendances Expo sur les correctifs SDK 54 attendus ;
- garder le mobile du monorepo comme référence en lecture seule jusqu'à la parité.

Le diagnostic est terminé : son objectif était d'identifier les écarts, pas de les
corriger.
