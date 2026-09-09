import { getTranslations } from "next-intl/server";
import { getDisclosureList } from "@/lib/cms/disclosures";
import { localizedField } from "@/lib/i18n/localizedField";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SubNav from "@/components/layout/SubNav";
import PageHeaderBanner from "@/components/layout/PageHeaderBanner";
import DisclosureList from "@/components/sections/DisclosureList";

export default async function NewsDisclosuresPage() {
  const t = await getTranslations("Nav");

  const disclosures = await getDisclosureList();

  const items = disclosures.map((disclosure) => {
    const title = localizedField(disclosure, "title");
    return {
      slug: disclosure.slug,
      title: title.value,
      disclosureDate: disclosure.disclosure_date,
      category: disclosure.category,
      announcementNo: disclosure.announcement_no,
      isFallback: title.isFallback,
    };
  });

  return (
    <>
      <Header />
      <PageHeaderBanner title={t("newsDisclosures")} image="/images/banner-news.jpg" />
      <SubNav parentKey="news" current="newsDisclosures" />
      <main className="flex-1 pt-10">
        <DisclosureList items={items} />
      </main>
      <Footer />
    </>
  );
}
