import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
    _stripe = new Stripe(key, { apiVersion: "2026-02-25.clover" });
  }
  return _stripe;
}

export const STRIPE_PRICES = {
  premiumMonthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY ?? "",
  premiumAnnual: process.env.STRIPE_PRICE_PREMIUM_ANNUAL ?? "",
  professionalMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? ""
} as const;

export const FREE_PROTOCOL_LIMIT = 5;
