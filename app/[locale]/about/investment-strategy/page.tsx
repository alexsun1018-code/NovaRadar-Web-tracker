import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getStaticPage } from "@/lib/cms/pages";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SubNav from "@/components/layout/SubNav";
import PageHeaderBanner from "@/components/layout/PageHeaderBanner";
import StaticPageBody from "@/components/sections/StaticPageBody";

export default async function InvestmentStrategyPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Nav");
  const page = await getStaticPage("investment-strategy", locale);

  return (
    <>
      <Header />
      <PageHeaderBanner title={t("investmentStrategy")} image="/images/banner-about.jpg" />
      <main className="flex-1">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:flex-row sm:px-6 lg:px-8">
          <SubNav parentKey="about" current="investmentStrategy" layout="vertical" />
          <div className="min-w-0 flex-1">
            <h2 className="flex items-center gap-3 text-2xl font-bold text-brand-primary">
              <span aria-hidden className="h-6 w-1 rounded-sm bg-brand-primary" />
              {t("investmentStrategy")}
            </h2>
            <StaticPageBody page={page} contained={false} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
