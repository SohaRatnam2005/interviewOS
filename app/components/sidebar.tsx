"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: "🏠",
  },
  {
    name: "My Interviews",
    href: "/interviews",
    icon: "🎯",
  },
  {
    name: "New Interview",
    href: "/interview/new",
    icon: "➕",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-purple-100 bg-white">
      <div className="border-b border-purple-100 px-6 py-6">
        <h1 className="text-2xl font-bold text-purple-700">
          InterviewOS
        </h1>

        <p className="mt-1 text-xs text-gray-400">
          AI Interview Simulator
        </p>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-purple-100 p-4">
        <div className="rounded-xl bg-purple-50 px-4 py-3">
          <p className="text-sm font-semibold text-gray-800">
            InterviewOS
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Practice. Improve. Succeed.
          </p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-3 flex w-full items-center gap-3 bg-purple-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <span>🚪</span>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}