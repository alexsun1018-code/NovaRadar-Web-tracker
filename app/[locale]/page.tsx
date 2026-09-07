import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getHeroSlides } from "@/lib/cms/hero";
import { getValueProps } from "@/lib/cms/valueProps";
import { localizedField } from "@/lib/i18n/localizedField";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroCarousel from "@/components/sections/HeroCarousel";
import ValueProps from "@/components/sections/ValueProps";
import ClinicalValueBridge from "@/components/sections/ClinicalValueBridge";
import WeInvestIn from "@/components/sections/WeInvestIn";
import StrategicFocusAreas from "@/components/sections/StrategicFocusAreas";

export default async function HomePage() {
  const locale = (await getLocale()) as Locale;

  const [heroSlides, valueProps] = await Promise.all([
    getHeroSlides(),
    getValueProps(),
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
      icon: item.icon,
      title: title.value,
      description: description.value,
      isFallback: title.isFallback || description.isFallback,
    };
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroCarousel slides={heroSlideViews} />
        <ValueProps items={valuePropViews} />
        <ClinicalValueBridge />
        <WeInvestIn />
        <StrategicFocusAreas />
      </main>
      <Footer />
    </>
  );
}
