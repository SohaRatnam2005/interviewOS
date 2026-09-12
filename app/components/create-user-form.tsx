"use client";

import { useActionState } from "react";
import { createUser } from "../actions/user-actions";

type State = {
  success: boolean;
  message: string;
};

const initialState: State = {
  success: false,
  message: "",
};

export default function CreateUserForm() {
  async function handleCreateUser(
    previousState: State,
    formData: FormData
  ): Promise<State> {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    const result = await createUser(name, email);

    if (!result.success) {
      return {
        success: false,
        message: result.message,
      };
    }

    return {
      success: true,
      message: "User created successfully!",
    };
  }

  const [state, formAction] = useActionState(
    handleCreateUser,
    initialState
  );

  return (
    <form
      action={formAction}
      className="mt-6 flex max-w-sm flex-col gap-4"
    >
      <input
        name="name"
        placeholder="Enter name"
        className="rounded border p-2"
      />

      <input
        name="email"
        type="email"
        placeholder="Enter email"
        className="rounded border p-2"
      />

      <button
        type="submit"
        className="rounded bg-black px-4 py-2 text-white"
      >
        Create User
      </button>

      {state.message && (
        <p>
          {state.success ? "✅ " : "❌ "}
          {state.message}
        </p>
      )}
    </form>
  );
}