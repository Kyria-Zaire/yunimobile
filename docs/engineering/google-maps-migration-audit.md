# Audit de migration Mapbox → Google Maps — YUNIMOBILE-0011D

Date : 2026-10-12 (Europe/Paris). Mis à jour : 2026-10-12 01:05 (Europe/Paris)
— revue CTO. Passe **audit lecture seule**. Aucune modification applicative,
aucune installation, aucune clé Google créée, aucun build. Aucun fichier `.env`
réel ouvert ; aucune valeur de token affichée.

Décision CTO (contexte) : **Google Maps** est le fournisseur cartographique
définitif Web et Mobile ; Mapbox est un héritage à retirer.

## Décision pour l’implémentation

**CONDITIONAL GO** — confirmé par revue CTO (2026-10-12).

Conditions principales :

1. Retenir **`react-native-maps`** (cible SDK 54 : **1.20.1** recommandée par la
   doc Expo SDK 54 — **pas** la doc Expo « latest ») plutôt que `expo-maps`
   (alpha, pas Expo Go, Google **Android seulement**).
2. Installation future uniquement via `pnpm expo install react-native-maps`,
   puis vérification de la version **réellement résolue** — **aucune**
   installation dans cette passe d’audit.
3. Expo Go : bibliothèque incluse ; Android = Google natif ; iOS = une carte
   affichée **n’est pas** une preuve Google ; `PROVIDER_GOOGLE` + clés Yunicity
   = build natif + test runtime — **non affirmé** sans preuve.
4. Découpage : implémentation 0011D (code/deps, sans clé ni build) → 0011E
   (Java/AVD) → 0011F (clés + premier dev build Android + preuve Google) ;
   iOS build = ticket ultérieur.
5. Backend FastAPI / `listMapEvents` : inchangés, non dupliqués.

## A. État Git Yunimobile (préconditions)

| Contrôle | Résultat |
|---|---|
| Branche de départ | `main` |
| HEAD = origin/main | `b4ffaf4e597a645b3c5d6c39768251cc33a7ad31` |
| Arbre | propre |
| Espace libre (mesure préconditions) | ≈ 14,098 Gio (> 12 Gio) |
| Ticket actif avant démarrage | aucun |
| Branche de travail | `feat/yunimobile-0011d-google-maps` |

## B. Inventaire Mapbox dans Yunimobile

### Dépendances

| Élément | Observation | Nature |
|---|---|---|
| Directe `apps/mobile/package.json` | `"@rnmapbox/maps": "^10.3.1"` | **Utilisée** (UI carte) |
| Lockfile | `@rnmapbox/maps@10.3.5` ; peer optionnel `mapbox-gl` | **Présente** |
| Transitives Mapbox natives | Non inventoriées hors lock (pas de `node_modules` / install) | **Non exécuté** |
| `react-native-maps` | Absente de `package.json` et du lockfile | Absent aujourd’hui |

### Plugin Expo

`apps/mobile/app.json` → `plugins` inclut `"@rnmapbox/maps"`. Pas d’`app.config.*`.
Package Android / bundle iOS : `com.yunicity.mobile`. `newArchEnabled: true`.

### Variables (noms uniquement)

| Nom | Où | Usage |
|---|---|---|
| `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` | `.env.example` + code | Lecture runtime |
| `EXPO_PUBLIC_MAPBOX_TOKEN` | code (repli) | Lecture runtime |
| Valeurs | non lues | — |

Commentaire `.env.example` : « dev build requis — pas Expo Go » (héritage Mapbox).

### Code UI mobile (utilisé)

