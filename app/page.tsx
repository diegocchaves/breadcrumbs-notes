import { NotesClient } from "./notes-client";
import { Suspense } from "react";
import TimelineSkeleton from "./timeline/TimelineSkeleton";

export default function Home() {
  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Timeline</h1>
      <Suspense fallback={<TimelineSkeleton />}>
        <NotesClient />
      </Suspense>
    </main>
  );
}
