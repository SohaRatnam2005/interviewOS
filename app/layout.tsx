import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/sidebar";

export const metadata: Metadata = {
  title: "InterviewOS",
  description: "AI-powered interview simulator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Sidebar />

        <main className="ml-64 min-h-screen bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}