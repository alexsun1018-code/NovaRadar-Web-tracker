"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import YearSidebar from "./YearSidebar";

export interface DisclosureListItemView {
  slug: string;
  title: string;
  disclosureDate: string;
  category: string;
  announcementNo?: string;
  isFallback: boolean;
}

export default function DisclosureList({
  items,
}: {
  items: DisclosureListItemView[];
}) {
  const tCommon = useTranslations("Common");
  const years = useMemo(
    () =>
      Array.from(
        new Set(items.map((item) => item.disclosureDate.slice(0, 4)))
      ).sort((a, b) => b.localeCompare(a)),
    [items]
  );
  const [activeYear, setActiveYear] = useState<string | null>(years[0] ?? null);

  const filtered = activeYear
    ? items.filter((item) => item.disclosureDate.startsWith(activeYear))
    : items;

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 sm:flex-row">
        {years.length > 0 && (
          <YearSidebar
            years={years}
            activeYear={activeYear}
            onSelectYear={(year) =>
              setActiveYear((current) => (current === year ? null : year))
            }
          />
        )}

        <ul className="flex-1 divide-y divide-brand-neutral-100">
          {filtered.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/news/disclosures/${item.slug}`}
                className="flex flex-col gap-2 py-4 transition hover:bg-brand-neutral-50 sm:flex-row sm:gap-6"
              >
                <span className="shrink-0 text-sm font-medium text-brand-primary sm:w-28">
                  {item.disclosureDate.slice(0, 10)}
                </span>
                <span>
                  {item.announcementNo && (
                    <span className="mr-2 text-xs text-brand-neutral-300">
                      {item.announcementNo}
                    </span>
                  )}
                  <span className="font-semibold text-brand-neutral-900">
                    {item.title}
                  </span>
                  {item.isFallback && (
                    <span className="mt-1 block text-xs text-brand-neutral-300">
                      {tCommon("notTranslated")}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="py-8 text-center text-sm text-brand-neutral-300">
              —
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
