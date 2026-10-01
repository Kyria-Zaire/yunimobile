# Audit de reprise de la base mobile Expo

Audit YUNIMOBILE-0006, réalisé le 2026-10-01 par Claude Code, en lecture seule.
Aucune migration, installation, exécution de script projet, build ni test applicatif.
Ajusté après revue CTO en conversation. **La stratégie de reprise n'est pas
décidée** : la recommandation du § 10 est une préférence provisoire de l'auteur de
l'audit.

Sauf mention contraire, les constats portent sur la source au commit
`ee57ce1dfc37835a47335e56338578471a95ec7d`. Trois natures sont distinguées :

- **lecture du code** : ce que le code contient ;
- **déduction** : comportement attendu d'après le code, non observé ;
- **non exécuté** : aucun comportement n'a été observé à l'exécution.

## 1. État de la source et preuves

### Dépôts

| Élément | `yunimobile` (travail) | `yunicity` (source, lecture seule) |
|---|---|---|
| Chemin | `C:\Users\kyria\yunimobile` | `C:\Users\kyria\yunicity` |
| Remote `origin` | `Kyria-Zaire/yunimobile` | `Kyria-Zaire/yunicity.review` |
| Branche | `main` | `feat/c3-global-refonte-preview` (**pas `main`**) |
| HEAD | `dc9427bede655fc540b22313a6fa6a8f5d284fd7` (baseline attendue) | `ee57ce1dfc37835a47335e56338578471a95ec7d` (2026-09-04) |
| `git status --short` au départ | vide | vide (aucun fichier suivi modifié, aucun non suivi) |

- Source : 8 entrées de stash et plusieurs worktrees liés existent ; ni lus ni
  modifiés.
- `origin/main` local : `3e0b27bae45741d59845acdcc519ef9c786f660d` (2026-08-29),
  12 commits derrière HEAD. Dernier `FETCH_HEAD` : 2026-09-14. Aucun fetch n'a été
  fait : l'état réel du remote n'est pas connu.
- `git diff --stat origin/main HEAD -- frontend/apps/mobile` → aucune sortie : la
  base mobile est **identique** sur HEAD et sur `origin/main` local.
- Arbre de travail propre : pour les fichiers suivis, contenu de l'arbre = état
  commité. Fichiers ignorés présents sous `frontend/apps/mobile` : `.env`, `.expo/`,
  `.turbo/`, `node_modules/` (`.env` non ouvert).
- Les commandes Git sur la source ont été lancées avec `git --no-optional-locks`
  pour ne pas réécrire l'index.

### Base mobile

- Chemin : `frontend/apps/mobile` ; 76 fichiers suivis.
- 27 commits l'ont modifiée ; dernier : `2558cbc5` (2026-07-06,
  `feat(platform): mobile refonte web, post composer et hardening beta`). Depuis,
  l'activité du monorepo porte surtout sur le web (« refonte C3 »).
- Aucun dossier `ios/` ni `android/` ; aucun `eas.json`, `app.config.*`,
  `google-services.json` ni `GoogleService-Info.plist` dans le dépôt. L'absence de
  dossiers natifs est normale dans un projet Expo qui les génère à la demande
  (prebuild) : elle ne prouve ni la possibilité ni l'impossibilité d'un build.

## 2. Versions

| Élément | Déclarée (`frontend/apps/mobile/package.json`) | Lockfile (`frontend/pnpm-lock.yaml`) | Installée (`node_modules` local) |
|---|---|---|---|
| Expo | `~54.0.34` | 54.0.34 | 54.0.34 (racine `frontend/node_modules`) |
| React Native | `0.81.5` | 0.81.5 | 0.81.5 |
| React | `19.1.0` | 19.1.0 | 19.1.0 (`apps/mobile/node_modules`) ; 18.3.1 à la racine (web/admin) |
| Expo Router | `~6.0.23` | 6.0.23 | 6.0.23 |
| TypeScript | `^5.8.3` | 5.9.3 | 5.9.3 |
| `@types/react` | `~19.1.0` | 19.1.17 | 19.1.17 (mobile) ; 18.3.20 (racine) |
| `react-native-reanimated` | `~4.1.1` | 4.1.7 | 4.1.7 |
| `@rnmapbox/maps` | `^10.3.1` | — (non relevé) | 10.3.1 |

