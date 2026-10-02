# Preuve d'extraction autonome et bundle Metro Android

YUNIMOBILE-0009, 2026-10-02, Claude Code. Extraction jetable, hors de tout dépôt
Git. Aucune intégration permanente dans `yunimobile`.

**Statut : preuve d'extraction autonome réussie ; GO approuvé par le CTO pour
l'intégration permanente** (voir § 11). Limites maintenues : aucun dev build, aucun
lancement sur appareil ou émulateur, aucune preuve du comportement à l'exécution,
aucun build natif Android ou iOS.

## Résumé des preuves

| Contrôle | Code de sortie | Résultat |
|---|---|---|
| Résolution autonome | — | 1 288 fichiers `tsc` et 11 résolutions de modules, tous dans l'extraction ; 5 jonctions de workspace internes ; aucune référence aux anciens chemins |
| React | — | Une seule version dans le lockfile (`react` et `react-dom` 19.1.0) ; résolution depuis le mobile et 6 paquets dépendants vers un seul dossier `node_modules/react` ; aucun React 18 |
| Typecheck | 0 | 0 erreur |
| Lint (périmètre Expo `app`, `components`) | 0 | 51 fichiers, 0 erreur, 0 avertissement |
| `expo install --check` | 0 | « Dependencies are up to date » |
| `expo-doctor` 1.20.4 | 0 | 18/18 contrôles réussis, « No issues detected! » |
| `expo export --platform android` | 0 | 1 933 modules, bundle Hermes de 6,31 Mo, 30 fichiers (6 448 643 octets) |

Ces contrôles ne prouvent ni un dev build natif ni un comportement à l'exécution.

## 1. Emplacements

| Rôle | Chemin |
|---|---|
| Extraction jetable (conservée) | `C:\tmp\yunimobile-0009-extract` |
| Journaux | `C:\tmp\yunimobile-0009-extract\logs` |
| Copie diagnostique (lecture seule) | `C:\tmp\yunimobile-0007-diag\src\frontend` |
| Source (lecture seule) | `C:\Users\kyria\yunicity` @ `ee57ce1dfc37835a47335e56338578471a95ec7d` |

## 2. Arborescence autonome

```text
C:\tmp\yunimobile-0009-extract\
├── package.json          racine privée, packageManager pnpm@9.15.9, engines node >=20
├── pnpm-workspace.yaml   apps/*, packages/*
├── .npmrc                node-linker=hoisted, registry=https://registry.npmjs.org/
├── tsconfig.base.json    copié tel quel (hérité par les tsconfig des packages)
├── pnpm-lock.yaml        lockfile autonome généré
├── apps/mobile/          76 fichiers suivis de l'app (+ dist-android généré)
├── packages/types/       47 fichiers, identiques à la source
├── packages/utils/       297 fichiers (source sans tests), manifeste réduit
├── packages/ui/          3 fichiers : brand-tokens.ts, tsconfig.json, manifeste réduit
├── node_modules/         installé (hoisted)
├── .npm-cache-doctor/    cache npm dédié à expo-doctor
├── .tmp-metro/           répertoire temporaire de Metro pour l'export
└── logs/                 commandes, sorties, analyses
```

Exclus de la copie : `node_modules`, `.expo`, `dist`, `android`, `ios`, `.turbo`,
`.env` réels, caches et journaux. Seul fichier d'environnement : `.env.example`
(modèle suivi, sans secret).

## 3. Packages `@yunicity/*` repris

Analyse des imports du mobile : 38 `@yunicity/types`, 42 `@yunicity/utils`,
1 `@yunicity/ui/brand`. Imports non relatifs des packages, hors fichiers de test :
`types` aucun ; `utils` uniquement `@yunicity/types` ; `ui/src/brand-tokens.ts`
aucun.

