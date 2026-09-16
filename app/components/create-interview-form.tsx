"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { createInterview } from "../actions/interview-actions";

type State = {
  success: boolean;
  message: string;
};

const initialState: State = {
  success: false,
  message: "",
};


function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "✨ Generating Interview..." : "Create Interview"}
    </button>
  );
}

export default function CreateInterviewForm() {
  const router = useRouter();

  async function handleCreateInterview(
    previousState: State,
    formData: FormData,
  ): Promise<State> {
    const role = formData.get("role") as string;
    const type = formData.get("type") as string;
    const difficulty = formData.get("difficulty") as string;

    const result = await createInterview(
      type,
      role,
      difficulty,
    );

    if (!result.success) {
      return {
        success: false,
        message: result.message ?? "Failed to create interview.",
      };
    }

    router.push(`/interview/${result.interview.id}/session`);

    return {
      success: true,
      message: "Interview created and AI questions generated!",
    };
  }

  const [state, formAction] = useActionState(
    handleCreateInterview,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="mt-6 flex max-w-sm flex-col gap-4"
    >
      <input
        name="role"
        placeholder="e.g. Java Developer"
        required
        className="rounded-xl border-2 border-purple-200 p-3 text-gray-900 outline-none transition focus:border-purple-500"
      />

      <select
        name="type"
        required
        defaultValue=""
        className="rounded-xl border-2 border-purple-200 p-3 text-gray-700 outline-none transition focus:border-purple-500"
      >
        <option value="" disabled>
          Select interview type
        </option>
        <option value="Technical">Technical</option>
        <option value="HR">HR</option>
        <option value="Behavioral">Behavioral</option>
      </select>

      <select
        name="difficulty"
        required
        defaultValue=""
        className="rounded-xl border-2 border-purple-200 p-3 text-gray-700 outline-none transition focus:border-purple-500"
      >
        <option value="" disabled>
          Select difficulty
        </option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <SubmitButton />

      {state.message && (
        <p
          className={`text-sm font-medium ${
            state.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {state.success ? "✅ " : "❌ "}
          {state.message}
        </p>
      )}
    </form>
  );
}