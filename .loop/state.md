# État du loop — Yunicity Mobile

**Mis à jour le** : 2026-10-13 14:25 (Europe/Paris) — YUNIMOBILE-0011K terminé (session + carte iPhone partielle) ; 0011I non lancé

## Étape en cours

**Étape 0 — Initialisation du dépôt** : en cours.

| Sous-étape | Ticket | Statut |
|---|---|---|
| 0.1 Fichiers de base et fins de ligne | YUNIMOBILE-0001, YUNIMOBILE-0001A | Clôturée selon les rapports fournis |
| 0.2 Doctrine commune et protocole du loop | YUNIMOBILE-0002 | Terminé |
| 0.3 Adaptateurs IA | YUNIMOBILE-0003 | Terminé — test Cursor de chargement consignés (0011C) |
| 0.4 Skills / plugins — audit et sélection | YUNIMOBILE-0004 | Terminé — audit terminé, installation non réalisée |
| 0.5 Skills — installation de deux skills adaptés | YUNIMOBILE-0005 | Terminé |
| 0.6 Audit de reprise de la base mobile Expo | YUNIMOBILE-0006 | Terminé — audit terminé, stratégie de reprise non décidée |
| 0.7 Diagnostic typecheck et lint de la base mobile | YUNIMOBILE-0007 | Terminé |
| 0.8 Diagnostic de compatibilité Expo SDK 54 | YUNIMOBILE-0008 | Terminé — option A (extraction contrôlée) approuvée |
| 0.9 Preuve d'extraction autonome et bundle Metro Android | YUNIMOBILE-0009 | Terminé — preuve réussie, GO intégration |
| 0.9A Hygiène de l'historique Git avant publication | YUNIMOBILE-0009A | Terminé |
| 0.10 Intégration permanente de l'application mobile | YUNIMOBILE-0010 | Terminé |
| 0.11A Audit de préparation au premier dev build Android | YUNIMOBILE-0011A | Terminé — audit réalisé ; premier dev build bloqué |
| 0.11B Préparation du nettoyage disque Android | YUNIMOBILE-0011B | Terminé — espace suffisant, aucune suppression effectuée |
| 0.11C Préparation Java/Android et stratégie d’appareil | YUNIMOBILE-0011C | Terminé — diagnostic OK ; CONDITIONAL READY ; préparation native conditionnelle |
| 0.11D Migration Mapbox → react-native-maps | YUNIMOBILE-0011D | Terminé — fusionné PR #5 (`381396fe…`) ; runtime reporté après migration Expo SDK |
| 0.11E-A Audit migration Expo SDK 54→55→56→57 | YUNIMOBILE-0011E-A | Terminé — audit approuvé ; CONDITIONAL GO CP1 |
| 0.11E-B Migration Expo SDK 54 → 55 | YUNIMOBILE-0011E-B | Terminé — migration statique Expo SDK 55 réussie ; fusionnée PR #7 (`9b96128…`) |
| 0.11E-C Migration Expo SDK 55 → 56 | YUNIMOBILE-0011E-C | Terminé — migration statique Expo SDK 56 ; PR #8 fusionnée `a8fc4f5…` ; runtime/native non validés |
| 0.11E-D Migration Expo SDK 56 → 57 | YUNIMOBILE-0011E-D | Terminé — migration statique Expo SDK 57 réussie ; runtime iPhone non exécuté (Expo Go 58 incompatible) |
| 0.11E-E Audit SDK 58 et stratégie runtime | YUNIMOBILE-0011E-E | Terminé — audit SDK 58 et stratégie runtime réalisés ; Option E |
| 0.11F-A Environnement Android et AVD API 35 | YUNIMOBILE-0011F-A | Terminé — diagnostic OK ; préparation bloquée (JDK 17 + RAM) |
| 0.11G Preuves runtime iPhone | YUNIMOBILE-0011G | Terminé — démarrage iPhone consigné ; API/auth/carte/session non validés |
| 0.11H Préparation API mobile isolée | YUNIMOBILE-0011H | Terminé — config statique préparée ; build/lancement/API iPhone non exécutés |
| 0.11J Auth iPhone Preview | YUNIMOBILE-0011J | Terminé — auth partielle ; Reload était NON TESTÉE (PASS en 0011K) |
| 0.11K Session + carte iPhone Preview | YUNIMOBILE-0011K | Terminé — test iPhone session et carte partiel consigné |

## Ticket actif

Aucun.

### Historique — YUNIMOBILE-0011K

- **Terminé** — test iPhone session et carte partiel consigné (API
  Preview).
- Branche : `docs/yunimobile-0011k-iphone-session-map` ; fichier
  `.loop/tickets/YUNIMOBILE-0011K.md`.
- **PASS (Kyria)** : Reload session sans ressaisie ; fond de carte ;
  déplacement/zoom ; recentrage Reims.
- **Capture** : fournisseur session **Apple Maps** ; état « Aucun
  événement à proximité » ; aucun marqueur → fiche/retour **NON TESTÉS** ;
  cause absence événements **non déterminée**.
- **Google Maps** : cible définitive Web + Mobile ; **non validée** sur
  iOS. Expiration/refresh tokens et builds natifs : **non validés**.
- Metro : arrêt **volontaire** ; port **8081 libre** ; QA **8010
  préservée**. 0011I / mobile-dev **non lancés**.
- Aucun push ni merge à la clôture.

### Historique — YUNIMOBILE-0011J

- **Terminé** — test auth iPhone partiel consigné (API Preview).
- Branche : `docs/yunimobile-0011j-iphone-auth-preview` ; fichier
  `.loop/tickets/YUNIMOBILE-0011J.md`.