- Gestionnaire : `pnpm@9.15.9` (`frontend/package.json`, `packageManager`) ;
  lockfile v9.0 ; Node `>=20`. Poste local : Node v24.18.1, pnpm 9.15.9.
- `frontend/.npmrc` : `node-linker=hoisted` et hoisting public de `*expo*`,
  `*react-native*`, `@types/react*`.
- `frontend/package.json` : React 18.3.1 pour web/admin, **overrides**
  `mobile>react: 19.1.0`, `mobile>react-dom`, `mobile>@types/react`.
- La date d'installation de `node_modules` n'est pas connue : rien ne prouve qu'il
  correspond au lockfile actuel.
- **Écarts à vérifier** (hypothèses, non testées) : le lockfile résout
  `react-native-worklets@0.8.3` (non déclaré, pair de Reanimated 4) et
  `@react-native/metro-config@0.85.3` sous RN 0.81.5. Leur compatibilité avec
  SDK 54 n'a pas été vérifiée (`npx expo install --check` / `expo-doctor` non
  exécutés).

## 3. Inventaire fonctionnel

Critère : un écran est classé « appel API » quand son code appelle `yunicityApi`,
`createAuthClient` ou une fonction d'API de `@yunicity/utils`. Cela prouve un appel
codé, **pas** un fonctionnement : aucun écran n'a été exécuté.

| Zone | Routes (`app/`) | Données | Observations |
|---|---|---|---|
| Accueil | `index.tsx` | `/api/v1/health` via `safeFetch` | Écran de développement (« Mobile — fondation auth », panneau de santé, liens). |
| Auth | `login.tsx`, `register.tsx` | `client.login` / `client.register` | Pas d'écran mot de passe oublié. |
| Garde | `(protected)/_layout.tsx` | état `useAuth` | Redirection `/login` si non authentifié. |
| Onglets | `(tabs)/_layout.tsx` | — | 8 onglets : Fil, Moments, Carte, Quartiers, Tribus, Passport, Profil, Lieux. |
| Fil | `(tabs)/feed`, `components/feed/feed-screen.tsx` | `listFeed`, `listFeedComments` | Composer, likes, commentaires, signalement. |
| Événements | `(tabs)/events`, `events/[id]` | `listEvents` | — |
| Carte | `(tabs)/map`, `components/map/*` | `listMapEvents` | Module natif `@rnmapbox/maps` : dev build requis, pas Expo Go (commentaire de `.env.example` dans la source, non vérifié) ; message `MAP_TOKEN_MISSING_EXPO` si jeton absent. |
| Quartiers | `(tabs)/neighborhoods`, `neighborhoods/[slug]` | `listNeighborhoods`, contexte | — |
| Tribus | `(tabs)/tribes`, `tribes/[slug]`, `tribes/invitation` | `listTribes`, posts, membres, invitations | Invitation par saisie manuelle d'un jeton. |
| Passport | `(tabs)/passport`, `passport/present` | profil, Passport, tampons, offres, QR | `passport-card` affiche une **grille QR factice** (« QR citoyen — scan à venir ») ; `passport/present` affiche le QR réel. |
| Profil | `(tabs)/profile` | `getProfileMe`, `updateProfileMe`, onboarding | — |
| Organisations | `(tabs)/organizations`, `organizations/request` | liste, demande | — |
| Offres partenaires | `partner-offers/{index,new,[id]}` | `partnerOffers.*` | Dates saisies en texte (`2026-05-19T20:00`). |
| Scan partenaire | `partner-scan/{index,scan,manual,offers,result}` | `scan.*` | Caméra `expo-camera` ; secret QR transmis par paramètre de navigation (voir « Extraits de code »). |
| Notifications | `notifications/index`, `components/push-notifications-card.tsx` | boîte, push | Jeton Expo Push sans `projectId` EAS configuré. |
| Recherche | `search.tsx`, `components/search/*` | `searchLocal` | — |

