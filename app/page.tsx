import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to InterviewOS
          </h1>

          <p className="mt-2 text-gray-500">
            Please log in to access your dashboard.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-block rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700"
          >
            Log In
          </Link>
        </div>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
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
      <main className="min-h-screen px-8 py-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900">
            User not found
          </h1>
        </div>
      </main>
    );
  }

  const interviews = user.interviews;

  const completedInterviews = interviews.filter(
    (interview) => interview.status === "COMPLETED",
  );

  const averageScore =
    completedInterviews.length > 0
      ? completedInterviews.reduce(
          (sum, interview) =>
            sum + (interview.result?.overallScore ?? 0),
          0,
        ) / completedInterviews.length
      : 0;

  const completionRate =
    interviews.length > 0
      ? (completedInterviews.length / interviews.length) * 100
      : 0;

  const recentInterviews = interviews.slice(0, 5);

  return (
    <main className="min-h-screen px-8 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <p className="text-sm font-semibold text-purple-600">
            Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Welcome back, {user.name || "there"} 👋
          </h1>

          <p className="mt-2 text-gray-500">
            Track your interview practice and improve your performance.
          </p>
          
        </header>

        <section className="grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-6">
            <p className="text-sm font-medium text-gray-500">
              Total Interviews
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {interviews.length}
            </p>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-6">
            <p className="text-sm font-medium text-gray-500">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {completedInterviews.length}
            </p>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-6">
            <p className="text-sm font-medium text-gray-500">
              Average Score
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-700">
              {averageScore.toFixed(1)}
              <span className="text-lg text-gray-400"> / 10</span>
            </p>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-6">
            <p className="text-sm font-medium text-gray-500">
              Completion Rate
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-700">
              {completionRate.toFixed(0)}%
            </p>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Interviews
            </h2>

            <Link
              href="/interviews"
              className="text-sm font-semibold text-purple-600 hover:text-purple-700"
            >
              View all →
            </Link>
          </div>

          {recentInterviews.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <p className="text-gray-500">
                You haven't created any interviews yet.
              </p>

              <Link
                href="/interview/new"
                className="mt-4 inline-block rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700"
              >
                Create Interview
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentInterviews.map((interview) => (
                <Link
                  key={interview.id}
                  href={
                    interview.status === "COMPLETED"
                      ? `/interview/${interview.id}/result`
                      : `/interview/${interview.id}/session`
                  }
                  className="block rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-purple-200 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {interview.role}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {interview.type} • {interview.difficulty}
                      </p>
                    </div>

                    <div className="text-right">
                      {interview.status === "COMPLETED" ? (
                        <>
                          <p className="text-lg font-bold text-purple-700">
                            {interview.result?.overallScore.toFixed(1)}
                            /10
                          </p>

                          <span className="inline-flex rounded-xl bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                            View Results →
                          </span>
                        </>
                      ) : (
                        <span className="inline-flex rounded-xl bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
                          Continue Interview →
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <Link
            href="/interview/new"
            className="inline-flex rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            + Start New Interview
          </Link>
        </section>
      </div>
    </main>
  );
}