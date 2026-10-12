# YUNIMOBILE-0011E-D — Migration contrôlée Expo SDK 56 → 57

- **Statut** : **terminé** — migration statique Expo SDK 57 réussie ;
  runtime iPhone non exécuté car Expo Go SDK 58 incompatible
- **Créé le** : 2026-10-12 (Europe/Paris)
- **Mis à jour le** : 2026-10-12 23:09 (Europe/Paris) — clôture commit local
- **Branche** : `feat/yunimobile-0011e-d-expo-sdk-57`
- **Base** : `main` @ `a8fc4f57cd63baa3cb73f0aa429db3cf20494df0`
- **Rapport** : `docs/engineering/expo-sdk-57-migration.md`
- **Audit parent** : YUNIMOBILE-0011E-A
- **Précédent** : YUNIMOBILE-0011E-C (SDK 56, PR #8 fusionnée)

## Objectif

Migrer **SDK 56 → 57**, supprimer l’exception Hermes V1, gates statiques au
vert, puis tenter le test Expo Go iPhone.

## Décision CTO (clôture)

- Migration **statique** SDK 57 : **réussie**.
- Test Expo Go iPhone **bloqué** avant chargement du JavaScript :
  Expo Go **SDK 58** ≠ projet **SDK 57**.
- Ce blocage **n’est pas** un défaut de Yunicity.
- Runtime, UI, API, authentification et carte : **non testés**.
- Aucune migration SDK **58** dans ce ticket.

## Versions finales

| | Avant (SDK 56) | Après (SDK 57) |
|---|---|---|
| Expo | 56.0.23 | **57.0.28** |
| React | 19.2.3 | **19.2.3** |
| React Native | 0.85.3 | **0.86.3** |
| Expo Router | 56.2.21 | **57.0.26** |
| react-native-maps | 1.27.2 | **1.27.2** |

## Preuves

### Statiques

| Gate | Exit | Note |
|---|---|---|
| typecheck / sans `.expo` | 0 / 0 | MISMATCH=0 |
| lint | 0 | |
| expo install --check | 0 | |
| expo-doctor 1.20.4 | 0 | **21/21** ; plus de HermesV1 |
| export Android | 0 | 2021 modules ; hors dépôt |

### Bundling iOS (Metro)

- Bundle iOS : **réussi** — **2078** modules.
- Connexion LAN iPhone : **atteinte**.

### Blocage Expo Go

- Expo Go appareil : **SDK 58** ; projet : **SDK 57**.
- Refus **avant** chargement du JavaScript applicatif.
- Aucun écran Yunicity exécuté.

### Non testé

UI, API, authentification, navigation, carte, fournisseur Maps iOS.

## Actions Git

- **Commit** : oui (clôture locale) — `build(mobile): upgrade Expo SDK to 57`
- **Push** : non
- **Ticket SDK 58** : **non créé / non commencé**

## Sauvegardes

- SDK 56 : `C:\tmp\yunimobile-0011e-d-node_modules-sdk56-backup`
- SDK 55 : `C:\tmp\yunimobile-0011e-c-node_modules-sdk55-backup` (conservée)

## Prochaine étape (non lancée)

Audit officiel de stabilité **SDK 58** versus stratégie **development build**.
