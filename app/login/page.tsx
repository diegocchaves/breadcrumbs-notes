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
    <div className="flex items-center justify-center p-8 py-40 mx-auto">
      <form
        className="flex flex-col items-center justify-center w-full max-w-sm gap-5 p-10 bg-gray-900 rounded-lg"
        action=""
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          onClick={login}
          disabled={loading || !email || !password}
          className="w-full px-4 py-2 text-white bg-blue-500 "
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
