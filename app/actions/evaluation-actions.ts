"use server";

import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function evaluateAnswer(question: string, response: string) {
  const prompt = `
You are an interview evaluator.

Evaluate the candidate's answer to the interview question below.

Question:
${question}

Candidate's Answer:
${response}

Evaluate based on:
- Correctness
- Relevance
- Clarity
- Technical understanding

Give a score from 0 to 100.

Provide concise feedback explaining what was done well
and what could be improved.
`;

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",

    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],

    response_format: {
      type: "json_schema",
      json_schema: {
        name: "answer_evaluation",
        strict: true,
        schema: {
          type: "object",
          properties: {
            score: {
              type: "number",
            },
            feedback: {
              type: "string",
            },
          },
          required: ["score", "feedback"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No evaluation received from Groq.");
  }

  return JSON.parse(content);
}
export async function evaluateSavedAnswer(answerId: string) {
  const answer = await prisma.answer.findUnique({
    where: {
      id: answerId,
    },
    include: {
      question: true,
    },
  });

  if (!answer) {
    throw new Error("Answer not found.");
  }

  const evaluation = await evaluateAnswer(
    answer.question.question,
    answer.response,
  );

  const updatedAnswer = await prisma.answer.update({
    where: {
      id: answerId,
    },
    data: {
      score: evaluation.score,
      feedback: evaluation.feedback,
    },
  });

  return {
    success: true,
    answer: updatedAnswer,
  };
}
async function generateOverallFeedback(
  answers: {
    question: string;
    response: string;
    score: number;
    feedback: string;
  }[],
) {
  const prompt = `
You are an interview performance analyst.

Analyze the candidate's complete interview performance.

${answers
  .map(
    (answer, index) => `
Question ${index + 1}:
${answer.question}

Candidate Answer:
${answer.response}

Score:
${answer.score}/10

Feedback:
${answer.feedback}
`,
  )
  .join("\n")}

Provide:
1. The candidate's main strengths.
2. The candidate's main weaknesses.
3. A practical recommendation for improvement.

Keep each section concise and useful.
`;

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",

    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],

    response_format: {
      type: "json_schema",
      json_schema: {
        name: "overall_feedback",
        strict: true,
        schema: {
          type: "object",
          properties: {
            strengths: {
              type: "string",
            },
            weaknesses: {
              type: "string",
            },
            recommendation: {
              type: "string",
            },
          },
          required: ["strengths", "weaknesses", "recommendation"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No overall feedback received from Groq.");
  }

  return JSON.parse(content);
}

export async function evaluateInterview(interviewId: string) {
  const answers = await prisma.answer.findMany({
    where: {
      question: {
        interviewId,
      },
    },
    include: {
      question: true,
    },
    orderBy: {
      question: {
        order: "asc",
      },
    },
  });

  if (answers.length === 0) {
    throw new Error("No answers found for this interview.");
  }

  for (const answer of answers) {
    const evaluation = await evaluateAnswer(
      answer.question.question,
      answer.response,
    );

    await prisma.answer.update({
      where: {
        id: answer.id,
      },
      data: {
        score: evaluation.score,
        feedback: evaluation.feedback,
      },
    });
  }

  const evaluatedAnswers = await prisma.answer.findMany({
    where: {
      question: {
        interviewId,
      },
    },
    include: {
      question: true,
    },
  });

  const totalScore = evaluatedAnswers.reduce(
    (sum, answer) => sum + (answer.score ?? 0),
    0,
  );

  const overallScore = totalScore / evaluatedAnswers.length;
  const feedback = await generateOverallFeedback(
    evaluatedAnswers.map((answer) => ({
      question: answer.question.question,
      response: answer.response,
      score: answer.score ?? 0,
      feedback: answer.feedback ?? "",
    })),
  );
  await prisma.interviewResult.upsert({
    where: {
      interviewId,
    },
    update: {
      overallScore,
      strengths: feedback.strengths,
      weaknesses: feedback.weaknesses,
      recommendation: feedback.recommendation,
    },
    create: {
      interviewId,
      overallScore,
      strengths: feedback.strengths,
      weaknesses: feedback.weaknesses,
      recommendation: feedback.recommendation,
    },
  });
  return {
    success: true,
    message: "Interview evaluated successfully.",
    overallScore,
  };
}
