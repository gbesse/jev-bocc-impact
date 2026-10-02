# Jev BOCC Impact

**Relie les évolutions des conventions collectives à leurs impacts paie et RH, après filtrage exact par IDCC.**

[![Tests](https://github.com/gbesse/jev-bocc-impact/actions/workflows/test.yml/badge.svg)](https://github.com/gbesse/jev-bocc-impact/actions/workflows/test.yml) [MIT](LICENSE) · Node.js 22+ · v0.1.4 · Documentation française

Le moteur écarte les textes dont l’IDCC ne correspond pas à celui de l’entreprise. Jev classe ensuite le domaine RH concerné et l’urgence opérationnelle.

## Démarrage rapide

```sh
git clone https://github.com/gbesse/jev-bocc-impact.git
cd jev-bocc-impact
npm install
npm run demo
```

La démonstration utilise uniquement des données et probabilités synthétiques. Elle n’effectue aucun appel réseau et ne constitue pas une mesure de qualité de Jev.

## Exemple exécutable

Cet exemple relie un avenant conventionnel à un impact de paie. Il utilise un fournisseur Jev simulé : aucune clé API ni connexion réseau n’est nécessaire. L’assertion intégrée fait échouer la commande si le comportement attendu change.

Le code complet de [`examples/demo.mjs`](examples/demo.mjs) est directement copiable :

```js
// Objectif : démontrer la frontière de décision sans appel réseau.
import assert from "node:assert/strict";
import { assessImpact } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const provider = createFakeProvider(() => ({
  model: "jev-1.13.0",
  answers: {
    impact: {
      type: "choice",
      choice: "payroll",
      probabilities: {
        payroll: 0.88,
        working_time: 0.03,
        leave: 0.03,
        benefits: 0.02,
        classification: 0.02,
        health_safety: 0.01,
        other: 0.01,
      },
      confidence: 0.88,
    },
    urgency: {
      type: "score",
      score: 2,
      probabilities: { 0: 0.03, 1: 0.12, 2: 0.8, 3: 0.05 },
      confidence: 0.8,
    },
  },
  usage: { input_tokens: 60, output_tokens: 0 },
}));
const resultat = await assessImpact(
  { id: "acme", name: "Entreprise Exemple", idcc: "1486" },
  {
    id: "bocc-1",
    idcc: "1486",
    title: "Avenant salaires",
    text: "Revalorisation de la grille minimale au prochain cycle de paie.",
    publishedAt: "2026-09-09",
    sourceUrl: "https://www.legifrance.gouv.fr/",
  },
  provider,
);
assert.equal(resultat.impact, "payroll");
console.log(JSON.stringify(resultat, null, 2));
```

Lancez-le avec :

```sh
npm run demo:principal
```

Résultat à repérer : `impact: payroll`.

### Cas limite à tester

Un avenant portant un autre IDCC est déclaré non applicable localement. Le code se trouve dans [`examples/cas-limite.mjs`](examples/cas-limite.mjs).

```sh
npm run demo:limite
```

Résultat à repérer : `applicable: false · appels Jev: 0`. La commande `npm run demo` exécute les deux exemples.

## Utilisation de la bibliothèque

Importez les fonctions métier depuis `@gbesse/jev-bocc-impact`. Fournissez soit `createJevClient()` depuis l’export `./jev`, soit `createFakeProvider()` pour les tests hors ligne.

Les noms de l’API JavaScript restent stables pour préserver la compatibilité avec les versions précédentes. La documentation, les exemples et les explications destinées aux utilisateurs sont en français.

## Frontière de décision

Une incompatibilité d’IDCC empêche tout appel au modèle. Jev qualifie seulement le domaine et l’urgence après ce filtre. Chaque résultat applicable exige une revue RH ou juridique.

La question exacte envoyée à Jev est versionnée dans [`src/index.mjs`](src/index.mjs). Les identifiants, dates, calculs, filtres, seuils et transitions d’état restent gérés par du code ordinaire.

## Sources

- [https://www.data.gouv.fr/datasets/bocc-bulletin-officiel-des-conventions-collectives](https://www.data.gouv.fr/datasets/bocc-bulletin-officiel-des-conventions-collectives)
- [https://www.data.gouv.fr/datasets/liste-des-conventions-collectives-par-entreprise-siret](https://www.data.gouv.fr/datasets/liste-des-conventions-collectives-par-entreprise-siret)

Conservez l’attribution amont, les identifiants d’origine, les URL de source et les dates de récupération avec chaque enregistrement dérivé.

## Appels Jev réels

Les appels réels sont facultatifs et payants. Le client fixe le modèle `jev-1.13.0`, valide l’identité du modèle et toutes les probabilités, refuse les redirections, ne retente que les erreurs réseau et les réponses HTTP 429/529, puis bloque les requêtes dépassant une estimation prudente de 24 000 jetons.

```sh
TYPESAFE_API_KEY=... node scripts/live-smoke.mjs
```

N’envoyez jamais de secret, de donnée personnelle ni de dossier sensible non expurgé. Évaluez le comportement sur un jeu représentatif de cas français avant tout usage opérationnel.

## Parcours comparatif

`npm run demo:parcours` produit un rapport JSON partageable pour **jev-bocc-impact** : le scénario principal et la frontière déterministe. Chaque scénario garde sa sortie propre et échoue si son assertion ne passe plus. Les données et probabilités sont synthétiques ; aucun appel Jev n’est effectué.

Cette vue permet de comparer rapidement les chemins de décision et de choisir quel exemple adapter à vos propres données sourcées.

## Validation

```sh
npm run check
npm run typecheck
npm test
npm run demo
```

La CI exécute ces vérifications sous Node.js 22 et 24.

Projet indépendant, sans affiliation avec TypeSafe AI ni avec l’administration française. Consultez la [documentation de l’API Jev](https://docs.typesafe.ai/api) et les [limites du modèle](https://docs.typesafe.ai/model-jaggedness/jev-1.13).
