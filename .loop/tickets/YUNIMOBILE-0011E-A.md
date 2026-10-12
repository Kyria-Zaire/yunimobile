# YUNIMOBILE-0011E-A — Audit de migration Expo SDK 54 → 55 → 56 → 57

- **Statut** : terminé — audit de migration réalisé ; checkpoint SDK 55 non
  démarré
- **Créé le** : 2026-10-12 (Europe/Paris)
- **Mis à jour le** : 2026-10-12 09:50 (Europe/Paris)
- **Branche** : `docs/yunimobile-0011e-expo-upgrade-audit`
- **Base** : `main` @ `381396fe44bd7160430fade6a8177f86cb8a6ef3`
- **Rapport** : `docs/engineering/expo-sdk-57-upgrade-audit.md`

## Objectif

Établir un plan **vérifiable** de migration incrémentale Expo
**SDK 54 → 55 → 56 → 57**, sans modifier dépendances ni code applicatif.

## Décision CTO (clôture)

- Audit **approuvé**.
- Décision : **CONDITIONAL GO** pour le futur checkpoint SDK **54 → 55**.
- **SDK 57** reste la **cible finale**.
- Aucun palier ne sera sauté (54 → 55 → 56 → 57).
- **SDK 56** sera contrôlé normalement mais **ne constituera pas une cible
  durable**.
- `react-native-maps` sera **réaligné à chaque palier** selon la matrice Expo
  officielle (`bundledNativeModules` / `expo install`).
- **Node 24.18.1** est conservé **provisoirement** ; aucun changement de Node
  dans ce ticket.
- Chaque palier aura sa **propre branche**, ses contrôles, son **commit** et sa
  **PR**.
- Le test **Expo Go iPhone** aura lieu **après** le checkpoint SDK 57.
- Checkpoint SDK 55 (**YUNIMOBILE-0011E-B**) : **non démarré** ici.

## Limites de preuve (non affirmées)

Ce ticket n’a **pas** exécuté ni prouvé :

- compatibilité runtime ;
- réussite future des migrations ;
- compatibilité Expo Go finale ;
- support effectif de Node 24 par toutes les dépendances.

Les versions cibles annoncées sont reliées aux sources officielles consultées
le **2026-10-12** (voir audit § 3).

## Périmètre

### Réalisé

- Préconditions Git : `main` = `origin/main` = `381396fe…` ; branche audit créée.
- Baseline manifeste / lockfile / `app.json` / Babel / Metro.
- Recherche officielle SDK 55 / 56 / 57 + `bundledNativeModules` par branche
  (consultation **2026-10-12**).
- Analyse lecture seule du code mobile.
- Stratégie 4 checkpoints + gates + branche/commit/PR par palier.
- Clôture CTO : CONDITIONAL GO CP1 ; statut terminé.

### Hors périmètre

- Modification de dépendances ou fichiers applicatifs.
- Exécution des commandes `expo install` / doctor / typecheck / export.
- Changement de version Node.
- Clés Google, AVD, development build, EAS Go / TestFlight.
- Traitement UX `MapView.onPress` (désélection) — ticket UI/UX futur.
- Démarrage de **YUNIMOBILE-0011E-B** / checkpoint SDK 55.

## Journal

| # | Action | Résultat |
|---|---|---|
| 1 | Sync Git + branche audit | OK |
| 2 | Baseline locale | OK — SDK 54 / RN 0.81.5 / maps 1.20.1 / newArch true |
| 3 | Sources officielles 55/56/57 | OK — consultées 2026-10-12 |
| 4 | Analyse code | OK — lecture seule |
| 5 | Plan checkpoints + recommandation | CONDITIONAL GO CP1 |
| 6 | Clôture CTO | terminé — audit approuvé ; 0011E-B non démarré |

## Critères d’acceptation

- [x] Trois livrables uniquement (ticket, state, audit).
- [x] Distinction faits officiels / constat local / déduction.
- [x] Plan 54→55→56→57 sans regroupement aveugle.
- [x] Pas d’installation ni modification applicative.
- [x] Décision CTO consignées ; statut **terminé**.
- [x] Prochaine étape : **YUNIMOBILE-0011E-B** (non lancée).

## Actions Git

- **Commit** : autorisé à la clôture —
  `docs: audit Expo SDK 57 upgrade path` / `Ticket: YUNIMOBILE-0011E-A`.
- **Push** : non (cette passe).
- Fichiers : ticket, `state.md`, audit uniquement.

## Prochaine étape (non lancée)

**YUNIMOBILE-0011E-B** — migration contrôlée Expo SDK **54 → 55**
(branche dédiée, contrôles, commit, PR). Non démarré ici.
