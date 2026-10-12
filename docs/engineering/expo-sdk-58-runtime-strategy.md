# Expo SDK 58 — audit de stabilité et stratégie runtime

- **Ticket** : YUNIMOBILE-0011E-E
- **Date d’audit** : 2026-10-12 (Europe/Paris)
- **Nature** : audit documentaire et décision technique uniquement
- **Hors périmètre exécuté** : migration, installation, auth Expo/Apple,
  dépense, build, Metro, modification applicative, commit, push

## 1. Préconditions (preuve locale)

| Contrôle | Résultat |
|---|---|
| Branche | `docs/yunimobile-0011e-e-runtime-strategy` |
| HEAD | `2bfa34656360f3f7adc3cfa22b0fe3c4fc03cba4` |
| `origin/main` | identique |
| Arbre | propre avant rédaction des livrables |
| Ticket actif avant démarrage | Aucun |
| Sauvegardes node_modules SDK 55 et 56 | présentes hors dépôt (vérifiées) |
| Projet courant (main) | Expo SDK **57** (checkpoint 0011E-D) |

## 2. Statut officiel du SDK 58 (sources primaires)

Consultation le **2026-10-12**. Ne pas conclure « stable » à partir d’Expo Go.

### 2.1 Synthèse

| Critère | Observation | Verdict |
|---|---|---|
| Changelog stable `/changelog/sdk-58` | HTTP **404** | Pas de release notes stables publiées |
| Changelog beta `/changelog/sdk-58-beta` | HTTP **200** ; période beta « 3–4 semaines » ; RN 0.88 **RC** | Canal beta encore officiel |
| npm `expo` dist-tag `latest` | **57.0.28** | Stable projet = SDK 57 |
| npm `expo` dist-tag `next` | **58.0.7** | Canal prerelease / next |
| Dist-tag `sdk-58` | **absent** | Pas d’alias sdk-58 sur npm |
| Dist-tag `sdk-57` | 57.0.28 | Aligné avec `latest` |
| `bundledNativeModules` branche `sdk-58` | `react-native` **0.88.0-rc.2** | Runtime RN encore RC |
| npm `react-native` | `latest`=**0.87.1** ; `next`=**0.88.0-rc.4** ; **0.88.0** absent | RN 0.88 non stable |
| Docs `docs.expo.dev/versions/v58.0.0` | Index présent | Docs préliminaires ≠ promotion stable |
| Images EAS `sdk-58` | Listées (Android + iOS) dans l’infra EAS | Outil cloud prêt ; ≠ SDK stable |

**Conclusion officielle pour Yunicity** : Expo SDK 58 est en statut
**beta / pré-stable**. Il n’est **pas** promu comme cible stable
(`latest` reste 57). Les numéros npm `58.0.x` sans suffixe `-beta` **ne
suffisent pas** à déclarer la stabilité tant que `latest`, le changelog
stable et React Native stable ne sont pas alignés.

### 2.2 Versions npm `expo` (registre officiel)

| Dist-tag / famille | Version |
|---|---|
| `latest` | 57.0.28 |
| `sdk-57` | 57.0.28 |
| `next` | 58.0.7 |
| `canary` | 58.0.0-canary-… (série canary) |
| Ligne 58 publiée (extrait) | preview.0–preview.8, puis 58.0.0 … 58.0.7 |
| Ligne 57 stable récente | 57.0.26, 57.0.27, 57.0.28 |

### 2.3 Versions bundled (branche GitHub `expo/expo`)

| Paquet | SDK 57 (`sdk-57`) | SDK 58 (`sdk-58`) |
|---|---|---|
| React | 19.2.3 | 19.3.0 |
| React Native | 0.86.3 (**stable**) | **0.88.0-rc.2** (RC) |
| Expo Router | ~57.0.26 | ~58.0.9 |
| react-native-maps | 1.27.2 | 1.29.0 |

### 2.4 Date et statut de release

- Page beta : période de beta **trois à quatre semaines** ; notes stables
  « pas disponibles avant la release stable ».
- Expo Go beta : disponible via Expo CLI / `eas go` pendant la beta ; les
  versions App Store / Google Play « mettront à jour vers SDK 58 **peu après
  la release stable** » (texte beta).
