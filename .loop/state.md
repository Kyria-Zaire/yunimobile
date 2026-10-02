# État du loop — Yunicity Mobile

**Mis à jour le** : 2026-10-02 04:04 (Europe/Paris, UTC+02:00)

## Étape en cours

**Étape 0 — Initialisation du dépôt** : en cours.

| Sous-étape | Ticket | Statut |
|---|---|---|
| 0.1 Fichiers de base et fins de ligne | YUNIMOBILE-0001, YUNIMOBILE-0001A | Clôturée selon les rapports fournis |
| 0.2 Doctrine commune et protocole du loop | YUNIMOBILE-0002 | Terminé |
| 0.3 Adaptateurs IA | YUNIMOBILE-0003 | Terminé pour la configuration documentaire ; tests de session partiels (voir ci-dessous) |
| 0.4 Skills / plugins — audit et sélection | YUNIMOBILE-0004 | Terminé — audit terminé, installation non réalisée |
| 0.5 Skills — installation de deux skills adaptés | YUNIMOBILE-0005 | Terminé |
| 0.6 Audit de reprise de la base mobile Expo | YUNIMOBILE-0006 | Terminé — audit terminé, stratégie de reprise non décidée |
| 0.7 Diagnostic typecheck et lint de la base mobile | YUNIMOBILE-0007 | Terminé |
| 0.8 Diagnostic de compatibilité Expo SDK 54 | YUNIMOBILE-0008 | Terminé — option A (extraction contrôlée) approuvée |

## Ticket actif

Aucun. Aucun ticket suivant n'est lancé.

### Historique — YUNIMOBILE-0008

- Fichier : `.loop/tickets/YUNIMOBILE-0008.md`. Rapport :
  `docs/engineering/mobile-expo-compatibility.md`.
- **Commit de départ** : `2f148a5168c73b8742411db00e7e93c8a039e800`.
- Copie `C:\tmp\yunimobile-0007-diag` conservée ; journaux dans `logs/YUNIMOBILE-0008`.
- `expo install --check` : exit 1, 4 écarts de versions correctives SDK 54.
- `expo-doctor` 1.20.4 : exit 1, 15/18 ; échecs : Metro `watchFolders` (cohérent
  avec le monorepo, à ne pas reprendre tel quel), 58 emplacements de React (risque
  de résolution à éliminer pendant l'extraction ; plusieurs instances au chargement
  non démontrées), mêmes correctifs SDK.
- Aucune incompatibilité explicite avec Expo SDK 54 détectée, en dehors de ces
  quatre écarts ; aucun build ni comportement d'exécution prouvé.
- Dépendances directes : 29/29 cohérentes.
- Effet de bord observé : 4 fichiers de cache dans `~/.expo`, conservés, ni lus ni
  supprimés ; sans effet sur la copie, la source ou `yunimobile`.
- Revue CTO : diagnostic accepté ; commit local de clôture, sans push.

### Historique — YUNIMOBILE-0007

- Fichier : `.loop/tickets/YUNIMOBILE-0007.md`. Rapport :
  `docs/engineering/mobile-static-diagnostics.md`.
