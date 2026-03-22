"use client";

import { signIn } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Handle toggle password visibility
  useEffect(() => {
    function handleClickToggleVisibility(event: MouseEvent) {
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
      document.addEventListener("mousedown", handleClickToggleVisibility);
    } else {
      document.removeEventListener("mousedown", handleClickToggleVisibility);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickToggleVisibility);
    };
  }, [isOpen]);

  async function login() {
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // 👈 important for error handling
      callbackUrl: "/",
    });

    setLoading(false);

    if (!res?.ok) {
      setError("Invalid email or password");
    } else {
      window.location.href = res.url ?? "/";
    }
  }

  return (
    <div
      className="flex items-center justify-center p-8 py-40 mx-auto"
      ref={buttonRef}
      onClick={toggleMenu}
    >
      {/* Visibity toggle */}
      {isOpen ? (
        <span className="absolute cursor-pointer left-[840] text-gray-400">
          <FaRegEyeSlash />
        </span>
      ) : (
        <span className="absolute cursor-pointer left-[840] text-gray-400">
          <FaRegEye />
        </span>
      )}

      <form
        className="flex flex-col items-center justify-center w-full max-w-sm gap-5 p-10 bg-gray-900 rounded-lg"
        action=""
      >
        <input
          type="email"
          aria-placeholder="Email"
          placeholder="sample@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 text-sm border rounded-md"
        />
        <div className="flex flex-row items-center justify-center w-full">
          <input
            type="password"
            aria-placeholder="Password"
            placeholder="Enter your password here"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 text-sm border rounded-md"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          onClick={login}
          disabled={loading || !email || !password}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded "
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