- Connectivité Preview : prouvée (capture health, 2026-10-13).
- **Déclaration Kyria** : connexion OK (compte Preview existant) ; zone
  protégée accessible ; fil local et profil affichés ; déconnexion et
  suite conformes. Identités / contenu publications **non** retranscrits.
- **Captures** : appui utilisateur, non intégrées au dépôt.
- Persistance après Reload : était **NON TESTÉE** en 0011J ; **PASS**
  consignés ensuite en **0011K** (déclaration Kyria).
- **Non validés** (au moment de 0011J) : validation globale auth/sécurité ;
  carte ; expiration / refresh session ; builds natifs.
- Metro session Preview arrêté ; 0011I / mobile-dev **non lancés**.
- Aucun push ni merge à la clôture.

### Historique — YUNIMOBILE-0011H

- **Terminé** — configuration statique `ops/mobile-dev` préparée (Compose +
  `.env.example`) ; runtime image sans bind `/app` ; post-revue appliquée.
- Build, lancement et accès API iPhone : **non exécutés**.
- Dernière mesure RAM : **1,34 Gio** libres → lancement **BLOCKED** ;
  ressources et contexte de build **à revérifier** avant toute exécution.
- Conditions pré-build consignées : instantané SHA hors worktree Web (non
  créé) ; inventaire **contexte Docker complet** (≠ seuls `COPY`) à exécuter
  avant build ; deps non verrouillées via `uv.lock` ; init volume neuf
  (extensions + base test vide, pas de seed) ; pas de réutilisation QA/prod ;
  `POSTGRES_PASSWORD` brut + `*_URLENCODED` pour `DATABASE_URL`.
- PR #13 : 2 diagnostics CodeRabbit **acceptés** (contexte build ;
  encodage URL du mot de passe dans l’URL seulement).
- Rapport : `docs/engineering/mobile-api-isolation-plan.md`.
- Prochain ticket proposé : **YUNIMOBILE-0011I** — construction et validation
  API mobile isolée (**non créé / non lancé**).

### Historique — YUNIMOBILE-0011G

- **Terminé** — preuves de démarrage iPhone consignées (rapports / captures
  **Kyria**, **sans** réexécution par l’agent) ; code testé `3d361cc…`
  (branche 0011F-A). Anciens rapports historiques **préservés**.
- Expo Go : TestFlight **58.0.2** (build 1017888) ; retour App Store
  **57.0.9** / SDK **57.0.0** — blocage Go **levé** ; provenance Go 58 =
  **TestFlight**.
- Runtime : Metro LAN OK ; JS exécuté ; accueil / login / register ;
  **non validés** : accès API, authentification, carte, session, builds
  natifs.
- Diagnostic API (Cursor) : `EXPO_PUBLIC_API_URL` absente ; secours
  `127.0.0.1:8010` ; 8010 = QA Web localhost.
- Priorité : **API de test isolée iPhone**. Prochain ticket proposé :
  **YUNIMOBILE-0011H** (**non lancé**). Android en pause ; SDK 58 beta
  non retenu.

### Historique — YUNIMOBILE-0011F-A

- **Terminé** — diagnostic réalisé ; préparation Android **bloquée** par
  absence de **JDK 17** et RAM libre **insuffisante** (≈ 0,7–0,8 Gio).
- CTO : ne pas contourner avec Java **21** / **23** (présents, non retenus).
- Image **API 35** Play **x86_64** installée ; **adb** et **emulator**
  présents ; cmdline-tools / **avdmanager** absents ; **aucun AVD**.
- Aucun runtime Android ; aucun processus arrêté ; variables de session
  non posées.
- Rapport : `docs/engineering/android-avd-readiness.md`.
- Prochain ticket proposé : **YUNIMOBILE-0011F-JDK17** (**non lancé**) ;
  reprise AVD après install JDK 17 **et** RAM suffisante. **0011F-B** non
  commencé.

### Historique — YUNIMOBILE-0011E-E

- **Terminé** — audit documentaire SDK 58 + stratégie runtime ; Option **E**
  adoptée (CTO) ; Option **B** refusée.
- Branche `docs/yunimobile-0011e-e-runtime-strategy` ; base `2bfa346…`.
- SDK 58 : **beta / pré-stable** — projet maintenu sur **SDK 57**.
- Android SDK 57 prioritaire ; iOS EAS **différé** ; adhésion Apple
  Developer **non autorisée** ; aucune dépense Apple.
- Aucune migration SDK 58 avant sortie stable et audit dédié.
- Expo Go iPhone : annonce 58.0.0 (preuve utilisateur 2026-10-12) ;
  **provenance non vérifiée**.
- Tarifs / quotas EAS et Apple : sources officielles consultées le
  **2026-10-12** (`expo.dev/pricing`, docs billing, Apple Developer) ;
  valeurs **susceptibles d’évoluer** ; plafond Free builds iOS/mois
  **non garanti durablement**.
- Rapport : `docs/engineering/expo-sdk-58-runtime-strategy.md`.
- Prochain ticket : **YUNIMOBILE-0011F-A** (env Android + AVD API 35) —
  **non commencé** ; fichier non créé. **0011F-B** réservé au premier
  runtime Android. SDK 58 et EAS iOS **non commencés**.

### Historique — YUNIMOBILE-0011E-D

- **Terminé** — migration **statique** Expo SDK 57 réussie (GO CTO) ;
  runtime iPhone **non exécuté** car Expo Go **SDK 58** incompatible avec
  projet **SDK 57** ; ce blocage **n’est pas** un défaut de Yunicity.
- Branche `feat/yunimobile-0011e-d-expo-sdk-57` ; base `a8fc4f5…` (main).
- Versions finales : Expo **57.0.28** ; React **19.2.3** ; RN **0.86.3** ;
  Expo Router **57.0.26** ; react-native-maps **1.27.2**.
