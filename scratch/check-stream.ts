import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { envVars } from "../src/app/config/env";

const google = createGoogleGenerativeAI({
  apiKey: envVars.GEMINI_API_KEY,
});

async function testStream() {
  try {
    const result = streamText({
      model: google("gemini-1.5-flash"),
      messages: [{ role: "user", content: "Hello" }],
    });

    for await (const chunk of result.textStream) {
      process.stdout.write(chunk);
    }
    console.log("\n✅ Stream completed successfully!");
  } catch (err: any) {
    console.error("\n❌ Failed stream:", err.message || err);
  }
}

testStream();
