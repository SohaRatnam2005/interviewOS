"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function submitAnswer(
  questionId: string,
  response: string,
) {
  if (!response.trim()) {
    return {
      success: false,
      message: "Answer cannot be empty.",
    };
  }

  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to submit an answer.",
      };
    }

    const question = await prisma.interviewQuestion.findUnique({
      where: {
        id: questionId,
      },
      include: {
        interview: true,
      },
    });

    if (!question) {
      return {
        success: false,
        message: "Question not found.",
      };
    }

    if (question.interview.userId !== session.user.id) {
      return {
        success: false,
        message: "You are not allowed to answer this question.",
      };
    }

    const existingAnswer = await prisma.answer.findUnique({
      where: {
        questionId,
      },
    });

    if (existingAnswer) {
      const answer = await prisma.answer.update({
        where: {
          questionId,
        },
        data: {
          response,
        },
      });

      return {
        success: true,
        message: "Answer updated successfully!",
        answer,
      };
    }

    const answer = await prisma.answer.create({
      data: {
        questionId,
        response,
      },
    });

    return {
      success: true,
      message: "Answer submitted successfully!",
      answer,
    };
  } catch (error) {
    console.error("Error submitting answer:", error);

    return {
      success: false,
      message: "Something went wrong while saving your answer.",
    };
  }
}