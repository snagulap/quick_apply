// QuickApply v3 — Content Script
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

  function injectFAB() {
    if (document.getElementById('qa-fab')) return;
    const btn = document.createElement('button');
    btn.id = 'qa-fab';
    btn.innerHTML = '&#9889; QuickApply';
    btn.addEventListener('click', () => {
      chrome.storage.local.get(['profile','settings'], ({ profile, settings }) => {
        if (!profile || !profile.firstName) { toast('Open QuickApply and fill your Profile first!', 'warn'); return; }
        const n = fillForms(profile);
        if (!settings || settings.trackApps !== false) trackApp(profile);
        toast(n > 0 ? 'Filled ' + n + ' field' + (n>1?'s':'') + '!' : 'No matching fields found.', n>0?'ok':'warn');
      });
    });
    document.body.appendChild(btn);
  }

  function buildMap(p) {
    return [
      { re:/first[\s._-]?name|fname|given[\s._-]?name/i,              v: p.firstName },
      { re:/last[\s._-]?name|lname|family[\s._-]?name|surname/i,      v: p.lastName },
      { re:/full[\s._-]?name|your[\s._-]?name|applicant[\s._-]?name/i,v: (p.firstName+' '+p.lastName).trim() },
      { re:/\bemail\b|e-mail|email[\s._-]?address/i,                  v: p.email },
      { re:/phone|mobile|telephone|cell/i,                             v: p.phone },
      { re:/\bcity\b/i,                                                v: p.city },
      { re:/\bstate\b|\bprovince\b|\bregion\b/i,                      v: p.state },
      { re:/\bzip\b|postal/i,                                          v: p.zip },
      { re:/linkedin/i,                                                v: p.linkedin },
      { re:/\bwebsite\b|\bportfolio\b|personal[\s._-]?url/i,          v: p.website },
      { re:/github/i,                                                  v: p.github },
      { re:/current[\s._-]?title|job[\s._-]?title|position|desired[\s._-]?role/i, v: p.jobTitle },
      { re:/salary|compensation|expected[\s._-]?pay/i,                v: p.salary },
      { re:/education|degree|qualification/i,                         v: p.education },
      { re:/\bskills?\b|expertise|competencies/i,                     v: p.skills },
      { re:/summary|professional[\s._-]?summary|about[\s._-]?you/i,   v: p.summary },
      { re:/cover[\s._-]?letter|motivation|why[\s._-]?apply|message/i,v: p.summary },
    ];
  }

  function hint(el) {
    const lbl = document.querySelector('label[for="'+el.id+'"]');
    return [el.name,el.id,el.placeholder,
      el.getAttribute('aria-label')||'',
      el.getAttribute('data-field')||'',
      el.getAttribute('title')||'',
      lbl ? lbl.textContent : '',
      el.closest('label') ? el.closest('label').textContent : '',
    ].join(' ').toLowerCase();
  }

  function fillForms(profile) {
    const map = buildMap(profile);
    const sel = "input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=checkbox]):not([type=radio]):not([type=file]),textarea";
    let n = 0;
    document.querySelectorAll(sel).forEach(el => {
      if (el.readOnly || el.disabled) return;
      const h = hint(el);
      for (const {re,v} of map) {
        if (v && re.test(h)) { setVal(el, v); n++; break; }
      }
    });
    return n;
  }

  function setVal(el, val) {
    const proto  = el.tagName==='TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto,'value');
    if (setter && setter.set) setter.set.call(el, val); else el.value = val;
    ['input','change','blur'].forEach(e => el.dispatchEvent(new Event(e,{bubbles:true})));
  }

  function trackApp(profile) {
    const titleEl = document.querySelector('h1,[class*="job-title"],[class*="jobtitle"]');
    let title = titleEl ? titleEl.textContent.trim() : document.title;
    title = title.replace(/\s[-|].*/,'').substring(0,80);
    const compEl = document.querySelector('[class*="company-name"],[class*="companyName"],[class*="employer"]');
    const company = compEl ? compEl.textContent.trim().substring(0,60) : location.hostname.replace('www.','').split('.')[0];
    chrome.storage.local.get('applications', ({applications}) => {
      const apps = applications || [];
      if (apps.some(a => a.title===title && Date.now()-a.date < 300000)) return;
      apps.push({title, company, platform:PLATFORM, date:Date.now(), status:'applied'});
      if (apps.length > 300) apps.splice(0, apps.length-300);
      chrome.storage.local.set({applications: apps});
    });
  }

  function insertText(text) {
    const tas = Array.from(document.querySelectorAll('textarea'));
    const target = tas.find(t => /cover|letter|message|motivation|why/i.test(hint(t))) || tas[tas.length-1];
    if (target) { setVal(target, text); toast('Inserted!', 'ok'); }
    else toast('No text area found on this page.', 'warn');
  }

  function toast(msg, type) {
    document.getElementById('qa-toast')?.remove();
    const t = document.createElement('div');
    t.id = 'qa-toast';
    t.className = 'qa-toast qa-' + (type||'ok');
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 4000);
  }

  chrome.runtime.onMessage.addListener((msg, _s, reply) => {
    if (msg.action === 'fillForm') {
      chrome.storage.local.get(['profile','settings'], ({profile, settings}) => {
        if (!profile) { toast('No profile saved!', 'warn'); reply({ok:false}); return; }
        const n = fillForms(profile);
        if (!settings || settings.trackApps !== false) trackApp(profile);
        toast(n>0 ? 'Filled '+n+' field'+(n>1?'s':'')+'!' : 'No matching fields found.', n>0?'ok':'warn');
        reply({ok:true, filled:n});
      });
      return true;
    }
    if (msg.action === 'insertCoverLetter') { insertText(msg.text); reply({ok:true}); }
  });

  chrome.storage.local.get('settings', ({settings}) => {
    if (!settings || settings.showButton !== false) injectFAB();
    if (settings && settings.autoFill) {
      chrome.storage.local.get('profile', ({profile}) => { if (profile) setTimeout(() => fillForms(profile), 800); });
    }
  });

  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(() => { document.getElementById('qa-fab')?.remove(); injectFAB(); }, 1500);
    }
  }).observe(document.documentElement, {subtree:true, childList:true});
})();
