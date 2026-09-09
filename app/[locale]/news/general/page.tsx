import { getTranslations } from "next-intl/server";
import { getStaticPage } from "@/lib/cms/pages";
import { getNewsList } from "@/lib/cms/news";
import { localizedField } from "@/lib/i18n/localizedField";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SubNav from "@/components/layout/SubNav";
import PageHeaderBanner from "@/components/layout/PageHeaderBanner";
import StaticPageBody from "@/components/sections/StaticPageBody";
import NewsFeed from "@/components/sections/NewsFeed";

export default async function NewsGeneralPage() {
  const t = await getTranslations("Nav");

  const [page, articles] = await Promise.all([
    getStaticPage("news-intro"),
    getNewsList(),
  ]);

  const items = articles.map((article) => {
    const title = localizedField(article, "title");
    const summary = localizedField(article, "summary");
    const content = localizedField(article, "content");
    const sourceName = localizedField(article, "source_name");
    return {
      slug: article.slug,
      title: title.value,
      publishDate: article.publish_date,
      category: article.category,
      summary: summary.value,
      content: content.value,
      photo: article.cover_image,
      gallery: article.gallery ?? [],
      sourceName: sourceName.value || undefined,
      sourceUrl: article.source_url,
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
        <NewsFeed items={items} />
      </main>
      <Footer />
    </>
  );
}
