"use client";

import { useEffect, useState } from "react";

type Note = {
  id: string;
  text: string;
  fieldType: string;
  createdAt: string;
};

export default function NotesClient() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch("/api/notes")
      .then((r) => r.json())
      .then(setNotes);
  }, []);

  async function addNote() {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        fieldType: "Insight",
      }),
    });

    const note = await res.json();
    setNotes((prev) => [note, ...prev]);
    setText("");
  }

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <button onClick={addNote} className="bg-black text-white px-4 py-2 mb-4">
        Add Note
      </button>

      {notes.length === 0 && <p>No notes yet</p>}

      {notes.map((n) => (
        <div key={n.id} className="border p-2 mb-2">
          <strong>{n.fieldType}</strong>
          <p>{n.text}</p>
        </div>
      ))}
    </div>
  );
}
