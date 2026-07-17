import { getTranslations } from "next-intl/server";
import Image from "next/image";

export interface ValuePropView {
  id: string;
  image: string;
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
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-brand-primary sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-lg text-brand-neutral-600">{t("subtitle")}</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-brand-neutral-100 bg-white p-8 text-center"
            >
              <span className="mx-auto block h-20 w-20 overflow-hidden rounded-full ring-4 ring-brand-primary/10">
                <Image
                  src={item.image}
                  alt=""
                  width={160}
                  height={160}
                  className="h-full w-full object-cover"
                />
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
