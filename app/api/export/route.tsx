import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

// PDF styles (same as before)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  date: {
    fontSize: 10,
    marginBottom: 30,
    textAlign: "center",
    color: "gray",
  },
  noteContainer: {
    marginBottom: 20,
    paddingBottom: 10,
  },
  noteHeader: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  noteText: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  divider: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    borderBottomStyle: "solid",
  },
});

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get format from query parameter
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "pdf"; // Default to PDF

  const notes = await prisma.fieldNote.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  if (notes.length === 0) {
    return NextResponse.json({ error: "No notes to export" }, { status: 404 });
  }

  // Handle JSON export (for AI prompts)
  if (format === "json") {
    const aiPromptInstruction = `You are a behavioral analyst and reflection coach. Analyze these field notes and provide:

1. PATTERN ANALYSIS: What behavioral or thought patterns do you notice across these notes?
2. THEME IDENTIFICATION: What themes appear most frequently? (List top 3-5)
3. EVOLUTION TRACKING: How has the user's perspective, mood, or focus evolved over time?
4. ACTIONABLE INSIGHTS: What 3 specific recommendations would you make based on this data?
5. STRENGTHS SPOTTING: What strengths or positive patterns do you observe?

Please be specific, compassionate, and practical in your analysis.`;

    const jsonData = {
      // AI prompt instruction as a comment-like field
      ai_analysis_prompt: aiPromptInstruction,

      // Instructions for using this file
      usage_instructions:
        "Copy the 'notes' array below and paste into ChatGPT/Claude with the prompt above. Or use this JSON directly with AI tools.",

      metadata: {
        exportedAt: new Date().toISOString(),
        userId: session.user.id,
        totalNotes: notes.length,
        dateRange: {
          from: notes[notes.length - 1]?.createdAt,
          to: notes[0]?.createdAt,
        },
      },

      notes: notes.map((note) => ({
        id: note.id,
        type: note.fieldType,
        content: note.text,
        createdAt: note.createdAt,
        dateFormatted: new Date(note.createdAt).toLocaleString(),
      })),
    };

    // Return as downloadable JSON file
    return new NextResponse(JSON.stringify(jsonData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="journal-${Date.now()}.json"`,
      },
    });
  }

  // Handle PDF export (for humans)
  const JournalPDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Field Journal</Text>
        <Text style={styles.date}>
          Generated: {new Date().toLocaleString()}
        </Text>

        {notes.map((note, index) => (
          <View key={note.id}>
            <View style={styles.noteContainer}>
              <Text style={styles.noteHeader}>
                [{note.fieldType}] {new Date(note.createdAt).toLocaleString()}
              </Text>
              <Text style={styles.noteText}>{note.text}</Text>
            </View>
            {index < notes.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </Page>
    </Document>
  );

  const pdfBuffer = await renderToBuffer(<JournalPDF />);

  // Return with proper headers
  return new NextResponse(pdfBuffer as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="journal-${Date.now()}.pdf"`,
    },
  });
}