- Au jour de l’audit : pas de page changelog stable SDK 58.

### 2.5 Régressions et breaking changes pertinents (Yunicity)

Source principale : changelog **sdk-58-beta** + notes « Notable breaking
changes ». Section « Known regressions » beta : **aucune signalée** à la
date du post (à re-vérifier avant toute migration).

| Domaine | Points pertinents |
|---|---|
| Expo Router | États / clés déterministes ; surface API react-navigation forkée réduite ; peers `@expo/ui` / `expo-symbols` optionnels — migration guide requis. |
| New Architecture / RN | Strict TypeScript API par défaut (0.87+) ; opt-out legacy retiré après 0.88 ; retraits (`InteractionManager`, Touchable root, etc.). |
| react-native-maps | Matrice 1.29.0 sur sdk-58 ; aucune régression maps listée dans le post beta — **non prouvé** runtime. |
| iOS | SDK iOS 27 / UIScene ; `requireFullScreen` / orientation ; géométrie hors `UIScreen.main`. |
| Android | R8 minify release par défaut ; AGP 9 compatible tooling. |
| Metro | Transformeur expérimental Rust (« Noxcturnal ») opt-in ; non obligatoire. |
| Modules Expo | Expo Modules 2.0 en beta ; dépréciations file-system ; libSQL retiré de `expo-sqlite`. |

### 2.6 Images EAS

Documentées sur `docs.expo.dev/build-reference/infrastructure` (audit) :

- Alias **`sdk-58`** : image Android
  `ubuntu-26.04-jdk-17-ndk-r27b-sdk-58` ; image iOS
  `macos-tahoe-26.6-xcode-27.0` (`sdk-58`).
- Alias **`sdk-57` / `latest`** (iOS) : Xcode 26.6 — toujours le canal
  « latest » côté iOS au moment de l’audit.
- Disponibilité des images **≠** promotion produit SDK 58 stable.

### 2.7 Node et pnpm

| Outil | Documentation / preuve |
|---|---|
| Node (SDK 58, engines npm `expo@58.0.7`) | `^22.13.0 \|\| ^24.3.0 \|\| ^26.0.0 \|\| >=27.0.0` ; changelog beta : lignes 22 / 24 / 26+ ; impairs 23/25 non supportés |
| Node (SDK 57 projet) | Poste déjà sur Node 24.x (historique 0011E) — hors mutation ici |
| pnpm | Versions listées sur les **images EAS** (ex. pnpm 11.x sur sdk-58) ; **pas** d’exigence pnpm locale unique trouvée dans le changelog beta pour le poste de développement |

## 3. Situation Expo Go (preuve utilisateur)

Consigné comme **preuve utilisateur** (non rejouée par l’agent) :

- Capture / constat du **12 octobre 2026**.
- Expo Go iPhone annonce **SDK 58.0.0**.
- Projet **SDK 57** refusé **avant** chargement JavaScript.

### 3.1 Provenance de l’Expo Go 58

| Hypothèse | Preuve au 2026-10-12 |
|---|---|
| App Store stable a déjà basculé | Non démontré ici ; le texte beta indique une mise à jour store **après** la stable |
| TestFlight | Non vérifié |
| `eas go` / build Go personnalisé | Non vérifié |
| Autre canal | Non vérifié |

**Verdict** : **provenance non vérifiée**.

Le numéro affiché par Expo Go **ne suffit pas** à déclarer SDK 58 stable
pour le dépôt.

## 4. Development build iOS depuis Windows

Sources : docs Expo « Create a development build », pricing EAS, Apple
Developer Program. **Aucune** connexion compte, **aucun** projet EAS,
**aucun** certificat généré.

### 4.1 EAS Build iOS depuis Windows ?

**Oui** — pour un build **cloud** EAS : la compilation iOS s’exécute sur
macOS EAS ; Windows peut déclencher `eas build --platform ios`. Le build
local iOS (`--local` / Xcode) n’est **pas** disponible sur Windows.

### 4.2 Conditions nécessaires (appareil iPhone)

