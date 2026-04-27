export const routes = [
  "/dashboard",
  "/clients",
  "/logs",
  "/tasks",
  "/pipeline",
  "/salesforce-import",
  "/referrals",
  "/settings",
  "/new-log"
];

export const productTypes = {
  business_checking: "Business Checking",
  business_savings: "Business Savings",
  line_of_credit: "Line of Credit",
  term_loan: "Term Loan",
  cre_loan: "CRE Loan",
  sba_loan: "SBA Loan",
  equipment_financing: "Equipment Financing",
  treasury_management: "Treasury Management",
  merchant_services: "Merchant Services",
  business_credit_card: "Business Credit Card",
  payroll: "Payroll",
  international: "International",
  other: "Other"
};

export const referralUnits = {
  mortgage: "Mortgage",
  wealth_management: "Wealth Management",
  insurance: "Insurance",
  payroll_services: "Payroll Services",
  merchant_services: "Merchant Services",
  international_banking: "International Banking",
  sba_specialists: "SBA Specialists",
  treasury_specialists: "Treasury Specialists",
  other: "Other"
};

export const parserContract = {
  summary: "string",
  tasks: [],
  opportunities: [],
  risk_flags: [],
  referrals: [],
  product_mentions: []
};

export const aiSystemPrompt = `You are a business banking intelligence assistant for Citizens Bank relationship managers.
Your job is to convert unstructured meeting notes and call transcripts into structured client relationship records that an RM can review, edit, and save.
Output valid JSON only. Do not invent facts, names, dates, or dollar amounts. Be conservative: null is better than a guess. Use "other" when category is unclear. Prioritize deal and relationship intelligence.`;
