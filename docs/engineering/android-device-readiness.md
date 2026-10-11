# Préparation Java/Android et stratégie d’appareil — YUNIMOBILE-0011C

Date : 2026-10-11 (Europe/Paris). Mis à jour : 2026-10-11 23:14 (Europe/Paris)
— clôture CTO. Contrôles : Cursor (propre session), lecture seule hors documents
autorisés du ticket. Aucune installation, aucun build, aucune variable persistante
modifiée, aucun AVD créé, aucun émulateur ni Android Studio démarré.

## Décision

**CONDITIONAL READY** (décision opérationnelle CTO à la clôture) pour la
préparation Java/Android/appareil. Ticket **terminé** pour l’objectif de
diagnostic ; préparation native **conditionnelle**. Aucune configuration
persistante, aucun AVD et aucun build n’ont été réalisés.

Conditions restantes avant READY :

1. **Fournisseur cartographique à migrer** (Mapbox hérité → Google Maps, 0011D) ;
2. **Variables de session à préparer** (`JAVA_HOME`, `ANDROID_HOME` /
   `ANDROID_SDK_ROOT`, 0011E) ;
3. **Cible Android à créer ou connecter** (AVD API 35 ou appareil physique, 0011E ;
   premier dev build en 0011F).

Pas de téléphone Android physique détecté. Build iOS local impossible sur Windows.

### Décision cartographique définitive (CTO)

- **Google Maps** est le fournisseur cartographique **définitif** de Yunicity sur
  le **Web** et sur **Mobile**.
- `@rnmapbox/maps` est une **dépendance héritée** de l’ancienne base mobile
  (`apps/mobile/package.json`), non une décision d’architecture validée.
- **Aucun** token, build ou environnement Mapbox ne sera configuré.
- L’application actuellement commitée **ne peut pas** utiliser sa carte Mapbox
  dans Expo Go ; cet état est **destiné à disparaître** avec la migration 0011D.
- La compatibilité de la **future** implémentation Google Maps avec Expo Go sur
  l’iPhone de Kyria **reste à prouver** ; elle n’est **pas affirmée** ici.
- Le backend **FastAPI** et ses API d’événements géolocalisés restent **communs**
  et **ne doivent pas être dupliqués**.

Dans 0011C : aucun token/build Mapbox, aucun fichier applicatif modifié pour la
carte, aucune migration réalisée.

### Stratégie d’appareil

| Point | Verdict |
|---|---|
| Cible **probable** du premier **dev build** | Émulateur Android local utilisant l’image **API 35** déjà présente |
| Création de l’AVD | **Reportée après** la migration Google Maps (0011E, pas 0011C/0011D) |
| iPhone + Expo Go | Disponible pour les **tests compatibles** ; Google Maps Expo Go **non prouvé** |
| Dev build iOS / EAS | Ticket **séparé**, plus tard |
| Téléphone Android physique | **Aucun** détecté (`adb devices -l`) |

Ce n’est **pas** une recommandation d’agir immédiatement sur l’émulateur : la
création AVD et le démarrage sont hors 0011C et hors 0011D.

## État Git

| Contrôle | Résultat |
|---|---|
| Arbre avant sync | propre (branche locale 0011B) |
| `git switch main` + `git pull --ff-only origin main` | fast-forward `3ae8bdb` → `e62d4f7` |
| `HEAD` | `e62d4f7bed657e7933efae641f25175a09f0facc` |
| `origin/main` | identique |
| Merge PR #3 | message `Merge pull request #3 from …/chore/yunimobile-0011b-disk-cleanup` |
| Parents | `3ae8bdbb970b0f4e0df796a6864e405a05ba0241`, `edebeccfcc732604ae53255051786471ed1812a4` |
| Branche de travail | `chore/yunimobile-0011c-android-readiness` |

## Espace disque

Mesures `DriveInfo.AvailableFreeSpace` sur `C:` ; 1 Gio = 1 073 741 824 octets.

| Moment | Horodatage local | Octets libres | Gio |
|---|---|---:|---:|
| Avant diagnostics | 2026-10-11 22:39:02 | 15 717 044 224 | 14,638 |
| Après inventaire SDK / ADB | 2026-10-11 22:40:33 | 15 705 022 464 | 14,626 |
| Fin de passe diagnostic | 2026-10-11 22:41:03 | 15 702 847 488 | 14,624 |

Seuil ticket : **> 12 Gio** — respecté. Aucune suppression effectuée.

## Java — lecture seule

- **Java 21.0.6** (Temurin sur PATH) et **JBR 21.0.8** (Android Studio) sont
  **disponibles**.
