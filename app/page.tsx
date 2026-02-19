"use client";

import NotesClient from "./notes-client";

export default function Home() {
  return (
    <main className="p-6 gap-6 md:p-10 md:gap-10 w-full flex flex-col justify-start items-start">
      <h1>Timeline</h1>
      <NotesClient />
    </main>
  );
}