- Gates statiques : typecheck OK ; lint OK ; `expo install --check` OK ;
  expo-doctor **21/21** ; export Android OK.
- Bundling iOS Metro : **réussi** — **2078** modules ; LAN iPhone **atteinte**.
- JavaScript Yunicity : **non chargé** (refus Expo Go avant exécution).
- Runtime / UI / API / auth / carte : **non validés**.
- Aucune migration SDK **58** ; aucun ticket SDK 58 créé.
- Sauvegardes conservées : SDK 56
  `C:\tmp\yunimobile-0011e-d-node_modules-sdk56-backup` ; SDK 55
  `C:\tmp\yunimobile-0011e-c-node_modules-sdk55-backup`.
- Rapport : `docs/engineering/expo-sdk-57-migration.md`.
- Prochaine étape **non lancée** : audit stabilité SDK **58** versus
  stratégie **development build**.

### Historique — YUNIMOBILE-0011E-C

- **Terminé** — migration **statique** Expo SDK 56 réussie (GO CTO), avec
  exception Hermes V1 **transitoire** ; aucune validation runtime ou native.
- Branche `feat/yunimobile-0011e-c-expo-sdk-56` ; PR #8 **fusionnée**
  `a8fc4f57cd63baa3cb73f0aa429db3cf20494df0` (parents `9b96128…` +
  `aad4249…`) ; branche feature conservée.
- Versions : Expo **~56.0.23** ; React **19.2.3** ; RN **0.85.3** ; Router
  **~56.2.21** ; react-native-maps **1.27.2**.
- Gates : lint OK ; typecheck OK ; export Android OK ; Doctor **21/22**,
  seul HermesV1VersionCheck.
- CodeRabbit : 2 Minor corrigés ; nitpick refusé.
- Runtime, build natif et Expo Go **non exécutés**.
- Rapport : `docs/engineering/expo-sdk-56-migration.md`.
- Suite : **YUNIMOBILE-0011E-D** (démarrée).

### Historique — YUNIMOBILE-0011E-B

- **Terminé** — migration **statique** Expo SDK 55 réussie (GO CTO).
- Branche `feat/yunimobile-0011e-b-expo-sdk-55` ; commit de clôture
  `d61444b74fbb9e5cbef2e884128b3aeeba950ef6` ; PR #7 fusionnée
  `9b9612801637cb0e06a2429aa9ae66b8cb6e8b1b`.
- Runtime, build natif et Expo Go **non exécutés**.
- Écart des quatre tentatives ENOENT (3 échecs + 4ᵉ hors protocole)
  **conservé** ; ne pas reproduire comme procédure normale.
- Rapport : `docs/engineering/expo-sdk-55-migration.md`.

### Résultats — YUNIMOBILE-0011D

- Audit (commit `f827895…`) : **CONDITIONAL GO** ; reco `react-native-maps`
  **1.20.1** (SDK 54, pas doc latest).
- Implémentation : `react-native-maps@1.20.1` installé ; `@rnmapbox/maps`
  retiré ; plugin et `EXPO_PUBLIC_MAPBOX_*` retirés ; `EventMap` /
  `EventMapScreen` migrés ; pas de `PROVIDER_GOOGLE` iOS ; pas de clé Google.
- Contrôles exit 0 : typecheck ; lint app+components ; `expo install --check` ;
  expo-doctor 1.20.4 **18/18** ; `expo export` Android hors dépôt (1809 modules).
- Revue CTO intermédiaire (sans Metro) : diff carte OK (pas de boucle région) ;
  `regionToBbox` validé vs contrat API/Web ; helpers Mapbox utils **conservés**
  (morts mobile, vivants Web). Aucun fix applicatif requis.
- Test iPhone Expo Go (Kyria) : Expo Go **SDK 57.0.0** vs projet **SDK 54** ;
  connexion LAN / ouverture URL OK ; refus *Project is incompatible…* **avant**
  chargement du bundle ; aucun JS applicatif, écran, marqueur, fournisseur ou
  appel API testé ; runtime iOS **non exécuté**. Ce résultat n’est **pas** un
  échec de la migration cartographique.
- Google Maps Android/iOS : **toujours non prouvés**.
- Décision CTO : ne pas upgrader Expo dans 0011D ; pas d’EAS Go / TestFlight ;
  migration SDK incrémentale en **0011E**.
- PR #5 : revue CodeRabbit — 1 diagnostic Minor (`event-map.tsx` L66,
  recentrage ville) **accepté CTO** ; warning Docstring Coverage 40 %
  **non bloquant** (pas de docstring artificielle).
- Correction recentrage : commit `abb84a2` ; thread CodeRabbit résolu ; PR #5
  fusionnée en merge `381396fe…` (parents `b4ffaf4…` + `abb84a2…`) ; branche
  feature distante conservée.
- Diagnostic hors diff `MapView.onPress` (désélection) : **non traité** en
  0011D — point UX futur carte.
- Runtime mobile / Google Maps Android-iOS : toujours non prouvés (décalage SDK
  au moment du test iPhone).

### Résultats — YUNIMOBILE-0011E-A

- Audit documentaire SDK **54 → 55 → 56 → 57** (sources Expo +
  `bundledNativeModules` consultées **2026-10-12**) ; baseline locale : Expo
  `~54.0.37`, RN `0.81.5`, `react-native-maps` `1.20.1`, `newArchEnabled: true`,
  Node poste `v24.18.1`.
