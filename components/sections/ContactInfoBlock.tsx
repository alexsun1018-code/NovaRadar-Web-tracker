import { getTranslations } from "next-intl/server";

export interface ContactInfoView {
  phone: string;
  email: string;
  address: string;
}

export default async function ContactInfoBlock({
  info,
}: {
  info: ContactInfoView;
}) {
  const t = await getTranslations("ContactPage");
  const rows: { label: string; content: React.ReactNode }[] = [];

  if (info.phone) {
    rows.push({ label: t("phone"), content: info.phone });
  }
  if (info.email) {
    rows.push({ label: t("email"), content: info.email });
  }
  if (info.address) {
    rows.push({
      label: t("address"),
      content: (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            info.address
          )}`}
          target="_blank"
          rel="noreferrer"
          className="text-brand-primary hover:underline"
        >
          {info.address}
        </a>
      ),
    });
  }

  if (rows.length === 0) return null;

  return (
    <div className="mx-auto max-w-xl px-4 pb-4 sm:px-6 lg:px-8">
      <dl className="space-y-3 border-t border-brand-neutral-100 pt-8 text-center text-sm">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="inline font-medium text-brand-neutral-600">
              {row.label}：
            </dt>
            <dd className="inline text-brand-neutral-900">{row.content}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
