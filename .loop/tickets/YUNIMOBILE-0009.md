# YUNIMOBILE-0009 — Preuve d'extraction autonome et bundle Metro Android

- **Statut** : terminé
- **Créé le** : 2026-10-02
- **Mis à jour le** : 2026-10-02 10:15 (Europe/Paris, UTC+02:00)

## Objectif

Créer une extraction autonome jetable de l'application mobile existante, indépendante
du monorepo source, et vérifier qu'elle installe ses dépendances, passe ses contrôles
statiques et produit un bundle Android avec Metro. Pas d'intégration permanente.

## Contexte et références

- Décision CTO : option A, extraction contrôlée (YUNIMOBILE-0008).
- Texte du ticket transmis en conversation par Kyria, enregistré ici.
- Copie diagnostique : `C:\tmp\yunimobile-0007-diag\src\frontend`.
- Extraction : `C:\tmp\yunimobile-0009-extract`.
- Source en lecture seule : `C:\Users\kyria\yunicity` @
  `ee57ce1dfc37835a47335e56338578471a95ec7d`.

## Périmètre

### Autorisé

- `.loop/tickets/YUNIMOBILE-0009.md`, `docs/engineering/mobile-extraction-poc.md`,
  `.loop/state.md`.
- Création et modification libres de l'extraction ; copie depuis la copie
  diagnostique ; installation dans l'extraction seulement ; réseau limité aux
  registres npm/pnpm et aux services Expo.
- Typecheck, lint, `expo install --check`, `expo-doctor`, `expo export` Android.

### Hors périmètre

- Modification de la source ou de la copie 0007 ; `.env` réel, secret, token,
  keystore, credential.
- `create-expo-app`, `@latest`, `expo prebuild`, `ios/`/`android/`, dev build, EAS,
  serveur Metro persistant, publication.
- `git init` dans l'extraction ; commit, amend, push, sous-agent ; installation
  globale ; suppression de cache ou de dossier existant.

## État de départ

- **`yunimobile`** : `main` @ `8c7dfce076b7ead2395225fed2a359f46042ef05`, propre.
- **Source** : `feat/c3-global-refonte-preview` @ SHA attendu, aucun fichier modifié
  ni non suivi ; identique à la fin de 0008.
- **Copie 0007** : identique à la fin de 0008 (2 551 empreintes, 65 337 fichiers).
- **Extraction** : absente (précondition satisfaite). Espace libre : 4,033 Gio.

## Critères d'acceptation

- [x] Extraction autonome minimale construite ; fermeture `@yunicity/*` documentée.
- [x] Metro autonome ; quatre correctifs SDK 54 alignés ; aucune autre modification
      du code.
- [x] Installation pnpm 9.15.9 dans l'extraction ; lockfile autonome ; provenance
      et scripts lifecycle consignés.
- [x] Résolution autonome et React vérifiés.
- [x] Typecheck, lint, `expo install --check`, `expo-doctor`, export Android
      exécutés et consignés.
- [x] Emplacements protégés inchangés ; espace disque suivi.

## Plan

1. État initial. 2. Extraction minimale. 3. Dépendances. 4. Vérifications.
5. Rapport.

## Risques et décisions ouvertes

- Overrides de sécurité du monorepo non repris ; résolution neuve de quelques
  versions transitives et directes.
- Aucun dev build ni lancement.

## Vérifications prévues

- [x] Liens, chemins anciens, résolutions.
- [x] État avant/après de la source, de la copie 0007 et de `yunimobile`.
- [x] Absence d'`android/`, `ios/`, `.expo`.

## Journal des tentatives

| # | Hypothèse | Action | Résultat |
|---|---|---|---|
| — | Aucun blocage | — | Aucune correction nécessaire ; incidents d'outillage consignés dans le rapport § 7 |

## Résultats et preuves

