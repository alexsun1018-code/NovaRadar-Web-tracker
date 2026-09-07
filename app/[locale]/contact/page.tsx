import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getStaticPage } from "@/lib/cms/pages";
import { getContactInfo } from "@/lib/cms/contactInfo";
import { localizedField } from "@/lib/i18n/localizedField";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHeaderBanner from "@/components/layout/PageHeaderBanner";
import StaticPageBody from "@/components/sections/StaticPageBody";
import ContactInfoBlock from "@/components/sections/ContactInfoBlock";

export default async function ContactPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Nav");

  const [page, info] = await Promise.all([
    getStaticPage("contact", locale),
    getContactInfo(),
  ]);

  const address = localizedField(info, locale, "address");
  const contactPersonName = localizedField(info, locale, "contact_person_name");
  const contactPersonTitle = localizedField(
    info,
    locale,
    "contact_person_title"
  );

  return (
    <>
      <Header />
      <PageHeaderBanner title={t("contact")} image="/images/banner-contact.jpg" />
      <main className="flex-1">
        <StaticPageBody page={page} />
        <ContactInfoBlock
          info={{
            phone: info.phone,
            email: info.email,
            address: address.value,
            contactPersonName: contactPersonName.value,
            contactPersonTitle: contactPersonTitle.value,
          }}
        />
      </main>
      <Footer />
    </>
  );
}
