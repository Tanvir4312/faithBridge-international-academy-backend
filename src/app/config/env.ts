import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  NODE_ENV: string;
}

const loadEnvVariables  = () : EnvConfig =>{
  const requireEnvVariables = [
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "NODE_ENV",
  
  ];

  requireEnvVariables.forEach((envVariable) => {
    if (!process.env[envVariable]) {
      throw new Error(`Missing env variable ${envVariable}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    NODE_ENV: process.env.NODE_ENV as string
  };
};

export const envVars = loadEnvVariables();
