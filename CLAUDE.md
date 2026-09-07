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
- 圖片素材：`public/images/hero-bg-slogan.jpg`（首頁 Hero 背景，2026-09-07 起）為客戶提供素材（`NovaRada Data/NovaRadar Web Slogon背景.png` 轉檔），非 Unsplash 圖庫；原始檔僅 748×864，全螢幕大尺寸顯示時可能略糊，之後若拿到更高解析度版本應替換。上層疊加品牌色漸層（`opacity: 0.45`）＋純黑遮罩（`bg-black/45`）確保置中文字對比。舊版 `hero-bg-lab.jpg`（Unsplash，攝影師 Nathan Rimoux）已不再使用但保留檔案，之後若要換其他圖，需確認來源授權可商用，不要直接用 pngtree 等付費圖庫的預覽圖
  - `public/images/value-*.jpg`（原首頁「為什麼選擇瑞大」四張圖示照片）2026-09-07 起已不再使用（改為 icon 卡片，見下方「首頁／內容大改版」），檔案保留未刪除
  - `public/images/banner-{about,portfolio,news,contact}.jpg`（關於我們／投資組合／新聞中心／聯絡我們各主項目頁頂部橫幅，`components/layout/PageHeaderBanner.tsx`）同樣取自 Unsplash 免費授權：banner-about 攝影師 Braňo、banner-portfolio 攝影師 Samson、banner-news 攝影師 AbsolutVision、banner-contact 攝影師 Radisson US
- Logo：`public/images/logo-full.png`（Header 用，含「Bio Venture」tagline）、`logo-mark.png`（不含 tagline 的裁切版，備用）、`logo-*-on-dark.png`（深色背景版，NovaRadar 字樣改白色、R 字母維持青綠色，供 Footer 深藍底使用）。原始向量檔為 `NovaRada Data/NovaRadar_Logo_向量檔_確認用.pdf`（2026-09-07 客戶確認版），因本機無 PDF 轉 SVG 工具，改用 `pdfjs-dist` + `@napi-rs/canvas` 高解析度點陣化後以 `sharp` 去背/裁切產生，非真正向量檔；若之後拿到 AI/EPS/SVG 原始檔應改用向量版本重新輸出
- Header 導覽（`lib/nav/config.ts`）：2026-09-07 移除 ESG／Investors／Careers 三個 placeholder 項目（頁面本身仍在，只是不再出現在選單），新增「Team」（連到既有 `/about/leadership-team`）；另外在導覽列右側新增 `authNav`（Login／Sign Up），對應 `/login`、`/signup` 兩個新路由，目前皆為 `ComingSoonPage`（`auth` 插圖），供之後串接真正的外部（投資人）／內部人員登入功能
- 詳細架構規劃見 `content-model.md` 與對應 plan 文件

## 2026-09-07 內容大改版（依客戶簡報 MitoBitTech management team website.pptx）

客戶提供簡報 `NovaRada Data/MitoBitTech management team website.pptx`，本機無 PowerPoint／LibreOffice，改用 unzip 解開 pptx（本質是 zip）直接讀取 `ppt/slides/slideN.xml` 的 `<a:t>` 文字與 `ppt/media/` 圖片、比對 `_rels` 對應關係取得每頁文字、圖示與大頭照的對應。英文為簡報原文（權威來源），繁中為本次翻譯。

- **首頁區塊順序**（`app/[locale]/page.tsx`）：Hero → ValueProps（Why NovaRadar）→ ClinicalValueBridge（The Clinical-Value Bridge）→ WeInvestIn（We Invest In）→ StrategicFocusAreas（Strategic Focus Areas），完全對應簡報第 2～5 頁的順序（原本的 `PortfolioLogoWall` 首頁投組預覽區塊、`ProposalForm` 提案表單區塊皆已從首頁移除／取代）。`PortfolioLogoWall.tsx` 元件保留未刪除但目前未被任何頁面引用
  - **Why NovaRadar**：原本 4 項假設性文案＋圓形照片，換成簡報第 2 頁「What Differentiating NovaRadar to Accelerate Success」的 6 項差異化優勢，改為 icon 卡片（3 欄 x 2 排），資料在 `data/value-props.json`（`ValueProp.image` 欄位改成 `icon`，見 `lib/cms/types.ts`），元件 `components/sections/ValueProps.tsx`
  - **The Clinical-Value Bridge**：簡報第 3 頁四步驟流程圖（Source → Bridge → Accelerate → Exit），元件 `components/sections/ClinicalValueBridge.tsx`，文案在 `messages/*.json` 的 `ClinicalBridge` namespace
  - **We Invest In**：簡報第 4 頁（3 項：Market Gap／Technology Innovation／Domain Expertise），元件 `components/sections/WeInvestIn.tsx`，緊接在 Clinical-Value Bridge 後面
  - **Strategic Focus Areas**：簡報第 5 頁（4 項 2x2 排列，描述文字第一個字元用紅色粗體呼應原簡報的紅字強調），元件 `components/sections/StrategicFocusAreas.tsx`，緊接在 We Invest In 後面，皆在首頁同一頁內、非獨立頁面
  - `ProposalForm`（原「Business Proposal」提案表單區塊）已完全移除，`components/sections/ProposalForm.tsx`、`app/api/contact/route.ts`、`lib/forms/lead-sink.ts`（Resend 寄信）等表單後端程式碼**保留未刪除**，目前沒有任何頁面引用，屬孤兒程式碼，之後若要恢復提案表單或改作其他用途可以重新掛上
