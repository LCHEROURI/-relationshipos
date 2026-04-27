export const rm = {
  id: "alex-rivera",
  full_name: "Alex Rivera",
  role: "relationship_manager",
  market: "New England",
  email: "alex.rivera@citizens.example"
};

export const clients = [
  {
    id: "hartwell",
    assigned_rm: "alex-rivera",
    business_name: "Hartwell Manufacturing",
    industry: "Industrial Manufacturing",
    annual_revenue_band: "25m_100m",
    employee_count_band: "251_1000",
    relationship_stage: "active",
    client_tier: "preferred",
    primary_contact_name: "Nora Patel",
    primary_contact_title: "CFO",
    city: "Worcester",
    state: "MA",
    last_interaction: "2026-04-24"
  },
  {
    id: "beacon",
    assigned_rm: "alex-rivera",
    business_name: "Beacon Street Hospitality Group",
    industry: "Hospitality",
    annual_revenue_band: "25m_100m",
    employee_count_band: "51_250",
    relationship_stage: "active",
    client_tier: "premier",
    primary_contact_name: "Julian Chen",
    primary_contact_title: "Managing Partner",
    city: "Boston",
    state: "MA",
    last_interaction: "2026-04-23"
  },
  {
    id: "greenfield",
    assigned_rm: "alex-rivera",
    business_name: "Greenfield Logistics",
    industry: "Transportation",
    annual_revenue_band: "5m_25m",
    employee_count_band: "51_250",
    relationship_stage: "at_risk",
    client_tier: "preferred",
    primary_contact_name: "Elena Morales",
    primary_contact_title: "Owner",
    city: "Providence",
    state: "RI",
    last_interaction: "2026-04-18"
  },
  {
    id: "northgate",
    assigned_rm: "alex-rivera",
    business_name: "Northgate Medical Partners",
    industry: "Healthcare",
    annual_revenue_band: "5m_25m",
    employee_count_band: "11_50",
    relationship_stage: "prospect",
    client_tier: "standard",
    primary_contact_name: "Dr. Mina Okafor",
    primary_contact_title: "Managing Partner",
    city: "Manchester",
    state: "NH",
    last_interaction: "2026-04-20"
  },
  {
    id: "cascade",
    assigned_rm: "alex-rivera",
    business_name: "Cascade Digital Agency",
    industry: "Professional Services",
    annual_revenue_band: "1m_5m",
    employee_count_band: "11_50",
    relationship_stage: "active",
    client_tier: "standard",
    primary_contact_name: "Priya Shah",
    primary_contact_title: "Founder",
    city: "Burlington",
    state: "VT",
    last_interaction: "2026-04-22"
  },
  {
    id: "summit",
    assigned_rm: "alex-rivera",
    business_name: "Summit Property Holdings",
    industry: "Commercial Real Estate",
    annual_revenue_band: "25m_100m",
    employee_count_band: "1_10",
    relationship_stage: "dormant",
    client_tier: "preferred",
    primary_contact_name: "Graham Ellis",
    primary_contact_title: "Principal",
    city: "Portland",
    state: "ME",
    last_interaction: "2026-02-18"
  }
];

export const interaction_logs = [
  { id: "log-1", client_id: "hartwell", interaction_type: "annual_review", source_type: "typed", interaction_date: "2026-04-24", summary: "Reviewed term loan performance and treasury management expansion.", status: "approved" },
  { id: "log-2", client_id: "beacon", interaction_type: "in_person_meeting", source_type: "dictated", interaction_date: "2026-04-23", summary: "Discussed CRE financing for second boutique hotel acquisition.", status: "approved" },
  { id: "log-3", client_id: "cascade", interaction_type: "phone_call", source_type: "typed", interaction_date: "2026-04-22", summary: "Founder asked about merchant services and operating account migration.", status: "approved" },
  { id: "log-4", client_id: "northgate", interaction_type: "video_call", source_type: "typed", interaction_date: "2026-04-20", summary: "First discovery call for practice expansion and operating account needs.", status: "approved" },
  { id: "log-5", client_id: "greenfield", interaction_type: "phone_call", source_type: "dictated", interaction_date: "2026-04-18", summary: "Client reported payment delays from two major customers and requested covenant flexibility.", status: "review" }
];

