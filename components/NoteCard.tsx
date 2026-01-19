import React from "react";

interface NoteCardProps {
  text: string;
  fieldType: string;
  timestamp: string;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  text,
  fieldType,
  timestamp,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow mb-2">
      <p className="text-sm text-gray-500">
        {fieldType} • {new Date(timestamp).toLocaleString()}
      </p>
      <p className="mt-1 text-gray-900 dark:text-gray-100">{text}</p>
    </div>
  );
};
