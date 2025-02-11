import type { BlockedUrl, Settings } from "$lib/urlController.svelte";
import { trimUrl } from "$lib/utils";
function isBlockingActive(settings: Settings) {
  if (!settings.enabled) {
    return false;
  }
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hour * 60 + minutes;
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;
  const isWorkHour =
    totalMinutes >= settings.workHour.start &&
    totalMinutes <= settings.workHour.end;

  if (isWorkHour) {
    if (isWeekend && settings.blockOnWeekends) {
      return true;
    } else if (!isWeekend) {
      return true;
    }
  }

  return false;
}
chrome.webNavigation.onBeforeNavigate.addListener(async function (details) {
  const { url, tabId } = details;

  if (url === "about:blank") return;

  const trimmedUrl = trimUrl(url, "url");

  const [p, s] = await Promise.all([
    chrome.storage.sync.get("pages"),
    chrome.storage.sync.get("settings"),
  ]);
  if (!p || !p.pages || !s || !s.settings) {
    return;
  }
  const pages: BlockedUrl[] = Object.values(p.pages);
  const settings: Settings = s.settings;

  if (!isBlockingActive(settings)) {
    console.log("Not enabled");
    return;
  }
  console.log("Trimmed url", trimmedUrl);

  const startsWithPages = pages.filter((page: BlockedUrl) =>
    page.url.endsWith("*")
  );
  const isValidUrl =
    pages.filter((page: BlockedUrl) => page.url === trimmedUrl).length === 0 &&
    startsWithPages.filter((page: BlockedUrl) =>
      trimmedUrl.startsWith(page.url.slice(0, -2))
    ).length === 0;

  if (isValidUrl) {
    return;
  }

  chrome.tabs.update(tabId, {
    url: "https://tivoku.com/website-blocker/blocked",
  });
});
