export interface HistoryYearView {
  year: number;
  milestones: { date: string; title: string; description: string }[];
}

export default function CompanyHistoryTimeline({
  years,
}: {
  years: HistoryYearView[];
}) {
  if (years.length === 0) return null;

  return (
    <div className="divide-y divide-brand-neutral-100">
      {years.map((entry) => (
        <div
          key={entry.year}
          className="grid grid-cols-1 gap-3 py-6 first:pt-0 sm:grid-cols-[96px_1fr] sm:gap-6"
        >
          <span className="text-2xl font-bold text-brand-accent">
            {entry.year}
          </span>
          <ul className="space-y-3">
            {entry.milestones.map((milestone, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed">
                <span aria-hidden className="mt-1 text-brand-neutral-300">
                  •
                </span>
                <span>
                  <span className="font-medium text-brand-neutral-900">
                    {milestone.title}
                  </span>
                  {milestone.description && (
                    <span className="text-brand-neutral-600">
                      ，{milestone.description}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