| Fichier | Rôle |
|---|---|
| `app/(protected)/(tabs)/map/index.tsx` | Onglet Carte → `EventMapScreen` |
| `components/map/event-map-screen.tsx` | Token, `Mapbox.setAccessToken`, états vide/erreur/chargement, fiche événement |
| `components/map/event-map.tsx` | `MapView`, `Camera`, `PointAnnotation`, `StyleURL.Light`, bbox, recentrage |
| `hooks/use-map-bbox.ts` | Debounce 300 ms des bounds → `MapBbox` |
| `hooks/use-map-events.ts` | `yunicityApi.listMapEvents` (limit 100), truncation |

Fonctionnalités **réellement câblées** dans le code mobile (preuve source, **non
exécutées** ici) :

- centrage défaut **Reims** (`resolveCityMapCenter` / `DEFAULT_MAP_CITY`) ;
- zoom / pan via Mapbox Camera + `onRegionDidChange` ;
- calcul zone visible (`getVisibleBounds` → `MapBbox`) ;
- marqueurs **événements** uniquement (`PointAnnotation`) ;
- sélection / désélection + fiche (callout) + CTA détail ;
- bouton recentrage ville (`MAP_RECENTER`).

**Non présents** sur la carte mobile actuelle :

- marqueurs lieux / partenaires / quartiers / tribus (présents sur le Web Google) ;
- clustering ;
- géolocalisation utilisateur (`expo-location` **absent** de l’app mobile) ;
- itinéraires Mapbox Directions ;
- tests `*map*.test.*` sous `apps/mobile` : **aucun**.

### Packages partagés (présents, hors UI mobile carte)

| Module | Rôle | Usage par l’app mobile carte |
|---|---|---|
| `packages/utils/.../mapbox-directions.ts` | Directions API Mapbox | **Non importé** par les composants carte mobile |
| `packages/utils/.../mapbox-geocoding.ts` | Geocoding Mapbox | Idem |
| `packages/utils/.../event-detail.ts` `buildMapboxStaticPreviewUrl` | Preview static | Idem |
| Labels `MAP_TOKEN_MISSING_EXPO` etc. | Copy UX | **Utilisés** |
| `packages/utils/.../yunicity-api.ts` `listMapEvents` | Client API | **Utilisé** |
| `packages/types/.../map.ts` | `MapBbox`, `MapEventItem`, … | **Utilisé** |

Ces helpers Mapbox des packages sont un **héritage workspace** ; leur retrait
complet peut être un ticket de nettoyage séparé pour ne pas élargir le premier
portage UI.

### Documentation / audits antérieurs

Nombreuses mentions Mapbox dans `docs/engineering/*` et tickets 0006–0011C —
historique, pas runtime.

## C. Référence Web (`C:\Users\kyria\yunicity`)

### État Git (lecture seule)

| Moment | Branche | HEAD | `git status` |
|---|---|---|---|
| Avant inspection | `feat/c3-global-refonte-preview` | `ee57ce1dfc37835a47335e56338578471a95ec7d` | propre vs origin |
| Après inspection | identique | identique | inchangé |

Aucun fichier du dépôt Web modifié.

### Bibliothèque Google Maps Web

| Élément | Preuve |
|---|---|
| Chargement JS API | `hooks/use-google-maps.ts` — script Maps JS, libs `marker`, clé `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `mapId` |
| Carte événements | `components/map/google-event-map.tsx` + orchestration `event-map-screen.tsx` |
| Clustering | `@googlemaps/markerclusterer` ^2.6.2 |
| Types | `@types/google.maps` ^3.58.1 |
| Marqueurs | `AdvancedMarkerElement` + SVG DOM ; couches events, lieux culturels, partenaires, quartiers, tribus |

### Contrats / données partagés réutilisables

- Types `@yunicity/types` : `MapEventItem`, `MapBbox`, réponses liste — **alignés**
  avec le mobile.
- Utils : `resolveCityMapCenter`, labels carte, helpers sélection marqueurs.
- API backend commune (FastAPI) via `listMapEvents` — **ne pas dupliquer**.

### UX Web réutilisable (intention)

- Couleur marqueur événement `#2A2FFF` ;
- recentrage ville ;
- bounds → refetch ;
- callout / fiche détail.

