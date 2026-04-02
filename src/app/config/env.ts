import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DATABASE_URL: string;
}

const loadEnvVariables  = () : EnvConfig =>{
  const requireEnvVariables = [
    "PORT",
    "DATABASE_URL",
  
  ];

  requireEnvVariables.forEach((envVariable) => {
    if (!process.env[envVariable]) {
      throw new Error(`Missing env variable ${envVariable}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string
  };
};

export const envVars = loadEnvVariables();
