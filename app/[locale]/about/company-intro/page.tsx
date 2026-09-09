import { getTranslations } from "next-intl/server";
import { getStaticPage } from "@/lib/cms/pages";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHeaderBanner from "@/components/layout/PageHeaderBanner";
import StaticPageBody from "@/components/sections/StaticPageBody";

export default async function CompanyIntroPage() {
  const t = await getTranslations("Nav");
  const page = await getStaticPage("company-intro");

  return (
    <>
      <Header />
      <PageHeaderBanner title={t("companyIntro")} image="/images/banner-about.jpg" />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <StaticPageBody page={page} contained={false} />
        </div>
      </main>
      <Footer />
    </>
  );
}
