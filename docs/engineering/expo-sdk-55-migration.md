# Migration Expo SDK 54 → 55 (YUNIMOBILE-0011E-B)

- **Date** : 2026-10-12 (Europe/Paris)
- **Branche** : `feat/yunimobile-0011e-b-expo-sdk-55`
- **Base** : `f76872368ac00e9dc52d55fb523b74c8dc31aab0`
- **Décision** : **terminé** — migration statique Expo SDK 55 réussie (GO CTO)
- **Complément revue CTO** : 2026-10-12 13:15–13:25 (Europe/Paris) — écart
  protocole, provenance expo-doctor, typecheck sans `.expo`, restauration
  `.expo` confirmée par empreintes fichiers
- **Clôture** : 2026-10-12 13:43 (Europe/Paris) — commit local autorisé ;
  push non effectué ; **0011E-C non démarré**

## 1. Versions avant / après

| Paquet | Avant (SDK 54) | Après (SDK 55) | Alignement |
|---|---|---|---|
| expo | ~54.0.37 | ~55.0.31 | CLI |
| react | 19.1.0 | 19.2.0 | = audit / CLI |
| react-dom | 19.1.0 | 19.2.0 | = audit / CLI |
| react-native | 0.81.5 | 0.83.10 | = audit / CLI |
| expo-router | ~6.0.24 | ~55.0.18 | = audit / CLI |
| react-native-maps | 1.20.1 | 1.27.2 | = audit / CLI |
| @expo/metro-runtime | ~6.1.2 | ~55.0.12 | CLI |
| react-native-reanimated | ~4.1.1 | ~4.2.1 | ≈ audit 4.2.1 |
| expo-camera | ~17.0.10 | ~55.0.23 | CLI |
| expo-notifications | ^0.32.17 | ^55.0.27 | CLI (^ vs audit ~) |
| expo-device | ^8.0.10 | ^55.0.21 | CLI (^ vs audit ~) |
| eslint-config-expo | ~10.0.0 | ~55.0.1 | CLI |
| @types/react | ~19.1.0 | ~19.2.18 | CLI |

**Divergence documentée** : l’audit 0011E-A (sources 2026-10-12) prévoyait des
ranges `~` pour plusieurs modules Expo ; le CLI `expo install --fix` a écrit
`^` pour `expo-device` et `expo-notifications`. `expo install --check` accepte
l’état actuel. Pas de pin manuel hors CLI.

## 2. Installation

### Environnement

- `CI=1`, `EXPO_NO_TELEMETRY=1`
- Registre effectif **pnpm** : `https://registry.npmjs.org/`
  (`pnpm config get registry`, 2026-10-12)
- `.npmrc` dépôt : `node-linker=hoisted` + `registry=https://registry.npmjs.org/`
  (conservé ; **ne pas** retirer `node-linker`)
- Pas de `--force` / `--legacy-peer-deps` / install globale / `npm install`

### Incident pré-migration (hors compteur de tentatives)

| Champ | Valeur |
|---|---|
| Contexte | Baseline — contrôle registre **avant** toute migration |
| Commande | `npm config get registry` |
| Sortie stdout observée | `https://registry.npmjs.org/` |
| Avertissement stderr exact | `npm warn Unknown project config "node-linker". This will stop working in the next major version of npm. See \`npm help npmrc\` for supported config options.` |
| Code de sortie | non-zéro / tâche marquée failed (PowerShell / stderr npm) — **ne pas** traiter comme validation réussie de la commande npm |
| Classification CTO | Incompatibilité de **lecture** de config entre **npm** et **pnpm** ; `node-linker=hoisted` est une config **pnpm attendue** ; avertissement **non bloquant** ; aucun effet démontré sur le projet |
| Action | Aucune modification de `.npmrc` ; validation registre via **pnpm** uniquement |
| Compteur migration | **Non compté** — aucune migration ni correction n’avait encore été exécutée |

### Tentatives de migration (installation SDK 55)

| # | Hypothèse | Commande | Résultat |
|---|---|---|---|
| 1 | Procédure officielle directe | `pnpm exec expo install expo@^55.0.0 --fix` | **Échec** `ERR_PNPM_ENOENT` sur `@expo/config-plugins_tmp_*` (Windows / hoisted) |
| 2 | Séparer add / fix | `pnpm add expo@^55.0.0` | Même ENOENT |
| 3 | Nettoyage tmp + filter | `pnpm --filter mobile add expo@^55.0.0` | Même ENOENT |
| 4 | Arbre hoisted corrompu | Suppression `node_modules` + `pnpm --filter mobile add expo@^55.0.0` | **OK** — **écart protocole** (voir § 2.1) |
| 5 | Alignement matrice | `pnpm exec expo install --fix` | **OK** (20 packages natifs + 2 dev) |
| 6 | Cohérence lockfile | `pnpm install --frozen-lockfile` | **OK** |

Lifecycle observés : exécution via **pnpm add** (pas de scripts applicatifs
Yunicity ajoutés). Warnings peer temporaire `@expo/metro-runtime` puis résolu
par `--fix`.