- CTO : audit **approuvé** ; **CONDITIONAL GO** pour checkpoint 54→55 ;
  SDK **57** cible finale ; aucun palier sauté ; SDK **56** contrôlé mais
  **non durable** ; chaque palier = branche + contrôles + commit + PR ;
  maps **réaligné à chaque palier** (matrice officielle) ; Node 24.18.1
  conservé provisoirement (changement Node hors ticket) ; Expo Go iPhone
  **après** checkpoint SDK 57.
- **Non affirmé** : runtime, réussite future des migrations, Expo Go final,
  support effectif Node 24 par toutes les deps.
- Checkpoint SDK 55 / **0011E-B** : **non démarré**.

### Résultats — YUNIMOBILE-0011C

- Sync propre Cursor : HEAD de départ = origin/main =
  `e62d4f7bed657e7933efae641f25175a09f0facc` ; merge PR #3 OK ; branche 0011C.
- **Test de chargement Cursor réussi** (session neuve) : `00-project-entry.mdc` et
  `AGENTS.md` dans `always_applied_workspace_rules` ; découverte prouvée pour
  cette session seulement (voir `agent-setup.md`).
- **Google Maps définitif** Web et Mobile ; **Mapbox hérité, à retirer**
  (`@rnmapbox/maps`) ; aucun token/build/env Mapbox ; FastAPI commun non dupliqué.
- **Java 21 / JBR 21 présents** ; choix définitif du JDK **reporté** (0011E) ;
  `JAVA_HOME` et variables Android **non configurées** (persistantes).
- **Aucun Android physique** détecté (`adb devices -l` a démarré le daemon) ;
  **image API 35 disponible**, **aucun AVD** ; cmdline-tools absents.
- Espace diagnostic > 12 Gio. Aucune config persistante, AVD, build, Studio,
  émulateur, Expo/Gradle.
- Décision opérationnelle : **CONDITIONAL READY**. Contenu approuvé après
  corrections CTO.
- **Prochain ticket** : **YUNIMOBILE-0011D** — migration Mapbox → Google Maps.
  **0011E** et **0011F** non lancés.
- Clôture : indexation des quatre fichiers autorisés + commit local
  `docs: prepare Android device strategy` ; aucun push/merge.

### Résultats — YUNIMOBILE-0011B

- Préconditions propres Codex : main, HEAD = origin/main =
  `3ae8bdbb970b0f4e0df796a6864e405a05ba0241`, arbre propre.
- Branche `chore/yunimobile-0011b-disk-cleanup` créée ; seuls trois documents
  autorisés écrits pendant la préparation, sans indexation, commit ni push à ce stade.
- Trois mesures sur 40 secondes ; mesure finale 2026-10-11 21:11:41 Europe/Paris :
  16 508 424 192 octets libres (15,375 Gio). Minimum de 12 Gio déjà atteint :
  ensemble de suppression minimal vide.
- Lots A/B : cinq artefacts historiques et sept caches locaux ; allocations
  26 490 816 + 134 962 416 octets, espace projeté 15,525 Gio.
- 16 Gio non prouvés par les lots recommandables aujourd'hui. C1 VSIX seul :
  scénario 16,409 Gio après fermeture autorisée et inactivité vérifiée ;
  usage actuellement incertain, aucun gain recommandé. Autres C/D exclus.
- Store pnpm, dépendances actives, dépôts Yunicity, Studio/SDK et autres
  protections conservés. Zéro pip-unpack compté, aucun ouvert.
- Contrôles propres en lecture seule, auto-vérification documentaire ; aucune
  revue indépendante. Aucune suppression, installation, ADB, build ou arrêt.
- Décision CTO : terminé — espace suffisant, aucune suppression effectuée.
  15,375 Gio disponibles à la mesure retenue pour la clôture ; minimum de 12 Gio
  atteint. Aucun nettoyage exécuté ; ne pas exécuter les lots A/B/C/D.
  CachedExtensionVSIXs intact, VS Code et installateurs actifs dans le relevé.
  Écart avec la mesure précédente non attribué au ticket, aucun nettoyage effectué.
- Remesurer avant génération/build Android ; ne pas commencer sous 12 Gio.
  Pendant le build, arrêter si l'espace approche 5 Gio lorsque cela peut être
  fait sans corrompre une opération en cours. Aucun build lancé ici.
- Clôture autorisée : indexation explicite des trois documents, contrôles de
  format/diff/index, commit local `docs: assess disk capacity for Android build`
  avec `Ticket: YUNIMOBILE-0011B`. Aucun push, merge, installation ou suppression.

### Résultats — YUNIMOBILE-0011A

- Rapport : `docs/engineering/android-environment-audit.md`. Contrôles propres Codex
  sur `main` @ `ec65162044cbfb5b9dea21beba31666a49b6c8cd` = `origin/main`,
  arbre initial propre ; ticket enregistré avant diagnostics.
- Décision **BLOCKED** pour le build : ~2,63 Gio libres aux trois mesures initiales,
  2,741 Gio en fin d'inventaire ; objectifs 12 Gio minimum / 20 Gio confortables.
- Windows 11 Famille 25H2 ; Node 24.18.1, pnpm 9.15.9, JDK 21.0.6 ; Android Studio,
  SDK 36, build-tools 36.0.0 et NDK 27.1.12297006 présents. Toolchain JDK 17 à
  établir ; JAVA_HOME et variables SDK UNSET. Expo Go insuffisant pour Mapbox.
- Aucun AVD configuré ; appareil non vérifié, serveur ADB non démarré.
  Hyperviseur présent, virtualisation firmware active ; états Hyper-V/VMP/WHP
  non vérifiés faute de droits administrateur, aucun changement Windows.
