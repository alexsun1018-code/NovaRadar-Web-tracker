import type { Locale } from "@/i18n/routing";

export interface LocalizedFieldResult {
  value: string;
  /** 僅 en 缺譯時才視為需要顯示「尚未翻譯」提示；zh-CN 屬自動轉換，不算 fallback */
  isFallback: boolean;
}

/**
 * 依 content-model.md 慣例，欄位以 `_zhTW` / `_zhCN` / `_en` 結尾。
 * zh-CN 預期已在 lib/cms 的 fetcher 層由 withAutoZhCN() 補上，此處僅處理缺值時的最終防呆。
 */
export function localizedField<T extends object>(
  entry: T,
  locale: Locale,
  fieldBase: string
): LocalizedFieldResult {
  const record = entry as Record<string, unknown>;
  const zhTW = (record[`${fieldBase}_zhTW`] as string | undefined) ?? "";

  if (locale === "zh-tw") {
    return { value: zhTW, isFallback: false };
  }

  const suffix = locale === "zh-cn" ? "zhCN" : "en";
  const localized = record[`${fieldBase}_${suffix}`] as string | undefined;

  if (localized && localized.trim().length > 0) {
    return { value: localized, isFallback: false };
  }

  return { value: zhTW, isFallback: locale === "en" };
}
