import newsData from "@/data/news.json";
import { withAutoZhCN } from "./localize";
import type { NewsArticle } from "./types";

const LOCALIZE_FIELDS = ["title", "summary", "content", "source_name"];

export async function getNewsList(): Promise<NewsArticle[]> {
  return (newsData.items as NewsArticle[])
    .filter((item) => item.status !== "archived")
    .map((item) => withAutoZhCN(item, LOCALIZE_FIELDS))
    .sort((a, b) => (a.publish_date < b.publish_date ? 1 : -1));
}

export async function getNewsBySlug(
  slug: string
): Promise<NewsArticle | undefined> {
  const list = await getNewsList();
  return list.find((item) => item.slug === slug);
}
