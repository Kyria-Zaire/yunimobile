# Audit de migration Expo SDK 54 → 55 → 56 → 57

- **Ticket** : YUNIMOBILE-0011E-A
- **Branche** : `docs/yunimobile-0011e-expo-upgrade-audit`
- **Date de rédaction** : 2026-10-12 (Europe/Paris)
- **Clôture CTO** : 2026-10-12 — audit **approuvé** ; **CONDITIONAL GO** CP1 ;
  statut ticket **terminé** ; checkpoint SDK 55 **non démarré**
- **HEAD de référence** : `381396fe44bd7160430fade6a8177f86cb8a6ef3` (`main` = `origin/main`)
- **Nature** : documentaire uniquement — aucune installation, prebuild, Metro,
  Expo Go, build ou export exécuté dans ce ticket.
- **Non prouvé ici** : compatibilité runtime ; réussite future des migrations ;
  compatibilité Expo Go finale ; support effectif de Node 24 par toutes les
  dépendances.

Légende des preuves :

| Marqueur | Sens |
|---|---|
| **Fait officiel** | Affirmation tirée d’une source Expo / React Native consultée |
| **Constat local** | Lecture manifeste / lockfile / code Yunimobile |
| **Déduction** | Interprétation pour Yunicity ; à valider au checkpoint |

---

## 1. Contexte

