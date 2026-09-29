// Objectif : implémenter la frontière de décision métier propre au dépôt.
export const IMPACTS=["payroll","working_time","leave","benefits","classification","health_safety","other"];
export function companyProfile(input){if(!input?.id || !input?.idcc)throw new TypeError("A company needs id and idcc");
  const idcc=String(input.idcc).padStart(4,"0");if(!/^\d{4}$/.test(idcc))throw new TypeError("idcc must contain up to 4 digits");
  return{id:String(input.id),name:String(input.name||""),idcc,headcount:Number(input.headcount||0)};}
export function agreementChange(input){if(!input?.id || !input?.idcc || !input?.title || !input?.text || !input?.publishedAt || !input?.sourceUrl)
  throw new TypeError("A BOCC change needs id, idcc, title, text, publishedAt and sourceUrl");
  const date=new Date(input.publishedAt);if(Number.isNaN(date.valueOf()))throw new TypeError("publishedAt must be an ISO date");
  const idcc=String(input.idcc).padStart(4,"0");if(!/^\d{4}$/.test(idcc))throw new TypeError("idcc must contain up to 4 digits");
  return{id:String(input.id),idcc,title:String(input.title),text:String(input.text),publishedAt:date.toISOString(),sourceUrl:String(input.sourceUrl)};}
export async function assessImpact(companyInput,changeInput,provider){const company=companyProfile(companyInput),change=agreementChange(changeInput);
  if(company.idcc!==change.idcc)return{applicable:false,reason:"different_idcc",review:false,deterministic:true,company,change};
  const response=await provider.decide({state:{company,change},questions:{impact:{type:"choice",instructions:"Classify the primary operational HR domain changed by this collective-agreement text. Do not infer legal applicability beyond the supplied exact IDCC.",criteria:Object.fromEntries(IMPACTS.map(x=>[x,x.replaceAll("_"," ")]))},urgency:{type:"score",instructions:"Score implementation urgency from informational to immediate payroll or compliance action.",criteria:["0 — informational","1 — plan this quarter","2 — action before next applicable cycle","3 — immediate specialist review"]}}});
  const impact=response.answers.impact,urgency=response.answers.urgency;return{applicable:true,impact:impact.choice,impactProbability:impact.probabilities[impact.choice],urgency:urgency.score,confidence:Math.min(impact.confidence,urgency.confidence),review:true,deterministic:false,company,change,usage:response.usage};}
