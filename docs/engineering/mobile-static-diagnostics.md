# Diagnostic statique de la base mobile

Diagnostic YUNIMOBILE-0007, Claude Code. Première tentative bloquée le 2026-10-01
(espace disque) ; diagnostics exécutés le 2026-10-02 après libération d'espace.

## Résumé

| Contrôle | Commande | Code de sortie | Diagnostics |
|---|---|---|---|
| Typecheck | `tsc --noEmit` (configuration du package) | 0 | 0 erreur |
| ESLint, périmètre par défaut de `expo lint` (`app`, `components`) | `eslint app components` | 0 | 0 erreur, 0 avertissement (51 fichiers) |
| ESLint, package complet | `eslint .` | 0 | 0 erreur, 1 avertissement (69 fichiers) |

Ces résultats mesurent l'état statique du code au SHA audité. Ils ne prouvent ni un
build, ni un fonctionnement, ni la compatibilité native (voir § 7).

## 1. Cible et état des dépôts

- Source : `C:\Users\kyria\yunicity` (`Kyria-Zaire/yunicity.review`), commit
  `ee57ce1dfc37835a47335e56338578471a95ec7d`, package `frontend/apps/mobile`
  (nom npm : `mobile`).
- Source avant et après : HEAD = SHA attendu, branche
  `feat/c3-global-refonte-preview`, état Git identique (HEAD, branche, statut avec
  non suivis, stashes, toutes les refs) à l'instantané de YUNIMOBILE-0006. Commandes
  Git en `--no-optional-locks`.
- `yunimobile` : `main` @ `cd5bab271d1caad528b1fc6d1c6eb2476a1887d5`.

## 2. Copie isolée

Dossier conservé pour revue : `C:\tmp\yunimobile-0007-diag\`

- `src\frontend\` : fichiers suivis de `frontend/` au SHA, extraits par
  `git archive --format=tar ee57ce1… frontend | tar -x` (2 551 fichiers, nombre égal
  à `git ls-tree`). Aucune règle `export-ignore`. Seuls fichiers d'environnement
  suivis : trois `.env.example`. Aucun `.env` réel, credential, `.expo` ni cache
  copié.
- Dépendances : copie indépendante par `robocopy /E /XJ /COPY:DAT` (fichiers
  réels, jonctions exclues, aucun lien physique vers la source) depuis les dossiers
  installés de la source :

  | Dossier | Fichiers | Taille | Dossiers exclus (jonctions) |
  |---|---|---|---|
  | `node_modules` | 62 209 | 877,12 Mio | 0 |
  | `apps/mobile/node_modules` | 575 | 10,69 Mio | 3 |
  | `packages/utils/node_modules` | 1 | 10,9 Kio | 1 |
  | `packages/ui/node_modules` | 1 | 1,2 Kio | 0 |

  Codes de sortie `robocopy` : 1 (fichiers copiés, aucun échec).
- Jonctions de workspace recréées **dans la copie**, vers les packages extraits au
  SHA : `apps/mobile/node_modules/@yunicity/{types,ui,utils}` et
  `packages/utils/node_modules/@yunicity/types`. Contrôle : aucun lien de la copie ne
  cible un chemin hors de la copie.
- Résolutions : `tsc --listFilesOnly` → 1 275 fichiers, tous sous la copie (66 du
  package mobile, 339 des packages partagés). `require.resolve` depuis le package
  mobile : `eslint`, `eslint-config-expo`, `@typescript-eslint/parser` et les plugins
  `react`, `react-hooks`, `import`, `expo` résolus dans la copie.
- Intégrité après diagnostics : 592 fichiers de `apps/mobile` et `packages/`
  comparés aux blobs du SHA (`git hash-object --stdin`) → 0 différence.
- Espace libre sur `C:` : 5,224 Gio avant copie ; 4,040 Gio après copie ; 4,029 Gio
  après diagnostics.

## 3. Outils

| Outil | Version | Emplacement (copie) |
|---|---|---|
| Node.js | v24.18.1 | `C:\nvm4w\nodejs\node.exe` (poste ; `engines` : `>=20`) |
| TypeScript | 5.9.3 | `frontend/node_modules/typescript` |
| ESLint | 8.57.1 | `frontend/apps/mobile/node_modules/eslint` (ESLint 9.39.4 présent à la racine, non utilisé) |
| `eslint-config-expo` | 10.0.0 | `frontend/node_modules` |
| `@expo/cli` (lu, non exécuté) | 54.0.24 | `frontend/node_modules/@expo/cli` |

Scripts du package : `typecheck` = `tsc --noEmit` ; `lint` = `expo lint` ; aucun
script `pre`/`post` dans le package. Les scripts `pretypecheck`/`postlint` de
`frontend/package.json` (`normalize-next-tsconfig.mjs`) ne sont pas appelés.

## 4. Typecheck

- Dossier : `C:\tmp\yunimobile-0007-diag\src\frontend\apps\mobile`
- Commande : `node ../../node_modules/typescript/bin/tsc --noEmit -p tsconfig.json --pretty false`
  (équivalent du script `tsc --noEmit`, avec `--pretty false` pour une sortie
  analysable).
- Début : 2026-10-02 00:16:08 +02:00. Code de sortie : **0**. Sortie : vide
  (0 octet). Erreurs : **0**.
- Journal : `logs\tsc.log`, `logs\tsc.meta`, `logs\tsc-listFilesOnly.txt`.

## 5. Lint

`expo lint` n'a pas été lancé : il peut installer ESLint ou écrire un fichier de
configuration (`ESlintPrerequisite.js`) et active un cache dans `.expo/cache`.
Lecture de `@expo/cli/build/src/lint` : sans argument, il lint `src`, `app` et
`components` s'ils existent, avec `NODE_ENV=development`. ESLint est donc lancé
directement, avec la configuration existante (`.eslintrc.js`), sans `--fix` ni
`--cache`.

Dossier : `C:\tmp\yunimobile-0007-diag\src\frontend\apps\mobile`

| Passage | Commande | Début | Code | Fichiers | Erreurs | Avertissements |
|---|---|---|---|---|---|---|
| Périmètre `expo lint` | `NODE_ENV=development node node_modules/eslint/bin/eslint.js app components --ext .js,.jsx,.ts,.tsx,.mjs,.cjs` | 00:16:56 | **0** | 51 | 0 | 0 |
| Package complet (informatif) | `NODE_ENV=development node node_modules/eslint/bin/eslint.js . --ext .js,.jsx,.ts,.tsx,.mjs,.cjs` | 00:20:54 | **0** | 69 | 0 | 1 |

Avertissement unique (package complet, hors périmètre par défaut de `expo lint`) :

```text
hooks/use-search.ts
  115:6  warning  React Hook useEffect has a missing dependency: 'runSearch'.
                  Either include it or remove the dependency array
                  react-hooks/exhaustive-deps
