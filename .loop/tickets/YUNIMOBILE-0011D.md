# YUNIMOBILE-0011D — Migration Mapbox → react-native-maps (audit + implémentation)

- **Statut** : terminé — migration statique Mapbox vers react-native-maps réalisée ;
  runtime reporté après migration Expo SDK
- **Créé le** : 2026-10-12 (Europe/Paris)
- **Mis à jour le** : 2026-10-12 02:15 (Europe/Paris)
- **Référence** : audit CONDITIONAL GO ; passe d’implémentation contrôlée sur
  `feat/yunimobile-0011d-google-maps` @ base `f827895…`.

## Objectif

Remplacer l’implémentation Mapbox de la carte mobile par `react-native-maps`
**1.20.1** (Expo SDK 54), sans clé Google et sans build natif.

## Décision

- Audit : **CONDITIONAL GO** (confirmé CTO).
- Implémentation **statique** : **acceptée**.
- Runtime iOS : **non exécuté** — blocage de compatibilité Expo Go SDK 57 vs
  projet SDK 54 ; ce résultat n’est **pas** un échec de la migration
  cartographique.
- Aucune affirmation runtime ; aucune affirmation Google Maps iOS ou Android.
- Ne pas mettre à niveau Expo dans 0011D ; ne pas utiliser EAS Go / TestFlight.
- Migration incrémentale Expo SDK 54 → 55 → 56 → 57 : ticket distinct **0011E**.

## Périmètre implémentation

### Réalisé

- `pnpm exec expo install react-native-maps@1.20.1` puis
  `pnpm remove @rnmapbox/maps` depuis `apps/mobile`.
- Version résolue : **react-native-maps 1.20.1** exacte ; `@rnmapbox/maps`
  absent du manifeste et du lockfile.
- `app.json` : plugin Mapbox retiré ; pas de clé Google.
- `.env.example` : `EXPO_PUBLIC_MAPBOX_*` retirées.
- Code : `EventMap` / `EventMapScreen` + `map-region.ts` ; pas de
  `PROVIDER_GOOGLE` iOS ; token Mapbox retiré du screen.

### Hors périmètre

- Clés Google Cloud ; build natif ; mise à niveau Expo SDK.
- EAS Go / TestFlight.
- Dépôt Web ; backend FastAPI.
- Validation runtime iOS/Android (reportée après migration SDK).

## Critères d’implémentation

- [x] Comportement événementiel / Reims / marqueurs / fiche / états conservés
  (code ; runtime non prouvé).
- [x] Suppression `@rnmapbox/maps`, plugin, `EXPO_PUBLIC_MAPBOX_*` actifs.
- [x] Typecheck, lint app+components, `expo install --check`, expo-doctor 18/18,
  export Android hors dépôt.
- [x] Tentative test iPhone Expo Go consignée — refus compatibilité SDK avant
  chargement du bundle ; runtime reporté (pas un échec cartographique).

## Journal

| # | Action | Résultat |
|---|---|---|
| 1 | Audit lecture seule | CONDITIONAL GO |
| 2 | Clôture audit documentaire | commit `f827895` |
| 3 | Implémentation deps + code + contrôles | OK statique |
| 4 | Revue CTO intermédiaire A/B/C (sans Metro) | OK — audit § J ; pas de fix applicatif |
| 5 | Test iPhone Expo Go (Kyria) | Blocage SDK Go 57 vs projet 54 ; bundle non chargé |
| 6 | Clôture CTO | terminé — runtime reporté après migration Expo SDK |

## Test iPhone Expo Go (preuve Kyria)

| Point | Observation |
|---|---|
| Appareil | iPhone physique |
| Expo Go | SDK **57.0.0** |
| Projet Yunimobile | SDK **54** |
| Connexion LAN / ouverture URL | réussies |
| Chargement bundle applicatif | **refusé** — *Project is incompatible with this version of Expo Go* |
| JavaScript applicatif | **non exécuté** |
| Écran / marqueurs / fournisseur cartographique / appels API | **non testés** |
| Runtime iOS | **non exécuté** |

Décision CTO : ce résultat n’est pas un échec de la migration cartographique ;
ne pas upgrader Expo dans 0011D ; préparer **0011E** (migration SDK
incrémentale).

## Revue CTO intermédiaire (résumé)

- **A** : MapView non contrôlé ; pas de boucle région ; recentrage via ref ;
  clés/fiche/a11y OK ; pas de `PROVIDER_GOOGLE` ; pas de secret.
- **B** : `regionToBbox` = south/west/north/east ; aligné Web ; Node checks PASS.
- **C** : helpers Mapbox `packages/utils` morts pour mobile, vivants sur Web →
  **conserver** ; pas de suppression 0011D.
- **D** : commandes pnpm/expo vs lifecycle paquet clarifiés.
- Runtime toujours non prouvé après le test iPhone (blocage SDK).

## Contrôles (propres)

| Commande | Exit |
|---|---|
| `pnpm --filter mobile run typecheck` | 0 |
| `pnpm exec expo lint app components` | 0 |
| `pnpm exec expo install --check` | 0 |
| `npm exec --package=expo-doctor@1.20.4 -- expo-doctor` | 0 (18/18) |
| `pnpm exec expo export --platform android` → `C:\tmp\yunimobile-0011d-dist-android` | 0 |

Réutilisables à la clôture : aucun fichier applicatif modifié depuis ces
contrôles (seule doc + arrêt Metro).

## Actions Git

- **Commit 1** (audit) : `f827895` — documentation d’audit.
- **Commit 2** (implémentation + clôture) : autorisé — message
  `feat: migrate mobile map to react native maps` / `Ticket: YUNIMOBILE-0011D`.
- **Push** : non.
- **Installation** : oui — uniquement `react-native-maps@1.20.1` et retrait
  `@rnmapbox/maps` (registre npm).

## Rapport final

- Migration **statique** Mapbox → `react-native-maps` **réalisée et acceptée**.
- Runtime iOS **non exécuté** ; Google Maps Android/iOS **toujours non prouvés**.
- Voir `docs/engineering/google-maps-migration-audit.md` § I / § J / § K.
- **Prochaine étape** : **0011E** — migration contrôlée Expo SDK 54 → 55 → 56 → 57
  (un SDK à la fois). Non lancé ici.
