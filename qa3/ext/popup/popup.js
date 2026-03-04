
'use strict';
// ════════════════════════════════════════════════════════════
//  QuickApply v3 — popup.js  (Real Stripe Payments)
// ════════════════════════════════════════════════════════════

// ── CONFIG ───────────────────────────────────────────────────
// Update SERVER_URL after deploying your backend
const SERVER_URL    = 'https://quick-apply-ysbb.onrender.com'; // ← change this
const STRIPE_PK     = 'pk_test_51T7At0ICZKAj7VsM8EKGu2uSieCYeWjHsTLzfz0wkGRAcJlBu4ZpniP3t5kBXLNoVGaYihqaQdx0brwY2tPRj8R000R4vJjhxx'; // ← change this

// ── Stripe handled via server (MV3 blocks external scripts) ─────────────
// Card details collected manually and sent to backend which uses Stripe API
function initStripe() { /* no-op in MV3 */ }

// ── Tab Navigation ────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
    if (tab.dataset.tab === 'tracker')  loadTracker();
    if (tab.dataset.tab === 'settings') loadSettings();
    if (tab.dataset.tab === 'apply')    updateCreditUI();
  });
});

// ── Profile ───────────────────────────────────────────────────
const PROFILE_FIELDS = [
  'firstName','lastName','email','phone','city','state','zip',
  'linkedin','website','github','jobTitle','experience',
  'salary','education','skills','summary'
];

function loadProfile() {
  chrome.storage.local.get('profile', ({ profile }) => {
    if (!profile) return;
    PROFILE_FIELDS.forEach(id => {
      const el = document.getElementById(id);
      if (el && profile[id] !== undefined) el.value = profile[id];
    });
  });
}

document.getElementById('saveBtn').addEventListener('click', () => {
  const p = {};
  PROFILE_FIELDS.forEach(id => { p[id] = (document.getElementById(id)?.value || '').trim(); });
  chrome.storage.local.set({ profile: p }, () => flash('saveMsg', true));
});

document.getElementById('clearBtn').addEventListener('click', () => {
  if (!confirm('Clear all saved profile data?')) return;
  PROFILE_FIELDS.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  chrome.storage.local.remove('profile');
});

// ── Credit System ─────────────────────────────────────────────
const PLAN_CFG = {
  free:    { credits: 3,      daily: true,  label: 'Free Plan',    chipClass: 'chip-free' },
  starter: { credits: 50,     daily: false, label: 'Starter Plan', chipClass: 'chip-paid' },
  pro:     { credits: 999999, daily: false, label: 'Pro Plan',     chipClass: 'chip-paid' },
  ultra:   { credits: 999999, daily: false, label: 'Ultra Plan',   chipClass: 'chip-paid' },
};
const CHIP_NAMES = { free:'FREE', starter:'STARTER', pro:'PRO', ultra:'ULTRA' };

function getCredits(cb) {
  chrome.storage.local.get(['plan','credits','creditsDate'], data => {
    const plan  = data.plan || 'free';
    const cfg   = PLAN_CFG[plan];
    const today = new Date().toDateString();
    let credits = data.credits;
    if (cfg.daily && data.creditsDate !== today) {
      credits = cfg.credits;
      chrome.storage.local.set({ credits, creditsDate: today });
    } else if (credits == null) {
      credits = cfg.credits;
      chrome.storage.local.set({ credits, creditsDate: today });
    }
    cb(plan, Math.max(0, credits));
  });
}

function useCredit(cb) {
  getCredits((plan, credits) => {
    if (plan === 'pro' || plan === 'ultra') { cb(true); return; }
    if (credits <= 0)                       { cb(false); return; }
    chrome.storage.local.set({ credits: credits - 1 }, () => { updateCreditUI(); cb(true); });
  });
}

