"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/app/providers/toast-provider";

export default function NewNotePage() {
  const { data: session } = useSession();
  const [text, setText] = useState("");
  const [fieldType, setFieldType] = useState("Insight");
  const router = useRouter();
  const { showToast } = useToast();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <main className="flex flex-col items-center max-w-xl p-4 mx-auto">
          <p>Please log in to create a new note.</p>
        </main>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, fieldType }),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.error || "Something went wrong", "error");
      return;
    }

    showToast("Note added successfully", "success");

    router.push("/?created=1");
  };

  return (
    <main className="max-w-xl p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">New Note</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-20 mt-40 bg-gray-900 rounded"
      >
        <textarea
          className="p-2 border rounded-md"
          placeholder="Write your observation..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <select
          value={fieldType}
          onChange={(e) => setFieldType(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option>Insight</option>
          <option>Encounter</option>
          <option>Mood</option>
          <option>Energy</option>
          <option>Thoughts</option>
          <option>Other</option>
        </select>
        <button type="submit" className="p-2 text-white bg-blue-500 rounded-md">
          Save Note
        </button>
      </form>
    </main>
  );
}
