# Plan — API de test mobile isolée (YUNIMOBILE-0011H)

**Date** : 2026-10-13
**Statut** : terminé — configuration statique préparée ; build, lancement et
accès API iPhone non exécutés
**Branche** : `chore/yunimobile-0011h-mobile-api-plan`

## 1. Objectif

Préparer une configuration Compose concrète pour exposer le backend FastAPI
**commun** sur le LAN (port **8011**), afin de tester Yunicity sur iPhone, sans
toucher à la stack QA Web (**8010** / projet `yunicity-qa`).

Cette passe est **statique** : aucun conteneur mobile démarré, aucun build
forcé, aucune migration/seed exécutée, aucun `.env` réel créé.

## 2. Source backend et construction future

### 2.1 Instantané (non créé dans cette passe)

Construction **future** prévue depuis un **instantané temporaire** du monorepo
backend commun :

- un **SHA Git complet** vérifié au moment de la création de l’instantané ;
- **hors** du worktree Web actif ;
- **hors** du dépôt `yunimobile` ;
- chemin fourni uniquement via `YUNICITY_REPO_ROOT` dans un `.env` local
  gitignoré (ou variable d’environnement explicite pour la validation).

L’instantané **n’a pas été créé** dans 0011H.

### 2.2 Image et code runtime

| Élément | Comportement |
|---|---|
| Build | `context: ${YUNICITY_REPO_ROOT}/backend`, `dockerfile: Dockerfile` |
| Image attendue | `yunicity-mobile-dev-backend-mobile` (projet Compose) |
| Runtime | **Uniquement** le code `COPY` dans l’image — **aucun** bind-mount `/app` |
| Postgres init | Bind **read_only** de `${YUNICITY_REPO_ROOT}/infra/docker/postgres/init` (même instantané figé) |

Un SHA écrit dans un rapport **ne fige pas** un worktree vivant. Sans
instantané figé + image construite depuis cet instantané, la stabilité de
source n’est pas garantie.

### 2.3 Dépendances — pas de reproductibilité affirmée

Lecture seule du `Dockerfile` backend : `pip install -e ".[dev]"` à partir de
`pyproject.toml` (bornes de versions). Un fichier `uv.lock` existe dans le
backend, mais **n’est ni copié ni utilisé** par le `Dockerfile` actuel.

**Constats** : la méthode de verrouillage (`uv.lock`) n’est pas prouvée comme
entrée du build image. **Aucune affirmation de reproductibilité des
dépendances** tant que le verrouillage effectif du build n’est pas vérifié
et aligné.

### 2.4 Dockerfile / `.dockerignore` (lecture seule — exclusions)

`.dockerignore` observe :

- exclus : `.venv/`, caches, `.env`, `.env.*`, `data/dev_backups/`, `.git/`, etc. ;
- exception : `!.env.example` (le fichier d’exemple peut entrer dans le
  *context* ; les `COPY` actuels ne le copient pas explicitement).

**Exclusions manquantes / risques à traiter avant correction** (aucune
modification du dépôt backend dans cette passe) :

1. Pas d’exclusion générique pour credentials hors `.env` (`*.pem`, `*.key`,
   `credentials.json`, etc.).
2. `COPY data ./data`, `COPY tests`, `COPY scripts` : tout secret placé sous
   ces arbres (hors `data/dev_backups/`) entrerait dans l’image.
3. Dépendance au caractère **sélectif** des `COPY` du Dockerfile : un futur
   `COPY . .` élargirait la surface.

Proposition de correction : **reportée** — à décider dans un ticket backend
ou de lancement après revue de ces écarts.

## 3. Scripts `postgres/init` (lecture seule)

Fichiers sous `infra/docker/postgres/init` de l’instantané backend :

| Fichier | Opérations | Données initiales |
|---|---|---|
| `001-enable-postgis.sql` | `CREATE EXTENSION IF NOT EXISTS postgis` ; `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"` | Aucune donnée métier |
| `002-create-test-database.sh` | Crée la base `yunicity_test` (si absente), owner `${POSTGRES_USER}` | Base vide dédiée pytest — **pas** de seed applicatif |

Exécution : **une fois**, lorsque le volume Postgres est **vide** (entrypoint
image officielle). Ré-exécution absente si le volume existe déjà.

Le futur lancement doit monter ces scripts depuis l’**instantané figé**
(`YUNICITY_REPO_ROOT`), pas depuis un worktree Web susceptible de changer
pendant le test.

## 4. Configuration préparée

| Fichier | Rôle |
|---|---|
| `ops/mobile-dev/compose.yaml` | Projet `yunicity-mobile-dev` |
| `ops/mobile-dev/.env.example` | Paramètres + placeholders (sans chemins personnels) |

### Services

| Service | Conteneur | Image / build | Ports hôte |
|---|---|---|---|
| `postgres-mobile` | `yunicity-postgres-mobile-dev` | `postgis/postgis:16-3.4` | **aucun** |
| `redis-mobile` | `yunicity-redis-mobile-dev` | `redis:7-alpine` | **aucun** |
| `backend-mobile` | `yunicity-backend-mobile-dev` | build snapshot `/backend` | `${MOBILE_API_BIND_HOST}:${MOBILE_API_HOST_PORT}→8000` |

