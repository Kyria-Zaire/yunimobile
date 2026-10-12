# Migration Expo SDK 55 → 56 (YUNIMOBILE-0011E-C)

- **Date** : 2026-10-12 (Europe/Paris)
- **Branche** : `feat/yunimobile-0011e-c-expo-sdk-56`
- **Base** : `9b9612801637cb0e06a2429aa9ae66b8cb6e8b1b`
- **Décision** : **terminé** — migration statique SDK 56 réussie ; exception Hermes V1 transitoire ; runtime/native non validés
- **Nature** : palier **intermédiaire** (pas la cible finale) ; SDK **57 non commencé**
- **Publication / release SDK 56** : **interdite**
- **Commit** : clôture `5d8aad2…` (amend sans Co-Authored-By) ; PR #8 ;
  correctif CodeRabbit (2 diagnostics) sur la même branche

## 1. Versions avant / après

| Paquet | Avant (SDK 55) | Après (SDK 56) | Alignement |
|---|---|---|---|
| expo | ~55.0.31 | ~56.0.23 | CLI / npm latest 56 |
| react / react-dom | 19.2.0 | 19.2.3 | = matrice officielle |
| react-native | 0.83.10 | 0.85.3 | = matrice |
| expo-router | ~55.0.18 | ~56.2.21 | = matrice |
| react-native-maps | 1.27.2 | 1.27.2 | inchangé (matrice) |
| @expo/metro-runtime | ~55.0.12 | ~56.0.21 | CLI |
| react-native-reanimated | ~4.2.1 | ~4.3.1 | = matrice |
| react-native-worklets | (transitif) | 0.8.3 | résolu |
| @expo/dom-webview | 55.0.6 (transitif) | ~56.0.6 | correction 1 |
| typescript | ^5.8.3 | ^6.0.3 | CLI (`expo install --fix`) |
| eslint-config-expo | ~55.0.1 | ~56.0.4 | CLI |

Matrice officielle consultée **2026-10-12** :
`bundledNativeModules` branche `sdk-56` + changelog SDK 56 + `pnpm view expo@56`
→ **aucune divergence** justifiant un arrêt avant installation.

## 2. Reconstruction planifiée `node_modules`

| Champ | Valeur |
|---|---|
| Source | `C:\Users\kyria\yunimobile\node_modules` (hoisted, ignoré Git) |
| Sauvegarde | `C:\tmp\yunimobile-0011e-c-node_modules-sdk55-backup` |
| Nested | `apps/mobile/node_modules` → `C:\tmp\yunimobile-0011e-c-mobile-node_modules-sdk55-backup` |
| Statut | **Conservée** jusqu’à revue CTO (ne pas supprimer) |
| Incident | `Move-Item` / premier `move` : accès refusé (verrous tsserver Cursor) ; succès après arrêt bref des helpers Cursor puis `cmd move` |

Cette reconstruction est l’**approche initiale autorisée**, hors compteur de tentatives.

## 3. Installation

Environnement : `CI=1`, `EXPO_NO_TELEMETRY=1`, registre pnpm `https://registry.npmjs.org/`.

| # | Commande | Exit | Note |
|---|---|---|---|
| — | Reconstruction `node_modules` | OK | planifiée |
| 1 | `pnpm --filter mobile add expo@^56.0.0` | 0 | → `~56.0.23` |
| 2 | `pnpm exec expo install --fix` | 0 | 20 packages + TS/eslint |
| 3 | `pnpm install --frozen-lockfile` | 0 | |
| C1 | `expo install @expo/dom-webview@~56.0.6` | 0 | **tentative correction 1/3** |
| — | `pnpm install --frozen-lockfile` | 0 | après C1 |

Pas de `npm install` / `--force` / `--legacy-peer-deps` / édition manuelle lockfile.
Lifecycle : scripts pnpm d’install des paquets (pas de scripts applicatifs Yunicity ajoutés).

`app.json` : plugins `expo-secure-store`, `expo-splash-screen`, `expo-status-bar` **ajoutés par le CLI** (pas de refactor fonctionnel).

## 4. Gates

| Gate | Exit | Note |
|---|---|---|
| frozen-lockfile | 0 | |
| résolution React/RN | OK | React **19.2.3** ×1 ; RN **0.85.3** ×1 ; pas de React 18 |
| typecheck | 0 | |
| typecheck sans `.expo` | 0 | inventaire fichiers SHA **identique** après restauration |
| lint app+components | **0** (après C2) | était **1** / 14 erreurs avant Option A ; désormais 0 erreur |
| `expo install --check` | 0 | |
| expo-doctor `1.20.4` | **1** | **21/22** ; seul **HermesV1VersionCheck** (exception Option A) |
| export Android | 0 | hors dépôt ; **1997** modules ; `C:\tmp\yunimobile-0011e-c-export-android` |
| artefacts suivis | OK | pas android/ios/dist/.expo suivis |
| Mapbox apps/mobile | aucun | |
| secrets / chemins perso dans diff | aucun | |
| `git diff --check` | 0 | |

### expo-doctor (pinné)

- Commande : `npm exec --yes --package=expo-doctor@1.20.4 -- expo-doctor`
- Cache dédié : `C:\tmp\yunimobile-0011e-c-doctor-cache`
- Registre : `https://registry.npmjs.org/expo-doctor/-/expo-doctor-1.20.4.tgz`
- Intégrité : `sha512-Jm1lIqVdO8br9wiqTg5QhJ1u4zLWAhoue4bXsEuzW543vC3XY+U0cpEOmiLkvJhTTgZgIK+24l4i8VzyZ2VLMg==`

Échec Hermes (non corrigé ici — **SDK 57 interdit**) :
> Hermes V1 250829098.0.10 affecté ; fix dans SDK 57 / expo@57.0.9+ / RN 0.86.2+.

## 5. Audit résultat

- Workspaces `@yunicity/*` uniquement ; override `postcss` **8.5.18** conservé ;
  `typeRoots` interne conservé.
- Pas de dépendance Git / registre tiers imprévu.
- Pas de Mapbox réintroduit ; pas de refactor fonctionnel opportuniste.
- **Hermes v1 + Reanimated** : régression mémoire **documentée** pour SDK 56 ;
  **non** qualifiée de corrigée (preuve : doctor 21/22).
