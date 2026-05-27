// components/ExportButtons.tsx
"use client";

import { Download, FileJson, FileText } from "lucide-react";

export default function ExportButtons() {
  const handleExport = (format: "pdf" | "json") => {
    window.open(`/api/export?format=${format}`, "_blank");
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleExport("pdf")}
        className="flex items-center gap-2 px-4 py-2 text-white transition bg-red-600 rounded-md hover:bg-red-700"
      >
        <FileText className="w-4 h-4" />
        Export PDF
      </button>

      <button
        onClick={() => handleExport("json")}
        className="flex items-center gap-2 px-4 py-2 text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
      >
        <FileJson className="w-4 h-4" />
        Export JSON (for AI)
      </button>
    </div>
  );
}