function updateCreditUI() {
  getCredits((plan, credits) => {
    const cfg    = PLAN_CFG[plan];
    const unlim  = plan === 'pro' || plan === 'ultra';

    const ct     = document.getElementById('creditsText');
    const chip   = document.getElementById('planChip');
    const fill   = document.getElementById('cmFill');
    const count  = document.getElementById('cmCount');
    const pName  = document.getElementById('planName');
    const pDesc  = document.getElementById('planDesc');
    const portal = document.getElementById('portalBtnWrap');

    if (ct)   ct.textContent   = unlim ? 'Unlimited' : credits + ' credits';
    if (chip) { chip.textContent = CHIP_NAMES[plan]; chip.className = 'plan-chip ' + cfg.chipClass; }

    if (fill) {
      const pct = unlim ? 100 : plan === 'starter' ? (credits/50*100) : (credits/3*100);
      fill.style.width = Math.min(100, pct) + '%';
      fill.style.background = unlim ? 'linear-gradient(90deg,#00e5a0,#00b87d)' : 'linear-gradient(90deg,#5b5eff,#ff4f8b)';
    }
    if (count) count.textContent = unlim ? 'Unlimited' : plan==='starter' ? credits+' / 50' : credits+' / 3 daily';
    if (pName) pName.textContent = cfg.label;
    if (pDesc) pDesc.textContent = unlim ? 'Unlimited AI credits · All features unlocked'
      : plan === 'starter' ? credits + ' of 50 monthly credits left'
      : credits + ' of 3 daily credits remaining';
    if (portal) portal.style.display = (plan !== 'free') ? 'block' : 'none';
  });
}

// ── Fill Now ──────────────────────────────────────────────────
document.getElementById('fillNowBtn').addEventListener('click', () => {
  useCredit(ok => {
    if (!ok) { alert('No credits left! Upgrade for unlimited auto-fills.'); openPricing(); return; }
    chrome.tabs.query({ active:true, currentWindow:true }, ([tab]) => {
      if (!tab) return;
      chrome.tabs.sendMessage(tab.id, { action:'fillForm' }, resp => {
        if (chrome.runtime.lastError || !resp) alert('Navigate to a supported job application page first.');
      });
    });
  });
});

// ── Claude API Helper ─────────────────────────────────────────
async function callClaude(apiKey, prompt, maxTokens) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01' },
    body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:maxTokens, messages:[{role:'user',content:prompt}] })
  });
  const d = await res.json();
  if (d.error) throw new Error(d.error.message);
  return d.content?.[0]?.text || '';
}

function getApiKey(cb) {
  chrome.storage.local.get('settings', ({ settings }) => cb(settings?.apiKey?.trim() || ''));
}

// ── CV ALIGNER ────────────────────────────────────────────────
document.getElementById('analyzeBtn').addEventListener('click', async () => {
  const jobDesc = document.getElementById('cvJobDesc').value.trim();
  if (!jobDesc) { alert('Paste a job description first!'); return; }
  chrome.storage.local.get('profile', async ({ profile }) => {
    if (!profile?.summary) { alert('Add your CV text to the Professional Summary in your Profile tab!'); return; }
    getApiKey(async apiKey => {
      if (!apiKey) { alert('Add your Anthropic API key in the Settings tab!'); return; }
      const btn = document.getElementById('analyzeBtn');
      btn.disabled = true; btn.textContent = 'Analyzing...';
      const prompt = `You are an expert ATS analyst. Analyze this resume vs job description.
Respond ONLY with valid JSON (no markdown, no text outside JSON):
{"score":72,"verdict":"Good Match","missing_keywords":["kw1","kw2","kw3"],"present_keywords":["kw4","kw5"],"analysis":"2 sentence analysis."}

RESUME:
${profile.summary}
SKILLS: ${profile.skills || ''}
TITLE: ${profile.jobTitle || ''}

JOB DESCRIPTION:
${jobDesc}`;
      try {
        const raw  = await callClaude(apiKey, prompt, 800);
        const data = JSON.parse(raw.replace(/```json|```/g,'').trim());
        renderATS(data, profile, jobDesc, apiKey);
      } catch(e) { alert('Analysis failed. Check your API key.\n' + e.message); }
      btn.disabled = false; btn.textContent = 'Analyze & Score My CV';
    });
  });
});

