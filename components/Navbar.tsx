"use client";
import { MdOutlineSettings } from "react-icons/md";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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

  return (
    <nav className="fixed flex items-center justify-between w-full px-6 py-5 bg-gray-900">
      <Link href="/" className="font-semibold">
        <img
          src="/bc-logo.svg"
          className="w-10 h-10 lg:h-14 lg:w-14"
          alt="Breadcrumbs logo"
        />
      </Link>

      <div className="flex items-center gap-4">
        {status === "loading" && <span>Loading…</span>}
        {status === "unauthenticated" && (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Register</Link>
          </>
        )}

        {status === "authenticated" && session.user && (
          <>
            <div className="flex flex-row items-center justify-center gap-1 mx-6 text-xs lg:text-sm lg:mx-12">
              {" "}
              <span className="text-gray-200 "> Welcome, </span>
              <span className="text-blue-500 ">
                {" "}
                {session.user.email?.split("@")[0] ?? "User"}
              </span>
            </div>

            <div
              className="relative rounded-md cursor-pointer "
              onClick={toggleMenu}
              ref={buttonRef}
            >
              {!isOpen ? (
                <MdOutlineSettings className="w-5 h-5 text-slate-300 hover:text-slate-500" />
              ) : (
                <MdOutlineSettings size={10} className="text-gray-500" />
              )}{" "}
              {isOpen && (
                <div
                  ref={menuRef}
                  className="absolute right-0 z-10 flex flex-col items-center justify-center w-20 h-20 mt-2 rounded-md shadow-lg bg-slate-700 "
                >
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="p-1.5 text-xs text-red-600 bg-gray-500 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
