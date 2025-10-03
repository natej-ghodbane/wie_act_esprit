import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { MarketplacesModule } from './marketplaces/marketplaces.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace',
      {
        dbName: process.env.DATABASE_NAME || 'agrihope',
      }
    ),
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    MarketplacesModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}