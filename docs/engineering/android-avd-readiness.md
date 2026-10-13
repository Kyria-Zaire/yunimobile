# Android AVD readiness — YUNIMOBILE-0011F-A

- **Ticket** : YUNIMOBILE-0011F-A
- **Date** : 2026-10-13 (Europe/Paris)
- **Branche** : `chore/yunimobile-0011f-a-android-avd`
- **Base** : `48d782425f408e94939382ee90bf9161ce2bc228`
- **Décision** : **BLOCKED** (clôture CTO)

## 1. Décision CTO

Diagnostic réalisé. Préparation Android **bloquée** par :

1. **absence de JDK 17** ;
2. **disponibilité mémoire insuffisante** (≈ 0,7–0,8 Gio libres observés).

Java **21** et **23** sont présents mais **non retenus** : aucun
contournement de la précondition JDK 17. Aucun AVD créé ; aucun runtime
Android exécuté.

## 2. Préconditions Git (preuve)

| Contrôle | Résultat |
|---|---|
| Branche | `chore/yunimobile-0011f-a-android-avd` |
| HEAD / origin/main au démarrage | `48d782425f408e94939382ee90bf9161ce2bc228` |
| Arbre initial | propre |
| Ticket actif avant démarrage | Aucun |

## 3. Baseline machine (lecture seule)

Mesures process d’audit ; **aucun** processus arrêté ; Android Studio
**non** démarré pendant l’inventaire. Pas de dump d’environnement.

### 3.1 Ressources

| Mesure | Valeur |
|---|---|
| Espace libre volume C | ≈ **14,64 Gio** — au-dessus du seuil historique 12 Gio |
| RAM libre / totale | ≈ **0,7–0,8 Gio** libres / ≈ **15,7 Gio** totales |
| `HypervisorPresent` | **True** |
| Hyper-V / WHPX | Non vérifiable sans élévation |

### 3.2 Processus observés (non modifiés)

| Processus | Observation |
|---|---|
| Android Studio (`studio64`) | absent |
| emulator / qemu | absents |
| adb | 1 processus (daemon, port 5037) — **non arrêté** |
| java / gradle | absents |

### 3.3 Variables (nom + SET/UNSET uniquement)

| Variable | État process |
|---|---|
| `JAVA_HOME` | UNSET |
| `ANDROID_HOME` | UNSET |
| `ANDROID_SDK_ROOT` | UNSET |
| `ANDROID_AVD_HOME` | UNSET |
| `GRADLE_HOME` | UNSET |

### 3.4 Outils Android

| Élément | Observation |
|---|---|
| Android Studio | Installé (build AI-252.25557.131.2521.14344949) |
| SDK | Présent (profil local `Android\Sdk`) |
| adb | Présent — 1.0.41 / platform-tools 36.0.0-13206524 |
| emulator | Présent — 36.2.12.0 |
| build-tools | 34.0.0, 35.0.0, 36.0.0, 36.1.0 |
| NDK | 27.1.12297006 |
| platforms | android-34, android-36 |
| cmdline-tools | **Absents** |
| avdmanager / sdkmanager | **Absents** |
| AVD | **Aucun** |
| `adb devices -l` | liste vide |

### 3.5 Images système

| Image | État |
|---|---|
| android-35 / google_apis_playstore / x86_64 | **Installée et complète** |
| android-36 / google_apis_playstore / x86_64 | Incomplète — non utilisée |

## 4. Prérequis Java

Consultation sources officielles **2026-10-13** : Expo (setup Windows +
EAS image sdk-57), React Native 0.86, AGP — **JDK 17** exigé ou
recommandé ; versions supérieures déconseillées (RN).

| Candidat local | Verdict CTO |
|---|---|
| Temurin 21.0.6 | Présent — **non retenu** |
| JBR Studio 21.0.8 | Présent — **non retenu** |
| Java 23.0.2 | Présent — **non retenu** |
| JDK 17 | **Absent** — bloque la préparation |

Aucune variable `JAVA_HOME` de session posée.

## 5. Prérequis AVD

| Prérequis | État |
|---|---|
| Image API 35 Play x86_64 | **OK** (sans téléchargement) |
| emulator + adb | **OK** |
| avdmanager / cmdline-tools | **Absents** — création CLI impossible |
| AVD `Yunicity_API_35` | **Non créé** |
| Device Manager GUI | Non sollicité (arrêt préalable) |

Reprise AVD : après JDK 17 **et** RAM suffisante ; CLI si avdmanager
disponible sans téléchargement non autorisé, sinon Device Manager
(image déjà installée uniquement).

## 6. Contrainte mémoire

RAM libre observée **≈ 0,7–0,8 Gio** sur ≈ 15,7 Gio totales.

**Verdict CTO** : insuffisante pour considérer l’émulateur **prêt**. La
reprise AVD / boot exige un retour à une disponibilité mémoire
suffisante, en plus du JDK 17.

## 7. Opérations non exécutées

- Installation de JDK 17 ou de cmdline-tools.
- Contournement via Java 21 / 23.
- Configuration persistante (`setx`, registre, profil).
- Création AVD ; cold boot ; attente `sys.boot_completed`.
- Preuve ADB device post-boot ; arrêt émulateur.
- Metro, Expo, Gradle, APK, Expo Go.
- Runtime Android Yunicity.
- Push ; création du fichier ticket **0011F-JDK17**.

## 8. Synthèse READY / BLOCKED

| Critère | Résultat |
|---|---|
| Java 17 compatible | **Échec** |
| Mémoire pour émulateur prêt | **Échec** (0,7–0,8 Gio libres) |
| Outils AVD (image + emulator + adb) | Image/outils OK ; avdmanager absent |
| AVD créé + boot + ADB device | Non exécuté |

**Statut** : préparation Android **bloquée**.

## 9. Suite proposée

1. **YUNIMOBILE-0011F-JDK17** — installer JDK 17 (**non lancé**).
2. Reprise AVD uniquement après JDK 17 **et** RAM libre suffisante.
3. **YUNIMOBILE-0011F-B** — premier runtime Android (réservé ; non commencé).

## 10. Git

Fichiers de ce ticket uniquement :

- `.loop/tickets/YUNIMOBILE-0011F-A.md`
- `docs/engineering/android-avd-readiness.md`
- `.loop/state.md`
