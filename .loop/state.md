# État du loop — Yunicity Mobile

**Mis à jour le** : 2026-10-01 18:02 (Europe/Paris, UTC+02:00)

## Étape en cours

**Étape 0 — Initialisation du dépôt** : en cours.

| Sous-étape | Ticket | Statut |
|---|---|---|
| 0.1 Fichiers de base et fins de ligne | YUNIMOBILE-0001, YUNIMOBILE-0001A | Clôturée selon les rapports fournis |
| 0.2 Doctrine commune et protocole du loop | YUNIMOBILE-0002 | Terminé |
| 0.3 Adaptateurs IA | YUNIMOBILE-0003 | Terminé pour la configuration documentaire ; chargements en session non vérifiés |

## Ticket actif

**Aucun ticket en cours.**

### Historique — YUNIMOBILE-0003

Fichier : `.loop/tickets/YUNIMOBILE-0003.md`.

- **Commit de départ** : `9195adb6af1ecc612397f21e6ec5584dc3d7488b`
  (`docs: add shared agent doctrine and loop protocol`).
- **Points d'entrée créés** (inclus dans le commit de clôture de 0.3) :
  - Claude Code : `CLAUDE.md` (importe `@AGENTS.md`) ;
  - Cursor : `.cursor/rules/00-project-entry.mdc` ;
  - Codex : `AGENTS.md` lu directement, sans adaptateur ;
  - documentation : `docs/engineering/agent-setup.md`.
- `AGENTS.md` décrit désormais ces points d'entrée existants.
- Revue du contenu par le CTO en conversation ; contrôles locaux exécutés par Claude,
  sans réexécution indépendante.
- **Chargements en session non vérifiés** : aucune session neuve de Claude Code,
  Codex ou Cursor n'a été exécutée (procédure dans `docs/engineering/agent-setup.md`).

### Historique — YUNIMOBILE-0002

- Texte transmis en conversation ; aucun fichier de ticket enregistré dans
  `.loop/tickets/` (antérieur à la règle d'enregistrement).
- Revue CTO du contenu effectuée en conversation ; ajustements demandés puis réalisés.
- Validation du contenu effectuée en conversation par le CTO.
- Contrôles locaux exécutés par Claude, sans réexécution indépendante.

## État du dépôt

- **Commit de base** : `f9964e425b0c9bc04d2260904354021fb4aaac33`
  (`chore: bootstrap mobile repository`).
- Les fichiers de YUNIMOBILE-0002 sont inclus dans le commit de clôture de 0.2.
- Les fichiers de YUNIMOBILE-0003 sont inclus dans le commit de clôture de 0.3.
- **Aucun push** n'a été effectué à ce stade.
- **Aucune application, dépendance, skill ou plugin** n'est installé.

## Dépôt lié

- Une base Expo existe dans `frontend/apps/mobile` de
  <https://github.com/Kyria-Zaire/yunicity.review>.
- Son extraction vers ce dépôt **n'a pas été effectuée**.

## Décisions ouvertes

- Reprise de la base Expo existante (méthode et périmètre).
- Distribution des packages partagés entre web et mobile.
- Traitement de `debug.keystore` (actuellement ignoré comme tous les keystores).
- Identité Git (adresse e-mail d'auteur) à corriger avant toute publication.

## Prochaine étape proposée

**Vérification en sessions neuves** de Claude Code, Codex et Cursor selon
`docs/engineering/agent-setup.md`, **avant les skills** (0.4 — Skills / plugins).
Non lancée : en attente de décision.