- Plan mesuré : anciennes extensions 3,939 Gio, VSIX 2,957 Gio, npm 1,221 Gio,
  store pnpm jusqu'à 5,612 Gio non partagés sur 8,579 Gio apparents.
  Scénario prudent ~16,360 Gio libres, gains à confirmer après autorisation.
  933 pip-unpack inaccessibles, taille inconnue, aucune suppression proposée.
- Aucune suppression, installation, génération native, build, contrôle lourd,
  commit ou push. Seuls trois documents changés, non indexés ; HEAD inchangé.
- Auto-vérification documentaire, `git diff --check` sans erreur ; aucune revue
  indépendante. Prochain ticket proposé : YUNIMOBILE-0011B, non lancé.
- Clôture documentaire autorisée explicitement par le CTO : branche
  `docs/yunimobile-0011a-android-audit`, commit local limité au ticket, au rapport
  et à cet état. Statut terminé — audit réalisé ; premier dev build bloqué.
  Aucun nouvel audit, push, merge, installation ou nettoyage pendant la clôture.

### Historique — YUNIMOBILE-0010

- Fichier : `.loop/tickets/YUNIMOBILE-0010.md`. Rapport :
  `docs/engineering/permanent-mobile-extraction.md`.
- Branche `feat/yunimobile-0010-extraction` depuis `main` @
  `380208dedb19722525c92c9d0bcb2872459d00c7` ; intégration commitée puis publiée
  (`2214012305bc549382afe4f02477d947361a9591`), PR #1 fusionnée par merge commit
  `ec65162044cbfb5b9dea21beba31666a49b6c8cd`. `main` local synchronisé ; branches
  feature locale et distante conservées. Ces opérations précèdent l'audit 0011A.
- Application Expo SDK 54 intégrée (`apps/mobile`, `packages/{types,utils,ui}`)
  depuis la baseline 0009, avec divergences volontaires : `typeRoots` local,
  override `postcss` 8.5.18, identifiants personnels neutralisés, newline finale du
  `.gitignore` mobile, ligne vide terminale superflue retirée de 7 fichiers de
  `packages` (détectée par `git diff --cached --check`, changement cosmétique).
- `brace-expansion` 1.1.21, 2.1.7, 5.0.12 vérifiés par le CTO ; aucun override.
- `expo-env.d.ts` volontairement ignoré, conformément à Expo.
- Typecheck, lint, `expo install --check`, `expo-doctor` 18/18 et bundle Android :
  tous exit 0. Aucun dev build ni lancement runtime.
- GO validé par le CTO.
- Verification finale propre par Codex (2026-10-02) : correction EOF deja
  presente ; sept prefixes identiques a la source/baseline 0009, exactement
  un octet `0A` superflu retire par fichier. Detection avant commit par
  `git diff --cached --check` rapportee precedemment ; divergence volontaire
  cosmetique sans effet fonctionnel. Typecheck et lint reexecutes : exit 0,
  lint 51 fichiers, 0 erreur, 0 avertissement. Details dans le ticket et le rapport.
- Index controle : 431 fichiers ; espace libre 2,735 Gio (sous le seuil de
  vigilance de 3 Gio). Statut termine conditionne au commit dans cette sequence.

### Historique — YUNIMOBILE-0009A

- Fichier : `.loop/tickets/YUNIMOBILE-0009A.md` (créé après la réécriture, qui
  exigeait un arbre propre). Rapport : `docs/engineering/git-history-hygiene.md`.
- Auteur et committer des 9 commits de `main` réécrits vers Kyria-Zaire avec
  adresse GitHub noreply vérifiée (`git filter-branch --env-filter`, `main`
  seulement). Ancien HEAD `68b1dd8749dbbc3700ca600a8fc06bb41b85dacf` → nouveau HEAD
  `64ec1d66327bb2da52a8c06abf9e2a581d2ba720`.
- Trees, messages, dates et lignes `Co-Authored-By` identiques ; historique
  linéaire ; `git fsck --full` sans corruption.
- Identité configurée localement ; configuration globale inchangée.
- **Les SHA cités avant cette entrée désignent l'historique d'avant réécriture** :
  correspondance dans le rapport.
- Branche `backup/pre-yunimobile-0009a` et `refs/original` conservées jusqu'à
  vérification du premier push. Aucun push.

### Historique — YUNIMOBILE-0009

- Fichier : `.loop/tickets/YUNIMOBILE-0009.md`. Rapport :
  `docs/engineering/mobile-extraction-poc.md`.
- **Commit de départ** : `8c7dfce076b7ead2395225fed2a359f46042ef05`.
- Preuve d'extraction autonome **réussie** : typecheck, lint Expo,
  `expo install --check`, `expo-doctor` (18/18) et `expo export` Android, tous
  exit 0 ; 978 paquets du registre npm ; React 19.1.0 seul.
- Décision CTO : **GO** pour l'intégration permanente (sans réexécution
  indépendante). L'extraction `C:\tmp\yunimobile-0009-extract` est la référence technique ;
  YUNIMOBILE-0010 réutilisera sa baseline sans nouvelle résolution (lockfile copié
  tel quel ; empreintes au § 11 du rapport). `node-linker=hoisted` est un choix
  délibéré. Versions acceptées comme baseline : `@rnmapbox/maps` 10.3.5,
  `react-native-qrcode-svg` 6.3.26, `@babel/core` 7.29.7.
- Gates avant le premier dev build : audit des overrides de sécurité du monorepo ;
  lockfile inchangé après copie ; `react`/`react-dom` 19.1.0 sans React 18 ; tests
  de `utils` documentés ; bundle Metro jamais présenté comme build natif.
- Limites : aucun dev build, aucun lancement, aucune preuve d'exécution, aucun
  build natif. Caches `~/.expo` conservés.