- **`JAVA_HOME` est absent** (UNSET) ; aucune variable système ou utilisateur
  modifiée.
- **Aucun JDK 17** n’a été trouvé sous les racines inspectées (Adoptium, Java,
  `.jdks`, `Local\Programs`). Absence globale non démontrée (pas de recherche
  disque exhaustive).
- **Ne pas** présenter l’installation de JDK 17 comme **obligatoire** tant que la
  future chaîne Gradle/Expo **générée** n’a pas démontré cette exigence. Les
  mentions `jvmToolchain(17)` de l’audit 0011A restent une preuve documentaire
  antérieure sur sources alors installées ; `node_modules` absents ici — non relu.
- La commande session `JAVA_HOME` vers Temurin 21 reste une **proposition non
  exécutée**.
- Le **choix définitif du JDK** est reporté au ticket qui prépare réellement la
  chaîne native (**0011E**).

Autres JDK observés (hors décision) : Oracle/OpenJDK **23.0.2** sous
`C:\Program Files\Java\jdk-23` et `C:\Users\kyria\.jdks\openjdk-23.0.2`.

### Commande PowerShell proposée (non exécutée)

```powershell
$env:JAVA_HOME = 'C:\Program Files\Eclipse Adoptium\jdk-21.0.6.7-hotspot'
$env:Path = "$env:JAVA_HOME\bin;" + $env:Path
```

Ne pas la persister tant qu’un ticket ne l’autorise pas.

## Android — lecture seule

### Variables

| Variable | Présence |
|---|---|
| `ANDROID_HOME` | UNSET |
| `ANDROID_SDK_ROOT` | UNSET |

SDK constaté : `C:\Users\kyria\AppData\Local\Android\Sdk`.

Commande session future (non exécutée) :

```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
$env:Path = "$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;" + $env:Path
```

### Outils et composants

| Outil | Observation |
|---|---|
| `adb` | PATH : platform-tools **36.0.0** (`adb` 1.0.41) |
| `sdkmanager` / `avdmanager` | Absents du PATH et du SDK (recherche récursive) |
| `emulator` | Binaire présent **36.2.12.0** ; hors PATH ; `-list-avds` vide |
| `C:\Users\kyria\.android\avd` | Absent |

- Plateformes : `android-34` (rév. 3), `android-36` (rév. 2).
- build-tools : 34.0.0, 35.0.0, 36.0.0, 36.1.0.
- NDK : **27.1.12297006** (r27b).
- Image **API 35** `google_apis_playstore` x86_64 rév. 9 : **complète**.
- Image API 36 : incomplète (dossier `.installer` seulement).

### ADB

`adb devices -l` a **démarré le daemon** (`tcp:5037`, « daemon started
successfully ») et **n’a détecté aucun appareil**. Processus `adb` ensuite
observé (pid 181060 au moment du diagnostic). Daemon **non arrêté ni redémarré**
lors des corrections documentaires. Rien installé sur un appareil.

## Roadmap proposée

| Ticket | Contenu | Statut |
|---|---|---|
| **YUNIMOBILE-0011D** | Migration cartographique mobile Mapbox → Google Maps | Prochain — non lancé |
| **YUNIMOBILE-0011E** | Session Java/Android ; création contrôlée AVD API 35 sans téléchargement ; vérification de démarrage ; **sans** build applicatif | Après 0011D — non lancé |
| **YUNIMOBILE-0011F** | Premier dev build Android et lancement réel | Après 0011E — non lancé |

### Périmètre prévu pour 0011D (non réalisé ici)

1. Auditer la solution Google Maps adaptée à Expo SDK 54.
2. Identifier les clés et restrictions distinctes Android / iOS.
3. Remplacer `@rnmapbox/maps` dans le code de la carte.
4. Supprimer le plugin `@rnmapbox/maps` de `app.json`.
5. Supprimer la dépendance `@rnmapbox/maps`.
6. Supprimer les variables `EXPO_PUBLIC_MAPBOX_*`.
7. Reproduire : centrage Reims ; zoom/déplacement ; zone visible ; marqueurs ;
   sélection/désélection ; fiche événement ; recentrage.
8. Typecheck, lint, Expo Doctor, compatibilité Expo.
9. Ne pas toucher au backend FastAPI ni dupliquer sa logique.

## Limites

- Auto-vérification documentaire ; pas de revue indépendante de clôture.
- `node_modules` absents ; exigences Gradle générées non démontrées ici.
- Hyperviseur / WHP non ré-audités (voir 0011A).
- Aucune preuve de compilation, prebuild ou lancement runtime.
- Aucune migration Google Maps ni retrait Mapbox applicatif dans 0011C.
