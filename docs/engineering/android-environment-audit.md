# Audit de préparation Android — YUNIMOBILE-0011A

Date : 2026-10-02 (Europe/Paris). Auteur des contrôles : Codex.

## Décision

**BLOCKED pour le premier dev build Android dans l'état audité.** Le SDK requis
est déjà largement présent, mais l'espace libre est très inférieur aux 12 Gio
opérationnels recommandés. Aucun appareil utilisable n'est prouvé et aucun AVD
n'est configuré. La résolution de la toolchain Java 17 et la configuration
publique de démarrage restent à préparer. Ce constat ne remet pas en cause les
preuves statiques et l'export Metro du ticket 0010 ; aucun build natif n'est prouvé.

## Périmètre, provenance et état Git

Ticket enregistré avant les diagnostics. Contrôles propres en lecture seule,
sur `main`, HEAD et `origin/main` à
`ec65162044cbfb5b9dea21beba31666a49b6c8cd`, arbre initial propre.
Seuls le ticket, ce rapport et `.loop/state.md` sont modifiés par l'audit.
Les succès applicatifs antérieurs restent des preuves antérieures, sans
réexécution dans ce ticket. Aucun téléchargement réseau ni consultation web.

Commandes effectivement exécutées : versions Node, pnpm, Java/javac, `adb version`,
`emulator -version`, `emulator -list-avds`, lectures de métadonnées SDK et de
sources installées, diagnostics Windows ciblés, inventaires de tailles sans suivi
de points de reparse. Aucun `.env` réel, credential ou contenu de cache sensible lu.

## Espace initial

Trois mesures `DriveInfo.AvailableFreeSpace`, en octets ; 1 Gio = 1 073 741 824 octets.

| Heure Europe/Paris | Octets libres | Gio libres |
|---|---:|---:|
| 16:05:12 | 2 828 910 592 | 2,635 |
| 16:05:40 | 2 825 330 688 | 2,631 |
| 16:06:02 | 2 824 216 576 | 2,630 |

Intervalle total : environ 50 secondes. Les variations du disque ne sont pas
attribuées à cet audit. Aucune suppression effectuée.

## Environnement disponible

| Élément | Observation propre | Portée / manque |
|---|---|---|
| Windows | Windows 11 Famille, 25H2, version 10.0.26200, build 26200.9457, x64 | `Win32_OperatingSystem` confirme Windows 11 ; le libellé historique `ProductName` du registre dit Windows 10 |
| Node | `node --version` : v24.18.1 | Chemin trouvé : `C:\nvm4w\nodejs\node.exe` |
| pnpm | `pnpm --version` : 9.15.9 | Conforme au `packageManager` du dépôt |
| Java / javac | Temurin 21.0.6 / javac 21.0.6 | JDK présent : `C:\Program Files\Eclipse Adoptium\jdk-21.0.6.7-hotspot` |
| Autres JDK | Java 23.0.2 sous `C:\Program Files\Java\jdk-23` et `C:\Users\kyria\.jdks\openjdk-23.0.2` ; JBR 21.0.8 embarqué dans Studio | Aucun JDK 17 identifié dans les emplacements inspectés ; absence globale non démontrée |
| Android Studio | `C:\Program Files\Android\Android Studio` ; build AI-252.25557.131.2521.14344949 | `product-info.json` et `build.txt` lus ; application non démarrée |
| SDK Android | `C:\Users\kyria\AppData\Local\Android\Sdk` | Présent, hors PATH pour plusieurs outils |
| adb | 1.0.41, platform-tools 36.0.0-13206524 | Exécutable présent sur PATH |
| sdkmanager / avdmanager | Absents du PATH et des dossiers SDK `cmdline-tools` / `tools` inspectés | Command-line tools non identifiés ; aucune installation lancée |
| emulator | 36.2.12.0, build 14214601 | Exécutable SDK présent, absent du PATH ; seule version et liste d'AVD exécutées |
| Gradle global | Non trouvé sur PATH ; `GRADLE_HOME` UNSET | Non indispensable à la stratégie wrapper ; aucune commande Gradle exécutée |
| Gradle wrapper attendu | 8.14.3, selon `node_modules/expo/template.tgz` | Archive lue sans extraction ; wrapper natif pas encore généré |

Variables inspectées individuellement, sans dump d'environnement :

