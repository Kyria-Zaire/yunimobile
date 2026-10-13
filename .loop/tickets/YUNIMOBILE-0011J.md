# YUNIMOBILE-0011J — Test auth iPhone sur API Preview

- **Statut** : terminé — test auth iPhone partiel consigné
- **Créé le** : 2026-10-13
- **Mis à jour le** : 2026-10-13 12:05 (Europe/Paris)

## Objectif

Préparer, encadrer et consigner un test manuel d’authentification
Yunicity iPhone → API Preview, sans stack locale 0011I / mobile-dev.

## Contexte et références

- Connectivité Preview déjà prouvée (capture Kyria 2026-10-13) — voir
  § Preuve connectivité.
- Cible API : `https://api-preview.yunicity.city`
- Isolation Preview (audit lecture seule antérieur) : projet Railway
  distinct de la prod produit ; `APP_ENV=prod` côté appli.
- Branche documentaire : `docs/yunimobile-0011j-iphone-auth-preview`
- Base au démarrage : `main` @ `a63b7687855c5136e1534a54f1fca3e5611afa59`
- Identifiant **0011J** (0011I réservé construction API locale, non créé).

## Périmètre

### Autorisé

- Ticket + `.loop/state.md` ; branche documentaire dédiée.
- Lecture code auth mobile / utils.
- Réutilisation Metro avec `EXPO_PUBLIC_API_URL` Preview (processus
  uniquement).
- Checklist manuelle Kyria (compte Preview existant uniquement).
- Opérations de session de ce compte sur iPhone (login / me / logout)
  pour ce test uniquement.
- Arrêt de **cette** instance Metro en fin de consignation.

### Hors périmètre

- 0011I, stack `yunicity-mobile-dev`.
- Inscription, seed, migration, inventaire utilisateurs.
- Carte, écriture profil, publication, modification de données.
- Affichage de mots de passe / tokens / PII / identités / contenu de
  publications dans rapports.
- `.env`, changements applicatifs, Railway, QA Web.
- Commit / push (livraison **à revoir** sans commit).

## État de départ

- Branche initiale : `main` @ `a63b768…` ; docs de préparation présentes
  localement, préservées lors du passage sur la branche 0011J.
- Metro : actif, `EXPO_PUBLIC_API_URL=https://api-preview.yunicity.city`,
  port 8081 ; aucun `apps/mobile/.env`.

## Preuve connectivité (antérieure — pas l’auth)

Capture utilisateur **2026-10-13** (Kyria, sans réexécution agent) :

- Yunicity sur iPhone, Expo Go **SDK 57** ;
- bouton health : `status=ok`, `service=yunicity-api` ;
- cible session : `https://api-preview.yunicity.city`.

**Constat** : connectivité iPhone → API Preview uniquement.

## Analyse auth (lecture seule — préparation)

### Routes API (`AuthClient`, préfixe `/api/v1/auth`)

| Action | Méthode / chemin |
|---|---|
| Login | `POST /api/v1/auth/login` |
| Session courante | `GET /api/v1/auth/me` |
| Refresh | `POST /api/v1/auth/refresh` |
| Logout | `POST /api/v1/auth/logout` (+ clear local) |

### Stockage / restauration mobile

- `SecureTokenStorage` (`expo-secure-store`) :
  `yunicity_access_token`, `yunicity_refresh_token`.
- Bootstrap (`AuthProvider`) : access → `me()` ; sinon refresh puis
  `me()` ; échec → clear.
- Zone protégée : redirect `/login` si non authentifié.
- Logout UI : profil → `logout()` → `router.replace("/login")`.

### Compte Preview

- Avant test : aucun compte dédié **documenté** dans le dépôt.
- Pendant le test : Kyria a utilisé un **compte Preview existant**
  (saisie sur iPhone uniquement). Identifiants **non** consignés ici.

## Session Expo (préparation)

- URL LAN utilisée : `exp://192.168.1.180:8081`
- Metro réutilisé ; `EXPO_PUBLIC_API_URL` processus =
  `https://api-preview.yunicity.city` ; pas de `.env`.

## Checklist manuelle — résultats

Sources distinctes :

1. **Déclaration utilisateur (Kyria)** — affirmations transmises en
   conversation.
2. **Captures utilisateur** — transmises pour appui ; **non** intégrées
   au dépôt ; **aucune** identité, email, handle, ni contenu de
   publication retranscrits dans ce ticket.

| # | Contrôle | Résultat | Source |
|---|---|---|---|
| 1 | Connexion | Réussie (compte Preview existant) | Déclaration utilisateur |
| 2 | Zone protégée après connexion | Accessible | Déclaration utilisateur (+ captures, sans retranscription) |
| 3 | Fil local et profil affichés | Affichés | Déclaration utilisateur (+ captures, sans retranscription) |
| 4 | Déconnexion | Conforme selon Kyria | Déclaration utilisateur |
| 5 | Comportement après déconnexion (zone protégée / reconnexion) | Conforme selon Kyria | Déclaration utilisateur |
| — | Persistance après Reload (Expo Go) | **NON TESTÉE** | Pas de confirmation explicite |

## Limites — ne pas sur-conclure

Ce ticket **ne** valide **pas** :

- une validation globale d’authentification ou de sécurité ;
- l’expiration / refresh automatique de session ;
- la carte (runtime cartographique iPhone) ;
- les builds natifs iOS / Android ;
- la persistance après Reload (non testée).

Les constats se limitent au parcours manuel login → zone protégée →
logout, sur Expo Go + API Preview, tel que déclaré / appuyé par
captures sans contenu sensible.

## Critères d'acceptation

- [x] Preuve health iPhone → Preview consignée.
- [x] Routes auth + stockage session documentés.
- [x] Compte Preview existant utilisé par Kyria (sans documenter les
  identifiants).
- [x] Checklist auth manuelle consignées (sans secrets / PII) ;
  Reload = NON TESTÉE.
- [x] Pas de conclusion « auth / sécurité validées » au global.
- [x] Metro de session arrêté ; port 8081 libre (preuve agent).
- [x] Clôture **terminée** — commit local des deux fichiers Loop ; pas de
  push ni merge.

## Actions Git et installations

- **Branche** : `docs/yunimobile-0011j-iphone-auth-preview`
- **Commit** : local autorisé à la clôture (message
  `docs: record iPhone authentication smoke test`)
- **Push** : non
- **Installation** : non

## Arrêt Metro

- Instance ciblée : PID **177432** — `expo start --lan --go` sur 8081
  (cible Preview de la session 0011J).
- Arrêt : `Stop-Process` sur ce PID uniquement (2026-10-13).
- Preuve post-arrêt : **aucune** écoute `Listen` sur le port **8081**.
- QA Web **8010** : toujours en écoute (PID **59544** inchangé) —
  **préservée**.

## Rapport final

- **Terminé** — test auth iPhone partiel consigné (CTO).
- Résultats auth manuels consignés avec distinction déclaration /
  captures.
- Persistance Reload : **NON TESTÉE**.
- Carte, refresh/expiration, builds natifs : **non validés**.
- **Prochaine étape proposée (non lancée)** : test cartographique
  iPhone dédié, même compte Preview, sans modification de données,
  sans présumer du fournisseur Google Maps sur iOS.