function renderATS(data, profile, jobDesc, apiKey) {
  document.getElementById('atsResult').style.display = 'block';
  const score = Math.min(100, Math.max(0, parseInt(data.score) || 0));
  const circ  = 2 * Math.PI * 38;
  const ring  = document.getElementById('atsRing');
  ring.style.strokeDashoffset = circ - (score/100) * circ;
  const color = score >= 80 ? '#00e5a0' : score >= 60 ? '#ffa842' : '#ff4f8b';
  ring.style.stroke = color;
  const pctEl = document.getElementById('atsScore');
  pctEl.textContent = score + '%'; pctEl.style.color = color;
  const vEl = document.getElementById('atsVerdict');
  vEl.textContent = data.verdict || ''; vEl.style.color = color;

  document.getElementById('kwMissing').innerHTML =
    (data.missing_keywords||[]).slice(0,14).map(k =>
      `<span class="pill pill-miss" onclick="navigator.clipboard.writeText(${JSON.stringify(k)});this.textContent='Copied!';setTimeout(()=>this.textContent='+\u00a0${k.replace(/'/g,"\\'")}',1400)">+ ${k}</span>`
    ).join('');
  document.getElementById('kwPresent').innerHTML =
    (data.present_keywords||[]).slice(0,12).map(k => `<span class="pill pill-have">&#10003; ${k}</span>`).join('');

  // Wire rewrite button
  document.getElementById('rewriteBtn').onclick = () => handleRewrite(profile, jobDesc, apiKey, data.missing_keywords || []);
}

async function handleRewrite(profile, jobDesc, apiKey, missing) {
  chrome.storage.local.get('plan', async ({ plan }) => {
    if (!plan || plan === 'free' || plan === 'starter') { openPricing(); return; }
    useCredit(async ok => {
      if (!ok) { alert('No credits left!'); openPricing(); return; }
      const btn = document.getElementById('rewriteBtn');
      btn.disabled = true; btn.textContent = 'Rewriting...';
      const prompt = `Expert resume writer: rewrite this resume for 100% ATS match.
RULES: Keep all real experience — NEVER fabricate. Rephrase to incorporate missing keywords naturally.
Mark every changed/added phrase with [ADDED: text].
Use sections: PROFESSIONAL SUMMARY | EXPERIENCE | SKILLS | EDUCATION.
Missing keywords to add: ${missing.join(', ')}

ORIGINAL RESUME:
${profile.summary}

JOB DESCRIPTION:
${jobDesc}

Return complete rewritten resume only.`;
      try {
        const res = await callClaude(apiKey, prompt, 1800);
        document.getElementById('rewriteOut').style.display = 'block';
        const html = res.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                        .replace(/\[ADDED: ([^\]]+)\]/g,'<span class="diff-add">$1</span>');
        document.getElementById('diffBox').innerHTML = html;
      } catch(e) { alert('Rewrite failed: ' + e.message); }
      btn.disabled = false; btn.textContent = 'Rewrite CV to 100% Match ✨';
    });
  });
}

document.getElementById('copyCvBtn').addEventListener('click', () => {
  navigator.clipboard.writeText(document.getElementById('diffBox').textContent).then(() => {
    const b = document.getElementById('copyCvBtn'); b.textContent='Copied!';
    setTimeout(() => b.textContent='Copy', 2000);
  });
});
document.getElementById('insertCvBtn').addEventListener('click', () => {
  chrome.tabs.query({active:true,currentWindow:true},([tab]) => {
    if (tab) chrome.tabs.sendMessage(tab.id,{action:'insertCoverLetter',text:document.getElementById('diffBox').textContent});
  });
});

