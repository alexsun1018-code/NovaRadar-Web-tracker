import type { Locale } from "@/i18n/routing";

export interface LocalizedFieldResult {
  value: string;
  /** en 缺譯時視為需要顯示「尚未翻譯」提示 */
  isFallback: boolean;
}

/**
 * 依 content-model.md 慣例，欄位以 `_zhTW` / `_en` 結尾。
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

  const localized = record[`${fieldBase}_en`] as string | undefined;

  if (localized && localized.trim().length > 0) {
    return { value: localized, isFallback: false };
  }

  return { value: zhTW, isFallback: true };
}
