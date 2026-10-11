# YUNIMOBILE-0011C — Préparation Java/Android et stratégie d’appareil

- **Statut** : terminé — environnement et stratégie d’appareil diagnostiqués ;
  préparation native conditionnelle
- **Créé le** : 2026-10-11 (Europe/Paris)
- **Mis à jour le** : 2026-10-11 23:14 (Europe/Paris)
- **Référence** : ticket CTO ; addendum Google Maps ; revue CTO ; clôture CTO
  (2026-10-11). Fichier enregistré après synchronisation de `main`.

## Objectif

Synchroniser `main` après la PR #3, consigner la preuve de chargement automatique
Cursor, préparer Java et Android **sans build ni installation**, et documenter la
stratégie d’appareil et la décision cartographique définitive.

## Contexte et références

- Précédents : YUNIMOBILE-0011A, YUNIMOBILE-0011B.
- Livrable : `docs/engineering/android-device-readiness.md`.
- Cursor : `docs/engineering/agent-setup.md`.
- Doctrine : `AGENTS.md` ; protocole : `docs/engineering/loop-protocol.md`.

## Périmètre

### Autorisé

- Sync `main` ; branche `chore/yunimobile-0011c-android-readiness`.
- Uniquement : ce ticket, `.loop/state.md`,
  `docs/engineering/android-device-readiness.md`,
  `docs/engineering/agent-setup.md`.
- Lectures Java/Android ; `adb devices -l` (daemon à rapporter).

### Hors périmètre

- Installation, téléchargement, variables persistantes.
- Expo, Gradle, prebuild, build, AVD, Studio/émulateur.
- Code applicatif, tokens/build/environnement Mapbox, migration Google Maps.
- Arrêt/redémarrage du daemon ADB lors des corrections documentaires.
- Commit, push, merge.

## État de départ

- HEAD = origin/main = `e62d4f7bed657e7933efae641f25175a09f0facc`.
- Merge PR #3 : parents `3ae8bdb…` et `edebecc…`.
- Branche : `chore/yunimobile-0011c-android-readiness`.

## Critères d'acceptation

- [x] Sync et merge PR #3 vérifiés.
- [x] Preuve Cursor dans `agent-setup.md`.
- [x] Java/Android inventoriés sans installation ni variables persistantes.
- [x] Décision cartographique Google Maps écrite explicitement (revue CTO).
- [x] Stratégie d’appareil corrigée (AVD après migration ; pas d’action immédiate).
- [x] Roadmap 0011D → 0011E → 0011F.
- [x] Espace > 12 Gio ; quatre fichiers ; `git diff --check`.
- [x] Statut final de clôture ; **CONDITIONAL READY** ; conditions restantes
  explicites.

## Risques et décisions ouvertes

- Google Maps définitif Web+Mobile ; Mapbox abandonné ; aucun env Mapbox.
- Carte Mapbox commitée inutilisable dans Expo Go — état transitoire jusqu’à 0011D.
- Expo Go iPhone : tests compatibles possibles ; Google Maps **non affirmé**.
- FastAPI commun : ne pas dupliquer.
- JDK 17 non trouvé ; installation **non** présentée comme obligatoire ici.
- cmdline-tools absents ; AVD reporté à 0011E.

## Journal des tentatives

| # | Hypothèse | Action | Résultat |
|---|---|---|---|
| 1 | Sync + diagnostics | Lecture seule + rédaction | OK |
| 2 | Addendum Google Maps | Docs seules | OK |
| 3 | Revue CTO avant clôture | Reformulation décision/stratégie/roadmap/Java/ADB | OK |
| 4 | Clôture CTO | Statut terminé + commit local autorisé | OK |

## Résultats et preuves

Détail : `docs/engineering/android-device-readiness.md`.

- Sync OK ; Cursor OK ; espace > 12 Gio.
- Java 21.0.6 + JBR 21.0.8 disponibles ; `JAVA_HOME` absent ; JDK 17 non trouvé ;
  commande Temurin 21 proposée non exécutée ; choix JDK → 0011E.
- `adb devices -l` : daemon démarré, aucun appareil ; daemon non arrêté/redémarré
  dans cette correction.
- **Décision opérationnelle CTO** : **CONDITIONAL READY**.
- Contenu approuvé après corrections ; objectif de diagnostic atteint.
- Aucune configuration persistante, aucun AVD, aucun build réalisés.
- **Roadmap** : **0011D** migration carte → **0011E** session Java/Android + AVD
  API 35 + démarrage sans build → **0011F** premier dev build Android
  (0011E/0011F non lancés).

## Revue

- [x] Auto-vérification
- [ ] Revue indépendante (non réalisée)
- [x] Approbation CTO du contenu après corrections (conversation) — clôture
  autorisée : indexation des quatre fichiers + commit local uniquement

## Actions Git et installations autorisées

- **Commit** : oui (clôture locale, message imposé)
- **Push** : non
- **Merge** : non
- **Déploiement / publication** : non
- **Installation** : non

## Rapport final

- Fichiers : les quatre autorisés uniquement.
- Diagnostic approuvé ; **CONDITIONAL READY** ; aucune config persistante / AVD /
  build.
- Commit local de clôture autorisé ; aucun push/merge.
- **Prochaine action proposée** : **YUNIMOBILE-0011D** — migration Mapbox →
  Google Maps (proposition uniquement, non lancée).
