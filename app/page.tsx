import { NotesClient } from "./notes-client";

export default function Home() {
  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Timeline</h1>
      <NotesClient />
    </main>
  );
}
