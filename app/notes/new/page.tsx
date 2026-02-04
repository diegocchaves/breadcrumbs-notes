"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NewNotePage() {
  const { data: session } = useSession();
  const [text, setText] = useState("");
  const [fieldType, setFieldType] = useState("Insight");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  if (!session) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <main className="p-4 max-w-xl mx-auto flex flex-col items-center">
          <p>Please log in to create a new note.</p>
        </main>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, fieldType }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">New Note</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          className="border p-2 rounded-md"
          placeholder="Write your observation..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError(null);
          }}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
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
