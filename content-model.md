# 瑞大生技網頁 Content Model

## 資料來源

- `瑞大生技網頁專案-Sitemap.docx`（繁中版 Sitemap，簡中由繁中自動生成，另有 EN Version）
- `瑞大生技網頁專案-Content Model.docx`（各頁面範例文案，含成立沿革時間軸範例資料）
- 參考網站 https://www.diamondbiofund.com/（WordPress 架構，透過 sitemap.xml 交叉比對實際頁面結構）

本文件僅涵蓋**列表型內容**（可重複、可增修筆數的內容類型），不含純靜態單頁（如公司簡介、組織架構、投資策略、聯絡我們表單等）。

狀態標記：
- ✅ 現行需求：Sitemap 中未註記保留，屬第一階段需上線的內容
- 🔒 保留待開通：Sitemap 註記「公司上市才需要」或「目前先空下」，schema 先設計、內容之後再開放編輯

| # | 內容類型 | 對應選單 | 狀態 |
|---|---|---|---|
| 1 | 成立沿革時間軸 | 關於我們 › 成立沿革 | ✅ |
| 2 | 經營團隊成員 | 關於我們 › 經營團隊 | ✅ |
| 3 | 投資組合（被投企業） | 投資組合 | ✅ |
| 4 | 相關新聞 | 新聞中心 › 相關新聞 | ✅ |
| 5 | 重大訊息 | 新聞中心 › 重大訊息 | ✅ |
| 6 | 文件資料庫（永續報告書／財務報告／公司治理規章） | 企業永續、投資人專區 | 🔒 |
| 7 | 股東會 / 法人說明會 | 投資人專區 › 股東專區 | 🔒 |
| 8 | 投資人提問 | 投資人專區 › 投資人提問 | 🔒 |
| 9 | 職缺 | 人力資源 › 加入瑞大 | 🔒 |

---

## 共用慣例

**多語言欄位**：三語策略為繁中／簡中／英文。欄位命名以 `_zhTW`、`_en` 為主；`_zhCN` 預設由 `_zhTW` 透過自動轉換（如 OpenCC）產生，不需人工輸入，僅在需要人工覆寫用詞（如專有名詞、政治敏感字）時才建立獨立 `_zhCN` 欄位覆蓋自動結果。

**每筆內容共用系統欄位**（下方各 schema 不重複列出）：

| 欄位 | 類型 | 必填 | 格式/規則 | 說明 |
|---|---|---|---|---|
| `id` | string | 必填 | UUID 或 CMS 自動 ID | 系統主鍵 |
| `slug` | string | 必填 | 小寫英數 + `-`，同語系需唯一 | 用於網址路徑 |
| `status` | enum | 必填 | `draft` / `published` / `archived` | 內容發布狀態 |
| `created_at` / `updated_at` | datetime | 系統自動 | ISO 8601 | 建立/更新時間 |

**圖片格式建議**：`jpg` / `png` / `webp`，單檔 ≤ 2MB；Logo 類建議提供透明背景 `png` 或 `svg`。
**檔案下載建議**：`pdf`，單檔 ≤ 20MB。

---

## 1. 成立沿革時間軸（Company History Timeline）

按公元年分組，年份由新到舊依序列出，各年度大事記以條列方式全部顯示（獨立於「關於我們 › 成立沿革」頁）。以「年」為一筆記錄，內含多筆該年度里程碑。

| 欄位 | 類型 | 必填 | 格式/規則 | 說明 |
|---|---|---|---|---|
| `year` | number | 必填 | 4 位西元年，同一年僅一筆 | 時間軸分組依據 |
| `milestones[].date` | date | 必填 | `YYYY-MM-DD` | 該則大事記日期 |
| `milestones[].title_zhTW` | string | 必填 | ≤ 50 字 | 大事記標題（繁中） |
| `milestones[].title_en` | string | 選填 | ≤ 80 字 | 大事記標題（英文） |
| `milestones[].description_zhTW` | text | 選填 | ≤ 300 字 | 大事記說明（繁中） |
| `milestones[].description_en` | text | 選填 | ≤ 300 字 | 大事記說明（英文） |

---

## 2. 經營團隊成員（Team Member）

