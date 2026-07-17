import { zhTwToZhCn } from "@/lib/i18n/opencc";

/**
 * 為條目補上 `_zhCN` 欄位：若已有人工覆寫值則保留，否則由 `_zhTW` 透過 OpenCC 自動轉換產生。
 * 依架構規劃在 CMS 資料抓取層執行一次，而非交給每個 UI 元件逐欄位處理。
 */
export function withAutoZhCN<T extends object>(
  entry: T,
  fieldBases: string[]
): T {
  const result = { ...entry } as Record<string, unknown>;
  for (const base of fieldBases) {
    const zhCNKey = `${base}_zhCN`;
    const zhTWKey = `${base}_zhTW`;
    const existing = result[zhCNKey] as string | undefined;
    const source = result[zhTWKey] as string | undefined;
    if ((!existing || existing.trim().length === 0) && source) {
      result[zhCNKey] = zhTwToZhCn(source);
    }
  }
  return result as T;
}
