import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const TEST_USER_ID = "cml2ixomi0000948qaax6s6d0"; // Replace with actual user ID in production

export async function GET() {
  const notes = await prisma.fieldNote.findMany({
    where: { userId: TEST_USER_ID },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  const body = await req.json();

  const note = await prisma.fieldNote.create({
    data: {
      userId: "TEST_USER_ID",
      text: body.text,
      fieldType: body.fieldType,
    },
  });

  return NextResponse.json(note, { status: 201 });
}