| 欄位 | 類型 | 必填 | 格式/規則 | 說明 |
|---|---|---|---|---|
| `name_zhTW` | string | 必填 | ≤ 30 字 | 姓名（繁中） |
| `name_en` | string | 必填 | ≤ 60 字 | 姓名（英文） |
| `title_zhTW` | string | 必填 | ≤ 30 字 | 職稱（繁中） |
| `title_en` | string | 必填 | ≤ 60 字 | 職稱（英文） |
| `photo` | image | 必填 | 建議 1:1，最小 400×400 | 大頭照 |
| `bio_zhTW` | richtext | 選填 | — | 簡歷（繁中） |
| `bio_en` | richtext | 選填 | — | 簡歷（英文） |
| `department` | enum | 選填 | `董事會` / `經營團隊` / `投資顧問` | 用於前台分組顯示 |
| `linkedin_url` | url | 選填 | 需為合法 URL | 個人 LinkedIn |
| `order` | number | 必填 | 整數，越小越前 | 排序 |

---

## 3. 投資組合 / 被投企業（Portfolio Company）

| 欄位 | 類型 | 必填 | 格式/規則 | 說明 |
|---|---|---|---|---|
| `company_name_zhTW` | string | 必填 | ≤ 50 字 | 公司名稱（繁中） |
| `company_name_en` | string | 必填 | ≤ 100 字 | 公司名稱（英文） |
| `logo` | image | 必填 | 透明背景 png/svg 優先 | logo 牆用圖 |
| `sector` | enum（多選） | 必填 | `新藥研發` / `醫療技術及其他` | 對應投資組合分類頁籤（見 docx 原文用詞） |
| `investment_year` | number | 選填 | 4 位西元年 | 投資年度 |
| `investment_stage` | enum | 選填 | `種子輪` / `A輪` / `B輪` / `後期` / `其他` | — |
| `website_url` | url | 選填 | 需為合法 URL | 被投公司官網 |
| `description_zhTW` | richtext | 選填 | — | 公司介紹（繁中） |
| `description_en` | richtext | 選填 | — | 公司介紹（英文） |
| `is_exited` | boolean | 必填 | 預設 `false` | 是否已退出投資 |
| `featured` | boolean | 必填 | 預設 `false` | 是否顯示於首頁 logo 牆 |
| `order` | number | 必填 | 整數 | 排序 |

---

## 4. 相關新聞（News）

| 欄位 | 類型 | 必填 | 格式/規則 | 說明 |
|---|---|---|---|---|
| `title_zhTW` | string | 必填 | ≤ 100 字 | 標題（繁中） |
| `title_en` | string | 選填 | ≤ 150 字 | 標題（英文，EN 版上線後轉必填） |
| `publish_date` | date | 必填 | `YYYY-MM-DD` | 發布日期，列表排序依據 |
| `category` | enum | 必填 | `媒體報導` / `公司新聞稿` / `活動訊息` / `其他` | 分類篩選用 |
| `cover_image` | image | 選填 | 建議 16:9 | 列表縮圖 |
| `summary_zhTW` | text | 選填 | ≤ 200 字 | 列表摘要 |
| `content_zhTW` | richtext | 必填 | — | 內文（繁中） |
| `content_en` | richtext | 選填 | — | 內文（英文） |
| `source_name_zhTW` | string | 選填 | — | 原始媒體來源（繁中，轉載時填寫） |
| `source_name_en` | string | 選填 | — | 原始媒體來源（英文） |
| `source_url` | url | 選填 | 需為合法 URL | 原始報導連結 |
| `attachment` | file | 選填 | pdf | 附加檔案（如新聞稿 PDF） |

---

## 5. 重大訊息（Material Disclosure）

法定 / 類 MOPS 公告，欄位需比一般新聞更結構化，未來公司上市後可擴充為完整 MOPS 欄位格式。

| 欄位 | 類型 | 必填 | 格式/規則 | 說明 |
|---|---|---|---|---|
| `announcement_no` | string | 選填 | 例：`2026-001` | 公告編號，供對外查詢引用 |
| `title_zhTW` | string | 必填 | ≤ 100 字 | 標題（繁中） |
| `title_en` | string | 選填 | ≤ 150 字 | 標題（英文） |
| `disclosure_date` | datetime | 必填 | ISO 8601 | 公告發布時間（需精確到時分） |
| `category` | enum | 必填 | `財務` / `人事` / `投資` / `股東會` / `其他重大訊息` | 分類篩選用 |
| `content_zhTW` | richtext | 必填 | — | 公告內容（繁中，需保留法定格式） |
| `content_en` | richtext | 選填 | — | 公告內容（英文） |
| `attachment` | file | 選填 | pdf | 正式公告文件 |

---

## 6. 文件資料庫（Document Library）

