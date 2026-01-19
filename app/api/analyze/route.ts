import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { notes } = await req.json();

  if (!notes) {
    return NextResponse.json({ error: "Notes are required" }, { status: 400 });
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a self-anthropology assistant." },
      { role: "user", content: JSON.stringify(notes) },
    ],
  });

  return NextResponse.json({
    result: response.choices[0].message.content,
  });
}