- **Commit de départ** : `cd5bab271d1caad528b1fc6d1c6eb2476a1887d5`.
- Source au SHA audité `ee57ce1d`, inchangée ; diagnostics dans une copie isolée
  conservée pour YUNIMOBILE-0008 : `C:\tmp\yunimobile-0007-diag\` (journaux dans `logs`).
- Typecheck : exit 0, 0 erreur.
- Lint Expo par défaut (`app`, `components`) : exit 0, 0 warning.
- Lint étendu (package complet) : exit 0, 1 warning
  (`react-hooks/exhaustive-deps`, `hooks/use-search.ts:115`), documenté comme
  dette, non corrigé.
- Revue CTO : audit statique approuvé ; les résultats renforcent l'option A sans
  décider la stratégie.
- Blocage disque initial levé (sept `.next-build` de worktrees supprimés avec
  autorisation, gain 3,98 Gio).
- Limites : dépendances non vérifiées contre le lockfile ; aucun build ni contrôle
  de compatibilité Expo. Commit local de clôture, sans push.

### Historique — YUNIMOBILE-0006

- Fichier : `.loop/tickets/YUNIMOBILE-0006.md`.
- Livrable : `docs/engineering/mobile-reuse-audit.md`.
- **Commit de départ** : `dc9427bede655fc540b22313a6fa6a8f5d284fd7`.
- Source examinée en lecture seule : `C:\Users\kyria\yunicity`, branche
  `feat/c3-global-refonte-preview` @ `ee57ce1d`, arbre propre ; base mobile
  identique sur `origin/main` local.
- Préférence provisoire de l'auteur de l'audit : option B (nouvelle base, reprise
  sélective), la base existante restant dans le monorepo comme référence. **Aucune
  décision CTO** : stratégie de reprise non décidée ; critères de décision au § 10
  de l'audit.
- Revue CTO en conversation ; ajustements appliqués ; contrôles locaux exécutés par
  Claude, sans réexécution indépendante.
- Aucun contrôle exécuté sur l'app ; aucune installation ni modification de la
  source ; commit local de clôture, sans push.

### Historique — YUNIMOBILE-0005

Fichier : `.loop/tickets/YUNIMOBILE-0005.md`. Provenance :
`docs/engineering/skills-provenance.md`.

- **Commit de départ** : `df9f9d118f1f6b4ba528dd5d9ee24a72161e3e54`
  (`docs: audit and select initial engineering skills`).
- Skills documentaires `yunicity-verification` et `yunicity-debugging` : référence
  `.agents/skills/` (Codex), copie identique `.claude/skills/` (Claude Code).
- Revue CTO en conversation ; corrections appliquées ; contrôles locaux exécutés par
  Claude, sans réexécution indépendante.
- **Tests en session neuve** (rapports transmis par Kyria, non réexécutés) :
  - Claude Code : invocation réussie des deux skills depuis `.claude/skills/`,
    contenu adapté confirmé par l'outil Skill ; scénarios fictifs conformes
    (session précédente) ;
  - Codex : deux skills dans le catalogue initial (`.agents/skills/`), contenu
    fourni dans les blocs skill ; scénarios fictifs conformes, sans lecture
    manuelle de secours ;
  - portée : découverte et comportement sur ces scénarios, pas une garantie
    générale de respect des instructions ;
  - Cursor : reporté.
- Aucune configuration globale, plugin, dépendance ni script tiers ; commit local de
  clôture, sans push.

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
- Les fichiers de YUNIMOBILE-0005 sont inclus dans le commit de clôture de 0.5.
- Les fichiers de YUNIMOBILE-0006 sont inclus dans le commit de clôture de 0.6.
- Les fichiers de YUNIMOBILE-0007 sont inclus dans le commit de clôture de 0.7.
- Les fichiers de YUNIMOBILE-0008 sont inclus dans le commit de clôture de 0.8.
- **Aucun push** n'a été effectué à ce stade.
- **Aucune application, dépendance ni plugin** n'est installé dans le dépôt.
- Skills documentaires `yunicity-verification` et `yunicity-debugging` présents
  dans `.agents/skills/` et `.claude/skills/` (YUNIMOBILE-0005).
- `.claude/rules/` existe localement, vide (non suivi par Git).

## Dépôt lié

- Une base Expo existe dans `frontend/apps/mobile` de
  <https://github.com/Kyria-Zaire/yunicity.review>.
- Son extraction vers ce dépôt **n'a pas été effectuée**.

## Décisions ouvertes

- Reprise de la base Expo existante : **décidée** (CTO, 2026-10-02, YUNIMOBILE-0008).
  Option A sous forme d'extraction contrôlée : réutiliser écrans, routes, composants
  et logique ; ne pas copier aveuglément la structure du monorepo ; application Expo
  autonome dans `yunimobile` ; remplacement progressif des imports `@yunicity/*` par
  des modules repris ou des packages au partage justifié ; une seule résolution React
  compatible SDK 54 ; configuration Metro adaptée à un projet autonome ; alignement
  des quatre correctifs SDK 54 ; mobile du monorepo gardé en référence en lecture
  seule jusqu'à la parité.
- Distribution des packages partagés entre web et mobile.
- Traitement de `debug.keystore` (actuellement ignoré comme tous les keystores).
- Identité Git (adresse e-mail d'auteur) à corriger avant toute publication.
- Plugin Superpowers 6.4.1 installé globalement (Claude Code, portée utilisateur,
  hook `SessionStart`) : **conservé inchangé** ; coexistence avec les versions
  locales adaptées documentée ; traitement du doublon à décider.
- Skills pour Cursor : non configurés, reportés.
- Test Cursor de 0.3 : reporté jusqu'au 7 octobre.

## Prochaine étape proposée

**YUNIMOBILE-0009 — preuve d'extraction autonome et bundle Metro Android.**

Non lancé : en attente de décision.
