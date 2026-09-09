"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { trackLead } from "@/lib/analytics/track";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const t = useTranslations("ContactPage");
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

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
        }),
      });

      if (!res.ok) throw new Error("submit failed");

      setStatus("success");
      form.reset();
      trackLead();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
            {t("formName")} *
          </span>
          <input
            name="name"
            required
            className="rounded-lg border border-brand-neutral-100 bg-white px-4 py-2.5 outline-brand-primary"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-brand-neutral-900">
            {t("formTel")}
          </span>
          <input
            type="tel"
            name="phone"
            className="rounded-lg border border-brand-neutral-100 bg-white px-4 py-2.5 outline-brand-primary"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-brand-neutral-900">
            {t("formEmail")} *
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
            {t("formRemark")}
          </span>
          <textarea
            name="message"
            rows={4}
            className="rounded-lg border border-brand-neutral-100 bg-white px-4 py-2.5 outline-brand-primary"
          />
        </label>

        <div>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-primary-light disabled:opacity-60"
          >
            {status === "submitting" ? t("formSubmitting") : t("formSubmit")}
          </button>

          {status === "success" && (
            <p className="mt-3 text-center text-sm text-brand-secondary">
              {t("formSuccess")}
            </p>
          )}
          {status === "error" && (
            <p className="mt-3 text-center text-sm text-red-600">
              {t("formError")}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
