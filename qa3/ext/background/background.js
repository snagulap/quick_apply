// QuickApply — clicking icon injects + toggles sidebar on ANY page
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) return;

  try {
    // First inject CSS
    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['content/content.css']
    });
  } catch(e) { /* already injected */ }

  try {
    // Then inject JS if sidebar doesn't exist yet, or just toggle
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const existing = document.getElementById('qa-sidebar');
        if (existing) {
          existing.classList.toggle('qa-open');
          return 'toggled';
        }
        return 'needs-inject';
      }
    }).then(async (results) => {
      if (results?.[0]?.result === 'needs-inject') {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content/content.js']
        });
        // Open it after injection
        setTimeout(() => {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              const s = document.getElementById('qa-sidebar');
              if (s) s.classList.add('qa-open');
            }
          });
        }, 300);
      }
    });
  } catch(e) {
    console.error('QuickApply inject error:', e);
  }
});
