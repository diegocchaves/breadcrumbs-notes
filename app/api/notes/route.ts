import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET — fetch notes for user
export async function GET() {
  const notes = await prisma.fieldNote.findMany({
    orderBy: { timestamp: "desc" },
  });

  return NextResponse.json(notes);
}

// POST — create note
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }
  const body = await req.json();
  if (!body.text || !body.fieldType) {
    return NextResponse.json("Bad Request", { status: 400 });
  }
  const note = await prisma.fieldNote.create({
    data: {
      userId: session.user.id,
      text: body.text,
      fieldType: body.fieldType,
      mood: body.mood ?? null,
      energy: body.energy ?? null,
    },
  });

  return NextResponse.json(note, { status: 201 });
}

//session.user.id
