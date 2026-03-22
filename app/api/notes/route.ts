import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FieldType } from "@prisma/client";

/* GET /api/notes */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const notes = await prisma.fieldNote.findMany({
      where: { userId: session.user.id },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 },
    );
  }
}

/* POST /api/notes */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { text, fieldType } = await req.json();

    const validTypes = Object.values(FieldType);

    console.log(validTypes);

    if (!validTypes.includes(fieldType as FieldType)) {
      return NextResponse.json(
        { error: "Invalid field type" },
        { status: 400 },
      );
    }
    if (!text || !fieldType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newNote = await prisma.fieldNote.create({
      data: {
        text,
        fieldType,
        userId: session.user.id, // 🔑 associate note with session user
      },
    });

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 },
    );
  }
}
