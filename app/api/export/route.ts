import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PDFDocument from "pdfkit";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notes = await prisma.fieldNote.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const doc = new PDFDocument();

  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => chunks.push(chunk));

  doc.on("end", () => {});

  // 🧠 Title
  doc.fontSize(20).text("Field Journal", { align: "center" });
  doc.moveDown();

  // 🧠 Notes
  notes.forEach((note) => {
    doc
      .fontSize(12)
      .text(`[${note.fieldType}] ${new Date(note.createdAt).toLocaleString()}`);
    doc.moveDown(0.5);
    doc.fontSize(11).text(note.text);
    doc.moveDown();
    doc.moveDown();
  });

  doc.end();

  const pdfBuffer = await new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="journal.pdf"',
    },
  });
}
