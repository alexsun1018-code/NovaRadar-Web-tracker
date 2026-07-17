import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();

const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => consoleErrors.push(String(err)));

await page.goto("http://localhost:3000/zh-tw/contact", { waitUntil: "networkidle" });

const form = page.locator("form");
await form.locator('input[name="name"]').fill("測試 王");
await form.locator('input[name="company"]').fill("測試股份有限公司");
await form.locator('input[name="email"]').fill("test@example.com");
await form.locator('input[name="phone"]').fill("0912345678");
await form.locator('select[name="inquiryType"]').selectOption("funding");
await form.locator('textarea[name="message"]').fill("這是一則測試訊息，驗證表單送出流程。");

const [response] = await Promise.all([
  page.waitForResponse((res) => res.url().includes("/api/contact")),
  form.locator('button[type="submit"]').click(),
]);

console.log("API response status:", response.status());
console.log("API response body:", await response.text());

await page.waitForTimeout(500);
const successText = await page.locator("text=送出完成").first().isVisible().catch(() => false);
console.log("Success message visible in UI:", successText);

const screenshotPath = ".form-test-screenshot.png";
await page.screenshot({ path: screenshotPath, fullPage: false });
console.log("Screenshot saved:", screenshotPath);

console.log("Console errors:", consoleErrors.length ? consoleErrors : "none");

await browser.close();
