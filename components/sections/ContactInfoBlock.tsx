import { getTranslations } from "next-intl/server";

export interface ContactInfoView {
  phone: string;
  email: string;
  address: string;
  contactPersonName: string;
  contactPersonTitle: string;
}

export default async function ContactInfoBlock({
  info,
}: {
  info: ContactInfoView;
}) {
  const t = await getTranslations("ContactPage");

  const rows = [
    { label: t("phone"), value: info.phone },
    { label: t("email"), value: info.email },
    { label: t("address"), value: info.address },
    {
      label: t("contactPerson"),
      value: [info.contactPersonName, info.contactPersonTitle]
        .filter(Boolean)
        .join(" "),
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 pb-4 sm:px-6 lg:px-8">
      <dl className="grid grid-cols-1 gap-4 rounded-2xl border border-brand-neutral-100 p-6 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-xs font-medium uppercase tracking-wide text-brand-neutral-300">
              {row.label}
            </dt>
            <dd className="mt-1 text-sm text-brand-neutral-900">
              {row.value || t("notProvided")}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
