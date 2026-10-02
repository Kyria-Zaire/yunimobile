# YUNIMOBILE-0009A — Hygiène de l'historique Git avant publication

- **Statut** : terminé
- **Créé le** : 2026-10-02
- **Mis à jour le** : 2026-10-02 10:44 (Europe/Paris, UTC+02:00)

## Objectif

Corriger l'auteur et le committer des 9 commits locaux de `main` vers l'identité
Kyria-Zaire avec adresse GitHub noreply vérifiée, avant tout push, sans modifier le
contenu, l'ordre, les messages, les lignes `Co-Authored-By` ni les dates.

## Contexte et références

- Décision ouverte « Identité Git à corriger avant toute publication »
  (`.loop/state.md`).
- Texte du ticket transmis en conversation par Kyria. **Ce fichier n'a été créé
  qu'après la réécriture validée** : la réécriture exigeait un arbre de travail
  propre. Pendant l'opération, le texte de la conversation faisait référence.
- Rapport : `docs/engineering/git-history-hygiene.md`.

## Périmètre

### Autorisé

- Identité Git configurée localement dans ce dépôt.
- Branche locale `backup/pre-yunimobile-0009a`.
- Réécriture de `main` par `git filter-branch --env-filter`.
- Journaux hors dépôt dans `C:\tmp\yunimobile-0009a\`.
- `.loop/tickets/YUNIMOBILE-0009A.md`, `docs/engineering/git-history-hygiene.md`,
  `.loop/state.md` ; commit de traçabilité.

### Hors périmètre

- Push ; modification du contenu, de l'ordre ou des messages ; squash ; suppression
  de `Co-Authored-By` ; rebase interactif.
- `git gc`, `prune`, expiration du reflog ; suppression de l'historique d'origine ou
  de `refs/original`.
- Configuration Git globale ; installation ; sous-agent ; YUNIMOBILE-0010.
- Adresse e-mail dans les fichiers suivis.

## État de départ

- **Branche / HEAD** : `main` @ `68b1dd8749dbbc3700ca600a8fc06bb41b85dacf`.
- **`git status --short`** : vide. 9 commits, aucun merge, aucune signature, aucun
  tag, aucune référence distante.

## Critères d'acceptation

- [x] Préconditions vérifiées (statut, branche, 9 commits, linéaire, `origin`,
      signatures, branche de sauvegarde absente).
- [x] État d'origine capturé hors dépôt.
- [x] Branche de récupération créée sur l'ancien HEAD et conservée.
- [x] Identité locale configurée ; configuration globale inchangée.
- [x] 9 commits réécrits ; trees, messages, dates et `Co-Authored-By` identiques ;
      auteur et committer conformes.
- [x] `git diff backup..main` vide ; `git status` vide ; `git fsck --full` sans
      corruption ; `origin` et tags inchangés ; aucun push.
- [x] Documentation sans adresse e-mail ; commit de traçabilité avec l'identité
      cible.

## Plan

1. Préconditions. 2. Capture. 3. Sauvegarde. 4. Identité locale. 5. Réécriture.
6. Vérifications. 7. Documentation et commit.

## Risques et décisions ouvertes

- Branche `backup/pre-yunimobile-0009a` et `refs/original` à supprimer seulement
  après vérification du premier push.

## Vérifications prévues

- [x] Comparaisons par position et par empreinte (trees, messages, dates,
      `Co-Authored-By`).
- [x] `git fsck --full`.

## Journal des tentatives

| # | Hypothèse | Action | Résultat |
|---|---|---|---|
| 1 | `filter-branch --env-filter` sur `main` réécrit seulement l'identité | Réécriture unique | Exit 0 ; toutes les vérifications réussies |

## Résultats et preuves

Contrôles propres (Claude), 2026-10-02. Détail et table ancien → nouveau SHA :
`docs/engineering/git-history-hygiene.md`.

- Ancien HEAD `68b1dd8749dbbc3700ca600a8fc06bb41b85dacf` → nouveau HEAD
  `64ec1d66327bb2da52a8c06abf9e2a581d2ba720` (9 commits réécrits).
- 17 contrôles après réécriture : tous OK.
- `git fsck --full` : exit 0 ; 24 objets orphelins, aucune corruption.

## Revue

- [x] Auto-vérification
- [ ] Revue indépendante (par : …)
- [ ] Non réalisée (raison : …)

## Actions Git et installations autorisées

- **Commit** : oui — commit de traçabilité
  (`chore: normalize local Git authorship`)
- **Push** : non
- **Merge** : non
- **Déploiement / publication** : non
- **Installation** : non
- **Autres** : configuration Git locale, branche de sauvegarde, `filter-branch` sur
  `main`

## Rapport final

- Fichiers créés : `.loop/tickets/YUNIMOBILE-0009A.md`,
  `docs/engineering/git-history-hygiene.md`.
- Fichiers modifiés : `.loop/state.md`.
- Hors dépôt : journaux `C:\tmp\yunimobile-0009a\` (contiennent des sorties Git
  brutes avec adresses).
- Limites : adresse noreply non vérifiée auprès de GitHub ; état distant non
  interrogé.
- Actions Git : identité locale, branche de sauvegarde, réécriture de `main`, commit
  de traçabilité ; aucun push, nettoyage ni suppression.
- **Prochaine étape (non lancée)** : YUNIMOBILE-0010 — extraction permanente de
  l'application validée dans `yunimobile`.
