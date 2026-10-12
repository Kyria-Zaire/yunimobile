# Migration Expo SDK 56 → 57 (YUNIMOBILE-0011E-D)

- **Date** : 2026-10-12 (Europe/Paris)
- **Branche** : `feat/yunimobile-0011e-d-expo-sdk-57`
- **Base** : `a8fc4f57cd63baa3cb73f0aa429db3cf20494df0`
- **Décision** : **terminé** — migration **statique** SDK 57 réussie ;
  runtime iPhone non exécuté (Expo Go SDK 58 incompatible)
- **Nature** : cible finale du chemin 54→55→56→57
- **Commit** : clôture locale GO CTO ; **push non**
- **Metro** : démarré puis **arrêté** ; port 8081 libre
- **Expo Go iPhone** : tenté — refus avant JS applicatif (pas un défaut Yunicity)


## 1. Préconditions

| Contrôle | Résultat |
|---|---|
| Branche départ | `main` |
| HEAD = origin/main | `a8fc4f57cd63baa3cb73f0aa429db3cf20494df0` |
| Arbre | propre |
| Ticket actif avant démarrage | Aucun |
| Espace libre (démarrage) | ≈ **15,30 Gio** |
| Sauvegarde SDK 55 | **présente** `C:\tmp\yunimobile-0011e-c-node_modules-sdk55-backup` |
| Cible sauvegarde SDK 56 | absente au démarrage (OK) |

## 2. Baseline SDK 56 (avant mutation)

### 2.1 Versions

| Paquet | Déclaré | Installé |
|---|---|---|
| expo | ~56.0.23 | **56.0.23** |
| react / react-dom | 19.2.3 | **19.2.3** |
| react-native | 0.85.3 | **0.85.3** |
| expo-router | ~56.2.21 | **56.2.21** |
| react-native-maps | 1.27.2 | **1.27.2** |

### 2.2 Empreintes SHA-256 (baseline)

| Fichier | Octets | SHA-256 |
|---|---|---|
| `package.json` | 203 | `1BF8FED6…D9F8E4` |
| `apps/mobile/package.json` | 1387 | `39000418…489AF2` |
| `apps/mobile/app.json` | 1065 | `448B2E5D…0963F` |
| `apps/mobile/tsconfig.json` | 254 | `922BAF7B…D5BFAF` |
| `pnpm-lock.yaml` | 334448 | `8E2CD63B…DABFC4A` |
| `.npmrc` | 57 | `5FCF0B65…6EBEB39` |

### 2.3 Autres

| Champ | Valeur |
|---|---|
| `.expo` | 5 fichiers |
| Registre pnpm | `https://registry.npmjs.org/` |
| Override root | `postcss` **8.5.18** |
| `node-linker` | hoisted |
| Journaux | `C:\tmp\yunimobile-0011e-d-logs` |

### 2.4 Scripts lifecycle susceptibles

- Scripts `prepare` / `postinstall` des paquets npm installés (transitifs).
- Aucun script lifecycle applicatif dans root ni `apps/mobile/package.json`.

## 3. Versions SDK 57 (sources officielles)

Consulté **2026-10-12** :

| Source | Résultat |
|---|---|
| npm `dist-tags` | `latest` = **57.0.28** ; `sdk-57` = **57.0.28** |
| Changelog Expo SDK 57 | Hermes mémoire ≥ **57.0.9** ; startup dev ≥ **57.0.17** (RN 0.86.3) |
| Audit 0011E-A | plancher **expo ≥ 57.0.17** |
| `bundledNativeModules` `sdk-57` | react **19.2.3** ; RN **0.86.3** ; router **~57.0.26** ; maps **1.27.2** ; reanimated **4.5.1** |

**Cible** : `expo@57.0.28` (stable latest ≥ 57.0.17). Aucune canary/nightly.

## 4. Sauvegarde et installation

### 4.1 Sauvegarde SDK 56

| Champ | Valeur |
|---|---|
| Chemin | `C:\tmp\yunimobile-0011e-d-node_modules-sdk56-backup` |
| Nested mobile | `C:\tmp\yunimobile-0011e-d-mobile-node_modules-sdk56-backup` |
| Méthode | `cmd move` (mobile OK) ; root : `robocopy /MOVE` après refus d’accès (verrous) |
| Entrées backup root | **575** |
| `node_modules` projet après | **absent** puis réinstallé |
| Espace après backup | ≈ **15,05 Gio** (`16150937600`) |

Aucun `.env` / secret déplacé (uniquement `node_modules`).

### 4.2 Commandes d’installation

Environnement : `CI=1`, `EXPO_NO_TELEMETRY=1`.

| # | Commande | Exit | Durée |
|---|---|---|---|
| 1 | `pnpm --filter mobile add expo@^57.0.0` | **0** | ≈ 443 s |
| 2 | `pnpm exec expo install --fix` (cwd `apps/mobile`) | **0** | ≈ 939 s |
| 3 | `pnpm install --frozen-lockfile` | **0** | ≈ 53 s |

Step 2 a aligné **15** modules natifs SDK 57 + `eslint-config-expo@~57.0.2`.

### 4.3 Versions après

| Paquet | Après (déclaré / installé) |
|---|---|
| expo | ~57.0.28 / **57.0.28** |
| react / react-dom | 19.2.3 / **19.2.3** |
| react-native | 0.86.3 / **0.86.3** |
| expo-router | ~57.0.26 / **57.0.26** |
| react-native-maps | 1.27.2 / **1.27.2** |
| react-native-reanimated | ~4.5.1 / **4.5.1** |
| eslint-config-expo | ~57.0.2 |

### 4.4 Lifecycle réellement observés