- Lint : règle nouvelle vs SDK 55 — corrections Option A appliquées (tentative 2/3) ;
  pourquoi elles appartiennent à la compatibilité SDK 56 : `eslint-config-expo` 56
  tire `eslint-plugin-react-hooks@7` ; le même code passait sous SDK 55.

## 6. Décision : terminé (GO CTO clôture)

1. Tentatives **3/3** : (1) `@expo/dom-webview` ; (2) lint Option A ; (3)
   invariants D1–D15.
2. Vérification réseau (§ 14, hors compteur) : Doctor **21/22**, seul Hermes.
3. GO CTO : commit local checkpoint SDK 56 ; push **non** ; SDK 57 **non
   commencé** ; publication SDK 56 **interdite**.

Réussites : install SDK 56 ; corrections async ; lint ; typecheck (± `.expo`) ;
export ; check ; Doctor 21/22 (exception Hermes). Runtime / natif / Expo Go :
**non exécutés**.

### Rappels obligatoires

- SDK **56** = palier **intermédiaire**, pas la cible finale.
- **Interdiction** de publier / releaser SDK 56 comme cible.
- Runtime **non exécuté** ; build natif **non exécuté** ; Expo Go iPhone **non testé**.
- Aucun test comportemental mobile (aucune infra de tests créée dans ce ticket).
- SDK **57 requis immédiatement après fusion** du checkpoint 56 — **non commencé**.
- Sauvegarde `node_modules` SDK 55 **conservée**.

## 7. Fichiers touchés (non commités)

- `apps/mobile/package.json`, `apps/mobile/app.json`, `pnpm-lock.yaml`
- 13 fichiers app/components (corrections lint Option A) — liste ticket
- `.loop/tickets/YUNIMOBILE-0011E-C.md`, `.loop/state.md`, ce rapport

## 8. Espace disque

Mesure après gates Option A : **≈ 15,63 Gio** libres (seuil 12 Gio respecté).

## 9. Git

- Index **vide** ; **aucun** commit / push.

## 10. Diagnostic CTO des gates bloqués (2026-10-12 16:52)

Nature : **diagnostic uniquement** — aucune modification applicative ;
aucune réinstall ; aucun export ; sauvegarde SDK 55 intacte ; compteur
corrections **inchangé** (1/3 = `@expo/dom-webview`).

Commande lint (sans `--fix`, sans cache ESLint projet forcé) :

```text
pnpm exec eslint app components --format json
→ C:\tmp\yunimobile-0011e-c\lint-diag.json
eslint-plugin-react-hooks@7.1.1 (via eslint-config-expo ~56.0.4)
```

Total : **14 erreurs** (pas 14× la même règle) :
- **13×** `react-hooks/set-state-in-effect`
- **1×** `react-hooks/preserve-manual-memoization`

### 10.1 Tableau lint — groupe A (13× fetch au montage)

**Cause racine unique** : `useEffect(() => { void load…(); }, [load…])` où
`load` / `loadAll` est un `useCallback` async qui appelle `setState`
(`setItems` / `setEvents` / `setLoading` / `setError` / etc.) après un appel API.
Le linter remonte la ligne du **`void load()`** dans l’effet (pas la ligne du
`setX` interne).

| Fichier | Ligne | Composant | Effet | États touchés (via load*) | Déps effet | Raison | UX | Sous SDK 55 ? | Correction | Risque | Test |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `app/(protected)/(tabs)/events/index.tsx` | 63 | `EventsTabScreen` | `[load]` → `load()` | `events`, `error`, `loading` | `[load]` | fetch liste événements | onglet Moments | code **oui** / erreur lint **non** (lint 55 passait) | locale (pattern fetch) | moyen (chargement initial / refresh) | **aucun** |
| `app/(protected)/(tabs)/neighborhoods/index.tsx` | 81 | neighborhoods tab | `[load]` | `items`, `error`, `loading` | `[load]` | fetch quartiers | onglet Quartiers | idem | locale | moyen | aucun |
| `app/(protected)/(tabs)/profile.tsx` | 56 | profile tab | `[load]` | `profile`, champs formulaire, `error`, `isLoading` | `[load]` | fetch profil | onglet Profil | idem | locale | moyen | aucun |
| `app/(protected)/(tabs)/tribes/index.tsx` | 128 | tribes tab | `[load]` | listes tribus / loading / error | `[load]` | fetch tribus | onglet Tribus | idem | locale | moyen | aucun |
| `app/(protected)/events/[id].tsx` | 40 | event detail | `[load]` | `event`, `loading` | `[load]` | fetch détail | fiche événement | idem | locale | moyen | aucun |
| `app/(protected)/neighborhoods/[slug].tsx` | 49 | neighborhood detail | `[load]` | détail quartier | `[load]` | fetch détail | fiche quartier | idem | locale | moyen | aucun |
| `app/(protected)/notifications/index.tsx` | 72 | notifications | `[load]` | inbox | `[load]` | fetch notifs | boîte notifs | idem | locale | moyen | aucun |
| `app/(protected)/partner-offers/[id].tsx` | 67 | offer detail | `[load]` | offre | `[load]` | fetch offre | fiche offre | idem | locale | moyen | aucun |
| `app/(protected)/partner-offers/index.tsx` | 67 | offers list | `[load]` | liste offres | `[load]` | fetch offres | liste offres | idem | locale | moyen | aucun |
| `app/(protected)/partner-scan/offers.tsx` | 53 | partner scan offers | `[load]` | offres scan | `[load]` | fetch offres scan | flux partenaire | idem | locale | moyen | aucun |
| `app/(protected)/passport/present.tsx` | 40 | present passport | `[load]` | `qrPayload`, `passportNumber`, `error`, `isLoading` | `[load]` | fetch QR | présenter Passport | idem | locale | élevé (QR) | aucun |
| `app/(protected)/tribes/[slug].tsx` | 201 | tribe detail | `[loadAll]` | tribe + wall + members + `loading` | `[loadAll]` | fetch agrégé | fiche tribu | idem | locale (plus large) | élevé | aucun |
| `components/tribes/tribe-invitations-section.tsx` | 35 | `TribeInvitationsSectionMobile` | `[load]` | `items`, `loading` | `[load]` | fetch invitations | section invitations | idem | locale | moyen | aucun |

