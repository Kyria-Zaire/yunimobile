# YUNIMOBILE-0011G — Preuves runtime iPhone et actualisation roadmap

- **Statut** : terminé — preuves de démarrage iPhone consignées ;
  accès API, authentification, carte et session non validés
- **Créé le** : 2026-10-13
- **Mis à jour le** : 2026-10-13 02:45 (Europe/Paris)
- **Branche** : `docs/yunimobile-0011g-iphone-runtime`
- **Base** : `main` @ `99e5ed08540d817ef7f2aa27464f0c37ce27948d`
- **Rapport** : `docs/engineering/iphone-runtime-smoke-test.md`

## Objectif

Consigner les preuves runtime iPhone transmises par Kyria (captures et
rapports utilisateur) et actualiser la roadmap — **sans** nouveau test,
sans modification applicative.

## Nature des preuves

Rapports utilisateur et captures du **13 octobre 2026**. Code testé :
branche `chore/yunimobile-0011f-a-android-avd` @
`3d361cc707ad45460c8b5a35706b4c4f36f7fb7e`.
**Non** réexécuté par l’agent dans ce ticket. Captures **non** intégrées
au dépôt.

## Constats consignés

| Point | Résultat (preuve utilisateur) |
|---|---|
| TestFlight | Expo Go **58.0.2**, build **1017888** |
| App Store | Fiche proposant Expo Go **57.0.9** |
| Retour App Store | Client **57.0.9**, Supported SDK **57.0.0** (capture) |
| Projet | Expo SDK **57** |
| Metro LAN | Connexion réussie |
| JS Yunicity | Exécuté |
| Écrans | Accueil, login, register affichés ; navigation observée |
| Non validés | Retour arrière, auth effective, inscription effective, carte, persistance session |
| Builds natifs | Aucun prouvé (iOS / Android) |

## Diagnostic API (rapport Cursor, séparé)

Voir rapport § diagnostic. Synthèse : `EXPO_PUBLIC_API_URL` absente ;
secours `http://127.0.0.1:8010` inadapté à l’iPhone ; message réseau sans
statut HTTP ; API sur 8010 = QA Web Docker, localhost only.

## Périmètre

### Réalisé

- Préconditions Git ; branche documentaire.
- Ticket, rapport, mise à jour `state.md`.
- Actualisation roadmap (priorité API test isolée iPhone).

### Hors périmètre

- Nouveau test Metro / appareil ; captures dans le dépôt.
- `.env`, backend, Docker, Android, JDK, Apple Developer.
- Push (cette passe).

## Critères d'acceptation

- [x] Preuves iPhone consignées sans invention (rapports Kyria, sans
  réexécution agent).
- [x] Diagnostic API séparé.
- [x] Roadmap actualisée (blocage Go levé ; priorité API isolée).
- [x] Trois fichiers seuls ; commit de clôture ; pas de push.
- [x] Statut final : terminé — preuves de démarrage iPhone consignées ;
  accès API, authentification, carte et session non validés.

## Actions Git

- **Commit** : oui —
  `docs: record iPhone runtime smoke test` /
  `Ticket: YUNIMOBILE-0011G`
- **Push** : non
- **Installation** : non

## Prochaine action proposée

**YUNIMOBILE-0011H** — préparation de l’environnement API mobile isolé
(**non lancé** ; fichier ticket non créé). Aucun choix implicite de seed,
compte de test ou données.
