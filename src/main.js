import { clients, interaction_logs, opportunities, product_mentions, referrals, risk_flags, rm, tasks } from "./data.js";
import { productTypes, referralUnits, routes } from "./domain.js";
import "./styles.css";

const state = {
  route: window.location.pathname === "/" ? "/dashboard" : window.location.pathname,
  selectedClientId: clients[0].id,
  clientFilter: "all",
  taskFilter: "all",
  pipelineFilter: "all",
  riskFilter: "all",
  referralFilter: "all",
  draft: {
    client_id: clients[0].id,
    interaction_type: "in_person_meeting",
    source_type: "typed",
    interaction_date: "2026-04-26",
    raw_transcript: ""
  },
  parsed: null,
  data: {
    clients: [...clients],
    interaction_logs: [...interaction_logs],
    tasks: [...tasks],
    opportunities: [...opportunities],
    risk_flags: [...risk_flags],
    referrals: [...referrals],
    product_mentions: [...product_mentions]
  }
};

const navItems = [
  { route: "/dashboard", label: "Dashboard", icon: "grid" },
  { route: "/clients", label: "Clients", icon: "users" },
  { route: "/tasks", label: "Tasks", icon: "check" },
  { route: "/pipeline", label: "Pipeline", icon: "chart" },
  { route: "/referrals", label: "Referrals", icon: "share" },
  { route: "/logs", label: "Logs", icon: "note" },
  { route: "/settings", label: "Settings", icon: "gear" }
];

function clientById(id) {
  return state.data.clients.find((client) => client.id === id);
}

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);
}

