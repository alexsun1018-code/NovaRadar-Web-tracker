import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getStaticPage } from "@/lib/cms/pages";
import { getTeamMembers } from "@/lib/cms/team";
import { localizedField } from "@/lib/i18n/localizedField";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SubNav from "@/components/layout/SubNav";
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
      name: name.value,
      title: title.value,
      bio: bio.value,
      isFallback: name.isFallback || title.isFallback,
    };
  });

  return (
    <>
      <Header />
      <PageHeaderBanner title={t("leadershipTeam")} image="/images/banner-about.jpg" />
      <main className="flex-1">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:flex-row sm:px-6 lg:px-8">
          <SubNav parentKey="about" current="leadershipTeam" layout="vertical" />
          <div className="min-w-0 flex-1">
            <h2 className="flex items-center gap-3 text-2xl font-bold text-brand-primary">
              <span aria-hidden className="h-6 w-1 rounded-sm bg-brand-primary" />
              {t("leadershipTeam")}
            </h2>
            <StaticPageBody page={page} contained={false} />
            <TeamGrid members={memberViews} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
