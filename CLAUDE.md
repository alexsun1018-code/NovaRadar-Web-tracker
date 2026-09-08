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
- 圖片素材：`public/images/hero-bg-slogan.jpg`（首頁 Hero 背景，2026-09-08 更新）改用 Unsplash 免費商用授權圖（攝影師 Braňo，與 `banner-about.jpg` 同一位攝影師，深藍色 DNA 雙股螺旋渲染意象，原始 5760×3240，網站用檔壓縮為 2400×1350）。選用理由：客戶原先提供的分子球體意象圖（見下方說明）經客戶回饋「不能表現生技相關意念」，改選擇能直接傳達生技/基因研究概念的 DNA 螺旋圖，且深藍色調與品牌 Primary 色 `#0c344c` 相近。客戶提供的 `NovaRada Data/NovaRadar Web Slogon背景_高解析_WaterMark.JPG`（宣稱「高解析」）經檢查其實只有 553×311，且 XMP metadata 顯示為 **Getty Images 未授權浮水印樣張**（`plus:DataMining` 條款禁止重製，需付費購買授權），故未採用、也未去浮水印使用，避免侵權風險；若客戶之後正式購買該 Getty 圖授權並提供無浮水印原始檔，可再評估替換。圖片本身已用 `sharp`（`modulate` 提高亮度/飽和度＋`linear` 微調對比）整體調亮，上層疊加品牌色漸層（2026-09-08 由 `opacity: 0.45` 調降為 `0.28`）＋純黑遮罩（`bg-black/45` 調降為 `bg-black/20`），因客戶反饋原本背景太暗，調整後視覺更明亮同時維持文字可辨識（`h1` text-shadow 同步加深至 `rgba(0,0,0,0.55)` 補償對比）。舊版 `hero-bg-lab.jpg`（Unsplash，攝影師 Nathan Rimoux）已不再使用但保留檔案；另有 Unsplash 攝影師 Logan Voss 的白/青綠色分子球體渲染圖於 2026-09-08 一度短暫採用，因客戶反饋「不能表現生技相關意念」而改為現用 DNA 螺旋圖（該版本檔案已被直接覆蓋，未另存）。之後若要換其他圖，需確認來源授權可商用，不要直接用 pngtree 等付費圖庫的預覽圖或去浮水印使用
  - `public/images/value-*.jpg`（原首頁「為什麼選擇瑞大」四張圖示照片）2026-09-07 起已不再使用（改為 icon 卡片，見下方「首頁／內容大改版」），檔案保留未刪除
  - `public/images/banner-{about,portfolio,news,contact}.jpg`（關於我們／投資組合／新聞中心／聯絡我們各主項目頁頂部橫幅，`components/layout/PageHeaderBanner.tsx`）同樣取自 Unsplash 免費授權：banner-about 攝影師 Braňo、banner-portfolio 攝影師 Samson、banner-news 攝影師 AbsolutVision、banner-contact 攝影師 Radisson US
