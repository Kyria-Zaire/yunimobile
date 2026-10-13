# Smoke test runtime iPhone — YUNIMOBILE-0011G

- **Ticket** : YUNIMOBILE-0011G
- **Date des preuves** : 2026-10-13 (Europe/Paris)
- **Nature** : consignations documentaires uniquement — **aucun** nouveau
  test exécuté dans ce ticket
- **Branche documentaire** : `docs/yunimobile-0011g-iphone-runtime`
- **Base** : `99e5ed08540d817ef7f2aa27464f0c37ce27948d`

## 1. Provenance des preuves

| Champ | Valeur |
|---|---|
| Source | Rapports utilisateur (Kyria) et captures |
| Réexécution agent | **Non** |
| Captures dans le dépôt | **Non** intégrées |
| Code testé | Branche `chore/yunimobile-0011f-a-android-avd` @ `3d361cc707ad45460c8b5a35706b4c4f36f7fb7e` |
| Projet | Expo SDK **57** |

Aucune durée, résultat ou commande inventée au-delà des constats transmis.

## 2. Expo Go — versions et provenance

| Observation | Détail (preuve utilisateur) |
|---|---|
| TestFlight | Distribuait Expo Go **58.0.2**, build **1017888** |
| Fiche App Store | Proposait Expo Go **57.0.9** |
| Après retour App Store (capture) | Client Version **57.0.9** ; Supported SDK **57.0.0** |

**Conclusion** : le blocage « Go 58 vs projet 57 » est **levé** par le
retour à la version App Store. La provenance de l’ancien Expo Go 58 sur
l’iPhone est **démontrée** : **TestFlight** (captures utilisateur), et non
plus « non vérifiée ».

## 3. Smoke UI / runtime (transmis)

| Contrôle | Résultat |
|---|---|
| Connexion LAN à Metro | Réussie |
| JavaScript Yunicity | Exécuté |
| Accueil (index) | Affiché |
| Login | Affiché |
| Register | Affiché |
| Navigation vers ces écrans | Observée |
| Retour arrière | **Non validé** |
| Authentification effective | **Non validée** |
| Inscription effective | **Non validée** |
| Carte | **Non validée** |
| Persistance de session | **Non validée** |
| Build natif iOS | **Non prouvé** |
| Build natif Android | **Non prouvé** |

## 4. Diagnostic API (rapport Cursor — séparé des captures UI)

Diagnostic en lecture seule rapporté pendant la session de test (agent),
sans modification de configuration.

| Point | Constat |
|---|---|
| Variable attendue | `EXPO_PUBLIC_API_URL` |
| Présence dans la session Metro | **Absente** (UNSET ; aucun `.env*` sous `apps/mobile`) |
| Secours code | `http://127.0.0.1:8010` (`getExpoApiBaseUrl` / `DEFAULT_SERVER_API_URL`) |
| Effet sur iPhone | `127.0.0.1` désigne le **téléphone**, pas le PC |
| Appel mobile | `{base}/api/v1/health` |
| Message UI | « Impossible de joindre l’API… » — branche **réseau** de `safeFetch` (**sans** statut HTTP) |
| Processus sur 8010 | Stack Docker **QA Web** (`yunicity-backend-qa`, projet `yunicity-qa`) |
| Publication | `127.0.0.1:8010` → conteneur **8000** (localhost only) |
| Depuis le PC | `GET /api/v1/health` → **HTTP 200** |
| Depuis le LAN (IP poste) | Publication **inaccessible** |

**Accès API depuis l’iPhone** : **non validé**.

## 5. Limites

- Pas de réexécution agent des scénarios UI.
- Pas de preuve d’auth, d’inscription réussie, de carte ni de session.
- Pas de build natif.
- Plan backend isolé `yunicity-mobile-dev` : proposition antérieure
  **non exécutée** dans ce ticket.

## 6. Suite proposée (non lancée)

**YUNIMOBILE-0011H** — préparation de l’environnement API mobile isolé
pour l’iPhone, avec ressources disponibles et **préservation intégrale**
de la QA Web. Aucun choix implicite de seed, compte de test ou données.
Ticket **non créé** dans cette passe.
