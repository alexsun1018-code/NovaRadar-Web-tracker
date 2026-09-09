import { getTranslations } from "next-intl/server";
import { getStaticPage } from "@/lib/cms/pages";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StaticPageBody from "@/components/sections/StaticPageBody";

export default async function DisclaimerPage() {
  const t = await getTranslations("Nav");
  const page = await getStaticPage("legal-disclaimer");

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-brand-primary">
            {t("legalDisclaimer")}
          </h1>
        </div>
        <StaticPageBody page={page} />
      </main>
      <Footer />
    </>
  );
}
