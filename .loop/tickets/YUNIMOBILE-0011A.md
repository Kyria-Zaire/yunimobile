# YUNIMOBILE-0011A — Audit de préparation au premier dev build Android

- **Statut** : terminé — audit réalisé ; premier dev build bloqué
- **Créé le** : 2026-10-02
- **Référence** : ticket fourni en conversation par le CTO.

## Objectif

Déterminer les outils Windows et Android déjà installés pour construire et lancer
Yunicity Mobile, et préparer un plan de libération d'espace sans action destructive.

## Périmètre

Lecture seule du dépôt et de l'environnement ; commandes de version et diagnostics
sans écriture. Seuls fichiers modifiables : ce ticket,
`docs/engineering/android-environment-audit.md`, `.loop/state.md`.
Aucun secret lu ou affiché ; aucun `.env` réel ouvert ; aucun lien suivi.
Aucune installation, mise à jour, téléchargement réseau, suppression, génération
native, build, bundle, lint, typecheck, activation de fonctionnalité Windows,
changement de branche, commit ou push. Ne pas lancer Android Studio, Gradle,
un émulateur, `expo prebuild` ou `expo run:android`.

## État initial prouvé

- Branche `main` ; HEAD et `origin/main` :
  `ec65162044cbfb5b9dea21beba31666a49b6c8cd`.
- `git status --short` vide avant enregistrement du ticket.
- Ticket enregistré avant les diagnostics d'environnement.

## Critères d'acceptation

- [x] Trois mesures initiales de C: sur environ 40 secondes.
- [x] Tailles des copies 0007, 0009, 0010b Android, 0009a et journaux 0010/0010b.
- [x] Inventaire des caches Gradle, SDK et images/AVD Android, extensions VS Code,
      CachedExtensionVSIXs, pip-unpack, npm et pnpm ; aucun lien suivi.
- [x] Taille apparente distinguée du gain estimé et des liens physiques.
- [x] Windows, Node, pnpm, Java, javac, Android Studio, variables ciblées,
      outils Android, SDK/NDK, hyperviseur et virtualisation documentés.
- [x] Appareil/AVD disponible ou vérification impossible explicitement signalé.
- [x] Configuration mobile, Mapbox, Expo Go/dev build et versions Android examinés.
- [x] Plan ordonné par chemins exacts mesurés ; objectifs 12/20 Gio.
- [x] Décision READY, CONDITIONAL READY ou BLOCKED ; prochain ticket proposé.
- [x] Auto-vérification documentaire, `git diff --check`, état Git final.

## Plan

Préconditions → mesures et inventaire en lecture seule → configuration locale →
plan d'espace et décision → auto-vérification → statut à revoir → arrêt.

## Actions Git et installations

Commit, push, changement de branche et installation : interdits.
Aucune suppression ni modification d'ACL autorisée.

Dérogation de clôture explicitement autorisée par le CTO en conversation : créer
`docs/yunimobile-0011a-android-audit`, commiter uniquement les trois documents avec
`docs: audit Android development environment` et `Ticket: YUNIMOBILE-0011A`.
Aucun nouvel audit, push, merge, installation ou suppression.

## Résultats et limites

Rapport : `docs/engineering/android-environment-audit.md`.

- Décision : **BLOCKED** pour le dev build, principalement par l'espace disque
  (~2,63 Gio initiaux, 2,741 Gio en fin d'inventaire ; objectif 12/20 Gio).
- Windows 11 Famille 25H2, Node 24.18.1, pnpm 9.15.9, Java/javac 21.0.6.
- Studio, SDK 36, build-tools 36.0.0 et NDK 27.1.12297006 déjà présents.
  Java 17 demandé par la toolchain RN non identifié ; variables SDK/JAVA_HOME UNSET.
- Aucun AVD listé ; appareil non vérifié car `adb devices -l` démarrerait un serveur.
  Hyperviseur présent et virtualisation firmware active ; états des trois options
  Windows non vérifiés faute d'élévation. Aucune activation tentée.
- Sources installées : minSdk 24, compile/target 36 ; Mapbox impose un binaire
  natif, Expo Go insuffisant. Token de téléchargement Android optionnel selon le
  plugin installé ; token public et endpoint API à configurer au runtime.
- Inventaire sans suivi de liens, seconde passe `os.stat` pour les liens physiques :
  store pnpm 8,579 Gio apparents, 5,612 Gio non partagés ; anciennes extensions
  3,939 Gio ; VSIX 2,957 Gio ; npm 1,221 Gio. Scénario prudent ~16,360 Gio libres
  sous réserve de nettoyage autorisé futur, moins que la cible de 20 Gio.
- 933 dossiers pip-unpack inaccessibles : taille inconnue, aucun gain compté.
  Copie 0007 exclue du plan de suppression conformément à l'abandon antérieur.
- Auto-vérification documentaire ; `git diff --check` exit 0 sans sortie,
  contrôle de format des documents non indexés ; seuls les trois fichiers
  autorisés modifiés, HEAD et origin/main inchangés, index vide.
- Prochain ticket proposé : **YUNIMOBILE-0011B — Libération d'espace et validation
  de la cible Android**, soumis au CTO ; non lancé.
- Aucun commit, push, installation, suppression, téléchargement ou contrôle lourd.
