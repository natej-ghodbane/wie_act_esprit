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
  orderId?: string;
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
    
    // Store session ID in order if orderId is provided
    if (body.orderId && session.id) {
      try {
        await this.ordersService.updateSessionId(body.orderId, session.id);
        console.log('Session ID stored in order:', body.orderId, session.id);
      } catch (error) {
        console.error('Failed to store session ID in order:', error);
        // Don't fail the checkout if this fails
      }
    }
    
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

  @Post('test-payment-success')
  async testPaymentSuccess(@Body() body: { sessionId: string; customerEmail?: string }) {
    try {
      console.log('Testing payment success for session:', body.sessionId);
      
      // Simulate a successful payment by updating orders
      let orderUpdated = false;
      
      // Try to find order by session ID
      const orderBySession = await this.ordersService.updateStatusBySessionId(body.sessionId, 'paid');
      if (orderBySession) {
        console.log('Order updated by session ID:', orderBySession._id);
        orderUpdated = true;
      }
      
      // If no order found by session ID and customer email provided, try fallback
      if (!orderUpdated && body.customerEmail) {
        const orders = await this.ordersService.findAllByCustomerEmail(body.customerEmail);
        const pendingOrders = orders.filter(order => order.status === 'pending');
        
        if (pendingOrders.length > 0) {
          const mostRecentPending = pendingOrders[0];
          await this.ordersService.updateStatus(String(mostRecentPending._id), 'paid');
          console.log('Order updated by fallback method:', mostRecentPending._id);
          orderUpdated = true;
        }
      }
      
      return { 
        success: true, 
        orderUpdated,
        message: orderUpdated ? 'Order status updated to paid' : 'No pending orders found to update'
      };
    } catch (error) {
      console.error('Test payment success error:', error);
      throw new HttpException('Failed to test payment success', HttpStatus.INTERNAL_SERVER_ERROR);
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
    console.log('Body length:', req.body?.length || 0);
    
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET');
      return res.status(400).send('Webhook secret not configured');
    }

    if (!sig) {
      console.error('Missing stripe-signature header');
      return res.status(400).send('Missing stripe-signature header');
    }

    let event: Stripe.Event;

    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-09-30.clover',
      });
      
      // req.body should be a Buffer when using express.raw()
      const body = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body));
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
      console.log('Webhook event verified successfully:', event.type);
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
      console.log('Session payment status:', session.payment_status);
      console.log('Session amount total:', session.amount_total);
      
      try {
        let orderUpdated = false;
        
        // First try: Use orderId from metadata if available
        if (session.metadata?.orderId) {
          console.log('Updating order by metadata orderId:', session.metadata.orderId);
          const order = await this.ordersService.updateStatus(session.metadata.orderId, 'paid');
          if (order) {
            console.log('Order status updated to paid by metadata orderId:', order._id);
            orderUpdated = true;
          } else {
            console.log('No order found with metadata orderId:', session.metadata.orderId);
          }
        }
        
        // Second try: Find order by session ID
        if (!orderUpdated) {
          console.log('Trying to find order by session ID:', session.id);
          const orderBySession = await this.ordersService.updateStatusBySessionId(session.id, 'paid');
          
          if (orderBySession) {
            console.log('Order status updated to paid by session ID:', orderBySession._id);
            orderUpdated = true;
          } else {
            console.log('No order found with session ID:', session.id);
          }
        }
        
        // Fallback: find the most recent pending order for this customer
        if (!orderUpdated && session.customer_email) {
          console.log('No order found by session ID or metadata, trying fallback method');
          
          // Get all orders for this customer
          const orders = await this.ordersService.findAllByCustomerEmail(session.customer_email);
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
          console.error('Session details:', {
            id: session.id,
            customer_email: session.customer_email,
            metadata: session.metadata,
            payment_status: session.payment_status
          });
        } else {
          console.log('Successfully updated order status to paid for session:', session.id);
        }
      } catch (error) {
        console.error('Error updating order status:', error);
        console.error('Error stack:', error.stack);
        // Don't fail the webhook for order update errors
      }
    } else {
      console.log('Unhandled event type:', event.type);
    }

    res.status(200).json({ received: true });
  }
}