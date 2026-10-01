# YUNIMOBILE-0005 — Installer deux skills d'ingénierie adaptés

- **Statut** : terminé
- **Créé le** : 2026-10-01
- **Mis à jour le** : 2026-10-01 21:43 (Europe/Paris, UTC+02:00)

## Objectif

Installer deux skills documentaires versionnés, compatibles avec le loop :
`yunicity-verification` et `yunicity-debugging`, adaptés de Superpowers.

## Contexte et références

- Suite de YUNIMOBILE-0004 (`docs/engineering/skills-selection.md`, décisions CTO).
- Texte du ticket transmis en conversation par le CTO, enregistré ici.
- Source autorisée : `obra/superpowers` au commit
  `8ca22dba9a94f28898bbce59f2537ff4d87c747d`.

## Périmètre

### Autorisé

- `.loop/tickets/YUNIMOBILE-0005.md`, `.loop/state.md`
- `docs/engineering/agent-setup.md`, `docs/engineering/skills-provenance.md`
- `.agents/skills/yunicity-verification/`, `.agents/skills/yunicity-debugging/`
- `.claude/skills/yunicity-verification/`, `.claude/skills/yunicity-debugging/`
- Lecture réseau des sources et des documentations officielles.

### Hors périmètre

- Configuration globale (dont Superpowers global), plugin, dépendance, script tiers.
- Hook, MCP, installateur ou script exécutable dans les skills.
- `find-polluter.sh`, `condition-based-waiting-example.ts`.
- Lancement de sous-agent, de `claude -p` ou de `codex`.
- Commit, push, amend, délégation ; autre projet.

## État de départ

- **Branche / HEAD** : `main` / `df9f9d118f1f6b4ba528dd5d9ee24a72161e3e54`
  (baseline attendue confirmée)
- **`git status --short`** : vide
- `.claude/skills/` et `.agents/skills/` : présents, vides.

## Critères d'acceptation

- [x] Chemins de découverte projet confirmés dans les documentations officielles,
      sources consignées.
- [x] Deux skills installés dans `.agents/skills/` (référence) et `.claude/skills/`
      (copies identiques octet par octet), sans lien symbolique.
- [x] Licence MIT et attribution présentes dans chaque dossier de skill.
- [x] Adaptations demandées appliquées ; aucun lien local cassé ; aucun script,
      hook ni MCP.
- [x] Frontmatter `name` = nom local ; description ciblée.
- [x] `skills-provenance.md` : chemins, SHA complets confirmés, liste des changements,
      procédure de synchronisation des copies, limite Superpowers global.
- [x] Deux prompts de test en session documentés, marqués « non exécutés ».
      Résultats consignés ensuite à la clôture (voir « Tests en session neuve »).
- [x] UTF-8, LF, newline finale, aucun fichier ignoré ; `git diff --check` propre.

## Plan

1. Confirmer les chemins (docs officielles).
2. Télécharger les sources au SHA figé dans le scratchpad, vérifier les blobs.
3. Rédiger les versions adaptées dans `.agents/skills/`, copier vers `.claude/skills/`.
4. Documenter provenance, synchronisation et tests ; mettre à jour `agent-setup.md`.
5. Vérifier, mettre à jour l'état.

## Risques et décisions ouvertes

- Superpowers global (6.4.1) reste actif : ses skills non adaptés et son hook
  `SessionStart` coexistent avec les versions locales.

## Vérifications prévues

- [x] Relecture intégrale des versions adaptées.
- [x] Liens locaux, licences, frontmatters.
- [x] Comparaison octet par octet Claude / Codex.
- [x] UTF-8, LF, newline finale, fichiers non ignorés (suivis et non suivis).
- [x] `git diff --check`, `git status --short`.

## Journal des tentatives

| # | Hypothèse | Action | Résultat |
|---|---|---|---|
| — | Aucun blocage | — | — |

## Résultats et preuves

Contrôles propres (Claude), sur l'arbre de travail issu de `df9f9d1` :