- **Constat local** : YUNIMOBILE-0011D fusionné (PR #5) ; carte migrée vers
  `react-native-maps` **1.20.1** sur SDK 54.
- **Constat local** : iPhone Kyria — Expo Go **SDK 57** ; projet **SDK 54** →
  refus *Project is incompatible…* avant bundle (pas une erreur carte).
- **Décision produit** : Google Maps définitif Web + Mobile ; runtime Google
  Maps Android/iOS toujours non prouvé.
- **Objectif** : plan vérifiable de migration **incrémentale**
  54 → 55 → 56 → 57, un palier à la fois.

---

## 2. Baseline actuelle (constat local)

Sources : `apps/mobile/package.json`, `apps/mobile/app.json`,
`package.json` (racine), `pnpm-lock.yaml`, `babel.config.js`, `metro.config.js`.
Aucun `.env` réel lu.

### 2.1 Versions déclarées

| Élément | Version déclarée |
|---|---|
| Expo | `~54.0.37` |
| React | `19.1.0` |
| React DOM | `19.1.0` |
| React Native | `0.81.5` |
| Expo Router | `~6.0.24` |
| react-native-maps | `1.20.1` (exacte) |
| TypeScript | `^5.8.3` (résolu lockfile : 5.9.3) |
| `@types/react` | `~19.1.0` |
| Node (engines racine) | `>=20` |
| pnpm (packageManager) | `9.15.9` |
| Node poste (lecture shell) | `v24.18.1` |
| pnpm poste | `9.15.9` |

### 2.2 Dépendances Expo / React Native directes (`apps/mobile`)

| Paquet | Range |
|---|---|
| `@expo/metro-runtime` | `~6.1.2` |
| `expo` | `~54.0.37` |
| `expo-camera` | `~17.0.10` |
| `expo-constants` | `~18.0.14` |
| `expo-device` | `^8.0.10` |
| `expo-font` | `~14.0.12` |
| `expo-linking` | `~8.0.12` |
| `expo-notifications` | `^0.32.17` |
| `expo-router` | `~6.0.24` |
| `expo-secure-store` | `~15.0.8` |
| `expo-splash-screen` | `~31.0.13` |
| `expo-status-bar` | `~3.0.9` |
| `react-native-reanimated` | `~4.1.1` |
| `react-native-safe-area-context` | `~5.6.0` |
| `react-native-screens` | `~4.16.0` |
| `react-native-svg` | `15.12.1` |
| `react-native-qrcode-svg` | `^6.3.21` |
| `eslint-config-expo` | `~10.0.0` |
| `@babel/core` | `^7.27.1` |

Workspace : `@yunicity/types`, `@yunicity/ui`, `@yunicity/utils`.

### 2.3 `app.json`

- `newArchEnabled`: **true**
- `scheme`: `yunicity`
- Plugins : `expo-router`, `expo-camera` (+ permission texte), `expo-font`,
  `expo-notifications` (+ `color`)
- Pas de plugin `react-native-maps` / clés Google
- `experiments.typedRoutes`: true
- iOS `bundleIdentifier` / Android `package` : `com.yunicity.mobile`

### 2.4 New Architecture

- **Constat local** : déjà activée (`newArchEnabled: true`).
- **Déduction** : le risque « adopter New Arch en même temps que SDK 55 » est
  réduit pour Yunimobile ; il reste à prouver runtime/native aux checkpoints.

### 2.5 Modules natifs / Expo Go

| Module | Dans Expo Go (SDK 54 doc) | Usage Yunimobile |
|---|---|---|
| `expo-camera` | Oui (module Expo) | Scan QR partenaire |
| `expo-notifications` | Oui | Push |
| `expo-secure-store` | Oui | Tokens auth |
| `expo-router` | Oui | Navigation |
| `react-native-maps` | Oui (third-party Expo Go) | Carte événements |
| `react-native-reanimated` | Oui | Babel plugin présent |
| `react-native-svg` | Oui | QR SVG |
| `react-native-qrcode-svg` | JS + svg (pas module Expo dédié) | Passport QR |

**Déduction** : Google Maps **store** (clés + `PROVIDER_GOOGLE` iOS) nécessitera
toujours un **development build** (0011G / ticket iOS) — hors Expo Go.

---

## 3. Recherche officielle par passage

Date de consultation : **2026-10-12**.

Versions `bundledNativeModules` : branches GitHub `expo/expo`
`sdk-54` / `sdk-55` / `sdk-56` / `sdk-57`
(`packages/expo/bundledNativeModules.json`).

### 3.1 SDK 54 → 55

| Source | URL | Objet |
|---|---|---|
| Changelog SDK 55 | https://expo.dev/changelog/sdk-55 | Release + breaking + upgrade |
| Guide upgrade SDK 55 | https://expo.dev/blog/upgrading-to-sdk-55 | New Arch, API 36 |
| New Architecture | https://docs.expo.dev/guides/new-architecture/ | New Arch obligatoire ≥55 |
| Map View v55 | https://docs.expo.dev/versions/v55.0.0/sdk/map-view/ | `react-native-maps` in Expo Go |
| bundledNativeModules sdk-55 | https://raw.githubusercontent.com/expo/expo/sdk-55/packages/expo/bundledNativeModules.json | Versions bundled |

| Élément | Attendu (fait officiel / bundled) |
|---|---|
| Expo | `expo@^55.0.0` |
| React | `19.2.0` |
| React Native | `0.83.10` (bundled actuel branche sdk-55) |
| expo-router | `~55.0.18` |
| react-native-maps | `1.27.2` |
| reanimated / worklets | `4.2.1` / `0.7.4` |
| Node | `^20.19.4`, `^22.13.0`, `^24.3.0`, `^25.0.0` |
| New Architecture | **Toujours on** ; `newArchEnabled` **retiré** de app.json |
| Expo Go | Stores : Go App Store reste sur SDK 54 ; SDK 55 Go via CLI Android / TestFlight / `eas go` (changelog 55) |
| Commande officielle (non exécutée) | `npx expo install expo@^55.0.0 --fix` puis `npx expo-doctor@latest` |

Breaking / points Yunicity (faits officiels + déduction) :

- Retirer `newArchEnabled` d’`app.json` (option obsolète).
- `expo-notifications` : mises à jour Android FCM / breaking changelog — retester push.
- `expo-router` : types server `ExpoRequest`/`ExpoResponse` retirés ; `reset` →
  `resetOnFocus` (headless tabs) — **déduction** : usage Yunimobile = Tabs/Stack
  classiques, risque faible si pas d’API server/headless.
- Xcode 26 requis pour compile iOS native (EAS).
- Android API 36 supporté pour builds SDK 55 (guide upgrade).

### 3.2 SDK 55 → 56

| Source | URL | Objet |
|---|---|---|
| Changelog SDK 56 | https://expo.dev/changelog/sdk-56 | RN 0.85, Hermes v1, regressions |
| Guide upgrade SDK 56 | https://expo.dev/blog/upgrading-to-sdk-56 | iOS 16.4+, API 36 |
| Map View v56 | https://docs.expo.dev/versions/v56.0.0/sdk/map-view/ | maps in Expo Go |
| bundledNativeModules sdk-56 | https://raw.githubusercontent.com/expo/expo/sdk-56/packages/expo/bundledNativeModules.json | Versions |

| Élément | Attendu |
|---|---|
| Expo | `expo@^56.0.0` |
| React | `19.2.3` |
| React Native | `0.85.3` |
| expo-router | `~56.2.21` |
| react-native-maps | `1.27.2` (inchangé vs 55) |
| reanimated / worklets | `4.3.1` / `0.8.3` |
| Node | minimum **20.19.4+** (RN 0.85) |
| iOS min | **16.4+** |
| Hermes | **v1 par défaut** |
| Commande | `npx expo install expo@^56.0.0 --fix` ; `npx expo-doctor@latest` |

Breaking / points Yunicity :

- **expo-router ne dépend plus de react-navigation** : imports directs
  `@react-navigation/*` cassés ; codemod
  `npx expo-codemod sdk-56-expo-router-react-navigation-replace`.
  **Constat local** : aucun import `@react-navigation/*` sous `apps/mobile` →
  risque faible.
- Metro : watcher Node natif par défaut (Watchman optionnel).
- **Régression connue** : mémoire ↑ avec Hermes v1 + `react-native-reanimated` /
  worklets — **résolue en SDK 57** ; recommandation officielle d’upgrader vers 57.
- Xcode **26.4** pour iOS native.

### 3.3 SDK 56 → 57

| Source | URL | Objet |
|---|---|---|
| Changelog SDK 57 | https://expo.dev/changelog/sdk-57 | RN 0.86, cadence, Go, patches |
| Upgrade walkthrough | https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/ | Processus générique |
| Expo Go mismatch | https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/ | Alignement Go / projet |
| Map View v57 | https://docs.expo.dev/versions/v57.0.0/sdk/map-view/ | maps in Expo Go |
| bundledNativeModules sdk-57 | https://raw.githubusercontent.com/expo/expo/sdk-57/packages/expo/bundledNativeModules.json | Versions |
| Page SDK 57 | https://expo.dev/sdk/57 | Release 2026-06-30 |

| Élément | Attendu |
|---|---|
| Expo | `expo@^57.0.0` — **viser ≥ 57.0.17** (patches Hermes) |
| React | `19.2.3` (inchangé vs 56) |
| React Native | `0.86.3` |
| expo-router | `~57.0.25` |
| react-native-maps | `1.27.2` |
| reanimated / worklets | `4.5.1` / `0.10.1` |
| Nature upgrade | Présenté comme **non-breaking** depuis 56 |
| Expo Go | Disponible via `eas go` (iOS device) / Expo CLI (Android + simulateurs) ; App Store Go peut laguer |
| Commande | `npx expo install expo@^57.0.0 --fix` ; `npx expo-doctor@latest` |

**Fait officiel** : Expo Go ne charge que le SDK correspondant au projet.

**Déduction** : après checkpoint 3, l’iPhone Kyria (Go 57) devrait pouvoir
ouvrir le projet **si** versions alignées — à prouver au runtime, non affirmé ici.

---

## 4. Analyse code Yunicity (lecture seule)

| Zone | Fichiers / usage | Risque migration |
|---|---|---|
| Expo Router | `app/**`, `Stack`/`Tabs`/`Link`/`Redirect` | Moyen sur 55–56 (version majeur router) ; faible sur APIs utilisées |
| SecureStore / auth | `lib/secure-storage.ts`, `lib/auth-provider.tsx` | Faible — API stable ; re-vérifier après bumps |
| Notifications | `lib/notifications.ts`, `hooks/use-push-notifications.ts` | Moyen sur 55 (changelog notifications) |
| Caméra / QR | `partner-scan/scan.tsx` (`CameraView`) | Moyen — bump majeur `expo-camera` à chaque SDK |
| Image picker | Absent du manifeste | N/A |
| react-native-maps | `components/map/*` | **Fort sur 54→55** (1.20.1 → 1.27.2) ; stable 55→57 sur 1.27.2 |
| Reanimated / Babel | `babel.config.js` + plugin reanimated | Moyen — bumps + régression Hermes 56 |
| Metro | `metro.config.js` = default Expo | Faible ; watcher Node en 56 |
| Deep links | `scheme: yunicity`, `expo-linking` | Faible — retester après bumps |
| Android / iOS config | `app.json` only (pas de dossiers natifs versionnés) | CNG : supprimer android/ios générés entre SDK si présents |
| `@yunicity/*` | packages workspace TS | Faible si pure JS/TS ; pas de modules natifs propres |

Point UX reporté (0011D / CodeRabbit hors diff) : désélection carte via
`MapView.onPress` — **hors périmètre migration SDK** ; ticket UI/UX futur.

---

## 5. Stratégie — quatre checkpoints

Ne **jamais** fusionner 54→57 en un seul changement.

### Checkpoint 0 — baseline SDK 54 (référence)

État actuel post-0011D. Avant tout upgrade :

- Arbre propre sur branche dédiée checkpoint.
- Noter versions manifeste + lockfile.
- (Hors 0011E-A) typecheck / lint / `expo install --check` / expo-doctor /
  export Android déjà prouvés en 0011D — à **rejouer** au début du checkpoint 1
  si l’arbre a changé.

### Checkpoint 1 — SDK 55

1. Branche dédiée depuis main (ou suite linéaire validée).
2. `pnpm exec expo install expo@^55.0.0 --fix` (depuis `apps/mobile` / filter).
3. Aligner explicitement `react-native-maps` via `expo install` (attendu 1.27.2).
4. Retirer `newArchEnabled` d’`app.json` si encore présent.
5. Inspecter `pnpm-lock.yaml`.
6. Gates (arrêt immédiat si échec) :
   - `pnpm install` (lockfile cohérent)
   - `expo install --check`
   - `expo-doctor`
   - typecheck
   - lint
   - `expo export --platform android` hors dépôt
   - `git diff --check` + revue versions vs bundledNativeModules SDK 55
7. **Commit dédié** recommandé.
8. Runtime appareil : **ne pas attendre** Expo Go iPhone store ; Android /
   simulateur / `eas go` optionnels — hors obligation si gates JS/export OK.

### Checkpoint 2 — SDK 56

Même protocole avec `expo@^56.0.0 --fix`.

- Vérifier absence d’imports `@react-navigation/*` (déjà OK) ; codemod si besoin.
- Surveiller mémoire / reanimated (régression connue) — **ne pas s’arrêter
  durablement sur 56** si reanimated actif ; enchaîner vers 57 dès gates OK.
- Commit dédié.

### Checkpoint 3 — SDK 57

Même protocole avec `expo@^57.0.0 --fix`, **cible patch ≥ 57.0.17**.

- Confirmer `react-native-maps` reste 1.27.2 (ou version bundled du moment).
- Test Expo Go iPhone Kyria : charge bundle + smoke carte (sans clés Google iOS).
- Commit dédié.
- Ensuite seulement : tickets 0011F / 0011G (AVD, dev build, clés Google).

### Politique Git (décision CTO)

Chaque palier aura sa **propre branche**, ses contrôles, son **commit** et sa
**PR**. Interdit : un seul commit « SDK 57 » depuis 54 ; aucun palier sauté.

---

## 6. Points tranchés (CTO + audit)

| Question | Décision / remarque |
|---|---|
| Cible finale | **SDK 57** |
| Paliers | Aucun saut : 54 → 55 → 56 → 57 |
| SDK 56 | Contrôlé normalement ; **pas** une cible durable |
| `react-native-maps` | **Réaligné à chaque palier** via matrice Expo officielle (`expo install` / bundled). Snapshot 2026-10-12 : 1.20.1 (54) → **1.27.2** (55/56/57) |
| Expo Go iPhone | Test **après** checkpoint SDK 57 uniquement — **non prouvé** ici |
| Node 24.18.1 | **Conservé provisoirement** ; aucun changement Node dans 0011E-A. Support effectif par toutes les deps : **non prouvé** |
| `newArchEnabled` | Déjà `true` (constat local). À retirer au CP1 (option absente ≥55, fait officiel) |
| Runtime / migrations futures | **Non prouvés** dans cet audit documentaire |

---

## 7. Décision CTO — CONDITIONAL GO (checkpoint SDK 55)

**Approuvé** : démarrer ultérieurement le checkpoint SDK **54 → 55** sous
conditions. Ticket suivant : **YUNIMOBILE-0011E-B** — **non démarré** ici.

Conditions opératoires :

1. Branche + contrôles + commit + PR **dédiés** au palier 55.
2. Arrêt immédiat si un gate échoue.
3. `react-native-maps` réaligné par `expo install` (matrice officielle du jour).
4. Pas de test Expo Go iPhone avant fin du checkpoint SDK 57.
5. SDK 56 : exécuter et valider, puis enchaîner vers 57 (pas de station durable).
6. Au checkpoint 57 : viser patch récent (ex. `expo@≥57.0.17` au 2026-10-12) ;
   re-vérifier au moment de l’exécution.
7. Aucune clé Google / pas de `PROVIDER_GOOGLE` iOS dans les checkpoints SDK.

### Non-objectifs de 0011E (migration SDK)

- Clés Google Cloud, AVD, premier dev build, EAS iOS.
- Changement de version Node.
- Traitement du diagnostic UX `MapView.onPress` (désélection).

---

## 8. Tableau récapitulatif des versions

Sources des colonnes 55/56/57 : `bundledNativeModules.json` des branches
GitHub `expo/expo` `sdk-55` / `sdk-56` / `sdk-57`, consultées le
**2026-10-12**. Colonne 54 : constat local manifeste. Ces chiffres sont des
**cibles documentaires** à re-vérifier à chaque checkpoint (`expo install`
fait foi) — **pas** une preuve d’exécution réussie.

| | SDK 54 (local) | SDK 55 | SDK 56 | SDK 57 |
|---|---|---|---|---|
| React | 19.1.0 | 19.2.0 | 19.2.3 | 19.2.3 |
| React Native | 0.81.5 | 0.83.10 | 0.85.3 | 0.86.3 |
| expo-router | ~6.0.24 | ~55.0.18 | ~56.2.21 | ~57.0.25 |
| react-native-maps | 1.20.1 | 1.27.2 | 1.27.2 | 1.27.2 |
| reanimated | ~4.1.1 | 4.2.1 | 4.3.1 | 4.5.1 |

Changelogs associés (consultation **2026-10-12**) :
https://expo.dev/changelog/sdk-55 ·
https://expo.dev/changelog/sdk-56 ·
https://expo.dev/changelog/sdk-57.