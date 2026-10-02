# Intégration permanente de l'application mobile

YUNIMOBILE-0010, 2026-10-02, Claude Code. Intégration dans `yunimobile` de
l'extraction autonome validée par YUNIMOBILE-0009
(`docs/engineering/mobile-extraction-poc.md`), sans nouvelle résolution de
dépendances et sans modification fonctionnelle. Aucun commit.

## Résumé

| Contrôle | Code | Résultat |
|---|---|---|
| Baseline copiée | — | 10/10 empreintes ; 423 fichiers identiques à la baseline |
| Installation `--frozen-lockfile --prefer-offline` | 0 | 1 003 paquets, 0 téléchargé ; lockfile et manifestes inchangés |
| Résolution autonome | — | 11/11 modules dans le dépôt ; React 19.1.0 seul. **Types TypeScript externes chargés depuis un `node_modules` parent** (voir § 6.1) |
| Typecheck (`pnpm --filter mobile run typecheck`) | 0 | 0 erreur ; même résultat isolé des types externes |
| Lint (`app`, `components`) | 0 | 51 fichiers, 0 erreur, 0 avertissement |
| `expo install --check` | 0 | « Dependencies are up to date » |
| `expo-doctor` 1.20.4 | 0 | 18/18 |
| `expo export --platform android` | 0 | 1 933 modules ; 30 fichiers, 6 448 635 octets |

Points à trancher avant le commit et avant le premier dev build : § 9.

**Mise à jour après revue CTO (§ 12)** : `expo-env.d.ts` reste volontairement
ignoré ; `typeRoots` local ajouté (aucun type externe lu) ; override
`postcss` 8.5.18 ; pas d'override `brace-expansion` ; identifiants personnels
neutralisés ; newline finale ajoutée à `apps/mobile/.gitignore`. Tous les contrôles
ont été refaits avec exit 0. Les sections 1 à 11 décrivent le premier passage.

## 1. Branche et état de départ

- Branche : `feat/yunimobile-0010-extraction`, créée depuis `main` @
  `380208dedb19722525c92c9d0bcb2872459d00c7` (= `origin/main`, vérifié par
  `ls-remote`).
- Préconditions : arbre propre ; branche absente en local et à distance ; 10/10
  empreintes de la baseline 0009 ; dossiers `C:\tmp\yunimobile-0010-*` absents ;
  6,807 Gio libres.
- Première tentative bloquée (1,16 Gio libres, avant création de la branche) ;
  reprise après le nettoyage autorisé (plan A, 12 caches de build Yunicity).
- Journaux hors dépôt : `C:\tmp\yunimobile-0010-logs\`.

## 2. Fichiers intégrés

| Élément | Fichiers | Source |
|---|---|---|
| `package.json`, `pnpm-workspace.yaml`, `.npmrc`, `tsconfig.base.json`, `pnpm-lock.yaml` | 5 | Baseline 0009, copiés tels quels |
| `apps/mobile/` | 76 | Baseline 0009 |
| `packages/types/` | 47 | Baseline 0009 |
| `packages/utils/` | 297 | Baseline 0009 |
| `packages/ui/` | 3 | Baseline 0009 |

Exclus : `node_modules`, `dist-android`, `logs`, `.npm-cache-doctor`,
`.tmp-metro`, `.expo`, caches, `.env` réels, clés, keystores, certificats,
fichiers temporaires, liens. Rien n'a été repris depuis le monorepo.

Vérifications après copie :

- 10/10 empreintes SHA-256 de référence conformes (lockfile, manifestes, `.npmrc`,
  `pnpm-workspace.yaml`, `tsconfig.base.json`, `metro.config.js`).
- Comparaison fichier par fichier : mêmes chemins et mêmes contenus pour les 423
  fichiers des quatre zones.
- `.npmrc` : `node-linker=hoisted`, `registry=https://registry.npmjs.org/`.
- Aucun lien ni jonction copiés ; aucune référence à `C:\Users\kyria\yunicity`,
  `C:\tmp\yunimobile-0007-diag`, `C:\tmp\yunimobile-0009-extract` ou à un worktree.
- Seul fichier d'environnement : `apps/mobile/.env.example` (modèle) ; aucun motif
  de secret détecté.

Incident d'outillage, corrigé : ma première copie a placé les dossiers sous
`packages/` (variable PowerShell `$d` ayant écrasé `$D`, insensibles à la casse) et
n'a écrit aucun fichier racine. Tout est resté dans le dépôt, non suivi. Les
dossiers ont été déplacés à leur emplacement par chemins explicites, le dossier
intermédiaire vide supprimé, puis les fichiers racine copiés un par un. La
comparaison complète avec la baseline a été faite après correction.

