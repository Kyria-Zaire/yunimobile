# YUNIMOBILE-0011E-E — Audit SDK 58 et stratégie runtime

- **Statut** : terminé — audit SDK 58 et stratégie runtime réalisés
- **Créé le** : 2026-10-12
- **Mis à jour le** : 2026-10-12 23:56 (Europe/Paris)
- **Branche** : `docs/yunimobile-0011e-e-runtime-strategy`
- **Base** : `main` @ `2bfa34656360f3f7adc3cfa22b0fe3c4fc03cba4`
- **Rapport** : `docs/engineering/expo-sdk-58-runtime-strategy.md`

## Objectif

Établir l’état officiel d’Expo SDK 58 au 12 octobre 2026, clarifier le
blocage Expo Go iPhone, comparer les options runtime (attendre / migrer /
development build / émulateur Android), et arrêter une stratégie
documentaire — **sans** migration, installation, build ni dépense.

## Décision CTO (clôture)

- **Option E** adoptée.
- **Option B** (migration SDK 58 beta / prerelease) **refusée**.
- SDK 58 est actuellement **beta / pré-stable** ; le projet reste sur
  **SDK 57**.
- **Android SDK 57** prioritaire (environnement puis runtime).
- **iOS EAS différé** ; adhésion **Apple Developer non autorisée** à ce
  stade ; **aucune dépense Apple** autorisée.
- Aucune migration SDK 58 avant sortie **stable** et **audit dédié**.
- Provenance de l’Expo Go 58 iPhone : toujours **non vérifiée**.

## Contexte et références

- Checkpoint SDK 57 fusionné (`2bfa346…`) ; runtime iPhone non exécuté
  (Expo Go annonce SDK 58 vs projet SDK 57).
- Rapport détaillé : `docs/engineering/expo-sdk-58-runtime-strategy.md`.

## Périmètre

### Réalisé

- Préconditions Git et sauvegardes SDK 55 / 56.
- Sources primaires SDK 58 / npm / RN / EAS / Apple.
- Comparaison options A–E ; distinctions Google Maps.
- Décision CTO Option E consignées ; clôture documentaire + commit local.

### Hors périmètre

- Migration SDK 58 ou modification applicative.
- Installation, Metro, build, EAS, certificats.
- Authentification Expo / Apple ; création de projet EAS.
- Clés Google ; Mapbox ; secrets.
- Push, merge, dépense.
- Création des tickets **0011F-A** / **0011F-B**.

## État de départ

- **Branche / HEAD** : `docs/yunimobile-0011e-e-runtime-strategy` @
  `2bfa34656360f3f7adc3cfa22b0fe3c4fc03cba4` (= `origin/main`).
- **`git status --short`** : vide (arbre propre avant rédaction).
- Ticket actif avant démarrage : Aucun.
- Sauvegardes node_modules SDK 55 et SDK 56 : présentes hors dépôt
  (vérifiées).

## Critères d'acceptation

- [x] Préconditions Git et sauvegardes vérifiées.
- [x] Trois fichiers uniquement (ticket, rapport, state).
- [x] Statut officiel SDK 58 documenté sans conclure « stable » via Expo Go.
- [x] Preuve utilisateur Expo Go 58 consignées ; provenance non vérifiée.
- [x] Options A–E comparées ; coûts documentés avec sources et date.
- [x] Décision CTO Option E consignées.
- [x] Statut final : terminé — audit SDK 58 et stratégie runtime réalisés.
- [x] Aucune migration, install, build, auth, push ni dépense.

## Plan

1. Vérifier préconditions et créer la branche.
2. Collecter preuves primaires SDK 58 / npm / RN / EAS / Apple.
3. Rédiger ticket + rapport + state.
4. Revue CTO ; clôture ; commit local ; arrêt.

## Risques et décisions ouvertes

- Adhésion Apple Developer / EAS iOS : **non autorisés** (reportés).
- Migration SDK 58 : uniquement après stable + audit dédié.
- Provenance Expo Go 58 : non vérifiée.

## Vérifications prévues

- [x] Relire ticket, rapport, state.
- [x] `git diff --check` ; UTF-8 / LF / newline finale.
- [x] Pas de secret / e-mail / identifiant de compte / chemin personnel.
- [x] Trois fichiers ; index contrôlé avant commit.

## Journal des tentatives

| # | Hypothèse | Action | Résultat |
|---|---|---|---|
| 1 | SDK 58 non promu stable malgré Expo Go 58 | npm dist-tags + changelog HTTP + bundledNativeModules | Confirmé : `latest`=57.0.28 ; `/changelog/sdk-58` 404 ; beta 200 ; RN 0.88.0-rc.2 |
| 2 | EAS peut builder iOS depuis Windows | docs Expo development builds | Confirmé (cloud) ; appareil iPhone exige Apple Developer payant |
| 3 | Provenance Expo Go 58 App Store | changelog beta + absence de preuve store | provenance non vérifiée |

## Résultats et preuves

Voir le rapport. Synthèse :

- SDK 58 : **beta / pré-stable**.
- Projet maintenu sur **SDK 57**.
- Expo Go iPhone : **provenance non vérifiée**.
- Stratégie : **Option E** (CTO).
- Prochain ticket proposé : **YUNIMOBILE-0011F-A** (non créé ici).

## Revue

- [x] Auto-vérification
- [x] Revue CTO (conversation) — Option E adoptée
- [ ] Revue indépendante tierce (non requise pour clôture)

## Actions Git et installations autorisées

- **Commit** : oui (clôture) —
  `docs: audit mobile runtime strategy` / `Ticket: YUNIMOBILE-0011E-E`
- **Push** : non
- **Merge** : non
- **Déploiement / publication** : non
- **Installation** : non

## Rapport final

- Fichiers créés / modifiés :
  - `.loop/tickets/YUNIMOBILE-0011E-E.md`
  - `docs/engineering/expo-sdk-58-runtime-strategy.md`
  - `.loop/state.md`
- Décision : Option E ; B refusée ; Android 57 d’abord ; iOS EAS / Apple
  différés ; pas de migration 58 avant stable + audit.
- **Prochaine action proposée** : **YUNIMOBILE-0011F-A** — environnement
  Android et AVD API 35 (**non commencé** ; fichier ticket non créé).
  **YUNIMOBILE-0011F-B** réservé au premier runtime Android.
