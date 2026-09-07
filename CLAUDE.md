# NovaRadar Web 專案規範

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
- 圖片素材：`public/images/hero-bg-lab.jpg`（首頁 Hero 背景）取自 Unsplash，攝影師 Nathan Rimoux，[Unsplash License](https://unsplash.com/license) 免費商用免署名；上層疊加品牌色漸層（`opacity: 0.88`）確保文字對比。之後若要換圖，同樣需確認來源授權可商用，不要直接用 pngtree 等付費圖庫的預覽圖
  - `public/images/value-*.jpg`（首頁「為什麼選擇瑞大」四張圖示照片）同樣取自 Unsplash 免費授權，攝影師與出處記錄於 `data/value-props.json` 各筆 `image_credit`
  - `public/images/banner-{about,portfolio,news,contact}.jpg`（關於我們／投資組合／新聞中心／聯絡我們各主項目頁頂部橫幅，`components/layout/PageHeaderBanner.tsx`）同樣取自 Unsplash 免費授權：banner-about 攝影師 Braňo、banner-portfolio 攝影師 Samson、banner-news 攝影師 AbsolutVision、banner-contact 攝影師 Radisson US
- Logo：`public/images/logo-mark.png`（Header 用，含 tagline 裁切版）、`logo-full.png`（含「Bio Venture」tagline，供較大版位使用）、`logo-*-on-dark.png`（深色背景版，NovaRadar 字樣改白色、R 字母維持青綠色，供 Footer 深藍底使用）。原始向量檔為 `NovaRada Data/NovaRadar_Logo_向量檔_確認用.pdf`（2026-09-07 客戶確認版），因本機無 PDF 轉 SVG 工具，改用 `pdfjs-dist` + `@napi-rs/canvas` 高解析度點陣化後以 `sharp` 去背/裁切產生，非真正向量檔；若之後拿到 AI/EPS/SVG 原始檔應改用向量版本重新輸出
- 詳細架構規劃見 `content-model.md` 與對應 plan 文件

## 三語策略

- 語言：繁體中文 / 简体中文 / English
- 預設語言：繁體中文（zh-TW）
- 路由策略：所有語言皆加前綴（`/zh-tw` `/zh-cn` `/en`），透過 `next-intl` + `middleware.ts` 實作
- 翻譯來源：
  - 繁中：人工撰寫（主要語言，唯一權威來源）
  - 簡中：由繁中透過 OpenCC 自動轉換，於 CMS 資料抓取層轉換（非逐請求）。OpenCC 僅做字元轉換，不處理兩岸用語差異（如「新創」→「初创」、「資訊」→「信息」、「智慧」→「智能」、「數位」→「数字」），如遇這類詞彙需人工覆寫則於個別欄位新增 `_zhCN` 值，或 `data/pages/*.zh-cn.md` 覆寫檔
  - 英文：人工翻譯，可能落後於繁中版本
- 英文內容缺漏時的處理：fallback 顯示繁中內容，並顯示「尚未翻譯」提示文字（實作於 `lib/i18n/localizedField.ts`）
- `data/pages/*.md` 語系覆寫慣例：`{slug}.md` 為繁中權威來源；`{slug}.en.md`／`{slug}.zh-cn.md` 為選填的人工譯文/用語覆寫檔，`lib/cms/pages.ts` 的 `getStaticPage()` 會優先讀取，不存在才 fallback 到自動轉換/繁中原文
- `category`／`investment_stage` 這類非逐欄位多語系的固定列舉值，翻譯放在 `messages/*.json` 的 `Taxonomy` namespace（以繁中值當 key），而非幫每筆內容資料加 `_en`／`_zhCN` 欄位

## 品牌色票

- Primary（深藍）`#0c344c`、Secondary（青綠）`#04948c`：2026-09-07 依官方 logo 向量檔（`NovaRadar_Logo_向量檔_確認用.pdf`）校正，定義於 `app/globals.css` 的 `--brand-primary` / `--brand-secondary`
- Accent（金色）`#c9a227`：沿用先前暫代值，logo 本身無強調色可對照，待品牌手冊定案
- 中性色階：待補

## 字型

- 待補（標題字型、內文字型、中英文分開設定時的對應規則）

## 語氣與文案規範

- 待補（品牌語氣關鍵字、禁用詞、繁中/簡中/英文各語言的語氣差異）

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