« Sous SDK 55 » : le **code** était déjà présent ; la **règle** n’échouait pas
sous `eslint-config-expo` ~55 (preuve : gate lint 0011E-B exit 0). Aucun test
automatisé sous `apps/mobile`.

### 10.2 Tableau lint — groupe B (1× memoization)

| Fichier | Ligne | Élément | Règle | Constat |
|---|---|---|---|---|
| `events/index.tsx` | 48 | `const load = useCallback(async () => {…}, [api.events, user?.city])` | `react-hooks/preserve-manual-memoization` | Le compilateur/plugin estime que la mémo manuelle de `load` ne peut pas être préservée telle quelle (souvent lié aux mêmes deps / setState dans le callback). |

### 10.3 Corrections possibles (non implémentées)

**Groupe A — 5 options demandées :**

1. **État dérivé au rendu** : **non applicable** pour données réseau (pas dérivables
   du rendu seul).
2. **Initialisation paresseuse `useState`** : **non** — ne remplace pas un fetch
   async ni le rechargement sur changement de deps (`id`, `city`, etc.).
3. **Événement utilisateur** : **partiel** — `onRefresh` / retry existent déjà ;
   le chargement **initial** à l’ouverture d’écran resterait à couvrir autrement.
4. **Sync source externe justifiée** : **oui** — l’API FastAPI est une source
   externe ; le pattern « fetch au montage » reste un usage légitime d’effet
   (synchronisation), mais `eslint-plugin-react-hooks@7` le signale via la chaîne
   `effect → load → setState`. Pistes locales : couche data (query), loaders
   expo-router, ou restructuration pour satisfaire le linter **sans** masquer.
5. **Architecture plus large** : **possible** — hook data partagé / React Query /
   loaders ; touchant plusieurs écrans ; hors correction ponctuelle.

**Interdit dans toute correction future (rappel CTO)** : disable global, changement
de sévérité, masquage, `setTimeout`, suppression d’effet sans compréhension,
`eslint-disable` sans justification + autorisation.

**Groupe B** : ajuster ou retirer le `useCallback` de `load` une fois le flux de
fetch clarifié (souvent résolu avec le même chantier que A).

### 10.4 Diagnostic Hermes V1 (preuve)

**Check** : `HermesV1VersionCheck` — description exacte :
`Check for Expo SDK versions affected by Hermes V1 regressions`

**Sortie doctor (journal `expo-doctor-after-dom.log`, non sensible)** :

```text
✖ Check for Expo SDK versions affected by Hermes V1 regressions
This project uses Hermes V1 with expo@56.0.23, which is affected by a known memory regression.
Detected Hermes V1 250829098.0.10 from React Native. Hermes V1 250829098.0.15 and earlier are affected by this regression; 250829098.0.16 is the first version that contains the fix.
Advice:
Upgrade to Expo SDK 57 and expo@57.0.9 or later by running `npx expo install expo@^57.0.9 --fix`. See https://expo.dev/changelog/sdk-57#known-regressions for the latest details.
Upgrade to React Native 0.86.2 or later, which includes the fixed Hermes version. For Expo projects, install Expo SDK 57 with expo@57.0.9 or later and run `npx expo install --fix` to align React Native and other dependencies.
```

**Paquet / version responsable (constat local)** :

- `expo@56.0.23` (majeur 56 → check `k` vrai pour 55/56/57&lt;57.0.9)
- Hermes V1 embarqué via React Native :
  - `node_modules/react-native/package.json` → `"hermes-compiler": "250829098.0.10"`
  - `node_modules/react-native/sdks/hermes-engine/version.properties` →
    `HERMES_V1_VERSION_NAME=250829098.0.10`
- Projet utilise aussi `react-native-reanimated` / `react-native-worklets` (cible
  typique de la régression mémoire citée par Expo).

**Pourquoi SDK 56 est concerné (outil)** — extrait de
`expo-doctor@1.20.4` `build/index.js`, classe `HermesV1VersionCheck` :

- `sdkVersionRange = ">=55.0.0 <58.0.0"`
- seuils : `D="57.0.9"`, `S="250829098.0.15"`, `x="250829098.0.16"`
- échec si Hermes V1 actif **et** (`expo` majeur 55/56, ou 57 &lt; 57.0.9)
- **et/ou** version Hermes `250829098.*` ≤ `250829098.0.15`

**Pourquoi SDK 57 est le correctif (source officielle)** —
https://expo.dev/changelog/sdk-57 § « Known regressions » (consulté 2026-10-12) :

- régression mémoire Hermes V1 héritée de SDK 56, liée à worklets/reanimated
  (`expo/expo#46519`) ;
- résolue dans `expo@57.0.9` (RN → 0.86.2) ; startup dev dans `expo@57.0.17`
  (RN 0.86.3).

**Classification** :

| Lecture | Verdict |
|---|---|
| Faux positif doctor | **Non** — check + versions locales + changelog officiels cohérents |
| Incompatibilité build/typecheck | **Non démontrée** ici (typecheck + export Android OK) |
| Avertissement de palier / risque runtime mémoire | **Oui** — régression **réelle documentée** ; impact runtime **non mesuré** dans ce ticket (runtime non exécuté) |

### 10.5 Exception SDK 56 — options (non exécutées)

**Option A** — corriger les 14 erreurs lint ; accepter **uniquement** l’échec
Hermes officiellement démontré ; committer SDK 56 sur une PR fusionnable comme
palier transitoire documenté.

**Option B** — corriger le lint ; commit **local** de checkpoint SDK 56 ;
**ne pas** fusionner dans `main` ; poursuivre SDK 57 sur branche dérivée après
autorisation CTO.

| Critère | Option A | Option B |
|---|---|---|
| Traçabilité | PR/merge visible sur `main` | Historique local / branche feature seulement jusqu’à 57 |
| Rollback | revert merge sur `main` | abandonner branche ; `main` reste SDK 55 |
| État de `main` | SDK 56 + dette Hermes connue | reste SDK 55 (plus sûr pour consommateurs) |
| Complexité Git | simple (1 PR) | 2 étapes (checkpoint local + PR 57) ; rebase/dérivation |
| Doctrine un palier/PR | respectée (PR 56) avec dette Hermes explicite | palier 56 **non** publié ; s’écarte de « chaque palier = PR » sauf checkpoint local assumé |

