"use client";

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
          className="w-6 h-6 lg:h-12 lg:w-12"
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
            <span className="text-sm text-gray-600 ">
              {" "}
              Welcome, {session.user.email?.split("@")[0] ?? "User"}
            </span>
            <div onClick={toggleMenu} ref={buttonRef}></div>
            {/* <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-xs text-red-600"
            >
              Logout
            </button> */}
          </>
        )}
      </div>
    </nav>
  );
}
