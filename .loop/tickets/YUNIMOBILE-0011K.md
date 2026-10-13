# YUNIMOBILE-0011K — Test session et carte iPhone (API Preview)

- **Statut** : terminé — test iPhone session et carte partiel consigné
- **Créé le** : 2026-10-13
- **Mis à jour le** : 2026-10-13 14:25 (Europe/Paris)

## Objectif

Préparer, encadrer et consigner un test manuel iPhone : persistance de
session après Reload, puis parcours carte (lecture seule) contre API
Preview.

## Contexte et références

- Suite de YUNIMOBILE-0011J (auth partielle ; Reload était NON TESTÉE ;
  carte non validée).
- Cible API : `https://api-preview.yunicity.city`
- Branche : `docs/yunimobile-0011k-iphone-session-map`
- Base : `main` @ `17894ce58ee33243d73f1733d939d7e90d5077a0`
- Identifiant **0011K** (0011I réservé API locale, non créé).

## Périmètre

### Autorisé

- Ticket + `.loop/state.md` ; branche documentaire.
- Lecture code carte / hooks / API client.
- Metro Expo Go LAN avec `EXPO_PUBLIC_API_URL` Preview (processus
  uniquement).
- Checklist manuelle Kyria (même compte Preview qu’en 0011J).
- Lecture session, Reload, navigation carte (sans écritures).
- Arrêt de **cette** instance Metro en fin de consignation.

### Hors périmètre

- Modification de fichiers applicatifs.
- Activation / modification de profil, publication, inscription à un
  événement, bascule « intéressé » (écriture API).
- Seed, migration, changement backend / Railway.
- Android, build natif, stack `mobile-dev` / 0011I.
- Affichage de PII / identités / contenu sensible dans les documents.
- Push / merge (commit local autorisé à la clôture uniquement).

## État de départ

- **Branche / HEAD** : `docs/yunimobile-0011k-iphone-session-map` @
  `17894ce…` (= `main` / `origin/main` au démarrage)
- Ticket actif avant démarrage : Aucun
- Aucun `apps/mobile/.env`

## Analyse carte (lecture seule — préparation)

### Chemin UI

| Élément | Chemin |
|---|---|
| Onglet | `app/(protected)/(tabs)/map/index.tsx` |
| Écran | `components/map/event-map-screen.tsx` → `EventMapScreen` |
| Carte | `components/map/event-map.tsx` → `EventMap` (`react-native-maps`) |
| Bbox | `hooks/use-map-bbox.ts` + `map-region.ts` (`regionToBbox`) |
| Données | `hooks/use-map-events.ts` → `yunicityApi.listMapEvents` |

### Appels API (parcours carte)

| Appel | Méthode / usage | Écriture ? |
|---|---|---|
| `getProfileMe()` | lecture ville profil | **Non** |
| `listMapEvents` → `GET /map/events?…` | événements dans le bbox | **Non** |
| `events.getEvent(id)` | fiche événement | **Non** |
| `events.toggleInterest` | CTA intérêt | **Oui** — hors test |

### Fournisseur carte iOS (code)

- `MapView` sans `provider` / sans `PROVIDER_GOOGLE`.
- Ne pas affirmer Google Maps sans preuve d’attribution.

## Session Expo

- URL LAN utilisée : `exp://192.168.1.180:8081`
- `EXPO_PUBLIC_API_URL` processus =
  `https://api-preview.yunicity.city` ; pas de `.env`.

## Checklist manuelle — résultats

Sources distinctes :

1. **Déclaration explicite Kyria** (conversation).
2. **Capture utilisateur** — non intégrée au dépôt ; aucune identité ni
   contenu sensible retranscrit au-delà des libellés UI génériques
   nécessaires au constat.

| # | Contrôle | Résultat | Source |
|---|---|---|---|
| 1 | Connexion (même compte Preview) | **NON TESTÉ** (non confirmé explicitement dans ce ticket) | — |
| 2 | Reload Expo Go → session conservée sans ressaisie | **PASS** | Déclaration Kyria |
| 3 | Ouverture Carte → fond de carte affiché | **PASS** | Déclaration Kyria |
| 4 | Déplacement + zoom sans crash | **PASS** | Déclaration Kyria |
| 5 | Recentrage (« Revenir à Reims ») après déplacement | **PASS** | Déclaration Kyria |
| 6 | Marqueurs → fiche → retour | **NON TESTÉ** | — |
| 7 | Fournisseur / état vide | Voir ci-dessous | Capture |

### Constats sur capture (sans PII)

- Attribution **Apple Maps** visible → fournisseur **Apple Maps** pour
  cette session Expo Go iOS.
- **Google Maps** reste la **cible définitive** Web + Mobile (doctrine
  projet) ; elle **n’est pas validée** sur iOS dans ce ticket.
- État UI : « Aucun événement à proximité » affiché.
- Aucun marqueur visible → fiche / retour **NON TESTÉS**.
- Cause de l’absence d’événements : **non déterminée** — **pas** un bug
  de rendu automatique.

## Limites — ne pas sur-conclure

- Aucun marqueur visible : fiche événement et retour **NON TESTÉS**.
- Cause de l’absence d’événements : **non déterminée**.
- Google Maps iOS : **non validé** (cible définitive inchangée).
- Expiration / refresh des tokens : **non validés**.
- Builds natifs iOS / Android : **non validés**.
- Pas de validation globale auth/sécurité/carte au-delà des PASS
  ci-dessus.

## Critères d'acceptation

- [x] Ticket créé ; analyse carte documentée ; Metro démarré.
- [x] Checklist consignées (sans PII) ; limites fournisseur respectées.
- [x] Metro de session arrêté ; port 8081 libre (preuve agent).
- [x] Clôture **terminée** — commit local des deux fichiers Loop ; pas de
  push ni merge.

## Actions Git et installations

- **Branche** : `docs/yunimobile-0011k-iphone-session-map`
- **Commit** : local autorisé à la clôture (message
  `docs: record iPhone session and map smoke test`)
- **Push** : non
- **Installation** : non

## Arrêt Metro (volontaire — fin de session)

- Instance ciblée : PID **74736** — `expo start --lan --go` sur 8081.
- Arrêt volontaire : `Stop-Process` sur ce PID (2026-10-13).
- Port **8081** : **libre** (aucune écoute `Listen`).
- QA Web **8010** : **préservée** (écoute PID **59544** inchangé au
  moment de l’arrêt).

## Bilan documentaire (à revoir)

### PASS (déclaration explicite Kyria)

- Session conservée après Reload sans ressaisie.
- Affichage du fond de carte.
- Déplacement et zoom.
- Recentrage sur Reims.

### Fournisseur

- Observé (capture) : **Apple Maps**.
- Cible définitive Web + Mobile : **Google Maps** — **non validée** sur
  iOS ici.

### Limites conservées

- Aucun marqueur → fiche / retour **NON TESTÉS** ; cause de l’absence
  d’événements **non déterminée**.
- Expiration / refresh tokens et builds natifs : **non validés**.

### Session Metro

- Arrêt volontaire ; **8081 libre** ; QA **8010 préservée**.

**Terminé** (CTO) — test iPhone session et carte partiel consigné.
Limites conservées (Apple Maps observé ; Google Maps iOS non validé ;
marqueurs/fiche NON TESTÉS ; tokens/builds non validés).
Commit local uniquement ; aucun push ni merge.