- Aucune donnée simulée trouvée (`mock`, `fake`, `dummy`, `lorem`) ; les occurrences
  de `placeholder` sont des attributs de champ, sauf la grille QR factice.
- Les présentateurs « mobile » de `@yunicity/utils` (`*-mobile-presenter.ts`,
  `*-mobile-labels.ts`) ne sont pas importés par l'app native : ils servent le web
  responsive. L'interface native n'a pas suivi la refonte web récente.

### Authentification

| Point | Constat | Fichier |
|---|---|---|
| Connexion / inscription | `AuthClient` partagé, plateforme `mobile` | `packages/utils/src/auth/auth-client.ts`, `apps/mobile/lib/auth-provider.tsx` |
| Stockage | Access et refresh token dans `expo-secure-store` | `apps/mobile/lib/secure-storage.ts` |
| Refresh | Sur 401 : refresh par corps JSON (`refresh_token`), en-tête `X-Client-Platform: mobile`, une tentative au plus (`RefreshManager`) | `auth-client.ts`, `refresh-manager.ts` |
| Backend | Supporte ce mode (`is_mobile_client`, refresh par corps, refresh renvoyé aux clients mobiles) | `backend/app/api/v1/auth.py` |
| Déconnexion | `POST /logout` avec refresh token, puis effacement local même en cas d'échec | `auth-client.ts` |
| Démarrage | Si `me()` échoue, refresh puis `me()` ; toute erreur de cette séquence efface les jetons (lecture du code). Déconnexion au lancement hors ligne : déduction, non exécutée | `auth-provider.tsx` |
| Erreurs | `humanizeAuthFailure` ; 16 `catch {}` sans journalisation dans l'app, et un dans `authenticatedFetch` qui masque la cause du refresh | voir § 7 |
| URL | `EXPO_PUBLIC_API_URL`, repli `http://127.0.0.1:8010` (adresse de boucle locale, HTTP clair) ; aucun profil par environnement trouvé | `packages/utils/src/api-base-url.ts` |

### Extraits de code

Source : `Kyria-Zaire/yunicity.review` au commit
`ee57ce1dfc37835a47335e56338578471a95ec7d`, lus le 2026-10-01 (`git show` ou arbre
propre identique). Extraits abrégés (`...`) ; aucune valeur sensible.

**1. Effacement des jetons au démarrage** —
`frontend/apps/mobile/lib/auth-provider.tsx`, fonction `bootstrap` :

```tsx
const access = await storage.getAccessToken();
if (!access) {
  return;
}
try {
  const me = await client.me();
  ...
} catch {
  await client.refreshAccessToken();
  const me = await client.me();
  ...
}
...
} catch {
  await storage.clear();
  ...
}
```

- Lecture du code : toute erreur levée par `me()`, puis par
  `refreshAccessToken()` ou le second `me()`, aboutit à `storage.clear()` ; aucune
  distinction entre un 401 et un échec réseau.
- Lecture du code : dans `frontend/packages/utils/src/auth/auth-client.ts`,
  `authenticatedFetch` appelle `clearSession()` dans un `catch` sans paramètre quand
  le refresh échoue.
- Déduction : un lancement sans réseau avec des jetons stockés déconnecterait
  l'utilisateur.
- Non exécuté : comportement non observé.

**2. URL API de repli** — `frontend/packages/utils/src/api-base-url.ts` :

