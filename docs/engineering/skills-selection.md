# Sélection des skills IA

Rapport de YUNIMOBILE-0004 (audit du 2026-10-01, ajusté après revue CTO). Aucun skill
n'est installé par ce rapport : il prépare le ticket d'installation suivant.

## Synthèse

| Skill | Source | Décision | Raison courte |
|---|---|---|---|
| `verification-before-completion` | obra/superpowers | **Adopter, avec adaptations locales** | Aucun script ni réseau ; exigence de preuve à aligner sur la doctrine (voir adaptations). |
| `systematic-debugging` | obra/superpowers | **Adopter, avec adaptations locales** | Aligné sur « En cas d'échec » du loop ; exemples exposant des secrets à remplacer. |
| `expo-router` | expo/skills | **Différer** | Utile, mais en attente de la confirmation de la base mobile (reprise et version SDK). |
| `expo-data-fetching` | expo/skills | **Différer** | Choix de bibliothèques et de patterns à trancher par le ticket de la couche API. |
| `expo-project-structure` | expo/skills | **Différer** | Réservé aux projets neufs ; dépend de la décision de reprise de la base Expo. |
| `skill-creator` | anthropics/skills | **Différer** | Outillage Claude uniquement (`claude -p`, sous-agents, serveur HTTP local) ; utile seulement pour écrire nos propres skills. |

**Décision CTO** : première installation envisagée de **deux skills Superpowers**,
avec adaptations locales documentées (pas des copies inchangées).

## Sources et SHA

Lecture via l'API GitHub (`gh api`), sans clonage ni téléchargement dans un
répertoire de découverte.

| Dépôt | Commit audité (`main`) | Licence |
|---|---|---|
| expo/skills | `c0dadf355d4caa4e1720de372f0f8766df1a8978` | MIT (`LICENSE`, `plugins/expo/LICENSE`, frontmatter `license: MIT`) |
| obra/superpowers | `8ca22dba9a94f28898bbce59f2537ff4d87c747d` | MIT (`LICENSE`) |
| anthropics/skills | `8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4` | Aucune licence racine détectée par GitHub ; `skills/skill-creator/LICENSE.txt` : Apache 2.0 |

