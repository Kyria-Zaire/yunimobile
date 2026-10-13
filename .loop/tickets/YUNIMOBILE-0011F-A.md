# YUNIMOBILE-0011F-A — Environnement Android et AVD API 35

- **Statut** : terminé — diagnostic réalisé ; préparation Android bloquée par
  l’absence de JDK 17 et une disponibilité mémoire insuffisante
- **Créé le** : 2026-10-13
- **Mis à jour le** : 2026-10-13 00:33 (Europe/Paris)
- **Branche** : `chore/yunimobile-0011f-a-android-avd`
- **Base** : `main` @ `48d782425f408e94939382ee90bf9161ce2bc228`
- **Rapport** : `docs/engineering/android-avd-readiness.md`

## Objectif

Valider la toolchain Android pour Expo SDK 57, configurer la session,
créer et démarrer l’AVD `Yunicity_API_35` (API 35, image déjà installée),
prouver la détection ADB — **sans** construire ni lancer Yunicity.

## Décision CTO (clôture)

- Blocage **JDK 17** accepté ; **ne pas** utiliser Java 21 ou 23 pour
  contourner la précondition.
- Absence d’**avdmanager** / cmdline-tools également consignées.
- Image **API 35** Google Play **x86_64** disponible et complète.
- RAM libre observée **0,7–0,8 Gio** : **insuffisante** pour considérer
  l’émulateur prêt.
- Aucun AVD créé ; aucun runtime Android exécuté.
- Préparation Android **bloquée** jusqu’à JDK 17 **et** retour à une RAM
  suffisante.

## Constat inventaire (synthèse)

| Élément | Résultat |
|---|---|
| JDK 17 | Absent |
| Java 21 / 23 | Présents — **non retenus** (CTO) |
| adb / emulator | Présents |
| cmdline-tools / avdmanager | Absents |
| AVD | Aucun |
| Image API 35 Play x86_64 | Installée / complète |
| RAM libre | ≈ 0,7–0,8 Gio (insuffisante pour émulateur prêt) |

## Périmètre

### Réalisé

- Préconditions Git ; branche ; ticket / rapport / state.
- Baseline machine lecture seule.
- Sources officielles Java (Expo, RN, AGP, EAS sdk-57).
- Clôture documentaire + commit local.

### Non exécuté

- Installation JDK 17 ou cmdline-tools.
- Variables de session persistantes ou process Java 21/23.
- Création / boot AVD ; Metro ; Expo ; Gradle ; APK.
- Arrêt de processus ; push.

## Critères d'acceptation

- [x] Diagnostic documenté (Java, AVD, mémoire).
- [x] Décision CTO : blocage accepté ; pas de contournement Java 21/23.
- [x] Aucun AVD créé ; aucun runtime Android.
- [x] Trois fichiers ; commit de clôture autorisé ; pas de push.
- [x] Ticket suivant **0011F-JDK17** proposé, **non créé**.

## Actions Git

- **Commit** : oui —
  `docs: diagnose Android emulator prerequisites` /
  `Ticket: YUNIMOBILE-0011F-A`
- **Push** : non
- **Installation** : non

## Prochaine action proposée

**YUNIMOBILE-0011F-JDK17** — installation JDK 17 (**non lancé** ; fichier
non créé). Reprise AVD / 0011F-A uniquement après JDK 17 **et** RAM libre
suffisante. **0011F-B** non commencé.