## 3. Documentation

- `README.md` : application Expo SDK 54 sous `apps/mobile` ; backend FastAPI dans
  le dépôt Yunicity ; extraction et bundle validés ; aucun dev build, lancement ni
  build natif prouvé ; prérequis constatés ; uniquement les commandes exécutées
  dans ce ticket ; règle « aucun secret dans l'application ».
- `.gitignore` racine **inchangé** : le seul artefact généré dans le dépôt est
  `node_modules` (déjà couvert) ; `.expo`, caches et `.env` réels déjà couverts ;
  aucun `android/`, `ios/` ni sortie de bundle généré dans le dépôt.

## 4. Audit des overrides du monorepo

Source : `frontend/package.json` du dépôt Yunicity au SHA
`ee57ce1dfc37835a47335e56338578471a95ec7d`. Raisons tirées des messages de commit
de la source. Aucun override copié ; `package.json` et `pnpm-lock.yaml` non
modifiés.

| Override source | Valeur | Lockfile intégré | Raison documentée | Classement |
|---|---|---|---|---|
| `react`, `react-dom`, `@types/react` (globaux) | 18.3.1 / 18.3.20 | 19.1.0 / 19.1.17 | Politique React 18 de web/admin | Non pertinent (contraire à la baseline mobile) |
| `mobile>react`, `mobile>react-dom`, `mobile>@types/react` | 19.1.0 / ~19.1.0 | 19.1.0 / 19.1.17 | Forçage React 19 du mobile | Non pertinent : satisfait par les dépendances directes |
| `web>`, `admin>`, `@types/react-dom>` `@types/react` | 18.3.20 | — | Web/admin | Non pertinent |
| `expo-linking` | ~8.0.12 | 8.0.12 | Non documentée | Raison inconnue ; contrainte déjà satisfaite par la dépendance directe |
| `@xmldom/xmldom` | 0.8.13 | 0.8.15, 0.9.12 | Vulnérabilité high via Expo (xmldom 0.7.x) | Couvert (versions ≥ version épinglée) |
| `tar` | 7.5.21 | 7.5.22 | GHSA-23hp (Critical) et autres | Couvert |
| `shell-quote` | >=1.9.0 | 1.11.0 | GHSA-395f (High) | Couvert |
| **`postcss`** | **8.5.18** | **8.4.49** | « clears 3 advisories » | **Pertinent avant dev build — manquant** |
| `sharp` | 0.35.3 | absent | Runtime web | Non pertinent |
| `nanoid@3` | 3.3.18 | 3.3.19 | Lot « pin patched transitive versions » | Couvert |
| `js-yaml@3`, `js-yaml@4` | 3.15.1 / 4.3.1 | 3.15.2, 4.3.2 | Lot #151 | Couvert |
| **`brace-expansion`** (global) | **5.0.9** | **1.1.21, 2.1.7**, 5.0.12 | GHSA-mh99 : « no in-major backport; only fix is 5.0.8 » | **Pertinent avant dev build — manquant** (1.x et 2.x présents) |
| `vitest`, `esbuild`, `vite` (×3 sélecteurs) | — | absents | Outillage web/tests | Non pertinent |
| `ws` (3 plages → 8.21.0, 7.5.11, 6.2.4) | — | 8.22.0, 7.5.13, 6.2.6 | Versions patchées pour l'audit high | Couvert |
| `undici@<6.27.0` | 6.27.0 | 6.29.0 | Idem | Couvert |
| `browserslist` | 4.28.7 | 4.29.3 | GHSA-73wf, GHSA-c83g | Couvert |