| Package | Repris | Raison | Écart avec la source |
|---|---|---|---|
| `@yunicity/types` | Entier | Importé par le mobile et par `utils` | Aucun |
| `@yunicity/utils` | `src` sans `*.test.*`, sans `vitest.config.ts` | Importé par le mobile ; dépend de `types` | Manifeste : `devDependencies` (`typescript`, `vitest`) et scripts retirés. Les tests, qui sont les seuls à utiliser `vitest`, ne sont pas repris. |
| `@yunicity/ui` | `src/brand-tokens.ts` seulement | Seul sous-chemin importé (`@yunicity/ui/brand`) ; fichier sans import | Manifeste réduit à `exports: { "./brand": … }`. Le reste du package (primitives DOM, React, tests) n'est pas nécessaire, et ses `devDependencies` déclarent `react@18.3.1`, qui aurait réintroduit React 18 dans le workspace. Manifeste d'origine conservé dans `logs\ui-package.json.source-reference`. |

## 4. Différences de configuration

| Fichier | Source | Extraction | Raison |
|---|---|---|---|
| `apps/mobile/metro.config.js` | `watchFolders = [racine monorepo]`, `nodeModulesPaths` local + racine | `getDefaultConfig(__dirname)` seul | Suppression des réglages propres au monorepo ; `expo/metro-config` détecte lui-même le workspace pnpm local. Aucune autre personnalisation n'existait. |
| `apps/mobile/package.json` | `expo ~54.0.34`, `expo-constants ~18.0.13`, `expo-font ~14.0.11`, `expo-router ~6.0.23` | `~54.0.37`, `~18.0.14`, `~14.0.12`, `~6.0.24` | Seuls les quatre correctifs SDK 54 de YUNIMOBILE-0008. Aucune autre ligne modifiée. |
| `.npmrc` racine | `node-linker=hoisted` + `public-hoist-pattern` | `node-linker=hoisted` + registre officiel | Même mode d'installation que la source ; les motifs de hoisting public sont sans effet en mode hoisted. |
| `package.json` racine | React 18.3.1 et `pnpm.overrides` (dont `mobile>react`, `expo-linking`, correctifs de sécurité transitifs `ws`, `tar`, `postcss`…) | Aucune dépendance, aucun override | Les overrides servaient le web, l'admin et le monorepo. Leur absence change la résolution transitive (voir § 5). |

Code applicatif : aucun autre fichier modifié. La dette connue (`catch {}`, warning
`hooks/use-search.ts:115`) est conservée telle quelle.

## 5. Dépendances

### Installation

| Étape | Commande (dossier `C:\tmp\yunimobile-0009-extract`) | Code | Durée |
|---|---|---|---|
| Résolution | `CI=1 pnpm install --lockfile-only --reporter=append-only` | 0 | 73 s |
| Installation | `CI=1 pnpm install --frozen-lockfile --reporter=append-only` | 0 | 259 s |

- pnpm effectif : 9.15.9 (pnpm 10.16.1 global, qui bascule sur le `packageManager`
  du projet ; version déjà présente dans `%LOCALAPPDATA%\pnpm\.tools`, rien n'a été
  téléchargé). Store : `%LOCALAPPDATA%\pnpm\store\v3` ; registre
  `https://registry.npmjs.org/`.
- Provenance (analyse du lockfile) : 978 paquets, **tous issus du registre npm**,
  identifiés par intégrité. Aucune source Git, locale ou registre tiers. Seuls
  `link:` : les 4 liens de workspace internes.
- Installation : 1 003 paquets liés, depuis le store par liens physiques.
- Scripts lifecycle exécutés : **un seul**, `node_modules/unrs-resolver postinstall$
  node postinstall.js`.
- Avertissement : 7 sous-dépendances dépréciées (`@humanwhocodes/config-array`,
  `@humanwhocodes/object-schema`, `glob@7`, `inflight`, `rimraf@3`,
  `text-encoding`, `uuid@7`).
- Écritures hors de l'extraction : store pnpm v3 (+4 291 fichiers, 39,1 Mio) et cache
  de métadonnées pnpm (+748 fichiers, 122,0 Mio).

### Versions directes installées

