"use client";

import { signIn } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown ? false : true);
  };

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
    <div className="flex items-center justify-center w-full h-full py-40">
      <div className="flex flex-row items-center justify-center w-full h-full">
        <div className="flex items-center justify-center h-[500] bg-cyan-950 rounded-tl-2xl rounded-bl-2xl">
          <img
            src="/bc-logo.svg"
            className="w-10 h-10 lg:h-70 lg:w-70"
            alt="Breadcrumbs logo"
          />
        </div>
        <div className="flex flex-col items-center justify-center w-full h-[500] max-w-sm gap-6 p-6 bg-gray-900 rounded-tr-2xl rounded-br-2xl ">
          <div className="flex flex-col items-center gap-4 w-ull ">
            <h1 className="pb-2 text-4xl font-bold ">BreadCrumbz</h1>
            <h2>Login to your existing account</h2>
          </div>
          <div className="flex flex-col items-center justify-center w-full gap-4">
            <input
              type="email"
              placeholder="sample@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 text-sm border rounded-md"
            />

            <div className="flex flex-row items-center justify-center w-full">
              <input
                type={passwordShown ? "text" : "password"}
                placeholder="Enter your password here"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 text-sm border rounded-md"
              />
              {/* set up toggle interaction */}
              <button
                className="absolute cursor-pointer left-[990] text-gray-300"
                onClick={togglePasswordVisibility}
              >
                {passwordShown ? (
                  <FaRegEyeSlash className="hover:text-gray-500" />
                ) : (
                  <FaRegEye className="hover:text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            onClick={login}
            disabled={loading || !email || !password}
            className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <Link href="" className="text-sm text-cyan-600 font-extralight">
            Forgot Password?
          </Link>
          <div className="flex flex-row gap-2.5 text-sm font-sans">
            <span>Don't have an account?</span>
            <Link className="text-cyan-600" href="/signup">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