### 10.6 Vérifications diagnostic

- `git status` applicatif inchangé (`package.json` / `app.json` / lockfile) ;
- index vide ;
- sauvegarde `C:\tmp\yunimobile-0011e-c-node_modules-sdk55-backup` **True** ;
- espace libre ≈ **16,06 Gio** ;
- tentatives correction toujours **1/3** ;
- ticket **BLOCKED** conservé ; SDK 57 **non commencé**.

## 11. Option A — corrections lint (tentative 2/3) — 2026-10-12 18:20

Décision CTO : Option A. Ticket **BLOCKED** pendant les corrections ; statut
final **à revoir** / **CONDITIONAL READY**.

### 11.1 Pourquoi ces corrections sont de la compatibilité SDK 56

Sous SDK 55, `eslint-config-expo` ~55 ne faisait pas échouer ces patterns
(gate lint 0011E-B exit 0). SDK 56 tire `eslint-plugin-react-hooks@7.1.1` via
`eslint-config-expo` ~56.0.4 : les 14 diagnostics bloquent le palier 56 sans
changement fonctionnel volontaire. Les corriger est donc un prérequis de
compatibilité du checkpoint 56, pas un chantier produit séparé.

### 11.2 Approche commune

- Isoler la requête distante (`fetch*`) de la mutation d’état.
- Aucun `setLoading` / `setError` / `setItems` synchrone au début de `useEffect`.
- Appliquer le résultat **après** résolution async.
- `loading` initial via `useState(true)` (ou `Boolean(id/slug/qr)` si param requis).
- Refresh / retry : transitions UI dans les handlers dédiés.
- `requestIdRef` (+ `cancelled` dans l’effet) pour anti-race / anti-unmount.
- Erreurs conservées visibles.
- Interdits respectés : pas d’`eslint-disable`, pas de baisse de sévérité, pas de
  `setTimeout` artificiel, pas de React Query/SWR, pas de refactor data global.

### 11.3 Liste des 14 corrections

| # | Fichier | Avant | Après | Règle | Comportements préservés | Gardes |
|---|---|---|---|---|---|---|
| 1 | `events/index.tsx` | `load` useCallback + setState sync + effet `void load()` ; deps memo incomplètes selon plugin | `fetchEvents` pur ; effet async ; `onRefresh`/`onRetry` ; deps `[api.events, user?.city]` | set-state + preserve-manual-memoization | initial / refresh / retry / erreur | requestId + cancelled |
| 2 | `neighborhoods/index.tsx` | idem pattern `load` | `fetchNeighborhoods` + effet / refresh / retry | set-state-in-effect | idem | requestId + cancelled |
| 3 | `profile.tsx` | `load` setIsLoading sync | `fetchProfile` + effet seul (pas de retry UI existant) | set-state-in-effect | chargement initial / erreur | requestId + cancelled |
| 4 | `tribes/index.tsx` | `loadPage` setLoading/setError sync | `fetchTribesPage` ; effet page 1 ; refresh/more/retry/join | set-state-in-effect | pagination / refresh / join | requestId |
| 5 | `events/[id].tsx` | `load` setLoading sync | `fetchEvent` + effet ; loading init `Boolean(id)` | set-state-in-effect | détail / loading / absent | requestId + cancelled |
| 6 | `neighborhoods/[slug].tsx` | `load` setError sync | `fetchContext` + effet / retry | set-state-in-effect | détail / retry / erreur | requestId + cancelled |
| 7 | `notifications/index.tsx` | `load` setError sync | `fetchInbox` + effet / refresh / retry | set-state-in-effect | inbox / refresh / retry | requestId + cancelled |
| 8 | `partner-offers/[id].tsx` | `load` setLoading sync | `fetchOffer` + effet | set-state-in-effect | détail offre | requestId + cancelled |
| 9 | `partner-offers/index.tsx` | `load` setIsLoading sync | `fetchOffersHub` + effet | set-state-in-effect | hub orgs+offres | requestId + cancelled |
| 10 | `partner-scan/offers.tsx` | `load` setError sync si QR manquant | erreur initiale `useState` ; fetch si QR présent | set-state-in-effect | scan / erreur QR | requestId + cancelled |
| 11 | `passport/present.tsx` | `load` setIsLoading sync | `fetchPassportQr` + effet | set-state-in-effect | QR / erreur | requestId + cancelled |
| 12 | `tribes/[slug].tsx` | `loadAll` → setError sync via `loadTribe` | `fetchTribe`/`fetchWall`/`fetchMembers` ; effet ; `applyAll` refresh/retry/actions | set-state-in-effect | tribe+wall+members / refresh / join-leave / modération | requestId + cancelled |
| 13 | `tribe-invitations-section.tsx` | `load` setLoading sync | `fetchInvitations` + effet ; decline recharge via apply | set-state-in-effect | liste / decline | requestId + cancelled |
| 14 | `events/index.tsx` (memo) | `useCallback(load)` signalé | identité memo remplacée par `fetchEvents` aux deps réelles lues | preserve-manual-memoization | pas de boucle d’effet observée en relecture | — |

Limite : **aucun test runtime mobile** — preuves = typecheck, lint, export,
relecture structurée uniquement.

### 11.4 Gates rejoués (sans réinstall)

| Gate | Exit | Preuve |
|---|---|---|
| lint | 0 | `pnpm --filter mobile lint` |
| typecheck | 0 | `pnpm --filter mobile typecheck` |
| typecheck sans `.expo` | 0 | move staging ; 5 fichiers ; MISMATCH=0 |
| expo install --check | 0 | Dependencies are up to date |
| expo-doctor 1.20.4 | 1 | 21/22 ; seul Hermes (sortie § 11.5) |
| export Android | 0 | 1997 modules ; `C:\tmp\yunimobile-0011e-c-export-android` |
| Mapbox | OK | aucune référence |
| secrets | OK | scan diff : noms `qrSecret` seulement |
| artefacts suivis | OK | |
| `git diff --check` | 0 | |

