"use client";

import useSWR from "swr";
import { NoteCard } from "@/components/NoteCard";
import { QuickAddButton } from "@/components/QuickAddButton";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function NotesClient() {
  const { data: notes } = useSWR("/api/notes", fetcher);

  return (
    <>
      <div>
        {notes?.map((note: any) => (
          <NoteCard
            key={note.id}
            text={note.text}
            fieldType={note.fieldType}
            timestamp={note.timestamp}
          />
        ))}
      </div>

      <QuickAddButton />
    </>
  );
}
