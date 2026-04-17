import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  brand: z.string().min(1),
  projectType: z.string().min(1),
  budget: z.string().min(1),
  timeline: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const v = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "fabian.arndt.info@gmail.com";

  if (!apiKey) {
    // Dev fallback: log to server, don't block the UX.
    console.log("[contact] (no RESEND_API_KEY set) brief:", v);
    return NextResponse.json({ ok: true, dev: true });
  }

  const resend = new Resend(apiKey);
  const subject = `New brief — ${v.brand} · ${v.projectType}`;

  const html = `
    <div style="font-family: Inter, system-ui, sans-serif; color:#161513; max-width:560px;">
      <p style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#8a857d;">New brief — ByFabian</p>
      <h2 style="font-family: Fraunces, serif; font-size:28px; margin:8px 0 24px;">${escape(v.brand)}</h2>
      <table style="font-size:14px; line-height:1.6;">
        <tr><td style="color:#8a857d; padding-right:24px;">From</td><td>${escape(v.name)} &lt;${escape(v.email)}&gt;</td></tr>
        <tr><td style="color:#8a857d; padding-right:24px;">Project</td><td>${escape(v.projectType)}</td></tr>
        <tr><td style="color:#8a857d; padding-right:24px;">Budget</td><td>${escape(v.budget)}</td></tr>
        ${v.timeline ? `<tr><td style="color:#8a857d; padding-right:24px;">Timeline</td><td>${escape(v.timeline)}</td></tr>` : ""}
      </table>
      <hr style="border:0; border-top:1px solid #d9d2c5; margin:24px 0;" />
      <p style="white-space:pre-wrap;">${escape(v.message)}</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "ByFabian <onboarding@resend.dev>",
      to,
      replyTo: v.email,
      subject,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "send failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