| Variable | Présence | Chemin non sensible normalisé |
|---|---|---|
| `JAVA_HOME` | UNSET | — |
| `ANDROID_HOME` | UNSET | — |
| `ANDROID_SDK_ROOT` | UNSET | — |
| `GRADLE_HOME`, `GRADLE_USER_HOME` | UNSET | — |
| `ANDROID_AVD_HOME`, `ANDROID_USER_HOME`, `ANDROID_EMULATOR_HOME` | UNSET | — |
| `PNPM_HOME` | SET | `C:\Users\kyria\AppData\Local\pnpm` |
| `NPM_CONFIG_CACHE` | UNSET | Cache local trouvé par inventaire, configuration effective non interrogée |
| `TEMP` | SET | `C:\Users\kyria\AppData\Local\Temp` |

Les noms `RNMAPBOX_MAPS_DOWNLOAD_TOKEN`, `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN`,
`EXPO_PUBLIC_MAPBOX_TOKEN` et `EXPO_PUBLIC_API_URL` sont tous UNSET dans le processus
d'audit. Cela ne prouve pas l'absence de configuration dans un fichier `.env`,
qui n'a pas été ouvert, ni dans un autre processus.

### SDK, images et cible Android

Installés, d'après noms de dossiers et `source.properties` :

- plateformes `android-34` (révision 3) et `android-36` (révision 2) ;
- build-tools 34.0.0, 35.0.0, 36.0.0 et 36.1.0 ;
- platform-tools 36.0.0 ; NDK 27.1.12297006 ; CMake présent (version non auditée) ;
- image API 35 Google Play x86_64, révision 9 ; arborescence API 36 présente,
  mais aucune image API 36 complète démontrée par `source.properties`.

Les révisions des quatre build-tools sont confirmées par `source.properties` ;
`aapt2.exe` et `d8.bat` sont présents pour chacune. `platforms/android-36/android.jar`
et le clang Windows du NDK 27.1.12297006 sont présents. Cela ne prouve pas encore
une résolution ou compilation complète de l'application.

`emulator -list-avds` : exit 0, sortie vide. Le dossier par défaut
`C:\Users\kyria\.android\avd` n'existe pas. Aucun AVD actuellement utilisable prouvé.
Ne pas confondre image système installée et émulateur configuré.

`adb devices -l` **non exécuté** : aucun processus serveur ADB ni écoute locale 5037
observé. La commande démarrerait normalement le serveur, incompatible avec
la contrainte de diagnostic sans écriture. Aucun appareil Android connecté,
autorisé et utilisable n'est donc démontré ; absence d'appareil non affirmée.

### Hyperviseur et virtualisation

`Get-CimInstance Win32_ComputerSystem` : `HypervisorPresent=true`.
`Win32_Processor` : `VirtualizationFirmwareEnabled=true`,
`VMMonitorModeExtensions=false`, `SecondLevelAddressTranslationExtensions=false`.
L'API Windows `IsProcessorFeaturePresent(21)` confirme le firmware virtualisé ;
PF20 est false. Ces valeurs sous hyperviseur ne prouvent pas l'absence matérielle
de SLAT ; l'accélération effective de l'émulateur reste non vérifiée.

États Hyper-V (`Microsoft-Hyper-V-All`), Virtual Machine Platform et Windows
Hypervisor Platform : **non vérifiés**, car `Get-WindowsOptionalFeature -Online`
nécessite une élévation administrateur. Les lectures CIM ont été permises hors
confinement ; aucun lancement administrateur, activation ou changement Windows.
Ne pas déduire l'état de chacune des fonctionnalités de `HypervisorPresent`.

## Configuration mobile et exigences démontrées

Sources examinées : `apps/mobile/app.json`, `apps/mobile/package.json`,
`apps/mobile/.env.example`, sources API/carte, packages installés et template Expo.

- Expo 54.0.37, React Native 0.81.5, React 19.1.0 ; nouvelle architecture activée.
- Identifiant Android : `com.yunicity.mobile`. Plugins : Mapbox, Router, Camera,
  Font et Notifications. SecureStore, Reanimated et autres dépendances natives
  sont présents. Aucun dossier `apps/mobile/android` ni package `expo-dev-client`
  installé identifié.
- Mapbox installé : `@rnmapbox/maps` 10.3.5. Son guide local
  `plugin/install.md` dit explicitement que Expo Go n'est pas compatible.
  Un binaire natif de développement est obligatoire. Décider dans le futur ticket
  entre un debug natif simple et l'ajout autorisé d'`expo-dev-client` ; l'audit
  n'autorise aucune nouvelle dépendance.
