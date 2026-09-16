"use client";

import { useState } from "react";
import { submitAnswer } from "@/app/actions/answer-actions";
import { completeInterview } from "@/app/actions/interview-actions";
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  question: string;
  category: string;
  order: number;
};

type InterviewSessionProps = {
  interviewId: string;
  questions: Question[];
};

export default function InterviewSession({
  questions,
  interviewId,
}: InterviewSessionProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          No Questions Available
        </h1>

        <p className="mt-2 text-gray-500">
          We couldn't load the questions for this interview.
        </p>

        <button
          onClick={() => router.push("/")}
          className="mt-6 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700"
        >
          ← Back to Dashboard
        </button>
      </div>
    </main>
  );
}

  async function handleSubmit() {
    if (!answer.trim()) {
      setMessage("Please write an answer first.");
      return;
    }

    setLoading(true);
    setMessage("");

    const result = await submitAnswer(currentQuestion.id, answer);

    if (!result.success) {
      setLoading(false);
      setMessage(result.message);
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setLoading(false);
      setAnswer("");
      setMessage("");
      setCurrentQuestionIndex((previous) => previous + 1);
    } else {
      const completionResult = await completeInterview(interviewId);

      if (!completionResult.success) {
        setLoading(false);
        setMessage(completionResult.message);
        return;
      }

      router.push(`/interview/${interviewId}/result`);
    }
  }

  if (loading && currentQuestionIndex === questions.length - 1) {
    return (
      <main className="min-h-screen bg-white px-6 py-10">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-2xl border border-purple-100 bg-purple-50/40 p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-2xl">
              ✨
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Analyzing Your Interview
            </h2>

            <p className="mt-3 text-gray-500">
              We're evaluating your answers and preparing your personalized
              performance report.
            </p>

            <div className="mx-auto mt-8 h-2 w-full max-w-md overflow-hidden rounded-full bg-purple-100">
              <div className="h-full w-full animate-pulse rounded-full bg-purple-600" />
            </div>

            <p className="mt-4 text-sm text-gray-400">
              This may take a few seconds...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium text-gray-700">
            Question {currentQuestionIndex + 1}
          </span>

          <span className="text-gray-400">
            {currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-purple-100">
          <div
            className="h-full rounded-full bg-purple-600 transition-all"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
            }}
          />
        </div>
      </div>

      <section className="rounded-2xl border border-purple-100 bg-purple-50/40 p-8">
        <p className="text-sm font-semibold text-purple-600">
          {currentQuestion.category}
        </p>

        <h2 className="mt-3 text-2xl font-bold leading-relaxed text-gray-900">
          {currentQuestion.question}
        </h2>
      </section>

      <section className="mt-8">
        <label
          htmlFor="answer"
          className="mb-3 block text-sm font-semibold text-gray-700"
        >
          Your Answer
        </label>

        <textarea
          id="answer"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Type your answer here..."
          rows={8}
          className="w-full rounded-2xl border-2 border-gray-200 p-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500"
        />

        <div className="mt-5 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Saving..."
              : currentQuestionIndex === questions.length - 1
                ? "Finish Interview"
                : "Submit & Next"}
          </button>
        </div>

        {message && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="font-semibold text-red-700">{message}</p>
          </div>
        )}
      </section>
    </>
  );
}
