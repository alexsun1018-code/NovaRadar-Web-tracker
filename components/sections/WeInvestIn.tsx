import { getTranslations } from "next-intl/server";
import Icon, { type IconName } from "@/components/ui/Icon";

const items: { key: string; icon: IconName }[] = [
  { key: "marketGap", icon: "target" },
  { key: "techInnovation", icon: "lightbulb" },
  { key: "domainExpertise", icon: "users" },
];

export default async function WeInvestIn() {
  const t = await getTranslations("WeInvestIn");

  return (
    <section className="bg-section-blue-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-brand-primary sm:text-4xl">
          {t("title")}
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.key}
              className="rounded-2xl border border-brand-neutral-100 bg-background p-8 text-center"
            >
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                <Icon name={item.icon} className="h-8 w-8" />
              </span>
              <h3 className="mt-5 text-xl font-bold text-brand-neutral-900">
                {t(`items.${item.key}.label`)}
              </h3>
              <p className="mt-3 text-base text-brand-neutral-600">
                {t(`items.${item.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