- Valeurs Android attendues des sources RN installées
  (`node_modules/react-native/gradle/libs.versions.toml`) : minSdk 24,
  compileSdk/targetSdk 36, build-tools 36.0.0, NDK 27.1.12297006, AGP 8.11.0.
  Expo Modules a les mêmes valeurs par défaut pour min/compile/target.
  Il s'agit d'attentes démontrées dans les sources, pas d'un projet Android
  généré ou d'un manifest final vérifié.
- Le plugin Gradle RN configure `jvmToolchain(17)` dans ses sources Kotlin.
  Java 21 disponible ne prouve pas la résolution de cette toolchain ; identifier
  un JDK 17 utilisable ou autoriser son provisionnement dans le futur ticket,
  sans téléchargement implicite pendant cet audit.

### Mapbox : build et runtime séparés

La version native Android par défaut est 11.23.1, selon le `package.json` installé.
Avec targetSdk >=35, le Gradle Mapbox choisit `com.mapbox.maps:android-ndk27`.
Le plugin Android ajoute le dépôt Maven Mapbox et ne configure l'authentification
que si un token est présent ; sa source indique que le token de téléchargement
n'est plus requis pour cette configuration. **Ne pas prescrire un secret de
téléchargement comme prérequis démontré du build Android actuel.** La disponibilité
réseau et la résolution Maven restent non testées. Si un futur diagnostic établit
le besoin d'un secret, le fournir hors bundle et hors fichier versionné.

Runtime : la carte utilise `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN`, avec repli sur
`EXPO_PUBLIC_MAPBOX_TOKEN`, puis `Mapbox.setAccessToken`. Un token public destiné
au client est nécessaire pour afficher la carte ; aucune valeur n'est lue ici.
L'absence de token déclenche un état de carte indisponible, pas une preuve d'échec
de compilation. Aucun token privé dans `EXPO_PUBLIC_*`, app.json ou bundle.

### Premier démarrage

`EXPO_PUBLIC_API_URL` doit viser le backend FastAPI existant et accessible depuis
la cible Android. Le gabarit utilise `http://localhost:8000`, tandis que le repli
du code est `http://127.0.0.1:8010` : port et endpoint doivent être décidés avant
le test réel. Le localhost Android n'est pas celui de Windows ; prévoir l'accès
adapté à un appareil USB/réseau ou à un émulateur. Aucun backend dupliqué ici.
Les permissions caméra, la connexion API/authentification, Mapbox et les
notifications nécessitent une vérification runtime ultérieure. `expo-notifications`
peut appeler `getExpoPushTokenAsync` ; aucun projectId Expo n'est configuré dans
app.json. Le besoin de push au premier smoke test reste une décision, pas une
raison démontrée de bloquer la compilation.

## Méthode de mesure disque

Inventaire récursif des métadonnées uniquement, `os.stat(..., follow_symlinks=False)`
et contrôle des attributs Windows REPARSE_POINT, y compris les ancêtres des cibles.
Les liens/jonctions sont comptés et ignorés. Un accès refusé donne une mesure
incomplète, jamais une preuve de dossier vide.

La taille apparente est la somme des longueurs des fichiers accessibles ; elle
n'est pas une mesure de blocs NTFS alloués. Les identités `(st_dev, st_ino)` et
`st_nlink` ont été contrôlées par `os.stat` direct. Une première passe `DirEntry.stat`
ne fournissait pas ces identités sur Windows ; ses chiffres de liens physiques
ont été écartés et seuls les résultats de la seconde passe sont retenus ci-dessous.
La taille des fichiers sans lien physique multiple est un gain plausible, sans
garantie de place effectivement libérée (compression, clusters, ACL, processus).
Les fichiers partagés ne sont pas comptés comme gain sûr et les chemins imbriqués
ne sont pas additionnés deux fois.

### Inventaire principal (métadonnées, sans suivi de liens)

