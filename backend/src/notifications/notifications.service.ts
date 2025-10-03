import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) 
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async createNotification({
    userId,
    title,
    message,
    type = 'general',
    productId,
    priority = 'info',
    actionUrl,
    metadata
  }: {
    userId: string;
    title: string;
    message: string;
    type?: string;
    productId?: string;
    priority?: string;
    actionUrl?: string;
    metadata?: Record<string, any>;
  }) {
    const notification = new this.notificationModel({
      userId: new Types.ObjectId(userId),
      title,
      message,
      type,
      productId: productId ? new Types.ObjectId(productId) : undefined,
      priority,
      actionUrl,
      metadata,
    });

    return notification.save();
  }

  async getUserNotifications(userId: string, unreadOnly = false) {
    const query: any = { userId: new Types.ObjectId(userId) };
    if (unreadOnly) {
      query.isRead = false;
    }
    
    return this.notificationModel
      .find(query)
      .populate('productId', 'title')
      .sort({ createdAt: -1 })
      .lean();
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.notificationModel.updateOne(
      { 
        _id: new Types.ObjectId(notificationId), 
        userId: new Types.ObjectId(userId) 
      },
      { isRead: true }
    );
  }

  async markAllAsRead(userId: string) {
    return this.notificationModel.updateMany(
      { userId: new Types.ObjectId(userId) },
      { isRead: true }
    );
  }

  async deleteNotification(notificationId: string, userId: string): Promise<any> {
    return this.notificationModel.deleteOne({
      _id: new Types.ObjectId(notificationId),
      userId: new Types.ObjectId(userId)
    });
  }

  async createLowStockAlert(userId: string, productId: string, productTitle: string, currentQuantity: number, threshold: number) {
    return this.createNotification({
      userId,
      title: '⚠️ Low Stock Alert',
      message: `${productTitle} is running low. Only ${currentQuantity} items left (threshold: ${threshold}).`,
      type: 'low_stock',
      productId,
      priority: 'warning',
      actionUrl: `/vendor/products`,
      metadata: {
        currentQuantity,
        threshold,
        productTitle
      }
    });
  }

  async createOutOfStockAlert(userId: string, productId: string, productTitle: string) {
    return this.createNotification({
      userId,
      title: '🚨 Out of Stock',
      message: `${productTitle} is completely out of stock. Immediate restocking needed.`,
      type: 'out_of_stock',
      productId,
      priority: 'error',
      actionUrl: `/vendor/products`,
      metadata: {
        productTitle
      }
    });
  }

  async createRestockAlert(userId: string, productId: string, productTitle: string, newQuantity: number) {
    return this.createNotification({
      userId,
      title: '✅ Stock Restocked',
      message: `${productTitle} has been restocked. New quantity: ${newQuantity} items.`,
      type: 'restock',
      productId,
      priority: 'success',
      actionUrl: `/vendor/products`,
      metadata: {
        newQuantity,
        productTitle
      }
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({
      userId: new Types.ObjectId(userId),
      isRead: false
    });
  }
}