- Résolution / téléchargement / link pnpm des paquets Expo 57 et peers.
- `expo install --fix` a déclenché des `pnpm add` successifs (deps +
  `eslint-config-expo`).
- Aucun script applicatif Yunicity ajouté.
- Avertissement npm connu : `Unknown project config "node-linker"` à la lecture
  npm de `.npmrc` (inchangé ; registre confirmé via pnpm).

## 5. Audit du diff

Fichiers touchés par l’install :

- `apps/mobile/package.json` — bump SDK 57 uniquement
- `pnpm-lock.yaml` — lock aligné

Non modifiés par Expo : `apps/mobile/app.json`, `package.json` root,
`tsconfig.json`, `.npmrc`.

Documents ticket (cette passe) : `.loop/state.md`,
`.loop/tickets/YUNIMOBILE-0011E-D.md`,
`docs/engineering/expo-sdk-57-migration.md`.

Refus vérifiés :

| Contrôle | Résultat |
|---|---|
| Mapbox / `@rnmapbox` | **aucun** |
| Changement fournisseur carte | **non** (maps 1.27.2) |
| Secrets / clés dans le diff | **aucun** |
| Modification métier applicative | **aucune** |
| Source Git / registre non officiel | **aucun** |
| Artefacts android/ios/dist/.expo suivis | **aucun** |

## 6. Gates

| Gate | Exit | Note |
|---|---|---|
| Résolution modules | OK | React **19.2.3** ×1 ; RN **0.86.3** ×1 |
| typecheck | **0** | |
| typecheck sans `.expo` | **0** | 5 fichiers ; **MISMATCH=0** |
| lint app+components | **0** | avertissement config legacy ESLint seulement |
| `expo install --check` | **0** | Dependencies are up to date |
| expo-doctor **1.20.4** | **0** | **21/21** passed ; intégrité `sha512-Jm1lIqVdO8br9wiqTg5QhJ1u4zLWAhoue4bXsEuzW543vC3XY+U0cpEOmiLkvJhTTgZgIK+24l4i8VzyZ2VLMg==` |
| export Android | **0** | **2021** modules ; `C:\tmp\yunimobile-0011e-d-export-android` ; TEMP/TMP isolés |
| Mapbox / secrets / chemins absolus | OK | |
| artefacts suivis | OK | |
| `git diff --check` | **0** | (trailing whitespace state.md corrigé en hygiène doc) |

### Doctor brut

```text
Running 21 checks on your project...
21/21 checks passed. No issues detected!
```

Note : sous SDK 56 le même doctor rapportait **22** checks avec
**HermesV1VersionCheck** en échec. Sous SDK 57.0.28 : **21/21**, exit **0**,
**aucune** mention Hermes V1 — exception **supprimée**.

## 7. Décision (gates statiques)

**READY statique** (inchangé) :

- typecheck / lint / check / export OK ;
- Doctor vert ; HermesV1VersionCheck disparu ;
- maps inchangé ; pas de Mapbox / secret / artefact interdit.

## 8. Test runtime Expo Go iPhone (2026-10-12)

| Élément | Constat |
|---|---|
| Metro | `expo start --lan --clear` ; PID node `148896` ; port **8081** |
| Bundle iOS | **réussi** — **2078** modules |
| LAN | iPhone a atteint `exp://192.168.1.180:8081` |
| Expo Go (appareil) | **SDK 58** |
| Projet | **SDK 57** (`expo@57.0.28`) |
| Chargement | **refus** avant exécution du JavaScript applicatif |
| UI Yunicity | **aucun** écran exécuté |
| API / auth / nav / carte | **non testés** |

**Classification :** incompatibilité **Expo Go 58 / projet 57** — **pas** un
défaut applicatif Yunicity.

**Runtime :** **BLOCKED**. Aucune correction de code. Aucune migration vers
SDK 58 dans ce ticket.

Metro arrêté ; port **8081** libre ; aucun fichier applicatif modifié pendant
le test (hors docs ticket/state/rapport).

## 9. Synthèse des preuves (distinction obligatoire)

| Catégorie | Preuve | Portée |
|---|---|---|
| **Preuves statiques** | typecheck (± `.expo`) ; lint ; `expo install --check` ; Doctor **21/21** ; export Android 2021 modules | Compatibilité déclarative / build JS Android hors appareil |
| **Preuve de bundling iOS** | Metro `iOS Bundled` — **2078** modules ; LAN atteinte | Le packager sert un bundle iOS ; **pas** une exécution app |
| **Blocage Expo Go** | Appareil Go **SDK 58** ≠ projet **SDK 57** ; refus **avant** JS | Incompatibilité client Expo Go — **pas** un défaut Yunicity |
| **Fonctionnalités non testées** | UI, API, auth, navigation, carte, fournisseur Maps iOS | **Aucune** validation runtime métier |

## 10. Décision finale (clôture)

- Migration **statique** SDK 57 : **réussie**.
- Runtime iPhone : **non exécuté**.
- Ne **pas** migrer automatiquement vers SDK 58.
- Ticket SDK 58 : **non créé / non commencé**.
- **Prochain travail (non lancé)** : audit officiel de stabilité **SDK 58**
  versus stratégie **development build**.

## 11. État Git (clôture)

- Branche : `feat/yunimobile-0011e-d-expo-sdk-57`
- Fichiers de clôture : `apps/mobile/package.json`, `pnpm-lock.yaml`,
  `.loop/tickets/YUNIMOBILE-0011E-D.md`, `.loop/state.md`,
  `docs/engineering/expo-sdk-57-migration.md`
- Push : **non**
- Sauvegardes SDK 55 et SDK 56 : **conservées**