| Paquet | Déclaré | Résolu | Source (0007) |
|---|---|---|---|
| `expo` | `~54.0.37` | 54.0.37 | 54.0.34 |
| `expo-constants` | `~18.0.14` | 18.0.14 | 18.0.13 |
| `expo-font` | `~14.0.12` | 14.0.12 | 14.0.11 |
| `expo-router` | `~6.0.24` | 6.0.24 | 6.0.23 |
| `@rnmapbox/maps` | `^10.3.1` | **10.3.5** | 10.3.1 |
| `react-native-qrcode-svg` | `^6.3.21` | **6.3.26** | 6.3.21 |
| `@babel/core` (dev) | `^7.27.1` | **7.29.7** | 7.29.0 |
| `react`, `react-dom` | `19.1.0` | 19.1.0 | 19.1.0 |
| `react-native` | `0.81.5` | 0.81.5 | 0.81.5 |
| `react-native-reanimated` | `~4.1.1` | 4.1.7 | 4.1.7 |
| `react-native-safe-area-context` | `~5.6.0` | 5.6.2 | 5.6.2 |
| `react-native-screens` | `~4.16.0` | 4.16.0 | 4.16.0 |
| `react-native-svg` | `15.12.1` | 15.12.1 | 15.12.1 |
| `@expo/metro-runtime` | `~6.1.2` | 6.1.2 | 6.1.2 |
| `expo-camera`, `expo-device`, `expo-linking`, `expo-notifications`, `expo-secure-store`, `expo-splash-screen`, `expo-status-bar` | inchangés | 17.0.10, 8.0.10, 8.0.12, 0.32.17, 15.0.8, 31.0.13, 3.0.9 | identiques |
| `@types/react`, `eslint`, `eslint-config-expo`, `typescript` (dev) | inchangés | 19.1.17, 8.57.1, 10.0.0, 5.9.3 | identiques |

En gras, les dépendances directes résolues plus récentes que dans la source, du fait
d'une résolution neuve dans leurs plages déclarées. En transitif :
`@react-native/metro-config` passe de 0.85.3 à 0.87.1 ;
`react-native-worklets` reste en 0.8.3. CLI Expo : 54.0.27 (54.0.24 dans la source).

## 6. Vérifications

Dossier : `C:\tmp\yunimobile-0009-extract\apps\mobile`. Node v24.18.1.

### 6.1 Résolution autonome

- `tsc --listFilesOnly` : 1 288 fichiers, 0 hors extraction (339 issus des
  packages : 44 `types`, 294 `utils`, 1 `ui`).
- `require.resolve` depuis le mobile : `react`, `react-dom`, `react-native`, `expo`,
  `expo-router`, `@yunicity/utils`, `@yunicity/types`, `@yunicity/ui/brand`,
  `eslint`, `eslint-config-expo`, `typescript` → 11/11 dans l'extraction.
- Liens : 5 jonctions créées par pnpm (`apps/mobile/node_modules/@yunicity/{types,ui,utils}`,
  `packages/utils/node_modules/@yunicity/types`, et le chemin vu à travers
  `@yunicity/utils`), toutes vers `packages/*` de l'extraction ; aucun lien vers la
  source, la copie 0007 ou un worktree. Les fichiers de `node_modules` sont des liens
  physiques vers le store pnpm (hors de la liste interdite).
- Recherche des chaînes `yunimobile-0007-diag`, `Users\kyria\yunicity`,
  `yunicity-wt-` dans toute l'extraction (hors `logs`), `node_modules`,
  `dist-android` et `.tmp-metro` compris : aucune occurrence.

### 6.2 React

- `pnpm --filter mobile list react react-dom --depth 0` → `react 19.1.0`,
  `react-dom 19.1.0`.
- `pnpm why react -r` : uniquement 19.1.0, dont les dépendants en pair.
- Dossiers sur disque : `node_modules/react` et `node_modules/react-dom` (19.1.0),
  plus `node_modules/@expo/cli/static/canary-full/node_modules/react(-dom)` en
  19.2.0-canary : copie embarquée dans les fichiers statiques du CLI Expo, pas une
  dépendance du graphe ni une cible de résolution de l'app.
- Résolution de `react` depuis `expo`, `react-native`, `expo-router`,
  `react-native-reanimated`, `@rnmapbox/maps`, `react-native-screens` → le même
  `node_modules/react`.
