# Hygiène de l'historique Git avant publication

YUNIMOBILE-0009A, 2026-10-02, Claude Code. Réécriture de l'auteur et du committer
des 9 commits locaux de `main`, avant tout push. Aucune publication effectuée.

## Résumé

| Élément | Valeur |
|---|---|
| Ancien HEAD | `68b1dd8749dbbc3700ca600a8fc06bb41b85dacf` |
| Nouveau HEAD (9 commits réécrits) | `64ec1d66327bb2da52a8c06abf9e2a581d2ba720` |
| Identité cible | Kyria-Zaire avec adresse GitHub noreply vérifiée |
| Méthode | `git filter-branch --env-filter`, sur `main` uniquement |
| Branche de récupération | `backup/pre-yunimobile-0009a` → `68b1dd8…` (ancien HEAD), conservée |
| Contenu, ordre, messages, dates | Identiques (contrôles ci-dessous) |
| Publication | Aucune (aucun push, aucune référence distante) |

Le nom d'auteur était déjà `Kyria-Zaire` ; seule l'adresse, un placeholder, a été
remplacée. Les adresses ne sont pas reproduites dans ce document ; les sorties Git
brutes sont conservées hors dépôt, dans `C:\tmp\yunimobile-0009a\`.

## Préconditions vérifiées

- `git status --short` vide ; branche `main` ; 9 commits ; aucun merge commit.
- `origin` → `https://github.com/Kyria-Zaire/yunimobile.git` ; aucune référence
  distante locale ; aucun tag.
- Aucune signature `gpgsig` dans les 9 commits.
- Branche `backup/pre-yunimobile-0009a` et `refs/original` absentes au départ.

## Opération

1. État d'origine capturé hors dépôt : HEAD, SHA, trees, parents, messages bruts,
   identités, dates brutes, lignes `Co-Authored-By`, statut, branches, tags, remote,
   références et configuration Git globale.
2. `git branch backup/pre-yunimobile-0009a main`, vérifiée égale à l'ancien HEAD.
3. Identité configurée **localement** (`git config --local user.name` et
   `user.email`) ; configuration globale vérifiée inchangée (liste et empreinte du
   fichier).
4. Réécriture :

   ```bash
   FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch --env-filter '
   export GIT_AUTHOR_NAME="Kyria-Zaire"
   export GIT_AUTHOR_EMAIL="<adresse noreply>"
   export GIT_COMMITTER_NAME="Kyria-Zaire"
   export GIT_COMMITTER_EMAIL="<adresse noreply>"
   ' -- main
   ```

   Sortie : exit 0, `Ref 'refs/heads/main' was rewritten`. Aucun `--msg-filter`,
   `--tree-filter`, `--index-filter` ni `--all`. `filter-branch` conserve les dates
   d'auteur et de committer d'origine.

## Correspondance des commits

| # | Ancien SHA | Nouveau SHA | Message |
|---|---|---|---|
| 1 | `f9964e425b0c9bc04d2260904354021fb4aaac33` | `53c8d84c2378a5580eb86fcb2ff31d18ae52b2c2` | `chore: bootstrap mobile repository` |
| 2 | `9195adb6af1ecc612397f21e6ec5584dc3d7488b` | `60a507263651319b6c178a7694f76b9e97bb6210` | `docs: add shared agent doctrine and loop protocol` |
| 3 | `ed0adfc8758b6633979bbccb9027932d1219284d` | `40019910030ea530d0e8c54c8ef2d63e5d3a2b72` | `docs: configure agent entry points` |
| 4 | `df9f9d118f1f6b4ba528dd5d9ee24a72161e3e54` | `0fc233f1599a348e06f4577e6d4ef18e276fd07b` | `docs: audit and select initial engineering skills` |
| 5 | `dc9427bede655fc540b22313a6fa6a8f5d284fd7` | `f3adda972e034d453771a8c816e3d5106d7c391e` | `chore: add adapted verification and debugging skills` |
| 6 | `cd5bab271d1caad528b1fc6d1c6eb2476a1887d5` | `f7dd9ff76b77f89747246f9fa223d0d7ffe2a5f4` | `docs: audit existing mobile app reuse` |
| 7 | `2f148a5168c73b8742411db00e7e93c8a039e800` | `17d694cae5efbc3e55a6561a4a11acb474ba4d45` | `docs: record existing mobile static diagnostics` |
| 8 | `8c7dfce076b7ead2395225fed2a359f46042ef05` | `144be5dbbd9799dff6888ab6f6a3a760a7dd81d9` | `docs: record Expo SDK compatibility diagnostics` |
| 9 | `68b1dd8749dbbc3700ca600a8fc06bb41b85dacf` | `64ec1d66327bb2da52a8c06abf9e2a581d2ba720` | `docs: validate standalone mobile extraction proof` |

Les SHA cités dans les tickets et rapports antérieurs (« commit de départ », etc.)
désignent l'historique d'avant réécriture ; cette table donne leur équivalent. Ils
restent consultables via la branche de récupération.

## Vérifications après réécriture

Contrôles propres (Claude), 2026-10-02 ; sorties dans `C:\tmp\yunimobile-0009a\`.

| Contrôle | Résultat |
|---|---|
| `main` contient 9 commits | OK |
| Historique linéaire, aucun merge, parents chaînés dans le même ordre | OK |
| Tree ID identique à chaque position (1 à 9) | OK |
| Message complet identique, octet par octet, à chaque position | OK |
| Dates d'auteur et de committer identiques (format brut, fuseau compris) | OK |
| Auteur = identité cible sur les 9 commits | OK |
| Committer = identité cible sur les 9 commits | OK |
| Ancienne adresse absente des auteurs et committers de `main` | OK |
| Lignes `Co-Authored-By` identiques (9 lignes, une par commit) | OK |
| `backup/pre-yunimobile-0009a` = ancien HEAD | OK |
| Nouveau HEAD ≠ ancien HEAD | OK |
| `git diff backup/pre-yunimobile-0009a..main` vide | OK |
| `git status --short` vide | OK |
| `git fsck --full` : exit 0, aucun objet corrompu ou manquant | OK |
| `origin` inchangé ; aucun tag ; aucune référence distante | OK |

Empreintes SHA-256 des séquences, identiques avant et après réécriture : trees
`8ffd8089…`, messages `462b78e4…`, dates `b04b7e22…`, lignes `Co-Authored-By`
`3c99564f…`.

`git fsck --full` signale 24 objets orphelins (`dangling`, commits et blobs), ce qui
n'est pas une corruption. Les anciens commits restent référencés par la branche de
récupération et par `refs/original/refs/heads/main`, tous deux conservés.

## Références conservées

- `refs/heads/backup/pre-yunimobile-0009a` → `68b1dd8` : à supprimer seulement après
  vérification du premier push.
- `refs/original/refs/heads/main` → `68b1dd8` : créée par `filter-branch`,
  conservée (aucun nettoyage).
- Deux références `refs/codex/turn-diffs/checkpoints/…`, présentes avant
  l'opération, inchangées.
- Reflog et objets non nettoyés ; aucun `git gc`, `prune` ni expiration de reflog.

## Limites

- La vérification de l'adresse GitHub comme adresse noreply du compte repose sur
  l'information fournie par Kyria ; elle n'a pas été vérifiée auprès de GitHub.
- L'état réel du dépôt distant (vide) n'a pas été interrogé (aucun `fetch` ni
  `ls-remote`).
- Contrôles propres de Claude, sans réexécution indépendante.

## Suite

YUNIMOBILE-0010 — extraction permanente de l'application validée dans `yunimobile`,
non lancée.