```

Chaque passage a aussi été relancé avec `--format json` (codes 0, stderr vide) pour
le comptage. Journaux : `logs\eslint-*.log`, `.json`, `.meta`, `.summary.txt`.
Aucun fichier `.eslintcache` ni dossier `.expo` créé.

## 6. Classement des diagnostics

| Diagnostic | Classe | Nature |
|---|---|---|
| `react-hooks/exhaustive-deps`, `hooks/use-search.ts:115` | Code mobile | Constat de l'outil (avertissement). Effet réel non démontré : peut être intentionnel ou provoquer une valeur périmée ; nécessite une lecture du hook. |

Aucun diagnostic n'est attribuable au package partagé, à la configuration ou à
l'environnement.

## 7. Limites

- **Dépendances réutilisées** : copie de l'installation locale de la source, dont la
  conformité au lockfile n'est pas vérifiée (aucun `pnpm install --frozen-lockfile`).
  Un autre état de `node_modules` pourrait produire d'autres résultats.
- **Node** : v24.18.1 du poste ; la CI utilise « Node.js LTS » (version exacte non
  vérifiée).
- **Routes typées** : `.expo/types` (types générés par Expo Router, inclus par le
  `tsconfig`) n'est pas copié. Le typecheck passe sans eux ; le contrôle avec les
  types de routes générés n'est pas fait.
- **Périmètre de `expo lint`** : reproduit par lecture de son code ; `expo lint`
  lui-même n'a pas été exécuté.
- **Portée** : lint et typecheck mesurent l'état du code ; ils ne prouvent ni un
  build Metro ou natif, ni la compatibilité des dépendances avec SDK 54
  (`expo-doctor`, `expo install --check` non exécutés), ni un comportement à
  l'exécution.
- Les résultats sont des contrôles propres de Claude, sans réexécution
  indépendante.

## 8. Historique du blocage (2026-10-01)

Première tentative bloquée : copie des dépendances (~920 Mo, 62 209 fichiers) avec
1,61 à 1,74 Go libres sur `C:`, aucun autre volume. Kyria a autorisé ensuite la
suppression de sept dossiers `.next-build` de worktrees inactifs (gain mesuré
3,98 Gio), hors dépôt `yunimobile`.

## 9. Revue CTO (2026-10-02)

- Audit statique approuvé.
- La commande ESLint sur `app` et `components` reproduit correctement le périmètre
  par défaut de `expo lint` pour ce projet, qui n'a pas de dossier `src`.
- Le warning `hooks/use-search.ts:115` (`react-hooks/exhaustive-deps`) reste
  documenté comme **dette**, sans correction dans ce ticket.
- Les résultats renforcent l'option A (extraction de la base existante) de
  `mobile-reuse-audit.md`, sans décider la stratégie de reprise.
- La copie isolée et ses journaux sont conservés pour YUNIMOBILE-0008.

## 10. Prochain travail proposé

Les contrôles statiques ne révèlent aucun blocage du code. Cela ne tranche pas la
stratégie de reprise (audit, § 10) : les inconnues décisives restent la
compatibilité Expo et le build natif. Proposition, à décider :

1. Diagnostic de compatibilité Expo dans la même copie isolée :
   `expo-doctor` et `expo install --check`, à autoriser (ces commandes peuvent
   interroger le réseau).
2. Puis, selon les résultats, un dev build Android.

Aucune reconstruction ni extraction n'est décidée par ce diagnostic.
