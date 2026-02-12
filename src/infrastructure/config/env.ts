const requiredEnv = ["SESSION_SECRET"] as const;

export type Env = {
  SESSION_SECRET: string;
  OPENAI_API_KEY?: string;
  APP_URL?: string;
};

export function getEnv(): Env {
  for (const key of requiredEnv) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return {
    SESSION_SECRET: process.env.SESSION_SECRET as string,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    APP_URL: process.env.APP_URL
  };
}