| Chemin exact | Taille apparente, octets | Gio | Octets à liens physiques multiples | Limite |
|---|---:|---:|---:|---|
| `C:\tmp\yunimobile-0007-diag` | 963 738 731 | 0,898 | 0 | 4 points de reparse exclus |
| `C:\tmp\yunimobile-0009-extract` | 370 722 030 | 0,345 | 327 371 188 | 4 points de reparse exclus |
| `C:\tmp\yunimobile-0010b-dist-android` | 6 448 632 | 0,006 | 0 | Mesure complète des fichiers accessibles |
| `C:\tmp\yunimobile-0009a` | 19 727 | 0,000 | 0 | Mesure complète des fichiers accessibles |
| `C:\tmp\yunimobile-0010-logs` | 308 919 | 0,000 | 0 | Mesure complète des fichiers accessibles |
| `C:\tmp\yunimobile-0010b-logs` | 942 921 | 0,001 | 0 | Mesure complète des fichiers accessibles |
| `C:\Users\kyria\.gradle` | 0 | 0,000 | 0 | Absent |
| `C:\Users\kyria\AppData\Local\Android\Sdk` | 6 847 647 018 | 6,377 | 0 | Mesure complète des fichiers accessibles |
| `C:\Users\kyria\.android\avd` | 0 | 0,000 | 0 | Absent |
| `C:\Users\kyria\AppData\Local\Android\Sdk\system-images` | 2 266 184 157 | 2,111 | 0 | Mesure complète des fichiers accessibles |
| `C:\Users\kyria\AppData\Roaming\Code\CachedExtensionVSIXs` | 3 174 703 614 | 2,957 | 0 | Mesure complète des fichiers accessibles |
| `C:\Users\kyria\AppData\Local\npm-cache` | 1 311 491 112 | 1,221 | 0 | Mesure complète des fichiers accessibles |
| `C:\Users\kyria\AppData\Local\pnpm\store` | 9 211 105 593 | 8,579 | 3 184 735 588 | Mesure complète des fichiers accessibles |
| `C:\Users\kyria\AppData\Roaming\npm-cache` | 0 | 0,000 | 0 | Absent |
| `C:\Users\kyria\AppData\Local\Gradle` | 0 | 0,000 | 0 | Absent |

La copie 0009 compte 40 976 fichiers à liens multiples ; sa somme d'identités
uniques est de 351 104 161 octets, et seulement 43 350 842 octets n'ont pas de
lien multiple. Le store pnpm compte 142 532 fichiers à liens multiples,
3 184 735 588 octets partagés et 6 026 370 005 octets non partagés.
Le store actif du dépôt, d'après `node_modules/.modules.yaml`, est
`C:\Users\kyria\AppData\Local\pnpm\store\v3` ; le parent mesuré contient aussi v10 et v11.
La mesure globale ne justifie pas la suppression arbitraire de ces versions.

SDK et `system-images` sont imbriqués : ne pas additionner leurs tailles.
Cache Gradle par défaut absent ; un cache à un emplacement personnalisé non
configuré n'est pas exclu globalement. Android Studio : 3 306 769 162 octets
apparents (~3,080 Gio), conservé ; cette mesure ne quantifie pas les liens physiques.

`TEMP\\pip-unpack-*` : 933 enfants directs trouvés, 933 accès refusés à la racine,
0 fichier mesurable. **Taille totale inconnue**, et non zéro ; gain estimé nul
pour le plan faute de mesure exploitable. Exemple d'accès refusé :
`C:\Users\kyria\AppData\Local\Temp\pip-unpack-0ah3hcuu`.

### Résidus cachés de VS Code, inventaire seulement

| Chemin exact non actif | Octets apparents | Gio |
|---|---:|---:|
| `C:\Users\kyria\.vscode\extensions\.00bec70c-3400-48c9-b46f-026cf7d9b212` | 21 565 528 | 0,020 |
| `C:\Users\kyria\.vscode\extensions\.02470642-7d53-4d29-8daa-ff11cede4834` | 9 822 972 | 0,009 |
| `C:\Users\kyria\.vscode\extensions\.39a100e9-a05f-4f14-903e-60b5c5fc2782` | 11 238 079 | 0,010 |
| `C:\Users\kyria\.vscode\extensions\.56e40983-18b5-4faa-832c-afa24d99d44a` | 6 815 305 | 0,006 |
| `C:\Users\kyria\.vscode\extensions\.8a638f7b-a634-452a-ada1-e1c11e381b28` | 22 332 533 | 0,021 |
| `C:\Users\kyria\.vscode\extensions\.902d456e-c801-45a1-9268-e29b011ed5ca` | 4 134 323 | 0,004 |
| `C:\Users\kyria\.vscode\extensions\.98de868b-e740-46c1-8234-adce4f1c8db6` | 37 793 689 | 0,035 |
| `C:\Users\kyria\.vscode\extensions\.b0890224-9589-4793-b23f-2db58d9202e3` | 24 790 503 | 0,023 |
| `C:\Users\kyria\.vscode\extensions\.d2061fe9-0d7e-47f3-baef-af202494c11b` | 13 154 039 | 0,012 |
| `C:\Users\kyria\.vscode\extensions\.e673b914-8b69-4232-ba40-4f36a8935348` | 26 866 630 | 0,025 |
| `C:\Users\kyria\.vscode\extensions\.fe8f2cc6-96cf-41ad-9e7e-5c162c5cf9cc` | 26 494 128 | 0,025 |

