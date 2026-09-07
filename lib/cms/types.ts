export interface HeroSlide {
  id: string;
  order: number;
  title_zhTW: string;
  title_en?: string;
  subtitle_zhTW: string;
  subtitle_en?: string;
  ctaLabel_zhTW: string;
  ctaLabel_en?: string;
  ctaHref: string;
  background: { type: string; from: string; to: string };
}

export interface ValueProp {
  id: string;
  order: number;
  icon: string;
  title_zhTW: string;
  title_en?: string;
  description_zhTW: string;
  description_en?: string;
}

export type PortfolioSector = "新藥研發" | "醫療技術及其他";

export interface PortfolioCompany {
  id: string;
  slug: string;
  status: "draft" | "published" | "archived";
  company_name_zhTW: string;
  company_name_en?: string;
  logo: string;
  sector: PortfolioSector[];
  investment_year?: number;
  investment_stage?: string;
  website_url?: string;
  description_zhTW?: string;
  description_en?: string;
  is_exited: boolean;
  featured: boolean;
  order: number;
}

export interface HistoryMilestone {
  date: string;
  title_zhTW: string;
  title_en?: string;
  description_zhTW?: string;
  description_en?: string;
}

export interface CompanyHistoryYear {
  year: number;
  milestones: HistoryMilestone[];
}

export interface TeamMember {
  id: string;
  slug: string;
  status: "draft" | "published" | "archived";
  name_zhTW: string;
  name_en?: string;
  title_zhTW: string;
  title_en?: string;
  photo: string;
  bio_zhTW?: string;
  bio_en?: string;
  department?: "董事會" | "經營團隊" | "投資顧問";
  linkedin_url?: string;
  order: number;
}

export interface StaticPage {
  slug: string;
  title: string;
  bodyHtml: string;
  isFallback: boolean;
}

export type NewsCategory = "媒體報導" | "公司新聞稿" | "活動訊息" | "其他";

export interface NewsArticle {
  id: string;
  slug: string;
  status: "draft" | "published" | "archived";
  title_zhTW: string;
  title_en?: string;
  publish_date: string;
  category: NewsCategory;
  cover_image?: string;
  summary_zhTW?: string;
  summary_en?: string;
  content_zhTW: string;
  content_en?: string;
  source_name_zhTW?: string;
  source_name_en?: string;
  source_url?: string;
  attachment?: string;
}

export type DisclosureCategory =
  | "財務"
  | "人事"
  | "投資"
  | "股東會"
  | "其他重大訊息";

export interface MaterialDisclosure {
  id: string;
  slug: string;
  status: "draft" | "published" | "archived";
  announcement_no?: string;
  title_zhTW: string;
  title_en?: string;
  disclosure_date: string;
  category: DisclosureCategory;
  content_zhTW: string;
  content_en?: string;
  attachment?: string;
}

export interface ContactInfo {
  phone: string;
  address_zhTW: string;
  address_en?: string;
  contact_person_name_zhTW: string;
  contact_person_name_en?: string;
  contact_person_title_zhTW: string;
  contact_person_title_en?: string;
  email: string;
}