- Conclusion limitée : la résolution statique est unique. Une instance unique à
  l'exécution n'est pas démontrée (aucun lancement).

### 6.3 Typecheck

`node ../../node_modules/typescript/bin/tsc --noEmit -p tsconfig.json --pretty false`
(TypeScript 5.9.3) → exit **0**, 38 s, sortie vide, 0 erreur.

### 6.4 Lint

`NODE_ENV=development node ../../node_modules/eslint/bin/eslint.js app components --ext .js,.jsx,.ts,.tsx,.mjs,.cjs`
(ESLint 8.57.1, sans `--fix` ni cache) → exit **0**, 51 fichiers (30 `app`,
21 `components`), 0 erreur, 0 avertissement.

### 6.5 expo install --check

`CI=1 EXPO_NO_TELEMETRY=1 node ../../node_modules/expo/bin/cli install --check --pnpm`
(CLI 54.0.27) → exit **0**, « Dependencies are up to date ».

### 6.6 expo-doctor

- Intégrité vérifiée **avant** exécution (`npm view expo-doctor@1.20.4
  dist.integrity`, cache `C:\tmp\yunimobile-0009-extract\.npm-cache-doctor`) :
  `sha512-Jm1lIqVdO8br9wiqTg5QhJ1u4zLWAhoue4bXsEuzW543vC3XY+U0cpEOmiLkvJhTTgZgIK+24l4i8VzyZ2VLMg==`
  = valeur attendue. Même valeur dans le `package-lock.json` du cache `_npx` après
  exécution.
- `CI=1 EXPO_NO_TELEMETRY=1 npm_config_cache=C:\tmp\yunimobile-0009-extract\.npm-cache-doctor npm exec --yes --package=expo-doctor@1.20.4 -- expo-doctor --verbose`
  → exit **0**, 90 s, **18/18 contrôles réussis**, « No issues detected! ». Les trois
  échecs de YUNIMOBILE-0008 (Metro, dépendances dupliquées, versions SDK) ont
  disparu.

### 6.7 Bundle Android Metro

- Commande :
  `CI=1 EXPO_NO_TELEMETRY=1 TEMP=C:\tmp\yunimobile-0009-extract\.tmp-metro TMP=C:\tmp\yunimobile-0009-extract\.tmp-metro node ../../node_modules/expo/bin/cli export --platform android --output-dir dist-android --clear`
- `node_modules` étant à la racine du workspace (mode hoisted), le CLI est appelé
  par `../../node_modules/expo/bin/cli`, la commande du ticket écrite pour un
  `node_modules` local.
- `TEMP`/`TMP` redirigés vers l'extraction pour que `--clear` ne vide que le
  cache Metro de cette commande, et non un cache partagé (aucun cache Metro global
  n'existait).
- Résultat : exit **0** ; durée totale 324 s (04:54:45 → 05:00:09), dont 284 s de
  bundling ; `Android Bundled … node_modules\expo-router\entry.js (1933 modules)`.
- Sortie : 30 fichiers, 6 448 643 octets — bundle
  `_expo/static/js/android/entry-9f961ef8a74fa06b11012a0e8be7a00c.hbc` (6,31 Mo),
  28 assets (dont `assets/yunicity-mascot.png`, 113 kB), `metadata.json`.
  Liste : `logs\dist-android-files.txt`.
- Avertissements : uniquement `Bundler cache is empty, rebuilding`, attendu avec
  `--clear`. Aucune erreur.

### 6.8 Après exécution

- Aucun dossier `android`, `ios` ni `.expo` créé.
- Fichiers générés dans l'extraction : `pnpm-lock.yaml`, `node_modules`
  (41 435 fichiers), `apps/mobile/dist-android` (30), `.tmp-metro` (1 940, 41 Mo),
  `.npm-cache-doctor` (84, 2,8 Mo), `logs` (32).
- Effet de bord hors extraction : les outils Expo ont réécrit les 4 fichiers de cache
  de `~/.expo` déjà notés en YUNIMOBILE-0008 (`versions-cache` à 04:50:32,
  `native-modules-cache` à 04:53:21), sans les lire. Cache npm global : aucune
  modification.

## 7. Corrections et incidents

Aucune correction du code ni de la configuration n'a été nécessaire pour faire passer
les contrôles : aucune tentative au titre de la gestion des échecs.

Incidents d'outillage, sans effet sur les contrôles :

1. Mon premier contrôle `require.resolve` affichait à tort « HORS EXTRACTION » à
   cause d'un échappement de chaîne ; il a été refait par un script
   (`logs\check-resolve.js`) : 11/11 dans l'extraction.
2. Mon script PowerShell d'inventaire des liens a écrit `links.csv` à travers la
   jonction `@yunicity/types`, donc dans `packages/types` (variables PowerShell
   insensibles à la casse : `$l` a remplacé `$L`). Ce n'est pas du code et le fichier
   n'est importé nulle part. Il a été déplacé dans `logs` ; `packages/types` est de
   nouveau identique à la source.
3. Mon affichage préalable du chemin d'ESLint a échoué (`exports` n'expose pas
   `bin/eslint.js`) ; le lint lui-même a appelé le binaire par son chemin.

