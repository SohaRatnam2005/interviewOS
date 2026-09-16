import { prisma } from "@/lib/prisma";
import Link from "next/link";

type InterviewPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function InterviewPage({ params }: InterviewPageProps) {
  const { id } = await params;

  const interview = await prisma.interview.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });

  if (!interview) {
    return (
      <main className="min-h-screen bg-white p-10">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-purple-700">
            Interview Not Found
          </h1>

          <p className="mt-2 text-gray-500">
            The interview you are looking for does not exist.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold text-purple-600">InterviewOS</p>

        <h1 className="mt-3 text-4xl font-bold text-gray-900">
          {interview.role}
        </h1>

        <p className="mt-2 text-gray-500">
          {interview.difficulty} Technical Interview
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-purple-100 bg-purple-50 p-6">
            <p className="text-sm text-gray-500">Candidate</p>

            <p className="mt-2 text-lg font-semibold text-gray-900">
              {interview.user.name}
            </p>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-purple-50 p-6">
            <p className="text-sm text-gray-500">Difficulty</p>

            <p className="mt-2 text-lg font-semibold text-gray-900">
              {interview.difficulty}
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">Ready to begin?</h2>

          <p className="mt-2 text-gray-500">
            Start your interview session and practice your responses.
          </p>

          <Link
            href={`/interview/${interview.id}/session`}
            className="mt-6 inline-block rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            Start Interview
          </Link>
        </div>
      </div>
    </main>
  );
}
