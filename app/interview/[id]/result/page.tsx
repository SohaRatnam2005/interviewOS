import { prisma } from "@/lib/prisma";
import DownloadButton from "./download-button";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

type ResultPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ResultPage({
  params,
}: ResultPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const interview = await prisma.interview.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      user: true,
      result: true,
      questions: {
        include: {
          answer: true,
        },
        orderBy: {
          order: "asc",
        },
      },
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
            We couldn't find this interview.
          </p>
        </div>
      </main>
    );
  }

  if (!interview.result) {
    return (
      <main className="min-h-screen bg-white p-10">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-purple-700">
            Results Not Available
          </h1>

          <p className="mt-2 text-gray-500">
            This interview hasn't been evaluated yet.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10">
          <p className="text-sm font-semibold text-purple-600">
            InterviewOS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Interview Results
          </h1>

          <p className="mt-1 text-gray-500">
            {interview.role} • {interview.difficulty} •{" "}
            {interview.user.name}
          </p>

          <div className="mt-6 flex items-center justify-between gap-4">
            <Link
              href="/"
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              ← Dashboard
            </Link>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/interview/${interview.id}/session`}
                className="rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700"
              >
                Retake Interview
              </Link>

              <DownloadButton />
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-purple-100 bg-purple-50/50 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
            Overall Score
          </p>

          <p className="mt-3 text-6xl font-bold text-purple-700">
            {interview.result.overallScore.toFixed(1)}
            <span className="text-2xl text-gray-400"> / 100</span>
          </p>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="font-bold text-gray-900">Strengths</h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {interview.result.strengths ||
                "No strengths recorded yet."}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="font-bold text-gray-900">Weaknesses</h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {interview.result.weaknesses ||
                "No weaknesses recorded yet."}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="font-bold text-gray-900">
              Recommendation
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {interview.result.recommendation ||
                "No recommendation recorded yet."}
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-bold text-gray-900">
            Question Review
          </h2>

          <div className="space-y-6">
            {interview.questions.map((question, index) => (
              <div
                key={question.id}
                className="rounded-2xl border border-gray-200 bg-white p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-purple-600">
                      Question {index + 1} • {question.category}
                    </p>

                    <h3 className="mt-2 font-semibold leading-relaxed text-gray-900">
                      {question.question}
                    </h3>
                  </div>

                  <div className="shrink-0 rounded-lg bg-purple-100 px-3 py-1 text-sm font-bold text-purple-700">
                    {question.answer?.score ?? 0}/100
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Your Answer
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    {question.answer?.response ||
                      "No answer recorded."}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    AI Feedback
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {question.answer?.feedback ||
                      "No feedback available."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}