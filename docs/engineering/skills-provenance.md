# Provenance des skills d'ingénierie

Skills installés par YUNIMOBILE-0005, à partir de la sélection de YUNIMOBILE-0004
([`skills-selection.md`](skills-selection.md)). Ce sont des **versions adaptées**,
pas des copies inchangées.

## Source

| Élément | Valeur |
|---|---|
| Dépôt | <https://github.com/obra/superpowers> |
| Commit | `8ca22dba9a94f28898bbce59f2537ff4d87c747d` |
| Licence | MIT, `Copyright (c) 2025 Jesse Vincent` |
| Récupération | API GitHub (`gh api …/contents/<chemin>?ref=<commit>`), le 2026-10-01 |

Fichiers source utilisés. Le blob est renvoyé par l'API et identique à
`git hash-object` du fichier téléchargé.

| Chemin source | Blob |
|---|---|
| `LICENSE` | `abf0390320aa14406af7a520b9b0739fdda9bf08` |
| `skills/verification-before-completion/SKILL.md` | `7d45333cc4a49c57a80df6c1fe2fa777a207afbc` |
| `skills/systematic-debugging/SKILL.md` | `095d194ac041502905f15b01d22d294fb94db8b2` |
| `skills/systematic-debugging/root-cause-tracing.md` | `0e72e8f9566b7ef85e814633d1feacad9d0c5868` |
| `skills/systematic-debugging/defense-in-depth.md` | `e2483354dc2b62478a2624e34ca18bc0efe887b2` |
| `skills/systematic-debugging/condition-based-waiting.md` | `70994f777c586f7d4c43033aac34c7cf0da6688b` |

Non repris :

- `skills/systematic-debugging/find-polluter.sh` : script exécutable ;
- `skills/systematic-debugging/condition-based-waiting-example.ts` : lié à un autre
  projet ;
- `CREATION-LOG.md`, `test-*.md` : non nécessaires.

Aucun hook, MCP, installateur ni script exécutable n'est ajouté.

## Emplacements et découverte

| Outil | Chemin projet | Source officielle (consultée le 2026-10-01) |
|---|---|---|
| Codex | `.agents/skills/<nom>/SKILL.md` — **exemplaire de référence** | <https://learn.chatgpt.com/docs/build-skills> (redirection de <https://developers.openai.com/codex/skills>) : « For repositories, Codex scans `.agents/skills` in every directory from your current working directory up to the repository root. » |
| Claude Code | `.claude/skills/<nom>/SKILL.md` — **copie identique** | <https://code.claude.com/docs/en/skills> : « Project \| `.claude/skills/<skill-name>/SKILL.md` \| Sessions in this repository. » |

- La documentation Claude Code consultée ne mentionne pas `.agents/skills`. Rien ne
  permet de supposer que Claude le lit, d'où la copie dans `.claude/skills/`.
- Frontmatter : Codex exige `name` et `description`. Claude Code recommande
  `description`, et `name` prend par défaut le nom du dossier. Les deux skills
  déclarent les deux champs, égaux au nom du dossier.
- Invocation explicite :
  - Claude Code : `/nom` (« invoke one directly with `/skill-name` ») ;
  - Codex : `$nom` ou `/skills` (« run `/skills` or type `$` to mention a skill »).
- Invocation implicite : laissée active dans les deux outils, mais limitée par une
  description ciblée. Aucun `agents/openai.yaml` n'est ajouté ; le réglage Codex par
  défaut s'applique (`allow_implicit_invocation`, par défaut `true`).
- Aucun lien symbolique n'est utilisé.

## Fichiers installés

Fichiers identiques dans `.agents/skills/` et `.claude/skills/` :