- Source, copie 0007 et extraction inchangées par la clôture ; commit local, sans
  push.

### Historique — YUNIMOBILE-0008

- Fichier : `.loop/tickets/YUNIMOBILE-0008.md`. Rapport :
  `docs/engineering/mobile-expo-compatibility.md`.
- **Commit de départ** : `2f148a5168c73b8742411db00e7e93c8a039e800`.
- Copie `C:\tmp\yunimobile-0007-diag` conservée ; journaux dans `logs/YUNIMOBILE-0008`.
- `expo install --check` : exit 1, 4 écarts de versions correctives SDK 54.
- `expo-doctor` 1.20.4 : exit 1, 15/18 ; échecs : Metro `watchFolders` (cohérent
  avec le monorepo, à ne pas reprendre tel quel), 58 emplacements de React (risque
  de résolution à éliminer pendant l'extraction ; plusieurs instances au chargement
  non démontrées), mêmes correctifs SDK.
- Aucune incompatibilité explicite avec Expo SDK 54 détectée, en dehors de ces
  quatre écarts ; aucun build ni comportement d'exécution prouvé.
- Dépendances directes : 29/29 cohérentes.
- Effet de bord observé : 4 fichiers de cache dans `~/.expo`, conservés, ni lus ni
  supprimés ; sans effet sur la copie, la source ou `yunimobile`.
- Revue CTO : diagnostic accepté ; commit local de clôture, sans push.

### Historique — YUNIMOBILE-0007

- Fichier : `.loop/tickets/YUNIMOBILE-0007.md`. Rapport :
  `docs/engineering/mobile-static-diagnostics.md`.
