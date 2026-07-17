import historyData from "@/data/company-history.json";
import { withAutoZhCN } from "./localize";
import type { CompanyHistoryYear } from "./types";

const LOCALIZE_FIELDS = ["title", "description"];

export async function getCompanyHistory(): Promise<CompanyHistoryYear[]> {
  const items = historyData.items as CompanyHistoryYear[];
  return items
    .map((yearEntry) => ({
      ...yearEntry,
      milestones: yearEntry.milestones.map((milestone) =>
        withAutoZhCN(milestone, LOCALIZE_FIELDS)
      ),
    }))
    .sort((a, b) => b.year - a.year);
}
