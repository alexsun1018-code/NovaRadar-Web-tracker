import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { mainNav } from "@/lib/nav/config";

export default async function SubNav({
  parentKey,
  current,
  layout = "horizontal",
}: {
  parentKey: string;
  current: string;
  layout?: "horizontal" | "vertical";
}) {
  const t = await getTranslations("Nav");
  const parent = mainNav.find((item) => item.key === parentKey);
  const children = parent?.children ?? [];

  if (layout === "vertical") {
    return (
      <nav className="shrink-0 sm:w-44">
        <ul>
          {children.map((item) => {
            const isActive = item.key === current;
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-1.5 border-b border-l-2 border-brand-neutral-100 py-3 pl-3 text-sm transition ${
                    isActive
                      ? "border-l-brand-primary font-semibold text-brand-primary"
                      : "border-l-transparent text-brand-neutral-600 hover:text-brand-primary"
                  }`}
                >
                  {isActive && <span aria-hidden>－</span>}
                  {t(item.key)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <nav className="border-b border-brand-neutral-100 bg-brand-neutral-50">
      <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
        {children.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={
              item.key === current
                ? "whitespace-nowrap text-sm font-medium text-brand-primary underline underline-offset-4"
                : "whitespace-nowrap text-sm font-medium text-brand-neutral-600 hover:text-brand-primary"
            }
          >
            {t(item.key)}
          </Link>
        ))}
      </div>
    </nav>
  );
}
