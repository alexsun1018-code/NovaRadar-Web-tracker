import disclosuresData from "@/data/material-disclosures.json";
import { withAutoZhCN } from "./localize";
import type { MaterialDisclosure } from "./types";

const LOCALIZE_FIELDS = ["title", "content"];

export async function getDisclosureList(): Promise<MaterialDisclosure[]> {
  return (disclosuresData.items as MaterialDisclosure[])
    .filter((item) => item.status !== "archived")
    .map((item) => withAutoZhCN(item, LOCALIZE_FIELDS))
    .sort((a, b) => (a.disclosure_date < b.disclosure_date ? 1 : -1));
}

export async function getDisclosureBySlug(
  slug: string
): Promise<MaterialDisclosure | undefined> {
  const list = await getDisclosureList();
  return list.find((item) => item.slug === slug);
}