### 11.5 Sortie Doctor brute (après C2)

```text
Running 22 checks on your project...
21/22 checks passed. 1 checks failed. Possible issues detected:
Use the --verbose flag to see more details about passed checks.

✖ Check for Expo SDK versions affected by Hermes V1 regressions
This project uses Hermes V1 with expo@56.0.23, which is affected by a known memory regression.
Detected Hermes V1 250829098.0.10 from React Native. Hermes V1 250829098.0.15 and earlier are affected by this regression; 250829098.0.16 is the first version that contains the fix.
Advice:
Upgrade to Expo SDK 57 and expo@57.0.9 or later by running `npx expo install expo@^57.0.9 --fix`. See https://expo.dev/changelog/sdk-57#known-regressions for the latest details.
Upgrade to React Native 0.86.2 or later, which includes the fixed Hermes version. For Expo projects, install Expo SDK 57 with expo@57.0.9 or later and run `npx expo install --fix` to align React Native and other dependencies.

1 check failed, indicating possible issues with the project.
```

### 11.6 Compteur / sauvegarde / espace / Git

- Tentatives : **2/3** (1 = dom-webview ; 2 = lint Option A).
- Sauvegarde SDK 55 : **présente** (`C:\tmp\yunimobile-0011e-c-node_modules-sdk55-backup`).
- Espace libre : **≈ 15,63 Gio**.
- Index **vide** ; aucun commit / push ; SDK 57 **non commencé**.

## 12. Revue sémantique finale (2026-10-12 18:35) — lecture seule

Nature : **revue uniquement** ; aucun fichier applicatif modifié ; **ne compte
pas** comme tentative ; gates lourds **non relancés** ; `git diff --check` OK.

### 12.1 Invariants (oui/non) — synthèse 13 fichiers

Légende : **O** = démontré ; **N** = défaut ; **≈** = OK sur chemin effet mais
pas sur handlers / équivalent ancien seulement.

| # | Invariant | events | hoods | profile | tribes | evt/[id] | hood/[slug] | notif | po/[id] | po/index | scan | passport | tribe/[slug] | invit |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | pas de réponse périmée → état | O | O | O | O* | O | O | O | O | O | O | O | O† | O |
| 2 | pas d’update après unmount | ≈ | ≈ | O | ≈ | O | ≈ | ≈ | O | O | O | O | ≈ | ≈ |
| 3 | loading jamais bloqué | **N** | **N** | O | **N** | ≈ | **N** | **N** | ≈ | O | ≈ | O | **N** | O |
| 4 | refreshing jamais bloqué | **N** | **N** | n/a | **N** | n/a | n/a | **N** | n/a | n/a | n/a | n/a | **N** | n/a |
| 5 | refresh erreur ≠ wipe data | ≈ | ≈ | n/a | ≈ | n/a | ≈ | ≈ | n/a | n/a | n/a | n/a | **N** | n/a |
| 6 | changement id/slug recharge | O | O | n/a | O | **N**‡ | **N**‡ | n/a | **N**‡ | n/a | **N**‡ | n/a | **N**‡ | n/a |
| 7 | retry = params courants | O | O | n/a | O | n/a | O | O | n/a | n/a | n/a | n/a | O | n/a |
| 8 | erreurs non avalées | O | O | O | O | ≈§ | O | O | O | O | O | O | ≈‖ | ≈¶ |
| 9 | pas de boucle | O | O | O | O | O | O | O | O | O | O | O | O | O |
| 10 | UX ≡ ancien | ≈ | ≈ | O | ≈ | **N** | **N** | ≈ | **N** | O | **N** | O | **N** | ≈ |

\* tribes `loadMore` partage le même compteur : OK anti-stale data, mais casse 4.
† `applyAll` finally `setWallLoading(false)` **sans** garde requestId (L208–211).
‡ recharge réseau oui, mais **sans** `setLoading(true)` → UI stale (vs ancien).
§ `events/[id]` : pas de `catch` message (≡ ancien).
‖ wall/members : `catch → []` (≡ ancien).
¶ invitations : `catch → []` (≡ ancien silence liste vide).

### 12.2 Tableaux de flux (par fichier)

Colonnes : I=initial, P=params, R=refresh, T=retry, V=vide, E=erreur, C=concurrent,
U=unmount, S=stale, L=reset loading/refresh success|error|stale.

| Fichier | I | P | R | T | V | E | C | U | S | L |
|---|---|---|---|---|---|---|---|---|---|---|
| events/index | OK | OK (city via fetch) | OK data | OK | OK | OK | **refresh/retry se volent le compteur** | effet OK ; handlers **sans cancelled** | data OK | **refreshing/loading peuvent rester true** si id bumpé |
| neighborhoods/index | OK | OK | OK data | OK | OK | OK | idem | idem | OK | idem |
| profile | OK | n/a | n/a | n/a | n/a | OK | effet seul | OK (effet) | OK | OK |
| tribes/index | OK | OK | OK data | OK | OK | OK | **refresh vs loadMore/join** | handlers sans cancelled | OK data | **refreshing/loadingMore bloquables** |
| events/[id] | OK | **pas setLoading(true)** | n/a | n/a | OK (null) | ≈ silencieux | OK effet | OK effet | OK | loading clear si requête courante |
| neighborhoods/[slug] | OK | **pas setLoading(true)** | n/a | OK | OK | OK | retry vs effet | handlers sans cancelled | OK | retry loading OK sauf race |
| notifications | OK | n/a | OK data | OK | OK | OK | refresh/retry | handlers sans cancelled | OK | **refreshing/loading bloquables** |
| partner-offers/[id] | OK | **pas setLoading(true)** | n/a | n/a | OK | OK | OK effet | OK effet | OK | OK effet |
| partner-offers/index | OK | n/a | n/a | n/a | OK | OK | OK effet | OK effet | OK | OK |
| partner-scan/offers | OK / err QR init | **pas setLoading(true)** | n/a | n/a | OK | OK | OK effet | OK effet | OK | OK effet |
| passport/present | OK | n/a | n/a | n/a | n/a | OK | OK | OK | OK | OK |
| tribes/[slug] | OK | **pas setLoading(true)** | **catch → setTribe(null)** | OK | OK | OK | refresh vs reloadAfterAction | handlers sans cancelled ; wallLoading finally **sans** id | data OK | **refreshing/loading/wallLoading** risques |
| tribe-invitations | OK | n/a | n/a (decline) | n/a | null UI | silencieux [] | decline vs effet | decline sans cancelled | OK | loading OK effet |

