import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class StockMonitorService {
  private readonly logger = new Logger(StockMonitorService.name);

  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async checkLowStockProducts() {
    this.logger.log('Starting low stock check...');
    
    try {
      // Find products that are low stock or out of stock
      const lowStockProducts = await this.productModel
        .find({
          isActive: true,
          enableLowStockAlerts: true,
          $expr: { $lte: ['$inventory', '$lowStockThreshold'] }
        })
        .lean();

      this.logger.log(`Found ${lowStockProducts.length} products with low or no stock`);

      // Check if we've already sent notifications recently (within 24 hours)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      for (const product of lowStockProducts) {
        // Check if we already sent a notification for this product recently
        const recentNotifications = await this.notificationsService['notificationModel']
          .find({
            userId: product.vendorId,
            productId: product._id,
            type: product.inventory === 0 ? 'out_of_stock' : 'low_stock',
            createdAt: { $gte: oneDayAgo }
          })
          .lean();

        if (recentNotifications.length === 0) {
          // No recent notification, send one now
          if (product.inventory === 0) {
            await this.notificationsService.createOutOfStockAlert(
              product.vendorId.toString(),
              product._id.toString(),
              product.title
            );
            this.logger.log(`Sent out-of-stock alert for product: ${product.title}`);
          } else {
            await this.notificationsService.createLowStockAlert(
              product.vendorId.toString(),
              product._id.toString(),
              product.title,
              product.inventory,
              product.lowStockThreshold
            );
            this.logger.log(`Sent low-stock alert for product: ${product.title} (${product.inventory} left)`);
          }
        }
      }

      this.logger.log('Low stock check completed');
    } catch (error) {
      this.logger.error('Error during low stock check:', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendDailyInventoryReport() {
    this.logger.log('Generating daily inventory reports...');
    
    try {
      // Get all vendors with products
      const vendors = await this.productModel
        .distinct('vendorId')
        .lean();

      for (const vendorId of vendors) {
        const vendorProducts = await this.productModel
          .find({ vendorId, isActive: true })
          .lean();

        if (vendorProducts.length === 0) continue;

        const totalProducts = vendorProducts.length;
        const totalInventory = vendorProducts.reduce((sum, p) => sum + p.inventory, 0);
        const lowStockProducts = vendorProducts.filter(p => 
          p.enableLowStockAlerts && p.inventory <= p.lowStockThreshold
        ).length;
        const outOfStockProducts = vendorProducts.filter(p => p.inventory === 0).length;

        // Only send report if there are issues or it's been a week since last report
        if (lowStockProducts > 0 || outOfStockProducts > 0) {
          await this.notificationsService.createNotification({
            userId: vendorId.toString(),
            title: '📊 Daily Inventory Summary',
            message: `You have ${totalProducts} products with ${totalInventory} total items. ${lowStockProducts} items need restocking and ${outOfStockProducts} are out of stock.`,
            type: 'general',
            priority: lowStockProducts > 0 || outOfStockProducts > 0 ? 'warning' : 'info',
            actionUrl: '/vendor/products',
            metadata: {
              totalProducts,
              totalInventory,
              lowStockProducts,
              outOfStockProducts,
              reportDate: new Date().toISOString()
            }
          });

          this.logger.log(`Sent inventory report to vendor: ${vendorId}`);
        }
      }

      this.logger.log('Daily inventory reports completed');
    } catch (error) {
      this.logger.error('Error generating inventory reports:', error);
    }
  }

  // Manual trigger for testing
  async triggerStockCheck() {
    this.logger.log('Manual stock check triggered');
    await this.checkLowStockProducts();
  }

  async triggerInventoryReport() {
    this.logger.log('Manual inventory report triggered');
    await this.sendDailyInventoryReport();
  }
}