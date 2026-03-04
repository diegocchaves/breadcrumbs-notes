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
    return (
      <div className="flex flex-col gap-4 w-full h-100 justify-center items-center text-sm text-gray-500 p-6">
        <p className="flex justify-center items-center translate-y-1/2">
          No notes found. Start by adding a new note!
        </p>
        <QuickAddButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full justify-center items-center mt-10">
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
