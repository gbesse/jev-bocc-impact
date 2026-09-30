// Cas limite : l’IDCC filtre les avenants avant toute analyse sémantique.
import assert from "node:assert/strict";
import { assessImpact } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";

const jev = createFakeProvider(() => {
  throw new Error("Jev ne doit pas être appelé");
});
const resultat = await assessImpact(
  { id: "acme", name: "Entreprise Exemple", idcc: "0044" },
  {
    id: "bocc-2",
    idcc: "1486",
    title: "Avenant salaires",
    text: "Nouvelle grille.",
    publishedAt: "2026-09-09",
    sourceUrl: "https://www.legifrance.gouv.fr/",
  },
  jev,
);
assert.equal(resultat.applicable, false);
assert.equal(jev.calls, 0);
console.log(JSON.stringify(resultat, null, 2));
