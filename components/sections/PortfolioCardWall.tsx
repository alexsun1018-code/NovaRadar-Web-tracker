"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Icon from "@/components/ui/Icon";
import type { PortfolioSector } from "@/lib/cms/types";

export interface PortfolioCardView {
  id: string;
  name: string;
  description: string;
  sector: PortfolioSector[];
  investmentYear?: number;
  investmentStage?: string;
  websiteUrl?: string;
  isExited: boolean;
  isFallback: boolean;
}

const SECTORS: PortfolioSector[] = ["新藥研發", "醫療技術及其他"];

export default function PortfolioCardWall({
  companies,
}: {
  companies: PortfolioCardView[];
}) {
  const t = useTranslations("Portfolio");
  const tCommon = useTranslations("Common");
  const tStage = useTranslations("Taxonomy.investmentStage");
  const [active, setActive] = useState<PortfolioSector>(SECTORS[0]);

  const filtered = useMemo(
    () => companies.filter((company) => company.sector.includes(active)),
    [companies, active]
  );

  const tabLabel: Record<PortfolioSector, string> = {
    新藥研發: t("tabs.drugRnD"),
    醫療技術及其他: t("tabs.medtechOther"),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="flex justify-center gap-3">
        {SECTORS.map((sector) => (
          <button
            key={sector}
            type="button"
            onClick={() => setActive(sector)}
            aria-pressed={active === sector}
            className={`rounded-full px-6 py-2.5 text-base font-bold transition ${
              active === sector
                ? "bg-brand-primary text-white"
                : "bg-brand-neutral-50 text-brand-neutral-600 hover:text-brand-primary"
            }`}
          >
            {tabLabel[sector]}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((company) => (
          <div
            key={company.id}
            className="flex flex-col rounded-2xl border border-brand-neutral-100 bg-white p-8"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-xl font-bold text-brand-neutral-900">
                {company.name}
              </span>
              {company.isExited && (
                <span className="whitespace-nowrap rounded-full bg-brand-neutral-100 px-3 py-1 text-sm font-medium text-brand-neutral-600">
                  {t("exited")}
                </span>
              )}
            </div>

            {company.description && (
              <p className="mt-3 flex-1 text-base text-brand-neutral-600">
                {company.description}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2 text-sm font-medium text-brand-neutral-600">
              {company.investmentYear && (
                <span className="rounded-full bg-brand-neutral-50 px-3 py-1">
                  {company.investmentYear}
                </span>
              )}
              {company.investmentStage && (
                <span className="rounded-full bg-brand-neutral-50 px-3 py-1">
                  {tStage(company.investmentStage)}
                </span>
              )}
            </div>

            {company.isFallback && (
              <p className="mt-3 text-xs text-brand-neutral-300">
                {tCommon("notTranslated")}
              </p>
            )}

            {company.websiteUrl && (
              <a
                href={company.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-base font-bold text-brand-primary hover:underline"
              >
                {t("visitWebsite")}
                <Icon name="externalLink" className="h-5 w-5" />
              </a>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full text-center text-sm text-brand-neutral-300">
            —
          </p>
        )}
      </div>
    </div>
  );
}
