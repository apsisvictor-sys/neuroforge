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
  professionalMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? "",
  giftPremium1M: process.env.STRIPE_GIFT_PREMIUM_1M_PRICE_ID ?? "",
  giftPremium3M: process.env.STRIPE_GIFT_PREMIUM_3M_PRICE_ID ?? "",
  giftPremium6M: process.env.STRIPE_GIFT_PREMIUM_6M_PRICE_ID ?? "",
  giftPremium12M: process.env.STRIPE_GIFT_PREMIUM_12M_PRICE_ID ?? "",
} as const;

// Maps a gift price ID to how many months of premium it grants
export const GIFT_PRICE_DURATION_MONTHS: Record<string, number> = {
  [process.env.STRIPE_GIFT_PREMIUM_1M_PRICE_ID ?? ""]: 1,
  [process.env.STRIPE_GIFT_PREMIUM_3M_PRICE_ID ?? ""]: 3,
  [process.env.STRIPE_GIFT_PREMIUM_6M_PRICE_ID ?? ""]: 6,
  [process.env.STRIPE_GIFT_PREMIUM_12M_PRICE_ID ?? ""]: 12,
};

export const FREE_PROTOCOL_LIMIT = 5;
