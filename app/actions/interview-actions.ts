"use server";

import { prisma } from "@/lib/prisma";

export async function createInterview(
  userId: string,
  type: string,
  role: string,
  difficulty: string
) {
  const interview = await prisma.interview.create({
    data: {
      userId,
      type,
      role,
      difficulty,
    },
  });

  return {
    success: true,
    interview,
  };
}