## 8. Emplacements protégés et disque

| Emplacement | Avant | Après |
|---|---|---|
| Source `C:\Users\kyria\yunicity` | `ee57ce1d…`, `feat/c3-global-refonte-preview`, aucun fichier modifié ni non suivi | Identique (HEAD, branche, statut avec non suivis, stashes, refs) |
| Copie `C:\tmp\yunimobile-0007-diag` | État de fin de 0008 (2 551 empreintes, 65 337 fichiers) | Identique |
| `yunimobile` | `main` @ `8c7dfce`, propre | Seuls les trois fichiers documentaires du ticket |

Espace libre sur `C:` : 4,033 Gio au départ ; 3,316 Gio juste avant l'installation ;
4,126 Gio à la fin. Les variations, jusqu'à −0,66 Gio pendant la résolution, viennent
surtout d'une activité extérieure (processus Node actif dans le worktree
`yunicity-wt-pr202-ci`). Consommation propre estimée à environ 0,2 Gio, par somme des
postes mesurés (store, cache de métadonnées, `.tmp-metro`, `dist-android`, cache
dédié), en supposant que `node_modules` est composé de liens physiques. Aux points
de mesure, l'espace libre est toujours resté au-dessus de 3 Gio.

## 9. Limites

- Aucun dev build, aucun lancement : le comportement d'exécution, l'instance unique
  de React à l'exécution et les modules natifs (Mapbox, caméra, notifications) ne
  sont pas prouvés.
- La résolution neuve diffère de la source pour quelques versions (§ 5) ; les
  overrides de sécurité du monorepo ne sont pas repris.
- `ui` et `utils` sont repris avec des manifestes réduits ; les tests de `utils` ne
  sont ni repris ni exécutés.
- Le lint ne couvre que le périmètre Expo par défaut (`app`, `components`).
- Contrôles propres de Claude, sans réexécution indépendante.

## 10. Recommandation (séparée des preuves)

**GO** pour l'intégration permanente, selon les critères du ticket :

| Critère GO | Constat |
|---|---|
| Aucun chemin ne dépend du monorepo source | Oui (§ 6.1) |
| Une seule version React compatible Expo résolue depuis l'app | Oui, 19.1.0 (§ 6.2) |
| Typecheck passe | Oui |
| Lint du périmètre Expo sans erreur | Oui |
| `expo install --check` sans écart | Oui |
| `expo-doctor` sans problème bloquant lié à l'extraction | Oui, 18/18 |
| Bundle Android Metro exit 0 | Oui |

Points à traiter dans le ticket d'intégration, sans remettre en cause le GO :
décider du sort des overrides de sécurité, fixer la méthode de partage des modules
`@yunicity/*`, reprendre ou remplacer les tests de `utils`, puis prouver l'exécution
par un dev build Android. Décision finale au CTO.

## 11. Décision CTO (2026-10-02)

**GO approuvé pour l'intégration permanente.** La revue CTO valide la recommandation
à partir du rapport, des sorties consignées et des contrôles réalisés par Claude
Code. Ce n'est pas une réexécution indépendante des commandes.