- **Portfolio 頁**（`/portfolio`）：維持原本 `data/pages/portfolio-intro.md` 靜態介紹文字＋實際投資組合公司列表（`PortfolioCardWall`），不含 Clinical-Value Bridge（該內容改放首頁，避免重複）
- **Contact 頁**（`/contact`）：僅保留聯絡資訊（`ContactInfoBlock`），不含 We Invest In／Strategic Focus Areas（改放首頁）與提案表單（已移除）
- **Team 頁**（`/about/leadership-team`）：`data/team-members.json` 從單筆 placeholder 換成簡報第 6-16 頁的 8 位真實團隊成員。排序：2 位 Co-Founder（Charlene Hu、Maggie Lu）在前，2 位 Managing Partner（Ping-Yang Yeh、Victoria Wang）在後，其餘 4 位顧問（Audrey Tseng／Jane Tsai／Patrik Frei／Michael Su）分「投資顧問」群組列於下方。大頭照存於 `public/images/team/{slug}.jpg`（從簡報圖片裁切，部分用 sharp 手動裁切臉部位置，例如 Charlene Hu 的原圖是演講側拍照，自動抓取焦點失敗因而手動指定裁切範圍，確保雙眼完整不被裁掉）。姓名沿用簡報英文原文，未自行翻譯／杜撰中文姓名；`bio_zhTW` 欄位暫時放入與 `bio_en` 相同的英文全文（客戶尚未提供正式中文翻譯），待客戶確認後再更新
  - `TeamGrid.tsx` 改為 broadvision.com/team 風格：大頭照＋姓名＋職稱卡片，依 `department` 分兩組（經營團隊／投資顧問＝Advisors），點擊卡片連到 `/about/leadership-team/[slug]` 個人完整介紹頁（`app/[locale]/about/leadership-team/[slug]/page.tsx`，`generateStaticParams` 依 `getTeamMembers()` 產生）
- **Header 導覽 / 語言切換 / logo**：詳見下方「Header 導覽」與「雙語策略」章節
- 新增共用 icon（`components/ui/Icon.tsx`）：`wrench`／`flask`／`rocket`／`target`／`handshake`／`lightbulb`／`barChart`／`search`／`bridge`，皆為手繪 SVG line icon，非簡報原始點陣小圖示（簡報原圖示僅 42×52px 解析度太低無法直接使用）

## 雙語策略

- 語言：繁體中文 / English（2026-09-07 取消簡體中文，原三語策略／OpenCC 自動轉換架構已移除：`lib/i18n/opencc.ts`、`lib/cms/localize.ts`、`messages/zh-cn.json`、`data/pages/*.zh-cn.md` 皆已刪除，`opencc-js` 依賴已移除）
- 預設語言：English（`i18n/routing.ts` 的 `defaultLocale`）
- 路由策略：所有語言皆加前綴（`/zh-tw` `/en`），透過 `next-intl` + `proxy.ts`（middleware）實作
- 語言切換 UI：Header 為單純地球圖示按鈕，點擊後彈出下拉選單列出 `routing.locales`（繁中／EN）供選擇（`components/layout/Header.tsx`），手機版選單直接以列表呈現
- 翻譯來源：
  - 繁中：人工撰寫（主要語言，唯一權威來源）
  - 英文：人工翻譯，可能落後於繁中版本
- 英文內容缺漏時的處理：fallback 顯示繁中內容，並顯示「尚未翻譯」提示文字（實作於 `lib/i18n/localizedField.ts`）
- `data/pages/*.md` 語系覆寫慣例：`{slug}.md` 為繁中權威來源；`{slug}.en.md` 為選填的人工譯文檔，`lib/cms/pages.ts` 的 `getStaticPage()` 會優先讀取，不存在才 fallback 到繁中原文
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
- [ ] `hero-bg-slogan.jpg` 原始檔解析度偏低（748×864），全螢幕顯示略糊，待客戶提供更高解析度版本後更換
- [ ] `data/team-members.json` 8 位團隊成員的 `bio_zhTW` 目前是英文全文暫代，需要正式中文翻譯
- [ ] `ProposalForm`／`/api/contact` 提案表單已從頁面移除但程式碼保留，需確認是否要在其他頁面重新掛上，或正式棄用整組刪除
