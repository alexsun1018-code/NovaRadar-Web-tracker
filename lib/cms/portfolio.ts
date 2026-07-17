import portfolioData from "@/data/portfolio-companies.json";
import { withAutoZhCN } from "./localize";
import type { PortfolioCompany } from "./types";

const LOCALIZE_FIELDS = ["company_name", "description"];

export async function getFeaturedPortfolioCompanies(): Promise<
  PortfolioCompany[]
> {
  return (portfolioData.items as PortfolioCompany[])
    .filter((company) => company.featured && company.status !== "archived")
    .map((company) => withAutoZhCN(company, LOCALIZE_FIELDS))
    .sort((a, b) => a.order - b.order);
}

export async function getAllPortfolioCompanies(): Promise<
  PortfolioCompany[]
> {
  return (portfolioData.items as PortfolioCompany[])
    .filter((company) => company.status !== "archived")
    .map((company) => withAutoZhCN(company, LOCALIZE_FIELDS))
    .sort((a, b) => a.order - b.order);
}