| Fichier | Origine | Blob local | SHA-256 |
|---|---|---|---|
| `yunicity-verification/SKILL.md` | adapté de `verification-before-completion/SKILL.md` | `ba7125160a4f5a58e370cfc3c20820db65bd5a78` | `c58b3b0e1bc84cf46ec94b4e1f11d715b14a63d55d57fac09cb85711d6530d9e` |
| `yunicity-verification/LICENSE` | `LICENSE`, inchangé | `abf0390320aa14406af7a520b9b0739fdda9bf08` | `a37e0e9697144819e1d965176ac4ae5bc3fa02d11e7812036bbcadf6dafe2400` |
| `yunicity-debugging/SKILL.md` | adapté de `systematic-debugging/SKILL.md` | `bd653842d8f6a848ef0e2cfcb57a8092df7c5ecd` | `14c3e862e0af87b99c03c2be1185f37e55d83146cad7ab353f05a8688507eb15` |
| `yunicity-debugging/root-cause-tracing.md` | adapté | `af59a25db06c36811ad6e4f92725073db3d69e78` | `3c4605d86b1f64d44026975c337c195c597eba3c7f438f6e6eb128b8ae9053de` |
| `yunicity-debugging/defense-in-depth.md` | adapté | `87a91514fef69059b9dcadc6f0d3f44e6749d4fe` | `95fb01d436bd9538892a74c205cec29e1ba116efbf8c7158ac0f0e266e84fe84` |
| `yunicity-debugging/condition-based-waiting.md` | adapté | `c10407bc4bd64e3f9df198d9166fb8f55aa598c5` | `ddb0cb8e7126b6e237189fbe92b5fe8aaf000963cf31cf42a629c4582b1da32e` |
| `yunicity-debugging/LICENSE` | `LICENSE`, inchangé | `abf0390320aa14406af7a520b9b0739fdda9bf08` | `a37e0e9697144819e1d965176ac4ae5bc3fa02d11e7812036bbcadf6dafe2400` |

L'attribution figure en tête de chaque fichier Markdown : « Adapted from … (obra/superpowers, MIT License) ».

## Changements par rapport à la source

### `yunicity-verification` (depuis `verification-before-completion`)

1. Nom `yunicity-verification`. La description cible les affirmations d'achèvement et
   les changements de statut de ticket, sans activation pour les réponses qui ne
   font aucune affirmation sur l'état du travail.
2. Ajout d'une section **Precedence** :
   - `AGENTS.md`, le ticket et le loop priment ;
   - le skill n'autorise ni commit, ni push, ni merge, ni installation, ni
     dépendance, ni délégation ;
   - une preuve qui exigerait une action interdite donne lieu à « non vérifié ».
3. Iron Law « NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE » et règle
   « run the verification command in this message » **remplacées** par : preuve
   pertinente pour l'état réellement évalué.
4. Ajout de l'**enregistrement de preuve** : commande, résultat, état évalué,
   provenance.
5. Ajout des **trois natures de preuve** : contrôle propre, rapport tiers, revue
   indépendante. Aucune n'est présentée comme une autre. Lire une sortie, un journal
   ou un diff est une inspection propre de ce contenu ; cela ne change pas la
   provenance de l'exécution rapportée, qui reste un rapport tiers tant qu'elle n'est
   pas relancée (revue CTO).
6. Ajout de la **réutilisation** d'un contrôle antérieur s'il n'a pas été invalidé ;
   pas de réexécution imposée à chaque réponse.
7. Tableau « Common Failures » transformé en « What proves what » :
   - lint et typecheck ne prouvent ni build ni test ;
   - ajout de la ligne « Configured typecheck passes » (typecheck avec la
     configuration du projet) ;
   - un typecheck sans erreur ne prouve pas la correction fonctionnelle (revue CTO) ;
   - « Delegated task done » : les exécutions rapportées restent des rapports tiers
     tant qu'elles ne sont pas relancées.
8. Ajout de « When a check cannot be run » : « not executed » et raison ; lien avec
   les statuts du loop.
9. Supprimés :
   - les formulations « Skip any step = lying » et « Violating the letter… » ;
   - la section « When To Apply » (« ALWAYS before ANY … ») ;
   - les tableaux de rationalisation et le motif « Delegating to agents » comme
     déclencheur.

   Les red flags sont réduits et reformulés.

### `yunicity-debugging` (depuis `systematic-debugging`)

1. Nom `yunicity-debugging` et description ciblée sur l'investigation d'un échec,
   avant tout correctif.
2. Ajout d'une section **Precedence** : le débogage n'élargit pas le périmètre du
   ticket.