// ── Cover Letter ──────────────────────────────────────────────
document.getElementById('genCLBtn').addEventListener('click', async () => {
  const jobDesc = document.getElementById('jobDesc').value.trim();
  if (!jobDesc) { alert('Paste a job description first!'); return; }
  chrome.storage.local.get('profile', async ({ profile }) => {
    if (!profile?.firstName) { alert('Fill in your Profile tab first!'); return; }
    getApiKey(async apiKey => {
      if (!apiKey) { alert('Add your Anthropic API key in Settings!'); return; }
      useCredit(async ok => {
        if (!ok) { alert('No credits left!'); openPricing(); return; }
        const btn = document.getElementById('genCLBtn');
        const out = document.getElementById('clOut');
        btn.disabled = true; btn.textContent = 'Writing...';
        out.innerHTML = '<span class="thinking">Crafting your cover letter</span>';
        out.classList.add('show');
        document.getElementById('clActions').style.display = 'none';
        const prompt = `Write a compelling 3-paragraph cover letter.
Candidate: ${profile.firstName} ${profile.lastName}, ${profile.jobTitle}
Skills: ${profile.skills || ''} | Education: ${profile.education || ''}
Summary: ${(profile.summary||'').substring(0,400)}

Job Description:
${jobDesc}

Instructions: Start "Dear Hiring Manager," — be specific to this role, reference matching skills, end with CTA.
Close with "Sincerely,\n${profile.firstName} ${profile.lastName}"`;
        try {
          out.textContent = await callClaude(apiKey, prompt, 900);
          document.getElementById('clActions').style.display = 'flex';
        } catch(e) { out.textContent = 'Error: ' + e.message; }
        btn.disabled = false; btn.textContent = 'Generate Cover Letter';
      });
    });
  });
});

document.getElementById('copyCLBtn').addEventListener('click', () => {
  navigator.clipboard.writeText(document.getElementById('clOut').textContent).then(() => {
    const b = document.getElementById('copyCLBtn'); b.textContent='Copied!';
    setTimeout(()=>b.textContent='Copy',2000);
  });
});
document.getElementById('insertCLBtn').addEventListener('click', () => {
  chrome.tabs.query({active:true,currentWindow:true},([tab]) => {
    if(tab) chrome.tabs.sendMessage(tab.id,{action:'insertCoverLetter',text:document.getElementById('clOut').textContent});
  });
});

// ── ATS Keywords ──────────────────────────────────────────────
document.getElementById('kwBtn').addEventListener('click', async () => {
  const jobDesc = document.getElementById('jobDesc').value.trim();
  if (!jobDesc) { alert('Paste a job description above first!'); return; }
  getApiKey(async apiKey => {
    if (!apiKey) { alert('Add your API key in Settings!'); return; }
    const btn = document.getElementById('kwBtn'); const out = document.getElementById('kwOut');
    btn.disabled = true; btn.textContent = 'Analyzing...';
    out.innerHTML = '<span class="thinking">Extracting ATS keywords</span>';
    out.classList.add('show');
    try {
      out.textContent = await callClaude(apiKey,
        `List the top 12 ATS keywords from this job description. For each: the keyword, why it matters, and a sample resume bullet that uses it.\n\n${jobDesc}`, 700);
    } catch(e) { out.textContent = 'Error: ' + e.message; }
    btn.disabled = false; btn.textContent = 'Extract Keywords';
  });
});

// ── Interview Prep ────────────────────────────────────────────
document.getElementById('interviewBtn').addEventListener('click', async () => {
  chrome.storage.local.get(['plan','profile'], async ({ plan, profile }) => {
    if (!plan || plan === 'free') { openPricing(); return; }
    const jobDesc = document.getElementById('jobDesc').value.trim();
    if (!jobDesc) { alert('Paste a job description in the AI tab!'); return; }
    getApiKey(async apiKey => {
      if (!apiKey) { alert('Add your API key!'); return; }
      const btn = document.getElementById('interviewBtn'); const out = document.getElementById('interviewOut');
      btn.disabled = true; btn.textContent = 'Generating...';
      out.innerHTML = '<span class="thinking">Preparing your interview questions</span>';
      out.classList.add('show');
      try {
        out.textContent = await callClaude(apiKey,
          `Generate 6 interview questions and ideal answers (STAR method where applicable).
Candidate: ${profile?.jobTitle || ''}, Skills: ${profile?.skills || ''}
Job:\n${jobDesc}
Format:\nQ: [question]\nA: [answer]\n---`, 1000);
      } catch(e) { out.textContent = 'Error: ' + e.message; }
      btn.disabled = false; btn.textContent = 'Generate Interview Prep';
    });
  });
});

