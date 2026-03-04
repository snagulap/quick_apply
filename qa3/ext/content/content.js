// QuickApply v3 — Sidebar Content Script
(function () {
  'use strict';

  function getPlatform() {
    const h = location.hostname;
    if (h.includes('linkedin.com'))  return 'LinkedIn';
    if (h.includes('indeed.com'))    return 'Indeed';
    if (h.includes('glassdoor.com')) return 'Glassdoor';
    if (h.includes('greenhouse.io')) return 'Greenhouse';
    if (h.includes('lever.co'))      return 'Lever';
    if (h.includes('workday.com'))   return 'Workday';
    return null;
  }
  const PLATFORM = getPlatform();
  if (!PLATFORM) return;

  // ── Inject sidebar HTML ───────────────────────────────────────
  function buildSidebar() {
    if (document.getElementById('qa-sidebar')) return;

    const wrap = document.createElement('div');
    wrap.id = 'qa-sidebar-wrap';
    wrap.innerHTML = `
<!-- Tab toggle button -->
<div id="qa-sidebar-toggle" onclick="document.getElementById('qa-sidebar').classList.toggle('open')">
  <div class="qt-logo">Q</div>
  <div class="qt-label">QuickApply</div>
</div>

<!-- Sidebar -->
<div id="qa-sidebar">
  <!-- Header -->
  <div class="qa-hdr">
    <div class="qa-brand">
      <div class="qa-brand-logo">Q</div>
      <div class="qa-brand-name">Quick<span>Apply</span></div>
    </div>
    <div class="qa-hdr-right">
      <div class="qa-plan-badge" id="qa-plan-badge" onclick="openQAPricing()">FREE</div>
      <button class="qa-close" onclick="document.getElementById('qa-sidebar').classList.remove('open')" title="Close">✕</button>
    </div>
  </div>

  <!-- Job context -->
  <div class="qa-job-ctx">
    <div class="qa-job-title" id="qa-job-title">No job detected</div>
    <div class="qa-job-meta" id="qa-job-meta">
      <span>${PLATFORM}</span>
    </div>
    <button class="qa-reload-btn" onclick="detectJob()">↻ Reload Job Details</button>
  </div>

  <!-- Tabs -->
  <div class="qa-tabs">
    <div class="qa-tab active" data-qtab="apply">Apply</div>
    <div class="qa-tab" data-qtab="cv">CV Align</div>
    <div class="qa-tab" data-qtab="ai">AI Tools</div>
    <div class="qa-tab" data-qtab="tracker">Tracker</div>
    <div class="qa-tab" data-qtab="settings">Settings</div>
  </div>

  <!-- Panels -->
  <div class="qa-panels">

    <!-- APPLY -->
    <div class="qa-panel active" id="qa-panel-apply">
      <div class="qa-credits">
        <div class="qa-credits-top">
          <span class="qa-credits-label">⚡ AI Credits</span>
          <span class="qa-credits-count" id="qa-credits-count">3 / 3 daily</span>
        </div>
        <div class="qa-credits-bar"><div class="qa-credits-fill" id="qa-credits-fill" style="width:100%"></div></div>
        <div class="qa-credits-hint">Free plan resets daily. <a onclick="openQAPricing()">Upgrade for unlimited →</a></div>
      </div>

      <div class="qa-box">
        <div class="qa-box-title">📋 Quick Profile Fill</div>
        <div class="qa-box-desc">Fill all form fields on this page instantly from your saved profile.</div>
        <button class="qa-btn qa-btn-green" id="qa-fill-btn" onclick="qaFillPage()">⚡ Auto-Fill This Page</button>
      </div>

      <div class="qa-box">
        <div class="qa-box-title">📄 Cover Letter</div>
        <div class="qa-box-desc">Generate and insert an AI cover letter directly into this application.</div>
        <button class="qa-btn qa-btn-outline" id="qa-quick-cl-btn" onclick="qaQuickCoverLetter()">✨ Generate & Insert Cover Letter</button>
        <div class="qa-ai-out" id="qa-quick-cl-out"></div>
      </div>
    </div>

    <!-- CV ALIGN -->
    <div class="qa-panel" id="qa-panel-cv">
      <div class="qa-box">
        <div class="qa-box-title">📊 ATS Score <span class="qa-chip qa-chip-ai">AI</span></div>
        <div class="qa-box-desc">Paste the job description to score your CV and see missing keywords.</div>
        <div class="qa-field"><label>Job Description</label>
          <textarea id="qa-cv-jd" placeholder="Paste the full job description here..."></textarea>
        </div>
        <button class="qa-btn qa-btn-green" id="qa-analyze-btn" onclick="qaAnalyzeCV()">📊 Score My CV</button>

        <div id="qa-ats-result" style="display:none">
          <div class="qa-ats-wrap">
            <div class="qa-ats-ring">
              <svg viewBox="0 0 88 88"><circle class="ring-bg" cx="44" cy="44" r="35"/><circle class="ring-fill" id="qa-ring" cx="44" cy="44" r="35"/></svg>
              <div class="qa-ats-center">
                <span class="qa-ats-pct" id="qa-ats-pct">0%</span>
                <span class="qa-ats-lbl">ATS Match</span>
              </div>
            </div>
            <div class="qa-ats-verdict" id="qa-ats-verdict"></div>
          </div>
          <div class="qa-kw-title">Missing Keywords — click to copy</div>
          <div class="qa-pills" id="qa-kw-missing"></div>
          <div class="qa-kw-title" style="margin-top:8px">Found in Your CV</div>
          <div class="qa-pills" id="qa-kw-present"></div>
          <div style="margin-top:12px">
            <button class="qa-btn qa-btn-gold" id="qa-rewrite-btn">✨ Rewrite CV to 100% Match <span class="qa-chip qa-chip-pro">PRO</span></button>
          </div>
          <div id="qa-rewrite-out" style="display:none;margin-top:10px">
            <div style="font-size:11px;font-weight:700;color:#111;margin-bottom:6px">Rewritten CV <span class="qa-chip qa-chip-ai">AI</span></div>
            <div class="qa-diff" id="qa-diff-box"></div>
            <div class="qa-btn-row">
              <button class="qa-btn qa-btn-outline" id="qa-copy-cv-btn">📋 Copy</button>
              <button class="qa-btn qa-btn-green" onclick="qaInsertRewrite()">📌 Insert to Page</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI TOOLS -->
    <div class="qa-panel" id="qa-panel-ai">
      <div class="qa-box">
        <div class="qa-box-title">✨ Cover Letter <span class="qa-chip qa-chip-ai">AI</span> <span class="qa-chip qa-chip-free">FREE</span></div>
        <div class="qa-box-desc">Paste a job description to generate a tailored cover letter.</div>
        <textarea id="qa-jd" placeholder="Paste job description..."></textarea>
        <button class="qa-btn qa-btn-green" id="qa-cl-btn" onclick="qaGenCL()">✨ Generate Cover Letter</button>
        <div class="qa-ai-out" id="qa-cl-out"></div>
        <div class="qa-btn-row" id="qa-cl-actions" style="display:none">
          <button class="qa-btn qa-btn-outline" onclick="qaCopyCL()">📋 Copy</button>
          <button class="qa-btn qa-btn-green" onclick="qaInsertCL()">📌 Insert to Form</button>
        </div>
      </div>
      <div class="qa-box">
        <div class="qa-box-title">🎯 ATS Keywords <span class="qa-chip qa-chip-free">FREE</span></div>
        <div class="qa-box-desc">Extract top ATS keywords from the job description above.</div>
        <button class="qa-btn qa-btn-outline" id="qa-kw-btn" onclick="qaExtractKW()">🔍 Extract Keywords</button>
        <div class="qa-ai-out" id="qa-kw-out"></div>
      </div>
      <div class="qa-box">
        <div class="qa-box-title">🎤 Interview Prep <span class="qa-chip qa-chip-pro">PRO</span></div>
        <div class="qa-box-desc">Get likely interview questions + ideal answers for this role.</div>
        <button class="qa-btn qa-btn-outline" id="qa-int-btn" onclick="qaInterview()">🎤 Generate Interview Q&A</button>
        <div class="qa-ai-out" id="qa-int-out"></div>
      </div>
    </div>

    <!-- TRACKER -->
    <div class="qa-panel" id="qa-panel-tracker">
      <div class="qa-stats">
        <div class="qa-stat"><div class="qa-stat-n" id="qa-s-total">0</div><div class="qa-stat-l">Applied</div></div>
        <div class="qa-stat"><div class="qa-stat-n" id="qa-s-int">0</div><div class="qa-stat-l">Interview</div></div>
        <div class="qa-stat"><div class="qa-stat-n" id="qa-s-offer">0</div><div class="qa-stat-l">Offer</div></div>
        <div class="qa-stat"><div class="qa-stat-n" id="qa-s-rej">0</div><div class="qa-stat-l">Rejected</div></div>
      </div>
      <div class="qa-jlist" id="qa-jlist"><div class="qa-empty">No applications yet. Start applying! 🎯</div></div>
      <div style="margin-top:10px">
        <button class="qa-btn qa-btn-danger" onclick="qaClearTracker()">🗑 Clear History</button>
      </div>
    </div>

    <!-- SETTINGS -->
    <div class="qa-panel" id="qa-panel-settings">
      <div class="qa-sec">Behavior</div>
      <div class="qa-trow"><div><div class="qa-tlbl">Auto-fill on page load</div><div class="qa-tdesc">Fill detected forms automatically</div></div><div class="qa-tog" id="qa-tog-auto"></div></div>
      <div class="qa-trow"><div><div class="qa-tlbl">Track applications</div><div class="qa-tdesc">Log every apply to Tracker</div></div><div class="qa-tog on" id="qa-tog-track"></div></div>
      <div class="qa-sec">Profile</div>
      <div class="qa-row">
        <div class="qa-field"><label>First Name</label><input id="qa-firstName" placeholder="Jane"/></div>
        <div class="qa-field"><label>Last Name</label><input id="qa-lastName" placeholder="Doe"/></div>
      </div>
      <div class="qa-field"><label>Email</label><input type="email" id="qa-email" placeholder="jane@example.com"/></div>
      <div class="qa-row">
        <div class="qa-field"><label>Phone</label><input id="qa-phone" placeholder="+1 555 0000"/></div>
        <div class="qa-field"><label>City</label><input id="qa-city" placeholder="San Francisco"/></div>
      </div>
      <div class="qa-row">
        <div class="qa-field"><label>State</label><input id="qa-state" placeholder="CA"/></div>
        <div class="qa-field"><label>Zip</label><input id="qa-zip" placeholder="94105"/></div>
      </div>
      <div class="qa-field"><label>Job Title</label><input id="qa-jobTitle" placeholder="Senior Software Engineer"/></div>
      <div class="qa-field"><label>Skills</label><input id="qa-skills" placeholder="React, Node.js, Python"/></div>
      <div class="qa-field"><label>LinkedIn</label><input id="qa-linkedin" placeholder="linkedin.com/in/jane"/></div>
      <div class="qa-field"><label>CV / Resume Text</label>
        <textarea id="qa-summary" style="min-height:80px" placeholder="Paste your full resume text here for AI features..."></textarea>
      </div>
      <div class="qa-sec">AI Configuration</div>
      <div class="qa-field"><label>Anthropic API Key</label><input type="password" id="qa-apiKey" placeholder="sk-ant-api03-..."/></div>
      <div class="qa-api-note">Get a free key at <a href="https://console.anthropic.com" target="_blank">console.anthropic.com</a>. Stored locally only.</div>
      <div style="margin-top:10px">
        <button class="qa-btn qa-btn-green" onclick="qaSaveSettings()">💾 Save Settings</button>
      </div>
      <div class="qa-flash qa-flash-ok" id="qa-saved-msg">✓ Saved!</div>
      <div style="margin-top:8px">
        <button class="qa-btn qa-btn-outline" onclick="openQAPricing()">⭐ Manage Subscription</button>
      </div>
    </div>

  </div><!-- /panels -->

  <!-- Bottom bar -->
  <div class="qa-bottom">
    <button class="qa-btn qa-btn-green" onclick="qaFillPage()">⚡ Auto-Fill</button>
    <button class="qa-btn qa-btn-outline" onclick="qaMarkApplied()">✓ Mark Applied</button>
  </div>
</div>

<!-- PRICING MODAL -->
<div class="qa-overlay" id="qa-pricing-overlay">
<div class="qa-modal">
  <button class="qa-modal-x" onclick="closeQAPricing()">✕</button>
  <div class="qa-modal-hdr">
    <h2>Upgrade QuickApply</h2>
    <p>Unlock unlimited AI features to land your dream job</p>
  </div>
  <div class="qa-bill-row">
    <span class="qa-bill-lbl active" id="qa-bill-mon" onclick="qaSetBilling('monthly')">Monthly</span>
    <div class="qa-bill-sw" id="qa-bill-sw" onclick="qaToggleBilling()"></div>
    <span class="qa-bill-lbl" id="qa-bill-ann" onclick="qaSetBilling('annual')">Annual <span class="qa-save-badge">Save 40%</span></span>
  </div>
  <div class="qa-plans">
    <div class="qa-plan-card">
      <div class="qa-plan-top">
        <div class="qa-plan-name" style="color:#64748b">Free</div>
        <div><div class="qa-plan-amt" style="color:#64748b">$0</div><div class="qa-plan-per">forever</div></div>
      </div>
      <div class="qa-plan-desc">3 credits/day · Basic features</div>
      <div class="qa-plan-feats">
        <div class="qa-pf"><span class="qa-pf-y">✓</span> Auto-fill on 6 platforms</div>
        <div class="qa-pf"><span class="qa-pf-y">✓</span> Cover letter generator</div>
        <div class="qa-pf dim"><span class="qa-pf-n">✕</span> CV alignment & scoring</div>
        <div class="qa-pf dim"><span class="qa-pf-n">✕</span> CV rewrite to 100% match</div>
      </div>
      <button class="qa-btn qa-btn-outline" disabled>Current Plan</button>
    </div>
    <div class="qa-plan-card">
      <div class="qa-plan-top">
        <div class="qa-plan-name">Starter</div>
        <div><div class="qa-plan-amt" id="qa-p-starter">$7.99</div><div class="qa-plan-per" id="qa-pp-starter">/month</div></div>
      </div>
      <div class="qa-plan-desc">50 credits/month · CV scoring</div>
      <div class="qa-plan-feats">
        <div class="qa-pf"><span class="qa-pf-y">✓</span> 50 AI credits / month</div>
        <div class="qa-pf"><span class="qa-pf-y">✓</span> CV alignment & ATS scoring</div>
        <div class="qa-pf dim"><span class="qa-pf-n">✕</span> CV rewrite</div>
        <div class="qa-pf dim"><span class="qa-pf-n">✕</span> Interview prep</div>
      </div>
      <button class="qa-btn qa-btn-outline" onclick="qaSelectPlan('starter')">Get Starter →</button>
    </div>
    <div class="qa-plan-card featured pop">
      <div class="qa-plan-top">
        <div class="qa-plan-name" style="color:#16a34a">Pro</div>
        <div><div class="qa-plan-amt" style="color:#16a34a" id="qa-p-pro">$14.99</div><div class="qa-plan-per" id="qa-pp-pro">/month</div></div>
      </div>
      <div class="qa-plan-desc">Unlimited credits · All features</div>
      <div class="qa-plan-feats">
        <div class="qa-pf"><span class="qa-pf-y">✓</span> Unlimited AI credits</div>
        <div class="qa-pf"><span class="qa-pf-y">✓</span> CV alignment & scoring</div>
        <div class="qa-pf"><span class="qa-pf-y">✓</span> CV rewrite to 100% match</div>
        <div class="qa-pf"><span class="qa-pf-y">✓</span> Interview Q&A prep</div>
      </div>
      <button class="qa-btn qa-btn-green" onclick="qaSelectPlan('pro')">Get Pro → Most Popular</button>
    </div>
    <div class="qa-plan-card">
      <div class="qa-plan-top">
        <div class="qa-plan-name" style="color:#ca8a04">Ultra</div>
        <div><div class="qa-plan-amt" style="color:#ca8a04" id="qa-p-ultra">$29.99</div><div class="qa-plan-per" id="qa-pp-ultra">/month</div></div>
      </div>
      <div class="qa-plan-desc">Everything in Pro + power tools</div>
      <div class="qa-plan-feats">
        <div class="qa-pf"><span class="qa-pf-y">✓</span> Everything in Pro</div>
        <div class="qa-pf"><span class="qa-pf-y">✓</span> Multiple CV profiles</div>
        <div class="qa-pf"><span class="qa-pf-y">✓</span> Salary negotiation coach</div>
        <div class="qa-pf"><span class="qa-pf-y">✓</span> LinkedIn optimizer</div>
      </div>
      <button class="qa-btn qa-btn-gold" onclick="qaSelectPlan('ultra')">Get Ultra →</button>
    </div>
  </div>

  <div class="qa-pay-form" id="qa-pay-form">
    <h3>💳 Complete Purchase</h3>
    <div class="qa-pay-summary">
      <div><div class="qa-pay-plan" id="qa-pay-plan-name">Pro Plan</div>
        <div class="qa-pay-desc" id="qa-pay-desc">Billed monthly</div></div>
      <div class="qa-pay-amt" id="qa-pay-amt">$14.99</div>
    </div>
    <div class="qa-field"><label>Full Name</label><input id="qa-pay-name" placeholder="Jane Doe"/></div>
    <div class="qa-field"><label>Email</label><input type="email" id="qa-pay-email" placeholder="jane@example.com"/></div>
    <div class="qa-card-wrap">
      <div class="qa-card-row"><label>Card</label><input id="qa-card-num" placeholder="1234 5678 9012 3456" maxlength="19" oninput="qaFmtCard(this)"/></div>
      <div class="qa-card-row"><label>Expires</label><input id="qa-card-exp" placeholder="MM / YY" maxlength="7" oninput="qaFmtExp(this)" style="max-width:90px"/><label style="width:35px;padding-left:8px">CVC</label><input id="qa-card-cvc" placeholder="123" maxlength="4" style="max-width:60px"/></div>
    </div>
    <div class="qa-secure"><svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>256-bit SSL · PCI-compliant · Powered by Stripe</div>
    <button class="qa-btn qa-btn-green" id="qa-pay-btn" onclick="qaProcessPayment()">🔒 Subscribe Now</button>
    <div class="qa-flash" id="qa-pay-msg" style="margin-top:8px"></div>
    <div class="qa-powered">Powered by <a href="https://stripe.com" target="_blank">Stripe</a> · Cancel anytime</div>
  </div>
</div>
</div>
`;
    document.body.appendChild(wrap);
    initQASidebar();
  }

  // ── Init sidebar logic ─────────────────────────────────────
  function initQASidebar() {
    // Tab switching
    document.querySelectorAll('.qa-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.qa-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.qa-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('qa-panel-' + tab.dataset.qtab).classList.add('active');
        if (tab.dataset.qtab === 'tracker') qaLoadTracker();
      });
    });
    // Toggles
    document.querySelectorAll('.qa-tog').forEach(t => t.addEventListener('click', () => t.classList.toggle('on')));
    loadQAProfile();
    qaUpdateCredits();
    detectJob();
  }

  // ── Job detection ─────────────────────────────────────────
  function detectJob() {
    const titleSels = ['h1','[class*="job-title"],[class*="jobtitle"]','[data-job-title]','h2'];
    let title = '';
    for (const s of titleSels) {
      const el = document.querySelector(s);
      if (el && el.textContent.trim().length > 3) { title = el.textContent.trim().replace(/\s[-|].*/,'').substring(0,80); break; }
    }
    if (!title) title = document.title.replace(/\s[-|].*/,'').substring(0,80);

    const compSels = ['[class*="company-name"],[class*="companyName"],[class*="employer"],[data-company]'];
    let company = '';
    for (const s of compSels) {
      const el = document.querySelector(s);
      if (el && el.textContent.trim()) { company = el.textContent.trim().substring(0,50); break; }
    }

    const titleEl = document.getElementById('qa-job-title');
    const metaEl  = document.getElementById('qa-job-meta');
    if (titleEl) titleEl.textContent = title || 'Open a job posting to begin';
    if (metaEl)  metaEl.innerHTML = [PLATFORM, company].filter(Boolean).map(s => `<span>${s}</span>`).join('<span class="dot"></span>');
  }

  // ── Profile load/save ─────────────────────────────────────
  const QA_FIELDS = ['firstName','lastName','email','phone','city','state','zip','jobTitle','skills','linkedin','summary','apiKey'];
  function loadQAProfile() {
    chrome.storage.local.get(['profile','settings'], ({ profile, settings }) => {
      if (profile) QA_FIELDS.forEach(f => { const el = document.getElementById('qa-'+f); if (el && profile[f]) el.value = profile[f]; });
      if (settings) {
        if (settings.autoFill !== undefined) document.getElementById('qa-tog-auto').classList.toggle('on', settings.autoFill);
        if (settings.trackApps !== undefined) document.getElementById('qa-tog-track').classList.toggle('on', settings.trackApps);
        if (settings.apiKey) { const el = document.getElementById('qa-apiKey'); if (el) el.value = settings.apiKey; }
      }
    });
  }

  window.qaSaveSettings = function() {
    const profile = {};
    ['firstName','lastName','email','phone','city','state','zip','jobTitle','skills','linkedin','summary'].forEach(f => {
      const el = document.getElementById('qa-'+f); if (el) profile[f] = el.value.trim();
    });
    const apiKey = document.getElementById('qa-apiKey')?.value.trim() || '';
    const settings = {
      autoFill:  document.getElementById('qa-tog-auto').classList.contains('on'),
      trackApps: document.getElementById('qa-tog-track').classList.contains('on'),
      apiKey
    };
    chrome.storage.local.set({ profile, settings }, () => {
      const m = document.getElementById('qa-saved-msg');
      m.classList.add('show'); setTimeout(() => m.classList.remove('show'), 2500);
    });
  };

  // ── Credits ───────────────────────────────────────────────
  const QA_PLAN_CFG = { free:{credits:3,daily:true}, starter:{credits:50,daily:false}, pro:{credits:999999}, ultra:{credits:999999} };

  function qaGetCredits(cb) {
    chrome.storage.local.get(['plan','credits','creditsDate'], data => {
      const plan = data.plan || 'free'; const cfg = QA_PLAN_CFG[plan];
      const today = new Date().toDateString(); let credits = data.credits;
      if (cfg.daily && data.creditsDate !== today) { credits = cfg.credits; chrome.storage.local.set({credits, creditsDate:today}); }
      else if (credits == null) { credits = cfg.credits; chrome.storage.local.set({credits, creditsDate:today}); }
      cb(plan, Math.max(0, credits));
    });
  }

  function qaUseCredit(cb) {
    qaGetCredits((plan, credits) => {
      if (plan==='pro'||plan==='ultra') { cb(true); return; }
      if (credits<=0) { cb(false); return; }
      chrome.storage.local.set({credits:credits-1}, () => { qaUpdateCredits(); cb(true); });
    });
  }

  function qaUpdateCredits() {
    qaGetCredits((plan, credits) => {
      const unlim = plan==='pro'||plan==='ultra';
      const fill  = document.getElementById('qa-credits-fill');
      const count = document.getElementById('qa-credits-count');
      const badge = document.getElementById('qa-plan-badge');
      const maxC  = QA_PLAN_CFG[plan]?.credits || 3;
      if (fill) { fill.style.width = unlim ? '100%' : ((credits/maxC)*100)+'%'; }
      if (count) count.textContent = unlim ? 'Unlimited' : plan==='starter' ? credits+' / 50' : credits+' / 3 daily';
      if (badge) {
        const names = {free:'FREE',starter:'STARTER',pro:'PRO ⭐',ultra:'ULTRA'};
        badge.textContent = names[plan]||'FREE';
        badge.className = 'qa-plan-badge' + (plan!=='free' ? ' paid' : '');
      }
    });
  }

  // ── Fill forms ────────────────────────────────────────────
  function buildMap(p) {
    return [
      {re:/first[\s._-]?name|fname|given/i,       v:p.firstName},
      {re:/last[\s._-]?name|lname|family|surname/i,v:p.lastName},
      {re:/full[\s._-]?name|your[\s._-]?name/i,    v:(p.firstName+' '+p.lastName).trim()},
      {re:/\bemail\b|e-mail/i,                     v:p.email},
      {re:/phone|mobile|telephone/i,               v:p.phone},
      {re:/\bcity\b/i,                             v:p.city},
      {re:/\bstate\b|\bprovince\b/i,               v:p.state},
      {re:/\bzip\b|postal/i,                       v:p.zip},
      {re:/linkedin/i,                             v:p.linkedin},
      {re:/website|portfolio/i,                    v:p.website||''},
      {re:/current[\s._-]?title|job[\s._-]?title|position/i,v:p.jobTitle},
      {re:/salary|compensation/i,                  v:p.salary||''},
      {re:/education|degree/i,                     v:p.education||''},
      {re:/\bskills?\b|expertise/i,                v:p.skills},
      {re:/summary|cover[\s._-]?letter|motivation|about/i,v:p.summary},
    ];
  }

  function qaHint(el) {
    const lbl = document.querySelector('label[for="'+el.id+'"]');
    return [el.name,el.id,el.placeholder,el.getAttribute('aria-label')||'',lbl?lbl.textContent:'',el.closest('label')?el.closest('label').textContent:''].join(' ').toLowerCase();
  }

  function qaSetVal(el, val) {
    const proto = el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto,'value');
    if (setter?.set) setter.set.call(el,val); else el.value=val;
    ['input','change','blur'].forEach(e=>el.dispatchEvent(new Event(e,{bubbles:true})));
  }

  function doFill(profile) {
    const map = buildMap(profile);
    const sel = "input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=checkbox]):not([type=radio]):not([type=file]),textarea";
    let n=0;
    document.querySelectorAll(sel).forEach(el => {
      if (el.closest('#qa-sidebar')||el.closest('#qa-pricing-overlay')) return;
      if (el.readOnly||el.disabled) return;
      const h = qaHint(el);
      for (const {re,v} of map) { if (v && re.test(h)) { qaSetVal(el,v); n++; break; } }
    });
    return n;
  }

  window.qaFillPage = function() {
    qaUseCredit(ok => {
      if (!ok) { qaToast('No credits left! Upgrade to continue.','warn'); openQAPricing(); return; }
      chrome.storage.local.get('profile', ({profile}) => {
        if (!profile?.firstName) { qaToast('Save your profile in Settings first!','warn'); return; }
        const n = doFill(profile);
        if (document.getElementById('qa-tog-track')?.classList.contains('on')) qaTrackApp(profile);
        qaToast(n>0 ? 'Filled '+n+' field'+(n>1?'s':'')+'!' : 'No matching fields found.', n>0?'ok':'warn');
      });
    });
  };

  window.qaMarkApplied = function() {
    chrome.storage.local.get('profile', ({profile}) => {
      if (!profile) return;
      qaTrackApp(profile);
      qaToast('Application marked as applied!','ok');
    });
  };

  function qaTrackApp(profile) {
    const titleEl = document.querySelector('h1,[class*="job-title"]');
    let title = titleEl ? titleEl.textContent.trim() : document.title;
    title = title.replace(/\s[-|].*/,'').substring(0,80);
    const compEl = document.querySelector('[class*="company-name"],[class*="companyName"]');
    const company = compEl ? compEl.textContent.trim().substring(0,50) : PLATFORM;
    chrome.storage.local.get('applications',({applications})=>{
      const apps=applications||[];
      if (apps.some(a=>a.title===title&&Date.now()-a.date<300000)) return;
      apps.push({title,company,platform:PLATFORM,date:Date.now(),status:'applied'});
      if(apps.length>300) apps.splice(0,apps.length-300);
      chrome.storage.local.set({applications:apps},()=>qaLoadTracker());
    });
  }

  // ── Claude API ────────────────────────────────────────────
  async function qaCallClaude(apiKey, prompt, maxTokens) {
    const res = await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:maxTokens,messages:[{role:'user',content:prompt}]})
    });
    const d = await res.json();
    if (d.error) throw new Error(d.error.message);
    return d.content?.[0]?.text || '';
  }

  function qaGetKey(cb) {
    chrome.storage.local.get('settings',({settings})=>cb(settings?.apiKey?.trim()||''));
  }

  // ── Quick cover letter (Apply tab) ────────────────────────
  window.qaQuickCoverLetter = function() {
    chrome.storage.local.get('profile',async({profile})=>{
      if (!profile?.firstName) { qaToast('Save your profile in Settings first!','warn'); return; }
      qaGetKey(async apiKey=>{
        if (!apiKey) { qaToast('Add your API key in Settings!','warn'); return; }
        qaUseCredit(async ok=>{
          if (!ok) { openQAPricing(); return; }
          const btn=document.getElementById('qa-quick-cl-btn');
          const out=document.getElementById('qa-quick-cl-out');
          btn.disabled=true; btn.textContent='Writing...';
          out.innerHTML='<span class="qa-thinking">Generating cover letter</span>';
          out.classList.add('show');

          // Try to grab job description from page
          const jdEl = document.querySelector('[class*="description"],[class*="job-desc"],[id*="description"]');
          const jd = jdEl ? jdEl.textContent.substring(0,2000) : 'Job on '+PLATFORM+' — '+document.title;

          const prompt=`Write a 3-paragraph cover letter.
Candidate: ${profile.firstName} ${profile.lastName}, ${profile.jobTitle||''}
Skills: ${profile.skills||''} | Education: ${profile.education||''}
Summary: ${(profile.summary||'').substring(0,300)}
Job: ${jd}
Start "Dear Hiring Manager," — end "Sincerely,\n${profile.firstName} ${profile.lastName}"`;
          try {
            const text=await qaCallClaude(apiKey,prompt,800);
            out.textContent=text;
            // Auto-insert
            const tas=Array.from(document.querySelectorAll('textarea')).filter(t=>!t.closest('#qa-sidebar')&&!t.closest('#qa-pricing-overlay'));
            const target=tas.find(t=>/cover|letter|message|motivation|why/i.test(qaHint(t)))||tas[tas.length-1];
            if (target) { qaSetVal(target,text); qaToast('Cover letter inserted!','ok'); }
          } catch(e) { out.textContent='Error: '+e.message; }
          btn.disabled=false; btn.textContent='✨ Generate & Insert Cover Letter';
        });
      });
    });
  };

  // ── CV Analysis ───────────────────────────────────────────
  window.qaAnalyzeCV = function() {
    const jd=document.getElementById('qa-cv-jd')?.value.trim();
    if (!jd) { qaToast('Paste a job description first!','warn'); return; }
    chrome.storage.local.get('profile',async({profile})=>{
      if (!profile?.summary) { qaToast('Add your CV text in Settings!','warn'); return; }
      qaGetKey(async apiKey=>{
        if (!apiKey) { qaToast('Add your API key in Settings!','warn'); return; }
        const btn=document.getElementById('qa-analyze-btn');
        btn.disabled=true; btn.textContent='Analyzing...';
        const prompt=`ATS analyst: analyze resume vs job. Respond ONLY with JSON (no markdown):
{"score":72,"verdict":"Good Match","missing_keywords":["kw1","kw2"],"present_keywords":["kw3"],"analysis":"2 sentences."}
RESUME: ${profile.summary}\nSKILLS: ${profile.skills||''}\nJOB: ${jd}`;
        try {
          const raw=await qaCallClaude(apiKey,prompt,600);
          const data=JSON.parse(raw.replace(/```json|```/g,'').trim());
          qaRenderATS(data,profile,jd,apiKey);
        } catch(e) { qaToast('Analysis failed: '+e.message,'err'); }
        btn.disabled=false; btn.textContent='📊 Score My CV';
      });
    });
  };

  function qaRenderATS(data,profile,jd,apiKey) {
    document.getElementById('qa-ats-result').style.display='block';
    const score=Math.min(100,Math.max(0,parseInt(data.score)||0));
    const circ=2*Math.PI*35;
    const ring=document.getElementById('qa-ring');
    ring.style.strokeDashoffset=circ-(score/100)*circ;
    const color=score>=80?'#16a34a':score>=60?'#f59e0b':'#ef4444';
    ring.style.stroke=color;
    const pEl=document.getElementById('qa-ats-pct'); pEl.textContent=score+'%'; pEl.style.color=color;
    const vEl=document.getElementById('qa-ats-verdict'); vEl.textContent=data.verdict||''; vEl.style.color=color;
    document.getElementById('qa-kw-missing').innerHTML=(data.missing_keywords||[]).slice(0,12).map(k=>`<span class="qa-pill qa-pill-miss" onclick="navigator.clipboard.writeText(${JSON.stringify(k)});this.textContent='Copied!';setTimeout(()=>this.textContent='+\u00a0${k.replace(/'/g,"\\'")}',1400)">+ ${k}</span>`).join('');
    document.getElementById('qa-kw-present').innerHTML=(data.present_keywords||[]).slice(0,10).map(k=>`<span class="qa-pill qa-pill-have">✓ ${k}</span>`).join('');
    document.getElementById('qa-rewrite-btn').onclick=()=>qaRewrite(profile,jd,apiKey,data.missing_keywords||[]);
  }

  async function qaRewrite(profile,jd,apiKey,missing) {
    chrome.storage.local.get('plan',async({plan})=>{
      if (!plan||plan==='free'||plan==='starter') { openQAPricing(); return; }
      qaUseCredit(async ok=>{
        if (!ok) { openQAPricing(); return; }
        const btn=document.getElementById('qa-rewrite-btn');
        btn.disabled=true; btn.textContent='Rewriting...';
        const prompt=`Rewrite resume for 100% ATS match. Keep all real experience. Mark additions [ADDED: text]. Use sections: SUMMARY | EXPERIENCE | SKILLS | EDUCATION.\nMissing keywords: ${missing.join(', ')}\nRESUME: ${profile.summary}\nJOB: ${jd}`;
        try {
          const res=await qaCallClaude(apiKey,prompt,1800);
          document.getElementById('qa-rewrite-out').style.display='block';
          const html=res.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\[ADDED: ([^\]]+)\]/g,'<span class="qa-diff-add">$1</span>');
          document.getElementById('qa-diff-box').innerHTML=html;
        } catch(e) { qaToast('Rewrite failed: '+e.message,'err'); }
        btn.disabled=false; btn.textContent='✨ Rewrite CV to 100% Match';
      });
    });
  }

  window.qaInsertRewrite=function(){
    const text=document.getElementById('qa-diff-box')?.textContent;
    if (text) { const tas=Array.from(document.querySelectorAll('textarea')).filter(t=>!t.closest('#qa-sidebar')); if(tas.length){qaSetVal(tas[0],text);qaToast('Inserted!','ok');}}
  };
  document.addEventListener('click',e=>{
    const b=e.target.closest('#qa-copy-cv-btn');
    if(b){navigator.clipboard.writeText(document.getElementById('qa-diff-box')?.textContent||'').then(()=>{b.textContent='Copied!';setTimeout(()=>b.textContent='📋 Copy',2000);}); }
  });

  // ── AI Tools ──────────────────────────────────────────────
  window.qaGenCL=function(){
    const jd=document.getElementById('qa-jd')?.value.trim();
    if(!jd){qaToast('Paste a job description first!','warn');return;}
    chrome.storage.local.get('profile',async({profile})=>{
      if(!profile?.firstName){qaToast('Save your profile in Settings!','warn');return;}
      qaGetKey(async apiKey=>{
        if(!apiKey){qaToast('Add your API key in Settings!','warn');return;}
        qaUseCredit(async ok=>{
          if(!ok){openQAPricing();return;}
          const btn=document.getElementById('qa-cl-btn'),out=document.getElementById('qa-cl-out');
          btn.disabled=true;btn.textContent='Writing...';
          out.innerHTML='<span class="qa-thinking">Crafting cover letter</span>';out.classList.add('show');
          document.getElementById('qa-cl-actions').style.display='none';
          const prompt=`Write a compelling 3-paragraph cover letter.\nCandidate: ${profile.firstName} ${profile.lastName}, ${profile.jobTitle||''}\nSkills: ${profile.skills||''}\nBackground: ${(profile.summary||'').substring(0,300)}\nJob:\n${jd}\nStart "Dear Hiring Manager," — end "Sincerely,\n${profile.firstName} ${profile.lastName}"`;
          try{out.textContent=await qaCallClaude(apiKey,prompt,900);document.getElementById('qa-cl-actions').style.display='flex';}catch(e){out.textContent='Error: '+e.message;}
          btn.disabled=false;btn.textContent='✨ Generate Cover Letter';
        });
      });
    });
  };
  window.qaCopyCL=()=>navigator.clipboard.writeText(document.getElementById('qa-cl-out')?.textContent||'').then(()=>qaToast('Copied!','ok'));
  window.qaInsertCL=()=>{
    const text=document.getElementById('qa-cl-out')?.textContent;
    const tas=Array.from(document.querySelectorAll('textarea')).filter(t=>!t.closest('#qa-sidebar'));
    const target=tas.find(t=>/cover|letter|message|motivation/i.test(qaHint(t)))||tas[tas.length-1];
    if(target){qaSetVal(target,text);qaToast('Cover letter inserted!','ok');}else{qaToast('No text area found.','warn');}
  };
  window.qaExtractKW=function(){
    const jd=document.getElementById('qa-jd')?.value.trim();
    if(!jd){qaToast('Paste a job description first!','warn');return;}
    qaGetKey(async apiKey=>{
      if(!apiKey){qaToast('Add your API key!','warn');return;}
      const btn=document.getElementById('qa-kw-btn'),out=document.getElementById('qa-kw-out');
      btn.disabled=true;btn.textContent='Analyzing...';
      out.innerHTML='<span class="qa-thinking">Extracting keywords</span>';out.classList.add('show');
      try{out.textContent=await qaCallClaude(apiKey,`List top 12 ATS keywords from this job. For each: keyword, why it matters, sample bullet point.\n\n${jd}`,600);}catch(e){out.textContent='Error: '+e.message;}
      btn.disabled=false;btn.textContent='🔍 Extract Keywords';
    });
  };
  window.qaInterview=function(){
    chrome.storage.local.get(['plan','profile'],async({plan,profile})=>{
      if(!plan||plan==='free'){openQAPricing();return;}
      const jd=document.getElementById('qa-jd')?.value.trim();
      if(!jd){qaToast('Paste a job description first!','warn');return;}
      qaGetKey(async apiKey=>{
        if(!apiKey){qaToast('Add your API key!','warn');return;}
        const btn=document.getElementById('qa-int-btn'),out=document.getElementById('qa-int-out');
        btn.disabled=true;btn.textContent='Generating...';
        out.innerHTML='<span class="qa-thinking">Preparing questions</span>';out.classList.add('show');
        try{out.textContent=await qaCallClaude(apiKey,`Generate 6 interview Q&A (STAR method).\nCandidate: ${profile?.jobTitle||''}, Skills: ${profile?.skills||''}\nJob:\n${jd}\nFormat:\nQ: [question]\nA: [answer]\n---`,1000);}catch(e){out.textContent='Error: '+e.message;}
        btn.disabled=false;btn.textContent='🎤 Generate Interview Q&A';
      });
    });
  };

  // ── Tracker ───────────────────────────────────────────────
  const QA_STATUSES=['applied','interview','offer','rejected'];
  const QA_STAT_LBL={applied:'Applied',interview:'Interview',offer:'Offer',rejected:'Rejected'};
  const QA_ICONS={LinkedIn:'💼',Indeed:'🔍',Glassdoor:'💚',Greenhouse:'🌿',Lever:'⚙️',Workday:'🔷',Other:'📋'};

  function qaLoadTracker(){
    chrome.storage.local.get('applications',({applications})=>{
      const apps=applications||[];
      document.getElementById('qa-s-total').textContent=apps.length;
      document.getElementById('qa-s-int').textContent=apps.filter(a=>a.status==='interview').length;
      document.getElementById('qa-s-offer').textContent=apps.filter(a=>a.status==='offer').length;
      document.getElementById('qa-s-rej').textContent=apps.filter(a=>a.status==='rejected').length;
      const list=document.getElementById('qa-jlist');
      if(!apps.length){list.innerHTML='<div class="qa-empty">No applications yet. Start applying! 🎯</div>';return;}
      list.innerHTML=apps.slice().reverse().slice(0,20).map((app,i)=>{
        const idx=apps.length-1-i,s=app.status||'applied';
        const dt=new Date(app.date).toLocaleDateString('en-US',{month:'short',day:'numeric'});
        return `<div class="qa-jitem"><div class="qa-jico">${QA_ICONS[app.platform]||'📋'}</div><div class="qa-jinfo"><div class="qa-jtitle">${app.title||'Job Application'}</div><div class="qa-jmeta">${app.company||app.platform} · ${dt}</div></div><span class="qa-jtag qa-t-${s}" data-idx="${idx}">${QA_STAT_LBL[s]}</span></div>`;
      }).join('');
      list.querySelectorAll('.qa-jtag').forEach(tag=>{
        tag.addEventListener('click',()=>{
          const idx=parseInt(tag.dataset.idx),a2=[...apps];
          a2[idx].status=QA_STATUSES[(QA_STATUSES.indexOf(a2[idx].status||'applied')+1)%QA_STATUSES.length];
          chrome.storage.local.set({applications:a2},qaLoadTracker);
        });
      });
    });
  }
  window.qaClearTracker=()=>{if(confirm('Clear all history?'))chrome.storage.local.remove('applications',qaLoadTracker);};

  // ── Pricing ───────────────────────────────────────────────
  const QA_SERVER_URL='https://your-server.onrender.com'; // ← update this
  let qaBillingMode='monthly',qaSelectedPlan=null;
  const QA_PRICES={monthly:{starter:'$7.99',pro:'$14.99',ultra:'$29.99'},annual:{starter:'$4.99',pro:'$8.99',ultra:'$17.99'}};
  const QA_PLAN_LABEL={starter:'Starter',pro:'Pro',ultra:'Ultra'};

  window.openQAPricing=()=>document.getElementById('qa-pricing-overlay').classList.add('show');
  window.closeQAPricing=()=>{document.getElementById('qa-pricing-overlay').classList.remove('show');document.getElementById('qa-pay-form').classList.remove('show');qaSelectedPlan=null;};
  window.qaToggleBilling=()=>qaSetBilling(qaBillingMode==='monthly'?'annual':'monthly');
  window.qaSetBilling=function(mode){
    qaBillingMode=mode;
    document.getElementById('qa-bill-sw').classList.toggle('ann',mode==='annual');
    document.getElementById('qa-bill-mon').classList.toggle('active',mode==='monthly');
    document.getElementById('qa-bill-ann').classList.toggle('active',mode==='annual');
    const p=QA_PRICES[mode];
    ['starter','pro','ultra'].forEach(n=>{
      const pe=document.getElementById('qa-p-'+n),pr=document.getElementById('qa-pp-'+n);
      if(pe)pe.textContent=p[n];if(pr)pr.textContent=mode==='annual'?'/mo, billed yearly':'/month';
    });
  };
  window.qaSelectPlan=function(name){
    qaSelectedPlan=name;
    const p=QA_PRICES[qaBillingMode];
    document.getElementById('qa-pay-plan-name').textContent=QA_PLAN_LABEL[name]+' Plan';
    document.getElementById('qa-pay-amt').textContent=p[name];
    document.getElementById('qa-pay-desc').textContent=qaBillingMode==='annual'?p[name]+'/mo · Billed annually · Cancel anytime':p[name]+'/month · Cancel anytime';
    chrome.storage.local.get('profile',({profile})=>{
      if(profile?.email)document.getElementById('qa-pay-email').value=profile.email;
      if(profile?.firstName)document.getElementById('qa-pay-name').value=(profile.firstName+' '+(profile.lastName||'')).trim();
    });
    const pf=document.getElementById('qa-pay-form');pf.classList.add('show');
    setTimeout(()=>pf.scrollIntoView({behavior:'smooth',block:'nearest'}),50);
  };
  window.qaFmtCard=el=>{let v=el.value.replace(/\D/g,'').substring(0,16);el.value=v.replace(/(.{4})/g,'$1 ').trim();};
  window.qaFmtExp=el=>{let v=el.value.replace(/\D/g,'').substring(0,4);if(v.length>=2)v=v.substring(0,2)+' / '+v.substring(2);el.value=v;};

  window.qaProcessPayment=async function(){
    if(!qaSelectedPlan){qaShowPayMsg('Select a plan above.',false);return;}
    const name=document.getElementById('qa-pay-name')?.value.trim();
    const email=document.getElementById('qa-pay-email')?.value.trim();
    const cardNum=document.getElementById('qa-card-num')?.value.replace(/\s/g,'');
    const expiry=document.getElementById('qa-card-exp')?.value.replace(/\s/g,'');
    const cvc=document.getElementById('qa-card-cvc')?.value.trim();
    if(!name){qaShowPayMsg('Enter your full name.',false);return;}
    if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){qaShowPayMsg('Enter a valid email.',false);return;}
    if(!cardNum||cardNum.length<15){qaShowPayMsg('Enter a valid card number.',false);return;}
    if(!expiry||expiry.length<4){qaShowPayMsg('Enter card expiry.',false);return;}
    if(!cvc||cvc.length<3){qaShowPayMsg('Enter your CVC.',false);return;}
    const expParts=expiry.replace(/\s/g,'').split('/');
    const expMonth=expParts[0],expYear=expParts[1]?(expParts[1].length===2?'20'+expParts[1]:expParts[1]):'';
    const btn=document.getElementById('qa-pay-btn');
    btn.disabled=true;btn.textContent='Processing...';
    try{
      const res=await fetch(QA_SERVER_URL+'/api/create-subscription',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({card:{number:cardNum,exp_month:expMonth,exp_year:expYear,cvc},plan:qaSelectedPlan,billing:qaBillingMode,email,name,extensionUserId:chrome.runtime?.id||'unknown'})});
      const data=await res.json();
      if(data.error){qaShowPayMsg('Payment failed: '+data.error,false);btn.disabled=false;btn.textContent='🔒 Subscribe Now';return;}
      const planCredits={starter:50,pro:999999,ultra:999999};
      chrome.storage.local.set({plan:qaSelectedPlan,credits:planCredits[qaSelectedPlan],creditsDate:new Date().toDateString(),subscriptionId:data.subscriptionId||'',customerId:data.customerId||'',userEmail:email},()=>{
        qaUpdateCredits();
        qaShowPayMsg('Welcome to '+QA_PLAN_LABEL[qaSelectedPlan]+'! Plan is now active.',true);
        setTimeout(()=>closeQAPricing(),3000);
      });
    }catch(e){qaShowPayMsg('Cannot reach payment server.',false);btn.disabled=false;btn.textContent='🔒 Subscribe Now';}
  };

  function qaShowPayMsg(msg,ok){
    const el=document.getElementById('qa-pay-msg');
    el.textContent=msg;el.className='qa-flash '+(ok?'qa-flash-ok':'qa-flash-err')+' show';
    if(ok)setTimeout(()=>el.classList.remove('show'),3500);
  }

  // ── Toast ─────────────────────────────────────────────────
  function qaToast(msg,type){
    document.getElementById('qa-toast-el')?.remove();
    const t=document.createElement('div');t.id='qa-toast-el';
    t.className='qa-toast qa-toast-'+(type||'ok');t.textContent=msg;
    document.body.appendChild(t);
    requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.add('show')));
    setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),400);},3800);
  }

  // ── Auto-open ─────────────────────────────────────────────
  chrome.storage.local.get('settings',({settings})=>{
    if(settings?.autoFill){
      chrome.storage.local.get('profile',({profile})=>{if(profile?.firstName)setTimeout(()=>doFill(profile),1000);});
    }
  });

  // SPA nav support
  let qaLastUrl=location.href;
  new MutationObserver(()=>{
    if(location.href!==qaLastUrl){qaLastUrl=location.href;setTimeout(detectJob,1500);}
  }).observe(document.documentElement,{subtree:true,childList:true});

  buildSidebar();
})();
