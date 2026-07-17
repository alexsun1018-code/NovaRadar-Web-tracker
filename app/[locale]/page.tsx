import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getHeroSlides } from "@/lib/cms/hero";
import { getValueProps } from "@/lib/cms/valueProps";
import { getFeaturedPortfolioCompanies } from "@/lib/cms/portfolio";
import { localizedField } from "@/lib/i18n/localizedField";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroCarousel from "@/components/sections/HeroCarousel";
import ValueProps from "@/components/sections/ValueProps";
import PortfolioLogoWall from "@/components/sections/PortfolioLogoWall";
import ProposalForm from "@/components/sections/ProposalForm";

export default async function HomePage() {
  const locale = (await getLocale()) as Locale;

  const [heroSlides, valueProps, portfolioCompanies] = await Promise.all([
    getHeroSlides(),
    getValueProps(),
    getFeaturedPortfolioCompanies(),
  ]);

  const heroSlideViews = heroSlides.map((slide) => {
    const title = localizedField(slide, locale, "title");
    const subtitle = localizedField(slide, locale, "subtitle");
    const ctaLabel = localizedField(slide, locale, "ctaLabel");
    return {
      id: slide.id,
      title: title.value,
      subtitle: subtitle.value,
      ctaLabel: ctaLabel.value,
      ctaHref: slide.ctaHref,
      background: slide.background,
      isFallback: title.isFallback || subtitle.isFallback,
    };
  });

  const valuePropViews = valueProps.map((item) => {
    const title = localizedField(item, locale, "title");
    const description = localizedField(item, locale, "description");
    return {
      id: item.id,
      image: item.image,
      title: title.value,
      description: description.value,
      isFallback: title.isFallback || description.isFallback,
    };
  });

  const portfolioViews = portfolioCompanies.map((company) => {
    const name = localizedField(company, locale, "company_name");
    return {
      id: company.id,
      name: name.value,
      logo: company.logo,
      sector: company.sector,
      websiteUrl: company.website_url,
      isFallback: name.isFallback,
    };
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroCarousel slides={heroSlideViews} />
        <ValueProps items={valuePropViews} />
        <PortfolioLogoWall companies={portfolioViews} />
        <ProposalForm />
      </main>
      <Footer />
    </>
  );
}
