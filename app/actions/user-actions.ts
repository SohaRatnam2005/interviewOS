"use server";

import { prisma } from "@/lib/prisma";

export async function createUser(name: string, email: string) {
   const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return {
      success: false,
      message: "User already exists",
    };
  }
  const user = await prisma.user.create({
    data: {
      name,
      email,
    },
  });

  return user;
}