« Couvert » signifie que la version du lockfile est supérieure ou égale à la version
épinglée par la source ; l'absence de vulnérabilité n'a pas été vérifiée par un
scanner. La sévérité individuelle de `postcss` et `brace-expansion` n'est pas
documentée (lot de #151 : 1 Critical et 13 High), et la chaîne qui les tire dans le
graphe mobile n'a pas été établie.

**Conséquence** : la gate « audit des overrides » de YUNIMOBILE-0009 n'est pas
levée. Le prochain dev build est **classé bloqué jusqu'à un ticket correctif**
décidant du sort de `postcss` et `brace-expansion`. L'intégration est conservée.

## 5. Installation

- Node v24.18.1 ; pnpm 9.15.9 (bascule depuis pnpm 10.16.1 global) ; store
  `%LOCALAPPDATA%\pnpm\store\v3` ; registre officiel.
- `CI=1 pnpm install --frozen-lockfile --prefer-offline` (racine du dépôt) →
  exit **0**, 254 s ; « Lockfile is up to date, resolution step is skipped » ;
  1 003 paquets ; **0 téléchargé**, 941 réutilisés depuis le store ; aucun
  avertissement.
- Scripts lifecycle : **aucun exécuté**. En 0009, `unrs-resolver postinstall`
  avait tourné. Ici, le binding natif `@unrs/resolver-binding-win32-x64-msvc` est
  présent et `unrs-resolver` se charge. Hypothèse non vérifiée : résultat réutilisé
  depuis le store.
- Lockfile et 7 manifestes : SHA-256 identiques avant et après installation, et
  après tous les contrôles.

## 6. Contrôles

### 6.1 Résolution autonome

- `require.resolve` depuis `apps/mobile` : `react`, `react-dom`, `react-native`,
  `expo`, `expo-router`, `@yunicity/utils`, `@yunicity/types`,
  `@yunicity/ui/brand`, `eslint`, `eslint-config-expo`, `typescript` → 11/11 dans
  le dépôt.
- 5 jonctions créées par pnpm (`apps/mobile/node_modules/@yunicity/*`,
  `packages/utils/node_modules/@yunicity/types`), toutes vers `packages/*` du
  dépôt.
- React : `pnpm --filter mobile list` → `react` 19.1.0, `react-dom` 19.1.0 ;
  `pnpm why react -r` : uniquement 19.1.0 ; dossiers `node_modules/react(-dom)` en
  19.1.0, plus la copie canary 19.2 embarquée par `@expo/cli/static` (comme en 0009).
  Aucune coexistence React 18 / 19 dans le dépôt.
- **Fuite d'environnement (types)** : `tsc --listFilesOnly` lit 1 297 fichiers dont
  **9 hors du dépôt**, sous `C:\Users\kyria\node_modules\@types\` et
  `…\node_modules\csstype` : `@types/react` 19.2.8, `prop-types`,
  `react-big-calendar`, `date-arithmetic`, `warning`, `strip-bom`,
  `strip-json-comments`, `csstype`. Cause : le `tsconfig` ne fixe pas `types`, donc
  TypeScript inclut les `@types` de tous les `node_modules` parents ; un projet npm
  isolé existe dans le dossier utilisateur (`package.json`, `package-lock.json`,
  `node_modules`). Ce n'est pas une dépendance du dépôt, et ce n'était pas visible
  en 0009 (extraction sous `C:\tmp`). Rien n'a été modifié.
- Metro : le bundle produit le même nombre de modules (1 933) qu'en 0009, où aucun
  `node_modules` parent n'existait. Déduction : aucun module du bundle n'est résolu
  depuis le `node_modules` parent ; non vérifié module par module.

### 6.2 Typecheck

- `pnpm --filter mobile run typecheck` (script `tsc --noEmit`), depuis la racine →
  exit **0**, 50 s, 0 erreur.
- Diagnostic isolé, sans modifier le `tsconfig` :
  `node ../../node_modules/typescript/bin/tsc --noEmit -p tsconfig.json --pretty false --typeRoots ../../node_modules/@types`
  → exit **0**, 0 erreur, 1 288 fichiers, tous dans le dépôt (même nombre qu'en
  0009). Le résultat ne dépend pas des types externes.

### 6.3 Lint

`NODE_ENV=development node ../../node_modules/eslint/bin/eslint.js app components --ext .js,.jsx,.ts,.tsx,.mjs,.cjs`
(ESLint 8.57.1, sans `--fix` ni cache), depuis `apps/mobile` → exit **0**, 110 s,
51 fichiers (30 `app`, 21 `components`), 0 erreur, 0 avertissement. Aucune
configuration ESLint dans les dossiers parents.

### 6.4 expo install --check

`CI=1 EXPO_NO_TELEMETRY=1 node ../../node_modules/expo/bin/cli install --check --pnpm`
(CLI 54.0.27) → exit **0**, « Dependencies are up to date ».

### 6.5 expo-doctor

- Intégrité de `expo-doctor@1.20.4` vérifiée avant exécution (`npm view`, cache
  `C:\tmp\yunimobile-0010-doctor-cache`) et après (`package-lock.json` du cache
  `_npx`) : `sha512-Jm1lIqVdO8br9wiqTg5QhJ1u4zLWAhoue4bXsEuzW543vC3XY+U0cpEOmiLkvJhTTgZgIK+24l4i8VzyZ2VLMg==`.
- `CI=1 EXPO_NO_TELEMETRY=1 npm_config_cache=C:\tmp\yunimobile-0010-doctor-cache npm exec --yes --package=expo-doctor@1.20.4 -- expo-doctor --verbose`
  → exit **0**, 104 s, **18/18**, « No issues detected! ». Cache npm global non
  utilisé.

### 6.6 Bundle Android Metro

- `CI=1 EXPO_NO_TELEMETRY=1 TEMP=C:\tmp\yunimobile-0010-metro-temp TMP=C:\tmp\yunimobile-0010-metro-temp node ../../node_modules/expo/bin/cli export --platform android --output-dir C:\tmp\yunimobile-0010-dist-android --clear`,
  depuis `apps/mobile` (CLI au chemin hoisted `../../node_modules`).
- Exit **0** ; 346 s au total, dont 283 844 ms de bundling ;
  `Android Bundled … node_modules\expo-router\entry.js (1933 modules)`.
- Sortie hors dépôt : 30 fichiers, 6 448 635 octets — bundle
  `entry-9f961ef8a74fa06b11012a0e8be7a00c.hbc` (6 310 283 octets), 28 assets,
  `metadata.json`.
- Avertissements : uniquement `Bundler cache is empty, rebuilding` (attendu avec
  `--clear`). Aucune erreur.
- Comparaison avec 0009 : mêmes 30 chemins, même `metadata.json`, même nom de
  bundle ; le `.hbc` diffère de 8 octets. Cause démontrée : il embarque le chemin du
  répertoire temporaire de build (`…0009-extract\.tmp-metro` contre
  `…0010-metro-temp`).
- Aucun `android/`, `ios/`, `.expo` ni `dist*` créé dans le dépôt.

## 7. Différences avec le POC 0009

- Fichiers de l'application et des packages : aucune.
- Installation : 0 téléchargement et aucun script lifecycle exécuté (§ 5).
- Résolution TypeScript : 9 fichiers de types externes chargés dans ce dossier,
  sans effet sur le résultat (§ 6.1, § 6.2).
- Bundle : chemin temporaire embarqué différent (§ 6.6).

## 8. Vérifications finales

- `git status --short` : `README.md` et `.loop/state.md` modifiés ; non suivis :
  ticket, ce rapport, les 5 fichiers racine, `apps/`, `packages/`.
  `git diff --check` : exit 0.
- Fichiers non suivis : 429 ; tous UTF-8/ASCII, 0 CR, 0 espace final ; 2 binaires
  (`assets/yunicity-mascot.png`, `.gitkeep` vide) ; **1 sans newline finale :
  `apps/mobile/.gitignore`**, identique à la baseline et à la source, non modifié.
- Aucun `node_modules`, cache, bundle, `android/`, `ios/` ni `.expo` parmi les
  fichiers non suivis ; aucun motif de secret.
- `main` et `origin/main` inchangés (`380208d`) ; branche courante
  `feat/yunimobile-0010-extraction`.
- Espace libre sur `C:` : 6,807 Gio au départ ; 6,793 après copie ; 7,127 avant et
  7,256 après installation ; 7,102 avant bundle ; **6,567 Gio à la fin (minimum
  mesuré)**. Seuil de 3 Gio respecté à chaque mesure.

## 9. Points à trancher

1. **`apps/mobile/expo-env.d.ts` est ignoré par Git** : `apps/mobile/.gitignore`
   (copié de la source) contient `expo-env.d.ts`, alors que le fichier est suivi
   dans la source et inclus par le `tsconfig`. Un `git add` normal l'omettrait.
   Options : `git add -f apps/mobile/expo-env.d.ts` au commit, ou ajuster
   `apps/mobile/.gitignore` dans un changement explicite. **Bloquant pour un commit
   complet.**
2. **Overrides `postcss` et `brace-expansion`** manquants (§ 4) : prochain dev
   build bloqué jusqu'à un ticket correctif.
3. **Types externes** : les typechecks de ce dépôt dépendent du contenu de
   `C:\Users\kyria\node_modules`. Options : fixer `types`/`typeRoots` dans un
   ticket, ou retirer ce `node_modules` parent (hors dépôt, décision de Kyria).
4. **Données personnelles dans le code** (existant, repris tel quel) :
   `packages/utils/src/post-composer-labels.ts` contient des identifiants de
   réseaux sociaux et un nom personnels codés en dur, présents dans le bundle.
   Valeurs non reproduites ici. Ticket séparé recommandé.
5. `apps/mobile/.gitignore` sans newline finale (cosmétique, identique à la
   source).

## 10. Limites

- Aucun dev build, lancement, build natif ni preuve du comportement à l'exécution.
- La résolution Metro n'a pas été vérifiée module par module (§ 6.1).
- Overrides « couverts » par comparaison de versions, sans scanner de
  vulnérabilités.
- Contrôles propres de Claude, sans réexécution indépendante.

## 11. Recommandation du premier passage (remplacée par le § 12.8)

CONDITIONAL GO pour le commit, sous condition de décider du sort de
`expo-env.d.ts`. Les décisions CTO correspondantes sont appliquées au § 12.

## 12. Ajustements après revue CTO (2026-10-02)

Décisions CTO : `expo-env.d.ts` reste ignoré ; typecheck isolé du `node_modules`
du profil utilisateur ; `postcss` forcé en 8.5.18 ; aucun override
`brace-expansion` pour 1.1.21 et 2.1.7 ; retrait des identifiants et du nom
personnels codés en dur s'il est possible sans changement architectural.
Journaux : `C:\tmp\yunimobile-0010b-logs\`.

Sources officielles indiquées par le CTO (non consultées par Claude) :

- Expo typed routes : <https://docs.expo.dev/router/reference/typed-routes/>
- PostCSS : <https://github.com/advisories/GHSA-r28c-9q8g-f849>
- brace-expansion : <https://github.com/advisories/GHSA-mh99-v99m-4gvg>,
  <https://github.com/advisories/GHSA-6j4f-fj2g-mc7p>,
  <https://github.com/advisories/GHSA-qhr7-859c-m2p7>,
  <https://github.com/advisories/GHSA-rgw5-rvv9-x895>

### 12.1 `expo-env.d.ts`, volontairement ignoré

- Identique octet par octet (110 octets) au gabarit que le CLI Expo installé écrit
  lui-même (`@expo/cli/build/src/start/server/type-generation/expo-env.js`) : une
  directive `/// <reference types="expo/types" />` et le commentaire « should not
  be edited and should be in your git ignore ». Aucun code applicatif.
- Fichier généré par Expo CLI pour les typed routes, inclus par le `tsconfig` et
  recréé par Expo ; absent de Git conformément à la documentation officielle
  (source CTO ci-dessus). Son absence du commit n'est pas une perte de source.
- Laissé ignoré par `apps/mobile/.gitignore` ; ni `git add -f`, ni règle modifiée.
- Contrôle complémentaire : typecheck avec une configuration temporaire hors dépôt
  qui exclut ce fichier → exit 0, 0 erreur, fichier non lu. Un clone neuf sans ce
  fichier passe donc le typecheck.

### 12.2 Isolation TypeScript

Diff de `apps/mobile/tsconfig.json` :

```diff
   "compilerOptions": {
     "strict": true,
+    "typeRoots": ["../../node_modules/@types"],
     "paths": {
```

- `../../node_modules/@types` depuis `apps/mobile` = `node_modules\@types` à la
  racine du dépôt (vérifié par `path.relative`). Options héritées d'Expo conservées.
- Typecheck normal (`pnpm --filter mobile run typecheck`, sans option en ligne de
  commande) → exit 0, 0 erreur.
- `tsc --listFilesOnly` : 1 288 fichiers, **0 hors du dépôt, 0 sous
  `C:\Users\kyria\node_modules`** ; 15 paquets `@types` chargés, tous depuis
  `node_modules/@types` du dépôt.

### 12.3 Override PostCSS

Diff de `package.json` racine (seul changement) :

```diff
   "engines": {
     "node": ">=20"
+  },
+  "pnpm": {
+    "overrides": {
+      "postcss": "8.5.18"
+    }
   }
```

- Sauvegarde préalable de `package.json` et `pnpm-lock.yaml` hors dépôt.
- `CI=1 pnpm install --lockfile-only --prefer-offline` (pnpm 9.15.9) → exit 0.
- Diff du lockfile : 7 lignes ajoutées, 4 supprimées. Section `overrides:
  postcss: 8.5.18` ; entrée `postcss@8.4.49` → `postcss@8.5.18` avec son intégrité ;
  référence dans le snapshot de `@expo/metro-config@54.0.17`, seul consommateur ;
  snapshot `postcss` dont les dépendances (`nanoid` 3.3.19, `picocolors`…) ne
  changent pas de version. **Aucune autre dépendance ne change.**
- `CI=1 pnpm install --frozen-lockfile --prefer-offline` → exit 0 ; aucun script
  lifecycle. pnpm affiche `Packages: +1 -37` et `downloaded 33` : l'ensemble des
  paquets distincts installés reste identique à celui de 0009 (941), hormis
  `postcss`. Les 37 paquets du lockfile non installés sont des binaires optionnels
  d'autres plateformes (`@unrs/resolver-binding-*`, `lightningcss-*`, `fsevents`,
  `@emnapi/*`, `@napi-rs/wasm-runtime`, `@tybys/wasm-util`), également absents en
  0009. Le sens exact du compteur de pnpm n'est pas démontré.
