// components/ExportButtons.tsx (enhanced)
import { useState } from "react";

export default function ExportButtons() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [groupBy, setGroupBy] = useState("none"); // none, day, week, month

  const handleExport = (format: "pdf" | "json") => {
    const params = new URLSearchParams();
    params.set("format", format);
    if (startDate) params.set("from", startDate);
    if (endDate) params.set("to", endDate);
    if (groupBy !== "none") params.set("groupBy", groupBy);

    window.open(`/api/export?${params.toString()}`, "_blank");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 ">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-2 py-1 text-sm border rounded"
          placeholder="From date"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-2 py-1 text-sm border rounded "
          placeholder="To date"
        />
        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
          className="px-2 py-1 text-sm border rounded "
        >
          <option value="none">No grouping</option>
          <option value="day">Group by day</option>
          <option value="week">Group by week</option>
          <option value="month">Group by month</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => handleExport("pdf")}
          className="px-4 py-2 text-white bg-red-600 rounded"
        >
          📄 Export PDF
        </button>
        <button
          onClick={() => handleExport("json")}
          className="px-4 py-2 text-white bg-blue-600 rounded"
        >
          💾 Export JSON
        </button>
      </div>
    </div>
  );
}
