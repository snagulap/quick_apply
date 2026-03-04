// QuickApply v3 — LetMeApply-style Sidebar
(function () {
  'use strict';
  if (document.getElementById('qa-sidebar')) return;

  function getPlatform() {
    const h = location.hostname;
    if (h.includes('linkedin.com'))  return 'LinkedIn';
    if (h.includes('indeed.com'))    return 'Indeed';
    if (h.includes('glassdoor.com')) return 'Glassdoor';
    if (h.includes('greenhouse.io')) return 'Greenhouse';
    if (h.includes('lever.co'))      return 'Lever';
    if (h.includes('workday.com'))   return 'Workday';
    return 'Job Board';
  }
  const PLATFORM = getPlatform();

  // ── Inject sidebar ────────────────────────────────────────
  const sidebar = document.createElement('div');
  sidebar.id = 'qa-sidebar';
  sidebar.innerHTML = `
  <div class="qa-hdr">
    <div class="qa-logo">
      <div class="qa-logo-icon">Q</div>
      <div class="qa-logo-name">Quick<span>Apply</span></div>
    </div>
    <div class="qa-hdr-right">
      <div class="qa-credits-badge" id="qa-cred-badge" onclick="qaOpenPricing()">⚡ <span id="qa-cred-text">3 credits</span></div>
      <button class="qa-plan-btn" id="qa-plan-btn" onclick="qaOpenPricing()">FREE</button>
      <button class="qa-close-btn" onclick="document.getElementById('qa-sidebar').classList.remove('qa-open')" title="Close">✕</button>
    </div>
  </div>

  <div class="qa-job-bar">
    <div class="qa-job-title" id="qa-job-title">Open a job posting to begin</div>
    <div class="qa-job-meta" id="qa-job-meta"><span>${PLATFORM}</span></div>
    <button class="qa-reload-btn" id="qa-reload-btn">↻ Reload Job Details</button>
  </div>

  <div class="qa-tabs">
    <div class="qa-tab qa-active" data-p="apply">Apply</div>
    <div class="qa-tab" data-p="cv">CV Align</div>
    <div class="qa-tab" data-p="ai">AI Tools</div>
    <div class="qa-tab" data-p="tracker">Tracker</div>
    <div class="qa-tab" data-p="settings">Settings</div>
  </div>

  <div class="qa-body">

    <!-- APPLY TAB -->
    <div class="qa-panel qa-active" id="qa-p-apply">
      <div class="qa-meter">
        <div class="qa-meter-top">
          <span class="qa-meter-label">AI Credits</span>
          <span class="qa-meter-count" id="qa-meter-count">3 / 3 daily</span>
        </div>
        <div class="qa-meter-bar"><div class="qa-meter-fill" id="qa-meter-fill" style="width:100%"></div></div>
        <div class="qa-meter-hint">Free plan resets daily. <a onclick="qaOpenPricing()">Upgrade for unlimited →</a></div>
      </div>

      <div class="qa-card">
        <div class="qa-card-title">📋 Auto-Fill Application</div>
        <div class="qa-card-desc">Automatically fill all form fields on this page from your saved profile.</div>
        <button class="qa-btn qa-btn-green" id="qa-fill-btn">⚡ Auto-Fill This Page</button>
      </div>

      <div class="qa-card">
        <div class="qa-card-title">✉️ Cover Letter <span class="qa-chip qa-chip-ai">AI</span></div>
        <div class="qa-card-desc">Generate and insert a tailored cover letter into this application form.</div>
        <button class="qa-btn qa-btn-outline" id="qa-quick-cl-btn">✨ Generate &amp; Insert Cover Letter</button>
        <div class="qa-output" id="qa-quick-cl-out"></div>
      </div>
    </div>

    <!-- CV ALIGN TAB -->
    <div class="qa-panel" id="qa-p-cv">
      <div class="qa-card">
        <div class="qa-card-title">📊 ATS Score <span class="qa-chip qa-chip-ai">AI</span></div>
        <div class="qa-card-desc">Paste the job description to score your CV against it and see missing keywords.</div>
        <div class="qa-field"><label>Job Description</label>
          <textarea id="qa-cv-jd" placeholder="Paste the full job description here..."></textarea>
        </div>
        <button class="qa-btn qa-btn-green" id="qa-analyze-btn">📊 Analyze &amp; Score My CV</button>

        <div id="qa-ats-result" style="display:none">
          <div class="qa-ats-wrap">
            <div class="qa-ats-ring">
              <svg viewBox="0 0 90 90">
                <circle class="qa-ring-bg" cx="45" cy="45" r="35"/>
                <circle class="qa-ring-fill" id="qa-ring" cx="45" cy="45" r="35"/>
              </svg>
              <div class="qa-ats-center">
                <span class="qa-ats-pct" id="qa-ats-pct">0%</span>
                <span class="qa-ats-sub">ATS Match</span>
              </div>
            </div>
            <div class="qa-ats-verdict" id="qa-ats-verdict"></div>
          </div>
          <div class="qa-kw-label">Missing Keywords — click to copy</div>
          <div class="qa-pills" id="qa-kw-miss"></div>
          <div class="qa-kw-label" style="margin-top:8px">Found in Your CV</div>
          <div class="qa-pills" id="qa-kw-have"></div>
          <div style="margin-top:12px">
            <button class="qa-btn qa-btn-gold" id="qa-rewrite-btn">✨ Rewrite CV to 100% Match <span class="qa-chip qa-chip-pro">PRO</span></button>
            <div style="font-size:10px;color:#9ca3af;margin-top:5px">Additions highlighted green · never fabricates experience</div>
          </div>
          <div id="qa-rewrite-out" style="display:none;margin-top:10px">
            <div style="font-size:12px;font-weight:700;color:#111827;margin-bottom:6px">Rewritten CV <span class="qa-chip qa-chip-ai">AI</span></div>
            <div class="qa-diff" id="qa-diff-box"></div>
            <div class="qa-btn-row">
              <button class="qa-btn qa-btn-outline" id="qa-copy-cv-btn">📋 Copy</button>
              <button class="qa-btn qa-btn-green" id="qa-insert-cv-btn">📌 Insert to Page</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI TOOLS TAB -->
    <div class="qa-panel" id="qa-p-ai">
      <div class="qa-card">
        <div class="qa-card-title">✨ Cover Letter <span class="qa-chip qa-chip-ai">AI</span> <span class="qa-chip qa-chip-free">FREE</span></div>
        <div class="qa-card-desc">Paste the job description below to generate a personalized cover letter.</div>
        <textarea id="qa-jd" placeholder="Paste job description here..."></textarea>
        <button class="qa-btn qa-btn-green" id="qa-cl-btn">✨ Generate Cover Letter</button>
        <div class="qa-output" id="qa-cl-out"></div>
        <div class="qa-btn-row" id="qa-cl-actions" style="display:none">
          <button class="qa-btn qa-btn-outline" id="qa-copy-cl-btn">📋 Copy</button>
          <button class="qa-btn qa-btn-green" id="qa-insert-cl-btn">📌 Insert to Form</button>
        </div>
      </div>
      <div class="qa-card">
        <div class="qa-card-title">🎯 ATS Keywords <span class="qa-chip qa-chip-free">FREE</span></div>
        <div class="qa-card-desc">Extract the top ATS keywords from the job description above.</div>
        <button class="qa-btn qa-btn-outline" id="qa-kw-btn">🔍 Extract Keywords</button>
        <div class="qa-output" id="qa-kw-out"></div>
      </div>
      <div class="qa-card">
        <div class="qa-card-title">🎤 Interview Prep <span class="qa-chip qa-chip-pro">PRO</span></div>
        <div class="qa-card-desc">Generate likely interview questions and ideal answers for this role.</div>
        <button class="qa-btn qa-btn-outline" id="qa-int-btn">🎤 Generate Interview Q&amp;A</button>
        <div class="qa-output" id="qa-int-out"></div>
      </div>
    </div>

    <!-- TRACKER TAB -->
    <div class="qa-panel" id="qa-p-tracker">
      <div class="qa-stats">
        <div class="qa-stat"><div class="qa-stat-num" id="qa-s-all">0</div><div class="qa-stat-lbl">Applied</div></div>
        <div class="qa-stat"><div class="qa-stat-num" id="qa-s-int">0</div><div class="qa-stat-lbl">Interview</div></div>
        <div class="qa-stat"><div class="qa-stat-num" id="qa-s-off">0</div><div class="qa-stat-lbl">Offer</div></div>
        <div class="qa-stat"><div class="qa-stat-num" id="qa-s-rej">0</div><div class="qa-stat-lbl">Rejected</div></div>
      </div>
      <div style="font-size:10px;color:#9ca3af;margin-bottom:8px">Tip: click a status badge to update it</div>
      <div class="qa-jlist" id="qa-jlist">
        <div class="qa-empty">No applications tracked yet.<br>Use the Apply tab to get started! 🎯</div>
      </div>
      <div style="margin-top:10px">
        <button class="qa-btn qa-btn-danger" id="qa-clear-btn">🗑 Clear All History</button>
      </div>
    </div>

    <!-- SETTINGS TAB -->
    <div class="qa-panel" id="qa-p-settings">
      <div class="qa-sec-label">Profile</div>
      <div class="qa-row">
        <div class="qa-field"><label>First Name</label><input id="qa-fn" placeholder="Jane"/></div>
        <div class="qa-field"><label>Last Name</label><input id="qa-ln" placeholder="Doe"/></div>
      </div>
      <div class="qa-field"><label>Email</label><input type="email" id="qa-em" placeholder="jane@example.com"/></div>
      <div class="qa-row">
        <div class="qa-field"><label>Phone</label><input id="qa-ph" placeholder="+1 555 0000"/></div>
        <div class="qa-field"><label>City</label><input id="qa-ci" placeholder="San Francisco"/></div>
      </div>
      <div class="qa-row">
        <div class="qa-field"><label>State</label><input id="qa-st" placeholder="CA"/></div>
        <div class="qa-field"><label>Zip</label><input id="qa-zp" placeholder="94105"/></div>
      </div>
      <div class="qa-field"><label>LinkedIn URL</label><input id="qa-li" placeholder="linkedin.com/in/janedoe"/></div>
      <div class="qa-field"><label>Job Title</label><input id="qa-jt" placeholder="Senior Software Engineer"/></div>
      <div class="qa-row">
        <div class="qa-field"><label>Education</label><input id="qa-ed" placeholder="B.S. Computer Science"/></div>
        <div class="qa-field"><label>Salary</label><input id="qa-sl" placeholder="$120,000"/></div>
      </div>
      <div class="qa-field"><label>Skills (comma separated)</label><input id="qa-sk" placeholder="React, Node.js, Python, AWS"/></div>
      <div class="qa-field"><label>CV / Resume Text</label>
        <textarea id="qa-cv" style="min-height:80px" placeholder="Paste your full resume/CV text here. Used for AI cover letters and ATS scoring..."></textarea>
      </div>

      <div class="qa-sec-label">AI Configuration</div>
      <div class="qa-field"><label>Anthropic API Key</label><input type="password" id="qa-ak" placeholder="sk-ant-api03-..."/></div>
      <div class="qa-api-note">Get a free key at <a href="https://console.anthropic.com" target="_blank">console.anthropic.com</a>. Stored locally, never shared.</div>

      <div class="qa-sec-label">Preferences</div>
      <div class="qa-toggle-row">
        <div><div class="qa-toggle-label">Auto-fill on page load</div><div class="qa-toggle-desc">Fill forms automatically when a job page loads</div></div>
        <div class="qa-toggle" id="qa-tog-auto"></div>
      </div>
      <div class="qa-toggle-row">
        <div><div class="qa-toggle-label">Track applications</div><div class="qa-toggle-desc">Log every apply to the Tracker tab</div></div>
        <div class="qa-toggle on" id="qa-tog-track"></div>
      </div>
      <div style="margin-top:12px">
        <button class="qa-btn qa-btn-green" id="qa-save-btn">💾 Save Profile &amp; Settings</button>
      </div>
      <div class="qa-flash qa-flash-ok" id="qa-saved-flash">✓ Saved successfully!</div>
      <div style="margin-top:8px">
        <button class="qa-btn qa-btn-outline" onclick="qaOpenPricing()">⭐ Manage Subscription</button>
      </div>
    </div>

  </div><!-- /body -->

  <!-- BOTTOM BAR -->
  <div class="qa-bottom-bar">
    <button class="qa-btn qa-btn-green" id="qa-bottom-fill">⚡ Auto-Fill</button>
    <button class="qa-btn qa-btn-outline" id="qa-bottom-mark">✓ Mark Applied</button>
  </div>

  <!-- PRICING OVERLAY -->
  <div class="qa-overlay" id="qa-pricing">
    <div class="qa-modal">
      <button class="qa-modal-close" onclick="qaClosePricing()">✕</button>
      <div class="qa-modal-hdr">
        <h2>Upgrade QuickApply</h2>
        <p>Unlock unlimited AI features to land your dream job faster</p>
      </div>
      <div class="qa-bill-toggle">
        <span class="qa-bill-lbl active" id="qa-b-mon">Monthly</span>
        <div class="qa-bill-sw" id="qa-bill-sw"></div>
        <span class="qa-bill-lbl" id="qa-b-ann">Annual <span class="qa-save-tag">Save 40%</span></span>
      </div>
      <div class="qa-plan-cards">
        <div class="qa-plan-card">
          <div class="qa-plan-row">
            <div class="qa-plan-name" style="color:#6b7280">Free</div>
            <div><div class="qa-plan-price" style="color:#6b7280">$0</div><div class="qa-plan-period">forever</div></div>
          </div>
          <div class="qa-plan-tagline">3 credits/day · Basic features</div>
          <div class="qa-plan-features">
            <div class="qa-feat"><span class="qa-feat-y">✓</span> Auto-fill on 6 platforms</div>
            <div class="qa-feat"><span class="qa-feat-y">✓</span> Cover letter generator</div>
            <div class="qa-feat dim"><span class="qa-feat-n">✕</span> CV alignment &amp; ATS scoring</div>
            <div class="qa-feat dim"><span class="qa-feat-n">✕</span> CV rewrite to 100% match</div>
          </div>
          <button class="qa-btn qa-btn-outline" disabled style="opacity:0.5;cursor:not-allowed">Current Plan</button>
        </div>
        <div class="qa-plan-card">
          <div class="qa-plan-row">
            <div class="qa-plan-name">Starter</div>
            <div><div class="qa-plan-price" id="qa-pr-s">$7.99</div><div class="qa-plan-period" id="qa-pp-s">/month</div></div>
          </div>
          <div class="qa-plan-tagline">50 credits/month · CV scoring</div>
          <div class="qa-plan-features">
            <div class="qa-feat"><span class="qa-feat-y">✓</span> 50 AI credits / month</div>
            <div class="qa-feat"><span class="qa-feat-y">✓</span> CV alignment &amp; ATS scoring</div>
            <div class="qa-feat dim"><span class="qa-feat-n">✕</span> CV rewrite to 100% match</div>
            <div class="qa-feat dim"><span class="qa-feat-n">✕</span> Interview prep</div>
          </div>
          <button class="qa-btn qa-btn-outline" id="qa-sel-starter">Get Starter →</button>
        </div>
        <div class="qa-plan-card highlighted popular">
          <div class="qa-plan-row">
            <div class="qa-plan-name" style="color:#16a34a">Pro</div>
            <div><div class="qa-plan-price" style="color:#16a34a" id="qa-pr-p">$14.99</div><div class="qa-plan-period" id="qa-pp-p">/month</div></div>
          </div>
          <div class="qa-plan-tagline">Unlimited credits · All features</div>
          <div class="qa-plan-features">
            <div class="qa-feat"><span class="qa-feat-y">✓</span> <strong>Unlimited AI credits</strong></div>
            <div class="qa-feat"><span class="qa-feat-y">✓</span> CV alignment &amp; ATS scoring</div>
            <div class="qa-feat"><span class="qa-feat-y">✓</span> <strong>CV rewrite to 100% match</strong></div>
            <div class="qa-feat"><span class="qa-feat-y">✓</span> <strong>Interview Q&amp;A prep</strong></div>
          </div>
          <button class="qa-btn qa-btn-green" id="qa-sel-pro">Get Pro → Most Popular</button>
        </div>
        <div class="qa-plan-card">
          <div class="qa-plan-row">
            <div class="qa-plan-name" style="color:#92400e">Ultra</div>
            <div><div class="qa-plan-price" style="color:#92400e" id="qa-pr-u">$29.99</div><div class="qa-plan-period" id="qa-pp-u">/month</div></div>
          </div>
          <div class="qa-plan-tagline">Everything in Pro + power tools</div>
          <div class="qa-plan-features">
            <div class="qa-feat"><span class="qa-feat-y">✓</span> Everything in Pro</div>
            <div class="qa-feat"><span class="qa-feat-y">✓</span> Multiple CV profiles</div>
            <div class="qa-feat"><span class="qa-feat-y">✓</span> Salary negotiation coach</div>
            <div class="qa-feat"><span class="qa-feat-y">✓</span> LinkedIn optimizer</div>
          </div>
          <button class="qa-btn qa-btn-gold" id="qa-sel-ultra">Get Ultra →</button>
        </div>
      </div>

      <div class="qa-pay-section" id="qa-pay-section">
        <h3>💳 Complete Purchase</h3>
        <div class="qa-pay-summary">
          <div><div class="qa-pay-plan-name" id="qa-pay-name-d">Pro Plan</div><div class="qa-pay-billing" id="qa-pay-bill-d">Billed monthly</div></div>
          <div class="qa-pay-price" id="qa-pay-price-d">$14.99</div>
        </div>
        <div class="qa-field"><label>Full Name</label><input id="qa-pay-fullname" placeholder="Jane Doe"/></div>
        <div class="qa-field"><label>Email</label><input type="email" id="qa-pay-email" placeholder="jane@example.com"/></div>
        <div class="qa-card-box">
          <div class="qa-card-line"><label>Card</label><input id="qa-cn" placeholder="1234 5678 9012 3456" maxlength="19"/></div>
          <div class="qa-card-line">
            <label>Expires</label><input id="qa-ce" placeholder="MM / YY" maxlength="7" style="max-width:90px"/>
            <label style="width:35px;padding-left:6px">CVC</label><input id="qa-cc" placeholder="123" maxlength="4" style="max-width:60px"/>
          </div>
        </div>
        <div class="qa-secure-note">
          <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
          256-bit SSL · PCI-compliant · Secured by Stripe
        </div>
        <button class="qa-btn qa-btn-green" id="qa-pay-btn">🔒 Subscribe Now</button>
        <div class="qa-flash" id="qa-pay-flash" style="margin-top:8px"></div>
        <div class="qa-stripe-footer">Powered by <a href="https://stripe.com" target="_blank">Stripe</a> · Cancel anytime</div>
      </div>
    </div>
  </div>
  `;

  document.body.appendChild(sidebar);
  initSidebar();

  // ── INIT ──────────────────────────────────────────────────
  function initSidebar() {
    // Tab switching
    sidebar.querySelectorAll('.qa-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        sidebar.querySelectorAll('.qa-tab').forEach(t => t.classList.remove('qa-active'));
        sidebar.querySelectorAll('.qa-panel').forEach(p => p.classList.remove('qa-active'));
        tab.classList.add('qa-active');
        sidebar.querySelector('#qa-p-' + tab.dataset.p).classList.add('qa-active');
        if (tab.dataset.p === 'tracker') loadTracker();
      });
    });

    // Toggles
    sidebar.querySelectorAll('.qa-toggle').forEach(t => t.addEventListener('click', () => t.classList.toggle('on')));

    // Buttons
    sidebar.querySelector('#qa-reload-btn').addEventListener('click', detectJob);
    sidebar.querySelector('#qa-fill-btn').addEventListener('click', () => doAutofill(true));
    sidebar.querySelector('#qa-bottom-fill').addEventListener('click', () => doAutofill(true));
    sidebar.querySelector('#qa-bottom-mark').addEventListener('click', markApplied);
    sidebar.querySelector('#qa-quick-cl-btn').addEventListener('click', quickCoverLetter);
    sidebar.querySelector('#qa-analyze-btn').addEventListener('click', analyzeCV);
    sidebar.querySelector('#qa-rewrite-btn').addEventListener('click', () => rewriteCV());
    sidebar.querySelector('#qa-copy-cv-btn').addEventListener('click', copyCVRewrite);
    sidebar.querySelector('#qa-insert-cv-btn').addEventListener('click', insertCVRewrite);
    sidebar.querySelector('#qa-cl-btn').addEventListener('click', genCoverLetter);
    sidebar.querySelector('#qa-copy-cl-btn').addEventListener('click', copyCoverLetter);
    sidebar.querySelector('#qa-insert-cl-btn').addEventListener('click', insertCoverLetter);
    sidebar.querySelector('#qa-kw-btn').addEventListener('click', extractKeywords);
    sidebar.querySelector('#qa-int-btn').addEventListener('click', interviewPrep);
    sidebar.querySelector('#qa-clear-btn').addEventListener('click', clearTracker);
    sidebar.querySelector('#qa-save-btn').addEventListener('click', saveSettings);

    // Pricing
    sidebar.querySelector('#qa-bill-sw').addEventListener('click', toggleBilling);
    sidebar.querySelector('#qa-b-mon').addEventListener('click', () => setBilling('monthly'));
    sidebar.querySelector('#qa-b-ann').addEventListener('click', () => setBilling('annual'));
    sidebar.querySelector('#qa-sel-starter').addEventListener('click', () => selectPlan('starter'));
    sidebar.querySelector('#qa-sel-pro').addEventListener('click', () => selectPlan('pro'));
    sidebar.querySelector('#qa-sel-ultra').addEventListener('click', () => selectPlan('ultra'));
    sidebar.querySelector('#qa-pay-btn').addEventListener('click', processPayment);

    // Card formatting
    sidebar.querySelector('#qa-cn').addEventListener('input', e => { let v=e.target.value.replace(/\D/g,'').substring(0,16); e.target.value=v.replace(/(.{4})/g,'$1 ').trim(); });
    sidebar.querySelector('#qa-ce').addEventListener('input', e => { let v=e.target.value.replace(/\D/g,'').substring(0,4); if(v.length>=2) v=v.substring(0,2)+' / '+v.substring(2); e.target.value=v; });

    loadProfile();
    updateCreditUI();
    detectJob();

    // Auto-fill on load
    chrome.storage.local.get('settings', ({ settings }) => {
      if (settings?.autoFill) chrome.storage.local.get('profile', ({ profile }) => { if (profile?.firstName) setTimeout(() => doFill(profile, false), 1000); });
    });
  }

  // ── DETECT JOB ────────────────────────────────────────────
  function detectJob() {
    let title = '';
    for (const sel of ['h1','[class*="job-title"],[class*="jobtitle"]','h2']) {
      const el = document.querySelector(sel);
      if (el && el.textContent.trim().length > 3 && !el.closest('#qa-sidebar')) { title = el.textContent.trim().replace(/\s[-|].*/,'').substring(0, 80); break; }
    }
    if (!title) title = document.title.replace(/\s[-|].*/,'').substring(0, 80);

    let company = '';
    for (const sel of ['[class*="company-name"],[class*="companyName"],[class*="employer"]']) {
      const el = document.querySelector(sel);
      if (el && el.textContent.trim() && !el.closest('#qa-sidebar')) { company = el.textContent.trim().substring(0, 50); break; }
    }

    const titleEl = sidebar.querySelector('#qa-job-title');
    const metaEl  = sidebar.querySelector('#qa-job-meta');
    if (titleEl) titleEl.textContent = title || 'Open a job posting to begin';
    if (metaEl) {
      metaEl.innerHTML = [PLATFORM, company].filter(Boolean).map((s,i,a) =>
        `<span>${s}</span>${i < a.length-1 ? '<span class="qa-job-meta-dot"></span>' : ''}`
      ).join('');
    }
  }

  // ── PROFILE ───────────────────────────────────────────────
  const PMAP = { 'qa-fn':'firstName','qa-ln':'lastName','qa-em':'email','qa-ph':'phone','qa-ci':'city','qa-st':'state','qa-zp':'zip','qa-li':'linkedin','qa-jt':'jobTitle','qa-ed':'education','qa-sl':'salary','qa-sk':'skills','qa-cv':'summary','qa-ak':'apiKey' };

  function loadProfile() {
    chrome.storage.local.get(['profile','settings'], ({ profile, settings }) => {
      if (profile) Object.entries(PMAP).forEach(([id, key]) => { const el = sidebar.querySelector('#'+id); if (el && profile[key]) el.value = profile[key]; });
      if (settings) {
        if (settings.autoFill !== undefined) sidebar.querySelector('#qa-tog-auto').classList.toggle('on', settings.autoFill);
        if (settings.trackApps !== undefined) sidebar.querySelector('#qa-tog-track').classList.toggle('on', settings.trackApps !== false);
      }
    });
  }

  function saveSettings() {
    const profile = {};
    Object.entries(PMAP).forEach(([id, key]) => {
      if (key === 'apiKey') return;
      const el = sidebar.querySelector('#'+id);
      if (el) profile[key] = el.value.trim();
    });
    const apiKeyEl = sidebar.querySelector('#qa-ak');
    const settings = {
      autoFill:  sidebar.querySelector('#qa-tog-auto').classList.contains('on'),
      trackApps: sidebar.querySelector('#qa-tog-track').classList.contains('on'),
      apiKey:    apiKeyEl ? apiKeyEl.value.trim() : ''
    };
    chrome.storage.local.set({ profile, settings }, () => {
      const f = sidebar.querySelector('#qa-saved-flash');
      f.classList.add('show');
      setTimeout(() => f.classList.remove('show'), 2500);
    });
  }

  // ── CREDITS ───────────────────────────────────────────────
  const PCFG = { free:{c:3,daily:true}, starter:{c:50,daily:false}, pro:{c:9999999}, ultra:{c:9999999} };

  function getCredits(cb) {
    chrome.storage.local.get(['plan','credits','creditsDate'], data => {
      const plan = data.plan || 'free', cfg = PCFG[plan];
      const today = new Date().toDateString(); let credits = data.credits;
      if (cfg.daily && data.creditsDate !== today) { credits = cfg.c; chrome.storage.local.set({ credits, creditsDate: today }); }
      else if (credits == null) { credits = cfg.c; chrome.storage.local.set({ credits, creditsDate: today }); }
      cb(plan, Math.max(0, credits));
    });
  }

  function useCredit(cb) {
    getCredits((plan, credits) => {
      if (plan === 'pro' || plan === 'ultra') { cb(true); return; }
      if (credits <= 0) { cb(false); return; }
      chrome.storage.local.set({ credits: credits - 1 }, () => { updateCreditUI(); cb(true); });
    });
  }

  function updateCreditUI() {
    getCredits((plan, credits) => {
      const unlim = plan === 'pro' || plan === 'ultra';
      const maxC  = PCFG[plan]?.c || 3;
      const credT = sidebar.querySelector('#qa-cred-text');
      const planB = sidebar.querySelector('#qa-plan-btn');
      const fill  = sidebar.querySelector('#qa-meter-fill');
      const count = sidebar.querySelector('#qa-meter-count');
      if (credT) credT.textContent = unlim ? 'Unlimited' : credits + ' credits';
      if (planB) {
        const labels = { free:'FREE', starter:'STARTER', pro:'PRO', ultra:'ULTRA' };
        planB.textContent = labels[plan] || 'FREE';
        planB.className = 'qa-plan-btn' + (plan !== 'free' ? ' paid' : '');
      }
      if (fill) fill.style.width = unlim ? '100%' : Math.round((credits/maxC)*100) + '%';
      if (count) count.textContent = unlim ? 'Unlimited' : plan === 'starter' ? `${credits} / 50 monthly` : `${credits} / 3 daily`;
    });
  }

  // ── AUTOFILL ─────────────────────────────────────────────
  function buildMap(p) {
    return [
      {re:/first[\s._-]?name|fname|given/i,        v:p.firstName},
      {re:/last[\s._-]?name|lname|family|surname/i, v:p.lastName},
      {re:/full[\s._-]?name|your[\s._-]?name/i,     v:(p.firstName+' '+p.lastName).trim()},
      {re:/\bemail\b|e-mail/i,                      v:p.email},
      {re:/phone|mobile|telephone/i,                v:p.phone},
      {re:/\bcity\b/i,                              v:p.city},
      {re:/\bstate\b|\bprovince\b/i,                v:p.state},
      {re:/\bzip\b|postal/i,                        v:p.zip},
      {re:/linkedin/i,                              v:p.linkedin},
      {re:/website|portfolio/i,                     v:p.website||''},
      {re:/current[\s._-]?title|job[\s._-]?title|position/i, v:p.jobTitle},
      {re:/salary|compensation/i,                   v:p.salary||''},
      {re:/education|degree/i,                      v:p.education||''},
      {re:/\bskills?\b|expertise/i,                 v:p.skills},
      {re:/summary|cover[\s._-]?letter|motivation|about[\s._-]?you/i, v:p.summary},
    ];
  }

  function getHint(el) {
    const lbl = document.querySelector('label[for="'+el.id+'"]');
    return [el.name,el.id,el.placeholder,el.getAttribute('aria-label')||'',lbl?lbl.textContent:''].join(' ').toLowerCase();
  }

  function setVal(el, val) {
    const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value');
    if (setter?.set) setter.set.call(el, val); else el.value = val;
    ['input','change','blur'].forEach(e => el.dispatchEvent(new Event(e, {bubbles:true})));
  }

  function doFill(profile, showToast) {
    const map = buildMap(profile);
    const sel = "input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=checkbox]):not([type=radio]):not([type=file]),textarea";
    let n = 0;
    document.querySelectorAll(sel).forEach(el => {
      if (el.closest('#qa-sidebar') || el.closest('#qa-pricing') || el.readOnly || el.disabled) return;
      const h = getHint(el);
      for (const {re, v} of map) { if (v && re.test(h)) { setVal(el, v); n++; break; } }
    });
    if (showToast) toast(n > 0 ? `Filled ${n} field${n>1?'s':''}!` : 'No matching fields found.', n > 0 ? 'ok' : 'warn');
    return n;
  }

  function doAutofill(showToast) {
    useCredit(ok => {
      if (!ok) { toast('No credits left! Upgrade to continue.', 'warn'); qaOpenPricing(); return; }
      chrome.storage.local.get(['profile','settings'], ({ profile, settings }) => {
        if (!profile?.firstName) { toast('Save your profile in the Settings tab first!', 'warn'); return; }
        doFill(profile, showToast);
        if (!settings || settings.trackApps !== false) trackApp(profile);
      });
    });
  }

  function markApplied() {
    chrome.storage.local.get('profile', ({ profile }) => {
      if (!profile) { toast('Save your profile first!', 'warn'); return; }
      trackApp(profile);
      toast('Application marked as applied! ✓', 'ok');
    });
  }

  function trackApp(profile) {
    const titleEl = document.querySelector('h1:not(#qa-sidebar h1),[class*="job-title"]:not(#qa-sidebar [class*="job-title"])');
    let title = titleEl ? titleEl.textContent.trim() : document.title;
    title = title.replace(/\s[-|].*/,'').substring(0, 80);
    const compEl = document.querySelector('[class*="company-name"]:not(#qa-sidebar *), [class*="companyName"]:not(#qa-sidebar *)');
    const company = compEl ? compEl.textContent.trim().substring(0, 50) : PLATFORM;
    chrome.storage.local.get('applications', ({ applications }) => {
      const apps = applications || [];
      if (apps.some(a => a.title === title && Date.now() - a.date < 300000)) return;
      apps.push({ title, company, platform:PLATFORM, date:Date.now(), status:'applied' });
      if (apps.length > 300) apps.splice(0, apps.length - 300);
      chrome.storage.local.set({ applications: apps }, loadTracker);
    });
  }

  // ── CLAUDE API ────────────────────────────────────────────
  async function callClaude(apiKey, prompt, maxTokens) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'x-api-key':apiKey, 'anthropic-version':'2023-06-01' },
      body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:maxTokens, messages:[{ role:'user', content:prompt }] })
    });
    const d = await res.json();
    if (d.error) throw new Error(d.error.message);
    return d.content?.[0]?.text || '';
  }

  function getApiKey(cb) {
    chrome.storage.local.get('settings', ({ settings }) => cb(settings?.apiKey?.trim() || ''));
  }

  // ── QUICK COVER LETTER (Apply tab) ────────────────────────
  function quickCoverLetter() {
    chrome.storage.local.get('profile', async ({ profile }) => {
      if (!profile?.firstName) { toast('Save your profile in Settings first!', 'warn'); return; }
      getApiKey(async apiKey => {
        if (!apiKey) { toast('Add your Anthropic API key in Settings!', 'warn'); return; }
        useCredit(async ok => {
          if (!ok) { qaOpenPricing(); return; }
          const btn = sidebar.querySelector('#qa-quick-cl-btn');
          const out = sidebar.querySelector('#qa-quick-cl-out');
          btn.disabled = true; btn.textContent = 'Generating...';
          out.innerHTML = '<span class="qa-thinking">Writing your cover letter</span>';
          out.classList.add('show');
          const jdEl = document.querySelector('[class*="description"],[id*="description"],[class*="job-desc"]');
          const jd = jdEl ? jdEl.textContent.substring(0, 1500) : 'Job on ' + PLATFORM + ' — ' + document.title;
          try {
            const text = await callClaude(apiKey, `Write a 3-paragraph cover letter.\nCandidate: ${profile.firstName} ${profile.lastName}, ${profile.jobTitle||''}\nSkills: ${profile.skills||''}\nBackground: ${(profile.summary||'').substring(0,300)}\nJob: ${jd}\nStart "Dear Hiring Manager," end "Sincerely,\n${profile.firstName} ${profile.lastName}"`, 800);
            out.textContent = text;
            const tas = Array.from(document.querySelectorAll('textarea')).filter(t => !t.closest('#qa-sidebar'));
            const target = tas.find(t => /cover|letter|message|motivation|why/i.test(getHint(t))) || tas[tas.length-1];
            if (target) { setVal(target, text); toast('Cover letter inserted into form! ✓', 'ok'); }
          } catch(e) { out.textContent = 'Error: ' + e.message; }
          btn.disabled = false; btn.textContent = '✨ Generate & Insert Cover Letter';
        });
      });
    });
  }

  // ── CV ANALYSIS ───────────────────────────────────────────
  let _cvProfile, _cvJD, _cvApiKey, _cvMissing;

  function analyzeCV() {
    const jd = sidebar.querySelector('#qa-cv-jd')?.value.trim();
    if (!jd) { toast('Paste a job description first!', 'warn'); return; }
    chrome.storage.local.get('profile', async ({ profile }) => {
      if (!profile?.summary) { toast('Add your CV/resume text in the Settings tab!', 'warn'); return; }
      getApiKey(async apiKey => {
        if (!apiKey) { toast('Add your API key in Settings!', 'warn'); return; }
        const btn = sidebar.querySelector('#qa-analyze-btn');
        btn.disabled = true; btn.textContent = 'Analyzing...';
        const prompt = `ATS analyst. Compare resume to job. Reply ONLY valid JSON no markdown:\n{"score":72,"verdict":"Good Match","missing_keywords":["kw1","kw2","kw3"],"present_keywords":["kw4","kw5"]}\nRESUME: ${profile.summary}\nSKILLS: ${profile.skills||''}\nJOB: ${jd}`;
        try {
          const raw = await callClaude(apiKey, prompt, 600);
          const data = JSON.parse(raw.replace(/```json|```/g,'').trim());
          _cvProfile = profile; _cvJD = jd; _cvApiKey = apiKey; _cvMissing = data.missing_keywords || [];
          renderATS(data);
        } catch(e) { toast('Analysis failed: ' + e.message, 'err'); }
        btn.disabled = false; btn.textContent = '📊 Analyze & Score My CV';
      });
    });
  }

  function renderATS(data) {
    sidebar.querySelector('#qa-ats-result').style.display = 'block';
    const score = Math.min(100, Math.max(0, parseInt(data.score) || 0));
    const circ = 2 * Math.PI * 35;
    const ring = sidebar.querySelector('#qa-ring');
    ring.style.strokeDashoffset = circ - (score / 100) * circ;
    const color = score >= 80 ? '#16a34a' : score >= 60 ? '#f59e0b' : '#ef4444';
    ring.style.stroke = color;
    const pEl = sidebar.querySelector('#qa-ats-pct');
    pEl.textContent = score + '%'; pEl.style.color = color;
    const vEl = sidebar.querySelector('#qa-ats-verdict');
    vEl.textContent = data.verdict || ''; vEl.style.color = color;
    sidebar.querySelector('#qa-kw-miss').innerHTML = (data.missing_keywords||[]).slice(0,12).map(k =>
      `<span class="qa-pill qa-pill-miss" title="Click to copy">${k}</span>`).join('');
    sidebar.querySelectorAll('.qa-pill-miss').forEach(p => {
      p.addEventListener('click', () => { navigator.clipboard.writeText(p.textContent); p.textContent = 'Copied!'; setTimeout(() => p.textContent = p.dataset.k || p.textContent, 1400); });
    });
    sidebar.querySelector('#qa-kw-have').innerHTML = (data.present_keywords||[]).slice(0,10).map(k =>
      `<span class="qa-pill qa-pill-have">✓ ${k}</span>`).join('');
  }

  function rewriteCV() {
    if (!_cvProfile || !_cvJD || !_cvApiKey) { toast('Run the CV analysis first!', 'warn'); return; }
    chrome.storage.local.get('plan', async ({ plan }) => {
      if (!plan || plan === 'free' || plan === 'starter') { qaOpenPricing(); return; }
      useCredit(async ok => {
        if (!ok) { qaOpenPricing(); return; }
        const btn = sidebar.querySelector('#qa-rewrite-btn');
        btn.disabled = true; btn.textContent = 'Rewriting CV...';
        const prompt = `Expert resume writer. Rewrite this resume for 100% ATS match. Keep all real experience. Mark every addition: [ADDED: text]. Use sections: SUMMARY | EXPERIENCE | SKILLS | EDUCATION.\nMissing keywords: ${(_cvMissing||[]).join(', ')}\nRESUME: ${_cvProfile.summary}\nJOB: ${_cvJD}`;
        try {
          const result = await callClaude(_cvApiKey, prompt, 1800);
          sidebar.querySelector('#qa-rewrite-out').style.display = 'block';
          const html = result.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            .replace(/\[ADDED: ([^\]]+)\]/g, '<span class="qa-diff-add">$1</span>');
          sidebar.querySelector('#qa-diff-box').innerHTML = html;
        } catch(e) { toast('Rewrite failed: ' + e.message, 'err'); }
        btn.disabled = false; btn.textContent = '✨ Rewrite CV to 100% Match';
      });
    });
  }

  function copyCVRewrite() {
    navigator.clipboard.writeText(sidebar.querySelector('#qa-diff-box')?.textContent || '').then(() => toast('Copied to clipboard! ✓', 'ok'));
  }

  function insertCVRewrite() {
    const text = sidebar.querySelector('#qa-diff-box')?.textContent;
    if (!text) return;
    const tas = Array.from(document.querySelectorAll('textarea')).filter(t => !t.closest('#qa-sidebar'));
    if (tas.length) { setVal(tas[0], text); toast('CV inserted into page! ✓', 'ok'); }
    else toast('No text area found on this page.', 'warn');
  }

  // ── AI TOOLS ─────────────────────────────────────────────
  function genCoverLetter() {
    const jd = sidebar.querySelector('#qa-jd')?.value.trim();
    if (!jd) { toast('Paste a job description first!', 'warn'); return; }
    chrome.storage.local.get('profile', async ({ profile }) => {
      if (!profile?.firstName) { toast('Save your profile in Settings first!', 'warn'); return; }
      getApiKey(async apiKey => {
        if (!apiKey) { toast('Add your API key in Settings!', 'warn'); return; }
        useCredit(async ok => {
          if (!ok) { qaOpenPricing(); return; }
          const btn = sidebar.querySelector('#qa-cl-btn');
          const out = sidebar.querySelector('#qa-cl-out');
          btn.disabled = true; btn.textContent = 'Generating...';
          out.innerHTML = '<span class="qa-thinking">Writing your cover letter</span>';
          out.classList.add('show');
          sidebar.querySelector('#qa-cl-actions').style.display = 'none';
          try {
            out.textContent = await callClaude(apiKey, `Write a compelling 3-paragraph cover letter.\nCandidate: ${profile.firstName} ${profile.lastName}, ${profile.jobTitle||''}\nSkills: ${profile.skills||''}\nSummary: ${(profile.summary||'').substring(0,400)}\nJob:\n${jd}\nStart "Dear Hiring Manager," — end "Sincerely,\n${profile.firstName} ${profile.lastName}"`, 900);
            sidebar.querySelector('#qa-cl-actions').style.display = 'flex';
          } catch(e) { out.textContent = 'Error: ' + e.message; }
          btn.disabled = false; btn.textContent = '✨ Generate Cover Letter';
        });
      });
    });
  }

  function copyCoverLetter() {
    navigator.clipboard.writeText(sidebar.querySelector('#qa-cl-out')?.textContent || '').then(() => toast('Copied! ✓', 'ok'));
  }

  function insertCoverLetter() {
    const text = sidebar.querySelector('#qa-cl-out')?.textContent;
    if (!text) return;
    const tas = Array.from(document.querySelectorAll('textarea')).filter(t => !t.closest('#qa-sidebar'));
    const target = tas.find(t => /cover|letter|message|motivation|why/i.test(getHint(t))) || tas[tas.length-1];
    if (target) { setVal(target, text); toast('Cover letter inserted! ✓', 'ok'); }
    else toast('No text area found on this page.', 'warn');
  }

  function extractKeywords() {
    const jd = sidebar.querySelector('#qa-jd')?.value.trim();
    if (!jd) { toast('Paste a job description in the AI Tools tab first!', 'warn'); return; }
    getApiKey(async apiKey => {
      if (!apiKey) { toast('Add your API key in Settings!', 'warn'); return; }
      const btn = sidebar.querySelector('#qa-kw-btn');
      const out = sidebar.querySelector('#qa-kw-out');
      btn.disabled = true; btn.textContent = 'Extracting...';
      out.innerHTML = '<span class="qa-thinking">Extracting keywords</span>';
      out.classList.add('show');
      try { out.textContent = await callClaude(apiKey, `List top 12 ATS keywords from this job description. For each: keyword, why it matters (1 sentence), sample resume bullet.\n\n${jd}`, 600); }
      catch(e) { out.textContent = 'Error: ' + e.message; }
      btn.disabled = false; btn.textContent = '🔍 Extract Keywords';
    });
  }

  function interviewPrep() {
    chrome.storage.local.get(['plan','profile'], async ({ plan, profile }) => {
      if (!plan || plan === 'free') { qaOpenPricing(); return; }
      const jd = sidebar.querySelector('#qa-jd')?.value.trim();
      if (!jd) { toast('Paste a job description in the AI Tools tab first!', 'warn'); return; }
      getApiKey(async apiKey => {
        if (!apiKey) { toast('Add your API key!', 'warn'); return; }
        const btn = sidebar.querySelector('#qa-int-btn');
        const out = sidebar.querySelector('#qa-int-out');
        btn.disabled = true; btn.textContent = 'Generating...';
        out.innerHTML = '<span class="qa-thinking">Preparing interview questions</span>';
        out.classList.add('show');
        try { out.textContent = await callClaude(apiKey, `Generate 6 interview questions and ideal answers (STAR method).\nCandidate: ${profile?.jobTitle||''}, Skills: ${profile?.skills||''}\nJob:\n${jd}\nFormat:\nQ: [question]\nA: [answer]\n---`, 1000); }
        catch(e) { out.textContent = 'Error: ' + e.message; }
        btn.disabled = false; btn.textContent = '🎤 Generate Interview Q&A';
      });
    });
  }

  // ── TRACKER ───────────────────────────────────────────────
  const STATUSES = ['applied','interview','offer','rejected'];
  const STAT_LBL = { applied:'Applied', interview:'Interview', offer:'Offer', rejected:'Rejected' };
  const PLT_ICO  = { LinkedIn:'💼', Indeed:'🔍', Glassdoor:'💚', Greenhouse:'🌿', Lever:'⚙️', Workday:'🔷' };

  function loadTracker() {
    chrome.storage.local.get('applications', ({ applications }) => {
      const apps = applications || [];
      sidebar.querySelector('#qa-s-all').textContent = apps.length;
      sidebar.querySelector('#qa-s-int').textContent = apps.filter(a=>a.status==='interview').length;
      sidebar.querySelector('#qa-s-off').textContent = apps.filter(a=>a.status==='offer').length;
      sidebar.querySelector('#qa-s-rej').textContent = apps.filter(a=>a.status==='rejected').length;
      const list = sidebar.querySelector('#qa-jlist');
      if (!apps.length) { list.innerHTML = '<div class="qa-empty">No applications yet. Start applying! 🎯</div>'; return; }
      list.innerHTML = apps.slice().reverse().slice(0, 25).map((app, i) => {
        const idx = apps.length - 1 - i, s = app.status || 'applied';
        const dt  = new Date(app.date).toLocaleDateString('en-US', { month:'short', day:'numeric' });
        return `<div class="qa-jitem">
          <div class="qa-jico">${PLT_ICO[app.platform]||'📋'}</div>
          <div class="qa-jinfo">
            <div class="qa-jtitle">${app.title||'Job Application'}</div>
            <div class="qa-jmeta">${app.company||app.platform} · ${dt}</div>
          </div>
          <span class="qa-jtag qa-t-${s}" data-idx="${idx}">${STAT_LBL[s]}</span>
        </div>`;
      }).join('');
      list.querySelectorAll('.qa-jtag').forEach(tag => {
        tag.addEventListener('click', () => {
          const idx = parseInt(tag.dataset.idx), a2 = [...apps];
          a2[idx].status = STATUSES[(STATUSES.indexOf(a2[idx].status||'applied')+1) % STATUSES.length];
          chrome.storage.local.set({ applications: a2 }, loadTracker);
        });
      });
    });
  }

  function clearTracker() {
    if (confirm('Clear all application history? This cannot be undone.')) chrome.storage.local.remove('applications', loadTracker);
  }

  // ── PRICING ───────────────────────────────────────────────
  const SERVER_URL = 'https://your-server.onrender.com'; // ← update after deploying
  let billing = 'monthly', selectedPlan = null;
  const PRICES = { monthly:{starter:'$7.99',pro:'$14.99',ultra:'$29.99'}, annual:{starter:'$4.99',pro:'$8.99',ultra:'$17.99'} };
  const PLAN_NAMES = { starter:'Starter', pro:'Pro', ultra:'Ultra' };

  window.qaOpenPricing  = () => sidebar.querySelector('#qa-pricing').classList.add('show');
  window.qaClosePricing = () => {
    sidebar.querySelector('#qa-pricing').classList.remove('show');
    sidebar.querySelector('#qa-pay-section').classList.remove('show');
    selectedPlan = null;
  };

  function toggleBilling() { setBilling(billing === 'monthly' ? 'annual' : 'monthly'); }
  function setBilling(mode) {
    billing = mode;
    sidebar.querySelector('#qa-bill-sw').classList.toggle('annual', mode === 'annual');
    sidebar.querySelector('#qa-b-mon').classList.toggle('active', mode === 'monthly');
    sidebar.querySelector('#qa-b-ann').classList.toggle('active', mode === 'annual');
    const p = PRICES[mode];
    [['s','starter'],['p','pro'],['u','ultra']].forEach(([key, name]) => {
      const pr = sidebar.querySelector(`#qa-pr-${key}`); const pp = sidebar.querySelector(`#qa-pp-${key}`);
      if (pr) pr.textContent = p[name];
      if (pp) pp.textContent = mode === 'annual' ? '/mo, billed yearly' : '/month';
    });
  }

  function selectPlan(name) {
    selectedPlan = name;
    const p = PRICES[billing];
    sidebar.querySelector('#qa-pay-name-d').textContent  = PLAN_NAMES[name] + ' Plan';
    sidebar.querySelector('#qa-pay-price-d').textContent = p[name];
    sidebar.querySelector('#qa-pay-bill-d').textContent  = billing === 'annual' ? p[name]+'/mo · Billed annually · Cancel anytime' : p[name]+'/month · Cancel anytime';
    chrome.storage.local.get('profile', ({ profile }) => {
      if (profile?.email)     sidebar.querySelector('#qa-pay-email').value = profile.email;
      if (profile?.firstName) sidebar.querySelector('#qa-pay-fullname').value = (profile.firstName+' '+(profile.lastName||'')).trim();
    });
    const ps = sidebar.querySelector('#qa-pay-section');
    ps.classList.add('show');
    setTimeout(() => ps.scrollIntoView({ behavior:'smooth', block:'nearest' }), 50);
  }

  async function processPayment() {
    if (!selectedPlan) { showPayMsg('Please select a plan above.', false); return; }
    const name    = sidebar.querySelector('#qa-pay-fullname')?.value.trim();
    const email   = sidebar.querySelector('#qa-pay-email')?.value.trim();
    const cardNum = sidebar.querySelector('#qa-cn')?.value.replace(/\s/g,'');
    const expiry  = sidebar.querySelector('#qa-ce')?.value.replace(/\s/g,'');
    const cvc     = sidebar.querySelector('#qa-cc')?.value.trim();
    if (!name)  { showPayMsg('Enter your full name.', false); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showPayMsg('Enter a valid email.', false); return; }
    if (!cardNum || cardNum.length < 15) { showPayMsg('Enter a valid card number.', false); return; }
    if (!expiry || expiry.replace(/\s/g,'').length < 4) { showPayMsg('Enter card expiry.', false); return; }
    if (!cvc || cvc.length < 3) { showPayMsg('Enter your CVC.', false); return; }
    const parts = expiry.replace(/\s/g,'').split('/');
    const btn = sidebar.querySelector('#qa-pay-btn');
    btn.disabled = true; btn.textContent = 'Processing...';
    try {
      const res = await fetch(SERVER_URL + '/api/create-subscription', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ card:{ number:cardNum, exp_month:parts[0], exp_year:parts[1]?'20'+parts[1]:'', cvc }, plan:selectedPlan, billing, email, name, extensionUserId:chrome.runtime?.id||'ext' })
      });
      const data = await res.json();
      if (data.error) { showPayMsg('Payment failed: ' + data.error, false); btn.disabled=false; btn.textContent='🔒 Subscribe Now'; return; }
      const credits = { starter:50, pro:9999999, ultra:9999999 };
      chrome.storage.local.set({ plan:selectedPlan, credits:credits[selectedPlan], creditsDate:new Date().toDateString(), subscriptionId:data.subscriptionId||'', customerId:data.customerId||'' }, () => {
        updateCreditUI();
        showPayMsg('Welcome to ' + PLAN_NAMES[selectedPlan] + '! Plan is now active. 🎉', true);
        setTimeout(() => window.qaClosePricing(), 3000);
      });
    } catch(e) {
      showPayMsg('Cannot reach payment server. Check SERVER_URL in content.js', false);
      btn.disabled = false; btn.textContent = '🔒 Subscribe Now';
    }
  }

  function showPayMsg(msg, ok) {
    const el = sidebar.querySelector('#qa-pay-flash');
    el.textContent = msg;
    el.className = 'qa-flash ' + (ok ? 'qa-flash-ok' : 'qa-flash-err') + ' show';
    if (ok) setTimeout(() => el.classList.remove('show'), 4000);
  }

  // ── TOAST ─────────────────────────────────────────────────
  function toast(msg, type) {
    document.getElementById('qa-toast-el')?.remove();
    const t = document.createElement('div');
    t.id = 'qa-toast-el';
    t.className = 'qa-toast qa-toast-' + (type || 'ok');
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3800);
  }

  // SPA navigation support
  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) { lastUrl = location.href; setTimeout(detectJob, 1500); }
  }).observe(document.documentElement, { subtree:true, childList:true });

})();
