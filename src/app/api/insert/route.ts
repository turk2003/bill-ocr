// ...existing code...
import { NextRequest } from "next/server";
import { google } from "googleapis";

export async function POST(req: NextRequest) {
  console.log("Request headers:", req.headers.get("Authorization"));

  if (req.headers.get("Authorization") !== `Bearer ${process.env.API_KEY}`) {
    return new Response("Forbidden", { status: 403 });
  }

  let data: unknown;

  try {
    data = await req.json();
  } catch (error) {
    console.error("Invalid JSON:", error);
    return new Response("Bad Request: invalid JSON", { status: 400 });
  }

  const fields = [
    "เล่มที่",
    "เลขที่",
    "ทะเบียนรถ",
    "สถานี",
    "จำนวน",
    "ราคา",
    "เงินทั้งสิ้น",
    "วันที่",
    "ภาษี",
    "เลขไมล์",
  ];

  if (typeof data !== "object" || data === null) {
    return new Response("Bad Request: data must be an object", { status: 400 });
  }

  const row = fields.map((k) => {
    const v = (data as Record<string, unknown>)[k];
    return v === undefined || v === null ? "" : String(v);
  });

  const sheetId = process.env.SHEET_ID;
  const saB64 = process.env.GOOGLE_SERVICE_ACCOUNT_B64;
  if (!saB64) {
    console.error("Missing GOOGLE_SERVICE_ACCOUNT_B64");
    return new Response("Server configuration error", { status: 500 });
  }
  const serviceAccount = JSON.parse(
    Buffer.from(saB64, "base64").toString("utf8")
  );

  try {
    const auth = new google.auth.JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:K",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    });

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Sheets API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
// ...existing code...
