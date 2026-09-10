# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Turbopack dev server on http://localhost:3000
npm run build    # production build (Turbopack)
npm run start    # serve the production build
npm run lint     # eslint (eslint-config-next core-web-vitals + typescript)
npx tsc --noEmit # type-check; there is no separate `typecheck` script
```

There is no automated test suite (no Jest/Vitest/Playwright test files under a `tests/`/`__tests__` dir). Verify
changes with `npx tsc --noEmit`, `npm run lint`, and by driving the dev server manually (Playwright is a
devDependency for this — write a throwaway `.mjs` script under `scripts/`, run it with `node`, then delete it;
don't leave ad hoc verification scripts committed).

`scripts/*.mjs` are pre-existing one-off Playwright scripts from earlier sessions (`analytics-test.mjs`,
`form-test.mjs`, `link-crawl.mjs`, `rwd-screenshot.mjs`), not a maintained tool — some hardcode locales that no
longer exist (`zh-tw`, `zh-cn`) from before the 2026-09-09 EN-only change, so their output can't be trusted as-is;
skim before running.

After UI changes, prefer `rm -rf .next` before restarting `next dev` if something looks stale — Next's dev
image-optimization cache keys optimized images by URL path, not file content, so replacing an image file (e.g.
`public/images/team/charlene-hu.jpg`) under an unchanged filename can keep serving the old cached version.

## Architecture

**Stack**: Next.js (App Router) + `next-intl` for i18n + Tailwind CSS v4. Deployed on Vercel. No database yet —
content is local JSON/Markdown under `data/`, read through a typed fetcher layer so a future CMS swap (Sanity is
the planned target; schema mirrors `content-model.md`) only requires rewriting `lib/cms/*.ts`, not callers.

**Routing**: every page lives under `app/[locale]/...`; `proxy.ts` (the middleware) wraps `next-intl`'s
`createMiddleware(routing)` to resolve/redirect the locale prefix. `i18n/routing.ts` defines `locales` (`en` only
since 2026-09-09 — zh-tw was removed, see Change Log), `defaultLocale` (`en`), and `localePrefix: "always"` (so
every route is still `/en/...`). `i18n/navigation.ts` re-exports locale-aware `Link`/`useRouter`/`usePathname` —
use these instead of `next/link` inside `[locale]` routes so the locale prefix is preserved automatically.

**Content layer** (`lib/cms/*.ts`): one file per content type (`hero.ts`, `team.ts`, `pages.ts`, `news.ts`,
`disclosures.ts`, `companyHistory.ts`, `contactInfo.ts`, `valueProps.ts`, `portfolio.ts`), each exporting
`async` getters that currently just import the matching `data/*.json` file. Shapes are declared once in
`lib/cms/types.ts`. Pages call these getters, map the result through `localizedField()`, and pass plain view
objects into client components.

**Two separate bilingual patterns — don't mix them up** (site only *renders* EN since 2026-09-09, but the
underlying data still carries the original zh-tw fields as source material and EN's fallback):
- *Structured content records* (`data/*.json`, e.g. team members, value props, hero slides) store paired fields
  `{name}_zhTW` / `{name}_en`. `lib/i18n/localizedField.ts` resolves them: it always returns `_en`, falling back to
  the `_zhTW` value and setting `isFallback: true` when `_en` is missing/empty (callers typically render a "not
  yet translated" badge in that case). The function no longer takes a `locale` argument — call it as
  `localizedField(entry, fieldBase)`.
- *Full static pages* (`data/pages/{slug}.md`, e.g. company-intro, contact) are plain Markdown with frontmatter,
  parsed via `gray-matter` + `marked` in `lib/cms/pages.ts`. `{slug}.md` is the original zh-tw source; an optional
  `{slug}.en.md` is a hand-translated override. `getStaticPage(slug)` reads `{slug}.en.md` when it exists, else
  falls back to the zh-tw file with `isFallback: true`.
- *UI chrome / marketing copy* (nav labels, section headings, button text, short card labels/descriptions) lives
  in `messages/en.json` (the only locale file — `messages/zh-tw.json` was deleted 2026-09-09), consumed via
  `next-intl`'s `useTranslations`/`getTranslations`.

**Nav config**: `lib/nav/config.ts` defines `mainNav`/`authNav`/`legalNav` independent of which routes actually
exist — a nav entry can be removed without deleting the page (see "orphaned code" below), and
`status: "placeholder"` pages render a `ComingSoonPage`. `Header.tsx` no longer has a language switcher (removed
2026-09-09 along with zh-tw).

**Orphaned code convention**: when a feature/section is removed from the live site per client instruction, the
component/route/data file is generally left in place (not deleted) unless told otherwise, and the removal +
reason is noted in the Change Log below. Check there before assuming a file is dead weight — it may be
intentionally preserved for a possible future re-hookup.

**Brand tokens**: colors are CSS custom properties in `app/globals.css` (`--brand-primary`, `--brand-secondary`,
`--brand-accent`, `--section-*-50`, `--brand-neutral-*`), mapped into Tailwind via `@theme`/`--color-*` in the
same file — use the Tailwind classes (`bg-brand-primary`, etc.), not raw hex values, in components.

**Icons**: `components/ui/Icon.tsx` is a single hand-drawn SVG line-icon set (`viewBox 0 0 24 24`, stroke-based);
add new glyphs there rather than pulling in an icon library. Homepage sections currently draw from one shared
icon pool across ValueProps/ClinicalValueBridge/WeInvestIn/StrategicFocus — keep icon choices unique across all
of them (see the icon-review entry in the Change Log for the reasoning already applied).

**Contact form pipeline**: `ContactForm.tsx` (client) POSTs to `app/api/contact/route.ts`, which validates with
`lib/forms/schema.ts` (`zod`) and hands off to `lib/forms/leadSink.ts::sendLead()` — the only function that knows
about the current email provider (Resend). This indirection exists so swapping to a CRM later only means
rewriting `leadSink.ts`. Without `RESEND_API_KEY`/`CONTACT_INBOX_EMAIL` set, it just `console.warn`s and returns
(no email actually sent) — see `.env.example`.

**Analytics**: GA4 (`@next/third-parties`'s `<GoogleAnalytics>`, gated on `NEXT_PUBLIC_GA_MEASUREMENT_ID`) and Meta
Pixel (`components/analytics/MetaPixel.tsx`, gated on `NEXT_PUBLIC_META_PIXEL_ID`) both render nothing when their
env var is unset. `lib/analytics/track.ts::trackLead()` fires the `generate_lead`/`Lead` conversion event on
successful form submit.

**Path alias**: `@/*` → repo root (`tsconfig.json`).

**Earliest history**: `docs/dev-log.md` covers 2026-07-17/18 — initial local setup, the GitHub repo
(`alexsun1018-code/NovaRadar-Web-tracker`, public) and Vercel project (`novaradar-web-tracker`, linked so pushing
`main` auto-deploys) being created — before the Change Log below started. Check it for anything not explained by
current code or the Change Log.

## Content & Translation Conventions

- The site renders EN only (2026-09-09 onward). `_zhTW` fields in `data/*.json` and `data/pages/*.md` are kept as
  the original source material / EN fallback, not for display. For long-form content (bios, static pages) still
  awaiting a client-provided EN translation, the convention is to place the zh-tw text (or leave the field empty,
  triggering the fallback above) rather than inventing wording — but short marketing copy (section titles, card
  labels/descriptions) has been translated directly in past sessions when the client supplied only English source
  material. See the Change Log for which fields are still pending official translation.
- Image/video assets must be commercially licensed (Unsplash License, Pexels License, or client-supplied
  originals) — never use a paid stock site's preview/watermarked image, even if the client forwards it labeled
  "high-res"; check embedded XMP/EXIF metadata for a stock-agency credit before use. See the Change Log for a
  concrete instance where a client-supplied "high-res" file turned out to be a low-res watermarked Getty preview.
- Client source material (PPTX decks, screenshots) lives in `../NovaRada Data/` (one level above this repo). PPTX
  files have no PowerPoint/LibreOffice available locally to open them — extract text via `unzip` (a `.pptx` is a
  zip) and grep `ppt/slides/slideN.xml` for `<a:t>...</a:t>` runs; extract images from `ppt/media/`.

---

## Change Log

The sections below are a running, dated record of product/content decisions made per client instruction —
kept because the reasoning (why an approach was rejected, what a client said, what a source file actually
contained) is not recoverable by re-reading the current code. Skim the relevant section before re-touching an
area to avoid re-litigating a decision that was already tried and rejected.

## 2026-09-09 移除繁中／語言切換、Contact 表單改版、News 頁改為活動動態＋彈窗

依客戶指示三項變更：

- **移除繁中頁面與地球語言切換 UI，網站僅保留 EN**：詳見上方「雙語策略」章節的 2026-09-09 更新說明。`npx tsc --noEmit`／`npm run lint`／`npm run build` 均通過，`next build` 輸出確認僅產生 `/en/*` 靜態頁（無 `/zh-tw/*`）
- **Contact 頁改版，格式參考 glintmed.com/en/contact-us**：頁面結構改為「說明文字 → 簡易表單（Name／Tel／Email／Remark）→ 純文字聯絡資訊（Phone／Email／Address，Address 連到 Google Maps 搜尋）」。原本頁面移除多年未掛上的 `ProposalForm.tsx`（含 Company／Inquiry Type 欄位，較複雜）已刪除，改為新元件 `components/sections/ContactForm.tsx`（僅 Name／Tel／Email／Remark 四欄，沿用同一 `/api/contact` 端點）；`lib/forms/schema.ts`（`contactFormSchema` 移除 `company`／`inquiryType`）、`lib/forms/leadSink.ts`、`lib/analytics/track.ts`（`trackLead()` 移除 `inquiryType` 參數）同步簡化。`ContactInfoBlock.tsx` 從卡片格線改為純文字直式列表，移除「Contact Person」欄位（客戶資料本就是空值，且 glintmed 參考頁沒有此欄位）。此變更同時解決了 `待辦` 中「ProposalForm／`/api/contact` 提案表單是否重新掛上或棄用」的懸案——採重新掛上（改款後）
- **News 頁移除示範用舊內容，改為活動動態列表＋彈窗**：`data/news.json` 原本 3 篇 `_placeholder: true` 示範新聞已整批替換為 3 篇真實活動報導，來源為客戶簡報 `MitoBitTech management team website_20260909.pptx` 第 17–19 頁（貼文皆為截圖非可選取文字，用 `unzip` 展開 pptx 讀取 `ppt/media/imageNN.jpeg|png` 圖片後用視覺辨識轉譯文字內容，非 `<a:t>` 文字擷取）：
  1. NovaRadar 葉秉陽博士出席 Mycenax 主辦「2026 Emerging Biologics Summit Asia」（2026-07-14，The Place Taipei）
  2. 葉秉陽博士於美國聖地牙哥 TCA Forum 演講「Speed to Clinical Proof-of-Concept」（2026-06-21）
  3. 胡瑞卿共同創辦人受邀於國家衛生研究院（NHRI）演講「When AI Begins to Understand Life」（日期未公開，依 LinkedIn 貼文相對時間「3 個月前」推估約 2026-06-15，已在內文註明為推估值——已用網路搜尋確認 NHRI 30 週年主典禮實際在 2026-01-07，與此次內部演講非同一場次，故未採用主典禮日期）
  三篇的封面照／補充照片取自簡報對應頁面圖片，存放於新增的 `public/images/news/`。`lib/cms/types.ts` 的 `NewsArticle` 新增選填欄位 `gallery?: string[]`（彈窗內文下方的補充照片，如議程表、大合照）。顯示機制仿照 Team 頁個人履歷彈窗：新元件 `components/sections/NewsFeed.tsx` 取代原本會連到獨立 `/news/general/[slug]` 頁面的 `NewsList.tsx`（已刪除）——條列日期＋簡要人地事物，滑鼠移到縮圖上疊加「To Read More →」提示文字（沿用 Team 頁同款翻譯字串精神，新增至 `messages/en.json` 的 `News.toReadMore`），點擊開啟固定彈窗顯示完整內文＋封面照＋補充照片，右上角「X」關閉。原有的 `app/[locale]/news/general/[slug]/page.tsx` 詳細頁路由**保留未刪除**（比照 Team 頁 `[slug]` 頁面的孤兒程式碼慣例，只是不再從列表頁連結過去），`YearSidebar.tsx` 未受影響（`DisclosureList.tsx`／Announcements 頁仍在使用）

## 技術路線

- 框架：Next.js，App Router
- CMS：Sanity.io（schema 對應 `content-model.md`），CMS 存取集中於 `lib/cms/` typed fetcher，方便未來替換
  - 待確認：法規/合規是否要求資料留在台灣主機，若是則需改自架 Payload/Strapi + 台灣機房
- 部署：Vercel
- 表單：`app/api/contact/route.ts` → `lib/forms/lead-sink.ts`，預設 Resend email，介面設計方便日後換 CRM
  - 防護：目前僅 honeypot 隱藏欄位擋基本機器人，reCAPTCHA v3 待流量變大後再加
- 追蹤碼：GA4（`@next/third-parties` 的 `GoogleAnalytics`）與 Meta Pixel（`components/analytics/MetaPixel.tsx`）已寫好，皆依環境變數條件式載入，未設定 ID 時完全不輸出 script。表單送出成功會觸發 `generate_lead` / `Lead` 轉換事件（`lib/analytics/track.ts`）
- 環境變數清單見 `.env.example`，複製為 `.env.local` 後填入實際值
- 樣式：Tailwind CSS，`tailwind.config` 品牌色/字型 token 留空占位，待品牌色票/字型章節定案後回填
- 圖片素材：`public/images/hero-bg-slogan.jpg`（首頁 Hero 背景，2026-09-08 更新）改用 Unsplash 免費商用授權圖（攝影師 Braňo，與 `banner-about.jpg` 同一位攝影師，深藍色 DNA 雙股螺旋渲染意象，原始 5760×3240，網站用檔壓縮為 2400×1350）。選用理由：客戶原先提供的分子球體意象圖（見下方說明）經客戶回饋「不能表現生技相關意念」，改選擇能直接傳達生技/基因研究概念的 DNA 螺旋圖，且深藍色調與品牌 Primary 色 `#0c344c` 相近。客戶提供的 `NovaRada Data/NovaRadar Web Slogon背景_高解析_WaterMark.JPG`（宣稱「高解析」）經檢查其實只有 553×311，且 XMP metadata 顯示為 **Getty Images 未授權浮水印樣張**（`plus:DataMining` 條款禁止重製，需付費購買授權），故未採用、也未去浮水印使用，避免侵權風險；若客戶之後正式購買該 Getty 圖授權並提供無浮水印原始檔，可再評估替換。圖片本身已用 `sharp`（`modulate` 提高亮度/飽和度＋`linear` 微調對比）整體調亮，上層疊加品牌色漸層（2026-09-08 由 `opacity: 0.45` 調降為 `0.28`）＋純黑遮罩（`bg-black/45` 調降為 `bg-black/20`），因客戶反饋原本背景太暗，調整後視覺更明亮同時維持文字可辨識（`h1` text-shadow 同步加深至 `rgba(0,0,0,0.55)` 補償對比）。舊版 `hero-bg-lab.jpg`（Unsplash，攝影師 Nathan Rimoux）已不再使用但保留檔案；另有 Unsplash 攝影師 Logan Voss 的白/青綠色分子球體渲染圖於 2026-09-08 一度短暫採用，因客戶反饋「不能表現生技相關意念」而改為現用 DNA 螺旋圖（該版本檔案已被直接覆蓋，未另存）。之後若要換其他圖，需確認來源授權可商用，不要直接用 pngtree 等付費圖庫的預覽圖或去浮水印使用
  - `public/images/value-*.jpg`（原首頁「為什麼選擇瑞大」四張圖示照片）2026-09-07 起已不再使用（改為 icon 卡片，見下方「首頁／內容大改版」），檔案保留未刪除
  - `public/images/banner-{about,portfolio,news,contact}.jpg`（關於我們／投資組合／新聞中心／聯絡我們各主項目頁頂部橫幅，`components/layout/PageHeaderBanner.tsx`）同樣取自 Unsplash 免費授權：banner-about 攝影師 Braňo、banner-portfolio 攝影師 Samson、banner-news 攝影師 AbsolutVision、banner-contact 攝影師 Radisson US
- Logo：`public/images/logo-full.png`（Header 用，含「Bio Venture」tagline）、`logo-mark.png`（不含 tagline 的裁切版，備用）、`logo-*-on-dark.png`（深色背景版，NovaRadar 字樣改白色、R 字母維持青綠色，供 Footer 深藍底使用）。原始向量檔為 `NovaRada Data/NovaRadar_Logo_向量檔_確認用.pdf`（2026-09-07 客戶確認版），因本機無 PDF 轉 SVG 工具，改用 `pdfjs-dist` + `@napi-rs/canvas` 高解析度點陣化後以 `sharp` 去背/裁切產生，非真正向量檔；若之後拿到 AI/EPS/SVG 原始檔應改用向量版本重新輸出
- Header 導覽（`lib/nav/config.ts`）：2026-09-07 移除 ESG／Investors／Careers 三個 placeholder 項目（頁面本身仍在，只是不再出現在選單），新增「Team」（連到既有 `/about/leadership-team`）；另外在導覽列右側新增 `authNav`（Login／Sign Up），對應 `/login`、`/signup` 兩個新路由，目前皆為 `ComingSoonPage`（`auth` 插圖），供之後串接真正的外部（投資人）／內部人員登入功能。2026-09-08 依客戶指示自 `authNav` 移除 Sign Up（`/signup` 路由本身保留未刪除，僅不再出現在選單），僅存 Login 一項，樣式改為 pill 外框按鈕（呼應 vivocapital.com 的「Investor Login」按鈕樣式）
- Header 版面 2026-09-08 參考 vivocapital.com 調整比例：logo 放大（`h-10`／`h-11` → `h-12`／`h-14`）、header 上下 padding 加大（`py-4` → `py-5`／`lg:py-6`）、主導覽字級放大且字重減輕（`text-base font-bold` → `text-lg font-medium`）、項目間距加大（`gap-4` → `gap-6`／`xl:gap-8`）；同日稍晚客戶再指示主導覽（About／Team／News／Contact）字級再放大並改回粗體、間距再拉開（`text-lg font-medium gap-6/xl:gap-8` → `text-xl font-bold gap-10/xl:gap-12`），已用 Playwright 確認 1180～1920px 桌機寬度皆不會與右側 Login／語言切換擠壓或溢出
- 詳細架構規劃見 `content-model.md` 與對應 plan 文件

## 2026-09-08 首頁內文區塊調整（標題精簡、圓餅圖化）

依客戶指示：

- **ValueProps 區塊**（`components/sections/ValueProps.tsx`）：2026-09-08 一度移除「Why NovaRadar」標題、原副標題升級為唯一 `h2` 主標題；同日稍晚客戶指示比照 The Clinical-Value Bridge 的「主標題＋次要說明文字」兩階版面，改回 `h2`（`ValueProps.title`＝「An Operator-led Approach」／「營運者思維著手」）＋ `p`（`ValueProps.subtitle`＝「Moving biotech from science to clinical proof faster」／「加速生技新創從科學走向臨床驗證」，字級樣式與 Clinical-Value Bridge 的 subtitle 完全一致：`text-xl font-medium text-brand-neutral-700 sm:text-2xl`）
  - 2026-09-08 客戶提供更新版簡報「MitoBitTech management team website_20260908.pptx」（與 2026-09-07 版檔名相同僅日期後綴不同，內容為改版）後，依簡報第 2 頁全面更新：主標題（`messages/*.json` 的 `ValueProps.subtitle`）由「The operator-led approach that accelerates biotech success」改為「An operator-led approach that moves biotech from science to clinical proof faster」（繁中同步翻譯更新）；下方 6 個項目的 `description_en`／`description_zhTW`（`data/value-props.json`）全面改寫（標題不變，僅將簡報條列式片語潤飾為完整句子，第 5 項標題的 "&" 沿用既有風格未改回簡報的 "and"）。Team 頁卡片 hover 引導文字（`TeamPage.clickForBio`）同時從「Click to read full bio」／「點擊查看完整介紹」簡化為「To Read More」／「閱讀更多」
- **ClinicalValueBridge 區塊**（`components/sections/ClinicalValueBridge.tsx`）：副標題「Investing in undercapitalized science and driving it to inflection.」放大（`text-lg` → `text-xl sm:text-2xl`，並加粗為 `font-medium`）
- **WeInvestIn／StrategicFocusAreas 合併**：原本各自獨立的「We Invest In」與「Strategic Focus Areas」兩個 `<section>` 合併為一（`components/sections/WeInvestIn.tsx`），移除「Strategic Focus Areas」標題（`StrategicFocus.title`，翻譯保留未刪除但不再顯示），四個項目（Early Cancer Detection／Novel Target Drug／Rare Genetic Diseases／Neurological Disorders）改在 We Invest In 三張卡片下方**同一區塊**延續呈現（同背景色 `bg-section-blue-50`、無分段 break）。同時移除原本描述文字的紅色粗體首字效果（`first-letter:text-red-600` 等 class 已拿掉），文字樣式與其餘內文一致。原始版本的獨立元件 `components/sections/StrategicFocusAreas.tsx` **保留未刪除但已不再被 `app/[locale]/page.tsx` 引用**（孤兒元件）
  - **四項目視覺呈現版本演進**：第一版嘗試 CSS `conic-gradient` 甜甜圈圖＋2 欄圖例；第二版嘗試花瓣狀環形圖＋SVG 虛線連到外側左右交錯圖例（參考付費圖庫醫療環形資訊圖範本重新設計，非直接使用該圖片素材）——客戶反饋兩版「呈現效果不如預期」，改指定直接還原客戶原始簡報 `MitoBitTech management team website.pptx` 第 5 頁「Strategic Focus Areas」投影片的排版（客戶截圖 `螢幕擷取畫面 2026-09-08 135710.png` 為證）。**目前版本**（`WeInvestIn.tsx`）：
    - **桌機（`lg` 以上）**：三欄 CSS Grid（`grid-cols-[1fr_auto_1fr]`）——左欄兩項文字（Early Cancer Detection／Neurological Disorders 由上而下）、中間為 2×2 花瓣狀圖示叢（沿用 `borderRadius: "50% 50% 50% 0"` 旋轉技法，四片尖角朝內緊貼形成風車狀，統一淺藍色底＋深藍圖示，不再依項目分色）、右欄兩項文字（Novel Target Drug／Rare Genetic Diseases 由上而下）；純 CSS Grid 排列，無 SVG 連接線
    - **手機／平板（`lg` 以下）**：簡化為圖示＋文字的直式列表（`sm:grid-cols-2`），小尺寸花瓣圖示＋標題＋說明
    - 與原始簡報唯一刻意的差異：描述文字**不使用**紅色粗體首字（原簡報有此設計，但客戶已明確指示取消，確認維持不加回）
    - 2026-09-08 修正花瓣旋轉角度：`borderRadius: "50% 50% 50% 0"` 的預設尖角在左下角，左上格需轉 270 度（非 90 度）、右下格需轉 90 度（非 270 度）尖角才會朝向叢集中心；修正前左上／右下兩片轉錯方向，四片合起來未能拼成完整圓形
  - **Team 頁主要介紹文＋全員簡短敘述／LinkedIn（依簡報第 17 頁「Team」總覽投影片）**：試點功能（Charlene Hu 單人）驗證無誤後，客戶提供簡報第 17 頁完整資料，正式擴及全部 8 位成員：
  - **主要介紹文**：`data/pages/leadership-team-intro.en.md` 改為客戶指定文字「NovaRadar's core team pairs PhD-level biomedical research with operational and investment expertise, so every opportunity is assessed on rigorous science and disciplined risk control.」（僅更新英文版；繁中版 `leadership-team-intro.md` 維持原文未動，因繁中為權威語言依規範須人工撰寫、不由本工具自動翻譯覆蓋，待客戶提供正式中文版本後再更新，兩版文意暫時不同步屬已知狀態）
  - **簡短敘述＋LinkedIn**：`data/team-members.json` 新增 `short_bio_zhTW`／`short_bio_en` 欄位（`lib/cms/types.ts` `TeamMember` 介面同步新增），內容取自簡報第 17 頁每人一段的簡短介紹文字（與 `bio_*` 完整履歷是不同文案，分開儲存），中文版暫以英文全文代入（比照 `bio_zhTW` 既有慣例）。8 位成員的 `linkedin_url` 依簡報第 17 頁補齊：**僅 4 位經營團隊成員（Charlene Hu／Maggie Lu／Ping-Yang Yeh／Victoria Wang）有提供**，4 位投資顧問（Audrey Tseng／Jane Tsai／Patrik Frei／Michael Su）簡報未附 LinkedIn 網址，`linkedin_url` 維持空字串
  - **UI 呈現**（`components/sections/TeamGrid.tsx`）：卡片內簡短敘述＋LinkedIn 圖示改置於「個人照片下方」（姓名／職稱之後），無 LinkedIn 網址者（4 位顧問）僅不顯示圖示、版面仍對齊；原本滑鼠 hover 顯示的預覽文字來源也一併改用 `shortBio`（優先）取代原本的「完整履歷第一段」，避免同一人在 hover 預覽與卡片靜態文字出現兩種不同措辭的摘要
    - 2026-09-08 客戶反饋簡短敘述文字被截斷看不全，移除 `line-clamp-4` 讓文字完整顯示（卡片改為隨內容自然撐高，同一排卡片高度略有落差屬正常現象），同時將照片與文字區塊寬度由 `max-w-[200px]` 加寬到 `max-w-[240px]`（`lg` 斷點下 4 欄網格每欄約有 254px 空間，加寬後仍有餘裕不會溢出）
    - 2026-09-08 再次調整：(1) 滑鼠移到照片上時原本會帶出履歷摘要文字＋引導語，客戶指示改為**只保留引導語**（沿用既有翻譯字串 `TeamPage.clickForBio`「Click to read full bio →」／「點擊查看完整介紹 →」，置中顯示於深色遮罩上），移除摘要文字本身；(2) 照片下方簡述文字改為兩端對齊（`text-justify`）＋自動連字號斷行（CSS `hyphens: auto`，搭配 `lang="en"` 讓瀏覽器套用英文斷字規則），避免窄欄位英文長字被硬擠到下一行造成邊緣參差不齊。`lang="en"` 屬權宜設定，待 `short_bio_zhTW` 補上正式中文翻譯後應一併檢視是否還需要
- **Charlene Hu 照片替換＋LinkedIn 連結（試點功能）**：`public/images/team/charlene-hu.jpg` 換成客戶提供新照（`NovaRada Data/Charlene Hu 照片.jpg`，原始 2042×2725，以 `sharp` `resize({fit:'cover', position:'north'})` 裁切為 800×1000 與既有團隊照規格一致，臉部完整置中）。新增 `components/ui/Icon.tsx` 的 `linkedin` icon（沿用現有手繪 line icon 風格自行設計的簡化「in」符號，非直接使用 LinkedIn 官方商標圖檔）。`data/team-members.json` 中 Charlene Hu 的 `linkedin_url` 欄位（schema 原本就有此欄位但先前皆為空字串）填入 `https://www.linkedin.com/in/charlenehu`。LinkedIn 連結顯示於兩處：(1) Team 主頁卡片，姓名／職稱下方（獨立於開啟履歷彈窗的 `<button>` 之外，避免點擊事件衝突）；(2) 點擊開啟的履歷彈窗內文最下方。`app/[locale]/about/leadership-team/page.tsx` 的 `memberViews` mapping 與 `TeamGrid.tsx` 的 `TeamMemberView` 介面新增 `linkedinUrl` 欄位；孤兒路由 `[slug]/page.tsx`（個人獨立頁）也同步加上履歷文字下方的 LinkedIn 連結供一致性。**其餘團隊成員的 LinkedIn 網址客戶尚未提供，`linkedin_url` 暫維持空字串**（元件已依欄位是否有值條件式渲染，之後取得網址後只需更新 `data/team-members.json` 即可自動顯示，不需改程式碼）
  - 除錯記錄：測試時發現彈窗仍顯示舊照片，原因是 Next.js dev 的圖片最佳化快取（`.next/cache`）以路徑而非檔案內容雜湊為 key，換圖後未隨之失效；清除 `.next` 重啟 dev server 後正常顯示新照片，之後若再遇到類似「明明換了檔案但畫面沒更新」的情況可優先懷疑此快取問題
- **Team 頁橫幅圖片換新**：Team 主頁（`/about/leadership-team`）與個人詳細頁（`[slug]`）原本沿用與 About 各子頁相同的 `banner-about.jpg`（DNA 意象），客戶反饋與 About 頁重複，改用新素材 `public/images/banner-team.jpg`（Unsplash 免費商用授權，攝影師 Vitaly Gariev，四位專業人士自信站立的團隊合照，原始 2400×1350，象徵資深經營團隊）。因原圖人臉集中在上方約 15-20% 高度處，而橫幅本身很矮（`h-44`／`sm:h-56`），`object-cover` 預設置中會裁掉臉部，故 `PageHeaderBanner.tsx` 新增 `imagePosition` 選填 prop（CSS `object-position`，預設 `"center"`），Team 頁兩處呼叫皆傳入 `"center 18%"` 讓四張臉完整露出；其餘沿用 `banner-about.jpg` 的 About 子頁不受影響
- **頁首橫幅圖片文字移除**（`components/layout/PageHeaderBanner.tsx`）：客戶指示 About／Team／News／Contact 等頁頂部橫幅圖片上疊加的標題文字（如 "Company Profile"／"Leadership Team"／"News Report"／"Contact"）全部移除。此元件為共用元件，被 9 個頁面引用（About 五個子頁、Team 主頁與個人詳細頁、News 兩個子頁、Contact），故直接修改共用元件、一次套用到全部使用頁面，而非個別頁面調整。做法：`<h1>{title}</h1>` 改加上 `sr-only`（視覺隱藏但保留在 DOM 中，供螢幕閱讀器與 SEO 使用，維持頁面仍有語意上的 `h1`），而非整個刪除。多數子頁（company-intro／organization／company-history／investment-strategy／leadership-team）內文區塊仍有對應的 `h2` 標題可辨識頁面主題；Contact 頁與 News 頁的內文（`data/pages/contact.*.md`、`news-intro.*.md`）本身沒有額外標題，移除橫幅文字後這兩頁已無視覺標題文字，僅能從導覽列 active 狀態／瀏覽器分頁標題辨識，屬客戶明確指示的結果
- **Team 頁標題**（`app/[locale]/about/leadership-team/page.tsx`）：移除內文標題「Leadership Team」前方的裝飾豎線（`<span className="h-6 w-1 ...">`，視覺上易誤讀成「I」），只保留純文字標題，其餘不變
- **About／公司簡介頁文字調整**（`app/[locale]/about/company-intro/page.tsx`、`data/pages/company-intro.md`、`data/pages/company-intro.en.md`）：移除內文重複的「I Company Profile」標題（`PageHeaderBanner` 頂部橫幅已顯示同名標題「Company Profile」，內文區塊原本又重複顯示一次帶裝飾豎線的 `<h2>`，屬冗餘，客戶指示取消，故移除該 `<h2>` 區塊，`StaticPageBody` 內容直接接在頁面頂部橫幅下方）；內文最後一段標題「Our Mission」／「我們的使命 Our Mission」改為「Mission」／「我們的使命 Mission」
- 2026-09-08 客戶指示首頁說明文字對齊統一：參考 We Invest In 下方 Strategic Focus 四項目（左右文字欄，本來就是左靠）為範例，將 `ValueProps.tsx`（6 張卡片）、`ClinicalValueBridge.tsx`（4 個步驟）、`WeInvestIn.tsx`（上方 3 張卡片）的標題／說明文字從置中（`text-center`）改為左靠：僅移除卡片外層 `div` 的 `text-center` class，圖示（`mx-auto`）維持置中不動，故版面呈現「icon 置中在上、文字左靠在下」的組合；`ClinicalValueBridge` 步驟間的橫向連接線（`absolute left-1/2 ...`）是以每個 grid 欄位的置中點定位，與文字對齊方式無關，確認移除 `text-center` 後未受影響仍正確連接
  - 順帶發現另一既有翻譯缺漏（非本次造成）：`messages/zh-tw.json` 的 `WeInvestIn.items.*.label`（Market Gap／Technology Innovation／Domain Expertise）也未翻譯，繁中版目前顯示英文標籤，與 `StrategicFocus.areas.*.label` 是同類型缺漏
- **2026-09-08 補齊 The Clinical-Value Bridge／We Invest In 繁中翻譯**：客戶反饋首頁「The Clinical-Value Bridge」與「We Invest In」兩區塊有英文未翻譯。盤點後發現這兩區塊（含合併進來的 Strategic Focus 四項目）的**標題與標籤**過去只有英文原文、`description` 有翻譯的不一致狀態，一次補齊：`messages/zh-tw.json` 的 `ClinicalBridge.title`（"The Clinical-Value Bridge" → 「臨床價值橋樑」）與四個步驟 `label`（Source／Bridge／Accelerate／Exit → 尋源／橋接／加速／出場）、`WeInvestIn.title`（"We Invest In" → 「投資領域」）與三項 `label`（Market Gap／Technology Innovation／Domain Expertise → 市場缺口／技術創新／領域專業）、`StrategicFocus.title`（→ 「策略聚焦領域」，目前未顯示但一併補上）與四項 `label`（→ 早期癌症偵測與治療／新標的藥物開發／罕見遺傳疾病／神經系統疾病治療）。翻譯風格比照既有 `ValueProps.title`／`subtitle` 先例（簡短行銷用語由本工具直接翻譯，非長篇履歷內文那種需等客戶正式提供的情況）
- **Team 頁互動改版**（`components/sections/TeamGrid.tsx`）：個人履歷不再透過點擊大頭照導向獨立頁面，改為滑鼠移到頭像時動態帶出履歷第一段文字預覽（深藍漸層疊加＋`line-clamp-5`＋「Click to read full bio →」提示，純 CSS `group-hover`，觸控裝置無 hover 效果但直接點擊一樣能開啟），點擊後以固定彈窗（modal，`fixed inset-0` + 背景模糊遮罩）呈現完整多段落履歷，右上角「X」按鈕（`aria-label` 取自 `TeamPage.close`）點擊、按 Esc、或點擊背景遮罩皆可關閉並回到 Team 主頁（無路由跳轉，開關純為 React state）。`TeamGrid.tsx` 因此改為 `"use client"` 元件（原為 server component，翻譯改用 `next-intl`（client hook）而非 `next-intl/server`）。`app/[locale]/about/leadership-team/page.tsx` 的 `memberViews` mapping 新增 `bio` 欄位（原本只有 `name`／`title`）。原本的個人詳細頁路由 `app/[locale]/about/leadership-team/[slug]/page.tsx` **保留未刪除**（不再從 Team 主頁連結過去，但直接訪問網址仍可看到，屬孤兒路由，之後如確定不需要可評估刪除或保留作為可分享的個人頁連結）。新增翻譯 key：`TeamPage.close`（「關閉」）、`TeamPage.clickForBio`（「點擊查看完整介紹」）

## 2026-09-07 內容大改版（依客戶簡報 MitoBitTech management team website.pptx）

客戶提供簡報 `NovaRada Data/MitoBitTech management team website.pptx`，本機無 PowerPoint／LibreOffice，改用 unzip 解開 pptx（本質是 zip）直接讀取 `ppt/slides/slideN.xml` 的 `<a:t>` 文字與 `ppt/media/` 圖片、比對 `_rels` 對應關係取得每頁文字、圖示與大頭照的對應。英文為簡報原文（權威來源），繁中為本次翻譯。

- **首頁區塊順序**（`app/[locale]/page.tsx`）：Hero → ValueProps → ClinicalValueBridge（The Clinical-Value Bridge）→ WeInvestIn（We Invest In，含 Strategic Focus Areas 內容，2026-09-08 起合併，見下方對應章節），完全對應簡報第 2～5 頁的順序（原本的 `PortfolioLogoWall` 首頁投組預覽區塊、`ProposalForm` 提案表單區塊皆已從首頁移除／取代）。`PortfolioLogoWall.tsx` 元件保留未刪除但目前未被任何頁面引用
  - **ValueProps**：原本 4 項假設性文案＋圓形照片，換成簡報第 2 頁「What Differentiating NovaRadar to Accelerate Success」的 6 項差異化優勢，改為 icon 卡片（3 欄 x 2 排），資料在 `data/value-props.json`（`ValueProp.image` 欄位改成 `icon`，見 `lib/cms/types.ts`），元件 `components/sections/ValueProps.tsx`；標題文案演進見下方「2026-09-08 首頁內文區塊調整」
  - **The Clinical-Value Bridge**：簡報第 3 頁四步驟流程圖（Source → Bridge → Accelerate → Exit），元件 `components/sections/ClinicalValueBridge.tsx`，文案在 `messages/*.json` 的 `ClinicalBridge` namespace
  - **We Invest In**：簡報第 4 頁（3 項：Market Gap／Technology Innovation／Domain Expertise），元件 `components/sections/WeInvestIn.tsx`，緊接在 Clinical-Value Bridge 後面
  - **Strategic Focus Areas**：簡報第 5 頁（4 項，原描述文字第一個字元用紅色粗體呼應原簡報的紅字強調），2026-09-08 起已併入 We Invest In 區塊呈現，不再是獨立標題／區塊，詳見下方「2026-09-08 首頁內文區塊調整」
  - `ProposalForm`（原「Business Proposal」提案表單區塊）已完全移除，`components/sections/ProposalForm.tsx`、`app/api/contact/route.ts`、`lib/forms/lead-sink.ts`（Resend 寄信）等表單後端程式碼**保留未刪除**，目前沒有任何頁面引用，屬孤兒程式碼，之後若要恢復提案表單或改作其他用途可以重新掛上
- **Portfolio 頁**（`/portfolio`）：2026-09-08 已依客戶指示整頁移除，見下方「2026-09-08 Hero 簡化與 Portfolio 頁移除」
- **Contact 頁**（`/contact`）：僅保留聯絡資訊（`ContactInfoBlock`），不含 We Invest In／Strategic Focus Areas（改放首頁）與提案表單（已移除）
- **Team 頁**（`/about/leadership-team`）：`data/team-members.json` 從單筆 placeholder 換成簡報第 6-16 頁的 8 位真實團隊成員。排序：2 位 Co-Founder（Charlene Hu、Maggie Lu）在前，2 位 Managing Partner（Ping-Yang Yeh、Victoria Wang）在後，其餘 4 位顧問（Audrey Tseng／Jane Tsai／Patrik Frei／Michael Su）分「投資顧問」群組列於下方。大頭照存於 `public/images/team/{slug}.jpg`（從簡報圖片裁切，部分用 sharp 手動裁切臉部位置，例如 Charlene Hu 的原圖是演講側拍照，自動抓取焦點失敗因而手動指定裁切範圍，確保雙眼完整不被裁掉）。姓名沿用簡報英文原文，未自行翻譯／杜撰中文姓名；`bio_zhTW` 欄位暫時放入與 `bio_en` 相同的英文全文（客戶尚未提供正式中文翻譯），待客戶確認後再更新
  - `TeamGrid.tsx` 改為 broadvision.com/team 風格：大頭照＋姓名＋職稱卡片，依 `department` 分兩組（經營團隊／投資顧問＝Advisors），點擊卡片連到 `/about/leadership-team/[slug]` 個人完整介紹頁（`app/[locale]/about/leadership-team/[slug]/page.tsx`，`generateStaticParams` 依 `getTeamMembers()` 產生）
- **Header 導覽 / 語言切換 / logo**：詳見下方「Header 導覽」與「雙語策略」章節
- 新增共用 icon（`components/ui/Icon.tsx`）：`wrench`／`flask`／`rocket`／`target`／`handshake`／`lightbulb`／`barChart`／`search`／`bridge`，皆為手繪 SVG line icon，非簡報原始點陣小圖示（簡報原圖示僅 42×52px 解析度太低無法直接使用）
- **2026-09-08 全站圖示盤點與重新指派**：客戶指示檢查主頁各項目小圖示是否貼切且不重複。盤點發現首頁 17 個項目（ValueProps 6 個＋Clinical-Value Bridge 4 個＋We Invest In 3 個＋Strategic Focus 4 個）共用同一份 icon 池，其中 `rocket`／`target`／`lightbulb` 皆各自重複使用 2-3 次。新增 4 個 icon（`briefcase`／`compass`／`pill`／`brain`，風格比照既有手繪 line icon）後重新指派，17 個項目彼此不再重複，且個別語意更貼切：
  - `data/value-props.json`：「Speed to Clinical Proof of Concept」`rocket` → `clock`（強調「縮短時間」而非單純「速度」，避免與 Clinical-Value Bridge 的 `Accelerate` 步驟重複使用 rocket）；「Pharma Commercialization Mindset & Exit-Driven Investing」`target` → `briefcase`（商業化／併購交易意象，避免與 Clinical-Value Bridge 的 `Exit` 步驟重複使用 target）
  - `components/sections/WeInvestIn.tsx`：`marketGap`（Market Gap）`target` → `compass`（尋找/定位市場機會，避免與 `Exit` 步驟重複）；Strategic Focus 的 `targetDrug`（Novel Target Drug Development）`lightbulb` → `pill`（藥物膠囊意象，更貼切且避免與 We Invest In 的 `techInnovation` 重複使用 lightbulb）；`neuro`（Neurological Disorders Treatment）`leaf` → `brain`（原本的葉子圖示與神經系統治療語意不符，改為腦部意象）
  - Clinical-Value Bridge 的 `search`／`bridge`／`rocket`（Accelerate）／`target`（Exit）、ValueProps 其餘 4 項、We Invest In 的 `lightbulb`（Technology Innovation）／`users`（Domain Expertise）、Strategic Focus 的 `barChart`（Early Cancer Detection）／`shield`（Rare Genetic Diseases）皆維持原圖示不變（本來就貼切且無重複）

## 2026-09-08 Hero 簡化與 Portfolio 頁移除

依客戶指示：

- **Hero 區塊簡化**（`components/sections/HeroCarousel.tsx`）：移除原本置中的 `h1` 主標題（`Our Mission`／`我們的使命`）與其下方「Explore Our Portfolio」CTA 按鈕（連到 `/portfolio`），改將原副標題文字（`Investing in novel technologies...`／`投資推動醫療與生活品質提升的創新技術`）放大為主標題（`h1`）樣式呈現。`data/hero-slides.json` 的 `title_*`／`ctaLabel_*`／`ctaHref` 欄位資料保留未刪除（不影響顯示，純粹未被讀取），`HeroSlideView` 介面與 `app/[locale]/page.tsx` 的 mapping 已同步移除對應欄位
- **Hero 背景改用短動畫＋參考同業版面比例**：客戶反饋靜態圖搭配文字效果依舊不佳，並指定參考 bioventuresinvestors.com 的動畫與文字比例。實際比對該站（用 Playwright 截圖＋量測 DOM，該站 hero 其實是靜態圖非影片，但視覺上用發光網絡/粒子意象營造科技動態感）後，採用其版面比例：hero 高度改為 `min-h-[72vh]`（原為 `min-h-screen` 100vh 滿版）、文字改為靠左下（`items-start justify-end text-left`，原為置中）、字級放大（`lg:text-6xl`，原為 `lg:text-5xl`）。背景改為真正的短循環影片 `public/videos/hero-bg-dna.mp4`（Pexels License 免費商用授權，攝影師 Nicola Narracci，原始 1920×1080，teal 光點 DNA 雙股螺旋意象，與品牌色和參考站的粒子網絡風格皆相符，15.8MB／本機無 ffmpeg 故未壓縮，屬已知待優化項目見下方待辦），僅在桌面（`min-width: 768px`）且使用者未設定「減少動態效果」（`prefers-reduced-motion`）時透過 `<video autoPlay muted loop playsInline>` 播放；手機/平板與偏好減少動態者維持顯示原本的 `hero-bg-slogan.jpg` 靜態圖（DNA 螺旋渲染圖，2026-09-08 稍早採用，見上方素材說明），避免行動網路消耗過多流量。前景疊加從置中的黑色遮罩改為由左至右淡出的深藍漸層（文字後方深、右側動畫清晰可見），呼應參考站的色彩處理方式
- **Hero 文字改為多行右側對齊＋Title Case**：客戶反饋背景圖搭配文字效果依舊不佳，指定參考 vivocapital.com 的動畫與文字比例。實際比對該站（Playwright 截圖＋量測）後發現該站首頁大標題「Catalyzing / Innovation and Growth / in Global Healthcare Markets」為**手動分行、靠右對齊**、套用英文標題大小寫慣例（Title Case：主要單字字首大寫，and／or／in／to／of 等連接詞/介詞維持小寫）；其餘區塊標題（如「Our Track Record」）則是靠左對齊，故僅將此手法套用在 Hero 主標題（本頁面唯一對應「多列右側對齊」的元素），未套用到其他區塊。實作：`data/hero-slides.json` 的 `subtitle_en`／`subtitle_zhTW` 改為以 `\n` 分隔的三行文案（`Investing in Novel Technologies\nto Advance Healthcare\nand Quality of Life`／繁中對應分行，文字本身未更動僅加分行），`HeroCarousel.tsx` 以 `split("\n")` 渲染為多個 `<span className="block">`，容器改為 `items-end justify-end text-right`（原為靠左），背景漸層方向同步翻轉（改為左側清晰、文字後方右側加深）
- **Hero 字級改用 fluid clamp 避免中間寬度截斷**：客戶反饋三行文案要「各一列」且字體要再放大。改用 Tailwind 固定斷點（`text-5xl sm:text-6xl lg:text-7xl`）搭配 `sm:whitespace-nowrap` 時，在 `lg` 斷點剛切換的中間寬度（約 1024px 桌機）字級跳到 72px 但容器變窄，导致最長一行「Investing in Novel Technologies」被裁掉一截（實測截圖發現，`document.documentElement.scrollWidth` 因 `overflow-hidden` 未偵測到但視覺上確實被裁切）。改為 `text-[clamp(1.75rem,4.2vw,5.25rem)]`（隨版面寬度連續縮放，而非跳階），並用 Playwright 在 640～1920px 共 9 組寬度量測每行文字的實際 `getBoundingClientRect`，確認任何寬度下都不會超出容器，同時桌機大螢幕（1920px）字級可達約 80px，比原本固定 `lg:text-7xl`（72px）更大
- **Portfolio 頁整頁移除**：`app/[locale]/portfolio/page.tsx` 路由檔案已刪除（造訪 `/portfolio` 會 404），`lib/nav/config.ts` 的導覽項目已移除。以下相關程式碼／資料**保留未刪除**（屬孤兒程式碼，之後如需恢復可重新掛上）：`components/sections/PortfolioCardWall.tsx`、`components/sections/PortfolioLogoWall.tsx`（本來就已是孤兒元件）、`lib/cms/portfolio.ts`、`data/portfolio-companies.json`、`data/pages/portfolio-intro.md`、`public/images/banner-portfolio.jpg`、`messages/*.json` 的 `Portfolio` namespace 與 `Nav.portfolio` key

## 雙語策略（已於 2026-09-09 終止，改為僅 EN，見下方歷史記錄）

- **2026-09-09 更新：依客戶指示移除繁中頁面與語言切換 UI，網站僅保留 EN**：`i18n/routing.ts` 的 `locales` 從 `["zh-tw", "en"]` 改為 `["en"]`（`localePrefix` 維持 `"always"`，路由仍為 `/en/...`）；`messages/zh-tw.json` 已刪除；`Header.tsx` 的地球圖示語言切換選單（含 `localeLabels`／`localeMenuOrder`／下拉選單，桌面與手機版皆有）整段移除。`lib/i18n/localizedField.ts` 的 `localizedField()` 簽名同步簡化為 `(entry, fieldBase)`（移除 `locale` 參數，固定取 `_en` 並 fallback `_zhTW`），`lib/cms/pages.ts` 的 `getStaticPage()` 簽名簡化為 `(slug)`（固定讀 `{slug}.en.md`，不存在則 fallback 繁中 `.md`）——所有呼叫端已同步移除 `locale` 引數。`data/*.json`／`data/pages/*.md` 的 `_zhTW`／繁中欄位**保留未刪除**（作為原始資料來源與 `_en` 缺漏時的 fallback，非顯示用途）
- 以下為 2026-09-09 之前的雙語策略歷史記錄（僅供追溯，目前已不適用於路由/UI）：
  - 語言：繁體中文 / English（2026-09-07 取消簡體中文，原三語策略／OpenCC 自動轉換架構已移除：`lib/i18n/opencc.ts`、`lib/cms/localize.ts`、`messages/zh-cn.json`、`data/pages/*.zh-cn.md` 皆已刪除，`opencc-js` 依賴已移除）
  - 預設語言：English（`i18n/routing.ts` 的 `defaultLocale`）
  - 路由策略：所有語言皆加前綴（`/zh-tw` `/en`），透過 `next-intl` + `proxy.ts`（middleware）實作
  - 語言切換 UI：Header 為單純地球圖示按鈕，點擊後彈出下拉選單供選擇，手機版選單直接以列表呈現。選單顯示順序由 `localeMenuOrder`（`["en", "zh-tw"]`，2026-09-08 依客戶指示 EN 在上、繁中在下）決定，與 `routing.locales`（`["zh-tw", "en"]`）刻意分開、互不影響
  - 翻譯來源：繁中人工撰寫（主要語言，唯一權威來源）；英文人工翻譯，可能落後於繁中版本
  - 英文內容缺漏時的處理：fallback 顯示繁中內容，並顯示「尚未翻譯」提示文字（實作於 `lib/i18n/localizedField.ts`）
  - `data/pages/*.md` 語系覆寫慣例：`{slug}.md` 為繁中權威來源；`{slug}.en.md` 為選填的人工譯文檔，`getStaticPage()` 會優先讀取，不存在才 fallback 到繁中原文
  - `category`／`investment_stage` 這類非逐欄位多語系的固定列舉值，翻譯放在 `messages/*.json` 的 `Taxonomy` namespace（以繁中值當 key），而非幫每筆內容資料加 `_en` 欄位

## 品牌色票

- Primary（深藍）`#0c344c`、Secondary（青綠）`#04948c`：2026-09-07 依官方 logo 向量檔（`NovaRadar_Logo_向量檔_確認用.pdf`）校正，定義於 `app/globals.css` 的 `--brand-primary` / `--brand-secondary`
- Accent（金色）`#c9a227`：沿用先前暫代值，logo 本身無強調色可對照，待品牌手冊定案
- 中性色階：待補

## 字型

- 待補（標題字型、內文字型、中英文分開設定時的對應規則）

## 語氣與文案規範

- 待補（品牌語氣關鍵字、禁用詞、繁中/英文各語言的語氣差異）

## 待辦

- [x] 補上品牌色票（Primary/Secondary Hex 值，2026-09-07）
- [ ] 補上字型名稱與來源
- [ ] 補上語氣規範與文案範例
- [ ] 法務/合規確認資料是否須留台灣主機，決定是否維持 Sanity + Vercel
- [ ] 聯絡表單是否需整合特定 CRM（目前僅接 email）
- [ ] 真實團隊成員、被投企業、新聞內容到位後取代 `data/*.json` 中的 placeholder
- [ ] 填入 `RESEND_API_KEY` / `CONTACT_INBOX_EMAIL` 後，需實際寄一封測試信確認信件送達與欄位內容正確（目前僅驗證到 log 記錄，未實際寄信）
- [ ] 填入 `NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_META_PIXEL_ID` 後，需在 GA4/Meta 後台確認事件真的收得到（目前僅完成程式碼串接，未用真實 ID 驗證）
- [ ] 表單流量變大後評估加上 reCAPTCHA v3（目前僅 honeypot 防護）
- [ ] `/login`、`/signup` 目前僅為 Coming soon 佔位頁，需確認外部（投資人）／內部人員登入的實際需求（SSO？各自獨立帳號系統？）後才能開發真正功能
- [x] `hero-bg-slogan.jpg` 解析度偏低問題已處理（2026-09-08 改用 Unsplash 授權圖取代，原客戶提供檔為 Getty 未授權浮水印樣張，見上方說明）
- [ ] （2026-09-09 起網站僅顯示 EN，此項已非顯示阻塞，僅影響原始資料完整性）`data/team-members.json` 8 位團隊成員的 `bio_zhTW`／`short_bio_zhTW` 目前是英文全文暫代，需要正式中文翻譯
- [ ] （2026-09-09 起網站僅顯示 EN，此項已非顯示阻塞）`data/pages/leadership-team-intro.md`（繁中版 Team 頁介紹文）尚未依英文新版「NovaRadar's core team pairs PhD-level...」同步更新，待客戶提供正式中文版本
- [ ] 4 位投資顧問（Audrey Tseng／Jane Tsai／Patrik Frei／Michael Su）的 LinkedIn 網址簡報未提供，待客戶補充後填入 `linkedin_url`
- [x] `ProposalForm`／`/api/contact` 提案表單已從頁面移除但程式碼保留，需確認是否要在其他頁面重新掛上，或正式棄用整組刪除 → 2026-09-09 已重新掛上：Contact 頁改款為 glintmed.com 格式，`ProposalForm.tsx` 刪除並以簡化版 `ContactForm.tsx`（Name／Tel／Email／Remark）取代，見上方 Change Log
- [ ] News 頁 3 篇活動報導（2026-09-09 新增）：第 3 篇（NHRI 演講）確切日期未公開，內文以 LinkedIn 貼文相對時間推估為 2026-06-15，待客戶確認正確日期後更新 `data/news.json` 的 `publish_date`；另 3 篇皆未附可公開的原始 LinkedIn 貼文網址（`source_url` 留空），如需可點擊來源連結需請客戶提供
- [ ] Portfolio 頁（2026-09-08 已移除，見上方說明）確認是否為永久決策；若確定不再需要，`PortfolioCardWall`／`PortfolioLogoWall`／`lib/cms/portfolio.ts`／`data/portfolio-companies.json` 等孤兒程式碼可考慮正式刪除；若之後仍要恢復投資組合頁，需重新建立路由並掛回導覽
- [x] `public/videos/hero-bg-dna.mp4` 壓縮已完成（2026-09-09）：透過 winget 安裝 ffmpeg，改用 libx264 CRF 26、解析度降為 1280×720、移除無用音軌，檔案從 15.8MB 降至約 2.4MB，畫質經截圖比對無明顯差異；webm `<source>` 備援尚未做，如需再進一步壓縮可評估
- [ ] `StrategicFocus.title`（"Strategic Focus Areas"）翻譯 key 因標題移除已無使用處（保留未刪除）；若確定不再需要獨立標題，可評估是否要正式清理
- [x] `messages/zh-tw.json` 的 `StrategicFocus.areas.*.label`／`WeInvestIn.items.*.label`／`ClinicalBridge.title`／`ClinicalBridge.steps.*.label`／`WeInvestIn.title` 未翻譯問題已修正（2026-09-08；`messages/zh-tw.json` 本身已於 2026-09-09 隨語言切換移除功能一併刪除，此項僅留歷史記錄）
