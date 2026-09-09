import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { StaticPage } from "./types";

const PAGES_DIR = path.join(process.cwd(), "data", "pages");

function readMarkdownFile(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf-8");
  return matter(raw);
}

/**
 * 讀取 data/pages/*.md。繁中（{slug}.md）為原始資料來源。
 * 網站僅保留 EN，優先讀 {slug}.en.md 人工譯文；不存在則 fallback 顯示繁中並標記 isFallback。
 */
export async function getStaticPage(slug: string): Promise<StaticPage> {
  const zhTW = readMarkdownFile(path.join(PAGES_DIR, `${slug}.md`));
  const title = (zhTW.data.page as string | undefined) ?? slug;

  const overridePath = path.join(PAGES_DIR, `${slug}.en.md`);
  if (fs.existsSync(overridePath)) {
    const en = readMarkdownFile(overridePath);
    return {
      slug,
      title,
      bodyHtml: marked.parse(en.content, { async: false }) as string,
      isFallback: false,
    };
  }

  return {
    slug,
    title,
    bodyHtml: marked.parse(zhTW.content, { async: false }) as string,
    isFallback: true,
  };
}
