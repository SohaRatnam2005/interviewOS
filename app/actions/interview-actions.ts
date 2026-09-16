"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { generateAndSaveQuestions } from "./ai-actions";
import { evaluateInterview } from "./evaluation-actions";
import { auth } from "@/auth";

export async function createInterview(
  type: string,
  role: string,
  difficulty: string,
) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false as const,
      message: "You must be logged in to create an interview.",
    };
  }

  const userId = session.user.id;

  try {
    const interview = await prisma.interview.create({
      data: {
        userId,
        type,
        role,
        difficulty,
      },
    });

    await generateAndSaveQuestions(interview.id);
    revalidatePath("/");

    return {
      success: true as const,
      interview,
    };
  } catch (error) {
    console.error("Error creating interview:", error);

    return {
      success: false as const,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create interview.",
    };
  }
}

export async function completeInterview(interviewId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to complete an interview.",
      };
    }

    const interview = await prisma.interview.findFirst({
      where: {
        id: interviewId,
        userId: session.user.id,
      },
    });

    if (!interview) {
      return {
        success: false,
        message: "Interview not found.",
      };
    }

    const evaluation = await evaluateInterview(interviewId);

    if (!evaluation.success) {
      return {
        success: false,
        message: evaluation.message,
      };
    }

    const updatedInterview = await prisma.interview.update({
      where: {
        id: interviewId,
      },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    revalidatePath(`/interview/${interviewId}`);
    revalidatePath(`/interview/${interviewId}/result`);
    revalidatePath("/");

    return {
      success: true,
      message: "Interview completed successfully.",
      interview: updatedInterview,
    };
  } catch (error) {
    console.error("Error completing interview:", error);

    return {
      success: false,
      message: "Failed to evaluate and complete interview.",
    };
  }
}