- Logo：`public/images/logo-full.png`（Header 用，含「Bio Venture」tagline）、`logo-mark.png`（不含 tagline 的裁切版，備用）、`logo-*-on-dark.png`（深色背景版，NovaRadar 字樣改白色、R 字母維持青綠色，供 Footer 深藍底使用）。原始向量檔為 `NovaRada Data/NovaRadar_Logo_向量檔_確認用.pdf`（2026-09-07 客戶確認版），因本機無 PDF 轉 SVG 工具，改用 `pdfjs-dist` + `@napi-rs/canvas` 高解析度點陣化後以 `sharp` 去背/裁切產生，非真正向量檔；若之後拿到 AI/EPS/SVG 原始檔應改用向量版本重新輸出
- Header 導覽（`lib/nav/config.ts`）：2026-09-07 移除 ESG／Investors／Careers 三個 placeholder 項目（頁面本身仍在，只是不再出現在選單），新增「Team」（連到既有 `/about/leadership-team`）；另外在導覽列右側新增 `authNav`（Login／Sign Up），對應 `/login`、`/signup` 兩個新路由，目前皆為 `ComingSoonPage`（`auth` 插圖），供之後串接真正的外部（投資人）／內部人員登入功能。2026-09-08 依客戶指示自 `authNav` 移除 Sign Up（`/signup` 路由本身保留未刪除，僅不再出現在選單），僅存 Login 一項，樣式改為 pill 外框按鈕（呼應 vivocapital.com 的「Investor Login」按鈕樣式）
- Header 版面 2026-09-08 參考 vivocapital.com 調整比例：logo 放大（`h-10`／`h-11` → `h-12`／`h-14`）、header 上下 padding 加大（`py-4` → `py-5`／`lg:py-6`）、主導覽字級放大且字重減輕（`text-base font-bold` → `text-lg font-medium`）、項目間距加大（`gap-4` → `gap-6`／`xl:gap-8`）；同日稍晚客戶再指示主導覽（About／Team／News／Contact）字級再放大並改回粗體、間距再拉開（`text-lg font-medium gap-6/xl:gap-8` → `text-xl font-bold gap-10/xl:gap-12`），已用 Playwright 確認 1180～1920px 桌機寬度皆不會與右側 Login／語言切換擠壓或溢出
- 詳細架構規劃見 `content-model.md` 與對應 plan 文件

## 2026-09-08 首頁內文區塊調整（標題精簡、圓餅圖化）

依客戶指示：

- **ValueProps 區塊**（`components/sections/ValueProps.tsx`）：移除「Why NovaRadar」標題（`ValueProps.title`），原副標題「The operator-led approach that accelerates biotech success」升級為 `h2` 主標題並放大（`text-3xl sm:text-4xl lg:text-5xl`）。`ValueProps.title` 翻譯 key 保留未刪除但不再顯示
- **ClinicalValueBridge 區塊**（`components/sections/ClinicalValueBridge.tsx`）：副標題「Investing in undercapitalized science and driving it to inflection.」放大（`text-lg` → `text-xl sm:text-2xl`，並加粗為 `font-medium`）
- **WeInvestIn／StrategicFocusAreas 合併**：原本各自獨立的「We Invest In」與「Strategic Focus Areas」兩個 `<section>` 合併為一（`components/sections/WeInvestIn.tsx`），移除「Strategic Focus Areas」標題（`StrategicFocus.title`，翻譯保留未刪除但不再顯示），四個項目（Early Cancer Detection／Novel Target Drug／Rare Genetic Diseases／Neurological Disorders）改在 We Invest In 三張卡片下方**同一區塊**延續呈現（同背景色 `bg-section-blue-50`、無分段 break）。同時移除原本描述文字的紅色粗體首字效果（`first-letter:text-red-600` 等 class 已拿掉），文字樣式與其餘內文一致。原始版本的獨立元件 `components/sections/StrategicFocusAreas.tsx` **保留未刪除但已不再被 `app/[locale]/page.tsx` 引用**（孤兒元件）
  - **四項目視覺呈現版本演進**：第一版嘗試 CSS `conic-gradient` 甜甜圈圖＋2 欄圖例；第二版嘗試花瓣狀環形圖＋SVG 虛線連到外側左右交錯圖例（參考付費圖庫醫療環形資訊圖範本重新設計，非直接使用該圖片素材）——客戶反饋兩版「呈現效果不如預期」，改指定直接還原客戶原始簡報 `MitoBitTech management team website.pptx` 第 5 頁「Strategic Focus Areas」投影片的排版（客戶截圖 `螢幕擷取畫面 2026-09-08 135710.png` 為證）。**目前版本**（`WeInvestIn.tsx`）：
    - **桌機（`lg` 以上）**：三欄 CSS Grid（`grid-cols-[1fr_auto_1fr]`）——左欄兩項文字（Early Cancer Detection／Neurological Disorders 由上而下）、中間為 2×2 花瓣狀圖示叢（沿用 `borderRadius: "50% 50% 50% 0"` 旋轉技法，四片尖角朝內緊貼形成風車狀，統一淺藍色底＋深藍圖示，不再依項目分色）、右欄兩項文字（Novel Target Drug／Rare Genetic Diseases 由上而下）；純 CSS Grid 排列，無 SVG 連接線
    - **手機／平板（`lg` 以下）**：簡化為圖示＋文字的直式列表（`sm:grid-cols-2`），小尺寸花瓣圖示＋標題＋說明
    - 與原始簡報唯一刻意的差異：描述文字**不使用**紅色粗體首字（原簡報有此設計，但客戶已明確指示取消，確認維持不加回）
    - 2026-09-08 修正花瓣旋轉角度：`borderRadius: "50% 50% 50% 0"` 的預設尖角在左下角，左上格需轉 270 度（非 90 度）、右下格需轉 90 度（非 270 度）尖角才會朝向叢集中心；修正前左上／右下兩片轉錯方向，四片合起來未能拼成完整圓形
  - **Team 頁橫幅圖片換新**：Team 主頁（`/about/leadership-team`）與個人詳細頁（`[slug]`）原本沿用與 About 各子頁相同的 `banner-about.jpg`（DNA 意象），客戶反饋與 About 頁重複，改用新素材 `public/images/banner-team.jpg`（Unsplash 免費商用授權，攝影師 Vitaly Gariev，四位專業人士自信站立的團隊合照，原始 2400×1350，象徵資深經營團隊）。因原圖人臉集中在上方約 15-20% 高度處，而橫幅本身很矮（`h-44`／`sm:h-56`），`object-cover` 預設置中會裁掉臉部，故 `PageHeaderBanner.tsx` 新增 `imagePosition` 選填 prop（CSS `object-position`，預設 `"center"`），Team 頁兩處呼叫皆傳入 `"center 18%"` 讓四張臉完整露出；其餘沿用 `banner-about.jpg` 的 About 子頁不受影響
