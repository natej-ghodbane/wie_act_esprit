import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

interface CreateCheckoutDto {
  items: { id: string; name: string; price: number; quantity: number }[];
  successUrl?: string;
  cancelUrl?: string;
  customerEmail?: string;
}

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout')
  async createCheckout(@Body() body: CreateCheckoutDto) {
    if (!Array.isArray(body.items) || body.items.length === 0) {
      throw new HttpException('No items to checkout', HttpStatus.BAD_REQUEST);
    }
    const session = await this.paymentsService.createCheckoutSession(body);
    return { id: session.id, url: session.url };
  }
}



