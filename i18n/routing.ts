import { defineRouting } from "next-intl/routing";

export const locales = ["zh-tw", "zh-cn", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "zh-tw";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});
