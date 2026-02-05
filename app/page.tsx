"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import NotesClient from "./notes-client";

export default function Home() {
  const searchParams = useSearchParams();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!searchParams) return;

    const created = searchParams.get("created");

    if (created === "1") {
      setSuccess(true);

      const timer = setTimeout(() => setSuccess(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Timeline</h1>
      {success && (
        <div className="mb-4 rounded-md border bg-green-100 border-y-green-500  p-3 text-sm text-green-700">
          ✅ Note added successfully
        </div>
      )}
      <NotesClient />
    </main>
  );
}
