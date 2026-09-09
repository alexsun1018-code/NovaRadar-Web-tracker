"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { mainNav, authNav } from "@/lib/nav/config";
import Icon from "@/components/ui/Icon";

export default function Header() {
  const t = useTranslations("Nav");
  const tCommon = useTranslations("Common");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-neutral-100 bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/images/logo-full.png"
            alt="NovaRadar Bio Venture"
            width={1400}
            height={363}
            priority
            className="h-12 w-auto sm:h-14"
          />
        </Link>

        <nav className="hidden items-center gap-10 min-[1180px]:flex xl:gap-12">
          {mainNav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={
                item.status === "placeholder"
                  ? "whitespace-nowrap text-xl font-bold text-brand-neutral-600 hover:text-brand-primary"
                  : "whitespace-nowrap text-xl font-bold text-brand-neutral-900 hover:text-brand-primary"
              }
            >
              {t(item.key)}
              {item.status === "placeholder" && (
                <span className="ml-1 text-xs font-medium text-brand-neutral-300">
                  ({tCommon("soonBadge")})
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-5 min-[1180px]:flex">
          <div className="flex items-center gap-3">
            {authNav.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="whitespace-nowrap rounded-full border border-brand-neutral-200 px-5 py-2 text-base font-medium text-brand-neutral-700 hover:border-brand-primary hover:text-brand-primary"
              >
                {t(item.key)}
                {item.status === "placeholder" && (
                  <span className="ml-1 text-xs font-medium text-brand-neutral-300">
                    ({tCommon("soonBadge")})
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="min-[1180px]:hidden"
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
        <nav className="border-t border-brand-neutral-100 px-4 py-4 min-[1180px]:hidden">
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
                      ({tCommon("soonBadge")})
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="mt-4 flex flex-col gap-3 border-t border-brand-neutral-100 pt-4">
            {authNav.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="text-base font-bold text-brand-neutral-600"
                  onClick={() => setOpen(false)}
                >
                  {t(item.key)}
                  {item.status === "placeholder" && (
                    <span className="ml-1 text-xs font-medium text-brand-neutral-300">
                      ({tCommon("soonBadge")})
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