- Résultat : `postcss` 8.5.18 seul (lockfile et `node_modules`), aucune version
  ≤ 8.5.17 ; 978 paquets du lockfile, tous issus du registre npm ; manifestes autres
  que `package.json` racine inchangés (empreintes).

### 12.4 brace-expansion, sans override

- Versions installées : 1.1.21 (sous `minimatch`), 2.1.7 (sous `@expo/cli`) et
  **5.0.12** (racine). Le lockfile contient aussi 5.0.12, non mentionnée dans la
  décision CTO.
- Aucun override ajouté. L'absence de vulnérabilité pour ces versions repose sur la
  décision CTO et les avis cités ; Claude ne les a pas vérifiés.

### 12.5 Données personnelles neutralisées

- Fichier : `packages/utils/src/post-composer-labels.ts`, constante
  `POST_CROSS_POST_PLATFORMS` (4 entrées : `id`, `label`, `handle`).
- Rôle établi : libellés d'affichage statiques de la section « Partager aussi
  sur ». La constante n'est référencée que par sa définition et le ré-export de
  `packages/utils/src/index.ts` ; aucun usage dans l'app. Le payload API
  `cross_post_targets` ne transporte que des booléens par plateforme ; aucune route,
  identité, requête ni analytics n'utilise ces valeurs.
