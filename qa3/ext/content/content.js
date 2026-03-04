// QuickApply v5 — Full Featured Sidebar
(function () {
  'use strict';
  if (document.getElementById('qa-sidebar')) return;

  const SERVER = 'https://quick-apply-2-qf7r.onrender.com';

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

  // ════════════════════════════════════════════
  //  SIDEBAR HTML
  // ════════════════════════════════════════════
  const sidebar = document.createElement('div');
  sidebar.id = 'qa-sidebar';
  sidebar.innerHTML = `

  <!-- LOGIN SCREEN -->
  <div id="qa-screen-login" class="qa-screen">
    <div class="qa-auth-hdr">
      <div class="qa-logo"><div class="qa-logo-icon">Q</div><div class="qa-logo-name">Quick<span>Apply</span></div></div>
      <button class="qa-close-btn" id="qa-auth-close">✕</button>
    </div>
    <div class="qa-auth-body">
      <div class="qa-auth-icon">Q</div>
      <h2 class="qa-auth-title">Welcome to QuickApply</h2>
      <p class="qa-auth-sub">Sign in to access your profiles, applications and AI tools</p>
      <div id="qa-login-err" class="qa-alert-err" style="display:none;width:100%;margin-bottom:10px"></div>

      <!-- LOGIN FORM -->
      <div id="qa-form-login" style="width:100%">
        <div class="qa-field"><label>Email</label><input type="email" id="qa-l-email" placeholder="jane@example.com" autocomplete="email"/></div>
        <div class="qa-field"><label>Password</label><input type="password" id="qa-l-pass" placeholder="••••••••" autocomplete="current-password"/></div>
        <div class="qa-auth-row">
          <label class="qa-check-lbl"><input type="checkbox" id="qa-remember" checked/> Remember me</label>
          <span class="qa-link" id="qa-to-forgot">Forgot password?</span>
        </div>
        <button class="qa-btn qa-btn-green" id="qa-login-btn" style="margin-top:4px">Sign In</button>
        <p class="qa-auth-switch">No account? <span class="qa-link qa-link-bold" id="qa-to-signup">Create one free →</span></p>
      </div>

      <!-- SIGNUP FORM -->
      <div id="qa-form-signup" style="width:100%;display:none">
        <div class="qa-row">
          <div class="qa-field"><label>First Name</label><input id="qa-s-fn" placeholder="Jane" autocomplete="given-name"/></div>
          <div class="qa-field"><label>Last Name</label><input id="qa-s-ln" placeholder="Doe" autocomplete="family-name"/></div>
        </div>
        <div class="qa-field"><label>Email</label><input type="email" id="qa-s-email" placeholder="jane@example.com" autocomplete="email"/></div>
        <div class="qa-field"><label>Password</label><input type="password" id="qa-s-pass" placeholder="Min 8 characters" autocomplete="new-password"/></div>
        <div class="qa-field"><label>Confirm Password</label><input type="password" id="qa-s-pass2" placeholder="Repeat password" autocomplete="new-password"/></div>
        <button class="qa-btn qa-btn-green" id="qa-signup-btn">Create Free Account</button>
        <p class="qa-auth-switch">Have an account? <span class="qa-link qa-link-bold" id="qa-to-login">Sign in →</span></p>
      </div>

      <!-- FORGOT FORM -->
      <div id="qa-form-forgot" style="width:100%;display:none">
        <p style="font-size:12px;color:#6b7280;margin-bottom:12px;text-align:center">Enter your email and we'll send reset instructions.</p>
        <div class="qa-field"><label>Email</label><input type="email" id="qa-f-email" placeholder="jane@example.com"/></div>
        <button class="qa-btn qa-btn-green" id="qa-forgot-btn">Send Reset Email</button>
        <p class="qa-auth-switch"><span class="qa-link" id="qa-to-login2">← Back to sign in</span></p>
      </div>
    </div>
  </div>

  <!-- MAIN APP -->
  <div id="qa-screen-app" class="qa-screen" style="display:none">
    <div class="qa-hdr">
      <div class="qa-logo"><div class="qa-logo-icon">Q</div><div class="qa-logo-name">Quick<span>Apply</span></div></div>
      <div class="qa-hdr-right">
        <div class="qa-credits-badge" id="qa-cred-badge">⚡ <span id="qa-cred-text">3 credits</span></div>
        <button class="qa-plan-btn" id="qa-plan-btn">FREE</button>
        <button class="qa-close-btn" id="qa-app-close">✕</button>
      </div>
    </div>

    <div id="qa-renew-banner" class="qa-renew-banner" style="display:none">
      <span>⚠️ Expires in <strong id="qa-renew-days">3</strong> days</span>
      <button id="qa-renew-btn">Renew →</button>
    </div>

    <div class="qa-job-bar">
      <div class="qa-job-title" id="qa-job-title">Detecting job...</div>
      <div class="qa-job-meta" id="qa-job-meta"><span>${PLATFORM}</span></div>
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

        <!-- Job highlights card -->
        <div class="qa-highlights-box" id="qa-highlights-box">
          <div class="qa-highlights-title" id="qa-hl-title">Loading job details...</div>
          <div class="qa-highlights-meta" id="qa-hl-meta"></div>
          <div id="qa-hl-body" style="display:none">
            <div class="qa-hl-section" id="qa-hl-skills-wrap" style="display:none">
              <div class="qa-hl-label">Skills</div>
              <div class="qa-pills" id="qa-hl-skills"></div>
            </div>
            <div class="qa-hl-section" id="qa-hl-quals-wrap" style="display:none">
              <div class="qa-hl-label">Key Requirements</div>
              <div id="qa-hl-quals" style="font-size:11px;color:#374151;line-height:1.8"></div>
              <button class="qa-expand-btn" id="qa-hl-expand" style="display:none">+3 more</button>
            </div>
          </div>
        </div>

        <!-- Active CV row -->
        <div class="qa-cv-row">
          <div class="qa-cv-row-label">Active CV</div>
          <div id="qa-active-cv-chip" class="qa-active-cv-chip">
            <span>📄</span>
            <span id="qa-active-cv-name" class="qa-active-cv-text">No CV — add one in Settings</span>
          </div>
          <span class="qa-link" id="qa-switch-cv-btn" style="font-size:11px;white-space:nowrap">Switch</span>
        </div>
        <div id="qa-cv-switch-panel" style="display:none;margin-bottom:8px">
          <div id="qa-cv-list" class="qa-cv-list"></div>
        </div>

        <!-- PRIMARY ACTIONS — LetMeApply style -->
        <div class="qa-primary-row">
          <button class="qa-btn qa-btn-green qa-btn-primary" id="qa-tailor-btn">
            ✨ Tailor Resume <span class="qa-btn-hint">&lt; 30 sec</span>
          </button>
          <button class="qa-btn qa-btn-outline qa-btn-primary" id="qa-quick-cl-btn">
            ✉️ Cover Letter
          </button>
        </div>

        <!-- Output areas -->
        <div class="qa-output" id="qa-tailor-out" style="display:none"></div>
        <div id="qa-tailor-actions" class="qa-btn-row" style="display:none">
          <button class="qa-btn qa-btn-outline" id="qa-tailor-copy">📋 Copy</button>
          <button class="qa-btn qa-btn-green" id="qa-tailor-insert">📌 Insert</button>
          <button class="qa-btn qa-btn-outline" id="qa-tailor-save">💾 Save as CV</button>
        </div>
        <div class="qa-output" id="qa-cl-apply-out" style="display:none"></div>
        <div id="qa-cl-apply-actions" class="qa-btn-row" style="display:none">
          <button class="qa-btn qa-btn-outline" id="qa-cl-apply-copy">📋 Copy</button>
          <button class="qa-btn qa-btn-green" id="qa-cl-apply-insert">📌 Insert</button>
        </div>

        <!-- Credits meter -->
        <div class="qa-meter" style="margin-top:10px">
          <div class="qa-meter-top">
            <span class="qa-meter-label">AI Credits</span>
            <span class="qa-meter-count" id="qa-meter-count">3 / 3</span>
          </div>
          <div class="qa-meter-bar"><div class="qa-meter-fill" id="qa-meter-fill" style="width:100%"></div></div>
          <div class="qa-meter-hint">Free resets daily · <span class="qa-link" id="qa-upgrade-link">Upgrade for unlimited →</span></div>
        </div>
      </div>

      <!-- CV ALIGN TAB -->
      <div class="qa-panel" id="qa-p-cv">
        <div class="qa-card">
          <div class="qa-card-title">📊 ATS Score <span class="qa-chip qa-chip-ai">AI</span></div>
          <div class="qa-card-desc">Score your CV against this job and see exactly what's missing.</div>
          <div class="qa-field">
            <label style="display:flex;justify-content:space-between;align-items:center">
              Job Description <span class="qa-link" id="qa-fetch-jd-btn" style="font-size:10px">↻ Fetch from page</span>
            </label>
            <textarea id="qa-cv-jd" placeholder="Paste job description or click 'Fetch from page'..." style="min-height:90px"></textarea>
          </div>
          <div class="qa-field">
            <label>Select CV</label>
            <select id="qa-cv-pick-analyze"><option value="">— choose a CV profile —</option></select>
          </div>
          <button class="qa-btn qa-btn-green" id="qa-analyze-btn">📊 Analyze &amp; Score</button>
          <div id="qa-ats-result" style="display:none">
            <div class="qa-ats-wrap">
              <div class="qa-ats-ring">
                <svg viewBox="0 0 90 90"><circle class="qa-ring-bg" cx="45" cy="45" r="35"/><circle class="qa-ring-fill" id="qa-ring" cx="45" cy="45" r="35"/></svg>
                <div class="qa-ats-center"><span class="qa-ats-pct" id="qa-ats-pct">0%</span><span class="qa-ats-sub">ATS Match</span></div>
              </div>
              <div class="qa-ats-verdict" id="qa-ats-verdict"></div>
            </div>
            <div class="qa-kw-label">Missing — click to copy</div>
            <div class="qa-pills" id="qa-kw-miss"></div>
            <div class="qa-kw-label" style="margin-top:8px">Present in CV</div>
            <div class="qa-pills" id="qa-kw-have"></div>
            <div style="margin-top:12px">
              <button class="qa-btn qa-btn-gold" id="qa-rewrite-btn">✨ Rewrite to 100% Match <span class="qa-chip qa-chip-pro">PRO</span></button>
            </div>
            <div id="qa-rewrite-out" style="display:none;margin-top:10px">
              <div style="font-size:12px;font-weight:700;margin-bottom:6px">Rewritten CV <span class="qa-chip qa-chip-ai">AI</span> <span style="font-size:10px;color:#6b7280;font-weight:400">Green = added</span></div>
              <div class="qa-diff" id="qa-diff-box"></div>
              <div class="qa-btn-row">
                <button class="qa-btn qa-btn-outline" id="qa-copy-cv-btn">📋 Copy</button>
                <button class="qa-btn qa-btn-green" id="qa-insert-cv-btn">📌 Insert</button>
                <button class="qa-btn qa-btn-outline" id="qa-save-rewrite-btn">💾 Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI TOOLS TAB -->
      <div class="qa-panel" id="qa-p-ai">
        <div class="qa-card">
          <div class="qa-card-title">✨ Cover Letter <span class="qa-chip qa-chip-ai">AI</span> <span class="qa-chip qa-chip-free">FREE</span></div>
          <div class="qa-card-desc">Generate a tailored cover letter using the fetched job description.</div>
          <div class="qa-field">
            <label style="display:flex;justify-content:space-between;align-items:center">
              Job Description <span class="qa-link" id="qa-fetch-jd-ai" style="font-size:10px">↻ Fetch from page</span>
            </label>
            <textarea id="qa-jd" placeholder="Paste job description or click 'Fetch from page'..." style="min-height:80px"></textarea>
          </div>
          <button class="qa-btn qa-btn-green" id="qa-cl-btn">✨ Generate Cover Letter</button>
          <div class="qa-output" id="qa-cl-out" style="display:none"></div>
          <div class="qa-btn-row" id="qa-cl-actions" style="display:none">
            <button class="qa-btn qa-btn-outline" id="qa-copy-cl-btn">📋 Copy</button>
            <button class="qa-btn qa-btn-green" id="qa-insert-cl-btn">📌 Insert to Form</button>
          </div>
        </div>
        <div class="qa-card">
          <div class="qa-card-title">🎯 ATS Keywords <span class="qa-chip qa-chip-free">FREE</span></div>
          <div class="qa-card-desc">Extract the top ATS keywords from the job description above.</div>
          <button class="qa-btn qa-btn-outline" id="qa-kw-btn">🔍 Extract Keywords</button>
          <div class="qa-output" id="qa-kw-out" style="display:none"></div>
        </div>
        <div class="qa-card">
          <div class="qa-card-title">🎤 Interview Prep <span class="qa-chip qa-chip-pro">PRO</span></div>
          <div class="qa-card-desc">Get likely interview Q&amp;A in STAR format for this role.</div>
          <button class="qa-btn qa-btn-outline" id="qa-int-btn">🎤 Generate Interview Q&amp;A</button>
          <div class="qa-output" id="qa-int-out" style="display:none"></div>
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
        <div style="font-size:10px;color:#9ca3af;margin-bottom:8px">Click a status badge to cycle through stages</div>
        <div class="qa-jlist" id="qa-jlist"><div class="qa-empty">No applications yet. Start applying! 🎯</div></div>
        <div style="margin-top:10px"><button class="qa-btn qa-btn-danger" id="qa-clear-btn">🗑 Clear History</button></div>
      </div>

      <!-- SETTINGS TAB -->
      <div class="qa-panel" id="qa-p-settings">
        <div class="qa-sec-label">Account</div>
        <div class="qa-card" style="padding:11px 14px;margin-bottom:10px">
          <div style="display:flex;align-items:center;justify-content:space-between">
            <div><div style="font-size:12px;font-weight:700" id="qa-acct-name">—</div><div style="font-size:11px;color:#6b7280" id="qa-acct-email">—</div></div>
            <button class="qa-btn qa-btn-danger" style="width:auto;padding:6px 12px;font-size:11px" id="qa-logout-btn">Sign Out</button>
          </div>
          <div style="margin-top:10px;padding-top:10px;border-top:1px solid #f3f4f6">
            <div style="font-size:11px;font-weight:700" id="qa-sub-status">Free Plan</div>
            <div style="font-size:10px;color:#6b7280;margin-top:2px" id="qa-sub-desc">3 credits/day</div>
            <button class="qa-btn qa-btn-green" style="margin-top:8px" id="qa-upgrade-settings-btn">⭐ Upgrade Plan</button>
          </div>
        </div>

        <div class="qa-sec-label" style="display:flex;justify-content:space-between;align-items:center">
          My CV Profiles <button class="qa-btn qa-btn-outline" style="width:auto;padding:4px 10px;font-size:10px" id="qa-add-cv-btn">+ Add CV</button>
        </div>
        <div id="qa-cv-profiles-list" style="margin-bottom:12px"><div class="qa-empty" style="padding:14px 0">No CVs yet. Click "+ Add CV" to start.</div></div>

        <!-- Add/Edit CV form -->
        <div id="qa-cv-form" class="qa-card" style="display:none;border-color:#16a34a;margin-bottom:12px">
          <div class="qa-card-title" id="qa-cv-form-title">📄 Add New CV</div>
          <div class="qa-field"><label>Profile Name</label><input id="qa-cv-name" placeholder="e.g. Software Engineer, Marketing Manager"/></div>
          <div class="qa-field"><label>Target Job Title</label><input id="qa-cv-title" placeholder="e.g. Senior Software Engineer"/></div>
          <div style="margin-bottom:8px">
            <label style="font-size:10px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:6px">CV Content</label>
            <div style="display:flex;gap:6px;margin-bottom:8px">
              <button class="qa-cv-input-tab active" data-cvtab="paste">Paste Text</button>
              <button class="qa-cv-input-tab" data-cvtab="upload">Upload PDF/DOCX</button>
            </div>
            <div id="qa-cvt-paste-panel">
              <textarea id="qa-cv-text" style="width:100%;min-height:100px;padding:8px;border:1px solid #e5e7eb;border-radius:7px;font-size:11px;font-family:inherit;resize:vertical;outline:none;box-sizing:border-box" placeholder="Paste your full CV/resume text here..."></textarea>
            </div>
            <div id="qa-cvt-upload-panel" style="display:none">
              <div class="qa-upload-zone" id="qa-upload-zone">
                <div style="font-size:28px;margin-bottom:6px">📄</div>
                <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:3px">Drop PDF or DOCX here</div>
                <div style="font-size:10px;color:#9ca3af;margin-bottom:8px">or click to browse</div>
                <button class="qa-btn qa-btn-outline" style="width:auto;padding:6px 14px;font-size:11px" id="qa-browse-btn">Browse Files</button>
                <input type="file" id="qa-file-input" accept=".pdf,.docx,.txt" style="display:none"/>
              </div>
              <div id="qa-upload-status" style="display:none;font-size:11px;color:#16a34a;margin-top:6px;text-align:center"></div>
            </div>
          </div>
          <div class="qa-field"><label>Skills (comma separated)</label><input id="qa-cv-skills" placeholder="React, Node.js, Python, AWS"/></div>
          <div class="qa-field"><label>Education</label><input id="qa-cv-edu" placeholder="B.S. Computer Science, MIT"/></div>
          <div class="qa-btn-row">
            <button class="qa-btn qa-btn-outline" id="qa-cv-cancel-btn">Cancel</button>
            <button class="qa-btn qa-btn-green" id="qa-cv-save-btn">💾 Save CV</button>
          </div>
        </div>

        <div class="qa-sec-label">Personal Info</div>
        <div class="qa-row"><div class="qa-field"><label>First Name</label><input id="qa-fn" placeholder="Jane"/></div><div class="qa-field"><label>Last Name</label><input id="qa-ln" placeholder="Doe"/></div></div>
        <div class="qa-field"><label>Email</label><input type="email" id="qa-em" placeholder="jane@example.com"/></div>
        <div class="qa-row"><div class="qa-field"><label>Phone</label><input id="qa-ph" placeholder="+1 555 0000"/></div><div class="qa-field"><label>City</label><input id="qa-ci" placeholder="San Francisco"/></div></div>
        <div class="qa-row"><div class="qa-field"><label>State</label><input id="qa-st" placeholder="CA"/></div><div class="qa-field"><label>Zip</label><input id="qa-zp" placeholder="94105"/></div></div>
        <div class="qa-field"><label>LinkedIn URL</label><input id="qa-li" placeholder="linkedin.com/in/janedoe"/></div>
        <div class="qa-row"><div class="qa-field"><label>Job Title</label><input id="qa-jt" placeholder="Sr. Software Engineer"/></div><div class="qa-field"><label>Salary</label><input id="qa-sl" placeholder="$120,000"/></div></div>

        <div class="qa-sec-label">AI Configuration</div>
        <div class="qa-field"><label>Anthropic API Key</label><input type="password" id="qa-ak" placeholder="sk-ant-api03-..."/></div>
        <div class="qa-api-note">Get a free key at <a href="https://console.anthropic.com" target="_blank">console.anthropic.com</a> · Stored locally only</div>

        <div class="qa-sec-label">Preferences</div>
        <div class="qa-toggle-row"><div><div class="qa-toggle-label">Auto-fill on page load</div><div class="qa-toggle-desc">Fill forms automatically when job page loads</div></div><div class="qa-toggle" id="qa-tog-auto"></div></div>
        <div class="qa-toggle-row"><div><div class="qa-toggle-label">Track applications</div><div class="qa-toggle-desc">Log every apply to the Tracker tab</div></div><div class="qa-toggle on" id="qa-tog-track"></div></div>
        <div class="qa-toggle-row"><div><div class="qa-toggle-label">Auto-fetch job description</div><div class="qa-toggle-desc">Extract job text when sidebar opens</div></div><div class="qa-toggle on" id="qa-tog-autofetch"></div></div>
        <div style="margin-top:12px"><button class="qa-btn qa-btn-green" id="qa-save-btn">💾 Save Settings</button></div>
        <div class="qa-flash qa-flash-ok" id="qa-saved-flash">✓ Saved!</div>
      </div>

    </div><!-- /body -->

    <!-- BOTTOM BAR — LetMeApply style -->
    <div class="qa-bottom-bar">
      <div class="qa-bottom-stats">
        <span>Jobs applied: <strong id="qa-stat-applied">0</strong></span>
        <span>CVs tailored: <strong id="qa-stat-tailored">0</strong></span>
      </div>
      <div class="qa-bottom-actions">
        <button class="qa-btn qa-btn-green" style="flex:2" id="qa-bottom-tailor">✨ Tailor Resume</button>
        <button class="qa-btn qa-btn-outline" style="flex:1" id="qa-bottom-cl">Cover Letter</button>
      </div>
      <button class="qa-reload-btn" id="qa-reload-btn">↻ Reload Job Details</button>
      <div style="text-align:center;font-size:10px;color:#9ca3af;padding-bottom:2px">Click 'Reload Job Details' on any job page</div>
    </div>

  </div><!-- /screen-app -->

  <!-- PRICING MODAL -->
  <div class="qa-overlay" id="qa-pricing">
    <div class="qa-modal">
      <button class="qa-modal-close" id="qa-pricing-close">✕</button>
      <div class="qa-modal-hdr"><h2>Upgrade QuickApply</h2><p>Unlock unlimited AI features to land your dream job faster</p></div>
      <div class="qa-bill-toggle">
        <span class="qa-bill-lbl active" id="qa-b-mon">Monthly</span>
        <div class="qa-bill-sw" id="qa-bill-sw"></div>
        <span class="qa-bill-lbl" id="qa-b-ann">Annual <span class="qa-save-tag">Save 40%</span></span>
      </div>
      <div class="qa-plan-cards">
        <div class="qa-plan-card">
          <div class="qa-plan-row"><div class="qa-plan-name" style="color:#6b7280">Free</div><div><div class="qa-plan-price" style="color:#6b7280">$0</div><div class="qa-plan-period">forever</div></div></div>
          <div class="qa-plan-tagline">3 credits/day · 1 CV profile</div>
          <div class="qa-plan-features"><div class="qa-feat"><span class="qa-feat-y">✓</span> Auto-fill on all platforms</div><div class="qa-feat"><span class="qa-feat-y">✓</span> Cover letter generator</div><div class="qa-feat dim"><span class="qa-feat-n">✕</span> CV tailoring &amp; ATS scoring</div><div class="qa-feat dim"><span class="qa-feat-n">✕</span> Multiple CV profiles</div></div>
          <button class="qa-btn qa-btn-outline" disabled style="opacity:0.5">Current Plan</button>
        </div>
        <div class="qa-plan-card">
          <div class="qa-plan-row"><div class="qa-plan-name">Starter</div><div><div class="qa-plan-price" id="qa-pr-s">$7.99</div><div class="qa-plan-period" id="qa-pp-s">/month</div></div></div>
          <div class="qa-plan-tagline">50 credits/month · 3 CV profiles</div>
          <div class="qa-plan-features"><div class="qa-feat"><span class="qa-feat-y">✓</span> 50 AI credits/month</div><div class="qa-feat"><span class="qa-feat-y">✓</span> 3 CV profiles + upload</div><div class="qa-feat"><span class="qa-feat-y">✓</span> ATS scoring</div><div class="qa-feat dim"><span class="qa-feat-n">✕</span> CV rewrite</div></div>
          <button class="qa-btn qa-btn-outline" id="qa-sel-starter">Get Starter →</button>
        </div>
        <div class="qa-plan-card highlighted popular">
          <div class="qa-plan-row"><div class="qa-plan-name" style="color:#16a34a">Pro</div><div><div class="qa-plan-price" style="color:#16a34a" id="qa-pr-p">$14.99</div><div class="qa-plan-period" id="qa-pp-p">/month</div></div></div>
          <div class="qa-plan-tagline">Unlimited credits · 10 CVs</div>
          <div class="qa-plan-features"><div class="qa-feat"><span class="qa-feat-y">✓</span> <strong>Unlimited AI credits</strong></div><div class="qa-feat"><span class="qa-feat-y">✓</span> 10 CV profiles + upload</div><div class="qa-feat"><span class="qa-feat-y">✓</span> CV rewrite to 100% match</div><div class="qa-feat"><span class="qa-feat-y">✓</span> Interview Q&amp;A prep</div></div>
          <button class="qa-btn qa-btn-green" id="qa-sel-pro">Get Pro →</button>
        </div>
        <div class="qa-plan-card">
          <div class="qa-plan-row"><div class="qa-plan-name" style="color:#92400e">Ultra</div><div><div class="qa-plan-price" style="color:#92400e" id="qa-pr-u">$29.99</div><div class="qa-plan-period" id="qa-pp-u">/month</div></div></div>
          <div class="qa-plan-tagline">Everything + power tools</div>
          <div class="qa-plan-features"><div class="qa-feat"><span class="qa-feat-y">✓</span> Unlimited CVs + bulk upload</div><div class="qa-feat"><span class="qa-feat-y">✓</span> Salary negotiation coach</div><div class="qa-feat"><span class="qa-feat-y">✓</span> LinkedIn optimizer</div><div class="qa-feat"><span class="qa-feat-y">✓</span> Priority support</div></div>
          <button class="qa-btn qa-btn-gold" id="qa-sel-ultra">Get Ultra →</button>
        </div>
      </div>
      <div class="qa-pay-section" id="qa-pay-section">
        <h3>💳 Complete Purchase</h3>
        <div class="qa-pay-summary">
          <div><div class="qa-pay-plan-name" id="qa-pay-nm">Pro Plan</div><div class="qa-pay-billing" id="qa-pay-bl">Billed monthly</div></div>
          <div class="qa-pay-price" id="qa-pay-pr">$14.99</div>
        </div>
        <div class="qa-field"><label>Full Name</label><input id="qa-pay-fullname" placeholder="Jane Doe"/></div>
        <div class="qa-field"><label>Email</label><input type="email" id="qa-pay-email" placeholder="jane@example.com"/></div>
        <div class="qa-card-box">
          <div class="qa-card-line"><label>Card</label><input id="qa-cn" placeholder="1234 5678 9012 3456" maxlength="19"/></div>
          <div class="qa-card-line"><label>Expires</label><input id="qa-ce" placeholder="MM / YY" maxlength="7" style="max-width:90px"/><label style="width:35px;padding-left:6px">CVC</label><input id="qa-cc" placeholder="123" maxlength="4" style="max-width:60px"/></div>
        </div>
        <label style="display:flex;align-items:center;gap:7px;font-size:11px;color:#374151;margin-bottom:10px;cursor:pointer"><input type="checkbox" id="qa-save-card" checked style="width:auto"/> Save card for renewals</label>
        <div class="qa-secure-note"><svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>256-bit SSL · Powered by Stripe</div>
        <button class="qa-btn qa-btn-green" id="qa-pay-btn">🔒 Subscribe Now</button>
        <div class="qa-flash" id="qa-pay-flash" style="margin-top:8px"></div>
        <div class="qa-stripe-footer">Powered by <a href="https://stripe.com" target="_blank">Stripe</a> · Cancel anytime</div>
      </div>
    </div>
  </div>
  `

  document.body.appendChild(sidebar);
  initApp();

  // ════════════════════════════════════════════
  //  INIT
  // ════════════════════════════════════════════
  function initApp() {
    // ── Auth navigation ──────────────────────────
    const $ = id => sidebar.querySelector('#'+id);
    function showForm(name) {
      ['qa-form-login','qa-form-signup','qa-form-forgot'].forEach(id => $(id).style.display = 'none');
      $('qa-form-'+name).style.display = 'block';
      $('qa-login-err').style.display  = 'none';
    }
    $('qa-to-signup').addEventListener('click',  () => showForm('signup'));
    $('qa-to-login').addEventListener('click',   () => showForm('login'));
    $('qa-to-login2').addEventListener('click',  () => showForm('login'));
    $('qa-to-forgot').addEventListener('click',  () => showForm('forgot'));
    $('qa-auth-close').addEventListener('click', () => sidebar.classList.remove('qa-open'));
    $('qa-app-close').addEventListener('click',  () => sidebar.classList.remove('qa-open'));

    // ── Login ────────────────────────────────────
    $('qa-login-btn').addEventListener('click', () => {
      const email = $('qa-l-email').value.trim();
      const pass  = $('qa-l-pass').value;
      const err   = $('qa-login-err');
      err.style.display = 'none';
      if (!email || !pass) { err.textContent='Please enter email and password.'; err.style.display='block'; return; }
      const btn = $('qa-login-btn'); btn.disabled=true; btn.textContent='Signing in...';
      chrome.storage.local.get('qaAccounts', ({ qaAccounts }) => {
        const accounts = qaAccounts||{}, key = btoa(email.toLowerCase()), stored = accounts[key];
        if (!stored)                         { err.textContent='No account found. Please sign up first.'; err.style.display='block'; btn.disabled=false; btn.textContent='Sign In'; return; }
        if (stored.passHash !== btoa(pass))  { err.textContent='Incorrect password. Try again.'; err.style.display='block'; btn.disabled=false; btn.textContent='Sign In'; return; }
        const session = { token: btoa(Date.now()+email), expires: Date.now()+30*24*60*60*1000 };
        chrome.storage.local.set({ qaUser: stored.user, qaSession: session }, () => { btn.disabled=false; showApp(stored.user); });
      });
    });

    // ── Signup ───────────────────────────────────
    $('qa-signup-btn').addEventListener('click', () => {
      const fn    = $('qa-s-fn').value.trim();
      const ln    = $('qa-s-ln').value.trim();
      const email = $('qa-s-email').value.trim();
      const pass  = $('qa-s-pass').value;
      const pass2 = $('qa-s-pass2').value;
      const err   = $('qa-login-err');
      err.style.display = 'none';
      if (!fn || !email || !pass) { err.textContent='Please fill in all fields.'; err.style.display='block'; return; }
      if (pass.length < 8)        { err.textContent='Password must be at least 8 characters.'; err.style.display='block'; return; }
      if (pass !== pass2)         { err.textContent='Passwords do not match.'; err.style.display='block'; return; }
      const btn = $('qa-signup-btn'); btn.disabled=true; btn.textContent='Creating account...';
      chrome.storage.local.get('qaAccounts', ({ qaAccounts }) => {
        const accounts = qaAccounts||{}, key = btoa(email.toLowerCase());
        if (accounts[key]) { err.textContent='An account with this email already exists.'; err.style.display='block'; btn.disabled=false; btn.textContent='Create Free Account'; return; }
        const user = { firstName:fn, lastName:ln, email, createdAt:Date.now() };
        accounts[key] = { user, passHash: btoa(pass) };
        chrome.storage.local.set({ qaAccounts:accounts, qaUser:user, qaSession:{ token:btoa(Date.now()+email), expires:Date.now()+30*24*60*60*1000 }, profile:{ firstName:fn, lastName:ln, email } }, () => {
          btn.disabled=false; showApp(user); toast('Welcome to QuickApply! 🎉','ok');
        });
      });
    });

    // ── Forgot ───────────────────────────────────
    $('qa-forgot-btn').addEventListener('click', () => { toast('Reset email sent!','ok'); showForm('login'); });

    // ── App tabs ─────────────────────────────────
    sidebar.querySelectorAll('.qa-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        sidebar.querySelectorAll('.qa-tab').forEach(t => t.classList.remove('qa-active'));
        sidebar.querySelectorAll('.qa-panel').forEach(p => p.classList.remove('qa-active'));
        tab.classList.add('qa-active');
        $('qa-p-'+tab.dataset.p).classList.add('qa-active');
        if (tab.dataset.p === 'tracker')  loadTracker();
        if (tab.dataset.p === 'settings') renderCVProfiles();
      });
    });

    // ── Toggles ──────────────────────────────────
    sidebar.querySelectorAll('.qa-toggle').forEach(t => t.addEventListener('click', () => t.classList.toggle('on')));

    // ── Apply tab ────────────────────────────────
    $('qa-reload-btn').addEventListener('click', () => { fetchJobDescription(true); populateHighlights(); });
    $('qa-tailor-btn').addEventListener('click', tailorCV);
    $('qa-bottom-tailor').addEventListener('click', tailorCV);
    $('qa-quick-cl-btn').addEventListener('click', quickCoverLetter);
    $('qa-bottom-cl').addEventListener('click', quickCoverLetter);
    $('qa-tailor-copy').addEventListener('click', () => navigator.clipboard.writeText($('qa-tailor-out')?.textContent||'').then(()=>toast('Copied!','ok')));
    $('qa-tailor-insert').addEventListener('click', () => {
      const text = $('qa-tailor-out')?.textContent;
      if (!text) return;
      const ta = Array.from(document.querySelectorAll('textarea')).filter(t=>!t.closest('#qa-sidebar'));
      if (ta.length) { setVal(ta[0],text); toast('CV inserted! ✓','ok'); } else toast('No text area on this page.','warn');
    });
    $('qa-tailor-save').addEventListener('click', () => saveTailoredAsCV($('qa-tailor-out')?.textContent));
    $('qa-cl-apply-copy').addEventListener('click', () => navigator.clipboard.writeText($('qa-cl-apply-out')?.textContent||'').then(()=>toast('Copied!','ok')));
    $('qa-cl-apply-insert').addEventListener('click', () => insertTextIntoForm($('qa-cl-apply-out')?.textContent));
    $('qa-upgrade-link').addEventListener('click', openPricing);
    $('qa-switch-cv-btn').addEventListener('click', () => {
      const p = $('qa-cv-switch-panel'); p.style.display = p.style.display==='none'?'block':'none';
    });

    // ── CV Align tab ─────────────────────────────
    $('qa-fetch-jd-btn').addEventListener('click', () => fetchJobDescription(true,'qa-cv-jd'));
    $('qa-analyze-btn').addEventListener('click', analyzeCV);
    $('qa-rewrite-btn').addEventListener('click', rewriteCV);
    $('qa-copy-cv-btn').addEventListener('click', () => navigator.clipboard.writeText($('qa-diff-box')?.textContent||'').then(()=>toast('Copied!','ok')));
    $('qa-insert-cv-btn').addEventListener('click', () => insertTextIntoForm($('qa-diff-box')?.textContent));
    $('qa-save-rewrite-btn').addEventListener('click', () => saveTailoredAsCV($('qa-diff-box')?.textContent));

    // ── AI Tools tab ─────────────────────────────
    $('qa-fetch-jd-ai').addEventListener('click', () => fetchJobDescription(true,'qa-jd'));
    $('qa-cl-btn').addEventListener('click', genCoverLetter);
    $('qa-copy-cl-btn').addEventListener('click', () => navigator.clipboard.writeText($('qa-cl-out')?.textContent||'').then(()=>toast('Copied!','ok')));
    $('qa-insert-cl-btn').addEventListener('click', () => insertTextIntoForm($('qa-cl-out')?.textContent));
    $('qa-kw-btn').addEventListener('click', extractKeywords);
    $('qa-int-btn').addEventListener('click', interviewPrep);

    // ── Tracker tab ──────────────────────────────
    $('qa-clear-btn').addEventListener('click', clearTracker);

    // ── Settings tab ─────────────────────────────
    $('qa-save-btn').addEventListener('click', saveSettings);
    $('qa-logout-btn').addEventListener('click', logout);
    $('qa-upgrade-settings-btn').addEventListener('click', openPricing);
    $('qa-add-cv-btn').addEventListener('click', () => showCVForm(null));
    $('qa-cv-cancel-btn').addEventListener('click', hideCVForm);
    $('qa-cv-save-btn').addEventListener('click', saveCV);
    $('qa-browse-btn').addEventListener('click', () => $('qa-file-input').click());
    $('qa-file-input').addEventListener('change', handleFileUpload);

    // CV input tabs
    sidebar.querySelectorAll('.qa-cv-input-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        sidebar.querySelectorAll('.qa-cv-input-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        $('qa-cvt-paste-panel').style.display = btn.dataset.cvtab==='paste' ? 'block' : 'none';
        $('qa-cvt-upload-panel').style.display = btn.dataset.cvtab==='upload' ? 'block' : 'none';
      });
    });

    const zone = $('qa-upload-zone');
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.style.borderColor='#16a34a'; zone.style.background='#f0fdf4'; });
    zone.addEventListener('dragleave', () => { zone.style.borderColor=''; zone.style.background=''; });
    zone.addEventListener('drop', e => { e.preventDefault(); zone.style.borderColor=''; zone.style.background=''; if(e.dataTransfer.files[0]) handleFileUploadDirect(e.dataTransfer.files[0]); });

    // ── Pricing modal ────────────────────────────
    $('qa-cred-badge').addEventListener('click', openPricing);
    $('qa-plan-btn').addEventListener('click', openPricing);
    $('qa-pricing-close').addEventListener('click', closePricing);
    $('qa-renew-btn').addEventListener('click', openPricing);
    $('qa-bill-sw').addEventListener('click', toggleBilling);
    $('qa-b-mon').addEventListener('click', () => setBilling('monthly'));
    $('qa-b-ann').addEventListener('click', () => setBilling('annual'));
    $('qa-sel-starter').addEventListener('click', () => selectPlan('starter'));
    $('qa-sel-pro').addEventListener('click',     () => selectPlan('pro'));
    $('qa-sel-ultra').addEventListener('click',   () => selectPlan('ultra'));
    $('qa-pay-btn').addEventListener('click', processPayment);
    $('qa-cn').addEventListener('input', e => { let v=e.target.value.replace(/\D/g,'').substring(0,16); e.target.value=v.replace(/(.{4})/g,'$1 ').trim(); });
    $('qa-ce').addEventListener('input', e => { let v=e.target.value.replace(/\D/g,'').substring(0,4); if(v.length>=2)v=v.substring(0,2)+' / '+v.substring(2); e.target.value=v; });
  }

  // ════════════════════════════════════════════
  //  AUTH
  // ════════════════════════════════════════════
  function showLogin() {
    sidebar.querySelector('#qa-screen-login').style.display = 'flex';
    sidebar.querySelector('#qa-screen-app').style.display   = 'none';
  }

  function showApp(user) {
    sidebar.querySelector('#qa-screen-login').style.display = 'none';
    sidebar.querySelector('#qa-screen-app').style.display   = 'flex';
    const $ = id => sidebar.querySelector('#'+id);
    if ($('qa-acct-name'))  $('qa-acct-name').textContent  = (user.firstName||'')+' '+(user.lastName||'');
    if ($('qa-acct-email')) $('qa-acct-email').textContent = user.email||'';
    loadProfile(); updateCreditUI(); checkRenewal();
    renderCVProfiles(); renderCVSelector(); renderActiveCVChip();
    detectJob(); updateStats();
    chrome.storage.local.get('settings', ({ settings }) => {
      if (settings?.autoFetchJD !== false) setTimeout(() => { fetchJobDescription(false); populateHighlights(); }, 600);
      if (settings?.autoFill) chrome.storage.local.get('profile', ({ profile }) => { if(profile?.firstName) setTimeout(()=>doFill(profile,false),1200); });
    });
  }

  function logout() {
    if (!confirm('Sign out of QuickApply?')) return;
    chrome.storage.local.remove(['qaUser','qaSession'], showLogin);
  }


  // ════════════════════════════════════════════
  //  JOB DETECTION + AUTO-FETCH
  // ════════════════════════════════════════════
  let _cachedJD = '';

  function detectJob() {
    let title = '';
    const titleSels = ['h1.job-title','h1[class*="title"]','h1[class*="job"]','[class*="job-title"]:not(nav *)','[class*="jobTitle"]:not(nav *)','h1'];
    for (const sel of titleSels) {
      try {
        const els = document.querySelectorAll(sel);
        for (const el of els) {
          if (el.closest('#qa-sidebar')) continue;
          const t = el.textContent.trim();
          if (t.length > 5 && t.length < 150) { title = t.replace(/\s[-|].*/,'').substring(0, 100); break; }
        }
        if (title) break;
      } catch(e) {}
    }
    if (!title) title = document.title.replace(/\s[-||\-].*/,'').substring(0, 100);

    let company = '';
    const companySels = ['[class*="company-name"]','[class*="companyName"]','[class*="employer-name"]','[data-company]','[class*="org-name"]'];
    for (const sel of companySels) {
      try {
        const el = document.querySelector(sel);
        if (el && !el.closest('#qa-sidebar')) { company = el.textContent.trim().substring(0, 60); break; }
      } catch(e) {}
    }

    const titleEl = sidebar.querySelector('#qa-job-title');
    const metaEl  = sidebar.querySelector('#qa-job-meta');
    if (titleEl) titleEl.textContent = title || 'Open a job posting to begin';
    if (metaEl) metaEl.innerHTML = [PLATFORM, company].filter(Boolean).map((s,i,a) =>
      `<span>${s}</span>${i<a.length-1?'<span class="qa-job-meta-dot"></span>':''}`).join('');
  }

  function fetchJobDescription(showFeedback, targetId) {
    // Try multiple selectors to get job description from the page
    const descSels = [
      '[class*="description__text"]',
      '[class*="jobDescriptionContent"]',
      '[class*="job-description"]',
      '[class*="jobDescription"]',
      '[id*="job-description"]',
      '[id*="jobDescription"]',
      '[class*="description-content"]',
      '[class*="job_description"]',
      '[data-testid*="description"]',
      '.jobs-description__content',
      '.jobsearch-jobDescriptionText',
      '#job-details',
      'article[class*="job"]',
      '[class*="vacancy"]',
      '[class*="posting"]'
    ];

    let jdText = '';
    for (const sel of descSels) {
      try {
        const el = document.querySelector(sel);
        if (el && !el.closest('#qa-sidebar')) {
          const text = el.innerText || el.textContent;
          if (text && text.trim().length > 100) { jdText = text.trim().substring(0, 4000); break; }
        }
      } catch(e) {}
    }

    // Fallback: grab largest text block on page
    if (!jdText) {
      const blocks = Array.from(document.querySelectorAll('div, section, article'))
        .filter(el => !el.closest('#qa-sidebar') && !el.closest('nav') && !el.closest('header') && !el.closest('footer'))
        .map(el => ({ el, len: (el.innerText||'').trim().length }))
        .filter(x => x.len > 200)
        .sort((a,b) => b.len - a.len);
      if (blocks[0]) jdText = (blocks[0].el.innerText || '').trim().substring(0, 4000);
    }

    if (jdText) {
      _cachedJD = jdText;
      const targets = targetId ? [targetId] : ['qa-cv-jd','qa-jd'];
      targets.forEach(id => {
        const el = sidebar.querySelector('#' + id);
        if (el && !el.value) el.value = jdText;
      });
      if (showFeedback) toast('Job description fetched! ✓', 'ok');
    } else {
      if (showFeedback) toast('Could not auto-fetch — paste the job description manually.', 'warn');
    }
    return jdText;
  }

  function renderActiveCVChip() {
    getCVs(cvs => {
      const cv = cvs.find(c=>c.isDefault)||cvs[0];
      const nameEl = sidebar.querySelector('#qa-active-cv-name');
      const subEl  = sidebar.querySelector('#qa-active-cv-sub');
      if (nameEl) nameEl.textContent = cv ? cv.name : 'No CV selected';
      if (subEl)  subEl.textContent  = cv ? (cv.jobTitle||'Click to switch') : 'Go to Settings → My CVs to add';
    });
  }

  // ════════════════════════════════════════════
  //  JOB HIGHLIGHTS (like LetMeApply card)
  // ════════════════════════════════════════════
  function populateHighlights() {
    const jd = _cachedJD || fetchJobDescription(false) || '';
    const titleEl = sidebar.querySelector('#qa-hl-title');
    const metaEl  = sidebar.querySelector('#qa-hl-meta');
    const skillsEl= sidebar.querySelector('#qa-hl-skills');
    const qualsEl = sidebar.querySelector('#qa-hl-quals');
    const qualsListEl = sidebar.querySelector('#qa-hl-quals-list');

    // Job title
    let title = '';
    for (const sel of ['h1[class*="title"]','h1[class*="job"]','[class*="job-title"]:not(nav *)','h1']) {
      try { const el=document.querySelector(sel); if(el&&!el.closest('#qa-sidebar')&&el.textContent.trim().length>3){title=el.textContent.trim().substring(0,80);break;} } catch(e){}
    }
    if (!title) title = document.title.replace(/\s[-|].*/,'').substring(0,80);
    if (titleEl) titleEl.textContent = title || 'Job Details';

    // Company + location
    let company='', location='';
    for(const sel of ['[class*="company-name"]','[class*="companyName"]','[class*="employer"]']){try{const el=document.querySelector(sel);if(el&&!el.closest('#qa-sidebar')){company=el.textContent.trim().substring(0,50);break;}}catch(e){}}
    for(const sel of ['[class*="location"]:not(nav *):not(header *)','[class*="workplace"]']){try{const el=document.querySelector(sel);if(el&&!el.closest('#qa-sidebar')&&el.textContent.trim().length<60){location=el.textContent.trim().substring(0,50);break;}}catch(e){}}
    const jobType = jd.match(/full.?time|part.?time|contract|remote|hybrid/i)?.[0] || '';
    if (metaEl) {
      metaEl.innerHTML = [company,location,jobType].filter(Boolean).map(s=>`<span class="qa-hl-tag">${s}</span>`).join('');
    }

    // Extract skills from JD
    if (jd && skillsEl) {
      const skillPatterns = ['JavaScript','TypeScript','Python','React','Node','Java','C\+\+','C#','SQL','AWS','Azure','Docker','Kubernetes','Git','REST','API','SAP','CAP','OData','Groovy','CSS','HTML','Vue','Angular','Go','Rust','Swift','Kotlin','Ruby','PHP','MongoDB','PostgreSQL','MySQL'];
      const found = skillPatterns.filter(s => new RegExp('\b'+s+'\b','i').test(jd)).slice(0,8);
      if (found.length) {
        skillsEl.innerHTML = '<div class="qa-kw-label" style="margin:8px 0 5px">Skills Mentioned</div>' +
          found.map(s=>`<span class="qa-hl-skill-tag">${s}</span>`).join('');
      }
    }

    // Extract key requirements (bullet points)
    if (jd && qualsEl && qualsListEl) {
      const lines = jd.split('\n').map(l=>l.trim()).filter(l=>l.length>20&&l.length<150&&/you|experience|knowledge|degree|background|proficiency/i.test(l)).slice(0,4);
      if (lines.length) {
        qualsListEl.innerHTML = lines.map(l=>`• ${l.replace(/^[-•*]\s*/,'')}`).join('<br>');
        qualsEl.style.display = 'block';
      }
    }
  }

  // ════════════════════════════════════════════
  //  TAILOR CV (main action - like LetMeApply)
  // ════════════════════════════════════════════
  function tailorCV() {
    const jd = _cachedJD || fetchJobDescription(false);
    if (!jd) { toast('Click "↻ Reload Job Details" first to fetch the job description!','warn'); return; }
    chrome.storage.local.get('profile', async ({ profile }) => {
      if (!profile?.firstName) { toast('Save your profile in Settings first!','warn'); return; }
      getApiKey(async apiKey => {
        if (!apiKey) { toast('Add your Anthropic API key in Settings!','warn'); return; }
        useCredit(async ok => {
          if (!ok) { qaOpenPricing(); return; }
          const tailorBtn  = sidebar.querySelector('#qa-tailor-btn');
          const bottomBtn  = sidebar.querySelector('#qa-bottom-tailor');
          const tailorOut  = sidebar.querySelector('#qa-tailor-out');
          const diffBox    = sidebar.querySelector('#qa-tailor-diff');
          if(tailorBtn)  { tailorBtn.disabled=true;  tailorBtn.innerHTML='<span>⏳</span><span>Tailoring...</span>'; }
          if(bottomBtn)  { bottomBtn.disabled=true;  bottomBtn.textContent='Tailoring...'; }
          getActiveCV(async cv => {
            const cvText = cv?.text || profile.summary || '';
            if (!cvText) { toast('Add your CV text in Settings → My CVs first!','warn'); if(tailorBtn){tailorBtn.disabled=false;tailorBtn.innerHTML='<span>✨</span><span>Tailor Resume</span><span class="qa-btn-hint">< 30 sec</span>';} if(bottomBtn){bottomBtn.disabled=false;bottomBtn.textContent='✨ Tailor Resume';} return; }
            try {
              const result = await callClaude(apiKey,
                `You are an expert resume writer. Tailor this resume for maximum ATS match with the job description.
Instructions:
- Keep all real experience - never fabricate
- Mark every added/changed phrase: [ADDED: text]
- Integrate missing keywords naturally
- Keep same structure: SUMMARY | EXPERIENCE | SKILLS | EDUCATION

RESUME:
${cvText}

JOB DESCRIPTION:
${jd.substring(0,2000)}`, 1800);
              tailorOut.style.display = 'block';
              const clean = result.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\[ADDED: ([^\]]+)\]/g,'<span class="qa-diff-add">$1</span>');
              const tailorOutEl = sidebar.querySelector('#qa-tailor-out');
              if(tailorOutEl){ tailorOutEl.innerHTML=clean; tailorOutEl.style.display='block'; }
              const tailorActEl = sidebar.querySelector('#qa-tailor-actions');
              if(tailorActEl) tailorActEl.style.display='flex';
              // Update stats
              chrome.storage.local.get('qaTailorCount', ({qaTailorCount}) => {
                const count = (qaTailorCount||0)+1;
                chrome.storage.local.set({qaTailorCount:count}, updateStats);
              });
              toast('CV tailored! Green highlights show additions.','ok');
            } catch(e) { toast('Tailoring failed: '+e.message,'err'); }
            if(tailorBtn) { tailorBtn.disabled=false; tailorBtn.innerHTML='<span>✨</span><span>Tailor Resume</span><span class="qa-btn-hint">< 30 sec</span>'; }
            if(bottomBtn) { bottomBtn.disabled=false; bottomBtn.textContent='✨ Tailor Resume'; }
          });
        });
      });
    });
  }

  function updateStats() {
    chrome.storage.local.get(['applications','qaTailorCount'],({applications,qaTailorCount})=>{
      const appliedEl  = sidebar.querySelector('#qa-stat-applied');
      const tailoredEl = sidebar.querySelector('#qa-stat-tailored');
      if(appliedEl)  appliedEl.textContent  = (applications?.length||0)+' applied';
      if(tailoredEl) tailoredEl.textContent = (qaTailorCount||0)+' tailored';
    });
  }

  // ════════════════════════════════════════════
  //  CV PROFILES
  // ════════════════════════════════════════════
  let _editingCVId = null;

  function getCVs(cb) {
    chrome.storage.local.get('qaCVs', ({ qaCVs }) => cb(qaCVs || []));
  }

  function showCVForm(cvId) {
    _editingCVId = cvId || null;
    const form = sidebar.querySelector('#qa-cv-form');
    const title = sidebar.querySelector('#qa-cv-form-title');
    form.style.display = 'block';
    title.textContent = cvId ? '✏️ Edit CV Profile' : '📄 Add New CV';
    if (cvId) {
      getCVs(cvs => {
        const cv = cvs.find(c => c.id === cvId);
        if (cv) {
          sidebar.querySelector('#qa-cv-name').value  = cv.name || '';
          sidebar.querySelector('#qa-cv-title').value = cv.jobTitle || '';
          sidebar.querySelector('#qa-cv-text').value  = cv.text || '';
          sidebar.querySelector('#qa-cv-skills').value= cv.skills || '';
          sidebar.querySelector('#qa-cv-edu').value   = cv.education || '';
        }
      });
    } else {
      sidebar.querySelector('#qa-cv-name').value  = '';
      sidebar.querySelector('#qa-cv-title').value = '';
      sidebar.querySelector('#qa-cv-text').value  = '';
      sidebar.querySelector('#qa-cv-skills').value= '';
      sidebar.querySelector('#qa-cv-edu').value   = '';
    }
    form.scrollIntoView({ behavior:'smooth', block:'nearest' });
  }

  function hideCVForm() {
    sidebar.querySelector('#qa-cv-form').style.display = 'none';
    _editingCVId = null;
  }

  function saveCV() {
    const name  = sidebar.querySelector('#qa-cv-name').value.trim();
    const title = sidebar.querySelector('#qa-cv-title').value.trim();
    const text  = sidebar.querySelector('#qa-cv-text').value.trim();
    const skills= sidebar.querySelector('#qa-cv-skills').value.trim();
    const edu   = sidebar.querySelector('#qa-cv-edu').value.trim();
    if (!name) { toast('Please enter a profile name (e.g. "Software Engineer")', 'warn'); return; }
    if (!text) { toast('Please add your CV text or upload a file.', 'warn'); return; }
    getCVs(cvs => {
      chrome.storage.local.get('plan', ({ plan }) => {
        const maxCVs = { free:1, starter:3, pro:10, ultra:999 }[plan||'free'] || 1;
        if (!_editingCVId && cvs.length >= maxCVs) {
          toast(`Your ${plan||'free'} plan allows up to ${maxCVs} CV profile${maxCVs>1?'s':''}. Upgrade to add more!`, 'warn');
          return;
        }
        if (_editingCVId) {
          const idx = cvs.findIndex(c => c.id === _editingCVId);
          if (idx !== -1) cvs[idx] = { ...cvs[idx], name, jobTitle:title, text, skills, education:edu, updatedAt:Date.now() };
        } else {
          cvs.push({ id: 'cv_'+Date.now(), name, jobTitle:title, text, skills, education:edu, createdAt:Date.now(), isDefault:cvs.length===0 });
        }
        chrome.storage.local.set({ qaCVs: cvs }, () => {
          hideCVForm();
          renderCVProfiles();
          renderCVSelector();
          updateCVAnalyzeDropdown();
          toast(`CV profile "${name}" saved! ✓`, 'ok');
        });
      });
    });
  }

  function renderCVProfiles() {
    getCVs(cvs => {
      const container = sidebar.querySelector('#qa-cv-profiles-list');
      if (!container) return;
      if (!cvs.length) { container.innerHTML = '<div class="qa-empty" style="padding:16px 0">No CVs saved yet. Click "+ Add CV" to get started.</div>'; return; }
      container.innerHTML = cvs.map(cv => `
        <div class="qa-cv-profile-card" data-id="${cv.id}">
          <div class="qa-cvp-info">
            <div class="qa-cvp-name">${cv.name}</div>
            <div class="qa-cvp-meta">${cv.jobTitle||'No title'} · ${cv.text ? Math.round(cv.text.split(' ').length/100)/10+'k words' : 'No text'}</div>
          </div>
          <div class="qa-cvp-actions">
            ${cv.isDefault ? '<span class="qa-cvp-default">Default</span>' : `<button class="qa-cvp-btn" data-action="setdefault" data-id="${cv.id}">Set default</button>`}
            <button class="qa-cvp-btn" data-action="edit" data-id="${cv.id}">Edit</button>
            <button class="qa-cvp-btn qa-cvp-del" data-action="delete" data-id="${cv.id}">✕</button>
          </div>
        </div>
      `).join('');
      container.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
          const { action, id } = btn.dataset;
          if (action === 'edit') showCVForm(id);
          else if (action === 'delete') deleteCV(id);
          else if (action === 'setdefault') setDefaultCV(id);
        });
      });
    });
  }

  function deleteCV(id) {
    if (!confirm('Delete this CV profile? This cannot be undone.')) return;
    getCVs(cvs => {
      const updated = cvs.filter(c => c.id !== id);
      if (updated.length && !updated.find(c => c.isDefault)) updated[0].isDefault = true;
      chrome.storage.local.set({ qaCVs: updated }, () => {
        renderCVProfiles(); renderCVSelector(); updateCVAnalyzeDropdown();
        toast('CV profile deleted.', 'ok');
      });
    });
  }

  function setDefaultCV(id) {
    getCVs(cvs => {
      cvs.forEach(c => c.isDefault = c.id === id);
      chrome.storage.local.set({ qaCVs: cvs }, () => {
        renderCVProfiles(); renderCVSelector();
        toast('Default CV updated! ✓', 'ok');
      });
    });
  }

  function renderCVSelector() {
    getCVs(cvs => {
      const container = sidebar.querySelector('#qa-cv-list');
      if (!container) return;
      if (!cvs.length) { container.innerHTML = '<div style="font-size:11px;color:#9ca3af">No CVs yet. Add one in Settings.</div>'; return; }
      container.innerHTML = cvs.map(cv => `
        <label class="qa-cv-radio-row" style="display:flex;align-items:center;gap:8px;padding:7px 9px;border:1px solid ${cv.isDefault?'#16a34a':'#e5e7eb'};border-radius:7px;cursor:pointer;background:${cv.isDefault?'#f0fdf4':'#fff'};margin-bottom:4px">
          <input type="radio" name="qa-active-cv" value="${cv.id}" ${cv.isDefault?'checked':''} style="accent-color:#16a34a"/>
          <div style="flex:1;min-width:0">
            <div style="font-size:12px;font-weight:600;color:#111827">${cv.name}</div>
            <div style="font-size:10px;color:#6b7280">${cv.jobTitle||'No title specified'}</div>
          </div>
          ${cv.isDefault ? '<span style="font-size:9px;color:#16a34a;font-weight:700;padding:2px 6px;background:#dcfce7;border-radius:20px">ACTIVE</span>' : ''}
        </label>
      `).join('');
      container.querySelectorAll('input[name="qa-active-cv"]').forEach(radio => {
        radio.addEventListener('change', () => setDefaultCV(radio.value));
      });
    });
  }

  function updateCVAnalyzeDropdown() {
    getCVs(cvs => {
      const sel = sidebar.querySelector('#qa-cv-pick-analyze');
      if (!sel) return;
      const def = cvs.find(c => c.isDefault);
      sel.innerHTML = '<option value="">— choose a CV profile —</option>' +
        cvs.map(cv => `<option value="${cv.id}" ${cv.isDefault?'selected':''}>${cv.name}${cv.isDefault?' (default)':''}</option>`).join('');
    });
  }

  // ── File upload handler ───────────────────────────────────
  function handleFileUpload(e) { if (e.target.files[0]) handleFileUploadDirect(e.target.files[0]); }

  function handleFileUploadDirect(file) {
    const statusEl = sidebar.querySelector('#qa-upload-status');
    const textEl   = sidebar.querySelector('#qa-cv-text');
    const zone     = sidebar.querySelector('#qa-upload-zone');
    statusEl.style.display = 'block';
    statusEl.textContent = `Reading ${file.name}...`;
    zone.style.background = '#f0fdf4';

    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = e => {
        textEl.value = e.target.result;
        statusEl.textContent = `✓ ${file.name} loaded (${Math.round(e.target.result.split(' ').length/100)/10}k words)`;
        // Switch to paste tab to show text
        sidebar.querySelector('[data-cvtab="paste"]').click();
      };
      reader.readAsText(file);
      return;
    }

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const reader = new FileReader();
      reader.onload = async e => {
        try {
          // Extract text from PDF using basic parsing (works for text-based PDFs)
          const bytes = new Uint8Array(e.target.result);
          const str = new TextDecoder('latin1').decode(bytes);
          // Extract text between BT and ET markers (PDF text operators)
          const texts = [];
          const btEt = str.matchAll(/BT[\s\S]*?ET/g);
          for (const m of btEt) {
            const tjMatches = m[0].matchAll(/\(([^)]*)\)\s*Tj/g);
            for (const tj of tjMatches) texts.push(tj[1].replace(/\\n/g,'\n').replace(/\\r/g,''));
          }
          let extracted = texts.join(' ').replace(/\s+/g,' ').trim();
          if (!extracted || extracted.length < 50) {
            // Fallback: extract printable strings
            extracted = str.replace(/[^\x20-\x7E\n]/g,' ').replace(/\s{3,}/g,'\n').trim().substring(0,5000);
          }
          textEl.value = extracted || 'Could not extract text from this PDF. Please paste text manually.';
          statusEl.textContent = `✓ ${file.name} processed`;
          sidebar.querySelector('[data-cvtab="paste"]').click();
          if (!extracted || extracted.length < 50) toast('PDF text extraction limited. Consider pasting text directly for best results.', 'warn');
        } catch(err) { statusEl.textContent = 'Could not read PDF. Please paste your CV text instead.'; }
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    if (file.name.endsWith('.docx')) {
      statusEl.textContent = 'DOCX detected. For best results, copy-paste text from your Word document.';
      toast('Paste text from Word document for best AI results.', 'warn');
      return;
    }

    statusEl.textContent = 'Unsupported file type. Please use .pdf, .docx or .txt';
  }

  function saveRewriteAsNewCV() {
    const text = sidebar.querySelector('#qa-diff-box')?.textContent;
    if (!text) return;
    getCVs(cvs => {
      const base = cvs.find(c => c.isDefault) || cvs[0];
      const newCV = { id:'cv_'+Date.now(), name:(base?.name||'My CV')+' (Tailored)', jobTitle:base?.jobTitle||'', text, skills:base?.skills||'', education:base?.education||'', createdAt:Date.now() };
      cvs.push(newCV);
      chrome.storage.local.set({ qaCVs: cvs }, () => {
        renderCVProfiles(); renderCVSelector(); updateCVAnalyzeDropdown();
        toast('Saved as new CV profile! ✓', 'ok');
      });
    });
  }

  // ════════════════════════════════════════════
  //  PROFILE
  // ════════════════════════════════════════════
  function loadProfile() {
    chrome.storage.local.get(['profile','settings'], ({ profile, settings }) => {
      if (profile) {
        const map = { 'qa-fn':'firstName','qa-ln':'lastName','qa-em':'email','qa-ph':'phone','qa-ci':'city','qa-st':'state','qa-zp':'zip','qa-li':'linkedin','qa-jt':'jobTitle','qa-sl':'salary' };
        Object.entries(map).forEach(([id,key]) => { const el=sidebar.querySelector('#'+id); if(el&&profile[key]) el.value=profile[key]; });
      }
      if (settings) {
        if (settings.autoFill !== undefined)     sidebar.querySelector('#qa-tog-auto').classList.toggle('on', settings.autoFill);
        if (settings.trackApps !== undefined)    sidebar.querySelector('#qa-tog-track').classList.toggle('on', settings.trackApps!==false);
        if (settings.autoFetchJD !== undefined)  sidebar.querySelector('#qa-tog-autofetch').classList.toggle('on', settings.autoFetchJD!==false);
        if (settings.apiKey) { const el=sidebar.querySelector('#qa-ak'); if(el) el.value=settings.apiKey; }
      }
    });
    updateCVAnalyzeDropdown();
  }

  function saveSettings() {
    const profile = {};
    const map = { 'qa-fn':'firstName','qa-ln':'lastName','qa-em':'email','qa-ph':'phone','qa-ci':'city','qa-st':'state','qa-zp':'zip','qa-li':'linkedin','qa-jt':'jobTitle','qa-sl':'salary' };
    Object.entries(map).forEach(([id,key]) => { const el=sidebar.querySelector('#'+id); if(el) profile[key]=el.value.trim(); });
    const settings = {
      autoFill:    sidebar.querySelector('#qa-tog-auto').classList.contains('on'),
      trackApps:   sidebar.querySelector('#qa-tog-track').classList.contains('on'),
      autoFetchJD: sidebar.querySelector('#qa-tog-autofetch').classList.contains('on'),
      apiKey:      sidebar.querySelector('#qa-ak')?.value.trim() || ''
    };
    chrome.storage.local.set({ profile, settings }, () => {
      const f = sidebar.querySelector('#qa-saved-flash');
      f.classList.add('show'); setTimeout(() => f.classList.remove('show'), 2500);
    });
  }

  // ════════════════════════════════════════════
  //  CREDITS + SUBSCRIPTION
  // ════════════════════════════════════════════
  const PCFG = { free:{c:3,daily:true}, starter:{c:50,daily:false}, pro:{c:9999999}, ultra:{c:9999999} };

  function getCredits(cb) {
    chrome.storage.local.get(['plan','credits','creditsDate'], data => {
      const plan=data.plan||'free', cfg=PCFG[plan];
      const today=new Date().toDateString(); let credits=data.credits;
      if (cfg.daily&&data.creditsDate!==today) { credits=cfg.c; chrome.storage.local.set({credits,creditsDate:today}); }
      else if (credits==null) { credits=cfg.c; chrome.storage.local.set({credits,creditsDate:today}); }
      cb(plan, Math.max(0, credits));
    });
  }

  function useCredit(cb) {
    getCredits((plan,credits) => {
      if (plan==='pro'||plan==='ultra') { cb(true); return; }
      if (credits<=0) { cb(false); return; }
      chrome.storage.local.set({credits:credits-1}, () => { updateCreditUI(); cb(true); });
    });
  }

  function updateCreditUI() {
    getCredits((plan,credits) => {
      const unlim = plan==='pro'||plan==='ultra';
      const maxC  = PCFG[plan]?.c||3;
      const ct    = sidebar.querySelector('#qa-cred-text');
      const planB = sidebar.querySelector('#qa-plan-btn');
      const fill  = sidebar.querySelector('#qa-meter-fill');
      const count = sidebar.querySelector('#qa-meter-count');
      const subS  = sidebar.querySelector('#qa-sub-status');
      const subD  = sidebar.querySelector('#qa-sub-desc');
      if (ct)    ct.textContent    = unlim ? 'Unlimited' : credits+' credits';
      if (planB) { const lbl={free:'FREE',starter:'STARTER',pro:'PRO',ultra:'ULTRA'}; planB.textContent=lbl[plan]||'FREE'; planB.className='qa-plan-btn'+(plan!=='free'?' paid':''); }
      if (fill)  fill.style.width  = unlim ? '100%' : Math.round((credits/maxC)*100)+'%';
      if (count) count.textContent = unlim ? 'Unlimited' : plan==='starter' ? `${credits} / 50 monthly` : `${credits} / 3 daily`;
      if (subS)  subS.textContent  = {free:'Free Plan',starter:'Starter Plan',pro:'Pro Plan',ultra:'Ultra Plan'}[plan]||'Free Plan';
      if (subD)  subD.textContent  = unlim ? 'Unlimited AI credits · All features' : plan==='starter' ? `${credits} of 50 monthly credits remaining` : `${credits} of 3 daily credits remaining`;
    });
  }

  function checkRenewal() {
    chrome.storage.local.get(['plan','subscriptionEnd'], ({ plan, subscriptionEnd }) => {
      if (!plan || plan==='free' || !subscriptionEnd) return;
      const daysLeft = Math.ceil((subscriptionEnd - Date.now()) / (1000*60*60*24));
      const banner = sidebar.querySelector('#qa-renew-banner');
      const daysEl = sidebar.querySelector('#qa-renew-days');
      if (daysLeft <= 7 && daysLeft > 0) {
        if (banner) { banner.style.display = 'flex'; if(daysEl) daysEl.textContent = daysLeft; }
      }
    });
  }

  // ════════════════════════════════════════════
  //  AUTOFILL
  // ════════════════════════════════════════════
  function buildMap(p) {
    return [
      {re:/first[\s._-]?name|fname|given/i,         v:p.firstName},
      {re:/last[\s._-]?name|lname|family|surname/i,  v:p.lastName},
      {re:/full[\s._-]?name|your[\s._-]?name/i,      v:(p.firstName+' '+p.lastName).trim()},
      {re:/\bemail\b|e-mail/i,                       v:p.email},
      {re:/phone|mobile|telephone/i,                 v:p.phone},
      {re:/\bcity\b/i,                               v:p.city},
      {re:/\bstate\b|\bprovince\b/i,                 v:p.state},
      {re:/\bzip\b|postal/i,                         v:p.zip},
      {re:/linkedin/i,                               v:p.linkedin},
      {re:/website|portfolio/i,                      v:p.website||''},
      {re:/current[\s._-]?title|job[\s._-]?title|position/i, v:p.jobTitle},
      {re:/salary|compensation/i,                    v:p.salary||''},
      {re:/education|degree/i,                       v:p.education||''},
      {re:/\bskills?\b|expertise/i,                  v:p.skills||''},
      {re:/summary|cover[\s._-]?letter|motivation|about[\s._-]?you/i, v:p.summary||''},
    ];
  }
  function getHint(el) {
    const lbl=document.querySelector('label[for="'+el.id+'"]');
    return [el.name,el.id,el.placeholder,el.getAttribute('aria-label')||'',lbl?lbl.textContent:''].join(' ').toLowerCase();
  }
  function setVal(el,val) {
    const proto=el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
    const setter=Object.getOwnPropertyDescriptor(proto,'value');
    if (setter?.set) setter.set.call(el,val); else el.value=val;
    ['input','change','blur'].forEach(e=>el.dispatchEvent(new Event(e,{bubbles:true})));
  }
  function doFill(profile, showToast) {
    const map=buildMap(profile); let n=0;
    document.querySelectorAll("input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=checkbox]):not([type=radio]):not([type=file]),textarea").forEach(el=>{
      if (el.closest('#qa-sidebar')||el.readOnly||el.disabled) return;
      const h=getHint(el);
      for (const {re,v} of map) { if (v&&re.test(h)) { setVal(el,v); n++; break; } }
    });
    if (showToast) toast(n>0?`Filled ${n} field${n>1?'s':''}!`:'No matching fields found.', n>0?'ok':'warn');
    return n;
  }
  function doAutofill(showToast) {
    useCredit(ok=>{
      if (!ok) { toast('No credits left! Upgrade to continue.','warn'); qaOpenPricing(); return; }
      // Get default CV for skills/summary merge
      getCVs(cvs=>{
        const defCV=cvs.find(c=>c.isDefault)||cvs[0];
        chrome.storage.local.get(['profile','settings'],({profile,settings})=>{
          if (!profile?.firstName) { toast('Save your profile in Settings first!','warn'); return; }
          const merged = { ...profile, skills:defCV?.skills||profile.skills, summary:defCV?.text||profile.summary };
          doFill(merged, showToast);
          if (!settings||settings.trackApps!==false) trackApp(profile);
        });
      });
    });
  }
  function markApplied() {
    chrome.storage.local.get('profile',({profile})=>{
      if (!profile) { toast('Save your profile first!','warn'); return; }
      trackApp(profile); toast('Application marked as applied! ✓','ok');
    });
  }
  function trackApp(profile) {
    const titleEl=document.querySelector('h1:not(#qa-sidebar h1)');
    let title=titleEl?titleEl.textContent.trim():document.title;
    title=title.replace(/\s[-|].*/,'').substring(0,80);
    const compEl=document.querySelector('[class*="company-name"]:not(#qa-sidebar *),[class*="companyName"]:not(#qa-sidebar *)');
    const company=compEl?compEl.textContent.trim().substring(0,50):PLATFORM;
    chrome.storage.local.get('applications',({applications})=>{
      const apps=applications||[];
      if (apps.some(a=>a.title===title&&Date.now()-a.date<300000)) return;
      apps.push({title,company,platform:PLATFORM,date:Date.now(),status:'applied'});
      if (apps.length>300) apps.splice(0,apps.length-300);
      chrome.storage.local.set({applications:apps},loadTracker);
    });
  }

  function insertTextIntoForm(text) {
    if (!text) return;
    const tas = Array.from(document.querySelectorAll('textarea')).filter(t=>!t.closest('#qa-sidebar'));
    const target = tas.find(t=>/cover|letter|message|motivation|why/i.test(getHint(t)))||tas[tas.length-1];
    if (target) { setVal(target,text); toast('Inserted! ✓','ok'); } else toast('No text area found.','warn');
  }

  function saveTailoredAsCV(text) {
    if (!text) return;
    getCVs(cvs => {
      const base = cvs.find(c=>c.isDefault)||cvs[0];
      cvs.push({ id:'cv_'+Date.now(), name:(base?.name||'My CV')+' (Tailored '+new Date().toLocaleDateString()+')', jobTitle:base?.jobTitle||'', text, skills:base?.skills||'', education:base?.education||'', createdAt:Date.now() });
      chrome.storage.local.set({ qaCVs:cvs }, () => { renderCVProfiles(); renderCVSelector(); renderActiveCVChip(); updateCVAnalyzeDropdown(); toast('Saved as new CV profile! ✓','ok'); });
    });
  }

  // ════════════════════════════════════════════
  //  CLAUDE API
  // ════════════════════════════════════════════
  async function callClaude(apiKey, prompt, maxTokens) {
    const res=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:maxTokens,messages:[{role:'user',content:prompt}]})
    });
    const d=await res.json();
    if (d.error) throw new Error(d.error.message);
    return d.content?.[0]?.text||'';
  }
  function getApiKey(cb) {
    chrome.storage.local.get('settings',({settings})=>cb(settings?.apiKey?.trim()||''));
  }
  function getActiveCV(cb) {
    getCVs(cvs=>cb(cvs.find(c=>c.isDefault)||cvs[0]||null));
  }

  // ════════════════════════════════════════════
  //  QUICK COVER LETTER
  // ════════════════════════════════════════════
  function quickCoverLetter() {
    chrome.storage.local.get('profile',async({profile})=>{
      if (!profile?.firstName) { toast('Save your profile in Settings first!','warn'); return; }
      getApiKey(async apiKey=>{
        if (!apiKey) { toast('Add your Anthropic API key in Settings!','warn'); return; }
        useCredit(async ok=>{
          if (!ok) { qaOpenPricing(); return; }
          const btn=sidebar.querySelector('#qa-quick-cl-btn');
          const out=sidebar.querySelector('#qa-cl-apply-out');
          btn.disabled=true; btn.textContent='Generating...';
          const outEl = sidebar.querySelector('#qa-cl-apply-out');
          if(outEl){ outEl.innerHTML='<span class="qa-thinking">Writing your cover letter</span>'; outEl.style.display='block'; }
          const jd=_cachedJD||fetchJobDescription(false)||'Job at '+PLATFORM;
          getActiveCV(async cv=>{
            try {
              const text=await callClaude(apiKey,`Write a compelling 3-paragraph cover letter.\nCandidate: ${profile.firstName} ${profile.lastName}, ${profile.jobTitle||cv?.jobTitle||''}\nSkills: ${cv?.skills||''}\nBackground: ${(cv?.text||'').substring(0,400)}\nJob:\n${jd}\nStart "Dear Hiring Manager," — end "Sincerely,\n${profile.firstName} ${profile.lastName}"`,900);
              out.textContent=text;
              const tas=Array.from(document.querySelectorAll('textarea')).filter(t=>!t.closest('#qa-sidebar'));
              const target=tas.find(t=>/cover|letter|message|motivation|why/i.test(getHint(t)))||tas[tas.length-1];
              if (target) { setVal(target,text); toast('Cover letter inserted into form! ✓','ok'); }
              else toast('Cover letter generated! Copy and paste it.','ok');
            } catch(e) { out.textContent='Error: '+e.message; }
            btn.disabled=false; btn.textContent='✨ Generate & Insert Cover Letter';
          });
        });
      });
    });
  }

  // ════════════════════════════════════════════
  //  CV ANALYSIS + REWRITE
  // ════════════════════════════════════════════
  let _cvProfile, _cvJD, _cvApiKey, _cvMissing;

  function analyzeCV() {
    const jd=sidebar.querySelector('#qa-cv-jd')?.value.trim()||_cachedJD;
    if (!jd) { toast('Paste or fetch the job description first!','warn'); return; }
    const cvId=sidebar.querySelector('#qa-cv-pick-analyze')?.value;
    getCVs(async cvs=>{
      const cv=cvId?cvs.find(c=>c.id===cvId):cvs.find(c=>c.isDefault)||cvs[0];
      if (!cv?.text) { toast('Please select a CV profile with text first!','warn'); return; }
      getApiKey(async apiKey=>{
        if (!apiKey) { toast('Add your API key in Settings!','warn'); return; }
        const btn=sidebar.querySelector('#qa-analyze-btn');
        btn.disabled=true; btn.textContent='Analyzing...';
        const prompt=`ATS analyst. Reply ONLY valid JSON no markdown:\n{"score":72,"verdict":"Good Match","missing_keywords":["kw1","kw2"],"present_keywords":["kw3"]}\nRESUME: ${cv.text}\nSKILLS: ${cv.skills||''}\nJOB: ${jd}`;
        try {
          const raw=await callClaude(apiKey,prompt,600);
          const data=JSON.parse(raw.replace(/```json|```/g,'').trim());
          _cvProfile=cv; _cvJD=jd; _cvApiKey=apiKey; _cvMissing=data.missing_keywords||[];
          renderATS(data);
        } catch(e) { toast('Analysis failed: '+e.message,'err'); }
        btn.disabled=false; btn.textContent='📊 Analyze & Score';
      });
    });
  }

  function renderATS(data) {
    sidebar.querySelector('#qa-ats-result').style.display='block';
    const score=Math.min(100,Math.max(0,parseInt(data.score)||0));
    const circ=2*Math.PI*35;
    const ring=sidebar.querySelector('#qa-ring');
    ring.style.strokeDashoffset=circ-(score/100)*circ;
    const color=score>=80?'#16a34a':score>=60?'#f59e0b':'#ef4444';
    ring.style.stroke=color;
    const pEl=sidebar.querySelector('#qa-ats-pct'); pEl.textContent=score+'%'; pEl.style.color=color;
    const vEl=sidebar.querySelector('#qa-ats-verdict'); vEl.textContent=data.verdict||''; vEl.style.color=color;
    sidebar.querySelector('#qa-kw-miss').innerHTML=(data.missing_keywords||[]).slice(0,12).map(k=>
      `<span class="qa-pill qa-pill-miss" onclick="navigator.clipboard.writeText('${k.replace(/'/g,"\\'")}');this.textContent='Copied!';setTimeout(()=>this.textContent='+\u00a0${k.replace(/'/g,"\\'")}',1400)">+ ${k}</span>`).join('');
    sidebar.querySelector('#qa-kw-have').innerHTML=(data.present_keywords||[]).slice(0,10).map(k=>
      `<span class="qa-pill qa-pill-have">✓ ${k}</span>`).join('');
  }

  function rewriteCV() {
    if (!_cvProfile) { toast('Run CV analysis first!','warn'); return; }
    chrome.storage.local.get('plan',async({plan})=>{
      if (!plan||plan==='free'||plan==='starter') { qaOpenPricing(); return; }
      useCredit(async ok=>{
        if (!ok) { qaOpenPricing(); return; }
        const btn=sidebar.querySelector('#qa-rewrite-btn');
        btn.disabled=true; btn.textContent='Rewriting CV...';
        const prompt=`Rewrite resume for 100% ATS match. Keep all real experience only. Mark every addition: [ADDED: text].\nMissing keywords to add: ${(_cvMissing||[]).join(', ')}\nRESUME:\n${_cvProfile.text}\nJOB:\n${_cvJD}`;
        try {
          const result=await callClaude(_cvApiKey,prompt,1800);
          sidebar.querySelector('#qa-rewrite-out').style.display='block';
          const html=result.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\[ADDED: ([^\]]+)\]/g,'<span class="qa-diff-add">$1</span>');
          sidebar.querySelector('#qa-diff-box').innerHTML=html;
        } catch(e) { toast('Rewrite failed: '+e.message,'err'); }
        btn.disabled=false; btn.textContent='✨ Rewrite CV to 100% Match';
      });
    });
  }

  function insertCVRewrite() {
    const text=sidebar.querySelector('#qa-diff-box')?.textContent;
    if (!text) return;
    const tas=Array.from(document.querySelectorAll('textarea')).filter(t=>!t.closest('#qa-sidebar'));
    if (tas.length) { setVal(tas[0],text); toast('CV inserted! ✓','ok'); }
    else toast('No text area found on this page.','warn');
  }

  // ════════════════════════════════════════════
  //  AI TOOLS
  // ════════════════════════════════════════════
  function genCoverLetter() {
    const jd=sidebar.querySelector('#qa-jd')?.value.trim()||_cachedJD;
    if (!jd) { toast('Paste or fetch a job description first!','warn'); return; }
    chrome.storage.local.get('profile',async({profile})=>{
      if (!profile?.firstName) { toast('Save your profile first!','warn'); return; }
      getApiKey(async apiKey=>{
        if (!apiKey) { toast('Add your API key in Settings!','warn'); return; }
        useCredit(async ok=>{
          if (!ok) { qaOpenPricing(); return; }
          const btn=sidebar.querySelector('#qa-cl-btn'),out=sidebar.querySelector('#qa-cl-out');
          btn.disabled=true; btn.textContent='Generating...';
          const outEl = sidebar.querySelector('#qa-cl-apply-out');
          if(outEl){ outEl.innerHTML='<span class="qa-thinking">Writing your cover letter</span>'; outEl.style.display='block'; }
          sidebar.querySelector('#qa-cl-actions').style.display='none';
          getActiveCV(async cv=>{
            try {
              out.textContent=await callClaude(apiKey,`Write a compelling 3-paragraph cover letter.\nCandidate: ${profile.firstName} ${profile.lastName}, ${profile.jobTitle||cv?.jobTitle||''}\nSkills: ${cv?.skills||''}\nBackground: ${(cv?.text||'').substring(0,400)}\nJob:\n${jd}\nStart "Dear Hiring Manager," end "Sincerely,\n${profile.firstName} ${profile.lastName}"`,900);
              sidebar.querySelector('#qa-cl-actions').style.display='flex';
            } catch(e) { out.textContent='Error: '+e.message; }
            btn.disabled=false; btn.textContent='✨ Generate Cover Letter';
          });
        });
      });
    });
  }

  function insertCoverLetter() {
    const text=sidebar.querySelector('#qa-cl-out')?.textContent;
    if (!text) return;
    const tas=Array.from(document.querySelectorAll('textarea')).filter(t=>!t.closest('#qa-sidebar'));
    const target=tas.find(t=>/cover|letter|message|motivation|why/i.test(getHint(t)))||tas[tas.length-1];
    if (target) { setVal(target,text); toast('Cover letter inserted! ✓','ok'); }
    else toast('No text area found.','warn');
  }

  function extractKeywords() {
    const jd=sidebar.querySelector('#qa-jd')?.value.trim()||_cachedJD;
    if (!jd) { toast('Paste or fetch a job description first!','warn'); return; }
    getApiKey(async apiKey=>{
      if (!apiKey) { toast('Add your API key!','warn'); return; }
      const btn=sidebar.querySelector('#qa-kw-btn'),out=sidebar.querySelector('#qa-kw-out');
      btn.disabled=true; btn.textContent='Extracting...';
      out.innerHTML='<span class="qa-thinking">Extracting keywords</span>';
      out.classList.add('show');
      try { out.textContent=await callClaude(apiKey,`List top 12 ATS keywords from this job. For each: keyword, why it matters (1 sentence), sample resume bullet.\n\n${jd}`,600); }
      catch(e) { out.textContent='Error: '+e.message; }
      btn.disabled=false; btn.textContent='🔍 Extract Keywords';
    });
  }

  function interviewPrep() {
    chrome.storage.local.get(['plan','profile'],async({plan,profile})=>{
      if (!plan||plan==='free') { qaOpenPricing(); return; }
      const jd=sidebar.querySelector('#qa-jd')?.value.trim()||_cachedJD;
      if (!jd) { toast('Fetch or paste a job description first!','warn'); return; }
      getApiKey(async apiKey=>{
        if (!apiKey) { toast('Add your API key!','warn'); return; }
        const btn=sidebar.querySelector('#qa-int-btn'),out=sidebar.querySelector('#qa-int-out');
        btn.disabled=true; btn.textContent='Generating...';
        out.innerHTML='<span class="qa-thinking">Preparing questions</span>';
        out.classList.add('show');
        getActiveCV(async cv=>{
          try { out.textContent=await callClaude(apiKey,`Generate 6 interview Q&A (STAR method).\nCandidate: ${profile?.jobTitle||cv?.jobTitle||''}, Skills: ${cv?.skills||profile?.skills||''}\nJob:\n${jd}\nFormat:\nQ: [question]\nA: [answer]\n---`,1000); }
          catch(e) { out.textContent='Error: '+e.message; }
          btn.disabled=false; btn.textContent='🎤 Generate Interview Q&A';
        });
      });
    });
  }

  // ════════════════════════════════════════════
  //  TRACKER
  // ════════════════════════════════════════════
  const STATUSES=['applied','interview','offer','rejected'];
  const STAT_LBL={applied:'Applied',interview:'Interview',offer:'Offer',rejected:'Rejected'};
  const PLT_ICO={LinkedIn:'💼',Indeed:'🔍',Glassdoor:'💚',Greenhouse:'🌿',Lever:'⚙️',Workday:'🔷'};

  function loadTracker() {
    chrome.storage.local.get('applications',({applications})=>{
      const apps=applications||[];
      sidebar.querySelector('#qa-s-all').textContent=apps.length;
      sidebar.querySelector('#qa-s-int').textContent=apps.filter(a=>a.status==='interview').length;
      sidebar.querySelector('#qa-s-off').textContent=apps.filter(a=>a.status==='offer').length;
      sidebar.querySelector('#qa-s-rej').textContent=apps.filter(a=>a.status==='rejected').length;
      const list=sidebar.querySelector('#qa-jlist');
      if (!apps.length) { list.innerHTML='<div class="qa-empty">No applications yet. Start applying! 🎯</div>'; return; }
      list.innerHTML=apps.slice().reverse().slice(0,25).map((app,i)=>{
        const idx=apps.length-1-i,s=app.status||'applied';
        const dt=new Date(app.date).toLocaleDateString('en-US',{month:'short',day:'numeric'});
        return `<div class="qa-jitem"><div class="qa-jico">${PLT_ICO[app.platform]||'📋'}</div><div class="qa-jinfo"><div class="qa-jtitle">${app.title||'Job Application'}</div><div class="qa-jmeta">${app.company||app.platform} · ${dt}</div></div><span class="qa-jtag qa-t-${s}" data-idx="${idx}">${STAT_LBL[s]}</span></div>`;
      }).join('');
      list.querySelectorAll('.qa-jtag').forEach(tag=>{
        tag.addEventListener('click',()=>{
          const idx=parseInt(tag.dataset.idx),a2=[...apps];
          a2[idx].status=STATUSES[(STATUSES.indexOf(a2[idx].status||'applied')+1)%STATUSES.length];
          chrome.storage.local.set({applications:a2},loadTracker);
        });
      });
    });
  }

  function clearTracker() {
    if (confirm('Clear all application history? Cannot be undone.')) chrome.storage.local.remove('applications',loadTracker);
  }

  // ════════════════════════════════════════════
  //  PRICING + PAYMENT
  // ════════════════════════════════════════════
  let billing='monthly', selectedPlan=null;
  const PRICES={monthly:{starter:'$7.99',pro:'$14.99',ultra:'$29.99'},annual:{starter:'$4.99',pro:'$8.99',ultra:'$17.99'}};
  const PLAN_NAMES={starter:'Starter',pro:'Pro',ultra:'Ultra'};

  function openPricing()  { sidebar.querySelector('#qa-pricing').classList.add('show'); loadSavedPayment(); }
  window.qaOpenPricing = openPricing;
  function closePricing() { sidebar.querySelector('#qa-pricing').classList.remove('show'); sidebar.querySelector('#qa-pay-section').classList.remove('show'); selectedPlan=null; }
  window.qaClosePricing = closePricing;

  function toggleBilling() { setBilling(billing==='monthly'?'annual':'monthly'); }
  function setBilling(mode) {
    billing=mode;
    sidebar.querySelector('#qa-bill-sw').classList.toggle('annual',mode==='annual');
    sidebar.querySelector('#qa-b-mon').classList.toggle('active',mode==='monthly');
    sidebar.querySelector('#qa-b-ann').classList.toggle('active',mode==='annual');
    const p=PRICES[mode];
    [['s','starter'],['p','pro'],['u','ultra']].forEach(([k,n])=>{
      const pr=sidebar.querySelector(`#qa-pr-${k}`),pp=sidebar.querySelector(`#qa-pp-${k}`);
      if(pr)pr.textContent=p[n]; if(pp)pp.textContent=mode==='annual'?'/mo, billed yearly':'/month';
    });
  }

  function selectPlan(name) {
    selectedPlan=name;
    const p=PRICES[billing];
    sidebar.querySelector('#qa-pay-nm').textContent=PLAN_NAMES[name]+' Plan';
    sidebar.querySelector('#qa-pay-pr').textContent=p[name];
    sidebar.querySelector('#qa-pay-bl').textContent=billing==='annual'?p[name]+'/mo · Billed annually · Cancel anytime':p[name]+'/month · Cancel anytime';
    chrome.storage.local.get(['profile','qaPaymentSaved'],({profile,qaPaymentSaved})=>{
      if (profile?.email)     sidebar.querySelector('#qa-pay-email').value=profile.email;
      if (profile?.firstName) sidebar.querySelector('#qa-pay-fullname').value=(profile.firstName+' '+(profile.lastName||'')).trim();
    });
    const ps=sidebar.querySelector('#qa-pay-section');
    ps.classList.add('show');
    setTimeout(()=>ps.scrollIntoView({behavior:'smooth',block:'nearest'}),50);
  }

  function loadSavedPayment() {
    chrome.storage.local.get('qaPaymentSaved',({qaPaymentSaved})=>{
      if (!qaPaymentSaved) return;
      // Show masked saved card info
      const cnEl=sidebar.querySelector('#qa-cn');
      const ceEl=sidebar.querySelector('#qa-ce');
      const ccEl=sidebar.querySelector('#qa-cc');
      if (cnEl && qaPaymentSaved.last4) cnEl.placeholder=`•••• •••• •••• ${qaPaymentSaved.last4}`;
      if (ceEl && qaPaymentSaved.expiry) ceEl.placeholder=qaPaymentSaved.expiry;
    });
  }

  async function processPayment() {
    if (!selectedPlan) { showPayMsg('Select a plan above.', false); return; }
    const name    = sidebar.querySelector('#qa-pay-fullname')?.value.trim();
    const email   = sidebar.querySelector('#qa-pay-email')?.value.trim();
    const cardNum = sidebar.querySelector('#qa-cn')?.value.replace(/\s/g,'');
    const expiry  = sidebar.querySelector('#qa-ce')?.value.replace(/\s/g,'');
    const cvc     = sidebar.querySelector('#qa-cc')?.value.trim();
    const saveCard= sidebar.querySelector('#qa-save-card')?.checked;
    if (!name)  { showPayMsg('Enter your full name.', false); return; }
    if (!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showPayMsg('Enter a valid email.', false); return; }
    if (!cardNum||cardNum.length<15) { showPayMsg('Enter a valid card number.', false); return; }
    if (!expiry||expiry.replace(/\s/g,'').length<4) { showPayMsg('Enter card expiry.', false); return; }
    if (!cvc||cvc.length<3) { showPayMsg('Enter your CVC.', false); return; }
    const parts=expiry.replace(/\s/g,'').split('/');
    const btn=sidebar.querySelector('#qa-pay-btn');
    btn.disabled=true; btn.textContent='Processing...';
    try {
      const res=await fetch(SERVER+'/api/create-subscription',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({card:{number:cardNum,exp_month:parts[0],exp_year:parts[1]?'20'+parts[1]:'',cvc},plan:selectedPlan,billing,email,name,extensionUserId:chrome.runtime?.id||'ext'})
      });
      const data=await res.json();
      if (data.error) { showPayMsg('Payment failed: '+data.error,false); btn.disabled=false; btn.textContent='🔒 Subscribe Now'; return; }
      const credits={starter:50,pro:9999999,ultra:9999999};
      const subEnd=billing==='annual'?Date.now()+365*24*60*60*1000:Date.now()+30*24*60*60*1000;
      // Save payment info if user opted in
      const saveData={plan:selectedPlan,credits:credits[selectedPlan],creditsDate:new Date().toDateString(),subscriptionId:data.subscriptionId||'',customerId:data.customerId||'',subscriptionEnd:subEnd};
      if (saveCard && cardNum.length>=4) {
        saveData.qaPaymentSaved={last4:cardNum.slice(-4),expiry:expiry,name,email,savedAt:Date.now()};
      }
      chrome.storage.local.set(saveData,()=>{
        updateCreditUI(); checkRenewal();
        showPayMsg('Welcome to '+PLAN_NAMES[selectedPlan]+'! Your plan is now active. 🎉',true);
        setTimeout(()=>window.qaClosePricing(),3000);
        toast('🎉 '+PLAN_NAMES[selectedPlan]+' plan activated!','ok');
      });
    } catch(e) {
      showPayMsg('Cannot reach payment server. Check SERVER in content.js',false);
      btn.disabled=false; btn.textContent='🔒 Subscribe Now';
    }
  }

  function showPayMsg(msg,ok) {
    const el=sidebar.querySelector('#qa-pay-flash');
    el.textContent=msg; el.className='qa-flash '+(ok?'qa-flash-ok':'qa-flash-err')+' show';
    if (ok) setTimeout(()=>el.classList.remove('show'),4000);
  }

  // ════════════════════════════════════════════
  //  TOAST
  // ════════════════════════════════════════════
  function toast(msg,type) {
    document.getElementById('qa-toast-el')?.remove();
    const t=document.createElement('div');
    t.id='qa-toast-el'; t.className='qa-toast qa-toast-'+(type||'ok'); t.textContent=msg;
    document.body.appendChild(t);
    requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.add('show')));
    setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),400); },4000);
  }

  // SPA nav support
  let lastUrl=location.href;
  new MutationObserver(()=>{ if(location.href!==lastUrl){lastUrl=location.href;setTimeout(()=>{detectJob();fetchJobDescription(false);},1800);} }).observe(document.documentElement,{subtree:true,childList:true});

})();
