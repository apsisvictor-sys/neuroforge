const requiredEnv = ["SESSION_SECRET", "CSRF_SECRET"] as const;

export type Env = {
  SESSION_SECRET: string;
  CSRF_SECRET: string;
  OPENAI_API_KEY?: string;
  APP_URL?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_PRICE_PREMIUM_MONTHLY?: string;
  STRIPE_PRICE_PREMIUM_ANNUAL?: string;
  STRIPE_PRICE_PRO_MONTHLY?: string;
};

export function getEnv(): Env {
  for (const key of requiredEnv) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return {
    SESSION_SECRET: process.env.SESSION_SECRET as string,
    CSRF_SECRET: process.env.CSRF_SECRET as string,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    APP_URL: process.env.APP_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRICE_PREMIUM_MONTHLY: process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
    STRIPE_PRICE_PREMIUM_ANNUAL: process.env.STRIPE_PRICE_PREMIUM_ANNUAL,
    STRIPE_PRICE_PRO_MONTHLY: process.env.STRIPE_PRICE_PRO_MONTHLY
  };
}