- Pas de worker vidéo ; pas de socket Docker ; pas de `privileged`.
- Volumes : `yunicity-mobile-dev-pgdata`, `yunicity-mobile-dev-redis`.
- Réseau : `yunicity-mobile-dev-net`.
- Médias : chemins image `/data/media/...` ; pas de volume QA.
- CORS : non ajouté.
- Marqueurs QA : exclus.

### Secrets et `${VAR:?…}`

- `${VAR:?message}` refuse une variable **absente** ou **vide**.
- Il **ne refuse pas** les chaînes `change-me-…` : à remplacer et vérifier
  avant tout lancement.
- Secrets réels uniquement dans `ops/mobile-dev/.env` (gitignoré ; **non créé**
  ici).

## 5. Isolation (statique, post-correction)

| Critère | Statut |
|---|---|
| Réseau / volumes dédiés mobile | OK |
| Pas de partage avec QA/prod | OK |
| Postgres/Redis sans ports hôte | OK |
| API seule sur LAN:8011 (paramètres) | OK |
| Aucun montage RW vers source Web | OK (bind `/app` **retiré**) |
| Init Postgres en lecture seule depuis snapshot | OK (chemin snapshot) |

## 6. Démarrage backend

`lifespan` : `init_db` (moteur SQLAlchemy), `init_redis`, validations médias.
**Pas** d’`alembic upgrade` automatique, **pas** de seed.

## 7. Ressources

| Mesure (2026-10-13, passe préparation) | Valeur |
|---|---|
| RAM libre | **1,34 Gio** → lancement **BLOCKED** (< 4 Gio) |
| Disque (C:) | 14,42 Gio |
| Port 8011 | libre (relevé préparation) |
| QA Web 8010 | à préserver ; non modifiée |

## 8. Commandes proposées (lancement futur — non exécuté)

Prérequis : instantané figé + `.env` local avec secrets dédiés + RAM ≥ 4 Gio.

```text
docker compose -p yunicity-mobile-dev -f ops/mobile-dev/compose.yaml --env-file ops/mobile-dev/.env up -d postgres-mobile redis-mobile backend-mobile
docker compose -p yunicity-mobile-dev -f ops/mobile-dev/compose.yaml --env-file ops/mobile-dev/.env exec backend-mobile alembic upgrade head
curl -fsS http://<LAN>:8011/api/v1/health
docker compose -p yunicity-mobile-dev -f ops/mobile-dev/compose.yaml --env-file ops/mobile-dev/.env stop
```

Interdit : `down -v`, toucher à la QA, seed dans 0011H.

### Validation Compose (statique — exécutée)

Succès (chemin factice **uniquement** via l’environnement du shell) :

```text
# PowerShell — ne crée pas de .env
$env:YUNICITY_REPO_ROOT = 'C:\tmp\fake-yunicity-backend-snapshot'
docker compose -p yunicity-mobile-dev -f ops/mobile-dev/compose.yaml --env-file ops/mobile-dev/.env.example config --quiet
```

Échec attendu (variable obligatoire absente/vide) :

```text
Remove-Item Env:YUNICITY_REPO_ROOT -ErrorAction SilentlyContinue
docker compose -p yunicity-mobile-dev -f ops/mobile-dev/compose.yaml --env-file ops/mobile-dev/.env.example config --quiet
# → exit ≠ 0 (YUNICITY_REPO_ROOT is required)
```

## 9. Conditions pré-build (clôture 0011H)

À satisfaire **avant** tout build / lancement (ticket proposé **0011I**, non
créé ici) :

1. **Instantané** à SHA Git complet vérifié, hors worktree Web actif et hors
   dépôt yunimobile — non créé dans 0011H.
2. **Inventaire du contexte de build autorisé** : arborescence envoyée au
   daemon = ce que le Dockerfile copie après `.dockerignore` (`pyproject.toml`,
   `README.md`, `app/`, `workers/`, `alembic/`, `alembic.ini`, `tests/`,
   `scripts/`, `data/` hors `data/dev_backups/`). Aucun secret, clé, credential
   ni donnée locale QA/prod ne doit y figurer. Exclusions manquantes hors
   `.env` (ex. `*.pem`, credentials génériques) : écarts documentés § 2.4 —
   à traiter avant build si exigé.
3. **Dépendances** : le Dockerfile n’utilise pas `uv.lock` ;
   reproductibilité des dépendances **non démontrée**.
4. **Init Postgres** : uniquement sur volume neuf — extensions + base de test
   vide ; **aucun** seed métier.
5. **Aucune** réutilisation des volumes, credentials ou données QA/prod.

Ressources et contexte de build : **à revérifier** avant exécution (dernière
mesure RAM : 1,34 Gio libres → lancement BLOCKED).

## 10. Préconditions restantes (pour 0011I)

1. RAM libre ≥ 4 Gio (revérifier).
2. Créer l’instantané backend (SHA vérifié) hors worktree Web.
3. Créer `ops/mobile-dev/.env` dédié ; remplacer tous les `change-me`.
4. Traiter les écarts `.dockerignore` / verrouillage deps si exigés.
5. Build, `up`, health, migrations ; seed exclu de 0011H.
6. `EXPO_PUBLIC_API_URL` mobile : hors 0011H.
7. Préserver QA **8010**.
