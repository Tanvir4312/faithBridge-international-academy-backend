import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { envVars } from "../src/app/config/env";

const google = createGoogleGenerativeAI({
  apiKey: envVars.GEMINI_API_KEY,
});

async function testMethods() {
  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: [{ role: "user", content: "Hi" }],
  });

  console.log(Object.keys(result));

  // Check for pipe methods
  console.log("pipeDataStreamToResponse?", typeof (result as any).pipeDataStreamToResponse);
  console.log("pipeTextStreamToResponse?", typeof (result as any).pipeTextStreamToResponse);
}

testMethods();
