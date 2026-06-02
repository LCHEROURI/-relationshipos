export const pdfPath = "/Agent-lovable.pdf";

export const navItems = [
  { id: "overview", label: "Overview", icon: "home" },
  { id: "workflow", label: "Use Workflow", icon: "route" },
  { id: "openai", label: "OpenAI Setup", icon: "workflow" },
  { id: "lovable", label: "Lovable Setup", icon: "layers" },
  { id: "backend", label: "Backend Endpoint", icon: "server" },
  { id: "frontend", label: "Frontend ChatKit", icon: "message" },
  { id: "prompts", label: "Prompts", icon: "clipboard" },
  { id: "auth", label: "Auth & Usage", icon: "user" },
  { id: "monetization", label: "Monetization", icon: "card" },
  { id: "qa", label: "QA", icon: "check" },
  { id: "deployment", label: "Deployment", icon: "rocket" },
  { id: "troubleshooting", label: "Troubleshooting", icon: "alert" }
];

export const secrets = [
  { name: "OPENAI_API_KEY", area: "Backend only", purpose: "Creates ChatKit sessions with OpenAI." },
  { name: "OPENAI_WORKFLOW_ID", area: "Server preferred", purpose: "Published Agent Builder workflow ID, usually starts with wf_." },
  { name: "SUPABASE_URL", area: "Frontend allowed", purpose: "Supabase project URL." },
  { name: "SUPABASE_ANON_KEY", area: "Frontend allowed", purpose: "Public anon key, protected by RLS." },
  { name: "SUPABASE_SERVICE_ROLE_KEY", area: "Backend only", purpose: "Powerful database key. Never expose." },
  { name: "STRIPE_SECRET_KEY", area: "Backend only", purpose: "Stripe billing operations." },
  { name: "STRIPE_WEBHOOK_SECRET", area: "Backend only", purpose: "Webhook verification." }
];

