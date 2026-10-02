# YUNIMOBILE-0010 — Intégration permanente de l'application mobile

- **Statut** : terminé
- **Créé le** : 2026-10-02
- **Mis à jour le** : 2026-10-02 14:20 (Europe/Paris, UTC+02:00)

## Objectif

Intégrer dans `yunimobile` l'extraction autonome validée par YUNIMOBILE-0009, sans
nouvelle résolution de dépendances et sans modification fonctionnelle.

## Contexte et références

- Décision CTO de YUNIMOBILE-0009 : GO, l'extraction est la référence technique.
- Texte du ticket transmis en conversation par Kyria, enregistré ici.
- Baseline : `C:\tmp\yunimobile-0009-extract` (empreintes de référence :
  `docs/engineering/mobile-extraction-poc.md` § 11).
- Lecture seule : dépôt Yunicity d'origine, copie 0007.
- Rapport : `docs/engineering/permanent-mobile-extraction.md`.
- Première tentative bloquée (espace disque) ; reprise après nettoyage autorisé.

## Périmètre

### Autorisé

- Branche locale `feat/yunimobile-0010-extraction`.
- Copie de la baseline 0009 : `package.json`, `pnpm-workspace.yaml`, `.npmrc`,
  `tsconfig.base.json`, `pnpm-lock.yaml`, `apps/mobile`, `packages/types`,
  `packages/utils`, `packages/ui`.
- `README.md` ; `.gitignore` seulement si un artefact généré n'est pas couvert.
- Ticket, rapport, `.loop/state.md`.
- `CI=1 pnpm install --frozen-lockfile --prefer-offline` ; typecheck, lint,
  `expo install --check`, `expo-doctor@1.20.4`, `expo export` Android hors du dépôt.

### Hors périmètre

- Nouvelle résolution, `--no-frozen-lockfile`, update, `expo install --fix`,
  `@latest`, installation globale.
- Copie depuis le monorepo ; `.env` réel, secret, clé, keystore, certificat.
- Override ajouté ; correction fonctionnelle.
- Serveur persistant, dev build, `expo prebuild`, `android/`/`ios/`.
- Commit, push, merge, amend ; nettoyage des références de récupération.

## État de départ

- **Branche / HEAD** : `main` @ `380208dedb19722525c92c9d0bcb2872459d00c7` =
  `origin/main` ; arbre propre ; branche 0010 absente en local et à distance.
- Baseline 0009 : 10/10 empreintes conformes. Espace libre : 6,807 Gio.

## Critères d'acceptation

- [x] Baseline copiée sans écart (10 empreintes, lockfile, manifestes, Metro).
- [x] Aucun lien, aucune référence aux anciens chemins, aucun fichier sensible.
- [x] Installation frozen sans changement du lockfile ni des manifestes.
- [x] Audit des overrides du monorepo consigné (2 overrides pertinents manquants).
- [x] Résolution des modules autonome, React 19.1.0 seul ; types TypeScript
      externes chargés depuis un `node_modules` parent (consigné, sans effet sur le
      résultat isolé).
- [x] Typecheck, lint, `expo install --check`, `expo-doctor`, export Android
      exécutés et consignés : tous exit 0.
- [x] README mis à jour sans fonctionnalité annoncée ; `.gitignore` vérifié,
      inchangé.
- [x] Vérifications finales (diff, format, espace, `main` inchangé).

## Plan

A. Préconditions. B. Ticket. C. Copie. D. Documentation. E. Audit des overrides.
F. Installation. G. Contrôles. H. Vérifications finales.

## Risques et décisions ouvertes

- Espace disque : seuil de 3 Gio à maintenir.

## Vérifications prévues

- [x] Empreintes, liens, chemins anciens, fichiers sensibles.
- [x] Lockfile et manifestes avant/après installation.
- [x] Format des fichiers non suivis.

## Journal des tentatives

| # | Hypothèse | Action | Résultat |
|---|---|---|---|
| 1 | Espace suffisant (> 4 Gio) | Préconditions | 1,16 Gio : bloqué avant création de la branche ; aucune action |
| 2 | Espace rétabli par le nettoyage autorisé (plan A) | Préconditions refaites | 6,807 Gio : poursuite |
| 3 | Copie des dossiers vers la racine du dépôt | `robocopy` | Destination erronée (`$d` a écrasé `$D` en PowerShell) : dossiers sous `packages/`, fichiers racine non copiés. Corrigé par déplacements explicites ; vérification complète ensuite |
| 4 | Bilan pnpm `+1 -37` après override : paquets perdus ? | Comparaison des ensembles installés (dépôt, 0009, lockfile) | Réfuté : ensemble identique à 0009 hormis postcss ; les 37 absents sont des binaires optionnels d'autres plateformes |
| 5 | `git diff --cached --check` exit 2 (« new blank line at EOF ») sur 7 fichiers de la source | Retrait d'exactement un `0A` final par fichier, sur décision CTO | Chaque fichier −1 octet, préfixe identique ; typecheck et lint exit 0 |

