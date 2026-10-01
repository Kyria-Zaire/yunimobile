# État du loop — Yunicity Mobile

**Mis à jour le** : 2026-10-01 17:32 (Europe/Paris, UTC+02:00)

## Étape en cours

**Étape 0 — Initialisation du dépôt** : en cours.

| Sous-étape | Ticket | Statut |
|---|---|---|
| 0.1 Fichiers de base et fins de ligne | YUNIMOBILE-0001, YUNIMOBILE-0001A | Clôturée selon les rapports fournis |
| 0.2 Doctrine commune et protocole du loop | YUNIMOBILE-0002 | Terminé |
| 0.3 Adaptateurs IA | — | Proposée, non commencée |

## Ticket actif

**Aucun ticket en cours.**

Dernier ticket clôturé : **YUNIMOBILE-0002** — Doctrine commune et protocole du loop.
Son texte a été transmis en conversation ; aucun fichier de ticket n'est enregistré
dans `.loop/tickets/`.

### Validation de YUNIMOBILE-0002

- Revue CTO du contenu effectuée en conversation ; ajustements demandés puis réalisés.
- Validation du contenu effectuée en conversation par le CTO.
- Contrôles locaux exécutés par Claude, sans réexécution indépendante.

## État du dépôt

- **Commit de base** : `f9964e425b0c9bc04d2260904354021fb4aaac33`
  (`chore: bootstrap mobile repository`).
- Les fichiers de YUNIMOBILE-0002 sont inclus dans le commit de clôture de 0.2.
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

**0.3 — Adaptateurs IA** : fichiers propres à chaque agent (Claude Code, Codex,
Cursor) renvoyant vers `AGENTS.md`. Non lancée : en attente de décision.