- **Commit de départ** : `cd5bab271d1caad528b1fc6d1c6eb2476a1887d5`.
- Source au SHA audité `ee57ce1d`, inchangée ; diagnostics dans une copie isolée
  conservée pour YUNIMOBILE-0008 : `C:\tmp\yunimobile-0007-diag\` (journaux dans `logs`).
- Typecheck : exit 0, 0 erreur.
- Lint Expo par défaut (`app`, `components`) : exit 0, 0 warning.
- Lint étendu (package complet) : exit 0, 1 warning
  (`react-hooks/exhaustive-deps`, `hooks/use-search.ts:115`), documenté comme
  dette, non corrigé.
- Revue CTO : audit statique approuvé ; les résultats renforcent l'option A sans
  décider la stratégie.
- Blocage disque initial levé (sept `.next-build` de worktrees supprimés avec
  autorisation, gain 3,98 Gio).
- Limites : dépendances non vérifiées contre le lockfile ; aucun build ni contrôle
  de compatibilité Expo. Commit local de clôture, sans push.

### Historique — YUNIMOBILE-0006

- Fichier : `.loop/tickets/YUNIMOBILE-0006.md`.
- Livrable : `docs/engineering/mobile-reuse-audit.md`.
- **Commit de départ** : `dc9427bede655fc540b22313a6fa6a8f5d284fd7`.
- Source examinée en lecture seule : `C:\Users\kyria\yunicity`, branche
  `feat/c3-global-refonte-preview` @ `ee57ce1d`, arbre propre ; base mobile
  identique sur `origin/main` local.
- Préférence provisoire de l'auteur de l'audit : option B (nouvelle base, reprise
  sélective), la base existante restant dans le monorepo comme référence. **Aucune
  décision CTO** : stratégie de reprise non décidée ; critères de décision au § 10
  de l'audit.
- Revue CTO en conversation ; ajustements appliqués ; contrôles locaux exécutés par
  Claude, sans réexécution indépendante.
- Aucun contrôle exécuté sur l'app ; aucune installation ni modification de la
  source ; commit local de clôture, sans push.

### Historique — YUNIMOBILE-0005

Fichier : `.loop/tickets/YUNIMOBILE-0005.md`. Provenance :
`docs/engineering/skills-provenance.md`.

- **Commit de départ** : `df9f9d118f1f6b4ba528dd5d9ee24a72161e3e54`
  (`docs: audit and select initial engineering skills`).
- Skills documentaires `yunicity-verification` et `yunicity-debugging` : référence
  `.agents/skills/` (Codex), copie identique `.claude/skills/` (Claude Code).
- Revue CTO en conversation ; corrections appliquées ; contrôles locaux exécutés par
  Claude, sans réexécution indépendante.
- **Tests en session neuve** (rapports transmis par Kyria, non réexécutés) :
  - Claude Code : invocation réussie des deux skills depuis `.claude/skills/`,
    contenu adapté confirmé par l'outil Skill ; scénarios fictifs conformes
    (session précédente) ;
  - Codex : deux skills dans le catalogue initial (`.agents/skills/`), contenu
    fourni dans les blocs skill ; scénarios fictifs conformes, sans lecture
    manuelle de secours ;
  - portée : découverte et comportement sur ces scénarios, pas une garantie
    générale de respect des instructions ;
  - Cursor : reporté.
- Aucune configuration globale, plugin, dépendance ni script tiers ; commit local de
  clôture, sans push.

### Historique — YUNIMOBILE-0004

Fichier : `.loop/tickets/YUNIMOBILE-0004.md`. Rapport :
`docs/engineering/skills-selection.md`.

- **Commit de départ** : `ed0adfc8758b6633979bbccb9027932d1219284d`
  (`docs: configure agent entry points`).
- Première installation envisagée : `verification-before-completion` et
  `systematic-debugging`, en **versions locales adaptées** (décisions CTO détaillées
  dans le rapport).
- Différés : `expo-router` (confirmation de la base mobile), `expo-data-fetching`,
  `expo-project-structure`, `skill-creator`.
- Revue CTO en conversation ; ajustements intégrés ; contrôles locaux exécutés par
  Claude, sans réexécution indépendante.
- Aucune installation, aucun script tiers exécuté ; commit local de clôture, sans
  push.

### Historique — YUNIMOBILE-0003

Fichier : `.loop/tickets/YUNIMOBILE-0003.md`.

- **Commit de départ** : `9195adb6af1ecc612397f21e6ec5584dc3d7488b`
  (`docs: add shared agent doctrine and loop protocol`).
- **Points d'entrée créés** (inclus dans le commit de clôture de 0.3) :
  - Claude Code : `CLAUDE.md` (importe `@AGENTS.md`) ;
  - Cursor : `.cursor/rules/00-project-entry.mdc` ;
  - Codex : `AGENTS.md` lu directement, sans adaptateur ;
  - documentation : `docs/engineering/agent-setup.md`.
- `AGENTS.md` décrit désormais ces points d'entrée existants.
- Revue du contenu par le CTO en conversation ; contrôles locaux exécutés par Claude,
  sans réexécution indépendante.
- **Tests de session** (rapports transmis en conversation, non réexécutés) :
  - Claude Code : instructions du projet et import `@AGENTS.md` présents dans le
    contexte initial, selon son rapport sans outil ;
  - Codex : doctrine présente, comportement conforme ; mécanisme natif de
    chargement non vérifiable ;
  - Cursor : test reporté à la demande de Kyria, jusqu'au 7 octobre.

### Historique — YUNIMOBILE-0002

- Texte transmis en conversation ; aucun fichier de ticket enregistré dans
  `.loop/tickets/` (antérieur à la règle d'enregistrement).
- Revue CTO du contenu effectuée en conversation ; ajustements demandés puis réalisés.
- Validation du contenu effectuée en conversation par le CTO.
- Contrôles locaux exécutés par Claude, sans réexécution indépendante.

## État du dépôt

- **Commit de base** : `f9964e425b0c9bc04d2260904354021fb4aaac33`
  (`chore: bootstrap mobile repository`).
- Les fichiers de YUNIMOBILE-0002 sont inclus dans le commit de clôture de 0.2.
- Les fichiers de YUNIMOBILE-0003 sont inclus dans le commit de clôture de 0.3.
- Les fichiers de YUNIMOBILE-0004 sont inclus dans le commit de clôture de 0.4.
- Les fichiers de YUNIMOBILE-0005 sont inclus dans le commit de clôture de 0.5.
- Les fichiers de YUNIMOBILE-0006 sont inclus dans le commit de clôture de 0.6.
- Les fichiers de YUNIMOBILE-0007 sont inclus dans le commit de clôture de 0.7.
- Les fichiers de YUNIMOBILE-0008 sont inclus dans le commit de clôture de 0.8.
- Les fichiers de YUNIMOBILE-0009 sont inclus dans le commit de clôture de 0.9.
- Les fichiers de YUNIMOBILE-0010 sont inclus dans le commit local sur
  `feat/yunimobile-0010-extraction`, publié puis fusionné dans `main` par la PR #1.
- Publication et merge de 0010 effectués avant cet audit ; aucun push ni merge
  effectué pendant YUNIMOBILE-0011A. `main` et `origin/main` sont à
  `ec65162044cbfb5b9dea21beba31666a49b6c8cd`.
- Historique réécrit par YUNIMOBILE-0009A (identité) ; branche locale
  `backup/pre-yunimobile-0009a` conservée.
- Application Expo intégrée sur la branche `feat/yunimobile-0010-extraction`
  (YUNIMOBILE-0010), désormais présente sur `main` après le merge de la PR #1.
- Skills documentaires `yunicity-verification` et `yunicity-debugging` présents
  dans `.agents/skills/` et `.claude/skills/` (YUNIMOBILE-0005).
- `.claude/rules/` existe localement, vide (non suivi par Git).

## Dépôt lié

- Une base Expo existe dans `frontend/apps/mobile` de
  <https://github.com/Kyria-Zaire/yunicity.review>.
- Son extraction permanente est intégrée dans `main` depuis YUNIMOBILE-0010.

## Décisions ouvertes

- Reprise de la base Expo existante : **décidée** (CTO, 2026-10-02, YUNIMOBILE-0008).
  Option A sous forme d'extraction contrôlée : réutiliser écrans, routes, composants
  et logique ; ne pas copier aveuglément la structure du monorepo ; application Expo
  autonome dans `yunimobile` ; remplacement progressif des imports `@yunicity/*` par
  des modules repris ou des packages au partage justifié ; une seule résolution React
  compatible SDK 54 ; configuration Metro adaptée à un projet autonome ; alignement
  des quatre correctifs SDK 54 ; mobile du monorepo gardé en référence en lecture
  seule jusqu'à la parité.
- Distribution des packages partagés entre web et mobile.
- Traitement de `debug.keystore` (actuellement ignoré comme tous les keystores).
- Identité Git : corrigée localement et dans l'historique (YUNIMOBILE-0009A) ;
  suppression de la branche de récupération après vérification du premier push.
- Plugin Superpowers 6.4.1 installé globalement (Claude Code, portée utilisateur,
  hook `SessionStart`) : **conservé inchangé** ; coexistence avec les versions
  locales adaptées documentée ; traitement du doublon à décider.
- Skills pour Cursor : non configurés.
- Test Cursor de chargement adaptateur (0.3) : **consigné** le 2026-10-11
  (YUNIMOBILE-0011C) — découverte prouvée pour cette session, pas une garantie
  générale de respect des consignes.
- Cartographie mobile : migration **statique** Mapbox → `react-native-maps`
  **réalisée** (0011D) ; Google Maps Android/iOS runtime **non prouvés** ;
  Mapbox retiré du chemin carte mobile ; helpers utils Mapbox conservés (Web) ;
  FastAPI commun.
- Compatibilité Expo Go iPhone : **levée** (2026-10-13, 0011G) — retour
  App Store **57.0.9** / SDK **57** ; provenance de l’ancien Go 58 =
  **TestFlight** (build 1017888) selon captures.
- Stratégie runtime : **Option E** retenue (0011E-E) ; SDK 58 beta **toujours
  non retenu**. **Évolution 2026-10-13 (0011G)** : la priorité opérationnelle
  devient **poursuivre les tests iPhone avec une API de test isolée** (sans
  toucher à la QA Web). Cela **actualise** la décision antérieure
  « Android d’abord » sans annuler les constats Android de 0011F-A.
- Android : préparation **en pause** — JDK **17 absent** ; Java 21/23 non
  retenus ; aucun AVD ; avdmanager absent ; image API 35 Play x86_64
  installée ; mémoire limitée au diagnostic 0011F-A. **0011F-JDK17** /
  reprise AVD : non lancés. Aucun JDK installé ni achat Apple requis pour
  le smoke Expo Go iPhone.
- API mobile depuis iPhone : **connectivité Preview prouvée** ; parcours
  login → zone protégée → logout **consigné** (0011J). Reload session :
  **PASS** (0011K). Carte Preview : fond + pan/zoom + recentrage Reims
  **PASS** ; fournisseur observé **Apple Maps** ; marqueurs/fiche
  **NON TESTÉS** ; absence d’événements, cause **non déterminée**.
  **Google Maps** reste la cible définitive Web + Mobile, **non validée**
  sur iOS. Refresh/expiration tokens et builds natifs : **non validés**.
  **Pas** de validation globale auth/sécurité.

### Détail technique — YUNIMOBILE-0011E-B (complément historique)

- Migration SDK **54 → 55** : Expo `~55.0.31`, React `19.2.0`, RN `0.83.10`,
  Router `~55.0.18`, maps `1.27.2` ; `newArchEnabled` retiré.
- Baseline : incident `npm config get registry` (warn `node-linker`) classé
  non bloquant CTO — incompatibilité lecture npm/pnpm ; `.npmrc` inchangé ;
  registre confirmé par `pnpm config get registry`.
- Install : 3 ENOENT Windows/pnpm incrémentaux ; **4ᵉ action** (clean
  `node_modules`) **hors protocole** (limite 3 dépassée) mais réussie ;
  **ne pas** reproduire comme procédure normale ; 0011E-C/D : arrêt + décision
  CTO ; clean `node_modules` à prévoir **dès le ticket** si besoin.
- Gates exit 0 : typecheck ; lint ; `expo install --check` ; expo-doctor
  **1.20.4** 20/20 ; export Android hors dépôt (1845 modules) ; pas de Mapbox ;
  `git diff --check`.
- Complément / finalisation revue CTO (2026-10-12 13:15–13:25) : **sans**
  réinstall, **sans** modification deps/config, **sans** relancer export/doctor.
  - Provenance doctor : version/registre/intégrité artefact **vérifiables** ;
    limite lien process (`@latest`, corrélation) ; pin obligatoire ensuite.
  - Typecheck sans `.expo` : exit **0** ; `fc.exe` exit 1 = mtimes dossiers ;
    empreintes fichiers **identiques** → restauration conforme.
- GO CTO clôture (2026-10-12 13:43) : ticket **terminé** — migration
  statique Expo SDK 55 réussie ; runtime / build natif / Expo Go **non
  exécutés** ; écart des quatre tentatives **conservé**.
- **0011E-C** (SDK 56) **non démarré**.

## Prochaine étape proposée

1. **YUNIMOBILE-0011I** — construction API mobile isolée (**non créé /
   non lancé**) ; revérifier RAM / contexte avant exécution ; préserver
   QA 8010.
2. Android (pause) : **0011F-JDK17** puis AVD / **0011F-B** lorsque
   ressources et priorité le permettront.
3. SDK 58 beta / EAS iOS : **non commencés**.
4. Suite iPhone éventuelle (marqueurs / Google Maps iOS) : **non lancée**.

0011J et 0011K **terminés** (limites carte/session conservées). API
mobile isolée : config prête (0011H) ; build / runtime non lancés.

### Clôture autorisée par le CTO (2026-10-02)

- Blocage d'autorisation levé par instruction explicite du CTO en conversation.
- Preuves applicatives antérieures réutilisées : typecheck et lint propres Codex
  exit 0, lint 51 fichiers, 0 erreur, 0 avertissement ; contrôles Expo et bundle
  réussis selon les rapports Claude, non réexécutés par Codex.
- Sept corrections EOF vérifiées (exactement −1 octet par fichier, préfixes
  identiques) ; `git diff --cached --check` réussi après correction, sans sortie.
- Nettoyages arrêtés : deux refus d'accès sur `.bin/acorn` de la copie 0007 ;
  inventaire intact confirmé après la première tentative, aucun dossier supprimé.
  Inventaire `pip-unpack-*` interrompu par un refus d'accès avant toute suppression.
  Aucun autre nettoyage tenté ; dépendances de Yunimobile et de 0009 conservées.
- Dérogation CTO au seuil de 3,5 Gio limitée à la clôture documentaire et au commit,
  avec contrôle d'espace libre supérieur à 2,5 Gio. Aucune installation, aucun
  bundle, typecheck, lint ou outil Expo relancé. Mesure avant clôture : 2,747 Gio.
- Commit local autorisé de 431 fichiers ; statut final valable après réussite
  du commit dans cette séquence. Aucun push, merge ou prochain ticket.
