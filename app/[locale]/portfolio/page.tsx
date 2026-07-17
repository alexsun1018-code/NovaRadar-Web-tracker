import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getStaticPage } from "@/lib/cms/pages";
import { getAllPortfolioCompanies } from "@/lib/cms/portfolio";
import { localizedField } from "@/lib/i18n/localizedField";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHeaderBanner from "@/components/layout/PageHeaderBanner";
import StaticPageBody from "@/components/sections/StaticPageBody";
import PortfolioCardWall from "@/components/sections/PortfolioCardWall";

export default async function PortfolioPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Nav");

  const [page, companies] = await Promise.all([
    getStaticPage("portfolio-intro", locale),
    getAllPortfolioCompanies(),
  ]);

  const companyViews = companies.map((company) => {
    const name = localizedField(company, locale, "company_name");
    const description = localizedField(company, locale, "description");
    return {
      id: company.id,
      name: name.value,
      description: description.value,
      sector: company.sector,
      investmentYear: company.investment_year,
      investmentStage: company.investment_stage,
      websiteUrl: company.website_url,
      isExited: company.is_exited,
      isFallback: name.isFallback,
    };
  });

  return (
    <>
      <Header />
      <PageHeaderBanner title={t("portfolio")} image="/images/banner-portfolio.jpg" />
      <main className="flex-1">
        <StaticPageBody page={page} />
        <PortfolioCardWall companies={companyViews} />
      </main>
      <Footer />
    </>
  );
}
