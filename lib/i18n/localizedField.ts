export interface LocalizedFieldResult {
  value: string;
  /** en 缺譯時視為需要顯示「尚未翻譯」提示 */
  isFallback: boolean;
}

/**
 * 依 content-model.md 慣例，欄位以 `_zhTW` / `_en` 結尾。
 * 網站僅保留 EN，固定取 `_en`，缺譯時退回 `_zhTW` 並標記 fallback。
 */
export function localizedField<T extends object>(
  entry: T,
  fieldBase: string
): LocalizedFieldResult {
  const record = entry as Record<string, unknown>;
  const zhTW = (record[`${fieldBase}_zhTW`] as string | undefined) ?? "";
  const localized = record[`${fieldBase}_en`] as string | undefined;

  if (localized && localized.trim().length > 0) {
    return { value: localized, isFallback: false };
  }

  return { value: zhTW, isFallback: true };
}
