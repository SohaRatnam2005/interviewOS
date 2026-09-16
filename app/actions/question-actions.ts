"use server";

import { prisma } from "@/lib/prisma";

export async function createQuestion(
  interviewId: string,
  question: string,
  category: string,
  order: number
) {
  try {
    const newQuestion = await prisma.interviewQuestion.create({
      data: {
        interviewId,
        question,
        category,
        order,
      },
    });

    return {
      success: true,
      question: newQuestion,
    };
  } catch (error) {
    console.error("Error creating question:", error);

    return {
      success: false,
      message: "Failed to create question.",
    };
  }
}