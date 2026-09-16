import { prisma } from "@/lib/prisma";
import InterviewSession from "./interview-session";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

type SessionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SessionPage({
  params,
}: SessionPageProps) {
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
      questions: {
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

  if (interview.questions.length === 0) {
    return (
      <main className="min-h-screen bg-white p-10">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-purple-700">
            No Questions Yet
          </h1>

          <p className="mt-2 text-gray-500">
            Questions haven't been added to this interview yet.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <p className="text-sm font-semibold text-purple-600">
            InterviewOS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            {interview.role} Interview
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {interview.difficulty} • {interview.user.name}
          </p>
        </div>

        <InterviewSession
          interviewId={interview.id}
          questions={interview.questions}
        />
      </div>
    </main>
  );
}