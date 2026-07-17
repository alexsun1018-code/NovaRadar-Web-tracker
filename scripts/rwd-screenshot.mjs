import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const outDir = process.argv[2] ?? "./.rwd-screenshots";
mkdirSync(outDir, { recursive: true });

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

const browser = await chromium.launch();
for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto("http://localhost:3000/zh-tw", { waitUntil: "networkidle" });
  const path = `${outDir}/${vp.name}.png`;
  await page.screenshot({ path, fullPage: true });
  console.log(`saved ${path}`);
  await page.close();
}
await browser.close();
