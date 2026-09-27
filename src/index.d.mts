import type { JevProvider } from "./jev.mjs"; export const IMPACTS:readonly string[];
export type CompanyProfile={id:string;name:string;idcc:string;headcount:number}; export type AgreementChange={id:string;idcc:string;title:string;text:string;publishedAt:string;sourceUrl:string};
export function companyProfile(input:any):CompanyProfile; export function agreementChange(input:any):AgreementChange;
export function assessImpact(company:any,change:any,provider:JevProvider):Promise<any>;
