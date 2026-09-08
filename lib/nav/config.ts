export type NavStatus = "active" | "placeholder";

export interface NavItem {
  /** 對應 messages/*.json 中 Nav.* 的 key */
  key: string;
  href: string;
  status: NavStatus;
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  {
    key: "about",
    href: "/about/company-intro",
    status: "active",
    children: [
      { key: "companyIntro", href: "/about/company-intro", status: "active" },
      { key: "organization", href: "/about/organization", status: "active" },
      { key: "companyHistory", href: "/about/company-history", status: "active" },
      { key: "leadershipTeam", href: "/about/leadership-team", status: "active" },
      { key: "investmentStrategy", href: "/about/investment-strategy", status: "active" },
    ],
  },
  { key: "team", href: "/about/leadership-team", status: "active" },
  {
    key: "news",
    href: "/news/general",
    status: "active",
    children: [
      { key: "newsGeneral", href: "/news/general", status: "active" },
      { key: "newsDisclosures", href: "/news/disclosures", status: "active" },
    ],
  },
  { key: "contact", href: "/contact", status: "active" },
];

// 保留給外部（投資人）／內部人員登入功能使用，後台尚未建置，暫連到 Coming soon 頁
// 2026-09-08 依客戶指示移除 Sign Up 項；/signup 路由本身保留未刪除（孤兒頁面，未出現在導覽）
export const authNav: NavItem[] = [
  { key: "login", href: "/login", status: "placeholder" },
];

export const legalNav: NavItem[] = [
  { key: "legalDisclaimer", href: "/legal/disclaimer", status: "active" },
  { key: "legalPrivacyPolicy", href: "/legal/privacy-policy", status: "active" },
];
