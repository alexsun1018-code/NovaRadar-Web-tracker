"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Icon from "@/components/ui/Icon";

export interface NewsFeedItemView {
  slug: string;
  title: string;
  publishDate: string;
  category: string;
  summary: string;
  content: string;
  photo?: string;
  gallery: string[];
  sourceName?: string;
  sourceUrl?: string;
  isFallback: boolean;
}

// 依客戶指示：News 頁改為條列日期＋簡要人地事物，滑鼠移入顯示「To Read More」，
// 點擊後以彈窗呈現完整內容＋照片，右上角「X」關閉，互動模式比照 Team 頁個人履歷彈窗
function NewsRow({
  item,
  onOpen,
}: {
  item: NewsFeedItemView;
  onOpen: (item: NewsFeedItemView) => void;
}) {
  const t = useTranslations("News");

  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="group flex w-full items-start gap-5 border-b border-brand-neutral-100 py-6 text-left transition hover:bg-brand-neutral-50"
      >
        <span className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-xl bg-brand-neutral-50 sm:w-40">
          {item.photo && (
            <Image
              src={item.photo}
              alt=""
              fill
              sizes="160px"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-brand-primary/70 opacity-0 transition duration-300 group-hover:opacity-100">
            <span className="text-xs font-bold text-white sm:text-sm">
              {t("toReadMore")} →
            </span>
          </span>
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold uppercase tracking-wide text-brand-primary">
            {item.publishDate}
          </span>
          <span className="mt-1 block font-bold text-brand-neutral-900 group-hover:text-brand-primary">
            {item.title}
          </span>
          <span className="mt-1 block text-sm text-brand-neutral-600">
            {item.summary}
          </span>
        </span>
      </button>
    </li>
  );
}

function NewsModal({
  item,
  onClose,
}: {
  item: NewsFeedItemView;
  onClose: () => void;
}) {
  const t = useTranslations("News");
  const paragraphs = item.content.split("\n\n").filter(Boolean);

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
      aria-label={item.title}
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
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-brand-neutral-600 shadow hover:bg-brand-neutral-50 hover:text-brand-primary"
        >
          <Icon name="close" className="h-5 w-5" />
        </button>

        {item.photo && (
          <div className="relative -mx-6 -mt-6 mb-6 h-64 overflow-hidden bg-brand-neutral-50 sm:-mx-8 sm:-mt-8 sm:h-80">
            <Image src={item.photo} alt="" fill className="object-contain" />
          </div>
        )}

        <span className="text-xs font-semibold uppercase tracking-wide text-brand-primary">
          {item.publishDate}
        </span>
        <h3 className="mt-1 text-xl font-bold text-brand-primary sm:text-2xl">
          {item.title}
        </h3>

        <div className="mt-5 space-y-4 text-base leading-relaxed text-brand-neutral-600">
          {paragraphs.map((p, i) => (
            <p key={i} className="whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>

        {item.gallery.length > 0 && (
          <div className="mt-6 space-y-4">
            {item.gallery.map((src) => (
              <div
                key={src}
                className="relative h-[420px] overflow-hidden rounded-xl bg-brand-neutral-50 sm:h-[560px]"
              >
                <Image src={src} alt="" fill className="object-contain" />
              </div>
            ))}
          </div>
        )}

        {item.sourceName && (
          <p className="mt-6 flex items-center gap-1 text-sm text-brand-neutral-600">
            {t("source")}：{item.sourceName}
            {item.sourceUrl && (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-brand-primary hover:underline"
              >
                <Icon name="externalLink" className="h-3.5 w-3.5" />
              </a>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

export default function NewsFeed({ items }: { items: NewsFeedItemView[] }) {
  const [activeItem, setActiveItem] = useState<NewsFeedItemView | null>(null);

  if (items.length === 0) {
    return (
      <p className="mx-auto max-w-3xl px-4 py-10 text-center text-sm text-brand-neutral-300 sm:px-6 lg:px-8">
        —
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
      <ul>
        {items.map((item) => (
          <NewsRow key={item.slug} item={item} onOpen={setActiveItem} />
        ))}
      </ul>

      {activeItem && (
        <NewsModal item={activeItem} onClose={() => setActiveItem(null)} />
      )}
    </div>
  );
}
