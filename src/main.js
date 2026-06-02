import { blueprints, navItems, pdfPath, qaTests, secrets, steps, troubleshooting } from "./data.js";
import "./styles.css";

const storageKey = "agentLovableGuideState";

const state = {
  activeSection: "overview",
  activeStepId: "architecture",
  query: "",
  completed: new Set(),
  copied: "",
  compact: false
};

const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
if (Array.isArray(saved.completed)) state.completed = new Set(saved.completed);
if (saved.activeStepId && steps.some((step) => step.id === saved.activeStepId)) {
  state.activeStepId = saved.activeStepId;
  state.activeSection = steps.find((step) => step.id === saved.activeStepId).section;
}

function save() {
  localStorage.setItem(storageKey, JSON.stringify({
    completed: [...state.completed],
    activeStepId: state.activeStepId
  }));
}

function byId(id) {
  return document.getElementById(id);
}

function icon(name) {
  const icons = {
    home: '<path d="M3 11 12 4l9 7v8a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z"/>',
    workflow: '<path d="M6 6h.01M18 6h.01M6 18h.01M18 18h.01M8 6h8M6 8v8M18 8v8M8 18h8"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5"/>',
    server: '<path d="M4 5h16v6H4zM4 13h16v6H4zM8 8h.01M8 16h.01"/>',
    message: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>',
    clipboard: '<path d="M9 4h6l1 2h3v15H5V6h3zM9 4a3 3 0 0 1 6 0M8 11h8M8 15h6"/>',
    user: '<path d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10"/>',
    card: '<path d="M3 6h18v12H3zM3 10h18M7 15h4"/>',
    check: '<path d="m5 13 4 4L19 7"/>',
    rocket: '<path d="M5 15c-1 1-2 4-2 4s3-1 4-2M9 15l-3-3 6-6c3-3 7-3 9-3 0 2 0 6-3 9l-6 6zM15 9h.01"/>',
    route: '<path d="M6 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 13V9a4 4 0 0 1 4-4h5M9 16h5a4 4 0 0 0 4-4v-1"/>',
    alert: '<path d="M12 4 3 20h18zM12 9v5M12 17h.01"/>',
    search: '<path d="m21 21-4.3-4.3M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16"/>',
    copy: '<path d="M8 8h11v11H8zM5 16H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v1"/>',
    external: '<path d="M14 3h7v7M21 3l-9 9M20 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    lock: '<path d="M7 10V8a5 5 0 0 1 10 0v2M6 10h12v11H6zM12 15v2"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>'
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.check}</svg>`;
}

function activeStep() {
  return steps.find((step) => step.id === state.activeStepId) || steps[0];
}

function visibleSteps() {
  const query = state.query.trim().toLowerCase();
  return steps.filter((step) => {
    const sectionMatch = query || state.activeSection === "all" || step.section === state.activeSection;
    const searchText = [step.title, step.goal, step.outcome, step.prompt, ...(step.checklist || [])].join(" ").toLowerCase();
    return sectionMatch && (!query || searchText.includes(query));
  });
}

function pct() {
  return Math.round((state.completed.size / steps.length) * 100);
}

function sectionProgress(sectionId) {
  const group = steps.filter((step) => step.section === sectionId);
  if (!group.length) return "";
  return `${group.filter((step) => state.completed.has(step.id)).length}/${group.length}`;
}

function shell(content) {
  return `
    <aside class="sidebar ${state.compact ? "open" : ""}">
      <div class="brand">
        <span>AG</span>
        <div><strong>Agent Builder</strong><small>to Lovable guide</small></div>
      </div>
      <nav>
        ${navItems.map((item) => `
          <button class="nav-item ${state.activeSection === item.id ? "active" : ""}" data-section="${item.id}">
            ${icon(item.icon)}
            <span>${item.label}</span>
            <em>${sectionProgress(item.id)}</em>
          </button>
        `).join("")}
      </nav>
      <button class="nav-item all-steps ${state.activeSection === "all" ? "active" : ""}" data-section="all">
        ${icon("workflow")}<span>All Steps</span><em>${state.completed.size}/${steps.length}</em>
      </button>
      <a class="pdf-link" href="${pdfPath}" target="_blank" rel="noreferrer">${icon("external")} Open PDF</a>
      <div class="helper-card">
        ${icon("lock")}
        <strong>Security rule</strong>
        <span>OPENAI_API_KEY belongs on the backend only. Never in frontend code.</span>
      </div>
    </aside>
    <main class="workspace">
      <button class="mobile-menu" data-menu>${icon("menu")} Menu</button>
      ${content}
    </main>
  `;
}

function header() {
  return `
    <header class="topbar">
      <div>
        <h1>Agent Builder to Lovable</h1>
        <p>Navigate the PDF as a practical build dashboard for adding Agent Builder workflows to Lovable apps.</p>
      </div>
      <div class="top-actions">
        <span class="status-dot">Project Status: ${pct()}%</span>
        <button class="ghost" data-reset>Reset Progress</button>
      </div>
    </header>
  `;
}

function progressRail() {
  return `
    <section class="progress-panel">
      <div class="progress-head">
        <strong>Your progress: ${state.completed.size} of ${steps.length} steps completed</strong>
        <span>${pct()}%</span>
      </div>
      <div class="progress-track"><span style="width:${pct()}%"></span></div>
      <div class="step-strip">
        ${steps.map((step, index) => `
          <button class="step-chip ${state.completed.has(step.id) ? "done" : ""} ${state.activeStepId === step.id ? "selected" : ""}" data-step="${step.id}">
            <b>${state.completed.has(step.id) ? "✓" : index + 1}</b>
            <span>${step.title}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function searchAndList() {
  const list = visibleSteps();
  return `
    <section class="guide-list">
      <label class="search-box">${icon("search")}<input id="search" value="${escapeAttr(state.query)}" placeholder="Search prompts, secrets, QA, deployment..." /></label>
      <div class="list-count">${list.length} guide items</div>
      <div class="list-items">
        ${list.map((step) => `
          <button class="guide-row ${state.activeStepId === step.id ? "active" : ""}" data-step="${step.id}">
            <span class="${state.completed.has(step.id) ? "complete" : ""}">${state.completed.has(step.id) ? "✓" : steps.indexOf(step) + 1}</span>
            <div><strong>${step.title}</strong><small>${step.goal}</small></div>
          </button>
        `).join("") || `<p class="empty">No guide items match that search.</p>`}
      </div>
    </section>
  `;
}

function stepDetail(step) {
  const currentIndex = steps.indexOf(step);
  const previous = steps[currentIndex - 1];
  const next = steps[currentIndex + 1];
  return `
    <article class="detail-panel">
      <div class="detail-header">
        <div>
          <span class="section-label">${navItems.find((item) => item.id === step.section)?.label || "Guide"}</span>
          <h2>${currentIndex + 1}. ${step.title}</h2>
          <p>${step.goal}</p>
        </div>
        <button class="complete-button ${state.completed.has(step.id) ? "done" : ""}" data-complete="${step.id}">
          ${state.completed.has(step.id) ? "Completed" : "Mark Complete"}
        </button>
      </div>
      <div class="outcome">
        <strong>Result you want</strong>
        <span>${step.outcome}</span>
      </div>
      <div class="detail-grid">
        <section class="checklist-card">
          <h3>Step Checklist</h3>
          ${step.checklist.map((item, index) => `
            <label class="check-row">
              <input type="checkbox" ${state.completed.has(step.id) ? "checked" : ""} />
              <span><b>${index + 1}</b>${item}</span>
            </label>
          `).join("")}
        </section>
        <section class="copy-card">
          <div class="card-title">
            <h3>Lovable Prompt</h3>
            <button class="copy-button" data-copy="${encodeURIComponent(step.prompt || "")}">${icon("copy")} ${state.copied === step.prompt ? "Copied" : "Copy"}</button>
          </div>
          <pre>${escapeHtml(step.prompt || "No prompt needed for this step.")}</pre>
          ${step.snippet ? `
            <div class="card-title snippet-title">
              <h3>${step.snippetTitle}</h3>
              <button class="copy-button" data-copy="${encodeURIComponent(step.snippet)}">${icon("copy")} Copy</button>
            </div>
            <pre class="code">${escapeHtml(step.snippet)}</pre>
          ` : ""}
        </section>
      </div>
      ${step.security ? `<div class="security-note">${icon("lock")}<div><strong>Security reminder</strong><span>${step.security}</span></div></div>` : ""}
      <footer class="step-footer">
        ${previous ? `<button class="ghost" data-step="${previous.id}">Previous: ${previous.title}</button>` : "<span></span>"}
        ${next ? `<button class="primary" data-step="${next.id}">Next: ${next.title} ${icon("arrow")}</button>` : `<button class="primary" data-section="qa">Review QA ${icon("arrow")}</button>`}
      </footer>
    </article>
  `;
}

function rightRail(step) {
  const next = steps.find((item) => !state.completed.has(item.id)) || steps[steps.length - 1];
  return `
    <aside class="right-rail">
      <section class="rail-card">
        <h3>Quick Actions</h3>
        <button data-step="workflow">${icon("workflow")} Draft Agent Instructions</button>
        <button data-step="backend-session">${icon("server")} Build Session Endpoint</button>
        <button data-step="frontend-chatkit">${icon("message")} Wire ChatKit Page</button>
        <button data-step="qa">${icon("check")} Run QA Prompt</button>
      </section>
      <section class="rail-card">
        <h3>Required Secrets</h3>
        <div class="secret-table">
          ${secrets.slice(0, 5).map((secret) => `<div><strong>${secret.name}</strong><span>${secret.area}</span></div>`).join("")}
        </div>
      </section>
      <section class="rail-card next-card">
        <h3>Next Best Step</h3>
        <strong>${next.title}</strong>
        <p>${next.outcome}</p>
        <button class="primary wide" data-step="${next.id}">Open Step</button>
      </section>
      <section class="rail-card">
        <h3>Current Focus</h3>
        <p>${step.outcome}</p>
      </section>
    </aside>
  `;
}

function overviewPanels() {
  return `
    <section class="summary-grid">
      <article><small>Security principle</small><strong>API key never reaches browser code</strong><span>Frontend receives only client_secret.</span></article>
      <article><small>Build style</small><strong>Small Lovable passes</strong><span>Shell, endpoint, widget, auth, usage, billing.</span></article>
      <article><small>Deployment path</small><strong>Agent Builder + ChatKit</strong><span>Published wf_ workflow embedded in /agent.</span></article>
      <article><small>Best first agent</small><strong>Product support assistant</strong><span>Easy to validate and reuse.</span></article>
    </section>
  `;
}

function workflowPanel() {
  const phases = [
    ["1", "Orient", "Read Overview and Use Workflow so the request path makes sense."],
    ["2", "Prepare OpenAI", "Create, test, publish, and copy the wf_ workflow ID."],
    ["3", "Prepare Lovable", "Generate the app shell and add server-side secrets."],
    ["4", "Build Secure Core", "Create /api/chatkit/session before touching frontend ChatKit."],
    ["5", "Add Chat UI", "Wire @openai/chatkit-react to the backend endpoint."],
    ["6", "Harden Product", "Add auth, user IDs, usage tracking, and backend limits."],
    ["7", "Monetize Later", "Add Stripe only after the assistant works reliably."],
    ["8", "QA and Deploy", "Run the QA prompt, deploy, smoke test, then troubleshoot."],
  ];
  return `
    <section class="workflow-panel">
      <div class="panel-title">
        <h3>Website Usage Workflow</h3>
        <span>Follow left to right</span>
      </div>
      <div class="workflow-board">
        ${phases.map(([number, title, text], index) => `
          <button class="workflow-card" data-step="${index === 0 ? "site-workflow" : index === 1 ? "openai-project" : index === 2 ? "lovable-shell" : index === 3 ? "backend-session" : index === 4 ? "frontend-chatkit" : index === 5 ? "auth" : index === 6 ? "stripe" : "qa"}">
            <b>${number}</b>
            <strong>${title}</strong>
            <span>${text}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function qaPanel() {
  return `
    <section class="matrix-panel">
      <div class="panel-title"><h3>Testing Matrix</h3><button class="copy-button" data-copy="${encodeURIComponent(steps.find((step) => step.id === "qa").prompt)}">${icon("copy")} Copy QA Prompt</button></div>
      <div class="matrix">
        <div class="matrix-head"><span>Test</span><span>How</span><span>Expected result</span></div>
        ${qaTests.map(([test, how, expected]) => `<div><strong>${test}</strong><span>${how}</span><span>${expected}</span></div>`).join("")}
      </div>
    </section>
  `;
}

function blueprintPanel() {
  return `
    <section class="blueprint-panel">
      <div class="panel-title"><h3>Complete Implementation Blueprint</h3><span>Follow in order</span></div>
      <ol>${blueprints.map((item, index) => `<li class="${index < state.completed.size ? "soft-done" : ""}">${item}</li>`).join("")}</ol>
    </section>
  `;
}

function troubleshootingPanel() {
  return `
    <section class="troubleshoot-panel">
      <div class="panel-title"><h3>Troubleshooting</h3><span>Common failures from the guide</span></div>
      ${troubleshooting.map((item) => `
        <details>
          <summary><strong>${item.problem}</strong><span>${item.cause}</span></summary>
          <p>${item.fix}</p>
        </details>
      `).join("")}
    </section>
  `;
}

function render() {
  const step = activeStep();
  byId("app").innerHTML = shell(`
    ${header()}
    ${progressRail()}
    ${overviewPanels()}
    ${state.activeSection === "workflow" || state.activeSection === "overview" || activeStep().section === "workflow" ? workflowPanel() : ""}
    <div class="content-grid">
      ${searchAndList()}
      ${stepDetail(step)}
      ${rightRail(step)}
    </div>
    ${state.activeSection === "qa" || step.section === "qa" ? qaPanel() : ""}
    ${state.activeSection === "deployment" || state.activeSection === "all" ? blueprintPanel() : ""}
    ${state.activeSection === "troubleshooting" || step.section === "troubleshooting" ? troubleshootingPanel() : ""}
  `);
  bind();
}

function bind() {
  document.querySelectorAll("[data-section]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeSection = button.dataset.section;
      const first = visibleSteps()[0];
      if (first) state.activeStepId = first.id;
      state.compact = false;
      save();
      render();
    });
  });

  document.querySelectorAll("[data-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const step = steps.find((item) => item.id === button.dataset.step);
      if (!step) return;
      state.activeStepId = step.id;
      state.activeSection = step.section;
      state.compact = false;
      save();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  document.querySelectorAll("[data-complete]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.complete;
      if (state.completed.has(id)) state.completed.delete(id);
      else state.completed.add(id);
      save();
      render();
    });
  });

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const value = decodeURIComponent(button.dataset.copy || "");
      await navigator.clipboard.writeText(value);
      state.copied = value;
      render();
      setTimeout(() => {
        state.copied = "";
        render();
      }, 1200);
    });
  });

  const search = byId("search");
  if (search) {
    search.addEventListener("input", (event) => {
      state.query = event.target.value;
      render();
      byId("search")?.focus();
    });
  }

  document.querySelector("[data-reset]")?.addEventListener("click", () => {
    state.completed.clear();
    save();
    render();
  });

  document.querySelector("[data-menu]")?.addEventListener("click", () => {
    state.compact = !state.compact;
    render();
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('"', "&quot;");
}

render();
