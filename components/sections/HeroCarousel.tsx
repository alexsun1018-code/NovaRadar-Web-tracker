"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Icon from "@/components/ui/Icon";

const AUTOPLAY_MS = 6000;

export interface HeroSlideView {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  background: { from: string; to: string };
  isFallback: boolean;
}

export default function HeroCarousel({ slides }: { slides: HeroSlideView[] }) {
  const t = useTranslations("Hero");
  const tCommon = useTranslations("Common");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (i: number) => setIndex((prev) => (slides.length ? (i + slides.length) % slides.length : prev)),
    [slides.length]
  );

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, slides.length]);

  if (slides.length === 0) return null;
  const slide = slides[index];

  return (
    <section
      className="relative overflow-hidden text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* 背景圖片（生技實驗室，Unsplash License 免費商用）*/}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/images/hero-bg-lab.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* 品牌色漸層疊加，維持背景圖可見度同時讓每張 slide 的色調差異清楚可辨 */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, var(--${slide.background.from}), var(--${slide.background.to}))`,
          opacity: 0.62,
        }}
      />
      {/* 文字區域左側加深，確保與圖片重疊處仍可辨識，右側維持透明讓圖片清楚 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0) 75%)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {slide.isFallback && (
            <p className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs">
              {tCommon("notTranslated")}
            </p>
          )}
          <h1
            className="text-3xl font-bold leading-tight [text-shadow:0_2px_12px_rgba(0,0,0,0.45)] sm:text-4xl lg:text-5xl"
          >
            {slide.title}
          </h1>
          <p className="mt-4 text-lg text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]">
            {slide.subtitle}
          </p>
          <Link
            href={slide.ctaHref}
            className="mt-8 inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-primary transition hover:bg-brand-neutral-50"
          >
            {slide.ctaLabel}
          </Link>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label={t("previous")}
            onClick={() => goTo(index - 1)}
            className="rounded-full bg-white/15 p-2 hover:bg-white/25"
          >
            <Icon name="chevronLeft" className="h-5 w-5" />
          </button>

          <div className="flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={t("goToSlide", { index: i + 1 })}
                onClick={() => goTo(i)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === index ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label={t("next")}
            onClick={() => goTo(index + 1)}
            className="rounded-full bg-white/15 p-2 hover:bg-white/25"
          >
            <Icon name="chevronRight" className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  );
}
