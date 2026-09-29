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