- **頁首橫幅圖片文字移除**（`components/layout/PageHeaderBanner.tsx`）：客戶指示 About／Team／News／Contact 等頁頂部橫幅圖片上疊加的標題文字（如 "Company Profile"／"Leadership Team"／"News Report"／"Contact"）全部移除。此元件為共用元件，被 9 個頁面引用（About 五個子頁、Team 主頁與個人詳細頁、News 兩個子頁、Contact），故直接修改共用元件、一次套用到全部使用頁面，而非個別頁面調整。做法：`<h1>{title}</h1>` 改加上 `sr-only`（視覺隱藏但保留在 DOM 中，供螢幕閱讀器與 SEO 使用，維持頁面仍有語意上的 `h1`），而非整個刪除。多數子頁（company-intro／organization／company-history／investment-strategy／leadership-team）內文區塊仍有對應的 `h2` 標題可辨識頁面主題；Contact 頁與 News 頁的內文（`data/pages/contact.*.md`、`news-intro.*.md`）本身沒有額外標題，移除橫幅文字後這兩頁已無視覺標題文字，僅能從導覽列 active 狀態／瀏覽器分頁標題辨識，屬客戶明確指示的結果
- **Team 頁標題**（`app/[locale]/about/leadership-team/page.tsx`）：移除內文標題「Leadership Team」前方的裝飾豎線（`<span className="h-6 w-1 ...">`，視覺上易誤讀成「I」），只保留純文字標題，其餘不變
- **About／公司簡介頁文字調整**（`app/[locale]/about/company-intro/page.tsx`、`data/pages/company-intro.md`、`data/pages/company-intro.en.md`）：移除內文重複的「I Company Profile」標題（`PageHeaderBanner` 頂部橫幅已顯示同名標題「Company Profile」，內文區塊原本又重複顯示一次帶裝飾豎線的 `<h2>`，屬冗餘，客戶指示取消，故移除該 `<h2>` 區塊，`StaticPageBody` 內容直接接在頁面頂部橫幅下方）；內文最後一段標題「Our Mission」／「我們的使命 Our Mission」改為「Mission」／「我們的使命 Mission」
- 待辦：`messages/zh-tw.json` 的 `StrategicFocus.areas.*.label`（如 "Early Cancer Detection & Treatment"）為**既有**未翻譯缺漏（非本次修改造成，2026-09-07 起即如此，只有 `description` 有翻譯），繁中版目前仍顯示英文標籤，待客戶提供正式中文翻譯後補上
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

