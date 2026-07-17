import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export interface DisclosureDetailView {
  title: string;
  disclosureDate: string;
  category: string;
  announcementNo?: string;
  content: string;
  isFallback: boolean;
}

export default async function DisclosureDetail({
  disclosure,
}: {
  disclosure: DisclosureDetailView;
}) {
  const tCommon = await getTranslations("Common");
  const tNav = await getTranslations("Nav");
  const tNews = await getTranslations("News");
  const tCategory = await getTranslations("Taxonomy.disclosureCategory");

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/news/disclosures"
        className="text-sm text-brand-primary hover:underline"
      >
        ← {tNav("newsDisclosures")}
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-brand-neutral-600">
        {disclosure.announcementNo && (
          <span>
            {tNews("announcementNo")}：{disclosure.announcementNo}
          </span>
        )}
        <span className="rounded-full bg-brand-neutral-50 px-2.5 py-1">
          {tCategory(disclosure.category)}
        </span>
        <span>{disclosure.disclosureDate.slice(0, 10)}</span>
      </div>

      <h1 className="mt-3 text-2xl font-bold text-brand-primary sm:text-3xl">
        {disclosure.title}
      </h1>

      {disclosure.isFallback && (
        <p className="mt-4 inline-block rounded-full bg-brand-neutral-100 px-3 py-1 text-xs text-brand-neutral-600">
          {tCommon("notTranslated")}
        </p>
      )}

      <div className="mt-6 whitespace-pre-line leading-relaxed text-brand-neutral-900">
        {disclosure.content}
      </div>
    </article>
  );
}
