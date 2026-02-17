import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

//* PATCH /api/notes/:id */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { text, fieldType } = await req.json();

    if (!text || !fieldType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const note = await prisma.fieldNote.findUnique({
      where: { id: params.id },
    });

    if (!note || note.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const UpdateNote = await prisma.fieldNote.update({
      where: { id: params.id }, // 🔑 ensure user can only update their own notes
      data: {
        text,
        fieldType,
      },
    });

    return NextResponse.json(UpdateNote, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 },
    );
  }
}
