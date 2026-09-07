import { getTranslations } from "next-intl/server";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";

const steps: { key: string; icon: IconName }[] = [
  { key: "source", icon: "search" },
  { key: "bridge", icon: "bridge" },
  { key: "accelerate", icon: "rocket" },
  { key: "exit", icon: "target" },
];

export default async function ClinicalValueBridge() {
  const t = await getTranslations("ClinicalBridge");

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-brand-primary sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-lg text-brand-neutral-600">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, i) => (
            <div key={step.key} className="relative text-center">
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-1/2 top-9 hidden h-px w-full bg-brand-neutral-100 lg:block"
                />
              )}
              <span className="relative z-10 mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border-2 border-brand-secondary bg-background text-brand-secondary shadow-[0_0_0_6px_var(--section-blue-50)]">
                <Icon name={step.icon} className="h-7 w-7" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-brand-primary">
                {t(`steps.${step.key}.label`)}
              </h3>
              <p className="mt-2 text-sm text-brand-neutral-600">
                {t(`steps.${step.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