```ts
const DEFAULT_SERVER_API_URL = "http://127.0.0.1:8010";
...
export function getExpoApiBaseUrl(): string {
  return getApiBaseUrl(
    typeof process !== "undefined" ? process.env.EXPO_PUBLIC_API_URL : undefined,
  );
}
```

- Lecture du code : `getApiBaseUrl` renvoie le repli quand la valeur est absente ou
  vide. `.env.example` déclare `EXPO_PUBLIC_API_URL` (exemple : URL locale, valeur
  non reproduite) et `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` (vide). Aucun `app.config.*` ni
  `eas.json`.
- Déduction : sans variable définie au build, un appareil physique viserait sa
  propre boucle locale et n'atteindrait pas l'API.
- Non exécuté : comportement non observé.

**3. Secret QR dans les paramètres de navigation** —
`frontend/apps/mobile/app/(protected)/partner-scan/scan.tsx` :

```tsx
router.replace({
  pathname: "/(protected)/partner-scan/offers",
  params: { qr_secret: data },
});
```

`frontend/apps/mobile/app/(protected)/partner-scan/offers.tsx` :

```tsx
const { qr_secret: qrSecret } = useLocalSearchParams<{ qr_secret: string }>();
...
const data = await yunicityApi.scan.resolvePassport({ qr_secret: qrSecret });
...
        qr_secret: qrSecret,   // l. 65
...
        params: {              // l. 69
```

- Lecture du code : la valeur scannée est transmise par paramètre de navigation, puis
  réutilisée aux lignes 65 et 69 (contexte complet de ces lignes non reproduit).
- Non démontré : conservation dans l'historique, journalisation ou exposition par
  Expo Router. Point à vérifier, pas un défaut établi.

## 4. Dépendances au monorepo

| Dépendance | Usage par l'app | Contenu du package |
|---|---|---|
| `@yunicity/types` (`workspace:*`) | 38 imports, 38 types (auth, feed, events, map, passport, tribes, search…) | Sources TS, `exports` vers `src/index.ts` |
| `@yunicity/utils` (`workspace:*`) | 42 imports, 158 symboles : `createAuthClient`, `createYunicityApi`, `getExpoApiBaseUrl`, `safeFetch`, `TokenStorage`, formateurs et nombreux libellés | 294 fichiers non-test, barrel `src/index.ts` de 5 375 lignes, code web/admin inclus ; dépend de `@yunicity/types` |
| `@yunicity/ui` (`workspace:*`) | 1 import : `@yunicity/ui/brand` (`constants/brand.ts`) | Tokens, CSS, preset Tailwind, primitives React DOM ; pairs `react`, `react-dom` |

- Les packages sont consommés **en source TypeScript**, sans build. Metro les résout
  via `metro.config.js` : `watchFolders = frontend/`, `nodeModulesPaths` local et
  racine.
- L'import par le barrel `@yunicity/utils` crée un **risque de couplage** : l'app
  dépend d'un point d'entrée qui expose tout le package. Le graphe Metro et le
  contenu réellement embarqué n'ont pas été mesurés. Le code navigateur (`window`, `localStorage`, `sessionStorage`,
  `navigator`) est protégé par `typeof window`, sauf `document.getElementById` dans
  `settings-desktop-presenter.ts`, appelé seulement côté web.
- Extraire l'app exige au minimum : les types utilisés, `AuthClient` +
  `RefreshManager` + `auth-errors`, `TokenStorage`, la façade `yunicity-api.ts` et
  ses modules d'API, les libellés et formateurs utilisés, `brand-tokens.ts`.

## 5. Configuration

