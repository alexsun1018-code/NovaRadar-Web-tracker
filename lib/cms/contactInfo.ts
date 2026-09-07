import contactInfoData from "@/data/contact-info.json";
import type { ContactInfo } from "./types";

export async function getContactInfo(): Promise<ContactInfo> {
  return contactInfoData.item as ContactInfo;
}
