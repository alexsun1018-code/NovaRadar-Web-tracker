import { notFound } from "next/navigation";
import { getNewsBySlug, getNewsList } from "@/lib/cms/news";
import { localizedField } from "@/lib/i18n/localizedField";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NewsDetail from "@/components/sections/NewsDetail";

export async function generateStaticParams() {
  const articles = await getNewsList();
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  const title = localizedField(article, "title");
  const content = localizedField(article, "content");
  const sourceName = localizedField(article, "source_name");

  return (
    <>
      <Header />
      <main className="flex-1">
        <NewsDetail
          article={{
            title: title.value,
            publishDate: article.publish_date,
            category: article.category,
            content: content.value,
            sourceName: sourceName.value || undefined,
            sourceUrl: article.source_url,
            isFallback: title.isFallback || content.isFallback,
          }}
        />
      </main>
      <Footer />
    </>
  );
}