- Remplacement : les quatre valeurs `handle` deviennent `"Compte non connecté"`,
  cohérent avec le libellé existant « Connexion réseaux — bientôt disponible ».
  Types et structure conservés ; 4 lignes modifiées, aucune autre.
- Contrôles : aucune occurrence des valeurs d'origine dans les fichiers destinés au
  commit ni dans le nouveau bundle ; valeurs d'origine non reproduites dans les
  documents ni dans les journaux 0010b.
- Les artefacts du premier passage hors dépôt (bundle
  `C:\tmp\yunimobile-0010-dist-android`) contiennent encore les anciennes valeurs ;
  ils sont conservés selon les consignes.

### 12.6 `.gitignore` du mobile

Seule la newline finale manquante a été ajoutée à `apps/mobile/.gitignore` ; règles
inchangées ; `expo-env.d.ts` toujours ignoré.

### 12.7 Divergences volontaires avec la baseline 0009

| Fichier | Divergence |
|---|---|
| `apps/mobile/tsconfig.json` | `typeRoots` local |
| `package.json` racine | override `postcss` 8.5.18 |
| `pnpm-lock.yaml` | conséquence de l'override (postcss uniquement) |
| `packages/utils/src/post-composer-labels.ts` | valeurs `handle` neutralisées |
| `apps/mobile/.gitignore` | newline finale |
| 7 fichiers de `packages/types` et `packages/utils` (§ 13) | ligne vide terminale superflue retirée |

