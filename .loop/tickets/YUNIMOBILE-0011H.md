# YUNIMOBILE-0011H — Préparation de l’API de test mobile isolée

- **Statut** : terminé — configuration statique préparée ; build, lancement et
  accès API iPhone non exécutés
- **Créé le** : 2026-10-13
- **Mis à jour le** : 2026-10-13 09:40 (Europe/Paris)

## Objectif

Préparer une configuration concrète du backend FastAPI commun pour tester
Yunicity sur iPhone, sans perturber la QA Web (8010).

## Contexte et références

- Priorité post-0011G : API isolée iPhone.
- Rapport : `docs/engineering/mobile-api-isolation-plan.md`.
- Compose : `ops/mobile-dev/compose.yaml` + `.env.example`.
- PR #13 : diagnostics CodeRabbit acceptés (contexte Docker ; `DATABASE_URL`).

## Périmètre

### Autorisé

- Cinq fichiers : ticket, rapport, `.loop/state.md`,
  `ops/mobile-dev/compose.yaml`, `ops/mobile-dev/.env.example`.
- Lecture Dockerfile / `.dockerignore` / `postgres/init` (sans les modifier).
- Validations Compose / Git / ressources statiques.
- Commit local de clôture (sans push) ; corrections documentaires post-revue.

### Hors périmètre

- Build, `up`, pull, migrations, seed, Metro, pare-feu, snapshot.
- Création de `.env` réel ou du ticket 0011I.
- Push ; modification d’un autre dépôt ; nouvelle revue CodeRabbit.

## État de départ

- Branche `chore/yunimobile-0011h-mobile-api-plan` ; base `main` @
  `ef66b3c0052b60cb20d882dfe00b884b49d53c6b`.

## Critères d'acceptation

- [x] Compose isolé ; runtime image sans bind `/app`.
- [x] Construction future depuis instantané SHA documentée (non créée).
- [x] Conditions pré-build consignées (inventaire contexte Docker complet,
      deps, init, isolation).
- [x] Constats Dockerfile / `.dockerignore` / init Postgres rapportés.
- [x] `.env.example` sans chemins personnels ; `YUNICITY_REPO_ROOT` vide.
- [x] `${VAR:?…}` vs placeholders `change-me` documenté.
- [x] `POSTGRES_PASSWORD` brut + `POSTGRES_*_URLENCODED` obligatoires.
- [x] Validations statiques OK ; pas de secrets réels.
- [x] Build / lancement / API iPhone **non exécutés** ; RAM mesurée insuffisante.

## Conditions pré-build (consignées)

1. Instantané à **SHA Git complet vérifié**, hors worktree Web actif et hors
   yunimobile — **sans** fichiers non suivis issus du worktree actif —
   **non créé** dans 0011H.
2. **Inventaire du contexte de build** : tout fichier transmis à Docker après
   `.dockerignore` (réinclusions `!…` et ignore Dockerfile inclus). Les
   `COPY` **ne définissent pas** cet inventaire ; contrôler **séparément** ce
   qui entre dans l’image. Refuser avant build tout secret / clé / credential /
   donnée locale. **Ce contrôle n’a pas été exécuté** dans 0011H.
3. Dockerfile **non** verrouillé par `uv.lock` : reproductibilité des
   dépendances **non démontrée**.
4. Scripts init : exécutés sur **volume neuf uniquement** — extensions PostGIS
   + `uuid-ossp` + base de test vide `yunicity_test` ; **aucun** seed métier.
5. **Aucune** réutilisation des données / volumes / credentials QA ou prod.
6. `POSTGRES_PASSWORD` = brut (Postgres) ;
   `POSTGRES_PASSWORD_URLENCODED` = dérivé encodé pour `DATABASE_URL` uniquement
   (idem user via `POSTGRES_USER_URLENCODED`).

## Résultats et preuves

- Configuration statique livrée ; bind `/app` retiré ; validation Compose avec
  chemin factice ; échec si variables obligatoires vides (dont
  `POSTGRES_PASSWORD_URLENCODED`).
- Contrôle URL factice : mot de passe contenant `@`, `/`, `:`, `%`, `#`, espace
  — encodage / décodage / séparation brut vs URL (voir rapport).
- Dernière mesure RAM : **1,34 Gio** libres → lancement classé **BLOCKED**.
- QA Web 8010 préservée ; aucun build / conteneur mobile / accès API iPhone.

## Revue

- [x] Auto-vérification
- [x] Revue indépendante (CTO / CodeRabbit PR #13) — 2 diagnostics acceptés,
      corrigés dans les cinq fichiers (threads non résolus dans cette passe)

## Actions Git et installations autorisées

- **Commit** : oui (clôture) ; corrections post-PR : commit **non** dans la
  passe de correction documentaire (passe séparée si demandée)
- **Push** : non (passe correction)
- **Merge** : non
- **Installation** : non

## Rapport final

- Fichiers : les cinq du périmètre.
- **Prochaine action proposée** : **YUNIMOBILE-0011I** — construction et
  validation API mobile isolée (**non créé / non lancé**) ; revérifier
  ressources et contexte de build avant exécution.
