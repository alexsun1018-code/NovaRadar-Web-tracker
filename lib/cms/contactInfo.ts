import contactInfoData from "@/data/contact-info.json";
import { withAutoZhCN } from "./localize";
import type { ContactInfo } from "./types";

export async function getContactInfo(): Promise<ContactInfo> {
  return withAutoZhCN(contactInfoData.item as ContactInfo, [
    "address",
    "contact_person_name",
    "contact_person_title",
  ]);
}
