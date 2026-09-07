import { getTranslations } from "next-intl/server";
import ComingSoonIllustration from "@/components/ui/ComingSoonIllustration";

export default async function ComingSoonPage({
  titleKey,
  variant,
}: {
  titleKey: string;
  variant: "esg" | "investors" | "careers" | "auth";
}) {
  const t = await getTranslations("Nav");
  const tComingSoon = await getTranslations("ComingSoonPage");
  const tCommon = await getTranslations("Common");

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <ComingSoonIllustration variant={variant} />
      <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-brand-accent">
        {tCommon("comingSoon")}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-brand-primary">
        {t(titleKey)}
      </h1>
      <p className="mt-4 text-brand-neutral-600">
        {tComingSoon("subtitle")}
      </p>
    </div>
  );
}
