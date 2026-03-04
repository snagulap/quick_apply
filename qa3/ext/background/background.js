// QuickApply v3 - Background: clicking icon toggles sidebar
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const sidebar = document.getElementById('qa-sidebar');
      if (sidebar) {
        sidebar.classList.toggle('qa-open');
      }
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) return;
  const supported = ['linkedin.com','indeed.com','glassdoor.com','greenhouse.io','lever.co','workday.com'];
  const on = supported.some(d => tab.url.includes(d));
  chrome.action.setBadgeText({ text: on ? 'ON' : '', tabId });
  chrome.action.setBadgeBackgroundColor({ color: '#16a34a', tabId });
});