Total des 11 dossiers cachés : 205 007 729 octets (~0,191 Gio), aucun lien
physique multiple détecté. Aucun gain intégré au scénario proposé.

## Plan d'espace soumis au CTO, aucune suppression autorisée ici

Objectifs : **12 Gio opérationnels**, **20 Gio confortables**, mesurés à nouveau
avant toute future génération native. Le premier build devra créer un wrapper,
télécharger/résoudre des dépendances Maven et produire des intermédiaires natifs :
prévoir environ 6–10 Gio supplémentaires pour la stratégie appareil physique,
et environ 3–6 Gio supplémentaires pour un AVD et ses données. Ce sont des
estimations de planification, pas des téléchargements ou allocations mesurés.
Le SDK et l'image existants sont déjà comptés dans l'espace occupé et ne doivent
pas être téléchargés à nouveau sans besoin établi.

### 1. Éléments temporaires du projet

Caches de la référence 0009, à retirer uniquement après autorisation future :

| Chemin exact | Taille apparente mesurée | Gain indicatif |
|---|---:|---:|
| `C:\tmp\yunimobile-0009-extract\.tmp-metro` | 37 393 680 octets | ~0,035 Gio, sous réserve de liens physiques |
| `C:\tmp\yunimobile-0009-extract\.npm-cache-doctor` | 2 686 698 octets | ~0,003 Gio, sous réserve de liens physiques |

Conserver le code, le lockfile et les journaux de 0009. La copie 0007 est mesurée
pour l'inventaire mais exclue du plan de suppression : son nettoyage a été
abandonné explicitement après les refus d'accès. Aucun changement d'ACL proposé.
Le bundle 0010b (6 448 632 octets) est une preuve antérieure utile : conserver
jusqu'à décision d'archivage/remplacement, sans compter son gain dans le plan.

### 2. Caches régénérables et anciennes extensions

Fermer les applications et installations concernées avant un futur nettoyage.
Les gains ne valent pas autorisation de supprimer. Le store pnpm est partagé
entre projets ; préférer une stratégie de maintenance ciblée à une suppression
aveugle. Les sources et lockfiles restent intacts ; retrouver un cache perdu
pourra exiger de futurs téléchargements explicitement autorisés.

Ordre recommandé après autorisation explicite future :

1. Anciennes versions d'extensions listées ci-dessous, après fermeture de VS Code
   et des agents : 4 229 876 389 octets (~3,939 Gio), aucun lien physique multiple détecté.
2. `C:\Users\kyria\AppData\Roaming\Code\CachedExtensionVSIXs` :
   3 174 703 614 octets (~2,957 Gio), cache d'archives régénérable.
3. `C:\Users\kyria\AppData\Local\npm-cache` : 1 311 491 112 octets
   (~1,221 Gio), comprenant `_cacache` et `_npx` ; pas de double comptage.
4. Maintenance ciblée du store `C:\Users\kyria\AppData\Local\pnpm\store`
   (v3 actif) : gain potentiel prudent jusqu'à 6 026 370 005 octets (~5,612 Gio)
   non liés, à confirmer par maintenance pnpm appropriée et après fermeture
   des processus concernés. Ne pas proposer de supprimer les 8,579 Gio apparents
   comme s'ils étaient intégralement récupérables. Une purge peut exiger de
   retélécharger des paquets plus tard ; aucune commande de purge exécutée ici.

