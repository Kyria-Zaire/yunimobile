# YUNIMOBILE-0008 — Diagnostic de compatibilité Expo SDK 54

- **Statut** : terminé
- **Créé le** : 2026-10-02
- **Mis à jour le** : 2026-10-02 04:04 (Europe/Paris, UTC+02:00)

## Objectif

Évaluer la compatibilité Expo de la base mobile existante dans la copie isolée
conservée par YUNIMOBILE-0007, sans modifier ni réparer le projet.

## Contexte et références

- Suite de YUNIMOBILE-0007 (`docs/engineering/mobile-static-diagnostics.md`) et de
  l'audit `docs/engineering/mobile-reuse-audit.md` (option A hypothèse principale).
- Texte du ticket transmis en conversation par Kyria, enregistré ici.
- Source : `C:\Users\kyria\yunicity`, SHA `ee57ce1dfc37835a47335e56338578471a95ec7d`.
- Copie : `C:\tmp\yunimobile-0007-diag` ; application `src\frontend\apps\mobile`.

## Périmètre

### Autorisé

- `.loop/tickets/YUNIMOBILE-0008.md`, `docs/engineering/mobile-expo-compatibility.md`,
  `.loop/state.md`.
- Journaux dans `C:\tmp\yunimobile-0007-diag\logs\YUNIMOBILE-0008\`.
- Lectures locales ; réseau vers npm, Expo et React Native Directory.
- Lecture des métadonnées npm d'`expo-doctor` ; téléchargement et exécution d'une
  version exacte dans un cache dédié à la copie.
- Exécution du CLI Expo installé dans la copie.

### Hors périmètre

- Modification de la source ; `--fix` ; installation ou mise à jour dans le projet
  (`pnpm`/`npm`/`yarn`/`bun install`).
- Build, prebuild, serveur, EAS, connexion à un compte Expo.
- `.env` réel, secret, credential ; correction applicative.
- Commit, push, sous-agent, suppression de la copie.

## État de départ

- **`yunimobile`** : `main` @ `2f148a5168c73b8742411db00e7e93c8a039e800`, arbre
  propre.
- **Source** : `feat/c3-global-refonte-preview` @ SHA attendu ; état Git identique à
  la fin de YUNIMOBILE-0007.
- **Copie et journaux 0007** : présents. Espace libre : 4,288 Gio.

## Critères d'acceptation

- [x] Inventaire et empreintes avant/après de la copie ; aucun changement de code ni
      de configuration.
- [x] Matrice déclaré / verrouillé / installé des dépendances directes.
- [x] `expo install --check` exécuté avec le CLI local, pnpm, `CI=1`,
      `EXPO_NO_TELEMETRY=1` ; sortie et code enregistrés.
- [x] `expo-doctor` : métadonnées npm vérifiées, version exacte exécutée avec
      `--verbose` et cache dédié ; sortie et code enregistrés.
- [x] Résultats classés ; causes démontrées et hypothèses distinguées.
- [x] Source inchangée ; espace disque mesuré ; rapport rédigé.

## Plan

1. Cadrage et instantanés.
2. Matrice des dépendances.
3. `expo install --check`, puis `expo-doctor`.
4. Inventaires après, analyse, rapport.

## Risques et décisions ouvertes

- Les outils Expo écrivent des caches dans `~/.expo` (constaté, voir rapport § 7).
- Stratégie de reprise non décidée.

## Vérifications prévues

- [x] Empreintes des configurations, des fichiers hors `node_modules` et liste
      complète de l'arbre, avant et après.
- [x] Écritures hors de la copie (cache dédié, cache npm global, `~/.expo`).
- [x] État Git de la source avant et après.

## Journal des tentatives

| # | Hypothèse | Action | Résultat |
|---|---|---|---|
| 1 | `find -printf` liste l'arbre complet en temps utile | Instantané initial | Arrêté à la limite de temps ; empreintes déjà écrites. Liste refaite par `robocopy /L` (65 337 fichiers) avant toute exécution des outils. |

## Résultats et preuves

Contrôles propres (Claude), 2026-10-02. Détail :
`docs/engineering/mobile-expo-compatibility.md`.

- `expo install --check` (CLI 54.0.24) → exit 1 : 4 retards de correctif
  (`expo` 54.0.34→~54.0.37, `expo-constants`, `expo-font`, `expo-router`).
- `expo-doctor` 1.20.4 (intégrité npm vérifiée) → exit 1 : 15/18 contrôles
  réussis ; échecs : configuration Metro (`watchFolders`, cohérent avec le monorepo,
  à ne pas reprendre tel quel), dépendances dupliquées (`react` : 58 emplacements,
  dont React 18.3.1 à la racine — risque de résolution, plusieurs instances au
  chargement non démontrées ; `react-dom` : 11), versions SDK (mêmes 4 correctifs).
- Aucune incompatibilité explicite avec Expo SDK 54 détectée, en dehors de quatre
  écarts de versions correctives ; aucun build ni comportement d'exécution prouvé.
- Matrice : 29/29 dépendances directes cohérentes (lockfile complet non vérifié).
- Copie inchangée (25 configurations, 2 551 fichiers hors `node_modules`,
  65 337 fichiers listés) ; source inchangée ; espace 4,288 → 4,272 Gio.
- Hors copie : cache dédié créé (84 fichiers, 2,6 Mio) ; effet de bord observé des
  outils Expo : 4 fichiers de cache écrits dans `~/.expo`, conservés sur décision
  CTO, ni lus ni supprimés ; ils ne modifient ni la copie, ni la source, ni
  `yunimobile`.

## Revue

- [x] Revue CTO en conversation (2026-10-02) : diagnostic accepté ; ajustements
      documentaires appliqués
- [x] Auto-vérification
- [ ] Revue indépendante (par : …)
- [ ] Non réalisée (raison : …)

## Actions Git et installations autorisées

- **Commit** : oui — commit local de clôture, autorisé par Kyria en conversation
  (`docs: record Expo SDK compatibility diagnostics`)
- **Push** : non
- **Merge** : non
- **Déploiement / publication** : non
- **Installation** : non dans le projet ; `expo-doctor@1.20.4` exécuté depuis un cache
  dédié via `npm exec`

## Rapport final

- Fichiers créés : `.loop/tickets/YUNIMOBILE-0008.md`,
  `docs/engineering/mobile-expo-compatibility.md`.
- Fichiers modifiés : `.loop/state.md`.
- Vérifications : voir « Résultats et preuves ».
- Limites : aucun bundle ni build ; versions attendues dépendantes du service Expo
  à la date d'exécution ; matrice limitée aux dépendances directes ; caches écrits
  dans `~/.expo`.
- Décision CTO (2026-10-02) :
- Option A approuvée sous la forme d'une **extraction contrôlée** : réutiliser
  écrans, routes, composants et logique ; ne pas copier aveuglément la structure du
  monorepo ; application Expo autonome dans `yunimobile` ; remplacement progressif
  des imports `@yunicity/*` par des modules repris ou des packages au partage
  justifié ; une seule résolution React compatible SDK 54 ; configuration Metro
  adaptée à un projet autonome ; alignement des quatre correctifs SDK 54 ; mobile du
  monorepo gardé en référence en lecture seule jusqu'à la parité.
- Ticket terminé : son objectif était d'identifier les écarts, pas de les corriger.
- Décisions ouvertes : sort du cache dédié et de la copie (conservés).
- Actions Git / installations : un commit local de clôture ; aucune installation
  dans les dépôts ; aucun push.
- **Prochaine étape (non lancée)** : YUNIMOBILE-0009 — preuve d'extraction
  autonome et bundle Metro Android.
