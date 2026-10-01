# YUNIMOBILE-0003 — Adaptateurs IA

- **Statut** : terminé (configuration documentaire) — chargements en session non vérifiés
- **Créé le** : 2026-10-01
- **Mis à jour le** : 2026-10-01 18:02 (Europe/Paris, UTC+02:00)

## Objectif

Relier Claude Code, Codex et Cursor à la doctrine commune (`AGENTS.md`), sans
dupliquer les règles ni installer d'outil.

## Contexte et références

- Étape 0.3 de l'initialisation du dépôt (voir `.loop/state.md`).
- Doctrine commune : `AGENTS.md`.
- Workflow : `docs/engineering/loop-protocol.md`.
- Texte du ticket transmis en conversation par le CTO, enregistré ici.

## Périmètre

### Autorisé

- Créer `.loop/tickets/YUNIMOBILE-0003.md` (ce fichier) et le tenir à jour.
- Créer `CLAUDE.md` à la racine (25 lignes maximum), important `@AGENTS.md`.
- Créer `.cursor/rules/00-project-entry.mdc` (30 lignes maximum).
- Créer `docs/engineering/agent-setup.md`.
- Mettre à jour `.loop/state.md`.

### Hors périmètre

- Recopier la doctrine dans les adaptateurs.
- Créer `.claude/CLAUDE.md`, `.codex/AGENTS.md`, `config.toml`, hooks, MCP ou rôles
  multi-agents.
- Installer des skills, plugins ou dépendances.
- Modifier tout autre fichier du dépôt ou un autre projet.
- Modifier la configuration globale.

## État de départ

- **Branche / HEAD** : `main` / `9195adb6af1ecc612397f21e6ec5584dc3d7488b`
- **`git status --short`** : vide (arbre propre)
- **Fichiers concernés** :
  - `.loop/tickets/YUNIMOBILE-0003.md` (création)
  - `CLAUDE.md` (création)
  - `.cursor/rules/00-project-entry.mdc` (création)
  - `docs/engineering/agent-setup.md` (création)
  - `.loop/state.md` (modification)

## Critères d'acceptation

- [x] `CLAUDE.md` ≤ 25 lignes, importe `@AGENTS.md` hors bloc de code, renvoie à
      `.loop/state.md` et au ticket actif sans importer les tickets.
- [x] `.cursor/rules/00-project-entry.mdc` ≤ 30 lignes, frontmatter conforme
      (`description`, `alwaysApply: true`).
- [x] `docs/engineering/agent-setup.md` documente les trois outils et une procédure
      de vérification par outil.
- [x] Aucune règle de la doctrine recopiée dans les adaptateurs.
- [x] `.loop/state.md` référence ce ticket et distingue adaptateurs créés et
      chargement vérifié.
- [x] Références locales existantes ; UTF-8, LF, newline finale ; fichiers non ignorés.
- [x] Aucun autre fichier modifié.

Hors critères : le **chargement réel** des adaptateurs par chaque outil n'est pas
vérifié (voir Revue).

## Plan

1. Enregistrer ce ticket.
2. Créer les trois adaptateurs / documents.
3. Mettre à jour `.loop/state.md`.
4. Contrôles locaux, puis mise à jour de ce fichier et rapport.

## Risques et décisions ouvertes

- Des consignes globales de l'utilisateur (hors dépôt) peuvent aussi être chargées
  par les outils et interagir avec la doctrine du dépôt.

## Vérifications prévues

- [x] Relecture des cinq fichiers.
- [x] Références locales et import relatif depuis `CLAUDE.md`.
- [x] Frontmatter Cursor.
- [x] UTF-8, LF, newline finale, `git check-ignore`.
- [x] Autres fichiers inchangés (`git status --short`, `git diff`).

## Journal des tentatives

| # | Hypothèse | Action | Résultat |
|---|---|---|---|
| — | Aucun échec de contrôle | — | — |

Correction de relecture : `agent-setup.md` décrivait `.claude/skills/` et
`.agents/skills/` comme « versionnés » alors que Git ne suit pas les répertoires
vides ; formulation corrigée.

## Résultats et preuves

- Lignes : `CLAUDE.md` 18 (≤ 25), `00-project-entry.mdc` 19 (≤ 30).
- `CLAUDE.md` : une seule ligne d'import `@AGENTS.md` (ligne 10), aucun bloc de code ;
  `./AGENTS.md` existe ; aucun autre `@` dans le fichier.
- Frontmatter `.mdc` : `---` / `description: "Point d'entrée des consignes Yunicity
  Mobile"` / `alwaysApply: true` / `---`, en tête de fichier.
- Toutes les références locales existent ; liens relatifs de `agent-setup.md` valides.
- Cinq fichiers : UTF-8 valide, 0 octet CR, newline finale, aucun espace final,
  aucun ignoré par Git.
- `git diff --name-only` : seul `.loop/state.md` modifié parmi les fichiers suivis.
- Absents comme attendu : `.claude/CLAUDE.md`, `.codex/`.
- Outils présents dans le PATH : `claude`, `codex`, `cursor` (non lancés).

## Revue

- [x] Auto-vérification (contrôles locaux par Claude)
- [x] Revue du contenu par le CTO en conversation (pas une réexécution des contrôles)
- [x] Vérification de chargement en session réelle non réalisée (raison : hors
      exécution de ce ticket ; procédure documentée dans
      `docs/engineering/agent-setup.md`)

## Actions Git et installations autorisées

- **Commit** : oui, à la clôture uniquement (voir « Clôture »)
- **Push** : non
- **Merge** : non
- **Déploiement / publication** : non
- **Installation** (dépendances, skills, plugins) : non

## Clôture

Après revue CTO, périmètre supplémentaire explicitement autorisé :

- `AGENTS.md` : passage annonçant les adaptateurs comme futurs remplacé par la
  description des points d'entrée existants (`CLAUDE.md`,
  `.cursor/rules/00-project-entry.mdc`, lecture native par Codex) et un renvoi vers
  `docs/engineering/agent-setup.md`. Aucun autre passage modifié.
- **Commit local autorisé** : `docs: configure agent entry points`, limité aux six
  fichiers du ticket. Push, merge, publication, installation et amend : non.
- Outils non lancés pendant la clôture ; chargements en session non vérifiés.

## Rapport final

- Fichiers créés : `CLAUDE.md`, `.cursor/rules/00-project-entry.mdc`,
  `docs/engineering/agent-setup.md`, `.loop/tickets/YUNIMOBILE-0003.md`.
- Fichiers modifiés : `.loop/state.md`, `AGENTS.md` (clôture).
- Vérifications et résultats : voir « Résultats et preuves ».
- Revue : contenu revu par le CTO en conversation ; contrôles locaux exécutés par
  Claude, sans réexécution indépendante.
- Limites de la validation : chargements en session non vérifiés pour Claude Code,
  Codex et Cursor.
- Décisions ouvertes : aucune propre à ce ticket.
- Actions Git / installations effectuées : un commit local de clôture ; aucun push,
  aucune installation.
- **Prochaine action proposée** : vérification en sessions neuves de chaque outil
  selon `docs/engineering/agent-setup.md`, avant les skills.
