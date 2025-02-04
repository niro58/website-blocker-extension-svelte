const allowedChars = "abcdefghijklmnopqrstuvwxyz0123456789-.";
export function trimUrl(url) {
  url = url.toLowerCase();
  url = url.replace("https://", "").replace("http://", "").replace("www.", "");
  url = url.split("/")[0];
  url = url.split(".").slice(-2).join(".");
  return url;
}
export function isValidUrl(url, existingWebsites) {
  if (url.split("").some((c) => !allowedChars.includes(c))) {
    return "Invalid characters in URL";
  }
  const parts = url.split(".");
  if (parts.length != 2 || parts[0].length < 1 || parts[1].length < 2) {
    return "Invalid URL format";
  }

  const invalidWebsites = ["tivoku.com"];
  if (existingWebsites.filter((w) => w.url === url).length > 0) {
    return "Website is already in the list";
  }
  if (invalidWebsites.includes(url)) {
    return "Invalid URL";
  }
  return true;
}
