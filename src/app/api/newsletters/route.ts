import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const result = await fetch("https://api.sendinblue.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "api-key": process.env.SENDINBLUE_API_KEY!,
      },
      body: JSON.stringify({ updateEnabled: false, email: email, listIds: [5] }),
    });

    const data = await result.json();

    if (!result.ok) {
      return NextResponse.json({ error: data.message || "Something went wrong" }, { status: 500 });
    }

    return NextResponse.json({ error: "" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
