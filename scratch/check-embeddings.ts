import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { embed } from "ai";
import { envVars } from "../src/app/config/env";

const google = createGoogleGenerativeAI({
  apiKey: envVars.GEMINI_API_KEY,
});

async function testEmbedding(modelName: string) {
  try {
    const { embedding } = await embed({
      model: google.embedding(modelName),
      value: "hello world",
    });
    // console.log(`✅ Success for ${modelName}: generated ${embedding.length} dimensions`);
  } catch (err: any) {
    console.error(`❌ Failed for ${modelName}:`, err.message || err);
  }
}

async function main() {
  await testEmbedding("text-embedding-004");
  await testEmbedding("gemini-embedding-001");
  await testEmbedding("models/text-embedding-004");
  await testEmbedding("models/gemini-embedding-001");
}

main();
