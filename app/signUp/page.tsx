"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/app/actions/auth-actions";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const result = await signup(name, email, password);

    if (!result.success) {
      setLoading(false);
      setMessage(result.message);
      return;
    }

    router.push("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-purple-50 px-6">
      <div className="w-full max-w-md rounded-3xl border border-purple-100 bg-white p-8 shadow-sm">
        <div className="text-center">
          <p className="text-sm font-semibold text-purple-600">
            InterviewOS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Create your account
          </h1>

          <p className="mt-2 text-gray-500">
            Start practicing smarter with InterviewOS.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              required
              className="w-full rounded-xl border-2 border-gray-200 p-3 text-gray-900 outline-none transition focus:border-purple-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border-2 border-gray-200 p-3 text-gray-900 outline-none transition focus:border-purple-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
              className="w-full rounded-xl border-2 border-gray-200 p-3 text-gray-900 outline-none transition focus:border-purple-500"
            />
          </div>

          {message && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3">
              <p className="text-sm font-medium text-red-700">
                {message}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-purple-600 hover:text-purple-700"
          >
            Log in
          </a>
        </p>
      </div>
    </main>
  );
}