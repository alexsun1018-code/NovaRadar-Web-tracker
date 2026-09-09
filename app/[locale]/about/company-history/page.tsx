import { getTranslations } from "next-intl/server";
import { getCompanyHistory } from "@/lib/cms/companyHistory";
import { localizedField } from "@/lib/i18n/localizedField";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHeaderBanner from "@/components/layout/PageHeaderBanner";
import CompanyHistoryTimeline from "@/components/sections/CompanyHistoryTimeline";

export default async function CompanyHistoryPage() {
  const t = await getTranslations("Nav");

  const historyYears = await getCompanyHistory();

  const yearViews = historyYears.map((entry) => ({
    year: entry.year,
    milestones: entry.milestones.map((milestone) => ({
      date: milestone.date,
      title: localizedField(milestone, "title").value,
      description: localizedField(milestone, "description").value,
    })),
  }));

  return (
    <>
      <Header />
      <PageHeaderBanner title={t("companyHistory")} image="/images/banner-about.jpg" />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 pb-8 sm:px-6 lg:px-8">
          <h2 className="flex items-center gap-3 text-2xl font-bold text-brand-primary">
            <span aria-hidden className="h-6 w-1 rounded-sm bg-brand-primary" />
            {t("companyHistory")}
          </h2>
          <div className="mt-8">
            <CompanyHistoryTimeline years={yearViews} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
