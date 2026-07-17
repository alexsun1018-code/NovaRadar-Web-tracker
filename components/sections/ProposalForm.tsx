"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { trackLead } from "@/lib/analytics/track";

type Status = "idle" | "submitting" | "success" | "error";

export default function ProposalForm() {
  const t = useTranslations("ProposalForm");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    // honeypot：一般使用者看不到此欄位，機器人常會誤填
    if (formData.get("company_website")) {
      setStatus("success");
      form.reset();
      return;
    }

    setStatus("submitting");
    const inquiryType = String(formData.get("inquiryType") ?? "");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          company: formData.get("company"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          inquiryType,
          message: formData.get("message"),
        }),
      });

      if (!res.ok) throw new Error("submit failed");

      setStatus("success");
      form.reset();
      trackLead(inquiryType);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="flex min-h-screen flex-col justify-center bg-section-gold-50 py-20">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-brand-primary sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-lg text-brand-neutral-600">{t("subtitle")}</p>
        </div>

      <form
        onSubmit={handleSubmit}
        className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2"
      >
        <input
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-brand-neutral-900">
            {t("name")} *
          </span>
          <input
            name="name"
            required
            className="rounded-lg border border-brand-neutral-100 bg-white px-4 py-2.5 outline-brand-primary"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-brand-neutral-900">
            {t("company")}
          </span>
          <input
            name="company"
            className="rounded-lg border border-brand-neutral-100 bg-white px-4 py-2.5 outline-brand-primary"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-brand-neutral-900">
            {t("email")} *
          </span>
          <input
            type="email"
            name="email"
            required
            className="rounded-lg border border-brand-neutral-100 bg-white px-4 py-2.5 outline-brand-primary"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-brand-neutral-900">
            {t("phone")}
          </span>
          <input
            type="tel"
            name="phone"
            className="rounded-lg border border-brand-neutral-100 bg-white px-4 py-2.5 outline-brand-primary"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-brand-neutral-900">
            {t("inquiryType")} *
          </span>
          <select
            name="inquiryType"
            required
            defaultValue=""
            className="rounded-lg border border-brand-neutral-100 bg-white px-4 py-2.5 outline-brand-primary"
          >
            <option value="" disabled>
              —
            </option>
            <option value="funding">{t("inquiryTypeFunding")}</option>
            <option value="partnership">{t("inquiryTypePartnership")}</option>
            <option value="other">{t("inquiryTypeOther")}</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-brand-neutral-900">
            {t("message")}
          </span>
          <textarea
            name="message"
            rows={4}
            className="rounded-lg border border-brand-neutral-100 bg-white px-4 py-2.5 outline-brand-primary"
          />
        </label>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary-light disabled:opacity-60"
          >
            {status === "submitting" ? t("submitting") : t("submit")}
          </button>

          {status === "success" && (
            <p className="mt-3 text-center text-sm text-brand-secondary">
              {t("successTitle")} — {t("successMessage")}
            </p>
          )}
          {status === "error" && (
            <p className="mt-3 text-center text-sm text-red-600">
              {t("errorMessage")}
            </p>
          )}
        </div>
      </form>
      </div>
    </section>
  );
}
