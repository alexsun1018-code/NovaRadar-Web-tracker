import { getTranslations } from "next-intl/server";
import Icon, { type IconName } from "@/components/ui/Icon";

export interface ValuePropView {
  id: string;
  icon: string;
  title: string;
  description: string;
  isFallback: boolean;
}

export default async function ValueProps({
  items,
}: {
  items: ValuePropView[];
}) {
  const t = await getTranslations("ValueProps");
  const tCommon = await getTranslations("Common");

  return (
    <section className="flex min-h-screen flex-col justify-center bg-section-blue-50 py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* 2026-09-08 標題／副標兩階版面，比照 The Clinical-Value Bridge 樣式（title 為主標，subtitle 為次要說明） */}
          <h2 className="text-3xl font-bold text-brand-primary sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-xl font-medium text-brand-neutral-700 sm:text-2xl">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-brand-neutral-100 bg-white p-8"
            >
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                <Icon name={item.icon as IconName} className="h-8 w-8" />
              </span>
              <h3 className="mt-5 text-xl font-bold text-brand-neutral-900">
                {item.title}
              </h3>
              <p className="mt-3 text-base text-brand-neutral-600">
                {item.description}
              </p>
              {item.isFallback && (
                <p className="mt-2 text-xs text-brand-neutral-300">
                  {tCommon("notTranslated")}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
