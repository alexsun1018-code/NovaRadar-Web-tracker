import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export interface TeamMemberView {
  id: string;
  slug: string;
  name: string;
  title: string;
  photo: string;
  department?: string;
  isFallback: boolean;
}

function MemberCard({ member }: { member: TeamMemberView }) {
  return (
    <Link
      href={`/about/leadership-team/${member.slug}`}
      className="group block text-center"
    >
      <span className="mx-auto block aspect-[4/5] w-full max-w-[200px] overflow-hidden rounded-2xl bg-brand-neutral-50">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            width={400}
            height={500}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-3xl font-semibold text-brand-primary/40">
            {member.name ? member.name.charAt(0) : "?"}
          </span>
        )}
      </span>
      <h3 className="mt-4 font-bold text-brand-neutral-900 group-hover:text-brand-primary">
        {member.name || "—"}
      </h3>
      <p className="mt-1 text-sm text-brand-neutral-600">
        {member.title || "—"}
      </p>
    </Link>
  );
}

export default async function TeamGrid({
  members,
}: {
  members: TeamMemberView[];
}) {
  const t = await getTranslations("TeamPage");

  if (members.length === 0) {
    return (
      <p className="mx-auto max-w-3xl px-4 py-10 text-center text-sm text-brand-neutral-300 sm:px-6 lg:px-8">
        —
      </p>
    );
  }

  const core = members.filter((m) => m.department !== "投資顧問");
  const advisors = members.filter((m) => m.department === "投資顧問");

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {core.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>

      {advisors.length > 0 && (
        <>
          <h3 className="mt-16 text-center text-lg font-bold text-brand-primary">
            {t("advisors")}
          </h3>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {advisors.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
