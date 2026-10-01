# Configuration des agents

Comment Claude Code, Codex et Cursor sont reliés à la doctrine commune.

## Source commune

[`AGENTS.md`](../../AGENTS.md) est la **seule source** des consignes. Les adaptateurs
ci-dessous y renvoient sans la recopier ni ajouter de règles.

| Outil | Point d'entrée | Mécanisme |
|---|---|---|
| Claude Code | [`CLAUDE.md`](../../CLAUDE.md) | Importe la doctrine par la ligne `@AGENTS.md`. |
| Cursor | [`.cursor/rules/00-project-entry.mdc`](../../.cursor/rules/00-project-entry.mdc) | Règle `alwaysApply: true` qui demande de lire et suivre `AGENTS.md`. |
| Codex | [`AGENTS.md`](../../AGENTS.md) | Lu directement ; aucun adaptateur `.codex/AGENTS.md`. |

- **Claude Code** : `CLAUDE.md` importe uniquement `AGENTS.md`. `.loop/state.md` et le
  ticket actif sont cités sans import, pour éviter de charger tous les tickets.
  Aucun `.claude/CLAUDE.md` n'est créé.
- **Cursor** : la règle `.mdc` renvoie vers `AGENTS.md` par référence textuelle ; elle
  ne contient pas la doctrine.
- **Codex** : utilise `AGENTS.md` à la racine sans fichier intermédiaire.

## Skills futurs

Emplacements réservés, non ignorés par Git. Vides à ce stade, ils ne sont pas encore
suivis (Git ne versionne pas les répertoires vides) :

- `.claude/skills/` (Claude Code) ;
- `.agents/skills/` (skills partagés entre agents).

## Ce qui n'est pas configuré

- Aucun skill ni plugin installé.
- Aucun rôle multi-agent, hook, serveur MCP ni `config.toml` créé.
- Les consignes personnelles d'un utilisateur, hors dépôt, peuvent aussi être chargées
  par certains outils ; elles ne font pas partie de cette configuration.

## Limite de sécurité

Ces fichiers sont des **instructions textuelles**. Un agent peut les ignorer ou les
mal interpréter : ils ne constituent **pas un contrôle de sécurité exécutable**. Les
protections réelles (permissions, revue, CI, contrôles d'accès serveur) restent
nécessaires.

## Procédure de vérification

À exécuter pour chaque outil, **sans modifier de fichier** :

1. Ouvrir une **nouvelle session** de l'outil à la racine du dépôt.
2. Demander à l'agent d'identifier le **ticket actif** d'après `.loop/state.md`.
3. Lui demander de résumer le **périmètre** et les **actions autorisées** de ce ticket.
4. Vérifier qu'aucun fichier n'a été modifié (`git status --short` inchangé).
5. Relever les **indices de chargement** fournis par l'outil lui-même (liste des
   fichiers ou règles chargés, mention dans l'interface ou la sortie), s'il en
   fournit.

Un résumé correct ne prouve pas à lui seul le chargement automatique : l'agent peut
avoir lu les fichiers à la demande. Seuls les indices fournis par l'outil le montrent.

Si l'outil n'est pas disponible, marquer sa vérification **« non exécutée »**.

### Résultats

| Outil | Vérification | Date | Indices de chargement |
|---|---|---|---|
| Claude Code | non exécutée | — | — |
| Codex | non exécutée | — | — |
| Cursor | non exécutée | — | — |
