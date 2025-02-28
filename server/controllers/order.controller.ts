
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Order from '../models/order.model';
import Inventory from '../models/inventory.model';
import Product from '../models/product.model';
import { AppError } from '../utils/error';
import { successResponse } from '../utils/helpers';

// Create a new order
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const companyId = req.company._id;
    const orderData = {
      ...req.body,
      companyId,
      createdBy: req.user._id
    };
    
    // Validate inventory availability for each item
    for (const item of orderData.items) {
      const inventory = await Inventory.findOne({
        companyId,
        productId: item.productId,
        locationId: item.locationId
      });
      
      if (!inventory || inventory.availableQuantity < item.quantity) {
        throw new AppError(`Insufficient inventory for product ${item.sku} at the selected location`, 400);
      }
    }
    
    // Create the order
    const order = await Order.create([orderData], { session });
    
    // Update inventory for each item
    const bulkOps = orderData.items.map(item => ({
      updateOne: {
        filter: {
          companyId,
          productId: item.productId,
          locationId: item.locationId
        },
        update: {
          $inc: {
            quantity: -item.quantity,
            availableQuantity: -item.quantity
          }
        }
      }
    }));
    
    await Inventory.bulkWrite(bulkOps, { session });
    
    await session.commitTransaction();
    
    res.status(201).json(successResponse('Order created successfully', order[0]));
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// Get all orders for a company
export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.company._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    // Build query based on filters
    const queryObj: any = { companyId };
    
    // Filter by status if provided
    if (req.query.orderStatus) {
      queryObj.orderStatus = req.query.orderStatus;
    }
    
    // Filter by payment status if provided
    if (req.query.paymentStatus) {
      queryObj.paymentStatus = req.query.paymentStatus;
    }
    
    // Filter by customer if provided
    if (req.query.customerId) {
      queryObj.customerId = req.query.customerId;
    }
    
    // Filter by location if provided
    if (req.query.locationId) {
      queryObj.locationId = req.query.locationId;
    }
    
    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      queryObj.orderDate = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string)
      };
    }
    
    // Search by order number or customer name
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      queryObj.$or = [
        { orderNumber: searchRegex },
        { customerName: searchRegex }
      ];
    }
    
    // Get total count
    const total = await Order.countDocuments(queryObj);
    
    // Get orders with pagination
    const orders = await Order.find(queryObj)
      .populate('customerId', 'name email phone')
      .populate('locationId', 'name type')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.status(200).json(successResponse('Orders retrieved successfully', {
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }));
  } catch (error) {
    next(error);
  }
};

// Get a single order
export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid order ID', 400));
    }
    
    const order = await Order.findOne({ _id: id, companyId })
      .populate('customerId', 'name email phone company')
      .populate('locationId', 'name type')
      .populate('salesRepId', 'name email')
      .populate('createdBy', 'name email');
    
    if (!order) {
      return next(new AppError('Order not found', 404));
    }
    
    res.status(200).json(successResponse('Order retrieved successfully', order));
  } catch (error) {
    next(error);
  }
};

// Update an order
export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid order ID', 400));
    }
    
    // Get current order
    const existingOrder = await Order.findOne({ _id: id, companyId });
    
    if (!existingOrder) {
      return next(new AppError('Order not found', 404));
    }
    
    // Prevent updating if order is already completed/delivered/cancelled
    if (['delivered', 'cancelled', 'returned'].includes(existingOrder.orderStatus)) {
      return next(new AppError(`Cannot update an order that is ${existingOrder.orderStatus}`, 400));
    }
    
    // Only allow updating specific fields, not the entire order
    const allowedUpdates = [
      'orderStatus', 'paymentStatus', 'paymentMethod', 'paymentReference',
      'shippingMethod', 'trackingNumber', 'carrier', 'notes', 'shippedDate',
      'deliveryDate', 'tags'
    ];
    
    const updates: any = {};
    
    // Filter only allowed fields
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });
    
    // Add updater info and timestamp
    updates.updatedBy = req.user._id;
    updates.updatedAt = new Date();
    
    const order = await Order.findOneAndUpdate(
      { _id: id, companyId },
      updates,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(successResponse('Order updated successfully', order));
  } catch (error) {
    next(error);
  }
};

// Cancel an order and restore inventory
export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid order ID', 400));
    }
    
    // Get current order
    const order = await Order.findOne({ _id: id, companyId });
    
    if (!order) {
      return next(new AppError('Order not found', 404));
    }
    
    // Prevent cancelling if order is delivered
    if (order.orderStatus === 'delivered') {
      return next(new AppError('Cannot cancel an order that has been delivered', 400));
    }
    
    // Prevent cancelling if already cancelled
    if (order.orderStatus === 'cancelled') {
      return next(new AppError('Order is already cancelled', 400));
    }
    
    // Update order status
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: id, companyId },
      { 
        orderStatus: 'cancelled',
        updatedBy: req.user._id,
        updatedAt: new Date()
      },
      { new: true, session }
    );
    
    // Restore inventory for each item
    const bulkOps = order.items.map(item => ({
      updateOne: {
        filter: {
          companyId,
          productId: item.productId,
          locationId: item.locationId
        },
        update: {
          $inc: {
            quantity: item.quantity,
            availableQuantity: item.quantity
          }
        }
      }
    }));
    
    await Inventory.bulkWrite(bulkOps, { session });
    
    await session.commitTransaction();
    
    res.status(200).json(successResponse('Order cancelled successfully', updatedOrder));
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// Get order statistics
export const getOrderStatistics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.company._id;
    
    // Default date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    // Override dates if provided
    if (req.query.startDate) {
      startDate.setTime(new Date(req.query.startDate as string).getTime());
    }
    
    if (req.query.endDate) {
      endDate.setTime(new Date(req.query.endDate as string).getTime());
    }
    
    // Get counts by status
    const statusCounts = await Order.aggregate([
      { $match: { 
        companyId: new mongoose.Types.ObjectId(companyId.toString()),
        orderDate: { $gte: startDate, $lte: endDate }
      }},
      { $group: { 
        _id: '$orderStatus', 
        count: { $sum: 1 },
        revenue: { $sum: '$total' }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    // Get total orders and revenue
    const totalStats = await Order.aggregate([
      { $match: { 
        companyId: new mongoose.Types.ObjectId(companyId.toString()),
        orderDate: { $gte: startDate, $lte: endDate }
      }},
      { $group: { 
        _id: null, 
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' }
      }}
    ]);
    
    // Get daily sales data
    const dailySales = await Order.aggregate([
      { $match: { 
        companyId: new mongoose.Types.ObjectId(companyId.toString()),
        orderDate: { $gte: startDate, $lte: endDate },
        orderStatus: { $ne: 'cancelled' }
      }},
      { $group: { 
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$orderDate' } },
        orders: { $sum: 1 },
        revenue: { $sum: '$total' }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json(successResponse('Order statistics retrieved successfully', {
      statusCounts,
      totals: totalStats[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 },
      dailySales
    }));
  } catch (error) {
    next(error);
  }
};

export default {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  cancelOrder,
  getOrderStatistics
};
