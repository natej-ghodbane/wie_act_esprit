# Stripe Webhook Setup Guide

## Current Configuration

- **Backend URL**: `https://wie-act-esprit-pr72.vercel.app`
- **Webhook Secret**: `whsec_wl6kpiqit4F1vR4AX9sfyBbuGrC7m6NB`
- **Correct Webhook URL**: `https://wie-act-esprit-pr72.vercel.app/api/payments/webhook`

## Steps to Fix

### 1. Update Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Find your webhook endpoint
3. **Update the URL** to: `https://wie-act-esprit-pr72.vercel.app/api/payments/webhook`
4. **Update the secret** to: `whsec_wl6kpiqit4F1vR4AX9sfyBbuGrC7m6NB`

### 2. Update Backend Environment Variables

In your **backend** Vercel project, update the environment variable:

```
STRIPE_WEBHOOK_SECRET=whsec_wl6kpiqit4F1vR4AX9sfyBbuGrC7m6NB
```

### 3. Events to Listen For

Make sure your Stripe webhook is configured to listen for these events:
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

### 4. Test the Webhook

You can test the webhook using the test endpoint in your backend:
```
POST https://wie-act-esprit-pr72.vercel.app/api/payments/test-webhook
```

## Why This Fixes the Issue

- **Frontend** (`wie-act-esprit.vercel.app`) handles the UI and user interactions
- **Backend** (`wie-act-esprit-pr72.vercel.app`) handles the API, database, and webhooks
- Stripe webhooks should point to your backend API, not your frontend

## Current Backend Webhook Handler

Your backend already has a webhook handler at `/api/payments/webhook` that:
- Verifies the Stripe signature
- Handles `checkout.session.completed` events
- Updates order status to 'paid'
- Creates notifications

## Next Steps

1. Update the webhook URL in Stripe Dashboard
2. Update the webhook secret in your backend Vercel environment variables
3. Test a payment to verify the webhook works
4. Check your backend logs to see webhook events being received