| Ancienne extension : chemin exact proposé | Octets mesurés / gain indicatif | Gio |
|---|---:|---:|
| `C:\Users\kyria\.vscode\extensions\openai.chatgpt-26.928.31416-win32-x64` | 1 415 971 344 | 1,319 |
| `C:\Users\kyria\.vscode\extensions\openai.chatgpt-26.917.62051-win32-x64` | 1 183 666 437 | 1,102 |
| `C:\Users\kyria\.vscode\extensions\ms-mssql.mssql-1.45.1` | 329 579 623 | 0,307 |
| `C:\Users\kyria\.vscode\extensions\anthropic.claude-code-2.1.284-win32-x64` | 257 658 386 | 0,240 |
| `C:\Users\kyria\.vscode\extensions\anthropic.claude-code-2.1.286-win32-x64` | 256 660 402 | 0,239 |
| `C:\Users\kyria\.vscode\extensions\anthropic.claude-code-2.1.283-win32-x64` | 256 055 671 | 0,238 |
| `C:\Users\kyria\.vscode\extensions\anthropic.claude-code-2.1.285-win32-x64` | 255 244 061 | 0,238 |
| `C:\Users\kyria\.vscode\extensions\sixth.sixth-ai-0.3.3` | 72 383 732 | 0,067 |
| `C:\Users\kyria\.vscode\extensions\sixth.sixth-ai-0.3.2` | 68 322 070 | 0,064 |
| `C:\Users\kyria\.vscode\extensions\saoudrizwan.claude-dev-4.1.21` | 36 582 920 | 0,034 |
| `C:\Users\kyria\.vscode\extensions\ms-python.python-2026.4.0-win32-x64` | 32 229 654 | 0,030 |
| `C:\Users\kyria\.vscode\extensions\ms-mssql.sql-database-projects-vscode-1.7.0` | 30 848 030 | 0,029 |
| `C:\Users\kyria\.vscode\extensions\dart-code.dart-code-3.142.0` | 15 641 122 | 0,015 |
| `C:\Users\kyria\.vscode\extensions\rangav.vscode-thunder-client-2.41.4` | 7 007 765 | 0,007 |
| `C:\Users\kyria\.vscode\extensions\openai.codex-audio-26.917.62051` | 4 601 909 | 0,004 |
| `C:\Users\kyria\.vscode\extensions\openai.codex-audio-26.928.31416` | 4 601 909 | 0,004 |
| `C:\Users\kyria\.vscode\extensions\ms-mssql.data-workspace-vscode-0.6.3` | 2 793 029 | 0,003 |
| `C:\Users\kyria\.vscode\extensions\dart-code.flutter-3.142.0` | 28 325 | 0,000 |

Scénario sans double comptage, base initiale conservatrice de 2,630 Gio :
anciennes extensions + VSIX + npm donnent environ **10,748 Gio libres**.
Il manquerait encore **1,252 Gio** pour le minimum de 12 Gio ; le store pnpm
est donc le levier à arbitrer, avec gain réel à mesurer. Si tout le potentiel
non partagé des quatre postes était libéré, résultat indicatif : **16,360 Gio**,
suffisant pour l'objectif opérationnel mais inférieur à la cible de 20 Gio.
Les gains ne sont pas garantis ; le plan mesuré ne démontre pas l'atteinte de 20 Gio.
Ne pas compenser en supprimant le SDK, les images utiles, les sources ou les preuves.

Autres mesures informatives : `_cacache` 1 052 052 127 octets ; `_npx`
259 428 232 octets. Ces sous-dossiers sont déjà inclus dans npm-cache et ne
constituent pas des gains supplémentaires. `SDK\\.downloadIntermediates`
69 069 132 octets, `SDK\\platform-tools.backup` 14 512 352 octets, `SDK\\.temp`
0 octet : aucune suppression proposée pour préserver l'installation Android
existante et éviter une récupération marginale avant sa validation.

Les versions anciennes sont aussi marquées dans `.vscode/extensions/.obsolete`
et exclues des emplacements actifs de `extensions.json` ; les versions actives
doivent être conservées. Fermer VS Code et les sessions d'agents avant une future
suppression : le marqueur ne prouve pas qu'aucun processus ne les utilise encore.
Les dossiers cachés non enregistrés sous `.vscode/extensions` peuvent être des
résidus d'installation ; leur absence d'`extensions.json` ne suffit pas à prouver
qu'un processus n'en dépend pas. Leur gain n'est pas intégré au scénario prioritaire.
Les 933 dossiers enfants directs `pip-unpack-*` ont été énumérés ; les refus
d'accès seront signalés dans le bilan d'inventaire. Aucun chemin non mesuré
complètement n'est proposé à la suppression, aucun glob de suppression proposé.

