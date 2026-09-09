import { getTranslations } from "next-intl/server";
import { getStaticPage } from "@/lib/cms/pages";
import { getContactInfo } from "@/lib/cms/contactInfo";
import { localizedField } from "@/lib/i18n/localizedField";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHeaderBanner from "@/components/layout/PageHeaderBanner";
import StaticPageBody from "@/components/sections/StaticPageBody";
import ContactForm from "@/components/sections/ContactForm";
import ContactInfoBlock from "@/components/sections/ContactInfoBlock";

export default async function ContactPage() {
  const t = await getTranslations("Nav");

  const [page, info] = await Promise.all([
    getStaticPage("contact"),
    getContactInfo(),
  ]);

  const address = localizedField(info, "address");

  return (
    <>
      <Header />
      <PageHeaderBanner title={t("contact")} image="/images/banner-contact.jpg" />
      <main className="flex-1 pb-20">
        <StaticPageBody page={page} />
        <ContactForm />
        <ContactInfoBlock
          info={{
            phone: info.phone,
            email: info.email,
            address: address.value,
          }}
        />
      </main>
      <Footer />
    </>
  );
}
