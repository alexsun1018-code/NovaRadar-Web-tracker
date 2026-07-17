import { getTranslations } from "next-intl/server";

export interface TeamMemberView {
  id: string;
  name: string;
  title: string;
  bio?: string;
  isFallback: boolean;
}

export default async function TeamGrid({
  members,
}: {
  members: TeamMemberView[];
}) {
  const tCommon = await getTranslations("Common");

  if (members.length === 0) {
    return (
      <p className="mx-auto max-w-3xl px-4 py-10 text-center text-sm text-brand-neutral-300 sm:px-6 lg:px-8">
        —
      </p>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 pb-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
      {members.map((member) => (
        <div
          key={member.id}
          className="rounded-2xl border border-brand-neutral-100 p-6 text-center"
        >
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-primary/10 text-2xl font-semibold text-brand-primary">
            {member.name ? member.name.charAt(0) : "?"}
          </span>
          {!member.name && (
            <p className="mt-2 text-xs text-brand-neutral-300">
              （官方照片）
            </p>
          )}
          <h3 className="mt-4 font-semibold text-brand-neutral-900">
            {member.name || "—"}
          </h3>
          <p
            className={`mt-1 text-sm ${
              member.title ? "text-brand-neutral-600" : "italic text-brand-neutral-300"
            }`}
          >
            {member.title || "（公司職稱）"}
          </p>
          <p
            className={`mt-3 text-sm ${
              member.bio ? "text-brand-neutral-600" : "italic text-brand-neutral-300"
            }`}
          >
            {member.bio || "（主要經歷文字）"}
          </p>
          {member.isFallback && (
            <p className="mt-3 text-xs text-brand-neutral-300">
              {tCommon("notTranslated")}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