3. Ajout d'une section **Diagnostic hygiene** :
   - aucun secret, jeton ou donnée personnelle dans les diagnostics ;
   - aucun dump d'environnement (`env`, `printenv`, `set`, `export -p`,
     `Get-ChildItem Env:`, `process.env` entier) ;
   - aucune ouverture de fichiers secrets ;
   - aucun en-tête ni corps de requête sensible ;
   - retrait de l'instrumentation temporaire ;
   - tests de présence `SET` / `UNSET` en POSIX et PowerShell.
4. Les **deux exemples `IDENTITY`** de la phase 1 sont **remplacés** :
   - `echo "IDENTITY: ${IDENTITY:+SET}${IDENTITY:-UNSET}"` affichait la valeur
     quand la variable était définie ;
   - `env | grep IDENTITY` affichait la valeur.

   Ils deviennent un test de présence qui n'affiche que `SET` / `UNSET`. Les commandes
   `security list-keychains`, `security find-identity -v` et `codesign` de l'exemple
   sont remplacées par une consigne générique (lire le code de sortie, ne pas afficher
   de matériel de clé).
5. Renvoi `superpowers:test-driven-development` **remplacé** par une consigne
   autonome : reproduction minimale qui échoue avant le correctif (test automatisé si
   le projet et le ticket le permettent, sinon reproduction manuelle documentée).
6. Renvoi `superpowers:verification-before-completion` **remplacé** par
   `yunicity-verification`, avec la forme d'invocation de chaque outil
   (`/yunicity-verification`, `$yunicity-verification`, ou lecture du fichier).
7. Règle des « 3+ fixes » alignée sur le loop :
   - trois tentatives au plus par blocage ;
   - chaque tentative apporte une hypothèse ou une preuve nouvelle ;
   - après la troisième, arrêt et rapport ;
   - hypothèses consignées dans le « Journal des tentatives ».
8. Phase 2 : lecture de la documentation de la version réellement installée.
9. « your human partner » remplacé par « the user ». Supprimés : l'« Iron Law », la
   phrase « Violating the letter… » et le tableau des rationalisations. Le red flag
   « "One more fix attempt" (when already tried 2+) » est remplacé par : une
   quatrième tentative après trois corrections échouées, ou une tentative sans
   hypothèse ni preuve nouvelle (revue CTO).
10. Liens vers les guides rendus cliquables (liens relatifs Markdown).
11. Section « When Process Reveals "No Root Cause" » réécrite (revue CTO) :
    - distinction entre cause démontrée et hypothèse ;
    - plus de prescription automatique de retry, timeout ou monitoring ;
    - une mitigation n'est possible que si elle est justifiée, autorisée par le
      ticket et vérifiée ; elle est rapportée comme mitigation, pas comme
      résolution démontrée de la cause.
12. « Supporting guides » : une validation supplémentaire n'est ajoutée que pour un
    besoin démontré, sans duplication systématique ni extension du périmètre
    (revue CTO).

### Guides de `yunicity-debugging`

