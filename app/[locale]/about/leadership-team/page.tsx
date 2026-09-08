import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getStaticPage } from "@/lib/cms/pages";
import { getTeamMembers } from "@/lib/cms/team";
import { localizedField } from "@/lib/i18n/localizedField";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHeaderBanner from "@/components/layout/PageHeaderBanner";
import StaticPageBody from "@/components/sections/StaticPageBody";
import TeamGrid from "@/components/sections/TeamGrid";

export default async function LeadershipTeamPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Nav");

  const [page, members] = await Promise.all([
    getStaticPage("leadership-team-intro", locale),
    getTeamMembers(),
  ]);

  const memberViews = members.map((member) => {
    const name = localizedField(member, locale, "name");
    const title = localizedField(member, locale, "title");
    const bio = localizedField(member, locale, "bio");
    return {
      id: member.id,
      slug: member.slug,
      name: name.value,
      title: title.value,
      bio: bio.value,
      photo: member.photo,
      department: member.department,
      isFallback: name.isFallback || title.isFallback,
    };
  });

  return (
    <>
      <Header />
      <PageHeaderBanner title={t("leadershipTeam")} image="/images/banner-about.jpg" />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-brand-primary">
            {t("leadershipTeam")}
          </h2>
          <StaticPageBody page={page} contained={false} />
        </div>
        <TeamGrid members={memberViews} />
      </main>
      <Footer />
    </>
  );
}
