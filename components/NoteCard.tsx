import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/app/providers/toast-provider";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

export interface NoteCardProps {
  id: string;
  text: string;
  fieldType: string;
  createdAt: string;
}

export function NoteCard({ id, text, fieldType, createdAt }: NoteCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const { showToast } = useToast();
  const [expanded, setExpanded] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setEditedText(text);
  }, [text]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleNoteUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editedText, fieldType }),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.error || "Something went wrong", "error");
      return;
    }

    showToast("Updated successfully", "success");

    mutate("/api/notes");
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const res = await fetch(`/api/notes/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.error || "Something went wrong", "error");
      return;
    }

    showToast("Deleted successfully", "success");

    mutate("/api/notes");
  };

  return (
    <div className="p-4 flex flex-row justify-between rounded-md shadow-sm bg-slate-800 w-full h-fit lg:w-1/2 gap-3 overflow-hidden">
      <div className="flex flex-col gap-2 p-2 min-w-0 flex-1 ">
        {!isEditing ? (
          <p>{text}</p>
        ) : (
          <form
            onSubmit={handleNoteUpdate}
            className="flex flex-col gap-2 w-full"
          >
            <textarea
              className="border p-2 rounded-md bg-slate-700 text-gray-50"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
            <div>
              <button
                type="submit"
                className="bg-green-500 text-gray-50 px-3 py-1 rounded-md mr-2 text-sm"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedText(text);
                }}
                className="bg-gray-500 text-gray-50 px-3 py-1 rounded-md text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        <div className="flex flex-col text-xs text-gray-400 gap-1">
          <span>Type: {fieldType}</span>
          <span>Created at: {new Date(createdAt).toLocaleString()}</span>
        </div>
      </div>
      <div
        className="relative cursor-pointer rounded-md "
        ref={buttonRef}
        onClick={toggleMenu}
      >
        {/* edit/delete buttons can go here */}
        {!isOpen ? (
          <HiOutlineDotsHorizontal
            className="text-slate-300 hover:text-slate-500"
            size={20}
          />
        ) : (
          <HiOutlineDotsHorizontal size={10} />
        )}
        {isOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 bg-slate-700 rounded-md shadow-lg z-10"
          >
            <button
              onClick={() => setIsEditing(true)}
              className="block w-full text-left px-4 py-2 text-gray-100 hover:text-blue-400 text-sm"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="block w-full text-left px-4 py-2 text-gray-100 hover:text-blue-400 text-sm"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
