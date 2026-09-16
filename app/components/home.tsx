import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CreateInterviewForm from "./create-interview-form";

export default async function Home() {
  const users = await prisma.user.findMany({
    include: {
      interviews: true,
    },
  });

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-purple-700">
            InterviewOS
          </h1>

          <p className="mt-2 text-gray-500">
            Your personal interview preparation platform.
          </p>
        </header>

        {/* Create User */}
        <section className="rounded-2xl border border-purple-100 bg-purple-50/50 p-6 shadow-sm">
          <h2 className="mb-1 text-xl font-semibold text-gray-900">
            Create User
          </h2>

          <p className="mb-5 text-sm text-gray-500">
            Set up your profile to start preparing for interviews.
          </p>

          
        </section>

        {/* Interviews */}
        <section className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Your Interviews
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Practice, improve, and track your interview preparation.
            </p>
          </div>

          {users.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/30 p-12 text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                No users yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Create a user first to start preparing for interviews.
              </p>
            </div>
          ) : (
            <>
              {users.map((user) => (
                <div key={user.id} className="mb-10">
                  <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Create Interview for {user.name}
                    </h3>

                    
                  </div>

                  {user.interviews.length > 0 && (
                    <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {user.interviews.map((interview) => (
                        <div
                          key={interview.id}
                          className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-md"
                        >
                          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                            🎯
                          </div>

                          <h3 className="text-xl font-bold text-gray-900">
                            {interview.role}
                          </h3>

                          <p className="mt-1 text-sm text-purple-600">
                            {interview.difficulty} Interview
                          </p>

                          <div className="mt-6 border-t border-gray-100 pt-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              Candidate
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-700">
                              {user.name}
                            </p>
                          </div>

                          <Link
                            href={`/interview/${interview.id}`}
                            className="mt-6 block w-full rounded-xl bg-purple-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-purple-700"
                          >
                            Start Interview
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