- Documentation Claude Code (<https://code.claude.com/docs/en/skills>) → projet :
  `.claude/skills/<skill-name>/SKILL.md` ; `.agents/skills` non mentionné.
- Documentation Codex (<https://learn.chatgpt.com/docs/build-skills>, redirection de
  `developers.openai.com/codex/skills`) → `.agents/skills` du cwd jusqu'à la racine
  du dépôt ; `name` et `description` requis.
- Six fichiers source téléchargés au commit figé dans le scratchpad de session ;
  `git hash-object` = blob API pour chacun.
- `diff -r .agents/skills .claude/skills` → aucune sortie ; `cmp` fichier par
  fichier → aucune différence.
- Frontmatter : `name` = nom du dossier pour les deux skills.
- Liens Markdown relatifs des skills, de `skills-provenance.md` et de
  `agent-setup.md` → tous résolus ; ancre `#skills-projet` présente.
- Aucune occurrence de `find-polluter`, `condition-based-waiting-example`,
  `superpowers:`, `IDENTITY:-UNSET`, `env | grep`, `human partner` dans les skills.
- Aucun fichier `.sh`, `.js`, `.ts`, `.py`, `.cjs`, `.json` ni hook dans les skills.
- Fichiers suivis modifiés et non suivis : UTF-8/ASCII, 0 CR, newline finale,
  0 espace final ; `git check-ignore` → aucun ignoré.
- Blobs et SHA-256 locaux = valeurs de `skills-provenance.md`.
- `git diff --check` → aucune sortie.
- Indice non demandé : la session Claude Code en cours a listé `yunicity-debugging`
  et `yunicity-verification` parmi ses skills disponibles après création des
  fichiers. Ce n'est pas un test en session neuve.

### Corrections de revue CTO (2026-10-01)

- `yunicity-verification` : lire une sortie ou un diff est une inspection propre,
  sans changement de provenance de l'exécution rapportée ; ligne « Configured
  typecheck passes » ; un typecheck sans erreur ne prouve pas la correction
  fonctionnelle.
- `yunicity-debugging` :
  - red flag : quatrième tentative, ou tentative sans hypothèse ni preuve nouvelle ;
  - « When no root cause is found » réécrit : cause démontrée ou hypothèse ;
    mitigation justifiée, autorisée, vérifiée et rapportée comme telle ;
  - validations supplémentaires limitées aux besoins démontrés.
- Guides : `defense-in-depth.md` et `root-cause-tracing.md` alignés ;
  `condition-based-waiting.md` relu, inchangé.
- Contrôles après correction : copies identiques (`diff -r`, `cmp`), empreintes de
  `skills-provenance.md` mises à jour, format et `git diff --check` vérifiés.

### Tests en session neuve (2026-10-01)

Rapports transmis par Kyria en conversation ; **non réexécutés** lors de la clôture :

- Claude Code, nouvelle session : `/yunicity-verification` et `/yunicity-debugging`
  invoqués avec succès depuis `.claude/skills/` ; contenu adapté confirmé par
  l'outil Skill (« Configured typecheck passes », « Diagnostic hygiene »).
- Claude Code : scénarios fictifs conformes, exécutés dans la session précédente.
- Codex, nouvelle conversation : deux skills présents dans le catalogue initial,
  chemins `.agents/skills/`, contenu fourni dans les blocs skill ; scénarios
  fictifs conformes, sans lecture manuelle de secours.
- Portée : découverte et comportement sur ces scénarios, pas une garantie générale
  de respect des instructions.
- Superpowers global inchangé ; coexistence documentée dans
  `docs/engineering/skills-provenance.md`. Cursor reporté.

### Contrôles de clôture (Claude)

Contrôles propres (Claude), le 2026-10-01, sur l'arbre de travail issu de `df9f9d1` :

- `diff -r .agents/skills .claude/skills` → aucune sortie ; `cmp` fichier par
  fichier → aucune différence ; aucun lien symbolique.
- `git hash-object` et `sha256sum` des 14 fichiers de skills = valeurs de
  `skills-provenance.md`.
- Chaque `LICENSE` : MIT, `Jesse Vincent` ; en-tête d'attribution présent dans
  chaque fichier Markdown.
- Index : 18 fichiers, tous dans le périmètre autorisé, ajoutés par chemins
  explicites ; aucun fichier ignoré ; UTF-8/ASCII, 0 CR, newline finale.
- `git diff --cached --check` → aucune sortie, exit 0 ; diff indexé relu.

## Revue

- [x] Revue CTO en conversation : corrections demandées puis appliquées ; clôture
      demandée par Kyria après les tests en session
- [x] Auto-vérification
- [ ] Revue indépendante (par : …)
- [ ] Non réalisée (raison : …)

## Actions Git et installations autorisées

- **Commit** : oui — commit local de clôture, autorisé par Kyria en conversation
  (`chore: add adapted verification and debugging skills`)
- **Push** : non
- **Merge** : non
- **Déploiement / publication** : non
- **Installation** : oui — fichiers documentaires des deux skills uniquement ; aucune
  configuration globale, plugin, dépendance ni script tiers

## Rapport final

- Fichiers créés : `.loop/tickets/YUNIMOBILE-0005.md`,
  `docs/engineering/skills-provenance.md`, `.agents/skills/yunicity-verification/`
  (`SKILL.md`, `LICENSE`), `.agents/skills/yunicity-debugging/` (`SKILL.md`,
  `root-cause-tracing.md`, `defense-in-depth.md`, `condition-based-waiting.md`,
  `LICENSE`) et leurs copies identiques sous `.claude/skills/`.
- Fichiers modifiés : `docs/engineering/agent-setup.md`, `.loop/state.md`.
- Vérifications : voir « Résultats et preuves ».
- Fichiers modifiés à la clôture : `docs/engineering/agent-setup.md`,
  `docs/engineering/skills-provenance.md`, ce ticket, `.loop/state.md`.
- Limites : tests en session rapportés par Kyria, non réexécutés ; ils couvrent la
  découverte et des scénarios fictifs, pas le respect général des instructions ;
  documentation consultée via WebFetch (synthèse par modèle, citations à
  reconfirmer à la source si besoin).
- Décisions ouvertes : traitement du doublon Superpowers global ; skills Cursor
  (test Cursor reporté).
- Actions Git / installations : fichiers documentaires uniquement ; un commit local
  de clôture ; aucun push, amend, plugin, dépendance, script tiers, configuration
  globale ni sous-agent.
- **Prochaine action** : aucun ticket suivant lancé ; en attente de décision.
