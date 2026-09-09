import { getTranslations } from "next-intl/server";
import { getStaticPage } from "@/lib/cms/pages";
import { getTeamMembers } from "@/lib/cms/team";
import { localizedField } from "@/lib/i18n/localizedField";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHeaderBanner from "@/components/layout/PageHeaderBanner";
import StaticPageBody from "@/components/sections/StaticPageBody";
import TeamGrid from "@/components/sections/TeamGrid";

export default async function LeadershipTeamPage() {
  const t = await getTranslations("Nav");

  const [page, members] = await Promise.all([
    getStaticPage("leadership-team-intro"),
    getTeamMembers(),
  ]);

  const memberViews = members.map((member) => {
    const name = localizedField(member, "name");
    const title = localizedField(member, "title");
    const bio = localizedField(member, "bio");
    const shortBio = localizedField(member, "short_bio");
    return {
      id: member.id,
      slug: member.slug,
      name: name.value,
      title: title.value,
      bio: bio.value,
      shortBio: shortBio.value,
      photo: member.photo,
      department: member.department,
      linkedinUrl: member.linkedin_url,
      isFallback: name.isFallback || title.isFallback,
    };
  });

  return (
    <>
      <Header />
      <PageHeaderBanner
        title={t("leadershipTeam")}
        image="/images/banner-team.jpg"
        imagePosition="center 18%"
      />
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
