export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";



export default async function InterviewsPage() {
  const user = await prisma.user.findFirst({
    include: {
      interviews: {
        include: {
          result: true,
          _count: {
            select: {
              questions: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900">
            My Interviews
          </h1>

          <p className="mt-2 text-gray-500">No user found.</p>
        </div>
      </main>
    );
  }

  const completedInterviews = user.interviews.filter(
    (interview) => interview.status === "COMPLETED",
  );

  const averageScore =
    completedInterviews.length > 0
      ? completedInterviews.reduce(
          (total, interview) =>
            total + (interview.result?.overallScore ?? 0),
          0,
        ) / completedInterviews.length
      : 0;

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold tracking-wide text-purple-600">
              INTERVIEWOS
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Welcome back, {user.name || "User"} 👋
            </h1>

            <p className="mt-2 max-w-xl text-gray-500">
              Practice interviews, improve your answers, and track your
              progress over time.
            </p>
          </div>

          <Link
            href="/interview/new"
            className="inline-flex w-fit items-center rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-purple-700"
          >
            + Start New Interview
          </Link>
        </header>

        {/* Stats */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-purple-100 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Total Interviews
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400 text-lg">
                🎯
              </div>
            </div>

            <p className="mt-4 text-3xl font-bold text-gray-900">
              {user.interviews.length}
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Practice sessions
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-purple-100 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Interviews Completed
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-lg">
                ✓
              </div>
            </div>

            <p className="mt-4 text-3xl font-bold text-gray-900">
              {completedInterviews.length}
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Completed sessions
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-purple-100 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Average Score
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-lg">
                ⭐
              </div>
            </div>

            <p className="mt-4 text-3xl font-bold text-gray-900">
              {completedInterviews.length > 0
                ? averageScore.toFixed(1)
                : "—"}
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Out of 100
            </p>
          </div>
        </section>

        {/* Recent Interviews */}
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Interviews
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Review your latest practice sessions.
              </p>
            </div>

            {user.interviews.length > 0 && (
              <span className="hidden text-sm text-gray-400 sm:block">
                {user.interviews.length} total
              </span>
            )}
          </div>

          {user.interviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                🎤
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                No interviews yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                Start your first AI-powered interview and begin tracking
                your performance.
              </p>

              <Link
                href="/interview/new"
                className="mt-6 inline-flex rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
              >
                Start Your First Interview
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {user.interviews.map((interview) => (
                <Link
                  key={interview.id}
                  href={
                    interview.status === "COMPLETED"
                      ? `/interview/${interview.id}/result`
                      : `/interview/${interview.id}/session`
                  }
                  className="group block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md"
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    {/* Interview Info */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-700">
                          {interview.role}
                        </h3>

                        {interview.status === "COMPLETED" ? (
                          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                            Completed
                          </span>
                        ) : (
                          <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                            Draft
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                        <span>{interview.type}</span>

                        <span className="text-gray-300">•</span>

                        <span>{interview.difficulty}</span>

                        <span className="text-gray-300">•</span>

                        <span>
                          {interview._count.questions} questions
                        </span>

                        <span className="text-gray-300">•</span>

                        <span>
                          {interview.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Score / Action */}
                    <div className="flex items-center justify-between gap-5 md:justify-end">
                      {interview.status === "COMPLETED" ? (
                        <>
                          <div className="text-left md:text-right">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              Score
                            </p>

                            <p className="mt-1 text-2xl font-bold text-purple-700">
                              {interview.result?.overallScore.toFixed(1) ??
                                "—"}
                              <span className="text-sm font-medium text-gray-400">
                                {" "}
                                / 100
                              </span>
                            </p>
                          </div>

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition group-hover:bg-purple-100">
                            →
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="rounded-xl bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700">
                            Continue
                          </span>

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition group-hover:bg-purple-100 group-hover:text-purple-600">
                            →
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Bottom CTA */}
        {user.interviews.length > 0 && (
          <section className="mt-10 overflow-hidden rounded-2xl bg-purple-700 p-8 text-white shadow-sm md:p-10">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-semibold text-purple-200">
                  KEEP PRACTICING
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Ready for your next interview?
                </h2>

                <p className="mt-2 max-w-lg text-sm text-purple-100">
                  Start another practice session and continue improving
                  your interview performance.
                </p>
              </div>

              <Link
                href="/interview/new"
                className="inline-flex w-fit rounded-xl bg-white px-6 py-3 font-semibold text-purple-700 transition hover:bg-purple-50"
              >
                Start New Interview →
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}