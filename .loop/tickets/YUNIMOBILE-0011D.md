# YUNIMOBILE-0011D — Audit de migration Mapbox vers Google Maps

- **Statut** : terminé — audit de migration réalisé
- **Créé le** : 2026-10-12 (Europe/Paris)
- **Mis à jour le** : 2026-10-12 01:05 (Europe/Paris)
- **Référence** : ticket CTO ; revue CTO CONDITIONAL GO (2026-10-12) ;
  passe audit lecture seule.

## Objectif

Auditer la migration de la carte mobile de Mapbox vers Google Maps : inventaire
Mapbox, référence Web, options Expo SDK 54, coût/sécurité, plan et découpage.
**Sans** modifier la carte, les dépendances ou `app.json` dans cette passe.

## Contexte et références

- Décision CTO : Google Maps fournisseur Web + Mobile ; Mapbox héritage à retirer.
- Précédent : YUNIMOBILE-0011C.
- Livrable : `docs/engineering/google-maps-migration-audit.md`.
- Web (lecture seule) : `C:\Users\kyria\yunicity`.

## Périmètre (passe audit)

### Autorisé

- Branche `feat/yunimobile-0011d-google-maps`.
- Fichiers : ce ticket, `.loop/state.md`,
  `docs/engineering/google-maps-migration-audit.md`.
- Lecture code + docs publiques ; commit local de clôture documentaire.

### Hors périmètre (cette passe)

- Installation (`pnpm expo install` reporté à l’implémentation).
- Modification applicative, clés Google, build, ADB, AVD.
- Modification du dépôt Web ; push.

## État de départ

- `main` @ `b4ffaf4e597a645b3c5d6c39768251cc33a7ad31` (= `origin/main`).
- Arbre propre ; espace ≈ 14,098 Gio.

## Critères d'acceptation (audit)

- [x] Inventaire Mapbox + référence Web + options mobiles documentés.
- [x] Version SDK 54 : **react-native-maps 1.20.1** (pas doc « latest ») ;
  install future `pnpm expo install react-native-maps` + vérification version.
- [x] Limites Expo Go (Android Google vs iOS sans preuve Google) explicitées.
- [x] Découpage 0011D impl / 0011E / 0011F / iOS ultérieur.
- [x] Critères d’implémentation 0011D listés.
- [x] **CONDITIONAL GO** confirmé CTO.
- [x] Statut terminé (audit) ; commit local documentaire.

## Décision

**CONDITIONAL GO** pour l’implémentation (confirmé revue CTO).

## Découpage retenu

| Ticket | Contenu |
|---|---|
| **0011D implémentation** | Remplacer Mapbox par `react-native-maps` **sans** clé Google ni build natif |
| **0011E** | Java/Android + AVD API 35 |
| **0011F** | Clés Google sécurisées, premier dev build Android, preuve fournisseur Google |
| Ultérieur | Stratégie build iOS |

### Critères d’implémentation 0011D (prochaine passe)

- comportement événementiel, Reims/région, marqueurs/fiche, états
  chargement/erreur/vide conservés ;
- suppression `@rnmapbox/maps`, plugin Mapbox, `EXPO_PUBLIC_MAPBOX_*` ;
- aucune donnée factice ; aucun backend dupliqué ;
- typecheck, lint, `expo install --check`, expo-doctor, export Android ;
- test iPhone Expo Go séparé avec fournisseur **observé** rapporté.

Install prévue : `pnpm expo install react-native-maps` → vérifier version
(réf. **1.20.1** SDK 54). **Non exécuté** dans l’audit.

## Journal des tentatives

| # | Hypothèse | Action | Résultat |
|---|---|---|---|
| 1 | Audit lecture seule | Inventaire + docs | OK — CONDITIONAL GO |
| 2 | Revue CTO | Clarifications version/Expo Go/découpage + clôture | OK |

## Résultats et preuves

Voir `docs/engineering/google-maps-migration-audit.md`.

- Mapbox mobile inventorié ; Web Maps JS inspecté (`ee57ce1…` inchangé).
- Reco : `react-native-maps` **1.20.1** via `pnpm expo install` (SDK 54).
- Expo Go : inclus ; Android≈Google ; iOS≠preuve Google ; `PROVIDER_GOOGLE`
  non affirmé sans runtime.
- Décision : **CONDITIONAL GO**.

## Revue

- [x] Auto-vérification
- [x] Revue CTO (CONDITIONAL GO confirmé + clarifications)
- [ ] Revue indépendante tierce (non requise pour clôture documentaire)

## Actions Git et installations autorisées

- **Commit** : oui (clôture documentaire locale)
- **Push** : non
- **Installation** : non

## Rapport final

- Trois fichiers documentaires ; aucune modif applicative.
- **Prochaine action** : **implémentation contrôlée de 0011D** (non lancée ici).
