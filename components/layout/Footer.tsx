import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { legalNav } from "@/lib/nav/config";

export default async function Footer() {
  const t = await getTranslations("Nav");
  const tFooter = await getTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-neutral-100 bg-brand-primary text-brand-neutral-50">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-10 text-center sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {legalNav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-base font-bold hover:underline"
            >
              {t(item.key)}
            </Link>
          ))}
        </div>

        <p className="text-xs text-brand-neutral-300">
          {tFooter("rights", { year })}
        </p>
      </div>
    </footer>
  );
}