### 12.3 Défauts exacts (bloqueurs commit)

| ID | Fichier | Lignes | Scénario | Invariant |
|---|---|---|---|---|
| D1 | `events/index.tsx` | 90–112 | `onRetry` (`loading=true`) puis `onRefresh` (bump id) → finally retry ne clear pas → **spinner permanent** | 3 |
| D2 | `events/index.tsx` | 90–99 | `onRefresh` puis effet (changement `user?.city`) ou second bump → **`refreshing` reste true** | 4 |
| D3 | `neighborhoods/index.tsx` | 111–133 | même pattern retry/refresh/effet | 3, 4 |
| D4 | `notifications/index.tsx` | 105–127 | même pattern | 3, 4 |
| D5 | `tribes/index.tsx` | 154–176 | refresh puis `loadMore` / `confirmJoin` bump id → **`refreshing` coincé** ; symétrique `loadingMore` | 4 |
| D6 | `tribes/index.tsx` | 179–189 | retry puis autre bump → **`loading` coincé** | 3 |
| D7 | `tribes/[slug].tsx` | 271–279 + 296–298 | refresh puis `reloadAfterAction` (join/leave/mod) → **`refreshing` coincé** | 4 |
| D8 | `tribes/[slug].tsx` | 214–218 | erreur réseau pendant refresh → **`setTribe(null)`** (ancien `loadTribe` ne clearait pas) | 5, 10 |
| D9 | `tribes/[slug].tsx` | 208–211 | `applyAll` finally `setWallLoading(false)` **sans** `requestId` → stale clear le flag d’une requête plus récente | 1 (flag), 3-ish |
| D10 | `events/[id].tsx` | 35–53 | changement `id` : effet refetch **sans** `setLoading(true)` (HEAD avait L31 `setLoading(true)`) → **ancien événement affiché** | 6, 10 |
| D11 | `neighborhoods/[slug].tsx` | 56–78 | changement `slug`/`city` sans `setLoading(true)` | 6, 10 |
| D12 | `partner-offers/[id].tsx` | 50–81 | changement `id` sans `setLoading(true)` | 6, 10 |
| D13 | `partner-scan/offers.tsx` | 39–66 | changement `qrSecret` sans `setIsLoading(true)` | 6, 10 |
| D14 | `tribes/[slug].tsx` | 224–269 | changement `slug`/`city` sans `setLoading(true)` | 6, 10 |
| D15 | handlers refresh/retry/apply (plusieurs) | — | unmount : cleanup ne bump **pas** `requestId` ; handlers n’ont pas `cancelled` → **setState après unmount** possible | 2 |

Cause structurelle commune D1–D7 : **un seul** `requestIdRef` pour toutes les
intentions (effet, refresh, retry, loadMore, actions) + clear de
`loading`/`refreshing` **uniquement** si `requestId === current` → une requête
plus récente « vole » le droit de clear sans reprendre le flag UI.

### 12.4 requestIdRef / cancelled

| Question | Constat |
|---|---|
| Incrément avant fetch ? | **Oui** sur effet et handlers qui fetch |
| success/catch/finally même id ? | **Oui** pour data ; **non** pour `wallLoading` finally de `applyAll` (D9) |
| cleanup invalide tout ? | **Non** — `cancelled=true` seulement ; **pas** de bump id → handlers hors effet non couverts (D15) |
| refresh avant unmount protégé ? | **Non** (D15) |
| `cancelled` scoped à son effet ? | **Oui** |
| stale peut laisser loading/refreshing true ? | **Oui** (D1–D7) |
| deux refresh rapides déterministes ? | **Data** : dernier gagne. **Flags** : OK si seul refresh ; KO si autre intention interleave |

Présence de `requestIdRef` ≠ preuve : utilisation incomplète sur flags UI et unmount.

### 12.5 Mémorisation `events/index.tsx`

| | Avant (HEAD lint) | Après |
|---|---|---|
| Callback | `load = useCallback(async () => { setError; fetch; setState }, [api.events, user?.city])` | `fetchEvents` purs deps `[api.events, user?.city]` ; `applyEventsResult` deps `[fetchEvents]` |
| Effet | `[load]` → `void load()` | `[fetchEvents]` → async IIFE |
| Handlers | `onRefresh`/`retry` appelaient `load` | `onRefresh`/`onRetry` → `applyEventsResult(requestId)` ; pas de useCallback handlers |
| Fermeture périmée | risque setState via load partagé | `fetchEvents` suit city ; requestId anti-stale data |
| Boucle | non (load stable si deps stables) | non (fetchEvents stable si deps stables) |
| Déclenchement requêtes | mount + change city + refresh/retry | **mêmes déclencheurs** ; pas de requête en plus |

### 12.6 Ampleur du diff (+665 / −252, 13 fichiers)

| Classe | Estimation | Notes |
|---|---|---|
| Logique conformité | ~35 % | fetch isolé, requestId, cancelled, finally gardés |
| Duplication | ~45 % | corps effet ≈ copie de `apply*` dans presque chaque fichier ; candidats factorisation **locale** (helper interne par fichier) **sans** couche data transversale |
| Commentaires/docs | ~0 % | dans ces 13 fichiers |
| Reformatage | ~5 % | imports `useRef`, indent |
| Code défensif | ~10 % | double check cancelled \|\| requestId |
| Changement comportement | défauts D8, D10–D14 | non « nécessaires » à la conformité lint |

Duplication réductible localement : unifier effet + `apply*` via une seule
fonction async paramétrée `(signal: { requestId, cancelled? })` **par fichier**.
Refactor transversal (hook partagé) **hors** scope tentative 3 si on reste minimal.

### 12.7 Signaux dangereux (lecture seule, 13 fichiers)