- **`root-cause-tracing.md`** :
  - en-tête d'attribution ;
  - section « Finding Which Test Causes Pollution » : renvoi à `find-polluter.sh`
    remplacé par une procédure de bissection manuelle ;
  - instrumentation marquée temporaire ; variables d'environnement journalisées par
    nom et présence seulement ; `npm test` remplacé par `<test command>` ;
  - supprimés : les sections « Real Example: Empty projectDir » et « Real-World
    Impact » (session d'un autre projet), ainsi que la règle « Critical: Use
    console.error() », désormais limitée à l'instrumentation temporaire ;
  - graphes alignés sur la revue CTO : la branche « Fix at symptom point » devient
    « Report cause as not demonstrated » ; « BETTER: Also add defense-in-depth »,
    « Add validation at each layer » et « Bug impossible » deviennent une
    validation limitée aux contournements démontrés puis « Fix verified » ; une
    impasse renvoie à « When no root cause is found » (mitigation rapportée comme
    telle) ;
  - revue CTO : chemins, cwd et traces peuvent contenir des données personnelles ;
    ils sont masqués ou réduits aux éléments nécessaires (« Log only non-sensitive
    context » devient « Log only the context needed »).
- **`defense-in-depth.md`** :
  - en-tête d'attribution ;
  - règle d'hygiène pour les messages d'erreur et les journaux ;
  - supprimés : « Example from Session » et les chiffres de l'autre projet ;
  - revue CTO : le principe « Validate at EVERY layer » est remplacé par une
    validation ajoutée seulement pour un besoin démontré (contournement prouvé,
    contexte dangereux, récidive), sans duplication systématique ni extension du
    périmètre ;
  - ajout de « Deciding whether another layer is needed » ; les « four layers »
    deviennent des « possible layers » ;
  - supprimés : « Why Multiple Layers » et « Key Insight » (« Don't stop at one
    validation point ») ;
  - « Applying the pattern » exige de prouver le contournement et de vérifier
    chaque couche ajoutée ;
  - revue CTO : l'exemple de garde d'environnement fondé sur
    `startsWith(tmpDir)` est retiré. Il est remplacé par une consigne : dossier
    temporaire dédié au test ; confinement vérifié par une méthode adaptée à la
    plateforme (chemins canoniques, liens symboliques résolus, comparaison par
    segments) ; un simple préfixe n'est pas présenté comme protection.
- **`condition-based-waiting.md`** :
  - en-tête d'attribution ;
  - renvoi à `condition-based-waiting-example.ts` remplacé par une description des
    helpers spécialisés construits sur `waitFor` ;
  - ajout de « Prefer the test framework's helper », sans nouvelle dépendance hors
    ticket ;
  - appels `waitFor` complétés par l'argument `description` (requis par
    l'implémentation, absent des exemples amont) ;
  - supprimés : la ligne « Wait for file » (`fs.existsSync`) et « Real-World
    Impact » ;
  - relu après la revue CTO : aucune contradiction, fichier inchangé.

## Maintenir les deux copies identiques

`.agents/skills/` est la **référence**. Ne modifier que la référence, puis la recopier
vers `.claude/skills/` :

```bash
# POSIX shell (Git Bash), depuis la racine du dépôt
for s in yunicity-verification yunicity-debugging; do
  mkdir -p ".claude/skills/$s"
  cp ".agents/skills/$s/"* ".claude/skills/$s/"
done
diff -r .agents/skills .claude/skills && echo IDENTICAL
```

- Un fichier supprimé de la référence doit aussi être supprimé de la copie. Après la
  recopie, `diff -r` ne doit rien afficher.
- Toute revue d'un changement de skill vérifie que `diff -r` reste vide et que ce
  document est mis à jour : blobs, SHA-256, changements.
- Mise à jour depuis l'amont : nouveau ticket, nouveau commit source, réapplication
  et documentation des adaptations.

## Superpowers global

- Le plugin `superpowers@claude-plugins-official` 6.4.1 (portée utilisateur) reste
  **inchangé**.
- Les noms `yunicity-*` évitent la collision d'identifiants avec
  `superpowers:verification-before-completion` et `superpowers:systematic-debugging`,
  qui restent disponibles, **non adaptés**.
- Ils **ne neutralisent pas** les instructions globales : le hook `SessionStart` de
  Superpowers continue d'injecter `using-superpowers` (« you ABSOLUTELY MUST invoke
  the skill », brainstorming, etc.) dans les sessions Claude Code de ce poste. Un
  agent peut donc choisir une version Superpowers non adaptée.
- La doctrine prime. Superpowers indique lui-même : « User instructions (CLAUDE.md,
  AGENTS.md, …) take precedence over skills ».
- Lors des tests en session du 2026-10-01 (rapports de Kyria), les versions locales
  ont été invoquées explicitement, Superpowers global restant actif et inchangé. Le
  traitement de ce doublon reste ouvert.

## Tests en session

Prompts et résultats : voir [`agent-setup.md`](agent-setup.md#skills-projet). Statut :
**exécutés par Kyria le 2026-10-01** (Claude Code, Codex), conformes selon les
rapports transmis en conversation, non réexécutés lors de la clôture.
