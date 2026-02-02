export interface NoteCardProps {
  text: string;
  fieldType: string;
  createdAt: string;
}
export function NoteCard({ text, fieldType, createdAt }: NoteCardProps) {
  return (
    <div className="p-4 border rounded-md shadow-sm bg-white">
      <p className="mb-2 text-gray-800">{text}</p>
      <div className="text-xs text-gray-500">
        <span>Type: {fieldType}</span>
        <br />
        <span>Created at: {new Date(createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
}
