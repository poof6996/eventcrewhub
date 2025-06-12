import Stripe from 'stripe';

// We get the secret key from our .env file
const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;

export const stripe = new Stripe(stripeSecretKey, {
  // Use a recent, stable API version
  apiVersion: '2025-05-28.basil',
});