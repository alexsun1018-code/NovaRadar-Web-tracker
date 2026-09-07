import portfolioData from "@/data/portfolio-companies.json";
import type { PortfolioCompany } from "./types";

export async function getFeaturedPortfolioCompanies(): Promise<
  PortfolioCompany[]
> {
  return (portfolioData.items as PortfolioCompany[])
    .filter((company) => company.featured && company.status !== "archived")
    .sort((a, b) => a.order - b.order);
}

export async function getAllPortfolioCompanies(): Promise<
  PortfolioCompany[]
> {
  return (portfolioData.items as PortfolioCompany[])
    .filter((company) => company.status !== "archived")
    .sort((a, b) => a.order - b.order);
}
