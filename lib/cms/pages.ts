import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { zhTwToZhCn } from "@/lib/i18n/opencc";
import type { Locale } from "@/i18n/routing";
import type { StaticPage } from "./types";

const PAGES_DIR = path.join(process.cwd(), "data", "pages");

function readMarkdownFile(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf-8");
  return matter(raw);
}

/**
 * 讀取 data/pages/*.md。繁中（{slug}.md）為唯一權威來源。
 * - en：優先讀 {slug}.en.md 人工譯文；不存在則 fallback 顯示繁中並標記 isFallback。
 * - zh-CN：優先讀 {slug}.zh-cn.md 人工用語覆寫（處理 OpenCC 無法轉換的詞彙差異，
 *   如「新創」→「初创」）；不存在則由繁中內文透過 OpenCC 即時轉換。
 */
export async function getStaticPage(
  slug: string,
  locale: Locale
): Promise<StaticPage> {
  const zhTW = readMarkdownFile(path.join(PAGES_DIR, `${slug}.md`));
  const title = (zhTW.data.page as string | undefined) ?? slug;

  if (locale === "zh-tw") {
    return {
      slug,
      title,
      bodyHtml: marked.parse(zhTW.content, { async: false }) as string,
      isFallback: false,
    };
  }

  const overridePath = path.join(PAGES_DIR, `${slug}.${locale}.md`);
  const hasOverride = fs.existsSync(overridePath);

  if (locale === "en") {
    if (hasOverride) {
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

  // locale === "zh-cn"
  const bodyMarkdown = hasOverride
    ? readMarkdownFile(overridePath).content
    : zhTwToZhCn(zhTW.content);

  return {
    slug,
    title,
    bodyHtml: marked.parse(bodyMarkdown, { async: false }) as string,
    isFallback: false,
  };
}