function titleize(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function icon(name) {
  const icons = {
    grid: '<svg viewBox="0 0 24 24"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></svg>',
    users: '<svg viewBox="0 0 24 24"><path d="M16 11a4 4 0 1 0-3.4-6.1M9 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM3 20a6 6 0 0 1 12 0M14 17a5 5 0 0 1 7 3"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M9 11l2 2 4-5M5 4h14v16H5z"/></svg>',
    chart: '<svg viewBox="0 0 24 24"><path d="M4 19V5M4 19h16M8 16v-5M12 16V8M16 16v-9"/></svg>',
    share: '<svg viewBox="0 0 24 24"><path d="M18 8a3 3 0 1 0-2.8-4M6 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM18 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM8.6 15.5l6.8-4M8.6 18.5l6.8 2"/></svg>',
    note: '<svg viewBox="0 0 24 24"><path d="M6 3h9l3 3v15H6zM14 3v4h4M8 11h8M8 15h8"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM4 12h2M18 12h2M12 4v2M12 18v2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M17.7 6.3l-1.4 1.4M7.7 16.3l-1.4 1.4"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    alert: '<svg viewBox="0 0 24 24"><path d="M12 4 3 20h18L12 4ZM12 10v4M12 17h.01"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><path d="M7 10V8a5 5 0 0 1 10 0v2M6 10h12v10H6zM12 14v2"/></svg>'
  };
  return icons[name] || icons.note;
}

function setRoute(route) {
  state.route = route;
  window.history.pushState({}, "", route);
  render();
}

function badge(text, tone = "neutral") {
  return `<span class="badge ${tone}">${text}</span>`;
}

function pageShell(content) {
  return `
    <aside class="sidebar">
      <div class="brand"><span class="brand-mark">R</span><div><strong>RelationshipOS</strong><small>Citizens Business Banking</small></div></div>
      <nav>${navItems.map((item) => `<button class="nav-item ${state.route.startsWith(item.route) ? "active" : ""}" data-route="${item.route}">${icon(item.icon)}<span>${item.label}</span>${item.route === "/tasks" ? `<em>${state.data.tasks.filter((task) => task.status !== "done").length}</em>` : ""}</button>`).join("")}</nav>
      <button class="quick-add" data-route="/new-log">${icon("plus")} New interaction</button>
      <div class="user-card"><span>AR</span><div><strong>${rm.full_name}</strong><small>${titleize(rm.role)} - ${rm.market}</small></div></div>
    </aside>
    <main class="workspace">${content}</main>
    <nav class="mobile-nav">
      ${navItems.slice(0, 5).map((item) => `<button class="${state.route.startsWith(item.route) ? "active" : ""}" data-route="${item.route}">${icon(item.icon)}<span>${item.label}</span></button>`).join("")}
    </nav>
  `;
}

function header(title, subtitle, action = "") {
  return `
    <header class="page-header">
      <div><p class="eyebrow">Relationship Manager Workspace</p><h1>${title}</h1><span>${subtitle}</span></div>
      <div class="header-actions">
        <label class="search"><input placeholder="Search clients, deals, tasks..." /></label>
        ${action}
      </div>
    </header>
  `;
}

function dashboard() {
  const openTasks = state.data.tasks.filter((task) => task.status !== "done");
  const overdue = openTasks.filter((task) => task.due_date < "2026-04-26");
  const activeOpps = state.data.opportunities.filter((opp) => !["won", "lost"].includes(opp.stage));
  const pipelineValue = activeOpps.reduce((sum, opp) => sum + opp.estimated_value, 0);
  const pendingRefs = state.data.referrals.filter((ref) => ref.status === "pending");
  const risks = state.data.risk_flags.filter((risk) => risk.requires_followup && ["critical", "high"].includes(risk.severity));
  const atRisk = state.data.clients.filter((client) => client.relationship_stage === "at_risk");
  return pageShell(`
    ${header(`Good morning, ${rm.full_name}`, "Your portfolio command center is ready.", `<button class="primary" data-route="/new-log">${icon("plus")} New Log</button>`)}
    <section class="metrics">
      ${metric("Open Tasks", openTasks.length, `${overdue.length} overdue`, "tasks", "/tasks")}
      ${metric("Active Pipeline", money(pipelineValue), `${money(forecastValue())} forecast`, "pipeline", "/pipeline")}
      ${metric("Pending Referrals", pendingRefs.length, "Warm hand-offs", "referrals", "/referrals")}
      ${metric("Risk Flags", risks.length, "High and critical", "risk", "/logs")}
      ${metric("Clients at Risk", atRisk.length, "Review now", "risk", "/clients")}
    </section>
    <section class="dashboard-grid">
      <div class="panel span-2">
        <div class="panel-title"><h2>Recent activity</h2><button data-route="/logs">View all</button></div>
        ${table(["Client", "Interaction", "Channel", "Date"], state.data.interaction_logs.slice(0, 5).map((log) => [clientById(log.client_id).business_name, log.summary, titleize(log.interaction_type), log.interaction_date]))}
      </div>
      <div class="panel">
        <div class="panel-title"><h2>Client intelligence</h2>${badge("Live demo", "blue")}</div>
        <div class="insight-list">
          <article><strong>Top opportunity</strong><span>${clientById("beacon").business_name}</span><b>${money(5200000)}</b></article>
          <article><strong>Compliance watch</strong><span>KYC refresh needed</span><b>1 item</b></article>
          <article><strong>Call priority</strong><span>${clientById("summit").business_name}</span><b>60+ days</b></article>
        </div>
      </div>
      <div class="panel span-2">
        <div class="panel-title"><h2>Deals needing attention</h2><button data-route="/pipeline">View pipeline</button></div>
        ${table(["Deal", "Client", "Stage", "Amount", "Next step", "Risk"], activeOpps.map((opp) => [productTypes[opp.product_type], clientById(opp.client_id).business_name, badge(titleize(opp.stage), opp.stage), money(opp.estimated_value), opp.next_step, riskForClient(opp.client_id)]))}
      </div>
      <div class="panel">
        <div class="panel-title"><h2>Relationship health</h2></div>
        <div class="donut"><span>72%</span><small>Healthy</small></div>
        <div class="legend"><span class="green"></span>Healthy 72%</div>
        <div class="legend"><span class="amber"></span>At risk 17%</div>
        <div class="legend"><span class="red"></span>Critical 11%</div>
      </div>
    </section>
  `);
}

function metric(label, value, note, tone, route) {
  return `<button class="metric-card ${tone}" data-route="${route}"><small>${label}</small><strong>${value}</strong><span>${note}</span></button>`;
}

function table(headers, rows) {
  return `<div class="table"><div class="tr head">${headers.map((h) => `<span>${h}</span>`).join("")}</div>${rows.map((row) => `<div class="tr">${row.map((cell) => `<span>${cell}</span>`).join("")}</div>`).join("")}</div>`;
}

function forecastValue() {
  return state.data.opportunities.reduce((sum, opp) => sum + opp.estimated_value * (opp.probability / 100), 0);
}

function riskForClient(clientId) {
  const risk = state.data.risk_flags.find((item) => item.client_id === clientId);
  return risk ? badge(titleize(risk.severity), risk.severity) : badge("Low", "low");
}

function clientsPage() {
  const filtered = state.data.clients.filter((client) => state.clientFilter === "all" || client.relationship_stage === state.clientFilter);
  const selected = clientById(state.selectedClientId) || filtered[0];
  return pageShell(`
    ${header("Clients", "Portfolio view for business entities, not branches.", `<button class="primary" data-route="/new-log">${icon("plus")} Log Interaction</button>`)}
    <div class="toolbar">
      ${select("client-filter", state.clientFilter, [["all", "All stages"], ["prospect", "Prospect"], ["active", "Active"], ["at_risk", "At risk"], ["dormant", "Dormant"]])}
      <span>${filtered.length} clients</span>
    </div>
    <section class="split">
      <div class="client-list">${filtered.map(clientCard).join("")}</div>
      <div class="panel client-detail">${clientDetail(selected)}</div>
    </section>
  `);
}

function clientCard(client) {
  const openTaskCount = state.data.tasks.filter((task) => task.client_id === client.id && task.status !== "done").length;
  const openOppCount = state.data.opportunities.filter((opp) => opp.client_id === client.id && !["won", "lost"].includes(opp.stage)).length;
  return `<button class="client-card ${state.selectedClientId === client.id ? "selected" : ""}" data-client="${client.id}">
    <div><strong>${client.business_name}</strong><span>${client.industry}</span></div>
    <p>${badge(titleize(client.client_tier), client.client_tier)} ${badge(titleize(client.relationship_stage), client.relationship_stage)}</p>
    <small>${client.primary_contact_name} - ${client.city}, ${client.state}</small>
    <footer><span>${openTaskCount} open tasks</span><span>${openOppCount} opportunities</span></footer>
  </button>`;
}

function clientDetail(client) {
  const clientTasks = state.data.tasks.filter((task) => task.client_id === client.id);
  const clientOpps = state.data.opportunities.filter((opp) => opp.client_id === client.id);
  const clientRisks = state.data.risk_flags.filter((risk) => risk.client_id === client.id);
  const clientRefs = state.data.referrals.filter((ref) => ref.client_id === client.id);
  return `
    <div class="detail-head">
      <div><h2>${client.business_name}</h2><span>${client.primary_contact_name}, ${client.primary_contact_title}</span></div>
      <button class="primary" data-new-log-client="${client.id}">${icon("plus")} Log</button>
    </div>
    <div class="health ${client.relationship_stage}"><strong>${relationshipScore(client)}%</strong><span>Relationship health</span></div>
    <div class="tabs"><button>Overview</button><button>Interactions</button><button>Tasks</button><button>Pipeline</button><button>Risk</button><button>Referrals</button></div>
    <div class="detail-grid">
      <article><small>Industry</small><strong>${client.industry}</strong></article>
      <article><small>Revenue</small><strong>${titleize(client.annual_revenue_band)}</strong></article>
      <article><small>Last interaction</small><strong>${client.last_interaction}</strong></article>
      <article><small>Pipeline</small><strong>${money(clientOpps.reduce((sum, opp) => sum + opp.estimated_value, 0))}</strong></article>
    </div>
    <h3>Linked records</h3>
    <div class="record-stack">
      ${clientTasks.map((task) => `<article>${badge(titleize(task.priority), task.priority)}<strong>${task.title}</strong><span>Due ${task.due_date}</span></article>`).join("") || empty("No open tasks")}
      ${clientOpps.map((opp) => `<article>${badge(titleize(opp.stage), opp.stage)}<strong>${productTypes[opp.product_type]}</strong><span>${money(opp.estimated_value)} - ${opp.next_step}</span></article>`).join("")}
      ${clientRisks.map((risk) => `<article>${badge(titleize(risk.severity), risk.severity)}<strong>${titleize(risk.flag_type)}</strong><span>${risk.description}</span></article>`).join("")}
      ${clientRefs.map((ref) => `<article>${badge(titleize(ref.status), ref.status)}<strong>${referralUnits[ref.referred_to]}</strong><span>${ref.referral_reason}</span></article>`).join("")}
    </div>`;
}

function relationshipScore(client) {
  let score = 82;
  if (client.relationship_stage === "at_risk") score -= 28;
  if (client.relationship_stage === "dormant") score -= 24;
  score -= state.data.risk_flags.filter((risk) => risk.client_id === client.id).length * 8;
  return Math.max(35, score);
}

function tasksPage() {
  const visible = state.data.tasks.filter((task) => state.taskFilter === "all" || task.status === state.taskFilter);
  const groups = [
    ["Overdue", visible.filter((task) => task.due_date < "2026-04-26" && task.status !== "done")],
    ["Due Today", visible.filter((task) => task.due_date === "2026-04-26")],
    ["This Week", visible.filter((task) => task.due_date > "2026-04-26" && task.due_date <= "2026-05-03")],
    ["Later", visible.filter((task) => task.due_date > "2026-05-03")]
  ];
  return pageShell(`
    ${header("Tasks", "Your to-do list across the portfolio.")}
    <div class="toolbar sticky">${select("task-filter", state.taskFilter, [["all", "All statuses"], ["open", "Open"], ["in_progress", "In progress"], ["done", "Done"]])}<span>${visible.length} tasks</span></div>
    <section class="task-groups">${groups.map(([label, items]) => `<div class="panel"><div class="panel-title"><h2>${label}</h2>${badge(items.length, label === "Overdue" ? "high" : "neutral")}</div>${items.map(taskCard).join("") || empty(`Nothing ${label.toLowerCase()}`)}</div>`).join("")}</section>
  `);
}

function taskCard(task) {
  return `<article class="task-card">
    <div>${badge(titleize(task.priority), task.priority)} ${badge(titleize(task.status), task.status)}</div>
    <strong>${task.title}</strong>
    <span>${clientById(task.client_id).business_name}</span>
    <footer><small>Due ${task.due_date}</small><button data-done="${task.id}">Mark done</button></footer>
  </article>`;
}

function pipelinePage() {
  const stages = ["prospect", "discovery", "proposal", "negotiation", "won", "lost"];
  const filtered = state.data.opportunities.filter((opp) => state.pipelineFilter === "all" || opp.product_type === state.pipelineFilter);
  return pageShell(`
    ${header("Pipeline", `${money(filtered.reduce((sum, opp) => sum + opp.estimated_value, 0))} active book with ${money(forecastValue())} weighted forecast.`)}
    <div class="toolbar">${select("pipeline-filter", state.pipelineFilter, [["all", "All products"], ...Object.keys(productTypes).map((key) => [key, productTypes[key]])])}</div>
    <section class="kanban">${stages.map((stage) => {
      const items = filtered.filter((opp) => opp.stage === stage);
      return `<div class="stage"><div class="stage-title"><h2>${titleize(stage)}</h2><span>${money(items.reduce((sum, opp) => sum + opp.estimated_value, 0))}</span></div>${items.map(oppCard).join("") || empty("No deals")}</div>`;
    }).join("")}</section>
  `);
}

function oppCard(opp) {
  return `<article class="opp-card">
    <strong>${productTypes[opp.product_type]}</strong>
    <span>${clientById(opp.client_id).business_name}</span>
    <b>${money(opp.estimated_value)}</b>
    <small>${opp.probability}% probability - Close ${opp.expected_close_date}</small>
    <label>Move stage ${select(`opp-stage-${opp.id}`, opp.stage, [["prospect", "Prospect"], ["discovery", "Discovery"], ["proposal", "Proposal"], ["negotiation", "Negotiation"], ["won", "Won"], ["lost", "Lost"]])}</label>
  </article>`;
}

function logsPage() {
  const risks = state.riskFilter === "all" ? state.data.risk_flags : state.data.risk_flags.filter((risk) => risk.severity === state.riskFilter || String(risk.regulatory_flag) === state.riskFilter);
  return pageShell(`
    ${header("Logs & Risk Flags", "Interaction history with compliance-aware risk visibility.")}
    <section class="dashboard-grid">
      <div class="panel span-2"><div class="panel-title"><h2>Interaction logs</h2>${badge(state.data.interaction_logs.length, "blue")}</div>
        ${state.data.interaction_logs.map((log) => `<article class="log-row"><strong>${clientById(log.client_id).business_name}</strong><span>${log.summary}</span><small>${titleize(log.interaction_type)} - ${log.interaction_date}</small></article>`).join("")}
      </div>
      <div class="panel">
        <div class="panel-title"><h2>Risk flags</h2>${select("risk-filter", state.riskFilter, [["all", "All"], ["true", "Regulatory"], ["critical", "Critical"], ["high", "High"]])}</div>
        ${risks.map((risk) => `<article class="risk-row ${risk.severity}"><div>${badge(titleize(risk.severity), risk.severity)} ${risk.regulatory_flag ? badge("Compliance", "warning") : ""}</div><strong>${clientById(risk.client_id).business_name}</strong><span>${risk.description}</span><small>${risk.action_taken}</small></article>`).join("")}
      </div>
    </section>
  `);
}

function referralsPage() {
  const filtered = state.data.referrals.filter((ref) => state.referralFilter === "all" || ref.status === state.referralFilter);
  const converted = state.data.referrals.filter((ref) => ref.status === "converted").length;
  return pageShell(`
    ${header("Referrals", `${Math.round((converted / state.data.referrals.length) * 100)}% conversion across warm hand-offs.`)}
    <div class="toolbar">${select("referral-filter", state.referralFilter, [["all", "All statuses"], ["pending", "Pending"], ["sent", "Sent"], ["accepted", "Accepted"], ["converted", "Converted"]])}</div>
    <section class="cards-grid">${filtered.map((ref) => `<article class="panel referral-card"><div>${badge(titleize(ref.status), ref.status)}</div><h2>${referralUnits[ref.referred_to]}</h2><strong>${clientById(ref.client_id).business_name}</strong><p>${ref.referral_reason}</p><small>Contact: ${ref.contact_name || "Not specified"}</small><button data-advance-referral="${ref.id}">Advance status</button></article>`).join("")}</section>
  `);
}

function newLogPage() {
  return pageShell(`
    ${header("New Log", "Capture post-meeting notes and convert them into reviewable records.")}
    <section class="form-layout">
      <form class="panel capture-form" id="new-log-form">
        <label>Client ${select("draft-client", state.draft.client_id, state.data.clients.map((client) => [client.id, client.business_name]))}</label>
        <div class="two-col">
          <label>Interaction type ${select("draft-interaction", state.draft.interaction_type, [["in_person_meeting", "In-person meeting"], ["phone_call", "Phone call"], ["site_visit", "Site visit"], ["video_call", "Video call"], ["email_summary", "Email summary"], ["annual_review", "Annual review"], ["other", "Other"]])}</label>
          <label>Source type ${select("draft-source", state.draft.source_type, [["voice", "Voice"], ["typed", "Typed"], ["dictated", "Dictated"], ["email_summary", "Email summary"]])}</label>
        </div>
        <label>Interaction date <input type="date" id="draft-date" value="${state.draft.interaction_date}" /></label>
        <label>Meeting Notes <textarea id="draft-notes" rows="11" placeholder="Dictate or type meeting notes here. Mention follow-ups, product needs, risk concerns, and referral commitments.">${state.draft.raw_transcript}</textarea></label>
        <div class="form-footer"><span>${state.draft.raw_transcript.length} characters</span><button class="primary" type="submit">Parse & Review</button></div>
      </form>
      <aside class="panel">
        <div class="panel-title"><h2>Recent clients</h2></div>
        ${state.data.clients.slice(0, 3).map((client) => `<button class="recent-client" data-draft-client="${client.id}"><strong>${client.business_name}</strong><span>${client.last_interaction}</span></button>`).join("")}
        <div class="secure-note">${icon("lock")}<div><strong>Bank-grade privacy</strong><span>Demo data stays local in this prototype.</span></div></div>
      </aside>
    </section>
    ${state.parsed ? parsedReview() : ""}
  `);
}

function parsedReview() {
  const parsed = state.parsed;
  return `<section class="panel review-panel" id="parsed-review">
    <div class="panel-title"><h2>Parsed Review</h2>${parsed.risk_flags.some((risk) => risk.regulatory_flag) ? badge("Regulatory review", "warning") : badge("Ready", "blue")}</div>
    ${reviewSection("Summary", `<textarea id="parsed-summary">${parsed.summary}</textarea>`)}
    ${reviewSection(`Follow-Up Tasks (${parsed.tasks.length})`, parsed.tasks.map((task, index) => reviewItem("task", index, task.title, `${titleize(task.priority)} - Due ${task.due_date || "not set"}`)).join(""))}
    ${reviewSection(`Pipeline Opportunities (${parsed.opportunities.length})`, parsed.opportunities.map((opp, index) => reviewItem("opportunity", index, productTypes[opp.product_type], `${money(opp.estimated_value)} - ${titleize(opp.stage)}`)).join(""))}
    ${reviewSection(`Risk Flags (${parsed.risk_flags.length})`, parsed.risk_flags.map((risk, index) => reviewItem("risk", index, titleize(risk.flag_type), `${titleize(risk.severity)} ${risk.regulatory_flag ? "- Regulatory" : ""}`)).join(""))}
    ${reviewSection(`Referrals (${parsed.referrals.length})`, parsed.referrals.map((ref, index) => reviewItem("referral", index, referralUnits[ref.referred_to], ref.referral_reason)).join(""))}
    ${reviewSection(`Product Mentions (${parsed.product_mentions.length})`, parsed.product_mentions.map((mention, index) => reviewItem("mention", index, mention.product_name, titleize(mention.mention_context))).join(""))}
    <footer class="approve-bar"><button data-add-review-item>Add item</button><button class="primary" data-approve>Approve and Save</button></footer>
  </section>`;
}

function reviewSection(title, body) {
  return `<details open class="review-section"><summary>${title}</summary>${body}</details>`;
}

function reviewItem(type, index, title, detail) {
  return `<article class="review-item"><div><strong contenteditable="true">${title}</strong><span contenteditable="true">${detail}</span></div><button data-delete-review="${type}:${index}">Delete</button></article>`;
}

function settingsPage() {
  return pageShell(`
    ${header("Settings", "Team management and future enterprise licensing hooks.")}
    <section class="dashboard-grid">
      <div class="panel"><h2>Profile</h2><div class="settings-row"><span>Name</span><strong>${rm.full_name}</strong></div><div class="settings-row"><span>Role</span><strong>${titleize(rm.role)}</strong></div><div class="settings-row"><span>Market</span><strong>${rm.market}</strong></div></div>
      <div class="panel"><h2>Subscription plan</h2><p>Prepared for future solo RM and full-team licensing. Billing is intentionally not implemented.</p>${badge("Enterprise-ready structure", "blue")}</div>
      <div class="panel"><h2>Security posture</h2><p>Supabase auth, row-level security rules, and AI run audit records are documented for backend connection.</p>${badge("RLS planned", "warning")}</div>
    </section>
  `);
}

function empty(text) {
  return `<div class="empty">${text}</div>`;
}

function select(id, value, options) {
  return `<select id="${id}">${options.map(([optionValue, label]) => `<option value="${optionValue}" ${String(optionValue) === String(value) ? "selected" : ""}>${label}</option>`).join("")}</select>`;
}

function routeContent() {
  if (state.route === "/login" || state.route === "/signup") return authPage(state.route);
  if (state.route.startsWith("/clients")) return clientsPage();
  if (state.route === "/tasks") return tasksPage();
  if (state.route === "/pipeline") return pipelinePage();
  if (state.route === "/referrals") return referralsPage();
  if (state.route === "/logs") return logsPage();
  if (state.route === "/settings") return settingsPage();
  if (state.route === "/new-log") return newLogPage();
  return dashboard();
}

function authPage(route) {
  const signup = route === "/signup";
  return `<main class="auth-screen"><section class="auth-card"><div class="brand"><span class="brand-mark">R</span><div><strong>RelationshipOS</strong><small>Citizens Business Banking</small></div></div><h1>${signup ? "Create your profile" : "Welcome back"}</h1><p>Secure access for relationship managers, team leads, support associates, and admins.</p>${signup ? '<label>Full name<input value="Dean Cherouri" /></label>' : ""}<label>Email<input value="${rm.email}" /></label><label>Password<input type="password" value="relationshipos" /></label><button class="primary" data-route="/dashboard">${signup ? "Create account" : "Sign in"}</button><button data-route="${signup ? "/login" : "/signup"}">${signup ? "Use existing account" : "Create account"}</button></section></main>`;
}

function parseDraft() {
  const notes = state.draft.raw_transcript.trim();
  if (!notes || !state.draft.client_id) {
    window.alert("Choose a client and add meeting notes before parsing.");
    return;
  }
  const hasRisk = /kyc|fraud|delinquen|late|payment|compliance/i.test(notes);
  const hasTreasury = /treasury|payables|cash|positive pay/i.test(notes);
  const hasLoan = /loan|credit|financing|line/i.test(notes);
  state.parsed = {
    summary: `Client discussed ${hasLoan ? "financing needs" : "relationship updates"}${hasTreasury ? " and treasury management opportunities" : ""}. ${hasRisk ? "A follow-up risk item requires attention." : "No regulatory concern was identified from the notes."}`,
    tasks: [{ title: "Follow up on meeting commitments", description: "Confirm next steps with client.", priority: hasRisk ? "high" : "medium", assigned_to: null, due_date: "2026-04-30" }],
    opportunities: hasLoan || hasTreasury ? [{ product_type: hasTreasury ? "treasury_management" : "line_of_credit", stage: "discovery", estimated_value: null, probability: null, expected_close_date: null, next_step: "Schedule specialist review", notes: "Created from meeting note parser." }] : [],
    risk_flags: hasRisk ? [{ flag_type: /kyc/i.test(notes) ? "kyc_due" : "relationship_risk", severity: /fraud|kyc|delinquen/i.test(notes) ? "high" : "medium", description: "Potential risk surfaced in notes for RM review.", action_taken: "Pending RM approval.", regulatory_flag: /kyc|fraud/i.test(notes), requires_followup: true }] : [],
    referrals: hasTreasury ? [{ referred_to: "treasury_specialists", referral_reason: "Client discussed treasury management need.", contact_name: null, notes: "Confirm warm hand-off." }] : [],
    product_mentions: [{ product_name: hasTreasury ? "Treasury Management" : hasLoan ? "Line of Credit" : "Business Banking", mention_context: "client_asked", notes: "Captured from meeting notes." }]
  };
}

function approveParsed() {
  const logId = `log-${Date.now()}`;
  const clientId = state.draft.client_id;
  state.data.interaction_logs.unshift({
    id: logId,
    client_id: clientId,
    interaction_type: state.draft.interaction_type,
    source_type: state.draft.source_type,
    interaction_date: state.draft.interaction_date,
    raw_transcript: state.draft.raw_transcript,
    summary: state.parsed.summary,
    status: "approved"
  });
  state.parsed.tasks.forEach((task, index) => state.data.tasks.unshift({ ...task, id: `task-${Date.now()}-${index}`, client_id: clientId, interaction_log_id: logId, status: "open" }));
  state.parsed.opportunities.forEach((opp, index) => state.data.opportunities.unshift({ ...opp, id: `opp-${Date.now()}-${index}`, client_id: clientId, interaction_log_id: logId, estimated_value: opp.estimated_value || 0, probability: opp.probability || 20 }));
  state.parsed.risk_flags.forEach((risk, index) => state.data.risk_flags.unshift({ ...risk, id: `risk-${Date.now()}-${index}`, client_id: clientId, interaction_log_id: logId }));
  state.parsed.referrals.forEach((ref, index) => state.data.referrals.unshift({ ...ref, id: `ref-${Date.now()}-${index}`, client_id: clientId, interaction_log_id: logId, status: "pending" }));
  state.parsed.product_mentions.forEach((mention, index) => state.data.product_mentions.unshift({ ...mention, id: `pm-${Date.now()}-${index}`, client_id: clientId, interaction_log_id: logId }));
  state.parsed = null;
  state.draft.raw_transcript = "";
  setRoute("/dashboard");
}

function bindEvents() {
  document.querySelectorAll("[data-route]").forEach((button) => button.addEventListener("click", () => setRoute(button.dataset.route)));
  document.querySelectorAll("[data-client]").forEach((button) => button.addEventListener("click", () => { state.selectedClientId = button.dataset.client; render(); }));
  document.querySelectorAll("[data-new-log-client]").forEach((button) => button.addEventListener("click", () => { state.draft.client_id = button.dataset.newLogClient; setRoute("/new-log"); }));
  document.querySelectorAll("[data-draft-client]").forEach((button) => button.addEventListener("click", () => { state.draft.client_id = button.dataset.draftClient; render(); }));
  document.querySelectorAll("[data-done]").forEach((button) => button.addEventListener("click", () => { state.data.tasks.find((task) => task.id === button.dataset.done).status = "done"; render(); }));
  document.querySelectorAll("[data-advance-referral]").forEach((button) => button.addEventListener("click", () => {
    const referral = state.data.referrals.find((ref) => ref.id === button.dataset.advanceReferral);
    const order = ["pending", "sent", "accepted", "converted"];
    referral.status = order[Math.min(order.indexOf(referral.status) + 1, order.length - 1)];
    render();
  }));
  document.querySelector("[data-approve]")?.addEventListener("click", approveParsed);
  document.querySelector("[data-add-review-item]")?.addEventListener("click", () => { state.parsed.tasks.push({ title: "New follow-up", description: "", priority: "medium", assigned_to: null, due_date: null }); render(); });
  document.querySelectorAll("[data-delete-review]").forEach((button) => button.addEventListener("click", () => {
    const [type, index] = button.dataset.deleteReview.split(":");
    const keys = { task: "tasks", opportunity: "opportunities", risk: "risk_flags", referral: "referrals", mention: "product_mentions" };
    state.parsed[keys[type]].splice(Number(index), 1);
    render();
  }));
  document.getElementById("client-filter")?.addEventListener("change", (event) => { state.clientFilter = event.target.value; render(); });
  document.getElementById("task-filter")?.addEventListener("change", (event) => { state.taskFilter = event.target.value; render(); });
  document.getElementById("pipeline-filter")?.addEventListener("change", (event) => { state.pipelineFilter = event.target.value; render(); });
  document.getElementById("risk-filter")?.addEventListener("change", (event) => { state.riskFilter = event.target.value; render(); });
  document.getElementById("referral-filter")?.addEventListener("change", (event) => { state.referralFilter = event.target.value; render(); });
  document.querySelectorAll("[id^='opp-stage-']").forEach((selectEl) => selectEl.addEventListener("change", (event) => {
    const id = event.target.id.replace("opp-stage-", "");
    state.data.opportunities.find((opp) => opp.id === id).stage = event.target.value;
    render();
  }));
  document.getElementById("draft-client")?.addEventListener("change", (event) => { state.draft.client_id = event.target.value; });
  document.getElementById("draft-interaction")?.addEventListener("change", (event) => { state.draft.interaction_type = event.target.value; });
  document.getElementById("draft-source")?.addEventListener("change", (event) => { state.draft.source_type = event.target.value; });
  document.getElementById("draft-date")?.addEventListener("change", (event) => { state.draft.interaction_date = event.target.value; });
  document.getElementById("draft-notes")?.addEventListener("input", (event) => { state.draft.raw_transcript = event.target.value; });
  document.getElementById("new-log-form")?.addEventListener("submit", (event) => { event.preventDefault(); parseDraft(); render(); setTimeout(() => document.getElementById("parsed-review")?.scrollIntoView({ behavior: "smooth" }), 50); });
}

function render() {
  if (!routes.includes(state.route) && !["/login", "/signup"].includes(state.route)) state.route = "/dashboard";
  document.getElementById("app").innerHTML = routeContent();
  bindEvents();
}

window.addEventListener("popstate", () => {
  state.route = window.location.pathname;
  render();
});

render();