1. L'option A, extraction contrôlée, est **définitivement retenue**.
2. L'extraction `C:\tmp\yunimobile-0009-extract` devient la **référence technique**
   de l'intégration permanente.
3. YUNIMOBILE-0010 réutilisera **sans nouvelle résolution** : le `package.json`
   validé, `pnpm-workspace.yaml`, `.npmrc` (`node-linker=hoisted`),
   `tsconfig.base.json`, `pnpm-lock.yaml`, les manifestes réduits des packages, la
   configuration Metro validée et les quatre correctifs Expo SDK 54.
4. Le lockfile sera **copié tel quel**. Relancer une résolution sans justification
   invaliderait une partie des preuves de ce ticket.
5. Les trois dépendances directes qui ont évolué, `@rnmapbox/maps` 10.3.5,
   `react-native-qrcode-svg` 6.3.26 et `@babel/core` 7.29.7, sont acceptées comme
   **baseline exacte** du POC. Elles ne sont pas prouvées par un dev build natif.
   Toute modification future passera par un ticket distinct ou répondra à un échec
   démontré.
6. `node-linker=hoisted` est un **choix délibéré** de la baseline, car c'est la
   configuration effectivement testée. Il pourra être réévalué, jamais
   silencieusement pendant l'intégration.
7. Packages acceptés pour l'intégration initiale : `@yunicity/types` entier ;
   `@yunicity/utils` en code de production, tests à traiter ultérieurement ;
   `@yunicity/ui` réduit au sous-ensemble `brand`.
8. **Gates avant le premier dev build** :
   - auditer les overrides de sécurité du monorepo et ne reprendre que ceux qui
     concernent réellement les dépendances mobiles ;
   - vérifier que le lockfile reste inchangé après copie ;
   - conserver `react` et `react-dom` en 19.1.0, sans React 18 ;
   - documenter les tests de `utils` non encore repris ;
   - ne pas présenter le bundle Metro comme un build natif ou un lancement réussi.
9. Les caches `~/.expo` restent conservés et documentés ; ils ne sont pas
   supprimés.

### Empreintes de référence (SHA-256, 2026-10-02)

Pour vérifier en YUNIMOBILE-0010 que la baseline est copiée sans changement :

| Fichier (racine de l'extraction) | SHA-256 |
|---|---|
| `package.json` | `c13af092a0cc6bf8d861f44e435c30ee71ee3f7171f5732553398083935ff200` |
| `pnpm-workspace.yaml` | `08d75840c97ab0e72d1d9b5b84a17e47a2e06cb159a5fbec5ee0a6a56682dad7` |
| `.npmrc` | `5fcf0b657b231f2b4ae63fe5bead5c3a47a833da0c38bdf05f8939c136ebeb39` |
| `tsconfig.base.json` | `4b1867c00c2efe0ad603eb7570bea961594a3093ddb4d14f675d2b6d931b6d88` |
| `pnpm-lock.yaml` | `8eee595c57f740aeed20aeed4b5b067b87f853fe76c34e89dcf8026a0f2c6a86` |
| `apps/mobile/package.json` | `ab1770ddb962997199945459ee3f261fcb49968d7469aec7f335c1451c64e5e8` |
| `apps/mobile/metro.config.js` | `577f018ed5eeb00ebd4976a175f80443829ae7c3fa7256ef6e8d01085751b1f8` |
| `packages/types/package.json` | `25d543dbecebb1903a0440be41987da2d52b6e5aa62c177084e175d6c22f12e2` |
| `packages/utils/package.json` | `21f5cb3921e24a3c442762a9da46b2453bd5ae8a75096be5452f3590542b7d9e` |
| `packages/ui/package.json` | `110c3ced603f88c2a6ab430c729055806b6644599178b602a0576c6286f179f9` |

### Suite

1. **YUNIMOBILE-0009A** — hygiène de l'historique Git avant première publication
   (identité locale et auteur des commits locaux), non lancé.
2. **YUNIMOBILE-0010** — extraction permanente de l'application validée dans
   `yunimobile`, non lancé.
