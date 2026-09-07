import heroData from "@/data/hero-slides.json";
import type { HeroSlide } from "./types";

/**
 * 目前讀本地 JSON，未來若換 Sanity 只需改這個函式的實作，呼叫端介面不變。
 */
export async function getHeroSlides(): Promise<HeroSlide[]> {
  return (heroData.items as HeroSlide[]).sort((a, b) => a.order - b.order);
}