Empreintes de référence 0009 encore valides : `pnpm-workspace.yaml`, `.npmrc`,
`tsconfig.base.json`, `apps/mobile/package.json`, `apps/mobile/metro.config.js`,
`packages/{types,utils,ui}/package.json`. Nouvelles empreintes : `package.json`
`1bf8fed611025ea1191c1efd36b27a9de435e1c35fee379039873c82c7d9f8e4`,
`pnpm-lock.yaml`
`594a3b090ddcc4003976e32305e0651b668da3397efcf497864d1461413527fd`.

### 12.8 Contrôles refaits

| Contrôle | Code | Résultat |
|---|---|---|
| Résolution | — | 11/11 modules dans le dépôt ; `tsc` : 1 288 fichiers, 0 externe |
| React | — | `react`, `react-dom` 19.1.0 seuls |
| Typecheck (`pnpm --filter mobile run typecheck`) | 0 | 0 erreur |
| Lint `app` + `components` | 0 | 51 fichiers, 0 erreur, 0 avertissement |
| `expo install --check` | 0 | « Dependencies are up to date » |
| `expo-doctor` 1.20.4 (cache `C:\tmp\yunimobile-0010b-doctor-cache`, intégrité vérifiée avant et après) | 0 | 18/18 |
| `expo export --platform android` (`C:\tmp\yunimobile-0010b-dist-android`, TEMP `C:\tmp\yunimobile-0010b-metro-temp`) | 0 | 341 s ; 1 933 modules ; 30 fichiers, 6 448 632 octets ; bundle `entry-14ea0e2872c0bbb13b2fe593b3cbf1ab.hbc` (6 310 280 octets) ; seul avertissement « Bundler cache is empty » |

