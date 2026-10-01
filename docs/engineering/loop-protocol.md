# Protocole du loop

Workflow commun à tous les agents pour traiter un ticket de manière traçable.
Les consignes générales sont dans [`AGENTS.md`](../../AGENTS.md).

## Principes

- **Un seul ticket actif** à la fois, référencé dans [`.loop/state.md`](../../.loop/state.md).
- Chaque ticket a un **objectif limité** et des **critères d'acceptation observables**
  (vérifiables par une commande, un fichier ou un comportement constaté).
- Modèle de ticket : [`.loop/tickets/TEMPLATE.md`](../../.loop/tickets/TEMPLATE.md).
- Aucun service de boucle autonome, cron ou outil supplémentaire n'est installé :
  le loop est un protocole de travail, pas un logiciel. Ce protocole n'installe
  aucune automatisation ; une éventuelle automatisation future nécessitera un
  ticket dédié.

## Étapes

```
Cadrer → Inspecter → Planifier → Implémenter → Vérifier → Revoir → Rapporter → Mettre à jour l'état
```

1. **Cadrer** — Lire le ticket actif : objectif, périmètre, hors périmètre, critères,
   actions Git et installations autorisées. Une ambiguïté bloquante donne lieu à une
   question avant toute modification.
2. **Inspecter** — Vérifier l'état de départ (dossier, remote, `git status`, HEAD) et
   lire les fichiers concernés. Un écart avec l'état attendu est signalé avant de
   poursuivre. Le travail existant est préservé.
3. **Planifier** — Plan proportionné au risque : quelques lignes pour une petite
   modification, détaillé seulement si la tâche l'exige.
4. **Implémenter** — Uniquement ce que le ticket demande. Toute amélioration hors
   périmètre est signalée, pas réalisée.
5. **Vérifier** — Exécuter les contrôles pertinents et en conserver les preuves
   (commande et résultat).
6. **Revoir** — Relire le diff complet avant livraison.
7. **Rapporter** — Rédiger le rapport final (voir ci-dessous).
8. **Mettre à jour l'état** — Actualiser `.loop/state.md`, puis **arrêter**. Le ticket
   suivant n'est jamais lancé automatiquement.

## En cas d'échec

1. Reproduire l'échec.
2. Formuler une hypothèse explicite.
3. Corriger.
4. Relancer les contrôles pertinents.

- **Maximum par défaut : 3 tentatives de correction** pour un même blocage. Au-delà,
  arrêter et rapporter les preuves recueillies et la prochaine action proposée.
- Chaque nouvelle tentative doit apporter une **hypothèse ou une preuve nouvelle**.
  Toute nouvelle tentative de correction compte dans la limite. Ne pas répéter une
  action infructueuse sans hypothèse ou preuve nouvelle.
- Ne pas relancer des tests déjà passés sans changement pertinent depuis leur exécution.

## Revue

- L'**auto-vérification** (l'agent contrôle son propre travail) et la **revue
  indépendante** (une autre personne ou un autre agent examine le résultat) sont deux
  choses distinctes. Le rapport précise laquelle a eu lieu ; une auto-vérification
  n'est jamais présentée comme une revue indépendante.

## Statuts

| Statut | Condition |
|---|---|
| `à faire` | Travail non commencé. |
| `en cours` | Exécution commencée. |
| `terminé` | Tous les critères d'acceptation sont satisfaits **et** prouvés. |
| `à revoir` | Le travail est livré, mais une revue ou une décision est attendue. |
| `bloqué` | Un critère ne peut pas être atteint dans le périmètre ou les tentatives autorisées. |

Sans preuves pour chaque critère, le statut ne peut pas être `terminé`.

## Rapport final

Le rapport indique :

- les fichiers modifiés ou créés ;
- les vérifications exécutées et leurs résultats ;
- les **limites de la validation** (ce qui n'a pas été vérifié, et pourquoi) ;
- les décisions ouvertes ;
- les actions Git et installations effectuées, ou leur absence ;
- la prochaine action proposée.