涵蓋永續報告書、財務報告／年報／月營收、公司治理規章等下載型文件，統一以 `document_category` 區分，避免為每種文件各建一套幾乎相同的 schema。

| 欄位 | 類型 | 必填 | 格式/規則 | 說明 |
|---|---|---|---|---|
| `document_category` | enum | 必填 | `ESG永續報告書` / `年報` / `財務報告` / `月營收公告` / `月持股彙總` / `日持股彙總` / `公司治理規章` / `其他` | 決定文件出現在哪個列表 |
| `title_zhTW` | string | 必填 | ≤ 100 字 | 文件標題（繁中） |
| `title_en` | string | 選填 | ≤ 150 字 | 文件標題（英文） |
| `year` | number | 必填 | 4 位西元年 | 年度，用於列表分組 |
| `period` | enum | 選填 | `Q1`/`Q2`/`Q3`/`Q4`/`M01`~`M12`/— | 季度或月份（依 `document_category` 決定是否需要） |
| `file` | file | 必填 | pdf（或 xlsx，限財報類數據） | 下載檔案 |
| `cover_image` | image | 選填 | 建議直式封面比例 | 主要用於 ESG 報告書 |
| `publish_date` | date | 必填 | `YYYY-MM-DD` | 對外公布日期 |

---

## 7. 股東會 / 法人說明會（Shareholder & Investor Event）

| 欄位 | 類型 | 必填 | 格式/規則 | 說明 |
|---|---|---|---|---|
| `event_type` | enum | 必填 | `股東常會` / `股東臨時會` / `法人說明會` | 決定列表分區 |
| `title_zhTW` | string | 必填 | ≤ 100 字 | 例：「114年股東常會」 |
| `title_en` | string | 選填 | ≤ 150 字 | — |
| `event_date` | date | 必填 | `YYYY-MM-DD` | 會議/說明會日期 |
| `fiscal_year` | string | 必填 | 例：`114年` 或 `2025` | 用於年度分組 |
| `notice_file` | file | 選填 | pdf | 開會通知／議事手冊 |
| `minutes_file` | file | 選填 | pdf | 會議紀錄 |
| `presentation_file` | file | 選填 | pdf | 法說會簡報 |
| `webcast_url` | url | 選填 | 需為合法 URL | 線上法說會影音連結 |

---

## 8. 投資人提問（Investor Q&A）

| 欄位 | 類型 | 必填 | 格式/規則 | 說明 |
|---|---|---|---|---|
| `question_zhTW` | string | 必填 | ≤ 200 字 | 問題（繁中） |
| `question_en` | string | 選填 | ≤ 300 字 | 問題（英文） |
| `answer_zhTW` | richtext | 必填 | — | 答覆（繁中） |
| `answer_en` | richtext | 選填 | — | 答覆（英文） |
| `category` | enum | 選填 | `財務` / `治理` / `營運` / `其他` | 分類篩選用 |
| `order` | number | 必填 | 整數 | 排序 |

---

## 9. 職缺（Job Opening）

| 欄位 | 類型 | 必填 | 格式/規則 | 說明 |
|---|---|---|---|---|
| `job_title_zhTW` | string | 必填 | ≤ 50 字 | 職缺名稱（繁中） |
| `job_title_en` | string | 選填 | ≤ 80 字 | 職缺名稱（英文） |
| `department` | string | 選填 | — | 所屬部門 |
| `employment_type` | enum | 必填 | `全職` / `兼職` / `實習` | — |
| `location` | string | 選填 | — | 工作地點 |
| `description_zhTW` | richtext | 必填 | — | 職務內容（繁中） |
| `requirements_zhTW` | richtext | 選填 | — | 應徵條件（繁中） |
| `posted_date` | date | 必填 | `YYYY-MM-DD` | 刊登日期 |
| `apply_deadline` | date | 選填 | `YYYY-MM-DD` | 截止日期，留空視為長期招募 |
| `apply_contact` | string | 必填 | email 或 url | 應徵連結／信箱 |
| `is_open` | boolean | 必填 | 預設 `true` | 是否仍在招募中，控制列表顯示 |

---

## 待確認事項

- [ ] CMS 選定為 Sanity.io（見 `CLAUDE.md`），待法務/合規確認資料留存地規定後才能定案
- [ ] 重大訊息是否需比照正式 MOPS 欄位（事實發生日、因應措施等）於公司上市前先行擴充
- [ ] 簡中人工覆寫欄位（`_zhCN`）是否需要在 CMS 中預先建立空欄位，或僅於例外情況才加開
