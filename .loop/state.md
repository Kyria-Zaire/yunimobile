# État du loop — Yunicity Mobile

**Mis à jour le** : 2026-10-01 20:08 (Europe/Paris, UTC+02:00)

## Étape en cours

**Étape 0 — Initialisation du dépôt** : en cours.

| Sous-étape | Ticket | Statut |
|---|---|---|
| 0.1 Fichiers de base et fins de ligne | YUNIMOBILE-0001, YUNIMOBILE-0001A | Clôturée selon les rapports fournis |
| 0.2 Doctrine commune et protocole du loop | YUNIMOBILE-0002 | Terminé |
| 0.3 Adaptateurs IA | YUNIMOBILE-0003 | Terminé pour la configuration documentaire ; tests de session partiels (voir ci-dessous) |
| 0.4 Skills / plugins — audit et sélection | YUNIMOBILE-0004 | Terminé — audit terminé, installation non réalisée |

## Ticket actif

**Aucun ticket en cours.**

### Historique — YUNIMOBILE-0004

Fichier : `.loop/tickets/YUNIMOBILE-0004.md`. Rapport :
`docs/engineering/skills-selection.md`.

- **Commit de départ** : `ed0adfc8758b6633979bbccb9027932d1219284d`
  (`docs: configure agent entry points`).
- Première installation envisagée : `verification-before-completion` et
  `systematic-debugging`, en **versions locales adaptées** (décisions CTO détaillées
  dans le rapport).
- Différés : `expo-router` (confirmation de la base mobile), `expo-data-fetching`,
  `expo-project-structure`, `skill-creator`.
- Revue CTO en conversation ; ajustements intégrés ; contrôles locaux exécutés par
  Claude, sans réexécution indépendante.
- Aucune installation, aucun script tiers exécuté ; commit local de clôture, sans
  push.

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
- **Tests de session** (rapports transmis en conversation, non réexécutés) :
  - Claude Code : instructions du projet et import `@AGENTS.md` présents dans le
    contexte initial, selon son rapport sans outil ;
  - Codex : doctrine présente, comportement conforme ; mécanisme natif de
    chargement non vérifiable ;
  - Cursor : test reporté à la demande de Kyria, jusqu'au 7 octobre.

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
- Les fichiers de YUNIMOBILE-0004 sont inclus dans le commit de clôture de 0.4.
- **Aucun push** n'a été effectué à ce stade.
- **Aucune application, dépendance, skill ou plugin** n'est installé dans le dépôt.
- `.claude/rules/`, `.claude/skills/` et `.agents/skills/` existent localement,
  vides (non suivis par Git).

## Dépôt lié

- Une base Expo existe dans `frontend/apps/mobile` de
  <https://github.com/Kyria-Zaire/yunicity.review>.
- Son extraction vers ce dépôt **n'a pas été effectuée**.

## Décisions ouvertes

- Reprise de la base Expo existante (méthode, périmètre, version SDK) ; conditionne
  `expo-router`.
- Distribution des packages partagés entre web et mobile.
- Traitement de `debug.keystore` (actuellement ignoré comme tous les keystores).
- Identité Git (adresse e-mail d'auteur) à corriger avant toute publication.
- Plugin Superpowers 6.4.1 installé globalement (Claude Code, portée utilisateur,
  hook `SessionStart`) : **conservé inchangé** ; doublon avec les futures versions
  locales adaptées à traiter lors de l'installation et des tests de découverte.
- Chemin de découverte des skills Codex (`.agents/skills/`) à confirmer.
- Test Cursor de 0.3 : reporté jusqu'au 7 octobre.

## Prochaine étape proposée

Ticket d'installation des versions locales adaptées de
`verification-before-completion` et `systematic-debugging`, avec tests de découverte
en session neuve (Claude Code, Codex) et traitement du doublon Superpowers global.

Non lancé : en attente de décision.
