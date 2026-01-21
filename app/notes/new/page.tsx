"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewNotePage() {
  const [text, setText] = useState("");
  const [fieldType, setFieldType] = useState("Insight");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, fieldType }),
    });
    router.push("/");
  };

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">New Note</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          className="border p-2 rounded-md"
          placeholder="Write your observation..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <select
          value={fieldType}
          onChange={(e) => setFieldType(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option>Insight</option>
          <option>Encounter</option>
          <option>Mood</option>
          <option>Energy</option>
          <option>Thoughts</option>
          <option>Other</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Save Note
        </button>
      </form>
    </main>
  );
}
