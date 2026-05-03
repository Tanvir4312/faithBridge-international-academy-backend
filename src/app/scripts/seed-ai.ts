
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from 'uuid';
import "dotenv/config";
import { envVars } from "../config/env";
import { prisma } from "../lib/prisma";

const GEMINI_API_KEY = envVars.GEMINI_API_KEY || "";

const contents = [
  // Admission তথ্য
  'Admission for all classes at FaithBridge International Academy starts from December 25 and continues until December 30 every year.',
  'Students must complete admission within the official window from December 25 to December 30.',
  'The admission fee for new students is 1500 BDT.',

  // Rules
  'FaithBridge International Academy does not accept any admission outside the official admission period.',

  // Classes
  'The school offers education from Playgroup to Class 10 (SSC level).',

  // Teachers
  'Teachers at FaithBridge International Academy are highly qualified, including graduates from the University of Dhaka and international institutions.',
  'The school maintains a student-teacher ratio of 1:20 to ensure better attention for each student.',

  // Curriculum
  'The curriculum includes Bangla, English, Mathematics, Science, Islamic Studies, and Arabic language.',
  'The school focuses on both academic excellence and moral development.',

  // Facilities
  'FaithBridge International Academy has computer labs and science labs for practical learning.',
  'Students get opportunities for hands-on learning through lab activities.',
  'Transport facility is also available for students.',
  'Hostel facility is available for students.',
  'the school has a big playground',


  // Contact / Support (IMPORTANT ADD)
  'The contact number of FaithBridge International Academy is 01832408877, 01303806705, 01882006102.',
  'You can call the school at 01832408877 or 01303806705 for any information.',
  'School contact phone numbers are 01832408877, 01303806705, and 01882006102.',
  'For contact, call: 01832408877.',
  'If you need to contact the school, you can dial 01303806705.',
  'school email is [faithBridgeAcademy24@gmail.com]',
  'school email id is [support@faithbridge.com]',
  'school email address is [info@faithbridge.edu]',




  // General helpful info
  'FaithBridge International Academy aims to provide a balanced education combining modern subjects and Islamic values.',
  'Parents are encouraged to visit the school campus to learn more about facilities and environment.'
];

async function seedAi() {
  if (!GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is not set in .env");
    console.log("Please add GEMINI_API_KEY to your .env file before running this script.");
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  // Using text-embedding-004 which is the latest stable embedding model from Google
  const model = genAI.getGenerativeModel({ model: "models/gemini-embedding-001" });

  console.log("🚀 Seeding AI knowledge base...");

  await prisma.$executeRaw`TRUNCATE TABLE ai_knowledge`;
  console.log("🗑️ Old data cleared successfully.");

  for (const content of contents) {
    try {
      console.log(`- Generating embedding for: "${content}"`);
      const result = await model.embedContent(content);
      const embedding = result.embedding.values;

      // PostgreSQL pgvector expects the format '[0.1, 0.2, 0.3]'
      const embeddingString = `[${embedding.join(",")}]`;

      // We use $executeRawUnsafe because $executeRaw with parameterized arrays 
      // doesn't always play nice with the 'vector' type cast in Prisma yet.
      await prisma.$executeRawUnsafe(
        `INSERT INTO ai_knowledge (id, content, embedding) VALUES ($1, $2, $3::vector)`,
        uuidv4(),
        content,
        embeddingString
      );

      console.log("  ✅ Inserted successfully.");
    } catch (error) {
      console.error(`  ❌ Error inserting "${content}":`, error);
    }
  }

  console.log("✨ Seeding completed!");
  await prisma.$disconnect();
}

seedAi().catch(async (e) => {
  console.error("💥 Critical error during seeding:", e);
  await prisma.$disconnect();
  process.exit(1);
});
