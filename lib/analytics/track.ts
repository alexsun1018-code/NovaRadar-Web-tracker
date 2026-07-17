type GtagFn = (...args: unknown[]) => void;
type FbqFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    fbq?: FbqFn;
  }
}

/**
 * 表單成功送出時呼叫。若對應追蹤碼未載入（未設定 ID），呼叫會被安靜跳過，不影響表單流程。
 */
export function trackLead(inquiryType: string): void {
  if (typeof window === "undefined") return;

  window.gtag?.("event", "generate_lead", {
    inquiry_type: inquiryType,
  });

  window.fbq?.("track", "Lead", {
    inquiry_type: inquiryType,
  });
}
