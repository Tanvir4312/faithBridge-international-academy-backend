import { GoogleGenerativeAI } from "@google/generative-ai";
import { envVars } from "../src/app/config/env";

const genAI = new GoogleGenerativeAI(envVars.GEMINI_API_KEY!);

async function testListModels() {
  const models = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${envVars.GEMINI_API_KEY}`).then(res => res.json());
  console.log(models.models.map((m: any) => m.name).join('\n'));
}

testListModels();