## 2026-09-08 Hero 簡化與 Portfolio 頁移除

依客戶指示：

- **Hero 區塊簡化**（`components/sections/HeroCarousel.tsx`）：移除原本置中的 `h1` 主標題（`Our Mission`／`我們的使命`）與其下方「Explore Our Portfolio」CTA 按鈕（連到 `/portfolio`），改將原副標題文字（`Investing in novel technologies...`／`投資推動醫療與生活品質提升的創新技術`）放大為主標題（`h1`）樣式呈現。`data/hero-slides.json` 的 `title_*`／`ctaLabel_*`／`ctaHref` 欄位資料保留未刪除（不影響顯示，純粹未被讀取），`HeroSlideView` 介面與 `app/[locale]/page.tsx` 的 mapping 已同步移除對應欄位
- **Hero 背景改用短動畫＋參考同業版面比例**：客戶反饋靜態圖搭配文字效果依舊不佳，並指定參考 bioventuresinvestors.com 的動畫與文字比例。實際比對該站（用 Playwright 截圖＋量測 DOM，該站 hero 其實是靜態圖非影片，但視覺上用發光網絡/粒子意象營造科技動態感）後，採用其版面比例：hero 高度改為 `min-h-[72vh]`（原為 `min-h-screen` 100vh 滿版）、文字改為靠左下（`items-start justify-end text-left`，原為置中）、字級放大（`lg:text-6xl`，原為 `lg:text-5xl`）。背景改為真正的短循環影片 `public/videos/hero-bg-dna.mp4`（Pexels License 免費商用授權，攝影師 Nicola Narracci，原始 1920×1080，teal 光點 DNA 雙股螺旋意象，與品牌色和參考站的粒子網絡風格皆相符，15.8MB／本機無 ffmpeg 故未壓縮，屬已知待優化項目見下方待辦），僅在桌面（`min-width: 768px`）且使用者未設定「減少動態效果」（`prefers-reduced-motion`）時透過 `<video autoPlay muted loop playsInline>` 播放；手機/平板與偏好減少動態者維持顯示原本的 `hero-bg-slogan.jpg` 靜態圖（DNA 螺旋渲染圖，2026-09-08 稍早採用，見上方素材說明），避免行動網路消耗過多流量。前景疊加從置中的黑色遮罩改為由左至右淡出的深藍漸層（文字後方深、右側動畫清晰可見），呼應參考站的色彩處理方式
- **Hero 文字改為多行右側對齊＋Title Case**：客戶反饋背景圖搭配文字效果依舊不佳，指定參考 vivocapital.com 的動畫與文字比例。實際比對該站（Playwright 截圖＋量測）後發現該站首頁大標題「Catalyzing / Innovation and Growth / in Global Healthcare Markets」為**手動分行、靠右對齊**、套用英文標題大小寫慣例（Title Case：主要單字字首大寫，and／or／in／to／of 等連接詞/介詞維持小寫）；其餘區塊標題（如「Our Track Record」）則是靠左對齊，故僅將此手法套用在 Hero 主標題（本頁面唯一對應「多列右側對齊」的元素），未套用到其他區塊。實作：`data/hero-slides.json` 的 `subtitle_en`／`subtitle_zhTW` 改為以 `\n` 分隔的三行文案（`Investing in Novel Technologies\nto Advance Healthcare\nand Quality of Life`／繁中對應分行，文字本身未更動僅加分行），`HeroCarousel.tsx` 以 `split("\n")` 渲染為多個 `<span className="block">`，容器改為 `items-end justify-end text-right`（原為靠左），背景漸層方向同步翻轉（改為左側清晰、文字後方右側加深）
- **Hero 字級改用 fluid clamp 避免中間寬度截斷**：客戶反饋三行文案要「各一列」且字體要再放大。改用 Tailwind 固定斷點（`text-5xl sm:text-6xl lg:text-7xl`）搭配 `sm:whitespace-nowrap` 時，在 `lg` 斷點剛切換的中間寬度（約 1024px 桌機）字級跳到 72px 但容器變窄，导致最長一行「Investing in Novel Technologies」被裁掉一截（實測截圖發現，`document.documentElement.scrollWidth` 因 `overflow-hidden` 未偵測到但視覺上確實被裁切）。改為 `text-[clamp(1.75rem,4.2vw,5.25rem)]`（隨版面寬度連續縮放，而非跳階），並用 Playwright 在 640～1920px 共 9 組寬度量測每行文字的實際 `getBoundingClientRect`，確認任何寬度下都不會超出容器，同時桌機大螢幕（1920px）字級可達約 80px，比原本固定 `lg:text-7xl`（72px）更大
- **Portfolio 頁整頁移除**：`app/[locale]/portfolio/page.tsx` 路由檔案已刪除（造訪 `/portfolio` 會 404），`lib/nav/config.ts` 的導覽項目已移除。以下相關程式碼／資料**保留未刪除**（屬孤兒程式碼，之後如需恢復可重新掛上）：`components/sections/PortfolioCardWall.tsx`、`components/sections/PortfolioLogoWall.tsx`（本來就已是孤兒元件）、`lib/cms/portfolio.ts`、`data/portfolio-companies.json`、`data/pages/portfolio-intro.md`、`public/images/banner-portfolio.jpg`、`messages/*.json` 的 `Portfolio` namespace 與 `Nav.portfolio` key