// ── Tracker ───────────────────────────────────────────────────
const STATUSES   = ['applied','interview','offer','rejected'];
const STAT_LABEL = { applied:'Applied', interview:'Interview', offer:'Offer', rejected:'Rejected' };
const PLT_ICON   = { LinkedIn:'💼',Indeed:'🔍',Glassdoor:'💚',Greenhouse:'🌿',Lever:'⚙️',Workday:'🔷',Other:'📋' };

function loadTracker() {
  chrome.storage.local.get('applications', ({ applications }) => {
    const apps = applications || [];
    document.getElementById('s-total').textContent = apps.length;
    document.getElementById('s-int').textContent   = apps.filter(a=>a.status==='interview').length;
    document.getElementById('s-offer').textContent = apps.filter(a=>a.status==='offer').length;
    document.getElementById('s-rej').textContent   = apps.filter(a=>a.status==='rejected').length;
    const list = document.getElementById('jobList');
    if (!apps.length) { list.innerHTML='<div class="empty">No applications yet. Start applying! 🎯</div>'; return; }
    list.innerHTML = apps.slice().reverse().slice(0,20).map((app,i) => {
      const idx = apps.length-1-i, s = app.status||'applied';
      const dt  = new Date(app.date).toLocaleDateString('en-US',{month:'short',day:'numeric'});
      return `<div class="jitem">
        <div class="jico">${PLT_ICON[app.platform]||'📋'}</div>
        <div class="jinfo"><div class="jtitle">${app.title||'Job Application'}</div>
          <div class="jmeta">${app.company||app.platform} &middot; ${dt}</div></div>
        <span class="jtag t-${s}" data-idx="${idx}">${STAT_LABEL[s]}</span>
      </div>`;
    }).join('');
    list.querySelectorAll('.jtag').forEach(tag => {
      tag.addEventListener('click', () => {
        const idx = parseInt(tag.dataset.idx);
        const a2  = [...apps];
        a2[idx].status = STATUSES[(STATUSES.indexOf(a2[idx].status||'applied')+1)%STATUSES.length];
        chrome.storage.local.set({applications:a2}, loadTracker);
      });
    });
  });
}

document.getElementById('clearTrackerBtn').addEventListener('click', () => {
  if (confirm('Clear all application history?')) chrome.storage.local.remove('applications', loadTracker);
});

// ── Settings ──────────────────────────────────────────────────
document.querySelectorAll('.tog').forEach(t => t.addEventListener('click', () => t.classList.toggle('on')));

function loadSettings() {
  chrome.storage.local.get('settings', ({ settings }) => {
    if (!settings) return;
    const map = {'tog-btn':'showButton','tog-auto':'autoFill','tog-track':'trackApps','tog-notif':'showNotif'};
    Object.entries(map).forEach(([id,key]) => {
      const el = document.getElementById(id);
      if (el && settings[key] !== undefined) el.classList.toggle('on', settings[key]);
    });
    const ak = document.getElementById('apiKey');
    if (ak && settings.apiKey) ak.value = settings.apiKey;
  });
}

document.getElementById('saveSettingsBtn').addEventListener('click', () => {
  const s = {
    showButton: document.getElementById('tog-btn').classList.contains('on'),
    autoFill:   document.getElementById('tog-auto').classList.contains('on'),
    trackApps:  document.getElementById('tog-track').classList.contains('on'),
    showNotif:  document.getElementById('tog-notif').classList.contains('on'),
    apiKey:     document.getElementById('apiKey').value.trim()
  };
  chrome.storage.local.set({settings:s}, () => flash('settingsSavedMsg', true));
});

