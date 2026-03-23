"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { styleText } from "util";

export default function SignUpPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function HandleSignUp() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
      // After successful signup, redirect to login
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-[url('/bc-logo.svg')] bg-cover bg-center bg-no-repeat h-screen w-[900] flex justify-center items-center">
        <div className="flex flex-col items-center justify-center w-96 h-[500] gap-6 p-6 border rounded-lg shadow-2xl w-ull bg-white/30 backdrop-blur-md">
          <h1 className="text-xl font-semibold text-gray-900">
            Create account
          </h1>
          <div className="flex flex-col items-center justify-center w-full gap-4 p-4 text-gray-800">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 text-gray-800 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 text-gray-800 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              onClick={HandleSignUp}
              disabled={loading}
              className="w-full py-2 text-white bg-black rounded disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>

            <p className="text-sm text-center opacity-70">
              Already have an account?{" "}
              <a href="/login" className="underline">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
