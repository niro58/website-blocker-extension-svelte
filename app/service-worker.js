import { trimUrl } from "./utils.js";

chrome.webNavigation.onCommitted.addListener(async function (details) {
  const { url, tabId } = details;
  if (url === "about:blank") return;
  const trimmedUrl = trimUrl(url);
  let blockedUrls = await chrome.storage.local.get("pages");

  const isValidUrl =
    blockedUrls["pages"].filter((page) => page.url === trimmedUrl).length === 0;

  if (isValidUrl) {
    return;
  }

  chrome.tabs.update(
    tabId,
    { url: "https://tivoku.com/website-blocker/blocked" },
    function (tab) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => alert(message),
        });
      }
    }
  );
});
