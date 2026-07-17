import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const locales = ["zh-tw", "zh-cn", "en"];

const browser = await chromium.launch();
const page = await browser.newPage();

const visited = new Set();
const toVisit = new Set(locales.map((l) => `/${l}`));
const results = [];

function isInternal(href) {
  if (!href) return false;
  if (href.startsWith("#")) return false;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  if (/^https?:\/\//.test(href) && !href.startsWith(BASE)) return false;
  return true;
}

function toPath(href) {
  if (href.startsWith(BASE)) return href.slice(BASE.length) || "/";
  return href;
}

while (toVisit.size > 0) {
  const path = [...toVisit][0];
  toVisit.delete(path);
  if (visited.has(path)) continue;
  visited.add(path);

  const res = await page.goto(BASE + path, { waitUntil: "networkidle" });
  const status = res ? res.status() : 0;
  results.push({ path, status });

  if (status >= 200 && status < 400) {
    const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
    for (const href of hrefs) {
      if (!isInternal(href)) continue;
      const p = toPath(href);
      if (!visited.has(p)) toVisit.add(p);
    }
  }
}

await browser.close();

const failed = results.filter((r) => r.status >= 400 || r.status === 0);
console.log(`Visited ${results.length} pages.`);
if (failed.length > 0) {
  console.log("FAILED:");
  for (const f of failed) console.log(`  ${f.status}  ${f.path}`);
  process.exit(1);
} else {
  console.log("All links OK (no 404s).");
  for (const r of results.sort((a, b) => a.path.localeCompare(b.path))) {
    console.log(`  ${r.status}  ${r.path}`);
  }
}
