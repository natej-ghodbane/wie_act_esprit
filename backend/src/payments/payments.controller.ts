import { Body, Controller, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';
import { Request, Response } from 'express';
import Stripe from 'stripe';

interface CreateCheckoutDto {
  items: { id: string; name: string; price: number; quantity: number }[];
  successUrl?: string;
  cancelUrl?: string;
  customerEmail?: string;
}

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly ordersService: OrdersService
  ) {}

  @Post('checkout')
  async createCheckout(@Body() body: CreateCheckoutDto) {
    if (!Array.isArray(body.items) || body.items.length === 0) {
      throw new HttpException('No items to checkout', HttpStatus.BAD_REQUEST);
    }
    const session = await this.paymentsService.createCheckoutSession(body);
    return { id: session.id, url: session.url };
  }

  @Post('test-webhook')
  async testWebhook(@Body() body: { orderId: string }) {
    try {
      const result = await this.ordersService.updateStatus(body.orderId, 'paid');
      return { success: true, order: result };
    } catch (error) {
      console.error('Test webhook error:', error);
      throw new HttpException('Failed to update order status', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('mark-all-paid')
  async markAllOrdersPaid(@Req() req: any) {
    try {
      // Get all pending orders for the user
      const orders = await this.ordersService.findAllByBuyer(req.user._id || req.user.id);
      const pendingOrders = orders.filter(order => order.status === 'pending');
      
      // Update all pending orders to paid
      for (const order of pendingOrders) {
        await this.ordersService.updateStatus(String(order._id), 'paid');
      }
      
      return { 
        success: true, 
        message: `Updated ${pendingOrders.length} orders to paid status`,
        updatedCount: pendingOrders.length
      };
    } catch (error) {
      console.error('Mark all paid error:', error);
      throw new HttpException('Failed to update orders', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    console.log('=== WEBHOOK RECEIVED ===');
    console.log('Headers:', req.headers);
    console.log('Body type:', typeof req.body);
    console.log('Body keys:', Object.keys(req.body || {}));
    
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET');
      return res.status(400).send('Webhook secret not configured');
    }

    let event: Stripe.Event;

    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-09-30.clover',
      });
      
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).send('Webhook signature verification failed');
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Payment succeeded for session:', session.id);
      console.log('Session customer email:', session.customer_email);
      console.log('Session metadata:', session.metadata);
      
      try {
        let orderUpdated = false;
        
        // First try: Use orderId from metadata if available
        if (session.metadata?.orderId) {
          console.log('Updating order by metadata orderId:', session.metadata.orderId);
          const order = await this.ordersService.updateStatus(session.metadata.orderId, 'paid');
          if (order) {
            console.log('Order status updated to paid by metadata orderId:', order._id);
            orderUpdated = true;
          }
        }
        
        // Second try: Find order by session ID
        if (!orderUpdated) {
          console.log('Trying to find order by session ID:', session.id);
          const orderBySession = await this.ordersService.updateStatusBySessionId(session.id, 'paid');
          
          if (orderBySession) {
            console.log('Order status updated to paid by session ID:', orderBySession._id);
            orderUpdated = true;
          }
        }
        
        // Fallback: find the most recent pending order for this customer
        if (!orderUpdated) {
          console.log('No order found by session ID or metadata, trying fallback method');
          
          // Get all orders for this customer
          const orders = await this.ordersService.findAllByBuyer(session.customer_email || '');
          console.log('Found orders for customer:', orders.length);
          
          // Find the most recent pending order
          const pendingOrders = orders.filter(order => order.status === 'pending');
          console.log('Pending orders found:', pendingOrders.length);
          
          if (pendingOrders.length > 0) {
            // Update the most recent pending order
            const mostRecentPending = pendingOrders[0]; // They're sorted by createdAt desc
            await this.ordersService.updateStatus(String(mostRecentPending._id), 'paid');
            console.log('Order status updated to paid (fallback):', mostRecentPending._id);
            orderUpdated = true;
          } else {
            console.log('No pending orders found for customer:', session.customer_email);
          }
        }
        
        if (!orderUpdated) {
          console.error('Failed to update any order for session:', session.id);
        }
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    }

    res.json({ received: true });
  }
}