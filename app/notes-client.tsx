"use client";

import { QuickAddButton } from "@/components/QuickAddButton";
import { NoteCard } from "@/components/NoteCard";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch notes");
  }

  return res.json();
};

export default function NotesClient() {
  const { data: notes, error, isLoading } = useSWR("/api/notes", fetcher);

  if (isLoading) {
    return <p>Loading notes...</p>;
  }
  if (error) {
    return <p>Could not load notes: {error.message}</p>;
  }

  if (!notes || notes.length === 0) {
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-500">No notes available.</p>
      <QuickAddButton />
    </div>;
  }

  return (
    <div className="flex flex-col gap-4 w-full justify-center items-center">
      {notes.map((note: any) => (
        <NoteCard
          key={note.id}
          id={note.id}
          text={note.text}
          fieldType={note.fieldType}
          createdAt={note.createdAt}
        />
      ))}

      <QuickAddButton />
    </div>
  );
}