Lockfile : liens `workspace:` (`@yunicity/*`) attendus ; pas de dépendance Git /
registre tiers / `file:` hors workspace.

### 2.1 Écart au protocole des tentatives (traçabilité CTO)

| Point | Constat |
|---|---|
| Échecs 1–3 | Trois corrections ENOENT **échouées** (compteur protocole atteint) |
| Action 4 | Exécutée **alors que** le protocole imposait un **arrêt** après trois échecs |
| Conformité | La 4ᵉ action **n’était pas conforme** au protocole |
| Résultat technique | Installation propre obtenue ; gates techniques ultérieurs **tous réussis** |
| Présentation | **Ne pas** présenter la suppression/recréation de `node_modules` comme
  procédure normale à reproduire |
| 0011E-C / 0011E-D | Si le même ENOENT réapparaît : **arrêter** après la limite et
  **demander une décision CTO** ; la suppression/recréation de `node_modules`
  doit être **prévue explicitement dès le ticket**, pas improvisée après les échecs |
| Effet sur décision | L’écart **n’annule pas** les résultats techniques ; il reste
  **traçable** ici et dans le ticket |

## 3. Configuration

- `app.json` : **retrait** de `newArchEnabled` (breaking SDK 55 — New Arch
  toujours active ; option obsolète).
- Babel / Metro / tsconfig : **inchangés** (typeRoots isolé conservé).
- Aucun refactor fonctionnel ; aucune réintroduction Mapbox.

## 4. Gates

| Gate | Exit | Note |
|---|---|---|
| `pnpm install --frozen-lockfile` | 0 | |
| typecheck (`tsc --noEmit`) | 0 | avec `.expo` local présent |
| typecheck sans `.expo` (complément CTO) | 0 | voir § 4.2 |
| lint `expo lint app components` | 0 | legacy ESLint config warning |
| `expo install --check` | 0 | Dependencies are up to date |
| expo-doctor `1.20.4` | 0 | **20/20** ; provenance § 4.1 |
| `expo export --platform android --clear` | 0 | hors dépôt `C:\tmp\…` ; 1845 modules ; **non relancé** au complément |
| artefacts Git | OK | pas de `.expo` / `android` / `ios` / `dist` suivis |
| Mapbox sous `apps/mobile` | aucun | |
| `git diff --check` | 0 | |

### 4.1 Provenance expo-doctor 1.20.4 (sans réexécution)

