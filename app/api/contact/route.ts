import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/forms/schema";
import { sendLead } from "@/lib/forms/leadSink";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = contactFormSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await sendLead(parsed.data);
  } catch (error) {
    console.error("[contact] sendLead failed", error);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
