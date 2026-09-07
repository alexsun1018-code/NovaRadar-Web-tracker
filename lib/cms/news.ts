import newsData from "@/data/news.json";
import type { NewsArticle } from "./types";

export async function getNewsList(): Promise<NewsArticle[]> {
  return (newsData.items as NewsArticle[])
    .filter((item) => item.status !== "archived")
    .sort((a, b) => (a.publish_date < b.publish_date ? 1 : -1));
}

export async function getNewsBySlug(
  slug: string
): Promise<NewsArticle | undefined> {
  const list = await getNewsList();
  return list.find((item) => item.slug === slug);
}
