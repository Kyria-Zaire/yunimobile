# YUNIMOBILE-0011E-C — Migration contrôlée Expo SDK 55 → 56

- **Statut** : **terminé** — migration statique Expo SDK 56 réussie avec
  exception Hermes V1 transitoire ; aucune validation runtime ou native ;
  correctif CodeRabbit PR #8 appliqué (2 diagnostics acceptés)
- **Créé le** : 2026-10-12 (Europe/Paris)
- **Mis à jour le** : 2026-10-12 20:55 (Europe/Paris) — correctif CodeRabbit
- **Branche** : `feat/yunimobile-0011e-c-expo-sdk-56`
- **Base** : `main` @ `9b9612801637cb0e06a2429aa9ae66b8cb6e8b1b`
- **PR** : https://github.com/Kyria-Zaire/yunimobile/pull/8
- **Rapport** : `docs/engineering/expo-sdk-56-migration.md`
- **Audit parent** : YUNIMOBILE-0011E-A
- **Précédent** : YUNIMOBILE-0011E-B (SDK 55)

## Objectif

Migrer **SDK 55 → 56** uniquement (palier intermédiaire). SDK **57** et Expo Go
**interdits** dans ce ticket.

## Décision CTO

**GO** pour le commit local de clôture, puis publication PR #8, puis correctif
CodeRabbit (2 diagnostics acceptés ; nitpick refusé).

- SDK 56 = palier **intermédiaire non publiable**.
- Unique exception acceptée : **HermesV1VersionCheck**.
- Expo Doctor final (correctif) : **21/22**.
- Runtime, build natif et Expo Go : **non exécutés**.
- SDK **57 non commencé**.

## Versions

| | Avant | Après |
|---|---|---|
| Expo | ~55.0.31 | ~56.0.23 |
| React | 19.2.0 | 19.2.3 |
| React Native | 0.83.10 | 0.85.3 |
| Expo Router | ~55.0.18 | ~56.2.21 |
| react-native-maps | 1.27.2 | 1.27.2 |

## Tentatives de correction (3/3)

| # | Action | Résultat |
|---|---|---|
| 1 | Ajout `@expo/dom-webview@~56.0.6` | OK — doctor 20/22 → 21/22 |
| 2 | Correction lint (14 diagnostics Option A) | OK lint ; défauts sémantiques D1–D15 |
| 3 | Correction invariants async D1–D15 | OK code ; Doctor temporairement 20/22 (schéma réseau) |

## Vérification réseau (hors compteur)

Relance unique expo-doctor **1.20.4** (2026-10-12 19:55) : **21/22**, seul
`HermesV1VersionCheck`. **Pas** une quatrième correction.

## Revue CodeRabbit PR #8 (correctif post-publication)

| Diagnostic | Décision | Correction |
|---|---|---|
| Minor — `tribes/index.tsx` loadMore vs refresh | **Accepté** | `refreshInFlightRef` + garde UI `refreshing` |
| Minor — `tribe-invitations-section.tsx` decline → `items: []` | **Accepté** | conserver la liste si decline échoue |
| Nitpick — factoriser `tribes/[slug].tsx` via `loadBundle` | **Refusé** | aucun défaut fonctionnel ; élargirait le diff |

### Scénarios relus (structurels, pas runtime)

- refresh puis loadMore ; loadMore puis refresh ; double refresh ; échec refresh ;
  unmount pendant refresh/loadMore ;
- decline réussi ; decline échoué ; double action decline ; unmount pendant decline.

### Gates rejoués après correctif

| Gate | Exit | Note |
|---|---|---|
| lint | 0 | |
| typecheck / sans `.expo` | 0 / 0 | MISMATCH=0 (5 fichiers) |
| expo install --check | 0 | |
| expo-doctor 1.20.4 | 1 | **21/22**, Hermes seul |
| export Android | 0 | 1997 modules ; hors dépôt |
| Mapbox / artefacts / secrets / diff --check | OK | |

Runtime, build natif et Expo Go : **toujours non vérifiés**.

## Sauvegarde SDK 55

`C:\tmp\yunimobile-0011e-c-node_modules-sdk55-backup` — **conservée**.

## Actions Git

- **Commit clôture** : oui (`5d8aad2…`, amend sans Co-Authored-By)
- **Push / PR #8** : oui
- **Commit correctif CodeRabbit** : oui (cette étape)
- Prochain ticket : **YUNIMOBILE-0011E-D** (SDK 57) — **non commencé**
