"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function signup(
  name: string,
  email: string,
  password: string,
) {
  if (!name || !email || !password) {
    return {
      success: false,
      message: "All fields are required.",
    };
  }

  if (password.length < 6) {
    return {
      success: false,
      message: "Password must be at least 6 characters.",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return {
      success: false,
      message: "An account with this email already exists.",
    };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });

  return {
    success: true,
    message: "Account created successfully.",
  };
}