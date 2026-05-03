import type { Request, Response } from 'express';
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, embed, convertToModelMessages } from "ai";
import { prisma } from "../../lib/prisma";
import { envVars } from "../../config/env";

const google = createGoogleGenerativeAI({
  apiKey: envVars.GEMINI_API_KEY || "",
});

// NEW CODE START

const SYSTEM_PROMPT = `
You are 'Faithy', the professional and friendly AI assistant for FaithBridge International Academy.

Your goal is to provide clear, structured, and helpful answers to students, parents, and visitors.

RESPONSE STYLE:
- Keep answers short, clear, and well-organized
- Use bullet points or small paragraphs when helpful
- Highlight important information (dates, fees, rules)

SMART BEHAVIOR:
- If the answer is clearly in the context → answer directly
- If partially related → combine context + general helpful knowledge
- If not in context → do NOT just refuse:
  - Give a helpful suggestion
  - Then mention exact info may not be available

EXAMPLES:
- If user asks "Is this school good?"
  → Mention curriculum, teachers, facilities
  → Then suggest contacting or visiting school

- If user asks "Contact number?"
  → Say it's not available
  → Suggest contacting school office

TONE:
- Friendly, helpful, and human-like
- Not robotic or overly formal

AVOID:
- Saying "I can only provide info based on context"
- Long robotic paragraphs
- Repeating the same lines

IMPORTANT:
- Always try to be helpful even if full data is not available
`;

export const ChatController = {
  handleChat: async (req: Request, res: Response) => {
    try {
      const { messages } = req.body;

      console.log("Received Messages:", JSON.stringify(messages, null, 2));

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Messages array is required" });
      }


      const lastMessage = messages[messages.length - 1];

      const question =
        lastMessage.content ||
        (lastMessage.parts
          ? lastMessage.parts
            .filter((p: any) => p.type === "text")
            .map((p: any) => p.text)
            .join("")
          : "");

      if (!question || question.trim() === "") {
        console.error("Question is empty!");
        return res.status(400).json({ error: "Question cannot be empty" });
      }

      // ✅ শেষ ১০টা message নিন (token বাঁচাবে)
      const recentMessages = messages.slice(-10);

      // 1. Generate embedding
      const { embedding } = await embed({
        model: google.embedding("gemini-embedding-001"),
        value: question,
      });

      const embeddingString = `[${embedding.join(",")}]`;

      // 2. Vector search (RAG)
      const contextResults = await prisma.$queryRawUnsafe<any[]>(
        `SELECT content FROM ai_knowledge ORDER BY embedding <=> $1::vector LIMIT 3`,
        embeddingString
      );

      const context = contextResults.map((r) => r.content).join("\n\n");

      // Convert messages
      const modelMessages = await convertToModelMessages(recentMessages);

      // 3. Generate smart response
      const result = streamText({
        model: google("gemini-2.5-flash-lite"),

        // UPDATED SYSTEM PROMPT
        system: `
${SYSTEM_PROMPT}

Context:
${context}
`,

        messages: modelMessages,

      });

      // 4. Stream response
      result.pipeTextStreamToResponse(res);

    } catch (error: any) {
      console.error("Chat API Error:", error.message || error);

      // ✅ 429 Rate limit handle
      if (error.status === 429 || error?.statusCode === 429) {
        if (!res.headersSent) {
          return res.status(429).json({
            error: "অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন, আবার চেষ্টা করুন।",
          });
        }
        return res.end();
      }

      if (!res.headersSent) {
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.end();
      }
    }
  },
};