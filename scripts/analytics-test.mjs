import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();

const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => consoleErrors.push(String(err)));

// 在任何頁面 script 執行前，記錄之後對 window.gtag / window.fbq 的呼叫
await page.addInitScript(() => {
  window.__calls = [];
  const wrap = (name) => {
    const original = window[name];
    Object.defineProperty(window, name, {
      configurable: true,
      get() {
        return (...args) => {
          window.__calls.push([name, args]);
          if (typeof original === "function") return original(...args);
        };
      },
      set(fn) {
        // 讓真正的 gtag.js / fbevents.js 覆寫時，我們的紀錄邏輯持續生效
      },
    });
  };
  wrap("gtag");
  wrap("fbq");
});

await page.goto("http://localhost:3000/zh-tw/contact", { waitUntil: "networkidle" });

const form = page.locator("form");
await form.locator('input[name="name"]').fill("分析追蹤測試");
await form.locator('input[name="email"]').fill("analytics-test@example.com");
await form.locator('select[name="inquiryType"]').selectOption("partnership");

await Promise.all([
  page.waitForResponse((res) => res.url().includes("/api/contact")),
  form.locator('button[type="submit"]').click(),
]);

await page.waitForTimeout(500);

const calls = await page.evaluate(() => window.__calls);
console.log("Recorded fbq calls after submit:");
for (const [name, args] of calls) {
  console.log(` - ${name}(${JSON.stringify(args)})`);
}

// gtag() 是 @next/third-parties 用 bare `function gtag(){}` 全域宣告定義，
// 會蓋掉我們用 defineProperty 設的攔截，所以改直接檢查它實際寫入的 window.dataLayer
const dataLayer = await page.evaluate(() => window.dataLayer ?? []);
console.log("window.dataLayer entries:", JSON.stringify(dataLayer));

const hasLeadEvent = dataLayer.some(
  (entry) => entry[0] === "event" && entry[1] === "generate_lead"
);
const hasFbqLead = calls.some(([name, args]) => name === "fbq" && args[0] === "track" && args[1] === "Lead");

console.log("GA4 generate_lead fired:", hasLeadEvent);
console.log("Meta Pixel Lead fired:", hasFbqLead);
console.log("Console errors:", consoleErrors.length ? consoleErrors : "none");

await browser.close();
