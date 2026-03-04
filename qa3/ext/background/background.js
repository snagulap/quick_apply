// QuickApply v3 — Background Service Worker
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) return;
  const supported = ['linkedin.com','indeed.com','glassdoor.com','greenhouse.io','lever.co','workday.com'];
  const on = supported.some(d => tab.url.includes(d));
  chrome.action.setBadgeText({ text: on ? 'ON' : '', tabId });
  chrome.action.setBadgeBackgroundColor({ color: '#5b5eff', tabId });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'getProfile') {
    chrome.storage.local.get('profile', data => sendResponse(data));
    return true;
  }
  if (msg.action === 'openTab') {
    chrome.tabs.create({ url: msg.url });
    sendResponse({ ok: true });
    return true;
  }
});