Blobs `SKILL.md` (SHA complets relevés par l'API) et dernier commit sur chaque dossier
(préfixe de 12 caractères, seul relevé confirmé) :

| Skill | Chemin | Blob `SKILL.md` | Dernier commit |
|---|---|---|---|
| `verification-before-completion` | `skills/verification-before-completion/` | `7d45333cc4a49c57a80df6c1fe2fa777a207afbc` | `3be5aad3dd24` (2026-07-24) |
| `systematic-debugging` | `skills/systematic-debugging/` | `095d194ac041502905f15b01d22d294fb94db8b2` | `5bf4e7801107` (2026-09-19) |
| `expo-router` | `plugins/expo/skills/expo-router/` | `e7d4e48a37f679fa98239387a993e9fb6e6c2bfd` | `170589a7ee89` (2026-09-08) |
| `expo-data-fetching` | `plugins/expo/skills/expo-data-fetching/` | `e459b3ef12dee9dcb17072a7624bea02133c99d9` | `4503deb68f55` (2026-09-09) |
| `expo-project-structure` | `plugins/expo/skills/expo-project-structure/` | `f5a4499592c5aabc05f3a5c39e7c6a07356e5632` | `5c8f62e0854f` (2026-08-04) |
| `skill-creator` | `skills/skill-creator/` | `65b3a402dbd09b8e83f9d637c6b553875189085c` | `b9e19e6f4477` (2026-04-20) |

Les six candidats existent au chemin indiqué au commit audité.

## Contenu réellement examiné

**Lu intégralement**

- Superpowers : `verification-before-completion/SKILL.md`,
  `systematic-debugging/SKILL.md`, `root-cause-tracing.md`, `defense-in-depth.md`,
  `condition-based-waiting.md`, `condition-based-waiting-example.ts`,
  `find-polluter.sh`, `hooks/hooks.json`, `hooks/session-start`, manifestes.
- Expo : les trois `SKILL.md` et leurs `agents/openai.yaml` ; toutes les références
  de `expo-router` et de `expo-data-fetching` ; `plugins/expo/hooks/hooks.json`,
  `.mcp.json`, manifestes ; `expo-skill-feedback/SKILL.md` et ses scripts.
- Anthropic : `skill-creator/SKILL.md`.

**Examiné partiellement**

- `skill-creator/scripts/*.py` et `eval-viewer/generate_review.py` : imports,
  sous-processus et accès réseau, par recherche de motifs.

**Non lu**

- `skill-creator/agents/*.md`, `references/schemas.md` et `assets/`.
- `systematic-debugging/CREATION-LOG.md` et `test-*.md` (non référencés).
- `using-superpowers/SKILL.md` au commit audité : seule sa version globale injectée
  en session a été observée.
- Le paquet `submit-expo-feedback`.

**Informations issues des README seulement** : modes d'installation, liste complète
des skills, description du MCP Expo.

Pour la télémétrie Expo, l'affirmation « jamais de code ni de prompt » est
**confirmée par le code** : le payload contient le nom du skill, le harnais, l'OS,
l'architecture et le hash d'un identifiant local.

## Adaptations locales requises

Les deux skills retenus seront installés sous forme de **versions locales adaptées**.
Chaque écart avec l'amont sera listé dans un fichier de provenance (dépôt, commit,
blob d'origine, liste des modifications).

### `verification-before-completion`

Texte amont : « If you haven't run the verification command in this message, you
cannot claim it passes. » (Iron Law : « NO COMPLETION CLAIMS WITHOUT FRESH
VERIFICATION EVIDENCE »).

Adaptations :

1. Remplacer l'exigence de réexécution « dans ce message » par une **preuve
   pertinente pour l'état évalué**.
2. Un contrôle existant peut être cité **si aucun changement ne l'invalide** depuis son
   exécution. Il est alors cité avec commande, résultat observé et provenance (qui
   l'a exécuté, quand, sur quel état). Cohérent avec le loop : « Ne pas relancer des
   tests déjà passés sans changement pertinent ».
3. Distinguer explicitement trois natures de preuve :
   - **contrôle propre** : exécuté par l'agent ;
   - **rapport tiers** : résultat rapporté par une personne ou un autre agent, non
     réexécuté ;
   - **revue indépendante** : examen du résultat par une autre personne ou un autre
     agent.

   Une catégorie n'est jamais présentée comme une autre.
4. Conserver la porte « identifier → exécuter ou citer → lire → vérifier → affirmer »
   et le tableau des preuves insuffisantes.

### `systematic-debugging`

1. **Remplacer les deux exemples `IDENTITY`** de la phase 1 (étape 4), qui exposent
   la valeur :
   - `echo "IDENTITY: ${IDENTITY:+SET}${IDENTITY:-UNSET}"` : la seconde expansion
     affiche la valeur réelle lorsque la variable est définie ;
   - `env | grep IDENTITY` : affiche la valeur.

   Remplacement attendu : un test de présence qui n'affiche que `SET` / `UNSET`
   (par exemple `[ -n "${IDENTITY:-}" ] && echo SET || echo UNSET`).
2. **Encadrer les journaux et les variables d'environnement** : l'instrumentation
   (« Log what data enters / exits component », « Include context: […] environment
   variables » dans `root-cause-tracing.md`) ne journalise jamais de secret, jeton,
   donnée personnelle ni contenu de requête authentifiée. Les variables
   d'environnement sont journalisées par nom et présence, pas par valeur, sauf valeur
   non sensible explicitement identifiée (ex. `NODE_ENV`). L'instrumentation
   temporaire est retirée avant livraison.
3. **Renvois vers des skills non installés** :
   - `superpowers:test-driven-development` (non retenu) : remplacer le renvoi par une
     consigne autonome (écrire un test qui échoue avant le correctif) ;
   - `superpowers:verification-before-completion` : renommer en
     `verification-before-completion` (nom de la version locale).
4. Fichiers liés à conserver : `root-cause-tracing.md`, `defense-in-depth.md`,
   `condition-based-waiting.md` (référencés par `SKILL.md`),
   `condition-based-waiting-example.ts` et `find-polluter.sh` (référencés par ces
   guides). L'exemple TypeScript provient d'un autre projet et n'est
   qu'illustratif. `find-polluter.sh` lance `npm test` fichier par fichier et ne
   s'exécute que sur action explicite d'un agent.

## Analyse des candidats différés

### `expo-router` — différer

- **Utilité** : conventions de routes, layouts, stacks, modales, form sheets et
  NativeTabs ; pertinent dès que la base mobile existe.
- **Motif** : décision CTO, en attente de la confirmation de la base mobile (reprise
  et version SDK).
- **Versions** : le skill cible par défaut le SDK 55. `tabs.md` indique « SDK 54+.
  SDK 55 recommended. » et fournit une table d'équivalence SDK 54. Sont marqués
  SDK 55+ : `Stack.Toolbar`, les zoom transitions, le contenu de form sheet,
  plusieurs options de NativeTabs. `headerLargeTitleEnabled` est le nom SDK 56+.
  Le `SKILL.md` indique qu'à partir du SDK 56 il ne faut plus importer
  `@react-navigation/*`. La disponibilité de `expo-router/react-navigation` en
  SDK 54 n'est pas vérifiée.
- **À traiter à l'adoption** : la section « Submitting Feedback », présente dans
  chaque `SKILL.md` Expo, invoque `npx --yes submit-expo-feedback@latest` (paquet
  distant, envoi réseau).

### `expo-data-fetching` — différer

- React Query, SWR, NetInfo, `expo-secure-store` et les exemples serveur (loaders,
  secrets côté serveur) ne sont **pas intrinsèquement incompatibles** avec la
  doctrine : leur adoption dépend du ticket qui les justifie (`AGENTS.md` : pas de
  nouvelle bibliothèque sans besoin établi dans le ticket).
- Points à relire à l'adoption : le skill impose son usage pour « ANY networking » ;
  l'exemple `fetchWithErrorHandling` reclasse toute erreur non HTTP, y compris un
  JSON invalide, en « Network error ».
- Points alignés : quatre états d'écran, jetons dans SecureStore, aucun secret dans
  `EXPO_PUBLIC_*`.

### `expo-project-structure` — différer

- Le skill s'applique explicitement aux nouveaux projets. Or la reprise de la base
  Expo existante n'est pas décidée.
- Les routes `+api` et `src/server/` relèvent d'un choix d'architecture à trancher
  par ticket, compte tenu du backend FastAPI commun.

### `skill-creator` — différer

- `run_eval.py` et `improve_description.py` lancent `claude -p`, ce qui consomme de
  l'usage Claude ; `run_eval.py` écrit dans `.claude/commands/` ;
  `generate_review.py` démarre un serveur HTTP local. Le skill prévoit des
  sous-agents et requiert Python (`pyyaml`). Il est spécifique à Claude.
- Déjà disponible au niveau utilisateur sur ce poste.
- Utilité future : seulement si l'équipe écrit ses propres skills.

## Compatibilité Claude Code et Codex

| Aspect | Claude Code | Codex |
|---|---|---|
| Découverte projet | `.claude/skills/<nom>/SKILL.md` | `.agents/skills/<nom>/SKILL.md` (**hypothèse**, à confirmer) |
| Format | Frontmatter `name` + `description` (respecté par les six candidats) | Idem ; `agents/openai.yaml` facultatif |
| Invocation explicite | `/nom` ou outil Skill | `$nom` (d'après `openai.yaml` d'Expo, non vérifié) |
| Hooks des plugins | Exécutés si le plugin est installé | Manifeste Codex Superpowers : `hooks: {}` |

Les répertoires `.claude/skills/` et `.agents/skills/` existent, vides, dans le dépôt.
Le `.gitignore` prévoit de versionner les skills partagés.

## Modes d'installation

| Mode | Portée | Effets |
|---|---|---|
| A. Copie locale adaptée au commit audité (**recommandé**) | Dépôt | Contenu relu, figé, versionné ; aucun hook, MCP ni télémétrie ; mise à jour manuelle |
| B. Plugin (`claude plugin install`, `codex plugin add`) | Selon l'outil et l'option choisie (utilisateur ou projet ; portées exactes non vérifiées) | Apporte tous les skills, hooks et MCP du plugin ; contenu non figé ; adaptation locale impossible sans fork |
| C. CLI `npx skills` | Selon la cible choisie | Exécute un outil tiers ; contenu non adapté |

Le mode A est seul compatible avec la décision d'adaptations locales.

## Risques transverses

| Risque | Constat | Portée |
|---|---|---|
| Hooks | Expo : `PostToolUse` / `UserPromptExpansion` lançant `node skill-event.cjs` ; Superpowers : `SessionStart` injectant `using-superpowers` | Plugins seulement |
| Télémétrie | Expo vers PostHog (`us.i.posthog.com`), désactivée par défaut, jamais en CI | Plugin Expo seulement |
| MCP / réseau | Plugin Expo : MCP distant `https://mcp.expo.dev/mcp` | Plugin Expo seulement |
| Commande distante | `npx --yes submit-expo-feedback@latest` dans chaque `SKILL.md` Expo | Aussi dans une copie |
| Secrets | Exemples `IDENTITY` de `systematic-debugging` | À corriger par adaptation locale (installation) |
| Services payants | Aucun EAS requis ; `skill-creator` consomme de l'usage Claude | Candidat différé |

## Superpowers global

- Plugin `superpowers@claude-plugins-official` 6.4.1, portée utilisateur, hook
  `SessionStart` actif. **Conservé inchangé** (décision CTO).
- Le hook injecte notamment : « If you think there is even a 1% chance a skill might
  apply […] you ABSOLUTELY MUST invoke the skill. » Il précise aussi : « User
  instructions (CLAUDE.md, AGENTS.md, […]) take precedence over skills ». La doctrine
  et le ticket actif priment donc.
- **Doublon à traiter** lors de l'installation et des tests de découverte : les
  versions globales (`superpowers:verification-before-completion`,
  `superpowers:systematic-debugging`, non adaptées) coexisteront avec les versions
  locales adaptées. Il faudra vérifier laquelle est chargée et comment éviter
  l'usage de la version non adaptée.

## Éléments non vérifiés

- Version SDK de la base Expo existante (54 selon l'audit précédent).
- Disponibilité de `expo-router/react-navigation` en SDK 54.
- Chemin de découverte et invocation des skills par Codex.
- Lecture de `.agents/skills/` par Claude Code (copie unique ou double).
- Portées exactes des installations par plugin.
- Contenu de `using-superpowers/SKILL.md` au commit audité.
- SHA complets des derniers commits par dossier (préfixes seulement).
- Scripts de `skill-creator` lus en entier ; paquet `submit-expo-feedback`.
- Chargement effectif en session neuve.

## Proposition pour le ticket d'installation

1. Créer les versions locales adaptées de `verification-before-completion` et
   `systematic-debugging` (avec ses cinq fichiers liés) dans le ou les répertoires de
   découverte confirmés.
2. Joindre la licence MIT de Superpowers et un fichier de provenance (dépôt, commit,
   blobs d'origine, liste des adaptations).
3. Tester la découverte en session neuve de Claude Code et Codex, y compris le
   doublon avec Superpowers global.
4. Ne pas installer `expo-router` avant la confirmation de la base mobile.