### Spécifique navigateur (ne pas copier tel quel en RN)

- SDK **Maps JavaScript** + `document.createElementNS` ;
- `mapId` vectoriel / Advanced Markers Web ;
- cycle de vie multi-viewport (`display:none` vs démontage) ;
- restrictions de clé par **HTTP referrer** ;
- previews **Mapbox Static** encore utilisées sur fiches lieu / quartier / event
  rail (dette Web distincte de cette migration mobile).

## D. Solutions mobiles (sources officielles)

Sources consultées : [Expo SDK 54 — react-native-maps](https://docs.expo.dev/versions/v54.0.0/sdk/map-view/),
[Expo SDK 54 — expo-maps](https://docs.expo.dev/versions/v54.0.0/sdk/maps/),
docs Google Maps Platform (billing / key restrictions).

### Version SDK 54 (contraignante)

- La documentation **Expo SDK 54** (`/versions/v54.0.0/`) recommande
  **`react-native-maps` 1.20.1** (bundle / version associée SDK 54).
- **Ne pas** suivre la documentation Expo **« latest »** pour pinner la version
  (elle peut décrire une autre major/API de config plugin).
- Installation future (implémentation 0011D, **non exécutée ici**) :

  ```bash
  pnpm expo install react-native-maps
  ```

  Puis **vérifier** la version réellement résolue dans `package.json` / lockfile
  (attendu de référence : **1.20.1** pour SDK 54 ; tout écart doit être rapporté
  avant de poursuivre).

### Option 1 — `react-native-maps` (**recommandée**)

| Critère | Constat | Nature |
|---|---|---|
| Expo SDK 54 / RN 0.81 | Doc SDK 54 → **1.20.1** ; installer via `pnpm expo install` | Doc SDK 54 |
| Android / iOS | Oui | Doc |
| Expo Go | **Incluse** dans Expo Go | Doc |
| Fournisseur Android Expo Go | **Google Maps** natif | Doc / plateforme |
| Fournisseur iOS Expo Go | Carte affichable ≠ preuve Google ; souvent Apple Maps sans config Google | Limite CTO |
| `PROVIDER_GOOGLE` + clés Yunicity dans Expo Go iOS | **Non affirmé** sans test runtime concluant | Limite |
| Google Maps iOS Yunicity | Clé iOS **restreinte** + **nouveau build natif** | Doc + CTO |
| Clustering / marqueurs / caméra | Markers, custom views, region/camera | Doc + déduction |
| Géolocalisation | `expo-location` absent de l’app mobile actuelle | Preuve absence |
| app.json / EAS (clés) | Reporté à **0011F** | Découpage CTO |

### Option 2 — `expo-maps`

| Critère | Constat | Nature |
|---|---|---|
| Maturité | **Alpha**, breaking changes fréquents | Doc Expo 54 |
| Expo Go | **Non disponible** | Doc |
| Google | **Android seulement** ; iOS = Apple Maps | Doc |
| Alignement CTO « Google Web + Mobile » | Faible sur iOS | Déduction |

**Non retenue** pour la cible Google cross-platform.

### Distinction obligatoire — Expo Go

| Affirmation | Statut |
|---|---|
| `react-native-maps` est inclus dans Expo Go | **Documenté** Expo SDK 54 |
| Sur **Android**, le fournisseur natif est Google Maps | **Documenté** / plateforme |
| Sur **iOS**, une carte affichée dans Expo Go prouve Google Maps | **Faux** — ne constitue **pas** une preuve du fournisseur Google |
| Google Maps iOS avec config Yunicity | Clé iOS restreinte + **nouveau build natif** |
| `PROVIDER_GOOGLE` fonctionne dans Expo Go iOS | **Non affirmé** sans test runtime concluant |

## E. Coût et sécurité

- Compte Google Cloud avec **facturation** Maps Platform (modèle pay-as-you-go ;
  seuils/crédits évoluent — consulter la grille courante au moment de l’activation).
- APIs à activer au minimum : **Maps SDK for Android**, **Maps SDK for iOS**
  (Web : Maps JavaScript API déjà côté yunicity — hors scope mobile).
- Clés **distinctes** recommandées : Android (package + SHA-1), iOS (bundle id),
  Web (referrer) — ne pas réutiliser la clé Web mobile.
- Clés dans le client mobile : **non secrètes** → restrictions application + API
  obligatoires ([best practices Google](https://developers.google.com/maps/api-security-best-practices)).
- **Aucune clé réelle** dans le dépôt ni dans ce rapport.
- Ne pas versionner de `.env` avec secrets ; préférer EAS secrets / CI pour les
  builds natifs.

## F. Découpage retenu (revue CTO)

| Ticket | Contenu | Hors scope |
|---|---|---|
| **0011D implémentation** | Remplacer code + dépendance Mapbox par `react-native-maps` (**sans** clé Google ni build natif) | Clés, AVD, dev build |
| **0011E** | Environnement Java/Android + création AVD API 35 | Carte, clés Google |
| **0011F** | Config sécurisée des clés Google, premier **dev build Android**, preuve du fournisseur Google | Build iOS |
| Ultérieur | Stratégie de **build iOS** (ticket dédié) | — |

### Critères d’acceptation — implémentation 0011D

- comportement événementiel conservé ;
- centrage Reims et région initiale conservés ;
- marqueurs et ouverture de fiche conservés ;
- états chargement, erreur et vide conservés ;
- suppression de `@rnmapbox/maps` ;
- suppression du plugin Mapbox ;
- suppression de toute référence `EXPO_PUBLIC_MAPBOX_*` ;
- aucune donnée factice ajoutée ;
- aucun appel backend dupliqué ;
- typecheck, lint, `expo install --check`, `expo-doctor` et export Android ;
- test iPhone Expo Go **séparé** et rapporté avec le **fournisseur réellement
  observé** (ne pas conclure Google sans observation).

Installation prévue (implémentation, pas cette passe) :
`pnpm expo install react-native-maps` → vérifier version résolue (réf. SDK 54 :
**1.20.1**).

### Plan technique atomique (rappel, non exécuté)

1. Ajouter `react-native-maps` via `pnpm expo install` ; vérifier version.
2. Porter `EventMap` / `EventMapScreen` (Reims, bbox, marqueurs, fiche, états).
3. Retirer `@rnmapbox/maps`, plugin, `EXPO_PUBLIC_MAPBOX_*`.
4. Contrôles : typecheck, lint, `expo install --check`, expo-doctor, export Android.
5. Test Expo Go iPhone séparé + rapport fournisseur observé.
6. Rollback Git si besoin ; Mapbox non réintroduit long terme.
7. Clés + build Android → **0011F** ; AVD → **0011E**.

## G. Limites de cette passe

- Pas d’exécution runtime, pas d’installation, pas de `node_modules` mobile.
- Pas d’ouverture de `.env` réels.
- `PROVIDER_GOOGLE` / Expo Go iOS / clés Yunicity : **non démontrés**.
- Pricing Google exact : non chiffré ici.
- Dépôt Web non modifié.
- Auto-vérification documentaire ; revue CTO des clarifications appliquée.

## H. Recommandation synthétique

| Sujet | Recommandation |
|---|---|
| Bibliothèque | `react-native-maps` (cible **1.20.1** via `pnpm expo install`, SDK 54) |
| Expo Go | Inclus ; Android≈Google ; iOS≠preuve Google |
| Prochaine action | **Implémentation contrôlée 0011D** (sans clé ni build) |
| Puis | 0011E → 0011F ; iOS build plus tard |
| Décision | **CONDITIONAL GO** (confirmé CTO) |
