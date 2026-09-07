import historyData from "@/data/company-history.json";
import type { CompanyHistoryYear } from "./types";

export async function getCompanyHistory(): Promise<CompanyHistoryYear[]> {
  const items = historyData.items as CompanyHistoryYear[];
  return items.slice().sort((a, b) => b.year - a.year);
}
