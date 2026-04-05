import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  NODE_ENV: string;
  ACCES_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRESIN: string;
  REFRESH_TOKEN_EXPIRESIN: string;
  EMAIL_SENDER: {
    SMTP_USER: string;
    SMTP_PASS: string;
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_FROM: string;
  };
  GOOGLE_CLIEN_ID: string;
  GOOGLE_CLIEN_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  FRONTEND_URL: string;
  STRIPE: {
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_KEY: string;
  };
}

const loadEnvVariables = (): EnvConfig => {
  const requireEnvVariables = [
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "NODE_ENV",
    "ACCES_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRESIN",
    "REFRESH_TOKEN_EXPIRESIN",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",
    "GOOGLE_CLIEN_ID",
    "GOOGLE_CLIEN_SECRET",
    "GOOGLE_CALLBACK_URL",
    "FRONTEND_URL",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_KEY",
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
    REFRESH_TOKEN_EXPIRESIN: process.env.REFRESH_TOKEN_EXPIRESIN as string,
    EMAIL_SENDER: {
      SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER as string,
      SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS as string,
      SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST as string,
      SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT as string,
      SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM as string,
    },
    GOOGLE_CLIEN_ID: process.env.GOOGLE_CLIEN_ID as string,
    GOOGLE_CLIEN_SECRET: process.env.GOOGLE_CLIEN_SECRET as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    STRIPE: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
      STRIPE_WEBHOOK_KEY: process.env.STRIPE_WEBHOOK_KEY as string,
    },
  };
};

export const envVars = loadEnvVariables();
