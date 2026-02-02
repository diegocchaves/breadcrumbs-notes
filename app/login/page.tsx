"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="p-8 max-w-sm mx-auto space-y-4 ">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={login}
        disabled={loading || !email || !password}
        className="bg-black text-white px-4 py-2 w-full disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}