| Signal | Résultat |
|---|---|
| `catch {}` vide | **aucun** dans les loaders |
| promesse sans catch | `void (async …)` effets : catch internes OK ; `confirmJoin` / actions tribe : `.catch` Alert ou chaînes existantes |
| eslint-disable / ts-ignore | **aucun** |
| `any` ajouté | **aucun** |
| setTimeout / Promise artificielle | **aucun** |
| setState sync avant 1er await dans chemin effet | **aucun** (conformité lint) |
| deps hook manquantes évidentes | `fetch*`/`apply*` cohérents ; handlers non mémorisés (OK) |
| finally setState sans garde requête | **D9** `setWallLoading(false)` ; sinon loading/refreshing gardés (mais garde trop stricte → D1–D7) |
| `catch { /* best effort */ }` | `notifications` handlePress — **préexistant**, hors loader |

### 12.8 Décision revue

- **NO-GO commit.**
- Ticket **BLOCKED**.
- **CONDITIONAL READY retiré** jusqu’à tentative **3/3**.
- Exception Hermes **toujours acceptée** (bornée).
- Aucun fichier applicatif modifié ; compteur **2/3** inchangé.
- Gates déjà valides **non relancés**.
- Index vide ; sauvegarde SDK 55 **True** ; SDK 57 **non commencé**.
- Espace libre revue : **≈ 15,53 Gio**.

## 13. Tentative 3/3 — corrections D1–D15 (2026-10-12 19:45)

### 13.1 Architecture appliquée

| Responsabilité | Mécanisme |
|---|---|
| Fraîcheur des données | `dataGenRef` (incrémenté avant chaque fetch qui écrit des données) |
| Flag refresh | `refreshGenRef` — seul le refresh courant libère `refreshing` |
| Flag loadMore | `loadMoreGenRef` — indépendant du refresh |
| Unmount | `mountedRef` + invalidation des gén. dans le cleanup (sans setState sync) |
| Changement id/slug/QR/city | état `resource` avec `key` ; au rendu `loading = resource?.key !== requestedKey` |

Priorité données : **dernier `dataGen` gagne**. Un loadMore ne libère jamais
`refreshing` ; un refresh ne libère jamais `loadingMore`.

### 13.2 Corrections par défaut

| ID | Correction |
|---|---|
| D1–D7 | Intentions UI séparées ; finally propres |
| D8 | `loadBundle`/`refresh` : erreur → conserve `tribe` (`setTribe(null)` seulement en initial/retry) |
| D9 | `wallGenRef` + `mountedRef` autour de `wallLoading` |
| D10–D14 | ressource par clé ; loading dérivé au rendu |
| D15 | `mountedRef` avant tout setState post-await ; invalidation gén. au cleanup |

Fichiers : les 13 écrans/composants listés § 11.3.

### 13.3 Scénarios (relecture déterministe)

Applicable = A ; n/a = —.

| Fichier | 1 mount OK | 2 mount err | 3 A→B stale A | 4 refresh OK | 5 refresh err+data | 6 2× refresh | 7 more→refresh | 8 refresh→more | 9 unmount | 10 retry |
|---|---|---|---|---|---|---|---|---|---|---|
| events | A | A | A (city) | A | A (error UI, items conservés en state si key match) | A | — | — | A | A |
| neighborhoods | A | A | A | A | A | A | — | — | A | A |
| profile | A | A | — | — | — | — | — | — | A | — |
| tribes index | A | A | A | A | A | A | A | A | A | A |
| events/[id] | A | A | A | — | — | — | — | — | A | — |
| hood/[slug] | A | A | A | — | — | — | — | — | A | A |
| notifications | A | A | — | A | A | A | — | — | A | A |
| po/[id] | A | A | A | — | — | — | — | — | A | — |
| po/index | A | A | — | — | — | — | — | — | A | — |
| scan | A | A | A | — | — | — | — | — | A | — |
| passport | A | A | — | — | — | — | — | — | A | — |
| tribe/[slug] | A | A | A | A | A (tribe conservé) | A | — | — | A | A |
| invitations | A | A (→[]) | — | — | — | — | — | — | A | — |

Limite : **aucun test runtime** — relecture structurelle seulement.

### 13.4 Gates après 3/3

| Gate | Exit | Note |
|---|---|---|
| lint | **0** | |
| typecheck | **0** | |
| typecheck sans `.expo` | **0** | 5 fichiers ; MISMATCH=0 |
| expo install --check | **0** | |
| expo-doctor 1.20.4 | **1** | **20/22** ×2 — Hermes + **schema réseau** |
| export Android | **0** | hors dépôt |
| Mapbox / diff --check | OK | |
| secrets / artefacts | OK | |

### 13.5 Doctor brut (tentative 3 — 2ᵉ run)

```text
Running 22 checks on your project...
Unexpected error while running 'Check Expo config (app.json/ app.config.js) schema' check:
TypeError: fetch failed
Error: read ECONNRESET
This check requires a connection to the Expo API. Ensure your network connection is stable.
20/22 checks passed. 2 checks failed.

✖ Check Expo config (app.json/ app.config.js) schema
✖ Check for Expo SDK versions affected by Hermes V1 regressions
… expo@56.0.23 … Hermes V1 250829098.0.10 …
```

Classification schéma : **échec infrastructure réseau** (pas une divergence
`app.json` prouvée). Hermes : exception bornée toujours valide. Protocole ticket :
second check en échec → **BLOCKED**, pas de 4ᵉ correction.

### 13.6 Décision 3/3

- Ticket **BLOCKED**.
- **Pas** de CONDITIONAL READY.
- Index **vide** ; aucun commit/push.
- Tentatives **3/3** épuisées.
- Sauvegarde SDK 55 **conservée**.
- SDK 57 **non commencé**.
- Espace ≈ **15,38 Gio**.

Options CTO (hors correctif code) — **obsolètes** : voir § 14 (réseau OK).

## 14. Vérification réseau finale (2026-10-12 19:55) — hors tentative

Nature : **aucune** modification code/config/deps ; **une** relance Doctor ;
mise à jour documentaire uniquement (pas une tentative de correction).

### 14.1 Préconditions

