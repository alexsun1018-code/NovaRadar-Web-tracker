"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { mainNav } from "@/lib/nav/config";
import { routing } from "@/i18n/routing";
import Icon from "@/components/ui/Icon";

const localeLabels: Record<string, string> = {
  "zh-tw": "繁中",
  "zh-cn": "简中",
  en: "EN",
};

export default function Header() {
  const t = useTranslations("Nav");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-neutral-100 bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-2xl font-extrabold text-brand-primary"
        >
          NovaRadar{" "}
          <span className="font-bold text-brand-neutral-900">瑞大生技</span>
        </Link>

        <nav className="hidden items-center gap-5 xl:flex">
          {mainNav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={
                item.status === "placeholder"
                  ? "whitespace-nowrap text-base font-bold text-brand-neutral-600 hover:text-brand-primary"
                  : "whitespace-nowrap text-base font-bold text-brand-neutral-900 hover:text-brand-primary"
              }
            >
              {t(item.key)}
              {item.status === "placeholder" && (
                <span className="ml-1 text-xs font-medium text-brand-neutral-300">
                  ({tCommon("comingSoon")})
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          {routing.locales.map((loc) => (
            <Link
              key={loc}
              href={pathname}
              locale={loc}
              className={
                loc === locale
                  ? "text-base font-extrabold text-brand-primary"
                  : "text-base font-bold text-brand-neutral-600 hover:text-brand-primary"
              }
            >
              {localeLabels[loc]}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="xl:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <Icon
            name={open ? "close" : "menu"}
            className="h-6 w-6 text-brand-primary"
          />
        </button>
      </div>

      {open && (
        <nav className="border-t border-brand-neutral-100 px-4 py-4 xl:hidden">
          <ul className="flex flex-col gap-3">
            {mainNav.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="text-base font-bold text-brand-neutral-900"
                  onClick={() => setOpen(false)}
                >
                  {t(item.key)}
                  {item.status === "placeholder" && (
                    <span className="ml-1 text-xs font-medium text-brand-neutral-300">
                      ({tCommon("comingSoon")})
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-3 border-t border-brand-neutral-100 pt-4">
            {routing.locales.map((loc) => (
              <Link
                key={loc}
                href={pathname}
                locale={loc}
                className="text-base font-bold text-brand-neutral-600"
              >
                {localeLabels[loc]}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
