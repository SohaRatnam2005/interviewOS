"use server";

import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateInterviewQuestions(
  role: string,
  type: string,
  difficulty: string,
) {
  const prompt = `
Generate exactly 10 interview questions for the following interview.

Role: ${role}
Interview Type: ${type}
Difficulty: ${difficulty}

The questions should be relevant to the role and interview type.
Do not include answers.
Keep the questions clear and suitable for an actual interview.
Make all 10 questions different from each other.
Return exactly 10 questions.
`;

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    max_completion_tokens: 4096,

    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],

    response_format: {
      type: "json_schema",
      json_schema: {
        name: "interview_questions",
        strict: true,
        schema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              minItems: 10,
              maxItems: 10,
              items: {
                type: "object",
                properties: {
                  question: {
                    type: "string",
                  },
                  category: {
                    type: "string",
                  },
                  order: {
                    type: "integer",
                  },
                },
                required: ["question", "category", "order"],
                additionalProperties: false,
              },
            },
          },
          required: ["questions"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No response received from Groq.");
  }

  const result = JSON.parse(content);

  if (result.questions.length !== 10) {
    throw new Error(
      `Expected 10 questions, but Groq generated ${result.questions.length}.`,
    );
  }

  return result;
}

export async function generateAndSaveQuestions(interviewId: string) {
  const interview = await prisma.interview.findUnique({
    where: {
      id: interviewId,
    },
  });

  if (!interview) {
    throw new Error("Interview not found.");
  }

  const existingQuestions = await prisma.interviewQuestion.count({
    where: {
      interviewId,
    },
  });

  if (existingQuestions > 0) {
    return {
      success: true,
      message: "Questions already exist for this interview.",
    };
  }

  const result = await generateInterviewQuestions(
    interview.role,
    interview.type,
    interview.difficulty,
  );

  const questions = await prisma.$transaction(
    result.questions.map(
      (
        item: {
          question: string;
          category: string;
          order: number;
        },
        index: number,
      ) =>
        prisma.interviewQuestion.create({
          data: {
            interviewId,
            question: item.question,
            category: item.category,
            order: index + 1,
          },
        }),
    ),
  );

  return {
    success: true,
    message: "AI questions generated and saved successfully.",
    questions,
  };
}