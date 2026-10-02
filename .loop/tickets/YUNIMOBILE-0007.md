# YUNIMOBILE-0007 — Diagnostic typecheck et lint de la base mobile

- **Statut** : terminé
- **Créé le** : 2026-10-01
- **Mis à jour le** : 2026-10-02 02:46 (Europe/Paris, UTC+02:00)

## Objectif

Obtenir les résultats réels de typecheck et de lint du package mobile au SHA audité,
sans corriger aucune erreur.

## Contexte et références

- Suite de YUNIMOBILE-0006 (`docs/engineering/mobile-reuse-audit.md`, § 10 et 11).
- Texte du ticket transmis en conversation par Kyria, enregistré ici.
- Source : `C:\Users\kyria\yunicity`, SHA `ee57ce1dfc37835a47335e56338578471a95ec7d`.

## Périmètre

### Autorisé

- `.loop/tickets/YUNIMOBILE-0007.md`, `.loop/state.md`,
  `docs/engineering/mobile-static-diagnostics.md`.
- Dossier temporaire dédié hors des deux dépôts : extraction des fichiers suivis de
  `frontend/` au SHA audité, copie indépendante des dépendances installées.
- Typecheck du package mobile ; ESLint direct avec la configuration existante, sans
  `--fix` ni cache.

### Hors périmètre

- Correction applicative ; modification de `tsconfig` ou d'ESLint.
- Installation, téléchargement, Turbo sur tout le monorepo, build, test applicatif,
  `expo-doctor`, service.
- Copie de `.env`, credential, cache Expo ou secret ; lien vers la source.
- Modification du dépôt source ; configuration globale ; délégation ; commit, push,
  amend.

## État de départ

- **`yunimobile`** : `main` @ `cd5bab271d1caad528b1fc6d1c6eb2476a1887d5`, arbre
  propre.
- **Source** : `feat/c3-global-refonte-preview` @ SHA audité, état Git identique à
  l'instantané de YUNIMOBILE-0006.

## Critères d'acceptation

- [x] Typecheck du mobile exécuté dans la copie isolée ; preuves consignées.
- [x] ESLint du mobile exécuté dans la copie isolée ; preuves consignées.
- [x] Diagnostics classés (code mobile, package partagé, configuration,
      environnement), causes démontrées et hypothèses distinguées.
- [x] État Git de la source inchangé.
- [x] Périmètre et format des trois fichiers ; `git diff --check`.

## Plan

1. Vérifier les dépôts ; inspecter scripts, outils et configurations.
2. Mesurer les dépendances et l'espace disponible.
3. Extraire, copier, exécuter, consigner.

## Risques et décisions ouvertes

- Espace disque insuffisant à la première tentative (voir « Journal ») ; levé après
  suppression autorisée de sept `.next-build` de worktrees inactifs.
- Dépendances réutilisées non vérifiées contre le lockfile.

## Vérifications prévues

- [x] Résolutions de packages limitées à la copie.
- [x] Instantané Git de la source avant / après.
- [x] Format et périmètre des fichiers documentaires.

## Journal des tentatives

| # | Hypothèse | Action | Résultat |
|---|---|---|---|
| 1 | La copie des dépendances tient sur le disque | Mesure sans copie (`robocopy /L`, `Get-PSDrive`, `Get-Volume`) | ~920 Mo et 62 209 fichiers pour 1,61 à 1,74 Go libres sur `C:` ; aucun autre volume utilisable. Kyria décide de ne pas copier. Blocage. |
| 2 | La copie tient après libération d'espace (5,2 Gio libres) | Copie isolée dans `C:\tmp\yunimobile-0007-diag\` | 4,04 Gio libres après copie (seuil 3 Gio) ; diagnostics exécutés. |

## Résultats et preuves

Détail : `docs/engineering/mobile-static-diagnostics.md`. Contrôles propres (Claude),
2026-10-02, copie `C:\tmp\yunimobile-0007-diag\` (conservée, journaux dans `logs\`) :

- Typecheck : `tsc --noEmit -p tsconfig.json --pretty false` → exit 0, 0 erreur.
- ESLint 8.57.1, périmètre `expo lint` (`app`, `components`) → exit 0, 51 fichiers,
  0 erreur, 0 avertissement.
- ESLint, package complet → exit 0, 69 fichiers, 0 erreur, 1 avertissement
  (`react-hooks/exhaustive-deps`, `hooks/use-search.ts:115`).
- Copie : 2 551 fichiers suivis au SHA ; dépendances copiées sans lien vers la
  source ; jonctions de workspace recréées dans la copie ; résolutions `tsc` et
  ESLint dans la copie ; 592 fichiers identiques aux blobs du SHA après diagnostics.
- Source inchangée (instantané avant / après).

## Revue

- [x] Revue CTO en conversation : audit statique approuvé ; périmètre `app` +
      `components` reconnu équivalent au défaut de `expo lint` (pas de `src`)
- [x] Auto-vérification
- [ ] Revue indépendante (par : …)
- [ ] Non réalisée (raison : …)

## Actions Git et installations autorisées

- **Commit** : oui — commit local de clôture, autorisé par Kyria en conversation
  (`docs: record existing mobile static diagnostics`)
- **Push** : non
- **Merge** : non
- **Déploiement / publication** : non
- **Installation** : non

## Rapport final

- Fichiers créés : `.loop/tickets/YUNIMOBILE-0007.md`,
  `docs/engineering/mobile-static-diagnostics.md`.
- Fichiers modifiés : `.loop/state.md`.
- Hors dépôt : copie isolée `C:\tmp\yunimobile-0007-diag\` (conservée pour revue) ;
  suppression autorisée de sept `.next-build` de worktrees (consignée § 8 du
  rapport).
- Vérifications : voir « Résultats et preuves ».
- Limites : dépendances non vérifiées contre le lockfile ; Node du poste ; types
  de routes `.expo/types` absents ; `expo lint` reproduit, non exécuté ; aucun
  build ni contrôle de compatibilité Expo.
- Décision CTO : warning `hooks/use-search.ts:115` documenté comme dette, non
  corrigé ; les résultats renforcent l'option A (extraction) sans décider la
  stratégie de reprise.
- Décisions ouvertes : stratégie de reprise (option A hypothèse principale).
- Actions Git / installations : un commit local de clôture ; aucun push ni
  installation. Copie isolée conservée pour YUNIMOBILE-0008.
- **Prochaine action proposée** : diagnostic de compatibilité Expo dans un ticket
  séparé (YUNIMOBILE-0008, non lancé).
