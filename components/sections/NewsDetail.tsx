import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Icon from "@/components/ui/Icon";

export interface NewsDetailView {
  title: string;
  publishDate: string;
  category: string;
  content: string;
  sourceName?: string;
  sourceUrl?: string;
  isFallback: boolean;
}

export default async function NewsDetail({
  article,
}: {
  article: NewsDetailView;
}) {
  const tCommon = await getTranslations("Common");
  const tNav = await getTranslations("Nav");
  const tNews = await getTranslations("News");
  const tCategory = await getTranslations("Taxonomy.newsCategory");

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/news/general"
        className="text-sm text-brand-primary hover:underline"
      >
        ← {tNav("newsGeneral")}
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-brand-neutral-600">
        <span>{article.publishDate}</span>
        <span className="rounded-full bg-brand-neutral-50 px-2.5 py-1">
          {tCategory(article.category)}
        </span>
      </div>

      <h1 className="mt-3 text-2xl font-bold text-brand-primary sm:text-3xl">
        {article.title}
      </h1>

      {article.isFallback && (
        <p className="mt-4 inline-block rounded-full bg-brand-neutral-100 px-3 py-1 text-xs text-brand-neutral-600">
          {tCommon("notTranslated")}
        </p>
      )}

      <div className="mt-6 whitespace-pre-line leading-relaxed text-brand-neutral-900">
        {article.content}
      </div>

      {article.sourceName && (
        <p className="mt-8 flex items-center gap-1 text-sm text-brand-neutral-600">
          {tNews("source")}：{article.sourceName}
          {article.sourceUrl && (
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-brand-primary hover:underline"
            >
              <Icon name="externalLink" className="h-3.5 w-3.5" />
            </a>
          )}
        </p>
      )}
    </article>
  );
}