| Élément | Constat |
|---|---|
| `app.json` | `name` Yunicity, `slug` `yunicity-mobile`, `scheme` `yunicity`, bundle iOS et package Android `com.yunicity.mobile`, `newArchEnabled: true`, `typedRoutes`, plugins `@rnmapbox/maps`, `expo-router`, `expo-camera` (texte d'autorisation), `expo-font`, `expo-notifications`. Pas de `extra.eas.projectId`, de `runtimeVersion` ni de `updates`. Cible `web` (Metro, `static`) déclarée. |
| `tsconfig.json` | Hérite de `expo/tsconfig.base`, `strict: true`, alias `@/*`. Pas de `noUncheckedIndexedAccess`, contrairement à `frontend/tsconfig.base.json` : amélioration possible, pas un blocage établi. |
| `babel.config.js` | `babel-preset-expo` + `react-native-reanimated/plugin`. |
| `metro.config.js` | Spécifique au monorepo (cf. § 4). |
| `.eslintrc.js` | `eslint-config-expo` (format eslintrc, ESLint 8). |
| Assets | 1 fichier suivi : `assets/yunicity-mascot.png` (icône et icône adaptative). Pas de splash dédié. |
| Variables publiques (`.env.example`, noms seulement) | `EXPO_PUBLIC_API_URL` (exemple : URL locale) ; `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` (vide). Le code lit aussi `EXPO_PUBLIC_MAPBOX_TOKEN` en repli, absent de l'exemple. |

## 6. Tests, commandes, CI, builds

- Scripts : `dev`/`start`, `android`/`ios` (`expo start`), `lint` (`expo lint`),
  `typecheck` et `build` (**tous deux `tsc --noEmit`** : « build » ne produit aucun
  binaire).
- Tests : aucun fichier de test ni script `test` dans l'app. Des tests Vitest existent
  dans `packages/utils` et `packages/ui`.
- CI : `.github/workflows/frontend-ci.yml` exécute dans `frontend/` :
  `pnpm install --frozen-lockfile`, `lint`, `typecheck`, `test`, `build` via Turbo ;
  l'app mobile y est donc lintée et typecheckée. Aucun job de build natif, EAS ou
  publication. Résultats CI non consultés.
- Builds Android/iOS : aucune preuve dans le dépôt (pas d'EAS, pas de projet natif
  versionné, pas de workflow).
- Prérequis de publication absents : compte et projet EAS, identifiants de signature,
  fiches stores, propriété de `com.yunicity.mobile`, politique de confidentialité,
  configuration push (APNs/FCM).

## 7. Risques de reprise

| Risque | Gravité estimée | Détail |
|---|---|---|
| Build natif non prouvé | Élevée | Aucun build Android/iOS observable dans le dépôt (ni workflow, ni EAS). Cela ne démontre pas une impossibilité de build. Contrainte distincte : le module natif Mapbox exige un dev build (selon la source, non vérifié). |
| Couplage monorepo | Élevée | `workspace:*`, Metro, hoisting `.npmrc`, overrides React 18/19 ; import par le barrel d'un package `utils` de 294 fichiers mêlant web, admin et mobile (risque ; contenu embarqué non mesuré). |
| Dépendances résolues | Moyenne | `react-native-worklets@0.8.3`, `@react-native/metro-config@0.85.3` à vérifier. |
| SDK cible | Moyenne | SDK 54 (RN 0.81) ; version Expo à retenir non vérifiée à date. |
| Secret QR | À évaluer | `qr_secret` scanné transmis par paramètre de navigation (`partner-scan/scan.tsx` → `offers.tsx`). Conservation, journalisation ou exposition non démontrées. |
| Session au démarrage | Moyenne | D'après le code, toute erreur au démarrage efface les jetons ; déconnexion hors ligne déduite, non observée (`auth-provider.tsx`). |
| Erreurs silencieuses | Moyenne | 16 `catch {}` dans l'app ; cause du refresh masquée dans `auth-client.ts`. |
| URL par défaut | Moyenne | Repli `http://127.0.0.1:8010` ; pas de configuration par environnement. |
| Secrets embarqués | Faible (constat) | Aucun secret trouvé dans le code suivi. `EXPO_PUBLIC_*` est embarqué dans le bundle : le jeton Mapbox doit être un jeton public restreint. Le jeton de téléchargement Mapbox natif éventuel n'est pas configuré (inconnu). |
| Données personnelles | Faible à moyenne | Profil, Passport, notifications, scan affichés ; aucun log de jeton trouvé (`console.*` absent). |
| Duplication backend | Faible | L'app appelle l'API. Des règles côté client (`canSubmitPartnerOffer`, `canEditPartnerOffer`) existent dans `utils` ; l'autorisation doit rester serveur. |
| Code web | Faible | Protégé par `typeof window` ; cible `web` et `react-dom` présentes dans l'app. |
| Typage | Faible | `noUncheckedIndexedAccess` absent du tsconfig mobile : amélioration possible, pas un blocage établi. |

## 8. Contrôles exécutés et non exécutés

Exécutés (contrôles propres, Claude, 2026-10-01) :

- `git remote -v`, `branch`, `rev-parse`, `status --porcelain --untracked-files=all`,
  `stash list`, `for-each-ref` sur la source, capturés avant et après l'audit.
- `git diff --stat origin/main HEAD -- frontend/apps/mobile` → vide.
- `git ls-tree`, `git show HEAD:<chemin>` et lecture de l'arbre propre pour les
  manifestes, configurations, routes, auth, packages partagés et workflows.
- Recherche de motifs (imports `@yunicity/*`, appels API, `catch {}`, `console.*`,
  URL, `process.env`, API navigateur, marqueurs de placeholder ou de mock).
- Lecture des versions dans `pnpm-lock.yaml` et des `package.json` installés sous
  `node_modules` ; `node --version`, `pnpm --version`.
- Lecture ciblée de `backend/app/api/v1/auth.py` (mode mobile du refresh).

Non exécutés (hors périmètre du ticket : aucune exécution de script projet, build,
test ni service) :

- `pnpm typecheck` / `lint` / `test`, `expo-doctor`, `npx expo install --check`.
- `expo start`, dev build, build EAS, exécution sur appareil ou émulateur.
- `git fetch` (état réel de `origin`) et consultation des résultats CI GitHub.
- Lecture de `.env`, des stashes et des autres worktrees.

## 9. Options

| Critère | A. Extraction de la base existante | B. Nouvelle base, reprise sélective | C. Maintien temporaire dans le monorepo |
|---|---|---|---|
| Principe | Copier `apps/mobile` (± historique) et vendoriser ou publier `types`/`utils`/`ui` | Nouvelle app Expo au SDK retenu dans `yunimobile`, portage écran par écran depuis la base existante comme référence | Laisser l'app dans `yunicity`, `yunimobile` reste vide ou documentaire |
| Délai jusqu'à un premier écran | Court, si le build fonctionne | Moyen | Nul |
| Couplage | Hérité : Metro, overrides, barrel `utils` complet | Choisi : seuls les modules utiles, sous contrat explicite | Inchangé |
| Packages partagés | À résoudre avant tout build | À résoudre, mais sur un sous-ensemble réduit | Aucun travail |
| Dette reprise | Erreurs silencieuses, démarrage hors ligne, secret QR en paramètre, URL par défaut, grille QR factice | Peut être traitée au portage ; correction non garantie, à implémenter et vérifier | Inchangée |
| Montée de SDK | À faire après extraction, sur un code non testé | Choix du SDK au départ ; réussite à démontrer par l'implémentation | Repoussée |
| Historique Git | Conservable | Perdu (référence par SHA) | Conservé |
| Risque principal | Importer une app dont le build n'est pas prouvé, avec tout son couplage | Durée du portage et risque d'écart fonctionnel | `yunimobile` sans objet ; app native en retard sur le web |

## 10. Recommandation

**Préférence provisoire de l'auteur de l'audit** : option B, avec C comme état
transitoire (la base reste dans le monorepo, sans modification, comme référence de
comportement). **Aucune décision CTO n'est acquise** ; la stratégie de reprise reste
ouverte.

Motifs, tirés des constats ci-dessus :

- l'app appelle déjà l'API réelle et le contrat d'auth mobile existe côté backend :
  la logique paraît réutilisable, pas forcément la structure ;
- le couplage au monorepo (barrel `utils`, overrides React, Metro) semble être le
  principal coût d'une extraction ; B viserait à le limiter au besoin, sans que ce
  coût soit encore estimé ;
- aucun build natif n'est prouvé : A reprendrait un état non vérifié ; B permettrait
  de vérifier la base dès son premier ticket ;
- plusieurs défauts (session au démarrage, erreurs silencieuses, URL de repli)
  pourraient être traités au portage. Une nouvelle base ne garantit ni leur
  correction ni une montée de SDK réussie : ces résultats exigent une
  implémentation vérifiée.

Cette préférence dépend des inconnues du § 11 et des critères ci-dessous. Elle ne
devient pas automatiquement la décision si un contrôle échoue.

### Critères de décision

| Critère | Ce qu'il mesure | Limite |
|---|---|---|
| Lint / typecheck de la base existante | État du code | Ne prouve pas un build |
| Compatibilité Expo (`expo-doctor`, dépendances) et build natif | Faisabilité technique de la reprise | Un échec peut être corrigeable : à qualifier, pas à traduire en choix de B |
| Extraction des packages partagés | Coût et périmètre de A comme de B | À estimer avant décision |
| Priorités V1 | Quantité de code réellement utile à reprendre | À définir par le produit |

Un contrôle échoué ne choisit pas B par défaut. Il est analysé (cause, coût de
correction) et la décision revient au CTO.

### Ordre proposé des prochains tickets

1. **Diagnostic typecheck / lint de la base existante**, sans modification de la
   source (méthode d'exécution à autoriser : worktree jetable ou copie hors dépôt).
   Selon ses résultats et l'autorisation : `expo-doctor`,
   `npx expo install --check`, puis dev build Android (inconnues 1 à 3).
2. **Décision d'architecture** : SDK Expo cible, distribution des types et du client
   API (package publié, génération depuis l'OpenAPI du backend, ou copie ciblée),
   structure UI / métier / API.
3. Selon la décision : **bootstrap** (B) ou **extraction** (A) dans `yunimobile`,
   avec lint, typecheck, tests et CI.
4. **Auth et client API** : stockage sécurisé, refresh, déconnexion, démarrage hors
   ligne, configuration par environnement, sans `catch {}` silencieux.
5. **Portage ou reprise des écrans** par lots (Fil et Passport en premier, puis le reste), avec
   tests.
6. **EAS** : projet, profils, signature, push, prérequis de publication.

## 11. Inconnues qui empêchent encore une décision

Chaque inconnue alimente un critère du § 10 ; aucune ne détermine seule l'option.

1. L'app actuelle build-elle et tourne-t-elle sur Android et iOS ? Aucune preuve.
2. Résultats actuels de `typecheck` et `lint` de l'app (CI non consultée).
3. Compatibilité des dépendances résolues (`react-native-worklets`,
   `@react-native/metro-config`) avec SDK 54.
4. SDK Expo cible à date et coût de montée depuis SDK 54.
5. Mode de distribution des packages partagés (décision ouverte dans
   `.loop/state.md`) et existence d'un contrat OpenAPI exploitable.
6. Configuration Mapbox native : jeton de téléchargement, restrictions du jeton
   public, licence.
7. Comptes EAS, Apple et Google ; propriété de `com.yunicity.mobile`.
8. État réel de `origin` sur GitHub (pas de fetch).
9. Parité attendue avec la refonte web : quelles fonctionnalités sont prioritaires
   pour la v1 mobile.
