import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { WiStars } from "react-icons/wi";
import { BsStars } from "react-icons/bs";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/app/providers/toast-provider";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { Economica } from "next/font/google";

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
    <div className="flex flex-row justify-between w-full gap-3 p-4 rounded-md shadow-sm bg-slate-800 lg:w-1/2 ">
      <div className="flex flex-col flex-1 min-w-0 gap-4 p-2 overflow-hidden">
        {!isEditing ? (
          <div
            className={`overflow-hidden transition-[max-heigth] duration-300 text-gray-50 cursor-pointer`}
            style={{
              maxHeight: expanded ? "none" : "1.5rem",
              whiteSpace: "pre-wrap",
            }}
            onClick={() => setExpanded(!expanded)}
          >
            <span>{text}</span>
          </div>
        ) : (
          <form
            onSubmit={handleNoteUpdate}
            className="flex flex-col w-full gap-2"
          >
            <textarea
              className="p-2 border rounded-md bg-slate-700 text-gray-50"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
            <div>
              <button
                type="submit"
                className="px-3 py-1 mr-2 text-sm bg-green-500 rounded-md text-gray-50"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedText(text);
                }}
                className="px-3 py-1 text-sm bg-gray-500 rounded-md text-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        <div className="flex flex-col lg:text-[11px] text-[10px] gap-1 ">
          <div className="flex flex-row items-center gap-1.5 text-blue-400">
            <BsStars />
            <span>Type: {fieldType}</span>
          </div>
          <div className="flex flex-row items-center gap-1.5 text-green-300">
            <FaRegCalendarAlt />
            <span> Created at: {new Date(createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div
        className="relative rounded-md cursor-pointer "
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
            className="absolute right-0 z-10 rounded-md shadow-lg bg-slate-700"
          >
            <button
              onClick={() => setIsEditing(true)}
              className="block w-full px-4 py-2 text-sm text-left text-gray-100 hover:text-blue-400"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="block w-full px-4 py-2 text-sm text-left text-gray-100 hover:text-blue-400"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