export const steps = [
  {
    id: "architecture",
    section: "overview",
    title: "Architecture in Plain English",
    goal: "Understand the secure request path before asking Lovable to build anything.",
    outcome: "The browser gets only a temporary ChatKit client secret. Your OpenAI API key stays server-side.",
    checklist: [
      "User opens /agent in Lovable.",
      "Frontend calls /api/chatkit/session.",
      "Backend verifies the user when auth exists.",
      "Backend reads OPENAI_API_KEY and OPENAI_WORKFLOW_ID from secrets.",
      "Backend creates a ChatKit session and returns only client_secret.",
      "ChatKit widget connects to the published workflow."
    ],
    security: "Never put OPENAI_API_KEY in React, browser code, or any VITE_ environment variable.",
    prompt: "Before coding, summarize the architecture for this app: /agent calls /api/chatkit/session, the backend creates an OpenAI ChatKit session using OPENAI_API_KEY and OPENAI_WORKFLOW_ID, and the frontend receives only client_secret. Confirm that no OpenAI API key will be exposed in frontend code."
  },
  {
    id: "site-workflow",
    section: "workflow",
    title: "Use This Dashboard Workflow",
    goal: "Follow the dashboard the same way you would follow a build coach.",
    outcome: "You always know what to read, what to copy into Lovable, what to verify, and when to mark a stage complete.",
    checklist: [
      "Start with Overview to understand the secure architecture.",
      "Move through the top progress cards from left to right.",
      "Open each step and read the Result you want before copying prompts.",
      "Copy the Lovable Prompt into Lovable for that one stage only.",
      "Run your app after each Lovable change and inspect what changed.",
      "Mark the dashboard step complete only after the app behaves correctly.",
      "Use QA before Deployment, even if the chat appears to work.",
      "Use Troubleshooting when ChatKit, secrets, auth, billing, or deployment break."
    ],
    security: "Do not skip ahead to Stripe or deployment before the backend session endpoint works safely.",
    prompt: `Use this dashboard as the build workflow:
1. Complete OpenAI Setup first.
2. Complete Lovable Setup second.
3. Build /api/chatkit/session before frontend ChatKit.
4. Add ChatKit UI.
5. Add auth and stable user IDs.
6. Add usage tracking.
7. Add Stripe only after the assistant works.
8. Run QA.
9. Deploy.
10. Troubleshoot any failed step before moving forward.`
  },
  {
    id: "openai-project",
    section: "openai",
    title: "Select the Correct OpenAI Project",
    goal: "Make sure billing, keys, workflows, and deployment live in the same OpenAI project.",
    outcome: "Avoid the common problem where a workflow ID belongs to a different project than the API key.",
    checklist: [
      "Open platform.openai.com.",
      "Check the project selector at the top.",
      "Confirm this project will hold your API key.",
      "Confirm this project will hold your Agent Builder workflow.",
      "Use the same project for deployment testing."
    ],
    prompt: "Add a setup note telling me to confirm the same OpenAI Platform project is used for API keys, Agent Builder workflows, and ChatKit deployment."
  },
  {
    id: "workflow",
    section: "openai",
    title: "Create a Focused Agent Builder Workflow",
    goal: "Start narrow so the first production agent is easy to test and sell.",
    outcome: "One clear job, one audience, one success metric.",
    checklist: [
      "Create or open a workflow in Agent Builder.",
      "Pick a narrow job for version 1.",
      "Add operational instructions.",
      "Add only current documents.",
      "Preview happy paths, missing info, out-of-scope requests, and prompt injection."
    ],
    prompt: "Help me define a first Agent Builder workflow with one clear audience, one job, one success metric, refusal rules, and escalation behavior. Keep it narrow enough to test before production.",
    snippetTitle: "Starter Agent Instruction Block",
    snippet: `You are a product support assistant embedded in a web application.
Your job is to answer user questions about the product, guide users through setup, and collect missing details when needed.
Use concise language.
Do not invent policies, prices, legal claims, medical claims, or technical capabilities.
When information is missing, ask one practical follow-up question.
When a user reports a bug, collect: page, action taken, expected result, actual result, browser, and screenshot request.
If the question is outside the product, say that you can help only with product-related support.`
  },
  {
    id: "publish",
    section: "openai",
    title: "Publish and Copy Workflow ID",
    goal: "Create a versioned workflow target for your app.",
    outcome: "A workflow ID stored as OPENAI_WORKFLOW_ID.",
    checklist: [
      "Open the Agent Builder workflow.",
      "Click Publish when ready.",
      "Open Code in the top navigation.",
      "Choose ChatKit.",
      "Copy the workflow ID.",
      "Store it as OPENAI_WORKFLOW_ID in Lovable secrets."
    ],
    security: "The workflow ID is not your API key, but the API key used to create sessions must remain secret.",
    prompt: "Add OPENAI_WORKFLOW_ID to the server-side environment checklist and explain that new workflow versions must be checked before production deployment."
  },
  {
    id: "lovable-shell",
    section: "lovable",
    title: "Generate the Lovable App Shell",
    goal: "Build the app in controlled passes instead of one giant prompt.",
    outcome: "Routes exist, but no OpenAI code is added yet.",
    checklist: [
      "Create / landing page.",
      "Create /login placeholder.",
      "Create /dashboard placeholder.",
      "Create /agent page placeholder.",
      "Add navigation and responsive card layout.",
      "Do not add OpenAI code yet."
    ],
    prompt: `Create a clean SaaS-style app shell with routes:
/ - landing page
/login - login page placeholder
/dashboard - logged-in dashboard placeholder
/agent - AI assistant page placeholder
Use responsive design. Do not add OpenAI code yet. Add a navigation bar and a clean card layout.`
  },
  {
    id: "secrets",
    section: "lovable",
    title: "Add Environment Variables and Secrets",
    goal: "Separate safe frontend config from backend-only secrets.",
    outcome: "The project has a README checklist for required server-side secrets.",
    checklist: [
      "Add OPENAI_API_KEY server-side only.",
      "Add OPENAI_WORKFLOW_ID server-side preferred.",
      "Keep service role and Stripe secrets server-side only.",
      "Do not create VITE_OPENAI_API_KEY.",
      "Document the setup in README."
    ],
    security: "In Vite and many frontend systems, VITE_ variables can be exposed to the browser.",
    prompt: `Add an environment variable checklist to the README and project setup notes.
Required secrets:
OPENAI_API_KEY - server-side only
OPENAI_WORKFLOW_ID - server-side preferred
Optional later:
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY - server-side only
STRIPE_SECRET_KEY - server-side only
STRIPE_WEBHOOK_SECRET - server-side only
Do not place OPENAI_API_KEY, SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY, or STRIPE_WEBHOOK_SECRET in frontend code.`
  },
  {
    id: "backend-session",
    section: "backend",
    title: "Create Backend ChatKit Session Endpoint",
    goal: "Build the most important secure integration piece.",
    outcome: "/api/chatkit/session accepts POST, creates a ChatKit session, and returns client_secret.",
    checklist: [
      "Accept only POST requests.",
      "Verify authenticated user when auth is enabled.",
      "Use a stable user identifier.",
      "Read OPENAI_API_KEY from server environment.",
      "Read OPENAI_WORKFLOW_ID from server environment.",
      "Create ChatKit session.",
      "Return only client_secret and minimal metadata.",
      "Log errors safely without logging keys or client secrets."
    ],
    security: "anonymous-demo-user is only for smoke tests. Production must pass the logged-in user's stable ID.",
    prompt: `Add a secure backend endpoint at /api/chatkit/session.
It must accept POST only.
It must read OPENAI_API_KEY and OPENAI_WORKFLOW_ID from server-side environment variables.
It must call the OpenAI ChatKit sessions API.
It must pass workflow: { id: OPENAI_WORKFLOW_ID }.
It must pass a stable user identifier. For now use anonymous-demo-user and add a TODO to replace it with the authenticated user's ID.
It must return only { client_secret } to the frontend.
Do not expose OPENAI_API_KEY in frontend code.
Add safe error handling.`,
    snippetTitle: "Generic Node/TypeScript Endpoint",
    snippet: `export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const workflowId = process.env.OPENAI_WORKFLOW_ID;

    if (!apiKey || !workflowId) {
      return res.status(500).json({ error: 'Server is missing OpenAI configuration.' });
    }

    const userId = req.user?.id || 'anonymous-demo-user';
    const response = await fetch('https://api.openai.com/v1/chatkit/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: \`Bearer \${apiKey}\`,
        'OpenAI-Beta': 'chatkit_beta=v1'
      },
      body: JSON.stringify({
        workflow: { id: workflowId },
        user: userId
      })
    });

    if (!response.ok) {
      console.error('ChatKit session failed:', await response.text());
      return res.status(502).json({ error: 'Could not create chat session.' });
    }

    const data = await response.json();
    return res.status(200).json({ client_secret: data.client_secret });
  } catch (error) {
    console.error('Unexpected ChatKit session error:', error);
    return res.status(500).json({ error: 'Unexpected server error.' });
  }
}`
  },
  {
    id: "frontend-chatkit",
    section: "frontend",
    title: "Build Frontend ChatKit Page",
    goal: "Render the assistant without exposing secrets.",
    outcome: "The /agent page calls your backend, receives client_secret, and renders ChatKit.",
    checklist: [
      "Install @openai/chatkit-react.",
      "Create src/components/AgentChat.tsx.",
      "POST to /api/chatkit/session.",
      "Read client_secret from JSON.",
      "Show loading and friendly error states.",
      "Keep mobile layout usable.",
      "Do not show internal workflow IDs or raw API errors to users."
    ],
    prompt: `Install and use @openai/chatkit-react.
Create src/components/AgentChat.tsx.
The component should call /api/chatkit/session with POST, read client_secret from the JSON response, and render the ChatKit widget.
Create /agent page using this component.
Add loading and error states.
Make the page mobile responsive.`,
    snippetTitle: "Safe Frontend Fetch",
    snippet: `const res = await fetch('/api/chatkit/session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
});

if (!res.ok) {
  throw new Error('Could not start AI assistant.');
}

const { client_secret } = await res.json();`
  },
  {
    id: "master-prompts",
    section: "prompts",
    title: "Use Master Lovable Prompts",
    goal: "Prompt Lovable one pass at a time and inspect changes after each pass.",
    outcome: "You can add shell, backend, ChatKit, audit, auth, and production readiness in order.",
    checklist: [
      "Run one prompt at a time.",
      "Run the app after each prompt.",
      "Inspect changed files.",
      "Avoid asking Lovable to add auth, Stripe, database, and ChatKit in one prompt."
    ],
    prompt: `Implement OpenAI ChatKit for a published Agent Builder workflow.
Create /api/chatkit/session as a secure backend endpoint.
- POST only
- Reads OPENAI_API_KEY server-side
- Reads OPENAI_WORKFLOW_ID server-side
- Calls OpenAI ChatKit sessions API
- Sends workflow: { id: OPENAI_WORKFLOW_ID }
- Sends user: authenticated user ID if auth exists; otherwise anonymous-demo-user with TODO
- Returns only { client_secret }
- Uses safe error handling
Create src/components/AgentChat.tsx.
- Uses @openai/chatkit-react
- Calls /api/chatkit/session
- Renders ChatKit
- Has loading and error states
- Mobile responsive
Create /agent page.
- Clean header
- Chat area
- No API keys or secrets in frontend code
Update README with setup instructions.`
  },
  {
    id: "auth",
    section: "auth",
    title: "Add Authentication and Stable User Identity",
    goal: "Protect /agent and connect sessions to real users.",
    outcome: "The endpoint returns 401 when logged out and passes Supabase user.id to ChatKit.",
    checklist: [
      "Add Supabase authentication.",
      "Require login before /agent and /dashboard.",
      "Replace anonymous-demo-user with authenticated user.id.",
      "Return 401 when no user is logged in.",
      "Keep service role keys server-side only."
    ],
    prompt: `Add Supabase authentication.
Require login before accessing /agent and /dashboard.
Replace anonymous-demo-user in /api/chatkit/session with the authenticated Supabase user ID.
If the user is not logged in, return 401 from the session endpoint.
Keep service role keys server-side only.`,
    snippetTitle: "Route Protection Pattern",
    snippet: `const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  navigate('/login');
  return null;
}
return <AgentPage />;`
  },
  {
    id: "usage",
    section: "auth",
    title: "Track Database Usage",
    goal: "Prepare for billing, abuse prevention, and support debugging.",
    outcome: "You track users, plans, sessions, subscriptions, usage events, and audit logs.",
    checklist: [
      "Create profiles table.",
      "Create usage_events table.",
      "Create subscriptions table.",
      "Record chatkit_session_created before returning client_secret.",
      "Add monthly limits by plan."
    ],
    prompt: "Add usage tracking tables for profiles, usage_events, subscriptions, and audit_logs. Record a chatkit_session_created event from /api/chatkit/session after plan checks pass. Enforce usage limits server-side.",
    snippetTitle: "SQL Starter Schema",
    snippet: `create table profiles (
  id uuid primary key,
  email text,
  full_name text,
  plan text default 'free',
  created_at timestamptz default now()
);

create table usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  event_type text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  stripe_customer_id text,
  stripe_subscription_id text,
  status text,
  plan text,
  current_period_end timestamptz,
  created_at timestamptz default now()
);`
  },
  {
    id: "stripe",
    section: "monetization",
    title: "Add Stripe After the Assistant Works",
    goal: "Monetize only after ChatKit, auth, and usage tracking are stable.",
    outcome: "Free, Starter, Pro, and Business plans are enforced by the backend session endpoint.",
    checklist: [
      "Create /billing page.",
      "Create backend Checkout Session endpoint.",
      "Create Stripe webhook endpoint.",
      "Update subscriptions table from webhooks.",
      "Enforce plan limits in /api/chatkit/session.",
      "Never expose Stripe server secrets in frontend code."
    ],
    prompt: `Add Stripe subscription billing with Free, Starter, and Pro plans.
Create a /billing page.
Add a backend endpoint to create a Stripe Checkout Session.
Add a Stripe webhook endpoint to update the subscriptions table.
Enforce plan limits in /api/chatkit/session before creating a ChatKit session.
Never expose STRIPE_SECRET_KEY or webhook secrets in frontend code.`,
    snippetTitle: "Billing Gate",
    snippet: `if (subscription.status !== 'active' && monthlySessions >= FREE_LIMIT) {
  return res.status(402).json({
    error: 'Plan limit reached.',
    upgrade_url: '/billing'
  });
}`
  },
  {
    id: "qa",
    section: "qa",
    title: "Run Testing and QA",
    goal: "Test security, auth, error handling, mobile layout, workflow connection, and billing gates.",
    outcome: "You know the app is safe enough to show to a client.",
    checklist: [
      "Remove OPENAI_WORKFLOW_ID temporarily and confirm safe config error.",
      "Remove OPENAI_API_KEY temporarily and confirm safe config error.",
      "Use an invalid wf_ value and confirm clean failure.",
      "Search frontend code for OPENAI_API_KEY.",
      "Search for VITE_OPENAI.",
      "Confirm /api/chatkit/session returns only client_secret or safe errors.",
      "Open /agent at mobile width.",
      "Trigger enough sessions to test backend rate limits."
    ],
    prompt: `Audit this app for production readiness.
Check:
1. OPENAI_API_KEY is server-side only.
2. No VITE_OPENAI secret exists.
3. ChatKit session endpoint validates method and handles errors.
4. /agent works on mobile.
5. If auth is enabled, /agent requires login.
6. If usage limits exist, they are enforced server-side.
7. Logs do not expose API keys or client secrets.
Fix any issues and list the changed files.`
  },
  {
    id: "deployment",
    section: "deployment",
    title: "Deploy and Smoke Test",
    goal: "Catch production-only failures before launch.",
    outcome: "Production secrets, routes, auth callbacks, webhooks, logs, and usage records are verified.",
    checklist: [
      "Set production OPENAI_API_KEY server-side.",
      "Set production OPENAI_WORKFLOW_ID.",
      "Confirm /api/chatkit/session works in production.",
      "Confirm /agent loads over HTTPS.",
      "Confirm auth redirect URLs include production domain.",
      "Confirm Stripe webhook URL uses production domain.",
      "Enable database RLS policies.",
      "Test with a brand-new user account."
    ],
    prompt: "Create a deployment checklist for Lovable, Vercel, or Railway that verifies production secrets, /api/chatkit/session, /agent over HTTPS, auth callbacks, Stripe webhook URLs, RLS policies, friendly error pages, and secret-safe logs."
  },
  {
    id: "troubleshooting",
    section: "troubleshooting",
    title: "Troubleshoot Common Failures",
    goal: "Fix blank widgets, failed sessions, wrong workflow IDs, exposed keys, shared history, and billing drift.",
    outcome: "You have fast diagnosis steps for the failures most likely to happen.",
    checklist: [
      "If chat widget is blank, check package install and browser console.",
      "If session creation fails, check API key, workflow ID, and beta header.",
      "If workflow is not found, verify OpenAI project and workflow ID.",
      "If it works locally but not deployed, add production secrets.",
      "If API key is visible in browser, rotate key immediately.",
      "If all users share history, pass authenticated user.id.",
      "If users bypass limits, move checks to backend.",
      "If Stripe says paid but app says free, check webhook secret and handler."
    ],
    security: "If a secret was exposed: revoke or rotate the key, remove it from frontend code, redeploy, check logs, and add code search checks.",
    prompt: "Diagnose this ChatKit Lovable app using the troubleshooting list: blank widget, session creation failed, workflow not found, deployed secrets missing, API key visible in browser, shared user history, frontend-only limits, or Stripe webhook drift."
  }
];

