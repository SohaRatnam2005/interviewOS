"use client";

export default function DownloadButton() {
  function handleDownload() {
    window.print();
  }

  return (
    <button
      onClick={handleDownload}
      className="rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700 print:hidden"
    >
      Download Report
    </button>
  );
}