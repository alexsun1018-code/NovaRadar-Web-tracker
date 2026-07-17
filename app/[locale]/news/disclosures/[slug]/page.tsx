import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getDisclosureBySlug, getDisclosureList } from "@/lib/cms/disclosures";
import { localizedField } from "@/lib/i18n/localizedField";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DisclosureDetail from "@/components/sections/DisclosureDetail";

export async function generateStaticParams() {
  const disclosures = await getDisclosureList();
  return disclosures.map((disclosure) => ({ slug: disclosure.slug }));
}

export default async function DisclosureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const disclosure = await getDisclosureBySlug(slug);

  if (!disclosure) {
    notFound();
  }

  const title = localizedField(disclosure, locale, "title");
  const content = localizedField(disclosure, locale, "content");

  return (
    <>
      <Header />
      <main className="flex-1">
        <DisclosureDetail
          disclosure={{
            title: title.value,
            disclosureDate: disclosure.disclosure_date,
            category: disclosure.category,
            announcementNo: disclosure.announcement_no,
            content: content.value,
            isFallback: title.isFallback || content.isFallback,
          }}
        />
      </main>
      <Footer />
    </>
  );
}