Contrôles propres (Claude), 2026-10-02. Détail :
`docs/engineering/mobile-extraction-poc.md` ; journaux dans
`C:\tmp\yunimobile-0009-extract\logs`.

- Installation : `CI=1 pnpm install --lockfile-only` (exit 0), puis
  `CI=1 pnpm install --frozen-lockfile` (exit 0) ; 978 paquets, tous du registre
  npm ; un seul script lifecycle (`unrs-resolver postinstall`).
- Résolution : 1 288 fichiers `tsc` et 11 modules dans l'extraction ; 5 jonctions
  internes ; aucun ancien chemin.
- React : 19.1.0 seul dans le lockfile ; une seule résolution `node_modules/react`.
- Typecheck : exit 0, 0 erreur.
- Lint `app` + `components` : exit 0, 51 fichiers, 0 erreur, 0 avertissement.
- `expo install --check` : exit 0, à jour.
- `expo-doctor` 1.20.4 (intégrité vérifiée avant et après) : exit 0, 18/18.
- `expo export --platform android` : exit 0, 324 s, 1 933 modules, bundle Hermes
  6,31 Mo, 30 fichiers (6 448 643 octets).
- Source, copie 0007 et `yunimobile` inchangés (hors trois fichiers documentaires).
- Effet de bord : 4 fichiers de cache `~/.expo` réécrits (déjà notés en 0008).

## Revue

- [x] Revue CTO en conversation (2026-10-02) : GO approuvé, à partir du rapport,
      des sorties consignées et des contrôles de Claude ; pas de réexécution
      indépendante des commandes
- [x] Auto-vérification
- [ ] Revue indépendante (par : …)
- [ ] Non réalisée (raison : …)

## Actions Git et installations autorisées

- **Commit** : oui — commit local de clôture, autorisé par Kyria en conversation
  (`docs: validate standalone mobile extraction proof`)
- **Push** : non
- **Merge** : non
- **Déploiement / publication** : non
- **Installation** : oui, dans l'extraction jetable seulement

## Rapport final

- Fichiers créés : `.loop/tickets/YUNIMOBILE-0009.md`,
  `docs/engineering/mobile-extraction-poc.md`.
- Fichiers modifiés : `.loop/state.md`.
- Hors dépôt : extraction `C:\tmp\yunimobile-0009-extract` (conservée, avec journaux
  et export).
- Vérifications : voir « Résultats et preuves ».
- Limites : aucun dev build ni lancement ; résolution neuve ; overrides non repris ;
  manifestes `ui`/`utils` réduits ; tests de `utils` non repris.
- Recommandation (séparée des preuves) : **GO** pour l'intégration permanente selon
  les critères du ticket ; décision au CTO.
- Actions Git / installations : aucune dans les dépôts ; installation dans
  l'extraction uniquement.
- Décision CTO (2026-10-02) : **GO approuvé** ; preuve d'extraction autonome
  réussie. Option A définitivement retenue ; l'extraction devient la référence
  technique ; YUNIMOBILE-0010 réutilisera sans nouvelle résolution la baseline
  validée (manifestes, workspace, `.npmrc` hoisted, `tsconfig.base.json`, lockfile
  copié tel quel, Metro, quatre correctifs SDK 54). Les versions
  `@rnmapbox/maps` 10.3.5, `react-native-qrcode-svg` 6.3.26 et `@babel/core` 7.29.7
  sont la baseline exacte. Gates avant le premier dev build et empreintes de
  référence : rapport § 11.
- Limites maintenues : aucun dev build ; aucun lancement sur appareil ou émulateur ;
  aucune preuve du comportement à l'exécution ; aucun build natif Android ou iOS.
- Caches `~/.expo` conservés et documentés.
- **Prochaine étape (non lancée)** : YUNIMOBILE-0009A — hygiène de l'historique Git
  avant première publication ; puis YUNIMOBILE-0010 — extraction permanente de
  l'application validée dans `yunimobile`.
