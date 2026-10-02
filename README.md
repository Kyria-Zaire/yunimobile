# Yunicity Mobile

Application iOS / Android de **Yunicity**, le réseau social local. Le lancement démarre à **Reims**.

> **Statut : intégration en cours.** Une application Expo SDK 54 est intégrée sous `apps/mobile`, reprise de la base existante du dépôt Yunicity. L'extraction autonome et le bundle Android Metro ont été validés. **Aucun dev build, aucun lancement sur appareil ou émulateur et aucun build natif Android ou iOS ne sont encore prouvés.** Aucune fonctionnalité n'est annoncée comme livrée.

## Objectif

Lancement de l'application mobile **avant le 31 décembre 2026**.

## Contexte et dépôts liés

- Dépôt principal Yunicity : <https://github.com/Kyria-Zaire/yunicity.review>
- Le **backend FastAPI** reste dans le dépôt Yunicity principal, commun au web et au mobile ; il n'est pas dupliqué ici.
- L'application a été extraite de `frontend/apps/mobile` de ce dépôt (YUNIMOBILE-0006 à YUNIMOBILE-0010).

## Structure

```text
apps/mobile/        application Expo SDK 54 (Expo Router)
packages/types/     types partagés (@yunicity/types)
packages/utils/     client API et logique partagée (@yunicity/utils)
packages/ui/        sous-ensemble brand (@yunicity/ui/brand)
```

Workspace pnpm (`pnpm-workspace.yaml`), `node-linker=hoisted` (`.npmrc`), lockfile `pnpm-lock.yaml` versionné.

## Prérequis constatés

- Node.js : `engines` `>=20` ; vérifié avec Node v24.18.1.
- pnpm 9.15.9 (`packageManager`). Une version plus récente de pnpm bascule automatiquement sur la version déclarée.

## Commandes vérifiées

Commandes exécutées avec succès dans YUNIMOBILE-0010 (voir
`docs/engineering/permanent-mobile-extraction.md`) :

```bash
# Installation, sans nouvelle résolution du lockfile
CI=1 pnpm install --frozen-lockfile --prefer-offline

# Typecheck du package mobile
pnpm --filter mobile run typecheck

# Lint du périmètre Expo par défaut, depuis apps/mobile, sans --fix
NODE_ENV=development node ../../node_modules/eslint/bin/eslint.js app components --ext .js,.jsx,.ts,.tsx,.mjs,.cjs

# Contrôle des versions attendues par Expo, depuis apps/mobile
CI=1 EXPO_NO_TELEMETRY=1 node ../../node_modules/expo/bin/cli install --check --pnpm

# Bundle Android Metro hors du dépôt, depuis apps/mobile
CI=1 EXPO_NO_TELEMETRY=1 node ../../node_modules/expo/bin/cli export --platform android --output-dir <dossier hors dépôt> --clear
```

Les scripts `lint` (`expo lint`) et `dev`/`android`/`ios` (`expo start`) du package mobile n'ont pas été exécutés dans ce dépôt.

## Sécurité

- **Aucun secret dans l'application** : toute valeur embarquée (constantes, configuration, variables `EXPO_PUBLIC_*`, bundle) est lisible par le client.
- Seuls les fichiers `.env.example` / `.env.*.example` sont suivis (voir `.gitignore`).
- Les contrôles d'autorisation restent côté serveur.

## Conventions de fichiers

- Encodage UTF-8, fins de ligne LF, indentation de deux espaces (voir `.editorconfig`).
- Doctrine des agents : `AGENTS.md` ; tickets : `.loop/tickets/` ; état : `.loop/state.md`.
