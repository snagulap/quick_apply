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

  // ── Resize handle (drag left edge to resize) ──
  const resizeHandle = document.createElement('div');
  resizeHandle.id = 'qa-resize-handle';
  resizeHandle.title = 'Drag to resize';
  document.body.appendChild(resizeHandle);

  let _isResizing = false;
  let _startX = 0, _startW = 0;

  resizeHandle.addEventListener('mousedown', e => {
    _isResizing = true;
    _startX = e.clientX;
    _startW = parseInt(getComputedStyle(sidebar).width, 10);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'ew-resize';
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!_isResizing) return;
    const delta = _startX - e.clientX; // dragging left = bigger
    const newW  = Math.min(800, Math.max(340, _startW + delta));
    sidebar.style.width    = newW + 'px';
    sidebar.style.right    = '0px';
    resizeHandle.style.right = newW + 'px';
    // Save preference
    localStorage.setItem('qa_sidebar_width', newW);
  });

  document.addEventListener('mouseup', () => {
    if (_isResizing) {
      _isResizing = false;
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }
  });

  // Restore saved width
  const savedW = localStorage.getItem('qa_sidebar_width');
  if (savedW) {
    sidebar.style.width = savedW + 'px';
    resizeHandle.style.right = savedW + 'px';
  }

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
        <p style="font-size:12px;color:#6b7280;margin-bottom:12px;text-align:center">Enter your email and we'll send a reset code.</p>
        <div class="qa-field"><label>Email</label><input type="email" id="qa-f-email" placeholder="jane@example.com"/></div>
        <button class="qa-btn qa-btn-green" id="qa-forgot-btn">Send Reset Code</button>
        <p class="qa-auth-switch"><span class="qa-link" id="qa-to-login2">← Back to sign in</span></p>
      </div>

      <!-- RESET CODE FORM -->
      <div id="qa-form-resetcode" style="width:100%;display:none">
        <p style="font-size:12px;color:#6b7280;margin-bottom:12px;text-align:center">Enter the reset code sent to your email.</p>
        <input type="hidden" id="qa-rc-email"/>
        <div class="qa-field"><label>Reset Code</label><input id="qa-rc-code" placeholder="e.g. A3X7KP2M" style="text-transform:uppercase;letter-spacing:2px;font-weight:700"/></div>
        <div class="qa-field"><label>New Password</label><input type="password" id="qa-rc-pass" placeholder="Min 8 characters"/></div>
        <div class="qa-field"><label>Confirm Password</label><input type="password" id="qa-rc-pass2" placeholder="Repeat password"/></div>
        <button class="qa-btn qa-btn-green" id="qa-reset-code-btn">Set New Password</button>
        <p class="qa-auth-switch"><span class="qa-link" id="qa-to-forgot-back">← Request new code</span></p>
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

    <!-- Setup banner for new users -->
    <div id="qa-setup-banner" class="qa-setup-banner" style="display:none">
      <div style="flex:1;min-width:0">
        <div style="font-size:11px;font-weight:800;color:#111827">⚡ Set up AI features</div>
        <div style="font-size:10px;color:#6b7280;margin-top:1px">Add your FREE Gemini key to enable CV tailoring</div>
      </div>
      <button class="qa-btn qa-btn-green" style="width:auto;padding:5px 10px;font-size:10px;white-space:nowrap" id="qa-setup-btn">Add Key →</button>
      <span id="qa-setup-close" style="font-size:14px;color:#9ca3af;cursor:pointer;padding:2px 4px;flex-shrink:0">✕</span>
    </div>

    <div class="qa-job-bar">
      <div class="qa-job-title" id="qa-job-title">Detecting job...</div>
      <div class="qa-job-meta" id="qa-job-meta"><span>${PLATFORM}</span></div>
    </div>

    <div class="qa-tabs">
      <div class="qa-tab qa-active" data-p="apply">Apply</div>
      <div class="qa-tab" data-p="cv">CV Align</div>
      <div class="qa-tab" data-p="ai">AI Tools</div>
      <div class="qa-tab" data-p="tracker">📊</div>
      <div class="qa-tab" data-p="analytics">Overview</div>
      <div class="qa-tab" data-p="settings">⚙️</div>
    </div>

    <div class="qa-body">

      <!-- APPLY TAB -->
      <div class="qa-panel qa-active" id="qa-p-apply">

        <!-- Empty state (shown when no job detected) -->
        <div id="qa-empty-state" class="qa-empty-state">
          <div class="qa-koala">🐨</div>
          <div class="qa-empty-title">Go to a Job page and click reload</div>
          <div class="qa-empty-sub">No job post found</div>
          <button class="qa-btn qa-btn-green" id="qa-empty-reload" style="width:100%;margin-top:4px">↻ Reload</button>
          <span class="qa-link" id="qa-manual-entry-btn" style="margin-top:10px;font-size:11px;display:block;text-align:center">Enter job details manually</span>
        </div>

        <!-- Job card (shown when job detected) -->
        <div id="qa-job-card" class="qa-job-card" style="display:none">
          <div class="qa-job-card-title" id="qa-jc-title">Job Title</div>
          <div class="qa-job-card-meta" id="qa-jc-meta"></div>
          <div id="qa-jc-skills-wrap" style="display:none;margin-top:8px">
            <div class="qa-hl-label">Skills</div>
            <div class="qa-pills" id="qa-jc-skills" style="margin-top:4px"></div>
          </div>
          <div id="qa-jc-quals-wrap" style="display:none;margin-top:8px">
            <div class="qa-hl-label">Key Requirements</div>
            <div id="qa-jc-quals" class="qa-jc-quals"></div>
            <span class="qa-expand-link" id="qa-jc-expand" style="display:none"></span>
          </div>
        </div>

        <!-- Manual entry form (hidden) -->
        <div id="qa-manual-form" class="qa-card" style="display:none;border-color:#16a34a;margin-bottom:10px">
          <div class="qa-card-title">📝 Enter Job Details Manually</div>
          <div class="qa-field"><label>Job Title</label><input id="qa-m-title" placeholder="e.g. Senior Software Engineer"/></div>
          <div class="qa-field"><label>Company</label><input id="qa-m-company" placeholder="e.g. Google"/></div>
          <div class="qa-field"><label>Job Description</label><textarea id="qa-m-jd" style="min-height:80px" placeholder="Paste the full job description here..."></textarea></div>
          <div class="qa-btn-row">
            <button class="qa-btn qa-btn-outline" id="qa-manual-cancel">Cancel</button>
            <button class="qa-btn qa-btn-green" id="qa-manual-save">Use This Job</button>
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
          <div class="qa-meter-hint">10 free/day · resets midnight · <span class="qa-link" id="qa-upgrade-link">Upgrade →</span></div>
        </div>
      </div>

      <!-- CV ALIGN TAB -->
      <div class="qa-panel" id="qa-p-cv">
        <div class="qa-card">
          <div class="qa-card-title">📊 ATS Score <span class="qa-chip qa-chip-ai">AI</span></div>
          <div class="qa-card-desc">Score your CV against this job and see exactly what's missing.</div>
          <div class="qa-field">
            <label style="display:flex;justify-content:space-between;align-items:center">
              Job Description
              <span style="display:flex;gap:8px;align-items:center">
                <span class="qa-link" id="qa-clear-jd-btn" style="font-size:10px;color:#9ca3af">✕ Clear</span>
                <span class="qa-link" id="qa-fetch-jd-btn" style="font-size:10px">↻ Fetch from page</span>
              </span>
            </label>
            <textarea id="qa-cv-jd" placeholder="Paste job description or click '↻ Fetch from page'..." style="min-height:100px"></textarea>
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
        <!-- Status filter tabs (like LetMeApply) -->
        <div class="qa-tracker-tabs">
          <button class="qa-ttab qa-active" data-status="all">Applied <span class="qa-ttab-count" id="qa-tc-all">0</span></button>
          <button class="qa-ttab" data-status="interview">Interviewing <span class="qa-ttab-count" id="qa-tc-int">0</span></button>
          <button class="qa-ttab" data-status="offer">Offer <span class="qa-ttab-count" id="qa-tc-off">0</span></button>
          <button class="qa-ttab" data-status="rejected">Rejected <span class="qa-ttab-count" id="qa-tc-rej">0</span></button>
          <button class="qa-ttab" data-status="favorites">⭐ <span class="qa-ttab-count" id="qa-tc-fav">0</span></button>
        </div>

        <!-- Search bar -->
        <div class="qa-tracker-search">
          <span style="font-size:13px;color:#9ca3af">🔍</span>
          <input id="qa-tracker-search" placeholder="Search by title, company or location..." class="qa-tracker-search-input"/>
        </div>

        <!-- Table header -->
        <div class="qa-tracker-hdr">
          <span style="flex:2">Position / Role</span>
          <span style="flex:1.2">Company</span>
          <span style="flex:1">Applied on</span>
          <span style="flex:1">Stage</span>
        </div>

        <!-- Job list -->
        <div class="qa-jlist" id="qa-jlist"><div class="qa-empty">No applications yet. Start applying! 🎯</div></div>

        <!-- Bottom actions -->
        <div style="margin-top:8px;display:flex;gap:8px">
          <button class="qa-btn qa-btn-danger" style="flex:1;font-size:11px" id="qa-clear-btn">🗑 Clear All</button>
        </div>
      </div>

      <!-- SETTINGS TAB -->
      <div class="qa-panel" id="qa-p-settings">

        <!-- Settings sub-nav -->
        <div class="qa-settings-nav">
          <button class="qa-snav-btn qa-active" data-sec="profile">👤 Profile</button>
          <button class="qa-snav-btn" data-sec="security">🔒 Security</button>
          <button class="qa-snav-btn" data-sec="billing">💳 Billing</button>
          <button class="qa-snav-btn" data-sec="cvs">📄 My CVs</button>
          <button class="qa-snav-btn" data-sec="prefs">⚙️ Prefs</button>
        </div>

        <!-- PROFILE SECTION -->
        <div class="qa-sec-body" id="qa-sec-profile">
          <div class="qa-sec-hdr">
            <div class="qa-sec-hdr-title">Profile</div>
            <div class="qa-sec-hdr-sub">Manage your personal information</div>
          </div>
          <div class="qa-profile-avatar" id="qa-avatar-ring">
            <div class="qa-avatar-circle" id="qa-avatar-initials">JD</div>
          </div>
          <div class="qa-row"><div class="qa-field"><label>First Name</label><input id="qa-fn" placeholder="Jane"/></div><div class="qa-field"><label>Last Name</label><input id="qa-ln" placeholder="Doe"/></div></div>
          <div class="qa-field"><label>Email</label><input type="email" id="qa-em" placeholder="jane@example.com"/></div>
          <div class="qa-row"><div class="qa-field"><label>Phone</label><input id="qa-ph" placeholder="+1 555 0000"/></div><div class="qa-field"><label>City</label><input id="qa-ci" placeholder="San Francisco"/></div></div>
          <div class="qa-row"><div class="qa-field"><label>State / Country</label><input id="qa-st" placeholder="CA / USA"/></div><div class="qa-field"><label>Zip Code</label><input id="qa-zp" placeholder="94105"/></div></div>
          <div class="qa-field"><label>LinkedIn URL</label><input id="qa-li" placeholder="linkedin.com/in/janedoe"/></div>
          <div class="qa-field"><label>Website / Portfolio</label><input id="qa-ws" placeholder="janedoe.dev"/></div>
          <div class="qa-field"><label>GitHub</label><input id="qa-gh" placeholder="github.com/janedoe"/></div>
          <div class="qa-sec-divider">Professional</div>
          <div class="qa-field"><label>Desired Job Title</label><input id="qa-jt" placeholder="Senior Software Engineer"/></div>
          <div class="qa-row"><div class="qa-field"><label>Experience</label><input id="qa-exp" placeholder="5 years"/></div><div class="qa-field"><label>Desired Salary</label><input id="qa-sl" placeholder="$120,000"/></div></div>
          <button class="qa-btn qa-btn-green" id="qa-save-btn" style="margin-top:10px">💾 Save Profile</button>
          <div class="qa-flash qa-flash-ok" id="qa-saved-flash">✓ Saved!</div>
        </div>

        <!-- SECURITY SECTION -->
        <div class="qa-sec-body" id="qa-sec-security" style="display:none">
          <div class="qa-sec-hdr">
            <div class="qa-sec-hdr-title">Security</div>
            <div class="qa-sec-hdr-sub">Manage your password and session</div>
          </div>
          <div class="qa-sec-card">
            <div class="qa-sec-card-title">Signed in as</div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px">
              <div><div style="font-size:13px;font-weight:700;color:#111827" id="qa-sec-name">—</div><div style="font-size:11px;color:#6b7280" id="qa-sec-email">—</div></div>
              <button class="qa-btn qa-btn-danger" style="width:auto;padding:7px 14px;font-size:11px" id="qa-logout-btn">Sign Out</button>
            </div>
          </div>
          <div class="qa-sec-card" style="margin-top:10px">
            <div class="qa-sec-card-title">Change Password</div>
            <div class="qa-field" style="margin-top:8px"><label>Current Password</label><input type="password" id="qa-pw-cur" placeholder="••••••••"/></div>
            <div class="qa-field"><label>New Password</label><input type="password" id="qa-pw-new" placeholder="Min 8 characters"/></div>
            <div class="qa-field"><label>Confirm New Password</label><input type="password" id="qa-pw-new2" placeholder="Repeat new password"/></div>
            <button class="qa-btn qa-btn-outline" id="qa-change-pw-btn" style="margin-top:4px">Update Password</button>
            <div class="qa-flash" id="qa-pw-flash" style="margin-top:8px"></div>
          </div>
          <div class="qa-sec-card" style="margin-top:10px">
            <div class="qa-sec-card-title">AI Configuration</div>
            <div class="qa-field" style="margin-top:8px">
              <label style="display:flex;align-items:center;justify-content:space-between">
                Anthropic API Key
                <span id="qa-api-status" style="font-size:10px;font-weight:700"></span>
              </label>
              <input type="password" id="qa-ak" placeholder="sk-ant-api03-..."/>
            </div>
            <div class="qa-api-note">Get your key at <a href="https://console.anthropic.com/settings/api-keys" target="_blank" style="color:#16a34a;font-weight:700">console.anthropic.com</a> · New accounts get $5 free credit</div>
            <div style="display:flex;gap:8px;margin-top:8px">
              <button class="qa-btn qa-btn-outline" style="flex:1" id="qa-save-api-btn">💾 Save API Key</button>
              <button class="qa-btn qa-btn-outline" style="flex:1" id="qa-test-api-btn">🧪 Test Key</button>
            </div>
            <div class="qa-flash" id="qa-api-flash" style="margin-top:6px"></div>
          </div>
          <div style="margin-top:12px;text-align:center">
            <span style="font-size:11px;color:#9ca3af">Secured by <strong>QuickApply</strong> · Local storage only</span>
          </div>
        </div>

        <!-- BILLING SECTION -->
        <div class="qa-sec-body" id="qa-sec-billing" style="display:none">
          <div class="qa-sec-hdr">
            <div class="qa-sec-hdr-title">Billing</div>
            <div class="qa-sec-hdr-sub">Manage your subscription</div>
          </div>
          <div class="qa-billing-plan-box" id="qa-billing-box">
            <div class="qa-bp-label">CURRENT PLAN</div>
            <div class="qa-bp-name" id="qa-bp-name">Free Plan</div>
            <div class="qa-bp-desc" id="qa-bp-desc">Unlock unlimited access to all features with our paid plans.</div>
            <button class="qa-btn qa-btn-green" id="qa-upgrade-billing-btn" style="margin-top:12px">Upgrade Now</button>
          </div>
          <div class="qa-sec-card" style="margin-top:10px" id="qa-paid-info" style="display:none">
            <div class="qa-sec-card-title">Subscription Details</div>
            <div id="qa-sub-details" style="font-size:12px;color:#374151;margin-top:8px;line-height:1.8"></div>
            <button class="qa-btn qa-btn-danger" id="qa-cancel-sub-btn" style="margin-top:10px;width:auto;padding:7px 16px;font-size:11px">Cancel Subscription</button>
          </div>
          <div class="qa-sec-card" style="margin-top:10px">
            <div class="qa-sec-card-title">Not seeing your updated subscription?</div>
            <div style="font-size:11px;color:#6b7280;margin:6px 0 10px;line-height:1.6">If you've completed your payment but don't see the latest status, you can refresh your subscription or contact support.</div>
            <div style="display:flex;gap:8px">
              <button class="qa-btn qa-btn-outline" style="flex:1;font-size:11px" id="qa-refresh-sub-btn">↻ Refresh Status</button>
              <button class="qa-btn qa-btn-outline" style="flex:1;font-size:11px" id="qa-contact-support-btn">Contact Support</button>
            </div>
          </div>
        </div>

        <!-- MY CVS SECTION -->
        <div class="qa-sec-body" id="qa-sec-cvs" style="display:none">
          <div class="qa-sec-hdr">
            <div class="qa-sec-hdr-title">My CV Profiles</div>
            <div class="qa-sec-hdr-sub">Manage your resumes for different roles</div>
          </div>
          <button class="qa-btn qa-btn-green" id="qa-add-cv-btn" style="margin-bottom:10px">+ Add New CV Profile</button>
          <div id="qa-cv-profiles-list"><div class="qa-empty" style="padding:16px 0">No CVs yet. Click above to add one.</div></div>

          <!-- Add/Edit CV form -->
          <div id="qa-cv-form" class="qa-card" style="display:none;border-color:#16a34a;margin-top:10px">
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
        </div>

        <!-- PREFERENCES SECTION -->
        <div class="qa-sec-body" id="qa-sec-prefs" style="display:none">
          <div class="qa-sec-hdr">
            <div class="qa-sec-hdr-title">Preferences</div>
            <div class="qa-sec-hdr-sub">Customize your QuickApply experience</div>
          </div>
          <div class="qa-toggle-row"><div><div class="qa-toggle-label">Auto-fill on page load</div><div class="qa-toggle-desc">Fill forms automatically when job page loads</div></div><div class="qa-toggle" id="qa-tog-auto"></div></div>
          <div class="qa-toggle-row"><div><div class="qa-toggle-label">Track applications</div><div class="qa-toggle-desc">Log every apply to the Tracker tab</div></div><div class="qa-toggle on" id="qa-tog-track"></div></div>
          <div class="qa-toggle-row"><div><div class="qa-toggle-label">Auto-fetch job description</div><div class="qa-toggle-desc">Extract job text when sidebar opens</div></div><div class="qa-toggle on" id="qa-tog-autofetch"></div></div>
          <div class="qa-toggle-row"><div><div class="qa-toggle-label">Dark mode</div><div class="qa-toggle-desc">Coming soon</div></div><div class="qa-toggle" id="qa-tog-dark" style="opacity:0.4;pointer-events:none"></div></div>
          <div style="margin-top:12px"><button class="qa-btn qa-btn-green" id="qa-save-prefs-btn">💾 Save Preferences</button></div>
          <div class="qa-sec-divider">Developer</div>
          <div class="qa-sec-card">
            <div class="qa-sec-card-title">Debug Tools</div>
            <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
              <button class="qa-btn qa-btn-outline" style="flex:1;font-size:11px" id="qa-reset-credits-btn">↺ Reset Credits</button>
              <button class="qa-btn qa-btn-outline" style="flex:1;font-size:11px" id="qa-clear-cache-btn">🗑 Clear JD Cache</button>
            </div>
          </div>
          <div class="qa-flash qa-flash-ok" id="qa-prefs-flash">✓ Saved!</div>
        </div>

      </div>

      <!-- ANALYTICS TAB -->
      <div class="qa-panel" id="qa-p-analytics">

        <!-- Stats cards row -->
        <div class="qa-overview-hdr">
          <div class="qa-overview-title">Overview</div>
          <div class="qa-period-select">
            <select id="qa-period-sel" class="qa-period-sel">
              <option value="30">Monthly</option>
              <option value="7">Last 7 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        <div class="qa-stat-cards">
          <div class="qa-stat-card">
            <div class="qa-stat-card-lbl">All Time</div>
            <div class="qa-stat-card-num" id="qa-ov-all">0</div>
            <div class="qa-stat-card-sub">Total applications</div>
          </div>
          <div class="qa-stat-card">
            <div class="qa-stat-card-lbl">Monthly</div>
            <div class="qa-stat-card-num" id="qa-ov-month">0</div>
            <div class="qa-stat-card-sub">Applications in last 30 days</div>
          </div>
          <div class="qa-stat-card">
            <div class="qa-stat-card-lbl">Last 7 Days</div>
            <div class="qa-stat-card-num" id="qa-ov-week">0</div>
            <div class="qa-stat-card-sub">Applications in last 7 days</div>
          </div>
        </div>

        <!-- Activity calendar (GitHub-style) -->
        <div class="qa-analytics-card" style="margin-top:12px">
          <div class="qa-analytics-card-title">Activity this month</div>
          <div id="qa-activity-cal" class="qa-activity-cal"></div>
          <div class="qa-cal-legend">
            <span>Less</span>
            <div class="qa-cal-leg-box" style="background:#e5e7eb"></div>
            <div class="qa-cal-leg-box" style="background:#bbf7d0"></div>
            <div class="qa-cal-leg-box" style="background:#4ade80"></div>
            <div class="qa-cal-leg-box" style="background:#16a34a"></div>
            <div class="qa-cal-leg-box" style="background:#14532d"></div>
            <span>More</span>
          </div>
          <div class="qa-cal-footer">
            <div><div class="qa-cal-stat-num" id="qa-cal-viewed">0</div><div class="qa-cal-stat-lbl">Jobs viewed this month</div></div>
            <div><div class="qa-cal-stat-num" id="qa-cal-applied" style="color:#16a34a">0</div><div class="qa-cal-stat-lbl">Jobs applied this month</div></div>
          </div>
        </div>

        <!-- Trend chart -->
        <div class="qa-analytics-card" style="margin-top:10px">
          <div class="qa-analytics-card-title">Application Trends</div>
          <div style="font-size:10px;color:#9ca3af;margin-bottom:10px">Track jobs applied and viewed over time</div>
          <div id="qa-trend-chart" class="qa-trend-chart">
            <canvas id="qa-trend-canvas" height="100"></canvas>
          </div>
          <div class="qa-chart-legend">
            <span class="qa-chart-leg-dot" style="background:#16a34a"></span><span>Jobs Applied</span>
            <span class="qa-chart-leg-dot" style="background:#f59e0b"></span><span>Jobs Viewed</span>
          </div>
        </div>

        <!-- Usage stats (like LetMeApply) -->
        <div class="qa-analytics-card" style="margin-top:10px">
          <div class="qa-analytics-card-title">USAGE</div>
          <div class="qa-usage-row"><span>Jobs imported</span><span id="qa-use-imported">0/15</span></div>
          <div class="qa-usage-row"><span>Resumes tailored</span><span id="qa-use-tailored">0/5</span></div>
          <div class="qa-usage-row"><span>Cover letters generated</span><span id="qa-use-covers">0/2</span></div>
        </div>

      </div>

    </div><!-- /body -->      <!-- ANALYTICS TAB -->
      <div class="qa-panel" id="qa-p-analytics">

        <!-- Stats cards row -->
        <div class="qa-overview-hdr">
          <div class="qa-overview-title">Overview</div>
          <div class="qa-period-select">
            <select id="qa-period-sel" class="qa-period-sel">
              <option value="30">Monthly</option>
              <option value="7">Last 7 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        <div class="qa-stat-cards">
          <div class="qa-stat-card">
            <div class="qa-stat-card-lbl">All Time</div>
            <div class="qa-stat-card-num" id="qa-ov-all">0</div>
            <div class="qa-stat-card-sub">Total applications</div>
          </div>
          <div class="qa-stat-card">
            <div class="qa-stat-card-lbl">Monthly</div>
            <div class="qa-stat-card-num" id="qa-ov-month">0</div>
            <div class="qa-stat-card-sub">Applications in last 30 days</div>
          </div>
          <div class="qa-stat-card">
            <div class="qa-stat-card-lbl">Last 7 Days</div>
            <div class="qa-stat-card-num" id="qa-ov-week">0</div>
            <div class="qa-stat-card-sub">Applications in last 7 days</div>
          </div>
        </div>

        <!-- Activity calendar (GitHub-style) -->
        <div class="qa-analytics-card" style="margin-top:12px">
          <div class="qa-analytics-card-title">Activity this month</div>
          <div id="qa-activity-cal" class="qa-activity-cal"></div>
          <div class="qa-cal-legend">
            <span>Less</span>
            <div class="qa-cal-leg-box" style="background:#e5e7eb"></div>
            <div class="qa-cal-leg-box" style="background:#bbf7d0"></div>
            <div class="qa-cal-leg-box" style="background:#4ade80"></div>
            <div class="qa-cal-leg-box" style="background:#16a34a"></div>
            <div class="qa-cal-leg-box" style="background:#14532d"></div>
            <span>More</span>
          </div>
          <div class="qa-cal-footer">
            <div><div class="qa-cal-stat-num" id="qa-cal-viewed">0</div><div class="qa-cal-stat-lbl">Jobs viewed this month</div></div>
            <div><div class="qa-cal-stat-num" id="qa-cal-applied" style="color:#16a34a">0</div><div class="qa-cal-stat-lbl">Jobs applied this month</div></div>
          </div>
        </div>

        <!-- Trend chart -->
        <div class="qa-analytics-card" style="margin-top:10px">
          <div class="qa-analytics-card-title">Application Trends</div>
          <div style="font-size:10px;color:#9ca3af;margin-bottom:10px">Track jobs applied and viewed over time</div>
          <div id="qa-trend-chart" class="qa-trend-chart">
            <canvas id="qa-trend-canvas" height="100"></canvas>
          </div>
          <div class="qa-chart-legend">
            <span class="qa-chart-leg-dot" style="background:#16a34a"></span><span>Jobs Applied</span>
            <span class="qa-chart-leg-dot" style="background:#f59e0b"></span><span>Jobs Viewed</span>
          </div>
        </div>

        <!-- Usage stats (like LetMeApply) -->
        <div class="qa-analytics-card" style="margin-top:10px">
          <div class="qa-analytics-card-title">USAGE</div>
          <div class="qa-usage-row"><span>Jobs imported</span><span id="qa-use-imported">0/15</span></div>
          <div class="qa-usage-row"><span>Resumes tailored</span><span id="qa-use-tailored">0/5</span></div>
          <div class="qa-usage-row"><span>Cover letters generated</span><span id="qa-use-covers">0/2</span></div>
        </div>

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
          <div class="qa-plan-row"><div class="qa-plan-name">Starter</div><div><div class="qa-plan-price" id="qa-pr-s">€2.50</div><div class="qa-plan-period" id="qa-pp-s">/month</div></div></div>
          <div class="qa-plan-tagline">50 credits/month · 3 CV profiles</div>
          <div class="qa-plan-features"><div class="qa-feat"><span class="qa-feat-y">✓</span> 50 AI credits/month</div><div class="qa-feat"><span class="qa-feat-y">✓</span> 3 CV profiles + upload</div><div class="qa-feat"><span class="qa-feat-y">✓</span> ATS scoring</div><div class="qa-feat dim"><span class="qa-feat-n">✕</span> CV rewrite</div></div>
          <button class="qa-btn qa-btn-outline" id="qa-sel-starter">Get Starter →</button>
        </div>
        <div class="qa-plan-card highlighted popular">
          <div class="qa-plan-row"><div class="qa-plan-name" style="color:#16a34a">Pro</div><div><div class="qa-plan-price" style="color:#16a34a" id="qa-pr-p">€7.49</div><div class="qa-plan-period" id="qa-pp-p">/month</div></div></div>
          <div class="qa-plan-tagline">Unlimited credits · 10 CVs</div>
          <div class="qa-plan-features"><div class="qa-feat"><span class="qa-feat-y">✓</span> <strong>Unlimited AI credits</strong></div><div class="qa-feat"><span class="qa-feat-y">✓</span> 10 CV profiles + upload</div><div class="qa-feat"><span class="qa-feat-y">✓</span> CV rewrite to 100% match</div><div class="qa-feat"><span class="qa-feat-y">✓</span> Interview Q&amp;A prep</div></div>
          <button class="qa-btn qa-btn-green" id="qa-sel-pro">Get Pro →</button>
        </div>
        <div class="qa-plan-card">
          <div class="qa-plan-row"><div class="qa-plan-name" style="color:#92400e">Ultra</div><div><div class="qa-plan-price" style="color:#92400e" id="qa-pr-u">€14.99</div><div class="qa-plan-period" id="qa-pp-u">/month</div></div></div>
          <div class="qa-plan-tagline">Everything + power tools</div>
          <div class="qa-plan-features"><div class="qa-feat"><span class="qa-feat-y">✓</span> Unlimited CVs + bulk upload</div><div class="qa-feat"><span class="qa-feat-y">✓</span> Salary negotiation coach</div><div class="qa-feat"><span class="qa-feat-y">✓</span> LinkedIn optimizer</div><div class="qa-feat"><span class="qa-feat-y">✓</span> Priority support</div></div>
          <button class="qa-btn qa-btn-gold" id="qa-sel-ultra">Get Ultra →</button>
        </div>
      </div>
      <div class="qa-pay-section" id="qa-pay-section">
        <h3>💳 Complete Purchase</h3>
        <div class="qa-pay-summary">
          <div><div class="qa-pay-plan-name" id="qa-pay-nm">Pro Plan</div><div class="qa-pay-billing" id="qa-pay-bl">Billed monthly</div></div>
          <div class="qa-pay-price" id="qa-pay-pr">€7.49</div>
        </div>
        <div class="qa-field"><label>Full Name</label><input id="qa-pay-fullname" placeholder="Jane Doe"/></div>
        <div class="qa-field"><label>Email</label><input type="email" id="qa-pay-email" placeholder="jane@example.com"/></div>
        <div class="qa-card-box">
          <div class="qa-card-line"><label>Card</label><input id="qa-cn" placeholder="1234 5678 9012 3456" maxlength="19"/></div>
          <div class="qa-card-line"><label>Expires</label><input id="qa-ce" placeholder="MM / YY" maxlength="7" style="max-width:90px"/><label style="width:35px;padding-left:6px">CVC</label><input id="qa-cc" placeholder="123" maxlength="4" style="max-width:60px"/></div>
        </div>
        <!-- PROMO CODE ROW -->
        <div id="qa-promo-row" style="margin-bottom:12px">
          <div style="display:flex;gap:6px">
            <input id="qa-promo-input" placeholder="Promo / discount code" style="flex:1;padding:8px 10px;border:1px solid #e5e7eb;border-radius:8px;font-size:12px;outline:none;font-family:inherit"/>
            <button class="qa-btn qa-btn-outline" style="width:auto;padding:8px 14px;font-size:11px;white-space:nowrap" id="qa-apply-promo">Apply</button>
          </div>
          <div id="qa-promo-msg" style="font-size:11px;margin-top:5px;display:none"></div>
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
      ['qa-form-login','qa-form-signup','qa-form-forgot','qa-form-resetcode'].forEach(id => {
        const el = $(id); if (el) el.style.display = 'none';
      });
      const target = $('qa-form-'+name);
      if (target) target.style.display = 'block';
      $('qa-login-err').style.display = 'none';
    }
    $('qa-to-signup').addEventListener('click',  () => showForm('signup'));
    $('qa-to-login').addEventListener('click',   () => showForm('login'));
    $('qa-to-login2').addEventListener('click',   () => showForm('login'));
    $('qa-to-forgot-back') && $('qa-to-forgot-back').addEventListener('click', () => showForm('forgot'));
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
        if (tab.dataset.p === 'tracker')   loadTracker();
        if (tab.dataset.p === 'analytics')  loadAnalytics();
        if (tab.dataset.p === 'settings')   renderCVProfiles();
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
    $('qa-fetch-jd-btn').addEventListener('click', () => {
      $('qa-cv-jd').value = '';  // clear first so it refetches
      _cachedJD = '';
      fetchJobDescription(true, 'qa-cv-jd');
    });
    $('qa-clear-jd-btn') && $('qa-clear-jd-btn').addEventListener('click', () => {
      $('qa-cv-jd').value = '';
      _cachedJD = '';
      toast('Job description cleared', 'ok');
    });
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

    // Tracker tab filters
    sidebar.querySelectorAll('.qa-ttab').forEach(btn => {
      btn.addEventListener('click', () => {
        sidebar.querySelectorAll('.qa-ttab').forEach(b => b.classList.remove('qa-active'));
        btn.classList.add('qa-active');
        _trackerFilter = btn.dataset.status;
        loadTracker();
      });
    });

    // Tracker search
    $('qa-tracker-search') && $('qa-tracker-search').addEventListener('input', e => {
      _trackerSearch = e.target.value.trim();
      loadTracker();
    });

    // ── Settings sub-nav ─────────────────────────
    sidebar.querySelectorAll('.qa-snav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sidebar.querySelectorAll('.qa-snav-btn').forEach(b => b.classList.remove('qa-active'));
        sidebar.querySelectorAll('.qa-sec-body').forEach(s => s.style.display = 'none');
        btn.classList.add('qa-active');
        $('qa-sec-'+btn.dataset.sec).style.display = 'block';
        if (btn.dataset.sec === 'cvs') renderCVProfiles();
        if (btn.dataset.sec === 'billing') updateBillingSection();
        if (btn.dataset.sec === 'security') {
          chrome.storage.local.get(['qaUser','settings','apiKey'], (data) => {
            const qaUser = data.qaUser;
            if (qaUser) {
              const n = $('qa-sec-name'), e = $('qa-sec-email');
              if(n) n.textContent = (qaUser.firstName||'')+' '+(qaUser.lastName||'');
              if(e) e.textContent = qaUser.email||'';
            }
            // Show saved key (masked) and status
            const key = data.settings?.apiKey?.trim() || data.apiKey?.trim() || '';
            const akEl = $('qa-ak');
            const statusEl = $('qa-api-status');
            if (akEl && key) akEl.placeholder = key.substring(0,8) + '••••••••' + key.slice(-4);
            if (statusEl && key) {
              statusEl.textContent = '✅ Saved';
              statusEl.style.color = '#16a34a';
            } else if (statusEl) {
              statusEl.textContent = '⚠️ Not set';
              statusEl.style.color = '#f59e0b';
            }
          });
        }
      });
    });

    // ── Settings sections ─────────────────────────
    $('qa-save-btn').addEventListener('click', saveSettings);
    $('qa-save-prefs-btn').addEventListener('click', savePrefs);
    $('qa-reset-credits-btn') && $('qa-reset-credits-btn').addEventListener('click', () => {
      chrome.storage.local.set({ credits: PCFG.free.c, creditsDate: new Date().toDateString() }, () => {
        updateCreditUI();
        toast('Credits reset to ' + PCFG.free.c + '! ✓', 'ok');
      });
    });
    $('qa-clear-cache-btn') && $('qa-clear-cache-btn').addEventListener('click', () => {
      _cachedJD = '';
      const jdEls = ['qa-cv-jd','qa-jd'];
      jdEls.forEach(id => { const el = sidebar.querySelector('#'+id); if(el) el.value = ''; });
      toast('JD cache cleared. Reload on a job page to refetch.', 'ok');
    });
    $('qa-logout-btn').addEventListener('click', logout);
    $('qa-upgrade-billing-btn').addEventListener('click', openPricing);
    $('qa-refresh-sub-btn').addEventListener('click', () => { updateCreditUI(); updateBillingSection(); toast('Subscription status refreshed!','ok'); });
    $('qa-contact-support-btn').addEventListener('click', () => toast('Email support@quickapply.app for help','ok'));
    $('qa-cancel-sub-btn') && $('qa-cancel-sub-btn').addEventListener('click', () => {
      if(confirm('Cancel your subscription? You will lose access at end of billing period.')) {
        chrome.storage.local.set({plan:'free',credits:3},()=>{ updateCreditUI(); updateBillingSection(); toast('Subscription cancelled.','ok'); });
      }
    });
    $('qa-change-pw-btn').addEventListener('click', changePassword);
    $('qa-save-api-btn').addEventListener('click', () => {
      const key = $('qa-ak')?.value.trim();
      if (!key) { 
        const f=$('qa-api-flash'); 
        f.textContent='Please enter an API key first.'; 
        f.className='qa-flash qa-flash-err show';
        setTimeout(()=>f.classList.remove('show'),2500);
        return;
      }
      if (!key.startsWith('sk-ant')) {
        // Gemini keys start with AIza — just warn, still save
        const f=$('qa-api-flash');
        f.textContent='Anthropic keys start with sk-ant-... — check console.anthropic.com';
        f.className='qa-flash qa-flash-err show';
        setTimeout(()=>f.classList.remove('show'),3000);
      }
      chrome.storage.local.get('settings', ({settings}) => {
        const updated = {...(settings||{}), apiKey: key};
        // Save to BOTH locations for compatibility
        chrome.storage.local.set({ settings: updated, apiKey: key }, () => {
          const f=$('qa-api-flash'); 
          f.textContent='✓ API key saved! You can now use AI features.'; 
          f.className='qa-flash qa-flash-ok show';
          setTimeout(()=>f.classList.remove('show'),3000);
        });
      });
    });
    $('qa-test-api-btn') && $('qa-test-api-btn').addEventListener('click', async () => {
      const key = $('qa-ak')?.value.trim();
      if (!key) { toast('Enter an API key first.','warn'); return; }
      const btn = $('qa-test-api-btn');
      const flash = $('qa-api-flash');
      btn.disabled = true; btn.textContent = '⏳ Testing...';
      try {
        const result = await callClaude(key, 'Reply with exactly: OK', 10);
        flash.textContent = '✅ Anthropic key works! All AI features ready.';
        flash.className = 'qa-flash qa-flash-ok show';
        $('qa-api-status').textContent = '✅ Valid';
        $('qa-api-status').style.color = '#16a34a';
        // Auto-save if test passes
        chrome.storage.local.get('settings', ({settings}) => {
          chrome.storage.local.set({ settings: {...(settings||{}), apiKey: key}, apiKey: key });
        });
      } catch(e) {
        flash.textContent = '❌ ' + e.message;
        flash.className = 'qa-flash qa-flash-err show';
        $('qa-api-status').textContent = '❌ Invalid';
        $('qa-api-status').style.color = '#ef4444';
      }
      btn.disabled = false; btn.textContent = '🧪 Test Key';
      setTimeout(() => flash.classList.remove('show'), 5000);
    });

    $('qa-add-cv-btn').addEventListener('click', () => showCVForm(null));
    $('qa-cv-cancel-btn').addEventListener('click', hideCVForm);
    $('qa-cv-save-btn').addEventListener('click', saveCV);
    $('qa-browse-btn').addEventListener('click', () => $('qa-file-input').click());
    $('qa-file-input').addEventListener('change', handleFileUpload);

    // ── Empty state / manual entry ────────────────
    $('qa-empty-reload').addEventListener('click', () => { fetchJobDescription(true); populateHighlights(); });
    $('qa-manual-entry-btn').addEventListener('click', () => {
      $('qa-manual-form').style.display = $('qa-manual-form').style.display==='none'?'block':'none';
    });
    $('qa-manual-cancel').addEventListener('click', () => $('qa-manual-form').style.display='none');
    $('qa-manual-save').addEventListener('click', saveManualJob);

    // CV input tabs
    sidebar.querySelectorAll('.qa-cv-input-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        sidebar.querySelectorAll('.qa-cv-input-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        $('qa-cvt-paste-panel').style.display = btn.dataset.cvtab==='paste' ? 'block' : 'none';
        $('qa-cvt-upload-panel').style.display = btn.dataset.cvtab==='upload' ? 'block' : 'none';
      });
    });

    // Analytics period selector
    const periodSel = $('qa-period-sel');
    if (periodSel) periodSel.addEventListener('change', loadAnalytics);

    const zone = $('qa-upload-zone');
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.style.borderColor='#16a34a'; zone.style.background='#f0fdf4'; });
    zone.addEventListener('dragleave', () => { zone.style.borderColor=''; zone.style.background=''; });
    zone.addEventListener('drop', e => { e.preventDefault(); zone.style.borderColor=''; zone.style.background=''; if(e.dataTransfer.files[0]) handleFileUploadDirect(e.dataTransfer.files[0]); });

    // ── Pricing modal ────────────────────────────
    $('qa-cred-badge').addEventListener('click', openPricing);
    $('qa-plan-btn').addEventListener('click', openPricing);
    $('qa-pricing-close').addEventListener('click', closePricing);
    $('qa-renew-btn').addEventListener('click', openPricing);
    $('qa-setup-btn') && $('qa-setup-btn').addEventListener('click', () => {
      $('qa-setup-banner').style.display = 'none';
      // Navigate to Security tab
      sidebar.querySelectorAll('.qa-tab').forEach(t=>t.classList.remove('qa-active'));
      sidebar.querySelectorAll('.qa-panel').forEach(p=>p.classList.remove('qa-active'));
      sidebar.querySelector('[data-p="settings"]')?.classList.add('qa-active');
      sidebar.querySelector('#qa-p-settings')?.classList.add('qa-active');
      setTimeout(()=>{
        sidebar.querySelectorAll('.qa-snav-btn').forEach(b=>b.classList.remove('qa-active'));
        sidebar.querySelectorAll('.qa-sec-body').forEach(s=>s.style.display='none');
        sidebar.querySelector('[data-sec="security"]')?.classList.add('qa-active');
        const sec = sidebar.querySelector('#qa-sec-security');
        if(sec){ sec.style.display='block'; sec.querySelector('#qa-ak')?.focus(); }
      }, 100);
    });
    $('qa-setup-close') && $('qa-setup-close').addEventListener('click', () => {
      $('qa-setup-banner').style.display = 'none';
    });
    $('qa-bill-sw').addEventListener('click', toggleBilling);
    $('qa-b-mon').addEventListener('click', () => setBilling('monthly'));
    $('qa-b-ann').addEventListener('click', () => setBilling('annual'));
    $('qa-sel-starter').addEventListener('click', () => selectPlan('starter'));
    $('qa-sel-pro').addEventListener('click',     () => selectPlan('pro'));
    $('qa-sel-ultra').addEventListener('click',   () => selectPlan('ultra'));
    $('qa-pay-btn').addEventListener('click', processPayment);
    $('qa-apply-promo').addEventListener('click', applyPromoCode);
    $('qa-promo-input').addEventListener('keydown', e => { if(e.key==='Enter') applyPromoCode(); });
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
    // PRIORITY selectors — specific enough to avoid grabbing page headers
    const exactSels = [
      // LinkedIn
      '.jobs-description__content',
      '.jobs-description-content__text',
      '[class*="jobs-description__content"]',
      // Indeed
      '#jobDescriptionText',
      '.jobsearch-jobDescriptionText',
      '[data-testid="jobsearch-JobComponent-description"]',
      // Glassdoor
      '[class*="JobDetails_jobDescription"]',
      '[data-test="description"]',
      // Greenhouse
      '#content',
      '.job__description',
      // Lever
      '.section-wrapper-content',
      '[class*="posting-description"]',
      // Workday
      '[data-automation-id="jobPostingDescription"]',
      // Generic job boards
      '[class*="job-details__description"]',
      '[class*="jobDetailsSection"]',
      '[id*="job-details"]',
      '[class*="jobad-text"]',
      '[class*="job_ad"]',
      '[class*="stellenbeschreibung"]',  // German job sites
      '[class*="stellenanzeige"]',
      '[id*="description"]',
      '[class*="description__text"]',
      '[class*="jobDescriptionContent"]',
      '[class*="job-description-content"]',
      '[data-testid*="job-description"]',
    ];

    let jdText = '';
    for (const sel of exactSels) {
      try {
        const el = document.querySelector(sel);
        if (el && !el.closest('#qa-sidebar')) {
          const text = (el.innerText || el.textContent || '').trim();
          // Must be substantial content — at least 200 chars and NOT just a title
          if (text.length > 200 && text.split(' ').length > 30) {
            jdText = text.substring(0, 5000);
            break;
          }
        }
      } catch(e) {}
    }

    // Smart fallback: find the block with the most paragraph/list content
    // but EXCLUDE short header/meta blocks
    if (!jdText) {
      const candidates = Array.from(document.querySelectorAll('div, section, article'))
        .filter(el => {
          if (el.closest('#qa-sidebar')) return false;
          if (el.closest('nav') || el.closest('header') || el.closest('footer')) return false;
          // Skip elements that are likely job TITLE areas (too short)
          const text = (el.innerText || '').trim();
          if (text.length < 300) return false;
          // Prefer elements that contain bullet points (typical for JDs)
          const hasBullets = el.querySelectorAll('li, ul, ol').length > 2;
          const hasMultiPara = el.querySelectorAll('p, br').length > 3;
          return hasBullets || hasMultiPara;
        })
        .map(el => ({ el, score: (el.innerText||'').trim().length + el.querySelectorAll('li').length * 50 }))
        .sort((a, b) => b.score - a.score);

      if (candidates[0]) {
        jdText = (candidates[0].el.innerText || '').trim().substring(0, 5000);
      }
    }

    // Last resort: biggest text block (but must be > 500 chars to avoid titles)
    if (!jdText) {
      const blocks = Array.from(document.querySelectorAll('div, section'))
        .filter(el => !el.closest('#qa-sidebar') && !el.closest('nav') && !el.closest('header') && !el.closest('footer'))
        .map(el => ({ el, len: (el.innerText||'').trim().length }))
        .filter(x => x.len > 500)
        .sort((a,b) => b.len - a.len);
      if (blocks[0]) jdText = (blocks[0].el.innerText || '').trim().substring(0, 5000);
    }

    if (jdText) {
      _cachedJD = jdText;
      const targets = targetId ? [targetId] : ['qa-cv-jd','qa-jd'];
      targets.forEach(id => {
        const el = sidebar.querySelector('#' + id);
        // showFeedback=true means user clicked button — always override
        if (el && (showFeedback || !el.value)) el.value = jdText;
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
      if (nameEl) nameEl.textContent = cv ? cv.name : 'No CV — add one in Settings';
    });
  }

  // ════════════════════════════════════════════
  //  JOB HIGHLIGHTS (LetMeApply style)
  // ════════════════════════════════════════════
  function populateHighlights() {
    const jd = _cachedJD || '';
    const $ = id => sidebar.querySelector('#'+id);

    // Extract title from page
    let title = '';
    for (const sel of ['h1[class*="title"]','h1[class*="job"]','[class*="job-title"]:not(nav *)','h1']) {
      try { const el=document.querySelector(sel); if(el&&!el.closest('#qa-sidebar')&&el.textContent.trim().length>3){title=el.textContent.trim().replace(/\s[-|].*/,'').substring(0,90);break;} } catch(e){}
    }
    if (!title) title = document.title.replace(/\s[-|].*/,'').substring(0,90);

    // Extract company & location
    let company='', location='';
    for(const sel of ['[class*="company-name"]','[class*="companyName"]','[class*="employer"]','[class*="org-name"]']){try{const el=document.querySelector(sel);if(el&&!el.closest('#qa-sidebar')){company=el.textContent.trim().substring(0,50);break;}}catch(e){}}
    for(const sel of ['[class*="location"]:not(nav *):not(header *)','[class*="workplace"]','[class*="job-location"]']){try{const el=document.querySelector(sel);if(el&&!el.closest('#qa-sidebar')&&el.textContent.trim().length<60){location=el.textContent.trim().substring(0,50);break;}}catch(e){}}
    const jobType = jd.match(/full.?time|part.?time|contract|remote|hybrid/i)?.[0]||'';

    const hasJob = title && title.length > 3;

    // Show empty state OR job card
    const emptyEl = $('qa-empty-state');
    const cardEl  = $('qa-job-card');
    if (emptyEl) emptyEl.style.display = hasJob ? 'none' : 'flex';
    if (cardEl)  cardEl.style.display  = hasJob ? 'block' : 'none';

    if (!hasJob) return;

    // Populate job card
    const jcTitle = $('qa-jc-title');
    const jcMeta  = $('qa-jc-meta');
    if (jcTitle) jcTitle.textContent = title;
    if (jcMeta)  jcMeta.innerHTML = [company,location,jobType].filter(Boolean).map(s=>`<span class="qa-hl-tag">${s}</span>`).join('');

    // Skills
    if (jd) {
      const skills = ['JavaScript','TypeScript','Python','React','Node.js','Java','C++','C#','SQL','AWS','Azure','Docker','Kubernetes','Git','REST','GraphQL','API','SAP','CAP','OData','Groovy','CSS','HTML','Vue','Angular','Go','Swift','Kotlin','Ruby','PHP','MongoDB','PostgreSQL','MySQL','Redis','Terraform','CI/CD'];
      const found = skills.filter(s => new RegExp('\\b'+s.replace(/[+.]/g,'\\$&')+'\\b','i').test(jd)).slice(0,8);
      const wrap = $('qa-jc-skills-wrap');
      const pillsEl = $('qa-jc-skills');
      if (wrap && pillsEl && found.length) {
        pillsEl.innerHTML = found.map(s=>`<span class="qa-pill qa-pill-have">${s}</span>`).join('');
        wrap.style.display = 'block';
      }
    }

    // Key requirements
    if (jd) {
      const lines = jd.split('\n').map(l=>l.trim())
        .filter(l=>l.length>20&&l.length<160&&/you|experience|knowledge|degree|background|proficiency|familiar|ability/i.test(l))
        .slice(0,5);
      const wrap = $('qa-jc-quals-wrap');
      const qualsEl = $('qa-jc-quals');
      if (wrap && qualsEl && lines.length) {
        const show = lines.slice(0,3);
        const rest = lines.slice(3);
        qualsEl.innerHTML = show.map(l=>`<div class="qa-qual-item">• ${l.replace(/^[-•*]\s*/,'')}</div>`).join('');
        const expandEl = $('qa-jc-expand');
        if (rest.length && expandEl) {
          expandEl.style.display = 'inline-block';
          expandEl.textContent = `+${rest.length} more requirements`;
          expandEl.onclick = () => {
            qualsEl.innerHTML += rest.map(l=>`<div class="qa-qual-item">• ${l.replace(/^[-•*]\s*/,'')}</div>`).join('');
            expandEl.style.display = 'none';
          };
        }
        wrap.style.display = 'block';
      }
    }

    // Also update job bar at top
    const barTitle = sidebar.querySelector('#qa-job-title');
    const barMeta  = sidebar.querySelector('#qa-job-meta');
    if (barTitle) barTitle.textContent = title;
    if (barMeta)  barMeta.innerHTML = [company||PLATFORM, location].filter(Boolean).map(s=>`<span>${s}</span>`).join('<span class="qa-job-meta-dot"></span>');
  }

  // ─── saveManualJob ────────────────────────────
  function saveManualJob() {
    const $ = id => sidebar.querySelector('#'+id);
    const title   = $('qa-m-title')?.value.trim();
    const company = $('qa-m-company')?.value.trim();
    const jd      = $('qa-m-jd')?.value.trim();
    if (!title || !jd) { toast('Please enter a job title and description.','warn'); return; }
    _cachedJD = jd;
    // Populate into JD textareas
    ['qa-cv-jd','qa-jd'].forEach(id => { const el=$('#'+id); if(el&&!el.value) el.value=jd; });
    // Update job bar
    const barTitle = sidebar.querySelector('#qa-job-title');
    const barMeta  = sidebar.querySelector('#qa-job-meta');
    if (barTitle) barTitle.textContent = title;
    if (barMeta)  barMeta.innerHTML = company ? `<span>${company}</span>` : '';
    // Show job card, hide empty + form
    const emptyEl  = $('qa-empty-state');
    const cardEl   = $('qa-job-card');
    const formEl   = $('qa-manual-form');
    const jcTitle  = $('qa-jc-title');
    const jcMeta   = $('qa-jc-meta');
    if (emptyEl)  emptyEl.style.display = 'none';
    if (formEl)   formEl.style.display  = 'none';
    if (cardEl)   cardEl.style.display  = 'block';
    if (jcTitle)  jcTitle.textContent   = title;
    if (jcMeta)   jcMeta.innerHTML      = company ? `<span class="qa-hl-tag">${company}</span>` : '';
    toast('Job details saved! ✓','ok');
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
        if (!apiKey) { toast('Add your API key in Settings → Security tab','warn'); sidebar.querySelectorAll('.qa-tab').forEach(t=>t.classList.remove('qa-active')); sidebar.querySelectorAll('.qa-panel').forEach(p=>p.classList.remove('qa-active')); sidebar.querySelector('[data-p="settings"]')?.classList.add('qa-active'); sidebar.querySelector('#qa-p-settings')?.classList.add('qa-active'); setTimeout(()=>{ sidebar.querySelectorAll('.qa-snav-btn').forEach(b=>b.classList.remove('qa-active')); sidebar.querySelectorAll('.qa-sec-body').forEach(s=>s.style.display='none'); sidebar.querySelector('[data-sec="security"]')?.classList.add('qa-active'); const sec=sidebar.querySelector('#qa-sec-security'); if(sec){sec.style.display='block'; sec.querySelector('#qa-ak')?.focus();} },100); return; }
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
            if (!cvText || cvText.trim().length < 50) {
              toast('No CV text found. Go to Settings → My CVs and add your CV.','warn');
              if(tailorBtn){tailorBtn.disabled=false;tailorBtn.innerHTML='<span>✨</span><span>Tailor Resume</span><span class="qa-btn-hint">< 30 sec</span>';}
              if(bottomBtn){bottomBtn.disabled=false;bottomBtn.textContent='✨ Tailor Resume';}
              return;
            }
            // Detect if CV text is raw PDF binary (common mistake)
            const isPDFBinary = cvText.startsWith('%PDF') || cvText.includes('\x00') || (cvText.match(/[\x00-\x08\x0e-\x1f]/g)||[]).length > 10;
            if (isPDFBinary) {
              toast('Your CV contains raw PDF data. Please re-upload your CV or paste the text manually in Settings → My CVs.','warn');
              if(tailorBtn){tailorBtn.disabled=false;tailorBtn.innerHTML='<span>✨</span><span>Tailor Resume</span><span class="qa-btn-hint">< 30 sec</span>';}
              if(bottomBtn){bottomBtn.disabled=false;bottomBtn.textContent='✨ Tailor Resume';}
              return;
            }
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
      statusEl.textContent = '📄 Reading PDF...';
      const reader = new FileReader();
      reader.onload = async e => {
        // ── Method 1: Smart text extraction from PDF bytes ──────────────
        let extracted = '';
        try {
          const bytes = new Uint8Array(e.target.result);
          const str   = new TextDecoder('latin1').decode(bytes);

          // Try multiple PDF text extraction strategies
          const texts = [];

          // Strategy A: BT...ET blocks with Tj/TJ operators
          const btEtBlocks = str.matchAll(/BT([\s\S]*?)ET/g);
          for (const block of btEtBlocks) {
            // Tj operator: (text)Tj
            const tjMatches = block[1].matchAll(/\(([^)]{1,200})\)\s*Tj/g);
            for (const m of tjMatches) {
              const t = m[1].replace(/\\n/g,' ').replace(/\\r/g,'').replace(/\\/g,'').trim();
              if (t.length > 1) texts.push(t);
            }
            // TJ operator: [(text)spacing(text)]TJ
            const tjArrMatches = block[1].matchAll(/\[([^\]]*)\]\s*TJ/g);
            for (const m of tjArrMatches) {
              const parts = m[1].matchAll(/\(([^)]{1,200})\)/g);
              for (const p of parts) {
                const t = p[1].replace(/\\n/g,' ').replace(/\\/g,'').trim();
                if (t.length > 1) texts.push(t);
              }
            }
          }

          if (texts.length > 5) {
            extracted = texts.join(' ')
              .replace(/([a-z])([A-Z])/g, '$1 $2')  // fix merged words
              .replace(/\s{2,}/g, ' ')
              .trim()
              .substring(0, 8000);
          }

          // Strategy B: Find readable text runs (for compressed/encoded PDFs)
          if (!extracted || extracted.length < 100) {
            const readable = [];
            let run = '';
            for (let i = 0; i < bytes.length; i++) {
              const c = bytes[i];
              if (c >= 32 && c < 127) {
                run += String.fromCharCode(c);
              } else {
                if (run.length > 4) readable.push(run.trim());
                run = '';
              }
            }
            if (run.length > 4) readable.push(run.trim());
            // Filter: keep only runs that look like real words/sentences
            const filtered = readable
              .filter(r => /[a-zA-Z]{3,}/.test(r) && !/^[\d\s.]+$/.test(r))
              .join(' ')
              .replace(/\s+/g, ' ')
              .trim();
            if (filtered.length > extracted.length) extracted = filtered.substring(0, 8000);
          }
        } catch(parseErr) {
          console.warn('PDF parse error:', parseErr);
        }

        // ── Method 2: If extraction worked well — use it directly ────────
        if (extracted && extracted.length > 200 && /[a-zA-Z]{4,}/.test(extracted)) {
          // Clean up common PDF artifacts
          extracted = extracted
            .replace(/\b(cid:[0-9]+)\b/gi, '')
            .replace(/EMC|BDC|BMC|\bq\b|\bQ\b|\bcm\b|\bTm\b|\bTd\b|\bTf\b/g, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/([.!?])\s*([A-Z])/g, '$1\n$2')
            .trim();

          textEl.value = extracted;
          statusEl.innerHTML = `✅ <strong>${file.name}</strong> extracted — ${extracted.split(' ').length} words`;
          statusEl.style.color = '#16a34a';
          sidebar.querySelector('[data-cvtab="paste"]').click();
          toast('CV extracted! Review the text above and fix any errors.', 'ok');
          return;
        }

        // ── Method 3: Send PDF to Gemini Vision to extract text ──────────
        statusEl.textContent = '🤖 Asking Gemini to read your PDF...';
        getApiKey(async apiKey => {
          if (!apiKey) {
            // No API key — show manual paste option
            textEl.value = '';
            textEl.placeholder = 'PDF could not be auto-read. Please open your PDF, select all text (Ctrl+A), copy (Ctrl+C) and paste here.';
            statusEl.innerHTML = '⚠️ Could not extract PDF text automatically. <strong>Please paste your CV text manually.</strong>';
            statusEl.style.color = '#f59e0b';
            sidebar.querySelector('[data-cvtab="paste"]').click();
            return;
          }

          try {
            // Convert PDF to base64 and send to Gemini Vision
            const base64 = btoa(
              new Uint8Array(e.target.result).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            const res = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
              },
              body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 4000,
                messages: [{
                  role: 'user',
                  content: [
                    {
                      type: 'document',
                      source: {
                        type: 'base64',
                        media_type: 'application/pdf',
                        data: base64
                      }
                    },
                    {
                      type: 'text',
                      text: 'Extract ALL text from this CV/resume exactly as written. Output only the raw text content with proper line breaks. Do not add any commentary, headers, or formatting — just the extracted text.'
                    }
                  ]
                }]
              })
            });

            if (!res.ok) throw new Error('Anthropic vision API error: ' + res.status);
            const data = await res.json();
            const aiText = data.content?.[0]?.text || '';

            if (aiText && aiText.length > 100) {
              textEl.value = aiText.trim();
              statusEl.innerHTML = `✅ <strong>${file.name}</strong> read by AI — ${aiText.split(' ').length} words`;
              statusEl.style.color = '#16a34a';
              sidebar.querySelector('[data-cvtab="paste"]').click();
              toast('CV read by AI! ✓ Check the extracted text looks correct.', 'ok');
            } else {
              throw new Error('No text returned from AI');
            }
          } catch(aiErr) {
            console.warn('Gemini vision failed:', aiErr);
            textEl.value = '';
            textEl.placeholder = 'Could not auto-read this PDF. Please open your PDF, select all (Ctrl+A), copy (Ctrl+C) and paste here.';
            statusEl.innerHTML = '⚠️ Auto-read failed. <strong>Please paste your CV text manually in the box.</strong>';
            statusEl.style.color = '#f59e0b';
            sidebar.querySelector('[data-cvtab="paste"]').click();
            toast('Could not read PDF — please paste your CV text manually.', 'warn');
          }
        });
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    if (file.name.endsWith('.docx')) {
      // For DOCX: try to extract XML text content
      statusEl.textContent = '📄 Reading DOCX...';
      const reader2 = new FileReader();
      reader2.onload = async e2 => {
        try {
          // DOCX is a ZIP — try to find word/document.xml content
          const bytes = new Uint8Array(e2.target.result);
          const str   = new TextDecoder('latin1').decode(bytes);
          // Extract text from XML tags
          const xmlMatches = str.matchAll(/<w:t[^>]*>([^<]+)<\/w:t>/g);
          const words = [];
          for (const m of xmlMatches) words.push(m[1]);
          const extracted = words.join(' ').replace(/\s+/g,' ').trim();
          if (extracted && extracted.length > 100) {
            textEl.value = extracted;
            statusEl.innerHTML = `✅ <strong>${file.name}</strong> extracted — ${extracted.split(' ').length} words`;
            statusEl.style.color = '#16a34a';
            sidebar.querySelector('[data-cvtab="paste"]').click();
            toast('CV extracted from DOCX! ✓', 'ok');
          } else {
            throw new Error('Could not extract text');
          }
        } catch(e) {
          textEl.placeholder = 'Could not auto-read DOCX. Open in Word → Select All (Ctrl+A) → Copy (Ctrl+C) → Paste here.';
          statusEl.innerHTML = '⚠️ Please <strong>copy-paste text</strong> from your Word document.';
          statusEl.style.color = '#f59e0b';
          sidebar.querySelector('[data-cvtab="paste"]').click();
        }
      };
      reader2.readAsArrayBuffer(file);
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
        const map = {'qa-fn':'firstName','qa-ln':'lastName','qa-em':'email','qa-ph':'phone','qa-ci':'city','qa-st':'state','qa-zp':'zip','qa-li':'linkedin','qa-jt':'jobTitle','qa-sl':'salary','qa-ws':'website','qa-gh':'github','qa-exp':'experience'};
        Object.entries(map).forEach(([id,key]) => { const el=sidebar.querySelector('#'+id); if(el&&profile[key]) el.value=profile[key]; });
        updateAvatar(profile);
      }
      if (settings) {
        const tog = (id,val) => { const el=sidebar.querySelector('#'+id); if(el) el.classList.toggle('on',val); };
        tog('qa-tog-auto',    !!settings.autoFill);
        tog('qa-tog-track',   settings.trackApps!==false);
        tog('qa-tog-autofetch',settings.autoFetchJD!==false);
        if (settings.apiKey) { const el=sidebar.querySelector('#qa-ak'); if(el) el.value=settings.apiKey; }
      }
    });
    updateCVAnalyzeDropdown();
  }

  function saveSettings() {
    const profile = {};
    const map = {'qa-fn':'firstName','qa-ln':'lastName','qa-em':'email','qa-ph':'phone','qa-ci':'city','qa-st':'state','qa-zp':'zip','qa-li':'linkedin','qa-jt':'jobTitle','qa-sl':'salary','qa-ws':'website','qa-gh':'github','qa-exp':'experience'};
    Object.entries(map).forEach(([id,key]) => { const el=sidebar.querySelector('#'+id); if(el) profile[key]=el.value.trim(); });
    chrome.storage.local.set({ profile }, () => {
      const f = sidebar.querySelector('#qa-saved-flash');
      if (f) { f.classList.add('show'); setTimeout(()=>f.classList.remove('show'),2500); }
      updateAvatar(profile);
    });
  }

  function updateAvatar(profile) {
    const el = sidebar.querySelector('#qa-avatar-initials');
    if (!el) return;
    const fn = profile?.firstName||'', ln = profile?.lastName||'';
    el.textContent = (fn[0]||'')+(ln[0]||'') || 'QA';
  }

  // ════════════════════════════════════════════
  //  CREDITS + SUBSCRIPTION
  // ════════════════════════════════════════════
  const PCFG = { free:{c:10,daily:true}, starter:{c:200,daily:false}, pro:{c:9999999}, ultra:{c:9999999} };

  function getCredits(cb) {
    chrome.storage.local.get(['plan','credits','creditsDate'], data => {
      const plan = data.plan || 'free';
      const cfg  = PCFG[plan];
      const today = new Date().toDateString();
      let credits = data.credits;
      // Always reset daily credits for free plan on new day
      if (cfg.daily && data.creditsDate !== today) {
        credits = cfg.c;
        chrome.storage.local.set({ credits, creditsDate: today });
      } else if (credits == null || credits === undefined) {
        credits = cfg.c;
        chrome.storage.local.set({ credits, creditsDate: today });
      }
      cb(plan, Math.max(0, credits));
    });
  }

  function useCredit(cb) {
    getCredits((plan, credits) => {
      // Paid plans: always allow
      if (plan === 'pro' || plan === 'ultra' || plan === 'starter') { cb(true); return; }
      // Free plan: check credits
      if (credits <= 0) {
        // Auto-reset if date changed (safety net)
        const today = new Date().toDateString();
        chrome.storage.local.get('creditsDate', ({creditsDate}) => {
          if (creditsDate !== today) {
            chrome.storage.local.set({ credits: PCFG.free.c, creditsDate: today }, () => {
              updateCreditUI(); cb(true);
            });
          } else {
            cb(false);
          }
        });
        return;
      }
      chrome.storage.local.set({ credits: credits - 1 }, () => { updateCreditUI(); cb(true); });
    });
  }

  function updateCreditUI() {
    getCredits((plan, credits) => {
      const unlim = plan==='pro'||plan==='ultra';
      const maxC  = PCFG[plan]?.c||10;
      // Visual warning when low/empty
      const badge = sidebar.querySelector('#qa-cred-badge');
      if (badge) {
        badge.style.background = credits === 0 ? '#fee2e2' : '';
        badge.style.color = credits === 0 ? '#dc2626' : '';
        badge.style.borderColor = credits === 0 ? '#fca5a5' : '';
      }
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
      if (!ok) { toast('0 credits remaining. Credits reset daily at midnight — or upgrade for unlimited!','warn'); setTimeout(qaOpenPricing, 1500); return; }
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

  function navigateToAPIKey() {
    sidebar.querySelectorAll('.qa-tab').forEach(t=>t.classList.remove('qa-active'));
    sidebar.querySelectorAll('.qa-panel').forEach(p=>p.classList.remove('qa-active'));
    sidebar.querySelector('[data-p="settings"]')?.classList.add('qa-active');
    sidebar.querySelector('#qa-p-settings')?.classList.add('qa-active');
    setTimeout(() => {
      sidebar.querySelectorAll('.qa-snav-btn').forEach(b=>b.classList.remove('qa-active'));
      sidebar.querySelectorAll('.qa-sec-body').forEach(s=>s.style.display='none');
      sidebar.querySelector('[data-sec="security"]')?.classList.add('qa-active');
      const sec = sidebar.querySelector('#qa-sec-security');
      if (sec) { sec.style.display='block'; sec.querySelector('#qa-ak')?.focus(); }
    }, 100);
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
  // ── AI BACKEND: Anthropic Claude ──────────────────────────────────────────
  // Model: claude-haiku-4-5-20251001  (fast + affordable)
  // Get key at: console.anthropic.com → API Keys
  // New accounts get $5 free credit (~2,500+ actions)
  async function callClaude(apiKey, prompt, maxTokens) {
    if (!apiKey || apiKey.length < 20) {
      throw new Error('No API key found. Go to Settings → Security and add your Anthropic key.');
    }

    let res;
    try {
      res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: maxTokens || 1000,
          messages: [{ role: 'user', content: prompt }]
        })
      });
    } catch(netErr) {
      throw new Error('Network error — check your internet connection.');
    }

    if (!res.ok) {
      let msg = 'API error ' + res.status;
      try {
        const d = await res.json();
        if (d.error?.message) msg = d.error.message;
        if (res.status === 401) msg = 'Invalid API key. Check Settings → Security.';
        if (res.status === 403) msg = 'Account needs billing setup at console.anthropic.com/settings/billing';
        if (res.status === 429) msg = 'Rate limit hit. Wait a moment and try again.';
      } catch(e) {}
      throw new Error(msg);
    }

    const d = await res.json();
    if (d.error) throw new Error(d.error.message);
    return d.content?.[0]?.text || '';
  }
  function getApiKey(cb) {
    // Check both storage locations for backward compatibility
    chrome.storage.local.get(['settings', 'apiKey'], (data) => {
      const key = data.settings?.apiKey?.trim() || data.apiKey?.trim() || '';
      cb(key);
    });
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
        if (!apiKey) { toast('Add your API key in Settings → Security tab','warn'); sidebar.querySelectorAll('.qa-tab').forEach(t=>t.classList.remove('qa-active')); sidebar.querySelectorAll('.qa-panel').forEach(p=>p.classList.remove('qa-active')); sidebar.querySelector('[data-p="settings"]')?.classList.add('qa-active'); sidebar.querySelector('#qa-p-settings')?.classList.add('qa-active'); setTimeout(()=>{ sidebar.querySelectorAll('.qa-snav-btn').forEach(b=>b.classList.remove('qa-active')); sidebar.querySelectorAll('.qa-sec-body').forEach(s=>s.style.display='none'); sidebar.querySelector('[data-sec="security"]')?.classList.add('qa-active'); const sec=sidebar.querySelector('#qa-sec-security'); if(sec){sec.style.display='block'; sec.querySelector('#qa-ak')?.focus();} },100); return; }
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
    const jd = sidebar.querySelector('#qa-cv-jd')?.value.trim() || _cachedJD;
    if (!jd || jd.length < 50) {
      toast('Please fetch or paste the job description first!', 'warn');
      const fetchBtn = sidebar.querySelector('#qa-fetch-jd-btn');
      if (fetchBtn) { fetchBtn.style.background='#fef9c3'; setTimeout(()=>fetchBtn.style.background='',2000); }
      return;
    }
    const cvId = sidebar.querySelector('#qa-cv-pick-analyze')?.value;
    getCVs(async cvs => {
      const cv = cvId ? cvs.find(c=>c.id===cvId) : cvs.find(c=>c.isDefault) || cvs[0];
      if (!cv?.text || cv.text.trim().length < 20) {
        toast('No CV text found. Go to Settings → My CVs and paste your CV text.', 'warn');
        return;
      }
      getApiKey(async apiKey => {
        if (!apiKey) {
          toast('API key missing — go to Settings → Security to add it.', 'warn');
          // Auto-navigate to security tab
          sidebar.querySelectorAll('.qa-tab').forEach(t=>t.classList.remove('qa-active'));
          sidebar.querySelectorAll('.qa-panel').forEach(p=>p.classList.remove('qa-active'));
          sidebar.querySelector('[data-p="settings"]')?.classList.add('qa-active');
          sidebar.querySelector('#qa-p-settings')?.classList.add('qa-active');
          setTimeout(()=>{
            sidebar.querySelectorAll('.qa-snav-btn').forEach(b=>b.classList.remove('qa-active'));
            sidebar.querySelectorAll('.qa-sec-body').forEach(s=>s.style.display='none');
            sidebar.querySelector('[data-sec="security"]')?.classList.add('qa-active');
            const sec = sidebar.querySelector('#qa-sec-security');
            if(sec){ sec.style.display='block'; sec.querySelector('#qa-ak')?.focus(); }
          }, 100);
          return;
        }
        const btn = sidebar.querySelector('#qa-analyze-btn');
        btn.disabled = true; btn.innerHTML = '⏳ Analyzing...';

        const cvSnippet = cv.text.substring(0, 3000);
        const jdSnippet = jd.substring(0, 2000);
        const prompt = `You are an ATS scoring expert. Analyze this resume against the job description.
Reply with ONLY a JSON object (no markdown, no explanation):
{"score": 72, "verdict": "Good Match", "missing_keywords": ["keyword1","keyword2","keyword3"], "present_keywords": ["found1","found2","found3"]}

Score 0-100 based on keyword match, skills alignment and experience relevance.
Verdicts: "Excellent Match" (85+), "Good Match" (65-84), "Partial Match" (45-64), "Poor Match" (<45)

RESUME:
${cvSnippet}

SKILLS FROM CV: ${cv.skills || 'not specified'}

JOB DESCRIPTION:
${jdSnippet}`;

        try {
          const raw = await callClaude(apiKey, prompt, 700);
          // Parse JSON - handle various formats Claude might return
          let parsed;
          try {
            const clean = raw.replace(/```json|```/g,'').trim();
            // Extract JSON object if wrapped in text
            const match = clean.match(/\{[\s\S]*\}/);
            parsed = JSON.parse(match ? match[0] : clean);
          } catch(pe) {
            throw new Error('Could not parse AI response. Try again.');
          }
          _cvProfile = cv; _cvJD = jd; _cvApiKey = apiKey;
          _cvMissing = parsed.missing_keywords || [];
          renderATS(parsed);
          toast('Analysis complete! ✓', 'ok');
        } catch(e) {
          toast('Analysis failed: ' + e.message, 'err');
          console.error('ATS analysis error:', e);
        }
        btn.disabled = false; btn.innerHTML = '📊 Analyze & Score';
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
  const STATUSES = ['applied','interview','offer','rejected','archived'];
  const STAT_LBL = { applied:'APPLIED', interview:'INTERVIEWING', offer:'OFFER RECEIVED', rejected:'REJECTED', archived:'ARCHIVED' };
  const STAT_COLOR = { applied:'#16a34a', interview:'#2563eb', offer:'#9333ea', rejected:'#ef4444', archived:'#9ca3af' };
  let _trackerFilter = 'all';
  let _trackerSearch = '';

  function loadTracker() {
    chrome.storage.local.get('applications', ({ applications }) => {
      const apps = applications || [];
      const favs = apps.filter(a => a.favorite);

      // Update tab counts
      const $ = id => sidebar.querySelector('#' + id);
      if ($('qa-tc-all'))  $('qa-tc-all').textContent  = apps.filter(a=>!a.status||a.status==='applied').length;
      if ($('qa-tc-int'))  $('qa-tc-int').textContent  = apps.filter(a=>a.status==='interview').length;
      if ($('qa-tc-off'))  $('qa-tc-off').textContent  = apps.filter(a=>a.status==='offer').length;
      if ($('qa-tc-rej'))  $('qa-tc-rej').textContent  = apps.filter(a=>a.status==='rejected').length;
      if ($('qa-tc-fav'))  $('qa-tc-fav').textContent  = favs.length;

      // Filter by tab
      let filtered = apps.slice();
      if (_trackerFilter === 'all')        filtered = apps.filter(a => !a.status || a.status === 'applied');
      else if (_trackerFilter === 'favorites') filtered = apps.filter(a => a.favorite);
      else                                  filtered = apps.filter(a => a.status === _trackerFilter);

      // Apply search
      if (_trackerSearch) {
        const q = _trackerSearch.toLowerCase();
        filtered = filtered.filter(a =>
          (a.title||'').toLowerCase().includes(q) ||
          (a.company||'').toLowerCase().includes(q) ||
          (a.location||'').toLowerCase().includes(q)
        );
      }

      const list = sidebar.querySelector('#qa-jlist');
      if (!filtered.length) {
        list.innerHTML = `<div class="qa-empty">${apps.length ? 'No applications match this filter.' : 'No applications yet. Start applying! 🎯'}</div>`;
        return;
      }

      // Render as LetMeApply table rows
      list.innerHTML = filtered.slice().reverse().map((app, i) => {
        const realIdx = apps.indexOf(app);
        const s   = app.status || 'applied';
        const dt  = new Date(app.date).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
        const time = new Date(app.date).toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });
        const isFav = app.favorite ? '⭐' : '🤍';
        const url = app.url ? `href="${app.url}" target="_blank"` : '';
        const stageOpts = Object.entries(STAT_LBL).map(([v,l]) =>
          `<option value="${v}" ${v===s?'selected':''}>${l}</option>`
        ).join('');
        return `<div class="qa-tracker-row">
          <div class="qa-tr-main">
            <div class="qa-tr-fav" data-idx="${realIdx}">${isFav}</div>
            <div class="qa-tr-info">
              <a class="qa-tr-title" ${url}>${app.title || 'Job Application'}</a>
              <div class="qa-tr-meta">${app.company||''} ${app.location?'· '+app.location:''}</div>
            </div>
          </div>
          <div class="qa-tr-date">
            <div style="color:#16a34a;font-size:10px;font-weight:600;background:#f0fdf4;padding:3px 8px;border-radius:20px;white-space:nowrap">${dt}, ${time}</div>
          </div>
          <div class="qa-tr-stage">
            <select class="qa-stage-sel" data-idx="${realIdx}" style="border-color:${STAT_COLOR[s]}20;color:${STAT_COLOR[s]}">
              ${stageOpts}
            </select>
          </div>
        </div>`;
      }).join('');

      // Wire favorite toggles
      list.querySelectorAll('.qa-tr-fav').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.idx);
          const a2  = [...apps];
          a2[idx].favorite = !a2[idx].favorite;
          chrome.storage.local.set({ applications: a2 }, loadTracker);
        });
      });

      // Wire stage dropdowns
      list.querySelectorAll('.qa-stage-sel').forEach(sel => {
        sel.addEventListener('change', () => {
          const idx = parseInt(sel.dataset.idx);
          const a2  = [...apps];
          a2[idx].status = sel.value;
          sel.style.color      = STAT_COLOR[sel.value] || '#374151';
          sel.style.borderColor = (STAT_COLOR[sel.value]||'#e5e7eb') + '40';
          chrome.storage.local.set({ applications: a2 }, () => {
            loadTracker();
            updateStats();
          });
        });
      });
    });
  }

  function clearTracker() {
    if (confirm('Clear all application history? Cannot be undone.'))
      chrome.storage.local.remove('applications', loadTracker);
  }

  // ════════════════════════════════════════════
  //  PRICING + PAYMENT
  // ════════════════════════════════════════════
  let billing='monthly', selectedPlan=null;
  const PRICES={monthly:{starter:'€2.50',pro:'€7.49',ultra:'€14.99'},annual:{starter:'€1.99',pro:'€5.99',ultra:'€11.99'}};

  // ══════════════════════════════════════════════════════
  //  PROMO CODE SYSTEM
  //  ─────────────────────────────────────────────────────
  //  To add a new promo code, just add an entry here:
  //
  //  'CODE': {
  //    discount: 0.50,          // 50% off (0.20 = 20%, 1.0 = 100% free)
  //    freeCredits: 100,        // bonus credits granted immediately
  //    plan: 'pro',             // auto-upgrade to this plan (optional)
  //    planDays: 30,            // how many days the free plan lasts
  //    description: '50% off',  // shown to user
  //    oneTime: true,           // if true, can only be used once per account
  //    expiresAt: null,         // set to Date.now() + ms to expire, or null = never
  //  }
  // ══════════════════════════════════════════════════════
  const PROMO_CODES = {
    // 🎁 Launch discount — 50% off for early users
    'LAUNCH50': {
      discount:    0.50,
      description: '50% off your first month!',
      oneTime:     true,
      expiresAt:   null
    },
    // 🆓 Give someone a free month of Pro
    'FREEPRO30': {
      discount:    1.00,
      plan:        'pro',
      planDays:    30,
      freeCredits: 9999999,
      description: '1 month of Pro — FREE!',
      oneTime:     true,
      expiresAt:   null
    },
    // 💰 Permanent 20% off — for partners/affiliates
    'PARTNER20': {
      discount:    0.20,
      description: '20% off — partner discount',
      oneTime:     false,
      expiresAt:   null
    },
    // 🎓 Student discount
    'STUDENT': {
      discount:    0.40,
      freeCredits: 50,
      description: '40% off + 50 bonus credits',
      oneTime:     true,
      expiresAt:   null
    },
    // 👑 VIP users — free unlimited forever
    'VIP2025': {
      discount:    1.00,
      plan:        'ultra',
      planDays:    365,
      freeCredits: 9999999,
      description: 'VIP — 1 year Ultra FREE',
      oneTime:     true,
      expiresAt:   null
    },
    // 🧪 Testing — always works
    'TEST100': {
      discount:    1.00,
      freeCredits: 999,
      description: 'Test code — 100% off + 999 credits',
      oneTime:     false,
      expiresAt:   null
    }
  };

  let _activePromo = null;   // currently applied promo

  function applyPromoCode() {
    const input = sidebar.querySelector('#qa-promo-input');
    const msgEl = sidebar.querySelector('#qa-promo-msg');
    const priceEl = sidebar.querySelector('#qa-pay-pr');
    if (!input || !msgEl) return;

    const code = input.value.trim().toUpperCase();
    if (!code) {
      showPromoMsg('Enter a promo code first.', false);
      return;
    }

    const promo = PROMO_CODES[code];
    if (!promo) {
      showPromoMsg('❌ Invalid code. Check spelling and try again.', false);
      _activePromo = null;
      restoreOriginalPrice();
      return;
    }

    // Check expiry
    if (promo.expiresAt && Date.now() > promo.expiresAt) {
      showPromoMsg('❌ This promo code has expired.', false);
      return;
    }

    // Check one-time use
    if (promo.oneTime) {
      chrome.storage.local.get('usedPromos', ({ usedPromos }) => {
        const used = usedPromos || [];
        if (used.includes(code)) {
          showPromoMsg('❌ You have already used this code.', false);
          return;
        }
        applyPromoToUI(code, promo, priceEl, msgEl);
      });
    } else {
      applyPromoToUI(code, promo, priceEl, msgEl);
    }
  }

  function applyPromoToUI(code, promo, priceEl, msgEl) {
    _activePromo = { code, ...promo };

    // If it's a 100% discount or free plan upgrade — handle immediately
    if (promo.discount >= 1.0) {
      if (priceEl) priceEl.textContent = '€0.00';
      showPromoMsg('✅ ' + promo.description, true);

      // If it grants a free plan with no payment needed
      if (promo.plan && promo.planDays) {
        const grantBtn = sidebar.querySelector('#qa-pay-btn');
        if (grantBtn) {
          grantBtn.textContent = '🎁 Activate Free Plan';
          grantBtn.style.background = '#16a34a';
        }
      }
      return;
    }

    // Partial discount — update displayed price
    if (selectedPlan && priceEl) {
      const raw = PRICES[billing][selectedPlan].replace('€','');
      const original = parseFloat(raw);
      const discounted = (original * (1 - promo.discount)).toFixed(2);
      priceEl.innerHTML = `<span style="text-decoration:line-through;opacity:0.5;font-size:14px">€${raw}</span> <span style="color:#16a34a">€${discounted}</span>`;
    }
    showPromoMsg('✅ ' + promo.description, true);
  }

  function restoreOriginalPrice() {
    const priceEl = sidebar.querySelector('#qa-pay-pr');
    if (priceEl && selectedPlan) priceEl.textContent = PRICES[billing][selectedPlan];
    const btn = sidebar.querySelector('#qa-pay-btn');
    if (btn) { btn.textContent = '🔒 Subscribe Now'; btn.style.background = ''; }
  }

  function showPromoMsg(msg, ok) {
    const el = sidebar.querySelector('#qa-promo-msg');
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
    el.style.color = ok ? '#16a34a' : '#ef4444';
    el.style.fontWeight = '600';
  }
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

    // Handle 100% free promo (no Stripe needed)
    if (_activePromo?.discount >= 1.0 && _activePromo?.plan) {
      const freeCredits = _activePromo.freeCredits || 9999999;
      const planDays = _activePromo.planDays || 30;
      const subEnd = Date.now() + planDays * 24*60*60*1000;
      // Mark promo as used
      chrome.storage.local.get('usedPromos', ({usedPromos}) => {
        const used = usedPromos || [];
        if (!used.includes(_activePromo.code)) used.push(_activePromo.code);
        chrome.storage.local.set({
          usedPromos: used,
          plan: _activePromo.plan,
          credits: freeCredits,
          creditsDate: new Date().toDateString(),
          subscriptionEnd: subEnd
        }, () => {
          updateCreditUI(); checkRenewal(); updateBillingSection();
          showPayMsg('🎉 ' + _activePromo.description + ' — Plan activated!', true);
          setTimeout(() => closePricing(), 3000);
          toast('🎁 ' + _activePromo.plan.toUpperCase() + ' plan activated!', 'ok');
          _activePromo = null;
        });
      });
      btn.disabled = false; btn.textContent = '🔒 Subscribe Now';
      return;
    }

    try {
      const promoCode = _activePromo?.code || null;
      const res=await fetch(SERVER+'/api/create-subscription',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({card:{number:cardNum,exp_month:parts[0],exp_year:parts[1]?'20'+parts[1]:'',cvc},plan:selectedPlan,billing,email,name,promoCode,extensionUserId:chrome.runtime?.id||'ext'})
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

  // ── changePassword ──────────────────────────
  function changePassword() {
    const $ = id => sidebar.querySelector('#'+id);
    const cur  = $('qa-pw-cur')?.value;
    const nw   = $('qa-pw-new')?.value;
    const nw2  = $('qa-pw-new2')?.value;
    const flash = $('qa-pw-flash');
    const showMsg = (msg,ok) => { if(flash){flash.textContent=msg; flash.className='qa-flash '+(ok?'qa-flash-ok':'qa-flash-err')+' show'; setTimeout(()=>flash.classList.remove('show'),3000);} };
    if (!cur||!nw||!nw2) { showMsg('Please fill in all fields.',false); return; }
    if (nw.length<8)     { showMsg('New password must be at least 8 characters.',false); return; }
    if (nw!==nw2)        { showMsg('Passwords do not match.',false); return; }
    chrome.storage.local.get(['qaUser','qaAccounts'], ({qaUser,qaAccounts}) => {
      if (!qaUser) return;
      const accounts = qaAccounts||{};
      const key = btoa(qaUser.email.toLowerCase());
      const stored = accounts[key];
      if (!stored)               { showMsg('Account not found.',false); return; }
      if (stored.passHash!==btoa(cur)) { showMsg('Current password is incorrect.',false); return; }
      stored.passHash = btoa(nw);
      accounts[key] = stored;
      chrome.storage.local.set({qaAccounts:accounts}, () => {
        showMsg('Password updated successfully! ✓',true);
        $('qa-pw-cur').value=''; $('qa-pw-new').value=''; $('qa-pw-new2').value='';
      });
    });
  }

  // ── savePrefs ────────────────────────────────
  function savePrefs() {
    const $ = id => sidebar.querySelector('#'+id);
    const settings = {
      autoFill:    $('qa-tog-auto')?.classList.contains('on'),
      trackApps:   $('qa-tog-track')?.classList.contains('on'),
      autoFetchJD: $('qa-tog-autofetch')?.classList.contains('on'),
    };
    chrome.storage.local.get('settings', ({settings:old}) => {
      chrome.storage.local.set({settings:{...(old||{}), ...settings}}, () => {
        const f=$('qa-prefs-flash'); if(f){f.classList.add('show'); setTimeout(()=>f.classList.remove('show'),2500);}
      });
    });
  }

  // ── updateBillingSection ─────────────────────
  function updateBillingSection() {
    const $ = id => sidebar.querySelector('#'+id);
    chrome.storage.local.get(['plan','subscriptionEnd','credits'], ({plan,subscriptionEnd,credits}) => {
      const planNames  = {free:'Free Plan',starter:'Starter Plan',pro:'Pro Plan',ultra:'Ultra Plan'};
      const planDescs  = {
        free:    'Unlock unlimited access to all features with our paid plans.',
        starter: '50 AI credits/month · 3 CV profiles · ATS scoring',
        pro:     'Unlimited AI credits · 10 CV profiles · CV rewrite · Interview prep',
        ultra:   'Everything in Pro plus salary coach, LinkedIn optimizer & priority support'
      };
      const nm = $('qa-bp-name');
      const dc = $('qa-bp-desc');
      const ub = $('qa-upgrade-billing-btn');
      const pi = $('qa-paid-info');
      const sd = $('qa-sub-details');
      if (nm) { nm.textContent = planNames[plan||'free']; nm.style.color = plan&&plan!=='free'?'#16a34a':'#16a34a'; }
      if (dc) dc.textContent = planDescs[plan||'free'];
      if (ub) { ub.style.display = (!plan||plan==='free')?'flex':'none'; }
      if (pi) {
        pi.style.display = (plan&&plan!=='free')?'block':'none';
        if (plan&&plan!=='free'&&sd) {
          const expDate = subscriptionEnd ? new Date(subscriptionEnd).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}) : 'N/A';
          const daysLeft = subscriptionEnd ? Math.ceil((subscriptionEnd-Date.now())/(1000*60*60*24)) : 0;
          sd.innerHTML = `Plan: <strong>${planNames[plan]}</strong><br>Status: <span style="color:#16a34a;font-weight:700">● Active</span><br>Renews: ${expDate}<br>Days remaining: <strong>${daysLeft}</strong>`;
        }
      }
    });
  }

  // ════════════════════════════════════════════
  //  ANALYTICS
  // ════════════════════════════════════════════
  function loadAnalytics() {
    chrome.storage.local.get(['applications','qaTailorCount','qaCoverCount','qaViewCount'], data => {
      const apps     = data.applications || [];
      const now      = Date.now();
      const day30    = now - 30*24*60*60*1000;
      const day7     = now - 7*24*60*60*1000;

      const allTime  = apps.length;
      const monthly  = apps.filter(a => a.date >= day30).length;
      const weekly   = apps.filter(a => a.date >= day7).length;

      const $ = id => sidebar.querySelector('#'+id);
      if($('qa-ov-all'))   $('qa-ov-all').textContent   = allTime;
      if($('qa-ov-month')) $('qa-ov-month').textContent = monthly;
      if($('qa-ov-week'))  $('qa-ov-week').textContent  = weekly;

      // Calendar: current month
      const now2   = new Date();
      const year   = now2.getFullYear();
      const month  = now2.getMonth();
      const daysInMonth = new Date(year, month+1, 0).getDate();
      const firstDay    = new Date(year, month, 1).getDay(); // 0=Sun

      // Count apps per day this month
      const dayCount = {};
      apps.filter(a => {
        const d = new Date(a.date);
        return d.getFullYear()===year && d.getMonth()===month;
      }).forEach(a => {
        const day = new Date(a.date).getDate();
        dayCount[day] = (dayCount[day]||0) + 1;
      });

      // Build calendar HTML
      const monthName = now2.toLocaleString('default',{month:'long'});
      const calEl = $('qa-activity-cal');
      if (!calEl) return;

      const colors = ['#e5e7eb','#bbf7d0','#4ade80','#16a34a','#14532d'];
      const getColor = n => n===0?colors[0]:n===1?colors[1]:n===2?colors[2]:n===3?colors[3]:colors[4];

      let html = `<div class="qa-cal-month">${monthName} ${year}</div>`;
      html += '<div class="qa-cal-grid">';
      // Day headers
      ['S','M','T','W','T','F','S'].forEach(d => { html += `<div class="qa-cal-dh">${d}</div>`; });
      // Empty cells before first day
      for (let i=0; i<firstDay; i++) html += '<div class="qa-cal-cell qa-cal-empty"></div>';
      // Day cells
      for (let d=1; d<=daysInMonth; d++) {
        const count = dayCount[d]||0;
        const isToday = d===now2.getDate();
        const bg = isToday ? '#16a34a' : getColor(count);
        const textColor = isToday ? '#fff' : count>1 ? '#fff' : '#374151';
        html += `<div class="qa-cal-cell" style="background:${bg};color:${textColor}" title="${d} ${monthName}: ${count} applied">${d}</div>`;
      }
      html += '</div>';
      calEl.innerHTML = html;

      // Calendar footer stats
      const calApplied = apps.filter(a => { const d=new Date(a.date); return d.getFullYear()===year&&d.getMonth()===month; }).length;
      const calViewed  = (data.qaViewCount||0);
      if($('qa-cal-viewed'))  $('qa-cal-viewed').textContent  = calViewed;
      if($('qa-cal-applied')) $('qa-cal-applied').textContent = calApplied;

      // Usage stats
      const tailored = data.qaTailorCount||0;
      const covers   = data.qaCoverCount||0;
      chrome.storage.local.get('plan', ({plan}) => {
        const limits = {free:{jobs:15,tailored:5,covers:2},starter:{jobs:50,tailored:20,covers:10},pro:{jobs:999,tailored:999,covers:999},ultra:{jobs:999,tailored:999,covers:999}};
        const lim = limits[plan||'free'];
        if($('qa-use-imported'))  $('qa-use-imported').textContent  = `${allTime}/${lim.jobs}`;
        if($('qa-use-tailored'))  $('qa-use-tailored').textContent  = `${tailored}/${lim.tailored}`;
        if($('qa-use-covers'))    $('qa-use-covers').textContent    = `${covers}/${lim.covers}`;
      });

      // Trend chart (simple canvas bar chart - last 30 days)
      drawTrendChart(apps, now);
    });
  }

  function drawTrendChart(apps, now) {
    const canvas = sidebar.querySelector('#qa-trend-canvas');
    if (!canvas) return;
    const parent = canvas.parentElement;
    canvas.width  = parent.clientWidth || 360;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Last 14 days data
    const days = 14;
    const applied = [], viewed = [], labels = [];
    for (let i=days-1; i>=0; i--) {
      const d = new Date(now - i*24*60*60*1000);
      const ds = d.toDateString();
      applied.push(apps.filter(a => new Date(a.date).toDateString()===ds).length);
      // Simulate viewed as slightly more than applied
      viewed.push(apps.filter(a => new Date(a.date).toDateString()===ds).length + Math.floor(Math.random()*0));
      labels.push(d.getDate());
    }

    const maxVal = Math.max(...applied, ...viewed, 1);
    const W = canvas.width, H = canvas.height;
    const padL=8, padR=8, padT=10, padB=20;
    const chartW = W-padL-padR;
    const chartH = H-padT-padB;
    const step   = chartW / (days-1);

    const drawLine = (data, color, dotColor) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      data.forEach((v,i) => {
        const x = padL + i*step;
        const y = padT + chartH - (v/maxVal)*chartH;
        if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      });
      ctx.stroke();
      // Dots
      data.forEach((v,i) => {
        const x = padL + i*step;
        const y = padT + chartH - (v/maxVal)*chartH;
        ctx.beginPath();
        ctx.arc(x,y,3,0,Math.PI*2);
        ctx.fillStyle = dotColor;
        ctx.fill();
      });
    };

    // Grid lines
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    [0,1,2,3,4].forEach(i => {
      const y = padT + (i/4)*chartH;
      ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(W-padR,y); ctx.stroke();
    });

    // Labels (every 3rd day)
    ctx.fillStyle = '#9ca3af';
    ctx.font = '8px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    labels.forEach((l,i) => {
      if (i%3===0) ctx.fillText(l, padL+i*step, H-5);
    });

    drawLine(viewed, '#f59e0b', '#f59e0b');
    drawLine(applied, '#16a34a', '#16a34a');
  }

  // SPA nav support
  let lastUrl=location.href;
  new MutationObserver(()=>{ if(location.href!==lastUrl){lastUrl=location.href;setTimeout(()=>{detectJob();fetchJobDescription(false);},1800);} }).observe(document.documentElement,{subtree:true,childList:true});

})();
