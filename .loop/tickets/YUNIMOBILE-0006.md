# YUNIMOBILE-0006 — Audit de reprise de la base mobile Expo

- **Statut** : terminé
- **Créé le** : 2026-10-01
- **Mis à jour le** : 2026-10-01 22:41 (Europe/Paris, UTC+02:00)

## Objectif

Déterminer ce qui existe réellement dans la base mobile du monorepo Yunicity, ses
dépendances au monorepo et les conditions de sa reprise dans `yunimobile`, sans
réaliser de migration.

## Contexte et références

- Décision ouverte « Reprise de la base Expo existante » (`.loop/state.md`).
- Texte du ticket transmis en conversation par Kyria, enregistré ici.
- Source : `C:\Users\kyria\yunicity` (`Kyria-Zaire/yunicity.review`),
  `frontend/apps/mobile`.
- Livrable : `docs/engineering/mobile-reuse-audit.md`.

## Périmètre

### Autorisé

- `.loop/tickets/YUNIMOBILE-0006.md`, `.loop/state.md`
- `docs/engineering/mobile-reuse-audit.md`
- `docs/engineering/agent-setup.md` : uniquement clarifier la référence historique
  des tests des adaptateurs (YUNIMOBILE-0003, consignés dans YUNIMOBILE-0004).
- Lecture seule du dépôt source.

### Hors périmètre

- Copie de code applicatif ; migration.
- Installation, exécution de script projet, build, test applicatif, démarrage de
  service.
- Toute modification du dépôt source (checkout, pull, fetch, écriture).
- Lecture de fichier secret ou affichage de valeur sensible.
- Commit, push, amend, changement global, sous-agent.

## État de départ

- **`yunimobile`** : `main` / `dc9427bede655fc540b22313a6fa6a8f5d284fd7` (baseline
  attendue confirmée) ; `git status --short` vide.
- **Source** : `feat/c3-global-refonte-preview` /
  `ee57ce1dfc37835a47335e56338578471a95ec7d` ; `git status --short` vide ;
  remote `Kyria-Zaire/yunicity.review`. Branche courante différente de `main` :
  base mobile identique sur HEAD et `origin/main` local.

## Critères d'acceptation

- [x] Chemins, remotes, branches, SHA et états Git des deux dépôts vérifiés.
- [x] Versions déclarées, verrouillées et installées distinguées.
- [x] Inventaire des routes et écrans, sans qualifier de « terminé » sur la seule
      présence de fichiers.
- [x] Authentification, packages partagés, configuration, tests, CI, builds et
      risques examinés.
- [x] Livrable avec options A/B/C, recommandation, ordre des tickets, inconnues.
- [x] Aucun fichier secret lu ; aucune valeur sensible reproduite.
- [x] État Git de la source inchangé ; périmètre, format et `git diff --check`
      vérifiés.

## Plan

1. Vérifier l'état des deux dépôts ; capturer l'état de la source.
2. Lire manifestes, configuration, routes, auth, packages partagés, CI.
3. Rédiger l'audit ; mettre à jour l'état et `agent-setup.md`.
4. Vérifier format, périmètre, état de la source.

## Risques et décisions ouvertes

- Aucun contrôle exécuté sur l'app (typecheck, lint, build) : conclusions fondées sur
  la lecture du code.
- `origin/main` local non rafraîchi (aucun fetch).

## Vérifications prévues

- [x] Instantané Git de la source avant / après, comparé.
- [x] Format (UTF-8, LF, newline finale, espaces finaux) des fichiers modifiés et non
      suivis.
- [x] Périmètre des fichiers modifiés ; `git diff --check`.

## Journal des tentatives

| # | Hypothèse | Action | Résultat |
|---|---|---|---|
| — | Aucun blocage | — | — |

## Résultats et preuves

Contrôles propres (Claude), le 2026-10-01 ; détail dans
`docs/engineering/mobile-reuse-audit.md` § 8.

- Source : commandes Git en `--no-optional-locks` ; instantané (HEAD, branche,
  `status --porcelain --untracked-files=all`, stashes, toutes les refs) capturé avant
  et après l'audit dans le scratchpad de session, puis comparé.
- Base mobile : 76 fichiers suivis ; aucune différence entre HEAD et `origin/main`
  local.
- Versions : Expo 54.0.34, RN 0.81.5, React 19.1.0, Expo Router 6.0.23,
  TypeScript 5.9.3 (lockfile et `node_modules`) ; pnpm 9.15.9.
- Constats principaux : appels API réels codés sur tous les domaines ; auth via
  `AuthClient` partagé et `expo-secure-store`, mode mobile supporté par le backend ;
  aucun test, aucun EAS, aucun build natif prouvé ; couplage fort à
  `@yunicity/utils` (barrel de 294 fichiers).
- `.env` de l'app présent localement (ignoré) : non ouvert.

### Ajustements de revue CTO (2026-10-01)

- Extraits de code ajoutés (effacement des jetons, URL de repli, secret QR),
  rattachés au SHA source complet, avec distinction lecture du code / déduction /
  non exécuté. Extraits issus de la lecture faite pendant l'audit, non relus.
- Affirmations atténuées : couplage du barrel `utils` présenté comme risque (graphe
  Metro non mesuré) ; absence de `ios/` et `android/` sans valeur de preuve ;
  contrainte de dev build limitée au module natif Mapbox ; secret QR transmis sans
  exposition démontrée ; `noUncheckedIndexedAccess` comme amélioration possible ;
  nouvelle base sans garantie de dette corrigée ni de montée de SDK réussie.
- Option B présentée comme préférence provisoire de l'auteur, sans décision CTO.
- Table des critères de décision ajoutée ; un contrôle échoué ne choisit pas B par
  défaut.
- Contrôles : format, périmètre, `git diff --cached --check`, relecture du diff
  indexé.

## Revue

- [x] Revue CTO en conversation : ajustements demandés puis appliqués
- [x] Auto-vérification
- [ ] Revue indépendante (par : …)
- [ ] Non réalisée (raison : …)

## Actions Git et installations autorisées

- **Commit** : oui — commit local de clôture, autorisé par Kyria en conversation
  (`docs: audit existing mobile app reuse`)
- **Push** : non
- **Merge** : non
- **Déploiement / publication** : non
- **Installation** : non

## Rapport final

- Fichiers créés : `.loop/tickets/YUNIMOBILE-0006.md`,
  `docs/engineering/mobile-reuse-audit.md`.
- Fichiers modifiés : `.loop/state.md`, `docs/engineering/agent-setup.md`
  (référence historique des tests des adaptateurs).
- Vérifications : voir « Résultats et preuves » et le rapport en conversation.
- Limites : aucune exécution (typecheck, lint, `expo-doctor`, build) ; CI non
  consultée ; pas de fetch ; stashes et worktrees de la source non examinés.
- Décisions ouvertes : **stratégie de reprise non décidée** (A/B/C) ; SDK cible ;
  distribution des packages partagés ; comptes de publication.
- Actions Git / installations : un commit local de clôture ; aucun push, amend ni
  installation ; dépôt source non modifié.
- **Prochaine action proposée** : diagnostic typecheck / lint de la base existante.
  Aucun ticket suivant lancé.
