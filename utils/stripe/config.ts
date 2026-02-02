import Stripe from 'stripe';

export const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY ?? 'sk_test_mock_key',
    {
        // https://github.com/stripe/stripe-node#configuration
        // Use the latest supported version
        // Use the latest supported version
        apiVersion: '2026-01-28.clover' as any,
        // Register this as a Stripe App: https://stripe.com/docs/development/quickstart#register-app
        appInfo: {
            name: 'Tax App SaaS',
            version: '0.1.0'
        }
    }
);