| Condition | Obligatoire ? | Notes |
|---|---|---|
| Compte Expo | Oui (EAS cloud) | Login `eas login` — **non fait** |
| Apple ID | Oui (signing) | Compte développeur Apple |
| Apple Developer Program | Oui pour **device** iPhone via EAS | Docs Expo : builds device iPhone exigent un compte Apple Developer **payant** |
| Enregistrement iPhone | Oui (UDID / provisioning) | Géré via credentials EAS / Apple |
| Certificats & provisioning | Oui | Générés / gérés par EAS ou manuellement — **non fait** |
| Installation du development build | Oui | QR / Orbit / lien build ; Developer Mode iOS |
| `expo-dev-client` | Oui | Dépendance native à installer dans un ticket futur |

Simulateur iOS : build EAS possible, mais **installation** du simulateur
uniquement sur **macOS**.

### 4.3 Coûts au 12 octobre 2026 (officiels)

Sources consultées le **2026-10-12** :

- Expo Application Services pricing : `https://expo.dev/pricing`
- FAQ facturation Expo : `https://docs.expo.dev/billing/faq`
- Apple Developer Program : `https://developer.apple.com/programs/`

Ces tarifs et quotas **peuvent évoluer** ; les re-vérifier avant toute
dépense. Les plafonds Free EAS (dont le chiffre de builds iOS/mois observé
à la date d’audit) **ne sont pas une garantie permanente**.

| Poste | Montant (au 2026-10-12) | Obligatoire pour |
|---|---|---|
| Compte Expo Free | 0 USD | Démarrer EAS |
| EAS Free — builds cloud | 0 USD dans le quota alors publié | Au jour de l’audit : jusqu’à 15 builds iOS / mois + 15 Android (indicatif) ; file basse priorité ; timeout 45 min ; 1 concurrence ; pas de dépassement facturé (quota bloqué jusqu’au reset mensuel) — **non garanti durablement** |
| Apple Developer Program | **99 USD / an** (page Apple) | Signing / install device iPhone via EAS |
| EAS plans payants | Optionnel | Crédits, priorité, timeouts plus longs |
| Google Maps API | Hors ce ticket ; facturation Google possible | Uniquement si Google Maps iOS/Android explicitement configurés |

**Décision CTO** : aucune dépense Apple autorisée à ce stade ; iOS EAS
différé ; adhésion Apple Developer non autorisée.

### 4.4 Ce qui peut être préparé sans paiement

- Documentation / tickets / `eas.json` (hors cette passe).
- Inventaire bundle id, profils build (brouillon).
- Préparation Android locale (AVD) — ticket **0011F-A** (proposé).
- Attente SDK 58 stable (Option A) puis audit dédié.

### 4.5 Ce qui exige connexion, dépense ou autorisation séparée

| Action | Exige |
|---|---|
| `eas login` / projet EAS | Connexion Expo |
| Build iOS device | Apple Developer **99 USD/an** + credentials |
| Build cloud au-delà du Free | Plan EAS payant ou attente reset |
| Clés Google Maps | Compte Google Cloud + éventuelle facturation |

### 4.6 Runtime figé vs Expo Go

Un **development build** compile le runtime natif du projet (ici SDK **57**
si le projet reste en 57). Les mises à jour d’Expo Go sur l’App Store
**n’imposent pas** le même runtime : le client de développement embarque
ses propres modules natifs. C’est le levier principal pour débloquer
l’iPhone sans migrer vers SDK 58 beta.

## 5. Alternatives comparées