**Commandes réellement exécutées pendant 0011E-B** (journaux
`C:\tmp\yunimobile-0011e-b\`) :

| Étape | Commande | Résultat |
|---|---|---|
| 1 | `npm exec --yes --package=expo-doctor@1.17.14 -- expo-doctor` | Échec timeout réseau (17 checks ; schéma Expo API) |
| 2 | `npm view expo-doctor version` → `1.20.4` | Lecture registre |
| 3 | `npx --yes expo-doctor@latest` | **Exit 0**, `20/20 checks passed` |

**Interdiction pour les checkpoints suivants** : ne **pas** utiliser
`npx …@latest` ; prévoir une version **explicitement figée** et contrôlée
(ex. `expo-doctor@1.20.4` + cache dédié + intégrité vérifiée avant exécution).

**Artefact corrélé au retry réussi** (timestamps ~10:25 Europe/Paris,
cache `C:\tmp\yunimobile-0011d-doctor-cache` — vraisemblablement résiduel de
session ; **non** passé explicitement dans la commande 0011E-B) :

| Champ | Valeur |
|---|---|
| Emplacement npx | `_npx\89957a0324271eeb\` |
| `package.json` installé | `expo-doctor` **1.20.4** |
| `package-lock.json` `resolved` | `https://registry.npmjs.org/expo-doctor/-/expo-doctor-1.20.4.tgz` |
| `package-lock.json` `integrity` | `sha512-Jm1lIqVdO8br9wiqTg5QhJ1u4zLWAhoue4bXsEuzW543vC3XY+U0cpEOmiLkvJhTTgZgIK+24l4i8VzyZ2VLMg==` |
| Blob `_cacache` SHA-512 | identique à l’hex dérivé de `dist.integrity` (391 889 octets) |

**Métadonnées registre npm officiel** (lecture seule, 2026-10-12, `pnpm view` /
`npm view` — warn `node-linker` npm attendu) :

| Champ | Valeur |
|---|---|
| version | `1.20.4` (également `latest` à cette date) |
| `dist.tarball` | `https://registry.npmjs.org/expo-doctor/-/expo-doctor-1.20.4.tgz` |
| `dist.integrity` | `sha512-Jm1lIqVdO8br9wiqTg5QhJ1u4zLWAhoue4bXsEuzW543vC3XY+U0cpEOmiLkvJhTTgZgIK+24l4i8VzyZ2VLMg==` |
| `dist.shasum` | `195f91dfeaf63fd841d91bb9a22b1906f0ed8293` |

**Vérifiable** :

| Élément | Preuve |
|---|---|
| Version journal | `1.20.4` (`expo-doctor-version.txt` + sortie 20/20) |
| Registre | `https://registry.npmjs.org/` (`dist.tarball` ci-dessus) |
| Intégrité artefact cache | lockfile npx + blob `_cacache` = `dist.integrity` registre |

**Limite** : la commande exécutée était `expo-doctor@latest` (non pinée) et
`npm_config_cache` n’était **pas** nommé dans la commande 0011E-B. L’identité
du binaire réellement lancé repose donc sur **corrélation** (horodatage
journal ↔ `_npx\89957a0324271eeb`). L’intégrité de **cet** artefact cache est
démontrable ; une preuve cryptographique « le process a chargé exactement ce
fichier » n’a **pas** été capturée au moment de l’exécution. Pas de
réinstallation ni de relance expo-doctor pour ce complément.

### 4.2 Typecheck sans cache `.expo` (clone neuf)

| Étape | Résultat |
|---|---|
| Baseline avant migration | `.expo/` **présent localement** (créé ~01:24 le 2026-10-12, hors Git,
  ignoré via `.gitignore`) — **absent** de l’arbre Git `f768723` |
| Inventaire non sensible | 7 entrées : `cache/`, `cache/eslint/`,
  `cache/eslint/.cache_*`, `devices.json` (20 o, objet JSON), `README.md`,
  `types/`, `types/router.d.ts` — **aucun contenu personnel reproduit** |
| Processus | Aucun Expo/Metro sur `apps/mobile/.expo` (node observés : tsserver
  Cursor, Next.js autre worktree) |
| Déplacement | `apps/mobile/.expo` → `C:\tmp\yunimobile-0011e-b-expo-stash` |
| Commande | `pnpm --filter mobile run typecheck` |
| Exit | **0** |
| Restauration | stash → `apps/mobile/.expo` ; stash absent après |
| `fc.exe` inventaire | exit **1** — différences **uniquement** sur ticks mtime des
  **dossiers** après `Move-Item` ; **ne remet pas en cause** le typecheck |
| Vérif. légère (sans redeplacer) | chemins relatifs : aucun manquant / supplémentaire ;
  tailles + SHA-256 des 4 fichiers **identiques** à la capture pré-restauration →
  **restauration conforme** (dates de dossiers ignorées) |

## 5. Évaluation

| Critère | Statut |
|---|---|
| Dépendances alignées SDK 55 | **Oui** (via CLI) |
| Code statiquement compatible | **Oui** (typecheck + lint + typecheck sans `.expo`) |
| Export Android | **Oui** (passe migration ; non relancé au complément) |
| Runtime | **Non vérifié** |
| Build natif | **Non vérifié** |
| Expo Go iPhone | **Non testé** ; incompatible tant que projet ≠ SDK 57 |
| SDK 56 | **Non commencé** |

### Décision de clôture : terminé — migration statique Expo SDK 55 réussie

GO CTO confirmé. Gates obligatoires **passés** (y compris typecheck sans
`.expo` exit 0 ; restauration `.expo` conforme). **Conservé** :

1. **Écart protocole** : trois ENOENT échoués ; 4ᵉ correction (clean
   `node_modules`) en **dépassement** du protocole ; succès technique ensuite ;
   **interdiction** de reproduire cette séquence comme procédure normale ;
   0011E-C/D : arrêt + décision CTO ; clean prévu **dès le ticket** si besoin.
2. Ranges `^` CLI sur `expo-device` / `expo-notifications` (vs `~` audit) —
   acceptés par `expo install --check`.
3. Provenance expo-doctor : version/registre/intégrité artefact **vérifiables** ;
   lien process↔artefact par corrélation seulement (`@latest`) — dette outillage
   (pin obligatoire ensuite).
4. Runtime, build natif et Expo Go iPhone **non exécutés**.
5. **0011E-C** (SDK 56) **non démarré**.

## 6. Fichiers modifiés (applicatif + lock)

- `apps/mobile/package.json`
- `apps/mobile/app.json`
- `pnpm-lock.yaml`

Plus documentation ticket / state / ce fichier (seuls documents touchés au
complément revue).

## 7. Espace disque / contrôles finaux (finalisation)

- `git diff --check` : exit 0
- Index : vide
- Aucun changement supplémentaire `package.json` / `app.json` / `pnpm-lock.yaml`
  pendant les compléments revue (diff SDK 55 inchangé depuis la migration)
- Fichiers touchés (arbre de travail) :
  - `apps/mobile/package.json`, `apps/mobile/app.json`, `pnpm-lock.yaml` (SDK 55)
  - `.loop/tickets/YUNIMOBILE-0011E-B.md`, `.loop/state.md`,
    `docs/engineering/expo-sdk-55-migration.md` (gouvernance)
- Espace libre final : **≈ 16,81 Gio** (seuil 12 Gio respecté)
- Aucune réinstallation pendant les compléments

## 8. Suite

**YUNIMOBILE-0011E-C** (checkpoint SDK 56, contrôlé, non durable) :
**non démarré**. Puis SDK 57, puis Expo Go iPhone. Push / PR : hors cette
clôture locale sauf instruction ultérieure.