export const qaTests = [
  ["Workflow ID missing", "Remove OPENAI_WORKFLOW_ID temporarily", "Backend returns safe configuration error."],
  ["API key missing", "Remove OPENAI_API_KEY temporarily", "Backend returns safe configuration error."],
  ["Wrong workflow ID", "Use invalid wf_ value", "Session creation fails cleanly."],
  ["Frontend secret exposure", "Search code for OPENAI_API_KEY", "No frontend result."],
  ["Unauthenticated user", "Open /agent logged out", "Redirect to login or 401."],
  ["Mobile", "Open on phone width", "Chat usable, no broken layout."],
  ["Rate limit", "Trigger many sessions", "Limit enforced server-side."]
];

export const blueprints = [
  "Create a focused Agent Builder workflow.",
  "Add instructions and only the knowledge/tools needed for version 1.",
  "Preview and test the workflow.",
  "Publish the workflow.",
  "Copy the workflow ID from Code - ChatKit.",
  "Create a Lovable app shell with /agent page.",
  "Add server-side OPENAI_API_KEY and OPENAI_WORKFLOW_ID secrets.",
  "Create /api/chatkit/session endpoint.",
  "Install @openai/chatkit-react.",
  "Create AgentChat component.",
  "Render the component on /agent.",
  "Test anonymous demo session.",
  "Add Supabase Auth.",
  "Replace demo user with authenticated user.id.",
  "Add usage_events table.",
  "Record session creation events.",
  "Add usage limits.",
  "Add Stripe only after the assistant works.",
  "Deploy to production.",
  "Run the smoke test and rotate any exposed secrets."
];

export const troubleshooting = [
  { problem: "Chat widget blank", cause: "Package not installed, component error, or script not loaded.", fix: "Check browser console and install @openai/chatkit-react." },
  { problem: "Session creation failed", cause: "Bad API key, missing workflow ID, or beta header missing.", fix: "Check backend logs and environment variables." },
  { problem: "Workflow not found", cause: "Wrong project or wrong workflow ID.", fix: "Return to Agent Builder Code tab and copy ID again." },
  { problem: "Works locally, fails deployed", cause: "Production secrets missing.", fix: "Add secrets in deployment environment." },
  { problem: "API key visible in browser", cause: "Secret accidentally placed in frontend env.", fix: "Rotate key immediately and move calls server-side." },
  { problem: "All users share history", cause: "Same user value for every session.", fix: "Pass authenticated user.id." },
  { problem: "Users bypass limits", cause: "Limits only enforced in frontend.", fix: "Move limit checks to backend session endpoint." },
  { problem: "Stripe says paid but app says free", cause: "Webhook not updating database.", fix: "Check webhook secret and event handler." }
];
