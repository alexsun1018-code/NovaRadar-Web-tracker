"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Icon from "@/components/ui/Icon";

const AUTOPLAY_MS = 6000;

export interface HeroSlideView {
  id: string;
  subtitle: string;
  background: { from: string; to: string };
  isFallback: boolean;
}

export default function HeroCarousel({ slides }: { slides: HeroSlideView[] }) {
  const t = useTranslations("Hero");
  const tCommon = useTranslations("Common");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
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

  useEffect(() => {
    // 影片背景僅在桌面尺寸、且使用者未設定「減少動態效果」時播放，手機/平板與偏好靜態畫面者顯示靜態圖片，節省流量
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setShowVideo(desktopQuery.matches && !motionQuery.matches);
    update();
    desktopQuery.addEventListener("change", update);
    motionQuery.addEventListener("change", update);
    return () => {
      desktopQuery.removeEventListener("change", update);
      motionQuery.removeEventListener("change", update);
    };
  }, []);

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
      {/* 背景靜態圖，見 CLAUDE.md 素材說明；桌面且未偏好減少動態效果時會被下方影片覆蓋 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/images/hero-bg-slogan.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* 背景短動畫（生技 DNA 螺旋意象，見 CLAUDE.md 素材說明），僅桌面顯示 */}
      {showVideo && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/hero-bg-dna.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      )}
      {/* 品牌色漸層疊加，維持背景圖可見度同時讓每張 slide 的色調差異清楚可辨 */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, var(--${slide.background.from}), var(--${slide.background.to}))`,
          opacity: 0.22,
        }}
      />
      {/* 文字區塊偏右下、多行右側對齊（參考 vivocapital.com 版面），僅在文字後方加深背景，左側維持動畫清晰可見 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(260deg, rgba(6,26,38,0.72) 0%, rgba(6,26,38,0.4) 42%, rgba(6,26,38,0.08) 68%, rgba(6,26,38,0) 85%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[72vh] max-w-7xl flex-col items-end justify-end px-4 pb-16 pt-32 text-right sm:px-6 lg:px-8">
        <div className="max-w-full">
          {slide.isFallback && (
            <p className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs">
              {tCommon("notTranslated")}
            </p>
          )}
          <h1 className="text-[clamp(1.75rem,4.2vw,5.25rem)] font-bold leading-tight [text-shadow:0_2px_16px_rgba(0,0,0,0.6)]">
            {slide.subtitle.split("\n").map((line, i) => (
              <span key={i} className="block sm:whitespace-nowrap">
                {line}
              </span>
            ))}
          </h1>
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
