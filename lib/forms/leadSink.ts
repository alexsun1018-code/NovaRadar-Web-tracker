import type { ContactFormPayload } from "./schema";

const CONTACT_INBOX = process.env.CONTACT_INBOX_EMAIL ?? "";
const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";

/**
 * 對外介面固定為 sendLead()。日後要換 CRM，只需替換這個函式的實作，
 * app/api/contact/route.ts 與前端表單都不需要改動。
 */
export async function sendLead(payload: ContactFormPayload): Promise<void> {
  if (!RESEND_API_KEY || !CONTACT_INBOX) {
    console.warn(
      "[leadSink] RESEND_API_KEY / CONTACT_INBOX_EMAIL 尚未設定，僅記錄於 log，未實際寄信",
      payload
    );
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "NovaRadar Web <onboarding@resend.dev>",
      to: [CONTACT_INBOX],
      subject: `[聯絡表單] ${payload.name}`,
      text: [
        `姓名：${payload.name}`,
        `Email：${payload.email}`,
        `電話：${payload.phone || "—"}`,
        `訊息：${payload.message || "—"}`,
      ].join("\n"),
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend API error: ${res.status}`);
  }
}
