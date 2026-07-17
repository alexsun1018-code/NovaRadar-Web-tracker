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
  { key: "portfolio", href: "/portfolio", status: "active" },
  {
    key: "news",
    href: "/news/general",
    status: "active",
    children: [
      { key: "newsGeneral", href: "/news/general", status: "active" },
      { key: "newsDisclosures", href: "/news/disclosures", status: "active" },
    ],
  },
  { key: "esg", href: "/esg", status: "placeholder" },
  { key: "investors", href: "/investors", status: "placeholder" },
  { key: "careers", href: "/careers", status: "placeholder" },
  { key: "contact", href: "/contact", status: "active" },
];

export const legalNav: NavItem[] = [
  { key: "legalDisclaimer", href: "/legal/disclaimer", status: "active" },
  { key: "legalPrivacyPolicy", href: "/legal/privacy-policy", status: "active" },
];