export const tasks = [
  { id: "task-1", client_id: "greenfield", interaction_log_id: "log-5", title: "Escalate payment delinquency review", description: "Coordinate with credit partner on covenant exposure.", priority: "critical", due_date: "2026-04-25", status: "open" },
  { id: "task-2", client_id: "beacon", interaction_log_id: "log-2", title: "Send CRE term sheet options", description: "Include amortization scenarios and DSCR assumptions.", priority: "high", due_date: "2026-04-28", status: "open" },
  { id: "task-3", client_id: "hartwell", interaction_log_id: "log-1", title: "Schedule treasury demo", description: "Bring treasury specialist into next call.", priority: "medium", due_date: "2026-04-29", status: "in_progress" },
  { id: "task-4", client_id: "northgate", interaction_log_id: "log-4", title: "Collect practice financials", description: "Request 2025 statements and YTD interim package.", priority: "high", due_date: "2026-04-30", status: "open" },
  { id: "task-5", client_id: "summit", interaction_log_id: "log-1", title: "Re-engage dormant relationship", description: "Call principal and confirm 2026 financing needs.", priority: "medium", due_date: "2026-05-03", status: "open" }
];

export const opportunities = [
  { id: "opp-1", client_id: "beacon", interaction_log_id: "log-2", product_type: "cre_loan", stage: "proposal", estimated_value: 5200000, probability: 55, expected_close_date: "2026-05-30", next_step: "Client feedback on term sheet", notes: "Second boutique hotel acquisition." },
  { id: "opp-2", client_id: "hartwell", interaction_log_id: "log-1", product_type: "treasury_management", stage: "discovery", estimated_value: 275000, probability: 45, expected_close_date: "2026-05-20", next_step: "Treasury specialist demo", notes: "Interest in payables automation." },
  { id: "opp-3", client_id: "northgate", interaction_log_id: "log-4", product_type: "term_loan", stage: "prospect", estimated_value: 900000, probability: 25, expected_close_date: "2026-06-15", next_step: "Receive financial package", notes: "Practice expansion financing." },
  { id: "opp-4", client_id: "cascade", interaction_log_id: "log-3", product_type: "merchant_services", stage: "negotiation", estimated_value: 85000, probability: 70, expected_close_date: "2026-05-08", next_step: "Compare pricing with competitor", notes: "Uses competitor merchant processor today." },
  { id: "opp-5", client_id: "greenfield", interaction_log_id: "log-5", product_type: "line_of_credit", stage: "discovery", estimated_value: 650000, probability: 30, expected_close_date: "2026-06-01", next_step: "Credit review after receivables update", notes: "Working capital pressure." }
];

export const risk_flags = [
  { id: "risk-1", client_id: "greenfield", interaction_log_id: "log-5", flag_type: "payment_delinquency", severity: "critical", description: "Delayed customer payments may pressure covenant compliance.", action_taken: "Credit partner notified.", regulatory_flag: false, requires_followup: true },
  { id: "risk-2", client_id: "cascade", interaction_log_id: "log-3", flag_type: "kyc_due", severity: "high", description: "Ownership information needs refresh before new services.", action_taken: "Requested updated beneficial owner form.", regulatory_flag: true, requires_followup: true },
  { id: "risk-3", client_id: "summit", interaction_log_id: "log-1", flag_type: "relationship_risk", severity: "medium", description: "No contact in more than 60 days after maturity discussion.", action_taken: "Re-engagement task created.", regulatory_flag: false, requires_followup: true }
];

export const referrals = [
  { id: "ref-1", client_id: "hartwell", interaction_log_id: "log-1", referred_to: "treasury_specialists", referral_reason: "Payables automation and fraud controls demo.", contact_name: "Nora Patel", status: "sent", notes: "Treasury partner assigned." },
  { id: "ref-2", client_id: "beacon", interaction_log_id: "log-2", referred_to: "wealth_management", referral_reason: "Owner liquidity planning after acquisition close.", contact_name: "Julian Chen", status: "pending", notes: "Wait until term sheet feedback." },
  { id: "ref-3", client_id: "cascade", interaction_log_id: "log-3", referred_to: "merchant_services", referral_reason: "Pricing review for card processing.", contact_name: "Priya Shah", status: "accepted", notes: "Specialist meeting booked." },
  { id: "ref-4", client_id: "northgate", interaction_log_id: "log-4", referred_to: "sba_specialists", referral_reason: "Potential SBA fit for practice expansion.", contact_name: "Dr. Mina Okafor", status: "converted", notes: "SBA intake completed." }
];

export const product_mentions = [
  { id: "pm-1", client_id: "hartwell", interaction_log_id: "log-1", product_name: "Treasury Management", mention_context: "client_asked", notes: "Asked about positive pay and payables automation." },
  { id: "pm-2", client_id: "cascade", interaction_log_id: "log-3", product_name: "Merchant Services", mention_context: "competitor_mentioned", notes: "Currently using Stripe and local bank operating account." },
  { id: "pm-3", client_id: "beacon", interaction_log_id: "log-2", product_name: "CRE Loan", mention_context: "rm_mentioned", notes: "Acquisition financing options discussed." }
];