### 3. Éléments à conserver

- `C:\Users\kyria\yunimobile\node_modules` : dépendances de l'application active ;
- `C:\tmp\yunimobile-0007-diag` : nettoyage abandonné, code/lockfiles/journaux conservés ;
- `C:\tmp\yunimobile-0009-extract` : code/lockfile et référence, hors deux caches identifiés ;
- `C:\tmp\yunimobile-0009a` : traces de correspondance et contrôle de l'historique ;
- `C:\tmp\yunimobile-0010-logs`, `C:\tmp\yunimobile-0010b-logs` et bundle 0010b : preuves ;
- `C:\Users\kyria\AppData\Local\Android\Sdk` : conserver plateformes, build-tools,
  NDK, platform-tools, emulator et image API 35 pour réutiliser l'installation ;
- `C:\Program Files\Android\Android Studio`, JDK existants, extensions actives,
  références Git de récupération, autres dépôts, Docker/WSL et autres dossiers Temp.

## Prochain ticket proposé

**YUNIMOBILE-0011B — Libération d'espace et validation de la cible Android**, après
revue CTO : autoriser une liste exacte issue du plan, fermer les applications,
mesurer le gain réel, atteindre 12 Gio (20 souhaités), choisir un appareil physique
ou autoriser un AVD, établir la toolchain Java 17 et les chemins SDK. Le premier
build ne vient qu'après ces gates et une autorisation distincte de génération,
téléchargements éventuels et installation sur la cible.

Commandes candidates, **non exécutées**, à valider dans le futur ticket :

```powershell
# Après autorisation de serveur ADB et choix de cible
adb devices -l
# Après décision de génération native et configuration Java/SDK
pnpm --filter mobile exec expo prebuild --platform android --no-install
pnpm --filter mobile exec expo run:android --device --no-install --no-bundler
# Metro et smoke test ne sont autorisés qu'au ticket de lancement
pnpm --filter mobile run start
```

Les options ont été vérifiées dans les sources locales Expo CLI. `--no-install`
évite l'installation npm, pas les résolutions Maven ni l'installation de l'APK
effectuée par `run:android`. Aucun Gradle global requis dans cette stratégie.

## Vérification documentaire finale

Auto-vérification documentaire propre : cohérence des valeurs avec les sorties,
distinction constat/hypothèse/non exécuté, gains sans double comptage, 18 anciennes
extensions et 11 résidus cachés séparés des versions actives, refus d'accès documentés.
Les états Windows nécessitant une élévation et la liste ADB restent explicitement
non vérifiés. Les deux nouveaux documents sont contrôlés séparément pour l'UTF-8,
LF, newline finale et les espaces terminaux, car ils ne sont pas indexés.

`git diff --check` : exit 0, aucune sortie (premier contrôle documentaire à 16:22,
contrôle final répété après mise à jour des trois documents).

État Git final attendu et contrôlé : `main`, HEAD et `origin/main` inchangés
à `ec65162044cbfb5b9dea21beba31666a49b6c8cd`, aucun fichier indexé ;
modifications non indexées limitées à :

```text
 M .loop/state.md
?? .loop/tickets/YUNIMOBILE-0011A.md
?? docs/engineering/android-environment-audit.md
```

Espace mesuré en fin d'inventaire : 2 943 090 688 octets (**2,741 Gio**) à 16:22:06
Europe/Paris ; ces fluctuations ne constituent pas un gain de nettoyage.
Audit initialement livré au statut **à revoir**, décision de préparation du build **BLOCKED**.
Aucun commit, push, branche modifiée, installation, téléchargement, suppression,
build, bundle, lint, typecheck, serveur ADB ou émulateur démarré par cet audit.

### Clôture documentaire autorisée par le CTO

Statut : **terminé — audit réalisé ; premier dev build bloqué**.
Les mesures et diagnostics ci-dessus sont ceux de l'audit initial et n'ont pas
été réexécutés. Clôture sur `docs/yunimobile-0011a-android-audit` avec un commit
local limité aux trois documents autorisés, message
`docs: audit Android development environment`, corps `Ticket: YUNIMOBILE-0011A`.
Vérification documentaire et de l'index, puis arbre propre après le commit.
Aucun push, merge, installation, suppression ou ticket suivant.
