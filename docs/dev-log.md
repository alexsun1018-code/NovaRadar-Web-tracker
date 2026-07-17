# 開發紀錄

本檔案記錄與 Claude Code 協作開發 NovaRadar Web 的過程與決策，依時間順序整理。

## 2026-07-17～07-18

### 1. 本機開發環境啟動
- 專案缺少 `.env.local`，由 `.env.example` 複製建立（皆為 placeholder 值）
- 啟動 `npm run dev`（Turbopack，http://localhost:3000）

### 2. 新聞中心（相關新聞／重大訊息）改版
- 參考截圖：客戶提供的鑽石生技投資（diamondbiofund.com）新聞列表頁
- 原本是「橫向年份篩選按鈕 + 卡片列表」，改為「左側公元年可展開/收疊的側邊選單 + 右側日期/標題/摘要條列」
- 新增 `components/sections/YearSidebar.tsx`（年份手風琴選單，單一展開）
- 重寫 `NewsList.tsx`、`DisclosureList.tsx` 套用左右兩欄版面
- 補上 `news/disclosures` 頁缺少渲染的 `SubNav`

### 3. 「關於我們」拆頁與側邊選單改版
- 原本「公司簡介」與「成立沿革」合併在同一頁（`about/company-history`），依需求拆成獨立的 `about/company-intro` 與 `about/company-history` 兩頁
- 靜態頁 markdown 由 `data/pages/about-intro.*` 更名為 `data/pages/company-intro.*`
- 參考截圖（同樣是鑽石生技網站）：「關於我們」底下 5 個子頁（公司簡介／組織架構／成立沿革／經營團隊／投資策略）改為左側垂直選單（原本是頂部橫向分頁籤）
- `SubNav.tsx` 新增 `layout="vertical"` 模式；`StaticPageBody.tsx` 新增 `contained` 參數以配合側邊選單版型
- 成立沿革時間軸（`CompanyHistoryTimeline.tsx`）改為不可收合、年份+條列全部展開顯示，貼近截圖樣式
- `lib/nav/config.ts`、三語系 `messages/*.json` Nav 區塊同步更新

### 4. 首頁「為什麼選擇瑞大」圖示換成主題照片
- 4 個項目（全球視野／跨界專業團隊／主動式風控策略／永續共榮）原本用線條 SVG 圖示，改為 Unsplash 免費授權主題照片
- 圖片存於 `public/images/value-*.jpg`，出處記錄在 `data/value-props.json` 各筆 `image_credit`
- `ValueProps.tsx` 改用 `next/image` 顯示圓形照片，移除不再使用的 `icon` 欄位

### 5. 主項目頁面加上長條橫幅背景圖
- 參考截圖：鑽石生技網站各主項目頁頂部的橫幅（照片背景 + 白字頁面標題）
- 新增共用元件 `components/layout/PageHeaderBanner.tsx`
- 套用到「關於我們」5 個子頁、「投資組合」、「新聞中心」2 個子頁，共 8 頁
- 圖片主題：關於我們＝DNA 雙股螺旋、投資組合＝城市摩天樓、新聞中心＝財經報紙特寫（皆 Unsplash 免費授權）
- 後續調整：標題改為置中（原本靠左下）、字級放大（`text-4xl` → `sm:text-5xl lg:text-6xl`）
- 「聯絡我們」頁比照加上橫幅（商務會談握手主題照）
  - 過程中曾選到一張「握手＋槍」的圖（tag 隱藏 mafia/crime 意象），視覺確認後判斷不適合企業網站，已換成乾淨的辦公室握手照

### 6. 經營團隊卡片加上填寫提示
- 目前 `data/team-members.json` 僅有一筆全空白的 placeholder 成員
- `TeamGrid.tsx` 卡片內加上斜體淺灰提示文字，引導之後填寫真實資料：
  - 大頭貼「?」下方標註「（官方照片）」
  - 職稱欄位空白時顯示「（公司職稱）」
  - 新增一列固定提示「（主要經歷文字）」
- 真實資料填入後，提示文字會自動被實際內容取代

### 7. 推送到 GitHub
- Repo：https://github.com/alexsun1018-code/NovaRadar-Web-tracker （Public）
- 本機未設定過 git 身份，以使用者確認的 `alexsun1018-code` / `alexsun1018@gmail.com` 設定本專案本機 git 設定（未動全域設定）
- GitHub 上已存在同名空 repo（private，僅預設 README），依使用者指示改為 public 並 force push 覆蓋
- `.env.local`（含金鑰的環境變數檔）已被 `.gitignore` 正確排除，未上傳
- 兩份客戶原始企劃 docx（Content Model、Sitemap）依使用者指示一併公開推上

### 8. 部署到 Vercel
- 透過 `npx vercel login`（device OAuth）登入帳號 `alexsun1018-8811`
- `vercel link --project novaradar-web-tracker` 建立專案並自動連接 GitHub repo（之後 push main 會自動觸發部署）
- 首次部署直接發布到正式環境：https://novaradar-web-tracker.vercel.app
- Build 成功（64 個靜態頁面），實際 curl + Playwright 截圖確認首頁與各主項目頁在正式站上正常顯示
- 待辦：`RESEND_API_KEY`／GA4／Meta Pixel 等環境變數尚未在 Vercel 專案設定內填入實際值，表單寄信與追蹤碼暫不會真的作用
