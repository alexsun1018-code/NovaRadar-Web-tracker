import { getTranslations } from "next-intl/server";
import Icon, { type IconName } from "@/components/ui/Icon";

const areas: { key: string; icon: IconName }[] = [
  { key: "cancer", icon: "barChart" },
  { key: "targetDrug", icon: "lightbulb" },
  { key: "rareDisease", icon: "shield" },
  { key: "neuro", icon: "leaf" },
];

export default async function StrategicFocusAreas() {
  const t = await getTranslations("StrategicFocus");

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-brand-primary sm:text-4xl">
          {t("title")}
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2">
          {areas.map((area, i) => (
            <div key={area.key} className="flex gap-5">
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center text-brand-secondary"
                style={{
                  borderRadius: "50% 50% 50% 0",
                  transform: `rotate(${i * 90}deg)`,
                  backgroundColor: "var(--section-green-50)",
                }}
              >
                <span style={{ transform: `rotate(${-i * 90}deg)` }}>
                  <Icon name={area.icon} className="h-6 w-6" />
                </span>
              </span>
              <div>
                <h3 className="text-lg font-bold text-brand-primary">
                  {t(`areas.${area.key}.label`)}
                </h3>
                <p className="mt-1.5 text-sm text-brand-neutral-600 first-letter:mr-0.5 first-letter:text-lg first-letter:font-bold first-letter:text-red-600">
                  {t(`areas.${area.key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
