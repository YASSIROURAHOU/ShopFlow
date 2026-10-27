import { loadStripe } from '@stripe/stripe-js';

// Clé publiable de test Stripe (commence par pk_test_...)
export const stripePromise = loadStripe('pk_test_51MockKeyShopFlowDevOnly001');