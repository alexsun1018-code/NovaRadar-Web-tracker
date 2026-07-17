"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Icon from "@/components/ui/Icon";
import type { PortfolioSector } from "@/lib/cms/types";

export interface PortfolioCompanyView {
  id: string;
  name: string;
  logo: string;
  sector: PortfolioSector[];
  websiteUrl?: string;
  isFallback: boolean;
}

const SECTORS: PortfolioSector[] = ["新藥研發", "醫療技術及其他"];

export default function PortfolioLogoWall({
  companies,
}: {
  companies: PortfolioCompanyView[];
}) {
  const t = useTranslations("Portfolio");
  const [active, setActive] = useState<PortfolioSector>(SECTORS[0]);

  const filtered = useMemo(
    () => companies.filter((c) => c.sector.includes(active)),
    [companies, active]
  );

  const tabLabel: Record<PortfolioSector, string> = {
    新藥研發: t("tabs.drugRnD"),
    醫療技術及其他: t("tabs.medtechOther"),
  };

  return (
    <section className="flex min-h-screen flex-col justify-center bg-section-green-50 py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-brand-primary sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-lg text-brand-neutral-600">{t("subtitle")}</p>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          {SECTORS.map((sector) => (
            <button
              key={sector}
              type="button"
              onClick={() => setActive(sector)}
              className={`rounded-full px-6 py-2.5 text-base font-bold transition ${
                active === sector
                  ? "bg-brand-primary text-white"
                  : "bg-white text-brand-neutral-600 hover:text-brand-primary"
              }`}
            >
              {tabLabel[sector]}
            </button>
          ))}
        </div>

        {/* logo 圖檔尚未提供，先以公司名稱文字呈現作為 placeholder */}
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((company) => (
            <a
              key={company.id}
              href={company.websiteUrl ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="group flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-brand-neutral-100 bg-white p-4 text-center transition hover:border-brand-primary"
            >
              <span className="text-lg font-bold text-brand-neutral-600 grayscale transition group-hover:text-brand-primary group-hover:grayscale-0">
                {company.name}
              </span>
              <span className="flex items-center gap-1 text-sm text-brand-neutral-300 group-hover:text-brand-primary">
                {t("visitWebsite")}
                <Icon name="externalLink" className="h-4 w-4" />
              </span>
            </a>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-sm text-brand-neutral-300">
              —
            </p>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/portfolio"
            className="text-base font-bold text-brand-primary hover:underline"
          >
            {t("viewAll")} →
          </Link>
        </div>
      </div>
    </section>
  );
}