## Résultats et preuves

Contrôles propres (Claude), 2026-10-02. Détail :
`docs/engineering/permanent-mobile-extraction.md` ; journaux :
`C:\tmp\yunimobile-0010-logs\`.

- 10/10 empreintes ; 423 fichiers identiques à la baseline.
- Installation frozen : exit 0, 0 téléchargement, lockfile inchangé.
- Typecheck, lint (51 fichiers, 0/0), `expo install --check`, `expo-doctor`
  (18/18), export Android (1 933 modules, 30 fichiers) : tous exit 0.
- Points à trancher : `expo-env.d.ts` ignoré par Git ; overrides `postcss` et
  `brace-expansion` manquants ; types externes ; données personnelles dans le code.

## Ajustements après revue CTO (2026-10-02)

Décisions CTO appliquées (détail : rapport § 12 ; journaux : `C:\tmp\yunimobile-0010b-logs\`) :

- `expo-env.d.ts` laissé ignoré : identique au gabarit du CLI Expo, aucun code
  applicatif ; typecheck sans ce fichier : exit 0.
- `apps/mobile/tsconfig.json` : `typeRoots: ["../../node_modules/@types"]` ;
  `tsc` lit 1 288 fichiers, 0 hors du dépôt.
- `package.json` racine : override `postcss` 8.5.18 ; diff du lockfile limité à
  postcss ; installation frozen exit 0.
- Pas d'override `brace-expansion` (1.1.21, 2.1.7 ; 5.0.12 aussi présent).
- `post-composer-labels.ts` : 4 valeurs `handle` personnelles (libellés statiques,
  sans usage fonctionnel) remplacées par « Compte non connecté ».
- `apps/mobile/.gitignore` : newline finale.
- Contrôles refaits : typecheck, lint (51 fichiers, 0/0), `expo install --check`,
  `expo-doctor` 18/18, export Android (1 933 modules, 30 fichiers) : tous exit 0.
- 431 fichiers seraient suivis ; ignorés pertinents : `expo-env.d.ts`,
  `node_modules`.
- Recommandation de l'auteur : GO pour le commit.

## Clôture (2026-10-02)

- **GO validé par le CTO** pour le commit de l'intégration permanente.
- `postcss` 8.5.18 ; `brace-expansion` 1.1.21, 2.1.7 et 5.0.12 vérifiés par le CTO
  au-dessus des seuils corrigés des quatre avis cités (rapport § 13) ; aucun
  override `brace-expansion`.
- Isolation TypeScript obtenue ; données personnelles neutralisées ;
  `expo-env.d.ts` volontairement ignoré conformément à Expo.
- Cinq contrôles et bundle Android réussis ; aucun dev build ni lancement runtime.
- Bundles obsolètes contenant les anciennes valeurs supprimés sur autorisation ;
  bundle assaini 0010b conservé.
- Lignes vides terminales : `git diff --cached --check` a détecté une ligne vide en
  trop à la fin de sept fichiers repris de la source (`packages/types/src/weather.ts` et, dans `packages/utils/src/`, `geo.ts`, `neighborhood-portal-labels.ts`, `neighborhood-portal.ts`, `tribe-portal-labels.ts`, `tribe-portal.ts`, `weather-api.ts`). Exactement une
  newline superflue retirée par fichier ; changement cosmétique sans effet
  fonctionnel ; divergence volontaire supplémentaire par rapport à la baseline
  0009 ; typecheck et lint réexécutés (exit 0, 0 erreur, 0 avertissement).
- Prochaine étape, non lancée : configuration et premier dev build Android.

## Revue

- [x] Revue CTO en conversation : décisions appliquées ; GO validé pour le commit
- [x] Auto-vérification
- [ ] Revue indépendante (par : …)
- [ ] Non réalisée (raison : …)

## Actions Git et installations autorisées

- **Commit** : oui — un commit local, autorisé par Kyria en conversation
  (`feat: integrate standalone Expo mobile application`)
- **Push** : non
- **Merge** : non
- **Déploiement / publication** : non
- **Installation** : oui, `pnpm install --frozen-lockfile --prefer-offline` dans le
  dépôt uniquement

## Rapport final

- Fichiers intégrés (non suivis) : 5 fichiers racine, `apps/mobile` (76, dont
  `expo-env.d.ts` ignoré), `packages/types` (47), `packages/utils` (297),
  `packages/ui` (3).
- Gouvernance : `.loop/tickets/YUNIMOBILE-0010.md`,
  `docs/engineering/permanent-mobile-extraction.md`, `.loop/state.md` ; `README.md`.
- Hors dépôt conservés : extraction 0009, bundle `C:\tmp\yunimobile-0010-dist-android`,
  journaux, cache `C:\tmp\yunimobile-0010-doctor-cache`, références Git de
  récupération.
- Limites : aucun dev build ni exécution ; résolution Metro non vérifiée module par
  module ; overrides comparés sans scanner.
- Recommandation initiale : CONDITIONAL GO (condition `expo-env.d.ts`), levée
  après revue CTO. Recommandation actuelle (séparée des preuves) : **GO** pour le
  commit ; avant le premier dev build : confirmer `brace-expansion` 5.0.12 et
  prouver l'exécution.
- Actions Git / installations : branche locale créée ; installation frozen dans le
  dépôt ; aucun commit, push ni merge.
- **Prochaine action proposée** : revue CTO.

### Verification finale de la correction EOF par Codex (2026-10-02)

- Controle propre sur la branche `feat/yunimobile-0010-extraction`, HEAD initial
  `380208dedb19722525c92c9d0bcb2872459d00c7` : correction deja presente au debut
  de cette verification ; aucun octet supplementaire retire par Codex.
- Les sept fichiers de la source/baseline 0009 avaient une ligne vide terminale
  superflue ; detection avant commit par `git diff --cached --check` rapportee
  dans le journal precedent. Comparaison propre : exactement le dernier `0A`
  retire dans chacun, tous les autres octets identiques. UTF-8 sans BOM, LF,
  une seule newline finale, aucun CR ni espace final. Divergence volontaire
  supplementaire, cosmetique, sans effet fonctionnel.
- Longueurs baseline -> index (octets) : `weather.ts` 857 -> 856 ; `geo.ts`
  970 -> 969 ; `neighborhood-portal-labels.ts` 4111 -> 4110 ;
  `neighborhood-portal.ts` 15938 -> 15937 ; `tribe-portal-labels.ts`
  4456 -> 4455 ; `tribe-portal.ts` 21202 -> 21201 ; `weather-api.ts` 829 -> 828.
- Controles propres reexecutes apres correction :
  `pnpm --filter mobile run typecheck` : exit 0 ; depuis `apps/mobile`,
  `NODE_ENV=development node ../../node_modules/eslint/bin/eslint.js app components --ext .js,.jsx,.ts,.tsx,.mjs,.cjs --max-warnings 0 --format json` :
  exit 0, 51 fichiers, 0 erreur, 0 avertissement, sans `--fix`.
- Index : 431 fichiers, identiques aux fichiers du repertoire ; 415 fichiers
  copies identiques a la baseline, 12 divergences documentees. Aucun fichier
  ignore, artefact genere ou chemin sensible detecte dans l'index ; scan de
  motifs de credentials et de chemins locaux sans correspondance (ce scan
  ne constitue pas une garantie exhaustive). Anciens handles remplaces sur
  exactement quatre lignes ; valeurs d'origine non affichees.
- Espace libre mesure : 2,735 Gio, sous le seuil de vigilance de 3 Gio du ticket ;
  aucun nettoyage effectue. Aucun bundle, diagnostic Expo ou test runtime refait.
- Les executions anterieures de Claude restent des rapports tiers pour Codex.
  Statut termine conditionne a la reussite du commit autorise dans cette sequence.

### Clôture autorisée par le CTO (2026-10-02)

- Autorisation explicite en conversation : blocage antérieur levé ; commit local
  `feat: integrate standalone Expo mobile application`, corps `Ticket: YUNIMOBILE-0010`.
- Contrôles applicatifs précédemment réussis réutilisés sans réexécution :
  typecheck propre Codex exit 0 ; lint propre Codex exit 0, 51 fichiers,
  0 erreur, 0 avertissement. Contrôles Expo et bundle : rapports tiers Claude.
  Aucun contenu applicatif non indexé ; seuls trois documents modifiés ici.
- Sept corrections EOF prouvées : exactement −1 octet par fichier, tous les
  autres octets identiques à la baseline ; `git diff --cached --check` réussi
  après correction, exit 0, aucune sortie. Détail des longueurs ci-dessus.
- Nettoyages arrêtés sans suppression de dossier : deux refus d'accès sur
  `.bin/acorn` de la copie 0007 ; inventaire intact vérifié après la première
  tentative. Inventaire des `pip-unpack-*` arrêté au premier refus d'accès,
  avant suppression. Aucun nettoyage supplémentaire ; aucun autre dossier touché.
- Dérogation CTO au seuil de 3,5 Gio uniquement pour clôture documentaire et
  commit ; seuil final exigé : plus de 2,5 Gio. Mesure avant clôture : 2,747 Gio.
  Aucune installation, aucun bundle, typecheck, lint ou outil Expo relancé.
- Réindexation limitée aux trois documents ; contrôle final de l'index requis :
  exit 0 sans sortie, exactement 431 fichiers, aucune modification non indexée.
- Statut terminé conditionné à la réussite du commit local dans cette séquence.
  Aucun push, merge, rebase ou ticket suivant.
