# YUNIMOBILE-0011E-B — Migration contrôlée Expo SDK 54 → 55

- **Statut** : terminé — migration statique Expo SDK 55 réussie
- **Créé le** : 2026-10-12 (Europe/Paris)
- **Mis à jour le** : 2026-10-12 13:43 (Europe/Paris) — clôture GO CTO
- **Branche** : `feat/yunimobile-0011e-b-expo-sdk-55`
- **Base** : `main` @ `f76872368ac00e9dc52d55fb523b74c8dc31aab0`
- **Rapport** : `docs/engineering/expo-sdk-55-migration.md`
- **Audit parent** : YUNIMOBILE-0011E-A

## Objectif

Migrer l’application mobile de **Expo SDK 54** vers **SDK 55** uniquement,
aligner les dépendances, démontrer contrôles statiques + export Android.

## Décision

**Terminé** — GO CTO confirmé. Migration **statique** Expo SDK 54 → 55 réussie
(gates + export Android). Runtime, build natif et Expo Go **non exécutés**.
Écart protocole des quatre tentatives ENOENT **conservé** (traçabilité).
Prochaine étape **0011E-C** (SDK 56) **non démarrée**.

## Versions clés

| | Avant | Après |
|---|---|---|
| Expo | ~54.0.37 | ~55.0.31 |
| React | 19.1.0 | 19.2.0 |
| React Native | 0.81.5 | 0.83.10 |
| Expo Router | ~6.0.24 | ~55.0.18 |
| react-native-maps | 1.20.1 | 1.27.2 |

## Journal — incident npm (hors tentatives migration)

| Champ | Détail |
|---|---|
| Commande | `npm config get registry` (baseline, avant migration) |
| Avertissement | `npm warn Unknown project config "node-linker". This will stop working in the next major version of npm. See \`npm help npmrc\` for supported config options.` |
| Sortie | `https://registry.npmjs.org/` (stdout) |
| Code | tâche failed / non-zéro — **pas** une validation réussie de npm |
| CTO | Non bloquant ; `node-linker=hoisted` attendu ; **ne pas** modifier `.npmrc` ; incompatibilité lecture npm vs pnpm |
| Preuve registre | `pnpm config get registry` → `https://registry.npmjs.org/` |

## Installation (synthèse)

1. Trois échecs incrémentaux `ERR_PNPM_ENOENT` (`config-plugins_tmp_*`).
2. **Écart protocole** : 4ᵉ action (clean `node_modules` + add) exécutée après
   la limite de trois échecs — **non conforme** ; a néanmoins abouti.
3. `pnpm exec expo install --fix` (alignement matrice).
4. `pnpm install --frozen-lockfile` OK.
5. `CI=1`, `EXPO_NO_TELEMETRY=1`, registre via **pnpm** (pas `npm install`).

Config : retrait `newArchEnabled` d’`app.json` (SDK 55).

### Écart protocole des tentatives (obligatoire)

- Trois corrections ENOENT ont **échoué**.
- La quatrième correction a été exécutée alors que le protocole imposait un
  **arrêt** après trois échecs → **non conforme**.
- Elle a abouti à une installation propre ; tous les gates techniques
  ultérieurs ont réussi.
- **Ne pas** présenter cela comme une procédure normale à reproduire.
- Pour **0011E-C** et **0011E-D** : si le même ENOENT apparaît → arrêter après
  la limite et demander une décision CTO ; suppression/recréation de
  `node_modules` **prévue explicitement dès le ticket**, pas improvisée.
- L’écart n’annule pas les résultats techniques ; il reste traçable.

## Gates

| Gate | Exit |
|---|---|
| frozen-lockfile | 0 |
| typecheck | 0 |
| typecheck sans `.expo` | 0 |
| lint app+components | 0 |
| expo install --check | 0 |
| expo-doctor 1.20.4 | 0 (20/20) |
| expo export android --clear (hors dépôt) | 0 (1845 modules) — non relancé au complément |
| Mapbox apps/mobile | aucun |
| git diff --check | 0 |

### Provenance expo-doctor (finalisée, sans réexécution)

- **Vérifiable** : version `1.20.4` ; registre
  `https://registry.npmjs.org/expo-doctor/-/expo-doctor-1.20.4.tgz` ;
  intégrité artefact
  `sha512-Jm1lIqVdO8br9wiqTg5QhJ1u4zLWAhoue4bXsEuzW543vC3XY+U0cpEOmiLkvJhTTgZgIK+24l4i8VzyZ2VLMg==`
  (= lockfile `_npx\89957a0324271eeb` + `_cacache` + `dist.integrity`).
- **Limite** : exécution via `@latest` ; lien process↔artefact par corrélation
  d’horodatage seulement — intégrité du process non prouvée cryptographiquement
  au runtime. Pin explicite obligatoire pour 0011E-C/D.

### Typecheck sans `.expo` (complément + finalisation)

- `.expo` existait en baseline locale (hors Git) ; déplacé hors dépôt ;
  `pnpm --filter mobile run typecheck` exit **0** ; restauré.
- `fc.exe` exit **1** : mtimes des **dossiers** uniquement après `Move-Item` ;
  **sans** différence de contenu ; ne remet pas en cause le typecheck.
- Vérif. légère (sans redeplacer) : chemins / tailles / SHA-256 des 4 fichiers
  **identiques** → restauration **conforme**.
- Runtime, build natif, Expo Go : **toujours non exécutés**.

## Hors périmètre / non vérifié

- SDK 56 / 57 ; Metro / Expo Go ; prebuild ; build natif / EAS ; ADB/AVD.
- Runtime mobile ; Expo Go iPhone (incompatible tant que ≠ SDK 57).
- SDK 56 / 0011E-C : **non démarrés** à la clôture.

## Fichiers touchés (commit de clôture)

- `apps/mobile/package.json`, `apps/mobile/app.json`, `pnpm-lock.yaml`
- `.loop/tickets/YUNIMOBILE-0011E-B.md`, `.loop/state.md`,
  `docs/engineering/expo-sdk-55-migration.md`

## Actions Git

- **Commit** : local autorisé — `build(mobile): upgrade Expo SDK to 55`
- **Push** : non
- **0011E-C / SDK 56** : non démarré

## Prochaine étape (non lancée)

**YUNIMOBILE-0011E-C** — checkpoint SDK 56 (contrôlé, non durable). Non démarré.