| | Option A — attendre SDK 58 stable | Option B — migrer maintenant vers 58 beta/prerelease | Option C — development build iOS SDK 57 (EAS) | Option D — tester SDK 57 sur émulateur Android local | Option E — D maintenant, puis C ou A plus tard |
|---|---|---|---|---|---|
| Délai | Inconnu (fin beta + RN 0.88 stable) | Court (jours) mais instable | Jours après comptes + 1er build | Court après 0011F (AVD) | Court pour preuve Android ; iOS/58 ensuite |
| Coût | 0 | 0 outil ; coût risque/rework | Expo Free OK dans quota ; **Apple 99 USD/an** pour device | 0 (local) | 0 pour D ; C/A selon décision ultérieure |
| Risque | Faible technique ; délai iPhone | **Élevé** (RN RC, breaking Router/iOS 27, images en mouvement) | Moyen (signing, file EAS, apprentissage) | Faible–moyen (env Android) | Faible global si gates |
| Valeur de preuve | Aucune runtime immédiate | Preuve sur surface instable | Runtime iOS réel SDK 57 | Runtime Android réel SDK 57 | Preuve Android rapide + chemin iOS/58 maîtrisé |
| Dépendances externes | Publication Expo + RN 0.88 | Expo beta + RN RC | Expo account + Apple Developer | Android SDK / AVD / Java (0011F-A) | 0011F-A puis 0011F-B |
| Impact iOS | Attend | Migration lourde précoce | Débloque iPhone **sans** suivre Go 58 | Aucun iOS | iOS reporté (EAS différé) |
| Impact Android | Neutre | Migration | Neutre si non touché | Valide carte / auth / UI Android | Aligné roadmap Android |
| Compatibilité MVP | OK si Android avance | Conflit avec stabilité MVP | OK iOS mais coût Apple | OK chemin MVP Android | **Retenu (CTO)** |

## 6. Google Maps — distinctions

| Affirmation | Statut Yunicity |
|---|---|
| `react-native-maps` est dans le projet | **Oui** (migration 0011D ; version SDK 57 = 1.27.2) |
| Carte affichée sur iOS | **Non prouvé** (JS non chargé sous Expo Go 58) |
| Fournisseur natif Apple par défaut sur iOS | **Oui** (comportement lib / docs Expo) ; pas de `PROVIDER_GOOGLE` dans le code carte |
| Google Maps **explicitement garanti** sur iOS | **Non** — exige `provider={PROVIDER_GOOGLE}`, clé iOS, rebuild natif |
| Exigences build natif + clé Google | Docs Expo Map View : plugin `iosGoogleMapsApiKey` / `androidGoogleMapsApiKey`, enable Maps SDK, rebuild — **aucune clé créée** ici |
| Mapbox | **Retiré** du chemin carte mobile ; **ne pas** réintroduire |

## 7. Décision CTO — **Option E** adoptée

Règles appliquées et confirmées :

1. Ne pas migrer vers SDK 58 beta uniquement pour suivre Expo Go.
2. SDK 58 **beta / pré-stable** → projet maintenu sur **SDK 57**.
3. **Android SDK 57** prioritaire.
4. **Aucune dépense Apple** ; iOS EAS différé ; adhésion Apple Developer
   **non autorisée** à ce stade.
5. Aucune migration SDK 58 avant sortie **stable** et **audit dédié**.
6. Provenance Expo Go 58 iPhone : **non vérifiée**.

### Stratégie retenue : **Option E**

1. **Maintenant** : environnement Android + AVD (**YUNIMOBILE-0011F-A**),
   puis premier runtime Android SDK 57 (**YUNIMOBILE-0011F-B**).
2. **Plus tard** (autorisations séparées, non accordées ici) :
   - éventuel development build iOS SDK 57 (Option C), **ou**
   - attente SDK 58 stable + audit dédié puis migration (Option A).

**Option B refusée** (CTO).

### Prochain ticket unique

**YUNIMOBILE-0011F-A** — environnement Android et AVD API 35.

Non commencé ; fichier ticket **non créé** dans cette passe.
**YUNIMOBILE-0011F-B** réservé au premier runtime Android.
SDK 58 et EAS iOS **non commencés**.

## 8. Prochaines étapes (hors périmètre de 0011E-E)

| Ticket | Rôle | Statut |
|---|---|---|
| YUNIMOBILE-0011F-A | Environnement Android + AVD API 35 | Proposé ; **non commencé** |
| YUNIMOBILE-0011F-B | Premier runtime Android SDK 57 | Réservé ; non commencé |
| Ultérieur (si C autorisé) | Development build iOS SDK 57 | Différé ; Apple non autorisé |
| Ultérieur (si 58 stable) | Audit puis migration SDK 58 | Non commencé |

## 9. Limites de preuve

- App Store / fiche Expo Go non audités compte par compte ; provenance
  Go 58 **non vérifiée**.
- Aucune exécution Metro / appareil dans ce ticket.
- Pricing EAS / Apple : sources officielles au **2026-10-12** ; valeurs
  **susceptibles d’évoluer** ; quotas Free (dont builds iOS/mois) **non
  garantis durablement**.
