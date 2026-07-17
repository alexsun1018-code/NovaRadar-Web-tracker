import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1).max(100),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  email: z.string().trim().email(),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  inquiryType: z.enum(["funding", "partnership", "other"]),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type ContactFormPayload = z.infer<typeof contactFormSchema>;
