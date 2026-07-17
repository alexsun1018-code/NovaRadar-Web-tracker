import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getStaticPage } from "@/lib/cms/pages";
import { getNewsList } from "@/lib/cms/news";
import { localizedField } from "@/lib/i18n/localizedField";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SubNav from "@/components/layout/SubNav";
import PageHeaderBanner from "@/components/layout/PageHeaderBanner";
import StaticPageBody from "@/components/sections/StaticPageBody";
import NewsList from "@/components/sections/NewsList";

export default async function NewsGeneralPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Nav");

  const [page, articles] = await Promise.all([
    getStaticPage("news-intro", locale),
    getNewsList(),
  ]);

  const items = articles.map((article) => {
    const title = localizedField(article, locale, "title");
    const summary = localizedField(article, locale, "summary");
    return {
      slug: article.slug,
      title: title.value,
      publishDate: article.publish_date,
      category: article.category,
      summary: summary.value,
      isFallback: title.isFallback,
    };
  });

  return (
    <>
      <Header />
      <PageHeaderBanner title={t("newsGeneral")} image="/images/banner-news.jpg" />
      <SubNav parentKey="news" current="newsGeneral" />
      <main className="flex-1">
        <StaticPageBody page={page} />
        <NewsList items={items} />
      </main>
      <Footer />
    </>
  );
}
