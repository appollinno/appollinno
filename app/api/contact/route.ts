import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactBody {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !EMAIL_RE.test(email) || !message) {
    return NextResponse.json(
      { error: "Name, a valid email, and a message are required." },
      { status: 400 }
    );
  }

  // TODO: forward to a real inbox / CRM once an email provider is connected.
  console.log(`[contact] ${name} <${email}>: ${body.subject ?? "(no subject)"}`);

  return NextResponse.json({ ok: true });
}