## 雙語策略

- 語言：繁體中文 / English（2026-09-07 取消簡體中文，原三語策略／OpenCC 自動轉換架構已移除：`lib/i18n/opencc.ts`、`lib/cms/localize.ts`、`messages/zh-cn.json`、`data/pages/*.zh-cn.md` 皆已刪除，`opencc-js` 依賴已移除）
- 預設語言：English（`i18n/routing.ts` 的 `defaultLocale`）
- 路由策略：所有語言皆加前綴（`/zh-tw` `/en`），透過 `next-intl` + `proxy.ts`（middleware）實作
- 語言切換 UI：Header 為單純地球圖示按鈕，點擊後彈出下拉選單供選擇（`components/layout/Header.tsx`），手機版選單直接以列表呈現。選單顯示順序由 `Header.tsx` 內的 `localeMenuOrder`（`["en", "zh-tw"]`，2026-09-08 依客戶指示 EN 在上、繁中在下）決定，與 `i18n/routing.ts` 的 `routing.locales`（`["zh-tw", "en"]`，影響路由/靜態頁生成順序等其他邏輯）刻意分開、互不影響
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
- [x] `hero-bg-slogan.jpg` 解析度偏低問題已處理（2026-09-08 改用 Unsplash 授權圖取代，原客戶提供檔為 Getty 未授權浮水印樣張，見上方說明）
- [ ] `data/team-members.json` 8 位團隊成員的 `bio_zhTW` 目前是英文全文暫代，需要正式中文翻譯
- [ ] `ProposalForm`／`/api/contact` 提案表單已從頁面移除但程式碼保留，需確認是否要在其他頁面重新掛上，或正式棄用整組刪除
- [ ] Portfolio 頁（2026-09-08 已移除，見上方說明）確認是否為永久決策；若確定不再需要，`PortfolioCardWall`／`PortfolioLogoWall`／`lib/cms/portfolio.ts`／`data/portfolio-companies.json` 等孤兒程式碼可考慮正式刪除；若之後仍要恢復投資組合頁，需重新建立路由並掛回導覽
- [ ] `public/videos/hero-bg-dna.mp4`（15.8MB）本機無 ffmpeg 無法壓縮，之後有工具可用時應轉檔壓縮（目標建議 3-5MB，可考慮降解析度至 1280×720、調整位元率、或轉 webm 提供 `<source>` 備援）以改善桌面版首頁載入效能
- [ ] `StrategicFocus.title`（"Strategic Focus Areas"）翻譯 key 因標題移除已無使用處（保留未刪除）；若確定不再需要獨立標題，可評估是否要正式清理
- [ ] `messages/zh-tw.json` 的 `StrategicFocus.areas.*.label` 四項標籤未翻譯（英文原文），繁中版目前顯示英文，待正式中文翻譯