// Manage billing portal
document.getElementById('portalBtn').addEventListener('click', openPortal);

async function openPortal() {
  chrome.storage.local.get('profile', async ({ profile }) => {
    if (!profile?.email) { alert('Add your email in the Profile tab first!'); return; }
    try {
      const r    = await fetch(SERVER_URL + '/api/create-portal-session', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email: profile.email, returnUrl: 'https://quickapply.app' })
      });
      const data = await r.json();
      if (data.url) chrome.tabs.create({ url: data.url });
      else alert('Could not open billing portal: ' + (data.error || 'Unknown error'));
    } catch(e) { alert('Could not reach the server. Check your internet connection.'); }
  });
}

// ── Pricing Modal ─────────────────────────────────────────────
let billingMode  = 'monthly';
let selectedPlan = null;
const PRICES = {
  monthly: { starter:'$7.99', pro:'$14.99', ultra:'$29.99' },
  annual:  { starter:'$4.99', pro:'$8.99',  ultra:'$17.99' }
};
const PLAN_LABEL = { starter:'Starter', pro:'Pro', ultra:'Ultra' };

function openPricing() {
  document.getElementById('pricingModal').classList.add('show');
  // Init Stripe Elements when modal opens (so DOM element exists)
  setTimeout(() => initStripe(), 100);
}
function closePricing() {
  document.getElementById('pricingModal').classList.remove('show');
  document.getElementById('payForm').classList.remove('show');
  selectedPlan = null;
}

function toggleBilling() { setBilling(billingMode === 'monthly' ? 'annual' : 'monthly'); }
function setBilling(mode) {
  billingMode = mode;
  document.getElementById('billSw').classList.toggle('ann', mode === 'annual');
  document.getElementById('bill-mon').classList.toggle('active', mode === 'monthly');
  document.getElementById('bill-ann').classList.toggle('active', mode === 'annual');
  updatePriceDisplay();
}
function updatePriceDisplay() {
  const p = PRICES[billingMode];
  ['starter','pro','ultra'].forEach(n => {
    const pe = document.getElementById('p-'+n); const pr = document.getElementById('pp-'+n);
    if (pe) pe.textContent = p[n];
    if (pr) pr.textContent = billingMode==='annual' ? '/mo, billed yearly' : '/month';
  });
}

function selectPlan(name) {
  selectedPlan = name;
  const prices = PRICES[billingMode];
  document.getElementById('payTitle').textContent    = 'Subscribe to ' + PLAN_LABEL[name];
  document.getElementById('payPlanName').textContent = PLAN_LABEL[name] + ' Plan';
  document.getElementById('payAmt').textContent      = prices[name];
  document.getElementById('payBillDesc').textContent =
    billingMode === 'annual'
      ? prices[name] + '/mo · Billed annually · Cancel anytime'
      : prices[name] + '/month · Cancel anytime';

  // Pre-fill details from profile
  chrome.storage.local.get('profile', ({ profile }) => {
    if (profile) {
      if (profile.email) document.getElementById('payEmail').value = profile.email;
      if (profile.firstName) document.getElementById('payName').value = (profile.firstName+' '+(profile.lastName||'')).trim();
    }
  });

  const pf = document.getElementById('payForm');
  pf.classList.add('show');
  setTimeout(() => pf.scrollIntoView({behavior:'smooth', block:'nearest'}), 50);
}

