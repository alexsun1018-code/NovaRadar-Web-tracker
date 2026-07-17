import { getTranslations } from "next-intl/server";
import type { StaticPage } from "@/lib/cms/types";

export default async function StaticPageBody({
  page,
  contained = true,
}: {
  page: StaticPage;
  /** 頁面自帶版面（如側邊選單版型）時傳 false，改由外層控制寬度與間距 */
  contained?: boolean;
}) {
  const tCommon = await getTranslations("Common");

  const body = (
    <>
      {page.isFallback && (
        <p className="mb-6 inline-block rounded-full bg-brand-neutral-100 px-3 py-1 text-xs text-brand-neutral-600">
          {tCommon("notTranslated")}
        </p>
      )}
      {/* data/pages/*.md 內容由我方撰寫，非使用者輸入，故可安全 dangerouslySetInnerHTML */}
      <div
        className="md-content"
        dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
      />
    </>
  );

  if (!contained) {
    return <div className="py-8">{body}</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      {body}
    </div>
  );
}
