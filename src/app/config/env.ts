import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
}

const loadEnvVariables  = () : EnvConfig =>{
  const requireEnvVariables = ["PORT"];

  requireEnvVariables.forEach((envVariable) => {
    if (!process.env[envVariable]) {
      throw new Error(`Missing env variable ${envVariable}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
  };
};

export const envVars = loadEnvVariables();
