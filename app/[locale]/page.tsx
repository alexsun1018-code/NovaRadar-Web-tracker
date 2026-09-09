import { getHeroSlides } from "@/lib/cms/hero";
import { getValueProps } from "@/lib/cms/valueProps";
import { localizedField } from "@/lib/i18n/localizedField";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroCarousel from "@/components/sections/HeroCarousel";
import ValueProps from "@/components/sections/ValueProps";
import ClinicalValueBridge from "@/components/sections/ClinicalValueBridge";
import WeInvestIn from "@/components/sections/WeInvestIn";

export default async function HomePage() {
  const [heroSlides, valueProps] = await Promise.all([
    getHeroSlides(),
    getValueProps(),
  ]);

  const heroSlideViews = heroSlides.map((slide) => {
    const subtitle = localizedField(slide, "subtitle");
    return {
      id: slide.id,
      subtitle: subtitle.value,
      background: slide.background,
      isFallback: subtitle.isFallback,
    };
  });

  const valuePropViews = valueProps.map((item) => {
    const title = localizedField(item, "title");
    const description = localizedField(item, "description");
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
      </main>
      <Footer />
    </>
  );
}
