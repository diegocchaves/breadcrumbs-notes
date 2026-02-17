"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      <Link href="/" className="font-semibold">
        Bread Crumbs Notes
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
            <span className="text-sm text-gray-600">{session.user.email}</span>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