| Contrôle | Résultat |
|---|---|
| Index Git | **vide** |
| Diff applicatif | inchangé depuis tentative 3 (empreintes SHA-256 échantillon identiques avant/après) |
| Sauvegarde SDK 55 | **présente** |
| Installation / `--fix` | **non** lancés |

### 14.2 Commande

```text
CI=1 EXPO_NO_TELEMETRY=1 npm_config_cache=C:\tmp\yunimobile-0011e-c-doctor-cache
npm exec --yes --package=expo-doctor@1.20.4 -- expo-doctor
```

- Début : **2026-10-12 19:55:03 +02:00**
- Fin : **2026-10-12 19:55:38 +02:00**
- Exit : **1**
- Artefact pin : `expo-doctor@1.20.4` (intégrité documentée § 4 :
  `sha512-Jm1lIqVdO8br9wiqTg5QhJ1u4zLWAhoue4bXsEuzW543vC3XY+U0cpEOmiLkvJhTTgZgIK+24l4i8VzyZ2VLMg==`)

### 14.3 Sortie brute

```text
Running 22 checks on your project...
21/22 checks passed. 1 checks failed. Possible issues detected:
Use the --verbose flag to see more details about passed checks.

✖ Check for Expo SDK versions affected by Hermes V1 regressions
This project uses Hermes V1 with expo@56.0.23, which is affected by a known memory regression.
Detected Hermes V1 250829098.0.10 from React Native. Hermes V1 250829098.0.15 and earlier are affected by this regression; 250829098.0.16 is the first version that contains the fix.
Advice:
Upgrade to Expo SDK 57 and expo@57.0.9 or later by running `npx expo install expo@^57.0.9 --fix`. See https://expo.dev/changelog/sdk-57#known-regressions for the latest details.
Upgrade to React Native 0.86.2 or later, which includes the fixed Hermes version. For Expo projects, install Expo SDK 57 with expo@57.0.9 or later and run `npx expo install --fix` to align React Native and other dependencies.

1 check failed, indicating possible issues with the project.
```

### 14.4 Checks échoués

| Check | Statut |
|---|---|
| `HermesV1VersionCheck` | **seul** échec (exception SDK 56 acceptée) |
| Check Expo config schema | **passé** (plus d’ECONNRESET) |

### 14.5 Décision

- Statut : **à revoir — CONDITIONAL READY**
- Exception Hermes **maintenue**
- **Recommandation** : commit checkpoint SDK 56 (PR indépendante)
- Index vide ; aucun fichier applicatif modifié pendant la vérif
- `git diff --check` : **0**
- SDK 57 **non commencé** ; pas de push/rollback ici

## 15. Publication PR #8 et correctif CodeRabbit (2026-10-12)

### 15.1 Écart de SHA clôture

| | Ancien | Publié |
|---|---|---|
| Commit | `7791b1ffd27b2ff66e062eb2d38e2c629ba3f9d5` | `5d8aad24373ff674611162a1a02dbc90417ca30e` |
| Tree | `ee078898bed0a00f4804d4e10ac1d671a6b34bdd` | **identique** |
| Parent | `9b961280…` | **identique** |
| Message | + `Co-authored-by: Cursor <…>` | sans Co-Authored-By |
| Diff `7791b1f..5d8aad2` | **vide** | |

Cause : **amend** local pour retirer la ligne Co-Authored-By injectée par les
hooks ; aucun changement de contenu applicatif.

### 15.2 Diagnostics CodeRabbit

| # | Sévérité | Fichier | Décision |
|---|---|---|---|
| 1 | Minor | `apps/mobile/app/(protected)/(tabs)/tribes/index.tsx` | **Accepté** |
| 2 | Minor | `apps/mobile/components/tribes/tribe-invitations-section.tsx` | **Accepté** |
| 3 | Trivial (nitpick) | `apps/mobile/app/(protected)/tribes/[slug].tsx` | **Refusé** |

Nitpick refusé : duplication initiale acceptée dans cette PR — aucun défaut
fonctionnel démontré ; factoriser via `loadBundle` élargirait le diff après
validation des invariants.

### 15.3 Corrections appliquées

1. **tribes/index.tsx** — `refreshInFlightRef` positionné avant le fetch refresh,
   libéré uniquement par le refresh correspondant, invalidé au cleanup ;
   `loadMore` consulte le ref **et** `refreshing` avant de créer sa requête ;
   un refresh incrémente toujours `dataGenRef` (invalide un loadMore antérieur).
2. **tribe-invitations-section.tsx** — échec de `decline` : liste inchangée
   (pas de `items: []`) ; succès : refetch inchangé ; échec refetch après
   decline OK : retire seulement l’invitation confirmée ; gardes
   `mountedRef` / `dataGenRef` conservées. Aucun mécanisme d’erreur UI dédié
   n’existait pour decline.

### 15.4 Scénarios (relecture structurelle)

| Scénario | Résultat |
|---|---|
| refresh puis loadMore | loadMore bloqué (`refreshInFlightRef` / `refreshing`) |
| loadMore puis refresh | refresh incrémente `dataGen` → page loadMore ignorée |
| double refresh | seul le `refreshGen` courant libère spinner + ref |
| échec refresh | erreur UI ; items conservés si key match ; spinner libéré |
| unmount pendant refresh/loadMore | cleanup invalide gens + `refreshInFlightRef` |
| decline réussi | refetch liste (UX inchangée) |
| decline échoué | liste conservée ; `busyId` libéré |
| double action decline | `busyId` désactive les boutons |
| unmount pendant decline | `mountedRef` / `dataGen` bloquent setState |

**Aucun test runtime.**

### 15.5 Gates rejoués

| Gate | Exit | Note |
|---|---|---|
| lint | **0** | |
| typecheck | **0** | |
| typecheck sans `.expo` | **0** | 5 fichiers ; MISMATCH=0 |
| expo install --check | **0** | |
| expo-doctor 1.20.4 | **1** | **21/22**, seul Hermes |
| export Android | **0** | 1997 modules ; hors dépôt |
| Mapbox / secrets / artefacts | OK | |
| `git diff --check` | **0** | |

Limites inchangées : runtime, build natif, Expo Go **non vérifiés** ;
SDK 56 **non publiable** ; SDK 57 **non commencé**.
