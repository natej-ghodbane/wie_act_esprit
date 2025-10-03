import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

interface CreateCheckoutDto {
  items: { id: string; name: string; price: number; quantity: number }[];
  successUrl?: string;
  cancelUrl?: string;
  customerEmail?: string;
}

@Injectable()
export class PaymentsService {
  private stripe: Stripe | null = null;
  constructor(private readonly config: ConfigService) {}

  private getStripe(): Stripe {
    if (this.stripe) return this.stripe;
    const apiKey = this.config.get<string>('STRIPE_SECRET_KEY');
    if (!apiKey) {
      throw new BadRequestException('Stripe is not configured. Missing STRIPE_SECRET_KEY');
    }
    this.stripe = new Stripe(apiKey, { apiVersion: '2024-06-20' as any });
    return this.stripe;
  }

  async createCheckoutSession(payload: CreateCheckoutDto) {
    const stripe = this.getStripe();

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = payload.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.name,
          metadata: { productId: String(item.id) },
        },
      },
    }));

    const success_url = payload.successUrl || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/buyer/checkout?status=success`;
    const cancel_url = payload.cancelUrl || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/buyer/checkout?status=cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url,
      cancel_url,
      customer_email: payload.customerEmail,
    });

    return session;
  }
}


