"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Icon from "@/components/ui/Icon";

export interface TeamMemberView {
  id: string;
  slug: string;
  name: string;
  title: string;
  bio: string;
  photo: string;
  department?: string;
  isFallback: boolean;
}

// 2026-09-08 依客戶指示：個人履歷不再透過點擊圖片導向獨立頁面（原 `/about/leadership-team/[slug]`
// 路由檔案保留未刪除，僅不再從此處連結），改為滑鼠移到頭像時動態帶出履歷文字預覽，點擊後以
// 固定彈窗（modal）呈現完整履歷，右上角「X」關閉回到 Team 主頁
function MemberCard({
  member,
  onOpen,
}: {
  member: TeamMemberView;
  onOpen: (member: TeamMemberView) => void;
}) {
  const t = useTranslations("TeamPage");
  const excerpt = member.bio.split("\n\n").filter(Boolean)[0] ?? "";

  return (
    <button
      type="button"
      onClick={() => onOpen(member)}
      className="group block w-full text-center"
    >
      <span className="relative mx-auto block aspect-[4/5] w-full max-w-[200px] overflow-hidden rounded-2xl bg-brand-neutral-50">
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

        {/* 滑鼠移入時動態帶出履歷文字預覽（觸控裝置無 hover，直接點擊開啟彈窗即可） */}
        {excerpt && (
          <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-brand-primary/95 via-brand-primary/75 to-brand-primary/10 p-4 text-left opacity-0 transition duration-300 group-hover:opacity-100">
            <span className="line-clamp-5 text-sm text-white/95">
              {excerpt}
            </span>
            <span className="mt-2 text-xs font-bold text-white/80">
              {t("clickForBio")} →
            </span>
          </span>
        )}
      </span>
      <h3 className="mt-4 font-bold text-brand-neutral-900 group-hover:text-brand-primary">
        {member.name || "—"}
      </h3>
      <p className="mt-1 text-sm text-brand-neutral-600">
        {member.title || "—"}
      </p>
    </button>
  );
}

function MemberModal({
  member,
  onClose,
}: {
  member: TeamMemberView;
  onClose: () => void;
}) {
  const t = useTranslations("TeamPage");
  const paragraphs = member.bio.split("\n\n").filter(Boolean);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={member.name}
    >
      <div
        className="absolute inset-0 bg-brand-primary/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-background p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-brand-neutral-600 hover:bg-brand-neutral-50 hover:text-brand-primary"
        >
          <Icon name="close" className="h-5 w-5" />
        </button>

        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="mx-auto aspect-[4/5] w-full max-w-[200px] shrink-0 self-start overflow-hidden rounded-2xl bg-brand-neutral-50 sm:mx-0">
            {member.photo && (
              <Image
                src={member.photo}
                alt={member.name}
                width={400}
                height={500}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h3 className="text-2xl font-bold text-brand-primary">
              {member.name || "—"}
            </h3>
            <p className="mt-1 text-base font-semibold text-brand-secondary">
              {member.title || "—"}
            </p>

            <div className="mt-5 space-y-4 text-base leading-relaxed text-brand-neutral-600">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeamGrid({ members }: { members: TeamMemberView[] }) {
  const t = useTranslations("TeamPage");
  const [activeMember, setActiveMember] = useState<TeamMemberView | null>(
    null
  );

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
          <MemberCard key={member.id} member={member} onOpen={setActiveMember} />
        ))}
      </div>

      {advisors.length > 0 && (
        <>
          <h3 className="mt-16 text-center text-lg font-bold text-brand-primary">
            {t("advisors")}
          </h3>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {advisors.map((member) => (
              <MemberCard key={member.id} member={member} onOpen={setActiveMember} />
            ))}
          </div>
        </>
      )}

      {activeMember && (
        <MemberModal member={activeMember} onClose={() => setActiveMember(null)} />
      )}
    </div>
  );
}