Aucun `android/`, `ios/`, `.expo` ni `dist*` dans le dépôt ; aucun cache ni bundle
parmi les fichiers à suivre ; aucun fichier sensible ; aucun motif personnel dans
les fichiers à suivre ni dans le bundle.

### 12.9 État avant commit

- 431 fichiers seraient suivis par `git add -A` : 429 nouveaux (75 dans
  `apps/mobile`, 47 dans `packages/types`, 297 dans `packages/utils`, 3 dans
  `packages/ui`, 5 fichiers racine, ticket, rapport) et 2 modifiés (`README.md`,
  `.loop/state.md`).
- Ignorés pertinents : `apps/mobile/expo-env.d.ts` (volontaire), `node_modules/`,
  `apps/mobile/node_modules/`, `packages/utils/node_modules/`.

### 12.10 Recommandation (séparée des preuves)

**GO pour le commit de l'intégration.** Les décisions CTO sont appliquées, l'ancienne
condition (`expo-env.d.ts`) est levée et tous les contrôles passent. Avant le
premier dev build restent : la confirmation de `brace-expansion` 5.0.12 au regard
des avis cités, et les limites du § 10 (aucune exécution prouvée). Décision au CTO.

## 13. Clôture (2026-10-02)

**GO validé par le CTO pour le commit de l'intégration permanente.**

- `postcss` corrigé en 8.5.18 par override pnpm ; aucune autre version modifiée.
- `brace-expansion` 1.1.21, 2.1.7 et 5.0.12 vérifiés par le CTO dans les avis
  officiels ; seuils corrigés : GHSA-mh99-v99m-4gvg 1.1.17 / 2.1.3 / 5.0.8 ;
  GHSA-rgw5-rvv9-x895 1.1.18 / 2.1.4 / 5.0.9 ; GHSA-6j4f-fj2g-mc7p
  1.1.19 / 2.1.5 / 5.0.10 ; GHSA-qhr7-859c-m2p7 1.1.20 / 2.1.6 / 5.0.11. Les trois
  versions installées sont supérieures aux seuils correspondants : aucun override.
- Isolation TypeScript obtenue (`typeRoots` local, aucun type externe lu).
- Données personnelles codées en dur neutralisées.
- `expo-env.d.ts` volontairement ignoré, conformément à Expo.
- Les cinq contrôles et le bundle Android Metro ont réussi (§ 12.8).
- Aucun dev build, aucun lancement sur appareil ou émulateur, aucune preuve du
  comportement à l'exécution.
- Bundles obsolètes contenant les anciennes valeurs supprimés sur autorisation
  CTO : `C:\tmp\yunimobile-0010-dist-android` et
  `C:\tmp\yunimobile-0009-extract\apps\mobile\dist-android`. Le bundle assaini
  `C:\tmp\yunimobile-0010b-dist-android` est conservé.
- Lignes vides terminales : sept fichiers repris de la source se terminaient par
  une ligne vide en trop (octets finaux `0A 0A`) : `packages/types/src/weather.ts` et, dans `packages/utils/src/`, `geo.ts`, `neighborhood-portal-labels.ts`, `neighborhood-portal.ts`, `tribe-portal-labels.ts`, `tribe-portal.ts`, `weather-api.ts`. `git diff --cached
  --check` l'a détecté avant le commit (« new blank line at EOF », exit 2).
  Exactement une newline superflue a été retirée dans chaque fichier (longueur −1
  octet, préfixe identique à la baseline, fin par un seul `0A`, sans CR ni BOM).
  Changement cosmétique sans effet fonctionnel ; divergence volontaire
  supplémentaire par rapport à la baseline 0009. Typecheck (exit 0, 0 erreur) et
  lint `app` + `components` (exit 0, 51 fichiers, 0 erreur, 0 avertissement)
  réexécutés après la correction.
