"use client";

export default function YearSidebar({
  years,
  activeYear,
  onSelectYear,
}: {
  years: string[];
  activeYear: string | null;
  onSelectYear: (year: string) => void;
}) {
  return (
    <nav className="shrink-0 sm:w-28">
      <ul>
        {years.map((year) => {
          const isActive = year === activeYear;
          return (
            <li key={year}>
              <button
                type="button"
                onClick={() => onSelectYear(year)}
                aria-expanded={isActive}
                className={`flex w-full items-center gap-1.5 border-b border-l-2 border-brand-neutral-100 py-3 pl-3 text-left text-sm transition ${
                  isActive
                    ? "border-l-brand-primary font-semibold text-brand-primary"
                    : "border-l-transparent text-brand-neutral-600 hover:text-brand-primary"
                }`}
              >
                <span
                  aria-hidden
                  className={`inline-block text-[10px] transition-transform ${
                    isActive
                      ? "rotate-90 text-brand-primary"
                      : "text-brand-neutral-300"
                  }`}
                >
                  ▸
                </span>
                {year}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
