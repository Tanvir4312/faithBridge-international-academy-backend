import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  NODE_ENV: string;
  ACCES_TOKEN_SECRET: string
  REFRESH_TOKEN_SECRET: string
  ACCESS_TOKEN_EXPIRESIN: string
  REFRESH_TOKEN_EXPIRESIN: string
}

const loadEnvVariables  = () : EnvConfig =>{
  const requireEnvVariables = [
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "NODE_ENV",
    "ACCES_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRESIN",
    "REFRESH_TOKEN_EXPIRESIN"
  
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
    NODE_ENV: process.env.NODE_ENV as string,
    ACCES_TOKEN_SECRET: process.env.ACCES_TOKEN_SECRET as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
    ACCESS_TOKEN_EXPIRESIN: process.env.ACCESS_TOKEN_EXPIRESIN as string,
    REFRESH_TOKEN_EXPIRESIN: process.env.REFRESH_TOKEN_EXPIRESIN as string
  };
};

export const envVars = loadEnvVariables();
