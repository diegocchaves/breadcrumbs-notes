"use client";

import { useSearchParams } from "next/navigation";
import NotesClient from "./notes-client";

export default function Home() {
  const searchParams = useSearchParams();

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Timeline</h1>
      <NotesClient />
    </main>
  );
}