- Prochaine étape, non lancée : configuration et premier dev build Android.

### Verification finale de la correction EOF par Codex (2026-10-02)

- Controle propre sur la branche `feat/yunimobile-0010-extraction`, HEAD initial
  `380208dedb19722525c92c9d0bcb2872459d00c7` : correction deja presente au debut
  de cette verification ; aucun octet supplementaire retire par Codex.
- Les sept fichiers de la source/baseline 0009 avaient une ligne vide terminale
  superflue ; detection avant commit par `git diff --cached --check` rapportee
  dans le journal precedent. Comparaison propre : exactement le dernier `0A`
  retire dans chacun, tous les autres octets identiques. UTF-8 sans BOM, LF,
  une seule newline finale, aucun CR ni espace final. Divergence volontaire
  supplementaire, cosmetique, sans effet fonctionnel.
- Longueurs baseline -> index (octets) : `weather.ts` 857 -> 856 ; `geo.ts`
  970 -> 969 ; `neighborhood-portal-labels.ts` 4111 -> 4110 ;
  `neighborhood-portal.ts` 15938 -> 15937 ; `tribe-portal-labels.ts`
  4456 -> 4455 ; `tribe-portal.ts` 21202 -> 21201 ; `weather-api.ts` 829 -> 828.
- Controles propres reexecutes apres correction :
  `pnpm --filter mobile run typecheck` : exit 0 ; depuis `apps/mobile`,
  `NODE_ENV=development node ../../node_modules/eslint/bin/eslint.js app components --ext .js,.jsx,.ts,.tsx,.mjs,.cjs --max-warnings 0 --format json` :
  exit 0, 51 fichiers, 0 erreur, 0 avertissement, sans `--fix`.
- Index : 431 fichiers, identiques aux fichiers du repertoire ; 415 fichiers
  copies identiques a la baseline, 12 divergences documentees. Aucun fichier
  ignore, artefact genere ou chemin sensible detecte dans l'index ; scan de
  motifs de credentials et de chemins locaux sans correspondance (ce scan
  ne constitue pas une garantie exhaustive). Anciens handles remplaces sur
  exactement quatre lignes ; valeurs d'origine non affichees.
- Espace libre mesure : 2,735 Gio, sous le seuil de vigilance de 3 Gio du ticket ;
  aucun nettoyage effectue. Aucun bundle, diagnostic Expo ou test runtime refait.
- Les executions anterieures de Claude restent des rapports tiers pour Codex.
  Statut termine conditionne a la reussite du commit autorise dans cette sequence.

### Clôture autorisée par le CTO (2026-10-02)

- Blocage antérieur d'autorisation levé par instruction explicite en conversation.
- Contrôle final réussi après les sept corrections EOF : comparaison propre
  Codex avec la baseline, exactement un octet `0A` retiré dans chaque fichier,
  préfixes identiques, UTF-8 sans BOM ni CR ; `git diff --cached --check`
  exit 0 et sortie vide après correction.
- Preuves applicatives réutilisées : typecheck propre Codex exit 0 ; lint propre
  Codex exit 0, 51 fichiers, 0 erreur, 0 avertissement. Les résultats Expo et
  bundle précédents restent des rapports tiers Claude ; aucun contrôle lourd
  réexécuté. Aucun contenu applicatif modifié depuis ces contrôles.
- Nettoyages arrêtés sans suppression de dossier : deux refus d'accès sur
  `.bin/acorn` de la copie 0007, inventaire intact vérifié après la première
  tentative ; inventaire `pip-unpack-*` arrêté au premier refus d'accès avant
  suppression. Dépendances de Yunimobile et de 0009 conservées. Abandon définitif
  des nettoyages pour cette clôture, sans changement d'ACL.
- Dérogation CTO au seuil de 3,5 Gio limitée à la clôture documentaire et au
  commit local, sous réserve de plus de 2,5 Gio libres. Mesure avant clôture :
  2,747 Gio. Aucune installation, aucun bundle, typecheck, lint ou outil Expo relancé.
- Commit local autorisé de 431 fichiers ; vérification finale de l'index et
  contrôle de l'arbre propre après commit requis dans cette même séquence.
  Aucun push, merge, rebase, suppression ou prochain ticket.
