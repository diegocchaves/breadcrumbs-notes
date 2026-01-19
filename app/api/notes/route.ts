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
  const body = await req.json();
  const testUser = await prisma.user.upsert({
    where: { email: "dev@test.com" },
    update: {},
    create: { email: "dev@test.com", name: "Dev User" },
  });

  const note = await prisma.fieldNote.create({
    data: {
      userId: testUser.id,
      text: body.text,
      fieldType: body.fieldType,
      mood: body.mood ?? null,
      energy: body.energy ?? null,
    },
  });

  return NextResponse.json(note, { status: 201 });
}

//session.user.id
