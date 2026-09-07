import { notFound } from "next/navigation";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getTeamMemberBySlug, getTeamMembers } from "@/lib/cms/team";
import { localizedField } from "@/lib/i18n/localizedField";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHeaderBanner from "@/components/layout/PageHeaderBanner";
import Icon from "@/components/ui/Icon";

export async function generateStaticParams() {
  const members = await getTeamMembers();
  return members.map((member) => ({ slug: member.slug }));
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("TeamPage");
  const member = await getTeamMemberBySlug(slug);

  if (!member) {
    notFound();
  }

  const name = localizedField(member, locale, "name");
  const title = localizedField(member, locale, "title");
  const bio = localizedField(member, locale, "bio");
  const paragraphs = bio.value.split("\n\n").filter(Boolean);

  return (
    <>
      <Header />
      <PageHeaderBanner title={name.value} image="/images/banner-about.jpg" />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/about/leadership-team"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-neutral-600 hover:text-brand-primary"
          >
            <Icon name="chevronLeft" className="h-4 w-4" />
            {t("backToTeam")}
          </Link>

          <div className="mt-8 flex flex-col gap-8 sm:flex-row">
            <div className="mx-auto aspect-[4/5] w-full max-w-[220px] shrink-0 self-start overflow-hidden rounded-2xl bg-brand-neutral-50 sm:mx-0">
              {member.photo && (
                <Image
                  src={member.photo}
                  alt={name.value}
                  width={440}
                  height={550}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-brand-primary">
                {name.value}
              </h1>
              <p className="mt-1 text-lg font-semibold text-brand-secondary">
                {title.value}
              </p>

              <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-neutral-600">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
