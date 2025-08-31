import { NextResponse } from "next/server";

export async function POST() {
  const endpoint = process.env.PVA_TOKEN_ENDPOINT!;
  const secret = process.env.PVA_DIRECT_LINE_SECRET!;
  if (!endpoint || !secret) {
    return NextResponse.json({ error: "Missing env" }, { status: 500 });
  }

  if (
    !/^https:\/\/.+\.environment\.api\.powerplatform\.com\/powervirtualagents\/.+\/directline\/token\?api-version=/.test(
      endpoint
    )
  ) {
    return NextResponse.json(
      { error: "Invalid PVA_TOKEN_ENDPOINT format" },
      { status: 400 }
    );
  }

  const resp = await fetch(endpoint, {
    method: "GET",
    headers: { Authorization: `Bearer ${secret}` },
  });

  if (!resp.ok) {
    return NextResponse.json(
      { error: await resp.text() },
      { status: resp.status }
    );
  }

  const data = await resp.json();
  return NextResponse.json({
    token: data.token,
    conversationId: data.conversationId,
  });
}
