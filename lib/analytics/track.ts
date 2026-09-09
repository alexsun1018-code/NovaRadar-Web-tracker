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
export function trackLead(): void {
  if (typeof window === "undefined") return;

  window.gtag?.("event", "generate_lead");
  window.fbq?.("track", "Lead");
}
