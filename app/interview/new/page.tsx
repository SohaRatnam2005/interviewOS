
import { auth } from "@/auth";
import CreateInterviewForm from "@/app/components/create-interview-form";

export default async function NewInterviewPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <main className="min-h-screen px-8 py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Interview
          </h1>

          <p className="mt-2 text-red-600">
            Please log in before starting an interview.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen items-center px-8 py-10">
      <div className="mx-auto items-center max-w-5xl">
        <header className="mb-8">
          <p className="text-sm font-semibold text-purple-600">
            InterviewOS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Start a New Interview
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Customize your interview session and let InterviewOS
            generate personalized questions for you.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <section className="rounded-2xl items-center border border-purple-100 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Interview Setup
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose the options for your practice session.
            </p>

            <CreateInterviewForm />
          </section>

          <aside className="rounded-2xl border border-purple-100 bg-purple-50/50 p-6">
            <h2 className="text-lg font-bold text-gray-900">
              How it works
            </h2>

            <div className="mt-5 space-y-5">
              <div>
                <p className="font-semibold text-purple-700">
                  01. Choose your setup
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Select your role, interview type, and difficulty.
                </p>
              </div>

              <div>
                <p className="font-semibold text-purple-700">
                  02. Practice
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Answer AI-generated interview questions.
                </p>
              </div>

              <div>
                <p className="font-semibold text-purple-700">
                  03. Get feedback
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Receive scores, strengths, weaknesses, and
                  personalized recommendations.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
