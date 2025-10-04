import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

interface CreateCheckoutDto {
  items: { id: string; name: string; price: number; quantity: number }[];
  successUrl?: string;
  cancelUrl?: string;
  customerEmail?: string;
  orderId?: string;
}

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('STRIPE_SECRET_KEY');
    if (!apiKey) {
      throw new BadRequestException('Stripe is not configured. Missing STRIPE_SECRET_KEY');
    }

    // Initialize Stripe once in the constructor
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2025-09-30.clover',
    });
  }

  async createCheckoutSession(payload: CreateCheckoutDto) {
    try {
      console.log('Creating checkout session with payload:', JSON.stringify(payload, null, 2));
      
      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = payload.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(item.price * 100), // Stripe expects cents
          product_data: {
            name: item.name,
            metadata: { productId: String(item.id) },
          },
        },
      }));

      const frontendUrl = this.config.get<string>('FRONTEND_URL') || 'https://wie-act-esprit.vercel.app';
      const success_url = payload.successUrl || `${frontendUrl}/buyer/checkout?status=success`;
      const cancel_url = payload.cancelUrl || `${frontendUrl}/buyer/checkout?status=cancel`;

      console.log('Frontend URL:', frontendUrl);
      console.log('Success URL:', success_url);
      console.log('Cancel URL:', cancel_url);

      const session = await this.stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'], // explicitly set
        line_items,
        success_url,
        cancel_url,
        customer_email: payload.customerEmail,
        metadata: {
          orderId: payload.orderId || '', // Pass order ID if available
        },
      });

      console.log('Checkout session created successfully:', session.id);
      return session;
    } catch (err) {
      console.error('Stripe Checkout Session Error:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      throw new InternalServerErrorException('Failed to create checkout session');
    }
  }
}
