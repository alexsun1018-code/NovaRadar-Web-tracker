import disclosuresData from "@/data/material-disclosures.json";
import type { MaterialDisclosure } from "./types";

export async function getDisclosureList(): Promise<MaterialDisclosure[]> {
  return (disclosuresData.items as MaterialDisclosure[])
    .filter((item) => item.status !== "archived")
    .sort((a, b) => (a.disclosure_date < b.disclosure_date ? 1 : -1));
}

export async function getDisclosureBySlug(
  slug: string
): Promise<MaterialDisclosure | undefined> {
  const list = await getDisclosureList();
  return list.find((item) => item.slug === slug);
}