// ── REAL STRIPE PAYMENT (MV3 compatible — card fields sent to server) ───────
async function processPayment() {
  if (!selectedPlan) { showPayMsg('Please select a plan above.', false); return; }

  const name    = document.getElementById('payName').value.trim();
  const email   = document.getElementById('payEmail').value.trim();
  const cardNum = document.getElementById('cardNumber').value.replace(/\s/g,'');
  const expiry  = document.getElementById('cardExpiry').value.replace(/\s/g,'');
  const cvc     = document.getElementById('cardCvc').value.trim();

  if (!name)  { showPayMsg('Please enter your full name.', false); return; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showPayMsg('Please enter a valid email address.', false); return; }
  if (cardNum.length < 15) { showPayMsg('Please enter a valid card number.', false); return; }
  if (!expiry || expiry.length < 4) { showPayMsg('Please enter card expiry date.', false); return; }
  if (cvc.length < 3) { showPayMsg('Please enter your CVC.', false); return; }

  const btn = document.getElementById('payBtn');
  btn.disabled = true; btn.textContent = 'Processing...';
  document.getElementById('payMsg').classList.remove('show');

  // Parse expiry MM/YY
  const expParts = expiry.replace(/\s/g,'').split('/');
  const expMonth = expParts[0];
  const expYear  = expParts[1] ? (expParts[1].length === 2 ? '20'+expParts[1] : expParts[1]) : '';

  try {
    // Send card + plan to backend — server uses Stripe API to tokenize & charge
    const res = await fetch(SERVER_URL + '/api/create-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        card: { number: cardNum, exp_month: expMonth, exp_year: expYear, cvc },
        plan:    selectedPlan,
        billing: billingMode,
        email,
        name,
        extensionUserId: chrome.runtime.id || 'unknown',
      }),
    });

    const data = await res.json();

    if (data.error) {
      showPayMsg('Payment failed: ' + data.error, false);
      btn.disabled = false; btn.textContent = 'Subscribe Now';
      return;
    }

    // Activate plan locally
    const planCredits = { starter:50, pro:999999, ultra:999999 };
    chrome.storage.local.set({
      plan:           selectedPlan,
      credits:        planCredits[selectedPlan],
      creditsDate:    new Date().toDateString(),
      subscriptionId: data.subscriptionId || '',
      customerId:     data.customerId || '',
      userEmail:      email,
    }, () => {
      updateCreditUI();
      showPayMsg('Welcome to ' + PLAN_LABEL[selectedPlan] + '! Your plan is now active.', true);
      setTimeout(() => closePricing(), 3000);
    });

  } catch(e) {
    const msg = e.message.includes('fetch') || e.message.includes('Failed')
      ? 'Cannot reach payment server. Check SERVER_URL in popup.js: ' + SERVER_URL
      : 'Payment error: ' + e.message;
    showPayMsg(msg, false);
    btn.disabled = false; btn.textContent = 'Subscribe Now';
  }
}


function showPayMsg(msg, ok) {
  const el = document.getElementById('payMsg');
  el.textContent    = msg;
  el.style.background  = ok ? 'rgba(0,229,160,.08)'  : 'rgba(255,79,139,.08)';
  el.style.borderColor = ok ? 'rgba(0,229,160,.25)'  : 'rgba(255,79,139,.25)';
  el.style.color       = ok ? '#00e5a0'               : '#ff4f8b';
  el.className = 'fmsg show';
  if (ok) setTimeout(() => el.classList.remove('show'), 4000);
}

// ── Utility ───────────────────────────────────────────────────
function flash(id, ok) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = 'fmsg ' + (ok ? 'fmsg-ok' : 'fmsg-err') + ' show';
  setTimeout(() => el.classList.remove('show'), 3000);
}


// ── Card Input Formatters ─────────────────────────────────────
function fmtCard(el) {
  let v = el.value.replace(/\D/g,'').substring(0,16);
  el.value = v.replace(/(.{4})/g,'$1 ').trim();
}
function fmtExp(el) {
  let v = el.value.replace(/\D/g,'').substring(0,4);
  if (v.length >= 2) v = v.substring(0,2) + ' / ' + v.substring(2);
  el.value = v;
}

// ── Init ──────────────────────────────────────────────────────
loadProfile();
loadSettings();
updateCreditUI();
