import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { StockMonitorService } from './stock-monitor.service';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema }
    ]),
    NotificationsModule,
  ],
  providers: [StockMonitorService],
  exports: [StockMonitorService],
})
export class StockMonitorModule {}