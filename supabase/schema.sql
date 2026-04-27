-- RelationshipOS schema reference, preserved from the Codex-optimized prompt.
-- This file is ready to adapt into Supabase migrations when project credentials exist.

create table profiles (
  id uuid primary key references auth.users(id),
  full_name text,
  role text check (role in ('admin','relationship_manager','team_lead','support_associate')),
  team_id uuid,
  employee_id text,
  email text,
  market text,
  created_at timestamptz default now()
);

create table clients (
  id uuid primary key,
  assigned_rm uuid references profiles(id),
  salesforce_account_id text unique,
  business_name text not null,
  dba_name text,
  industry text,
  naics_code text,
  annual_revenue_band text check (annual_revenue_band in ('under_1m','1m_5m','5m_25m','25m_100m','over_100m')),
  employee_count_band text check (employee_count_band in ('1_10','11_50','51_250','251_1000','over_1000')),
  relationship_stage text check (relationship_stage in ('prospect','active','at_risk','dormant','lost')),
  client_tier text check (client_tier in ('standard','preferred','premier')),
  primary_contact_name text,
  primary_contact_title text,
  phone text,
  city text,
  state text,
  created_at timestamptz default now()
);

create table interaction_logs (
  id uuid primary key,
  client_id uuid references clients(id),
  created_by uuid references profiles(id),
  raw_transcript text not null,
  source_type text check (source_type in ('voice','typed','dictated','email_summary')),
  interaction_type text check (interaction_type in ('in_person_meeting','phone_call','site_visit','video_call','email_summary','annual_review','other')),
  interaction_date date,
  summary text,
  status text check (status in ('draft','review','approved')),
  created_at timestamptz default now()
);

create table tasks (
  id uuid primary key,
  client_id uuid references clients(id),
  interaction_log_id uuid references interaction_logs(id),
  title text not null,
  description text,
  priority text check (priority in ('low','medium','high','critical')),
  assigned_to uuid references profiles(id),
  due_date date,
  status text check (status in ('open','in_progress','done')),
  created_at timestamptz default now()
);

create table opportunities (
  id uuid primary key,
  client_id uuid references clients(id),
  interaction_log_id uuid references interaction_logs(id),
  salesforce_opportunity_id text unique,
  import_source text,
  last_imported_at timestamptz,
  product_type text check (product_type in ('business_checking','business_savings','line_of_credit','term_loan','cre_loan','sba_loan','equipment_financing','treasury_management','merchant_services','business_credit_card','payroll','international','other')),
  stage text check (stage in ('prospect','discovery','proposal','negotiation','won','lost')),
  estimated_value numeric,
  probability integer,
  expected_close_date date,
  next_step text,
  notes text,
  created_at timestamptz default now()
);

create table risk_flags (
  id uuid primary key,
  client_id uuid references clients(id),
  interaction_log_id uuid references interaction_logs(id),
  flag_type text check (flag_type in ('credit_concern','bsa_aml','kyc_due','concentration_risk','payment_delinquency','fraud_suspicion','relationship_risk','other')),
  severity text check (severity in ('low','medium','high','critical')),
  description text,
  action_taken text,
  regulatory_flag boolean default false,
  requires_followup boolean default false,
  created_at timestamptz default now()
);

create table referrals (
  id uuid primary key,
  client_id uuid references clients(id),
  interaction_log_id uuid references interaction_logs(id),
  referred_to text check (referred_to in ('mortgage','wealth_management','insurance','payroll_services','merchant_services','international_banking','sba_specialists','treasury_specialists','other')),
  referral_reason text,
  contact_name text,
  status text check (status in ('pending','sent','accepted','converted')),
  notes text,
  created_at timestamptz default now()
);

create table product_mentions (
  id uuid primary key,
  client_id uuid references clients(id),
  interaction_log_id uuid references interaction_logs(id),
  product_name text,
  mention_context text check (mention_context in ('client_asked','rm_mentioned','competitor_mentioned','needs_review','client_has_elsewhere','other')),
  notes text,
  created_at timestamptz default now()
);

create table ai_runs (
  id uuid primary key,
  interaction_log_id uuid references interaction_logs(id),
  model_name text,
  prompt_version text,
  raw_output jsonb,
  parsing_status text,
  created_at timestamptz default now()
);

create table integration_connections (
  id uuid primary key,
  profile_id uuid references profiles(id),
  provider text check (provider in ('salesforce')),
  external_user_id text,
  instance_url text,
  encrypted_access_token text,
  encrypted_refresh_token text,
  token_expires_at timestamptz,
  connected_at timestamptz default now(),
  last_sync_at timestamptz
);

create table import_runs (
  id uuid primary key,
  profile_id uuid references profiles(id),
  provider text check (provider in ('salesforce')),
  import_type text check (import_type in ('pipeline')),
  status text check (status in ('review','completed','failed')),
  records_new integer default 0,
  records_updated integer default 0,
  records_duplicates integer default 0,
  raw_summary jsonb,
  created_at timestamptz default now()
);
