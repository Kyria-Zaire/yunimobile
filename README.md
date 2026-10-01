# Yunicity Mobile

Application iOS / Android de **Yunicity**, le réseau social local. Le lancement démarre à **Reims**.

> **Statut : dépôt en préparation.** Aucune application n'est encore installée ni générée dans ce dépôt. Aucune fonctionnalité n'est livrée à ce stade.

## Objectif

Lancement de l'application mobile **avant le 31 décembre 2026**.

## Contexte et dépôts liés

- Dépôt principal Yunicity : <https://github.com/Kyria-Zaire/yunicity.review>
- Une base Expo existe déjà dans `frontend/apps/mobile` de ce dépôt.
- La reprise de cette base et le partage des packages entre web et mobile feront l'objet de **tickets distincts**.
- Le **backend FastAPI** reste commun au web et au mobile ; il n'est pas dupliqué ici.

## Prochaines étapes

1. **Doctrine et loop** : conventions de travail, format des tickets (`.loop/tickets`), boucle d'exécution.
2. **Adaptateurs IA** : instructions par agent (`AGENTS.md`, `CLAUDE.md`, `.claude/rules`, `.cursor/rules`).
3. **Skills / plugins** : skills partagées (`.claude/skills`, `.agents/skills`) et outillage associé.
4. **Contrôles** : lint, typecheck, tests et vérifications CI.

## Conventions de fichiers

- Encodage UTF-8, fins de ligne LF, indentation de deux espaces (voir `.editorconfig`).
- Aucun secret versionné : seuls les fichiers `.env.example` / `.env.*.example` sont suivis (voir `.gitignore`).
