
import { Request, Response } from 'express';
import Payment from '../models/payment.model.ts';
import Order from '../models/order.model.ts';
import mongoose from 'mongoose';

// Create a new payment
export const createPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, amount, paymentMethod, transactionId, notes, metadata } = req.body;

    // Validate order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create new payment
    const payment = new Payment({
      orderId,
      orderNumber: order.orderNumber,
      amount,
      paymentMethod,
      transactionId,
      notes,
      metadata,
      status: 'completed', // Default to completed for manual payments
      paymentDate: new Date(),
      businessSize: req.user?.businessSize || 'small',
      businessType: req.user?.businessType,
      createdBy: req.user?._id
    });

    await payment.save();

    // Update order payment status
    const orderPayments = await Payment.find({ 
      orderId: order._id, 
      status: 'completed' 
    });
    
    const totalPaid = orderPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    let paymentStatus = 'pending';
    if (totalPaid >= order.total) {
      paymentStatus = 'paid';
    } else if (totalPaid > 0) {
      paymentStatus = 'partially paid';
    }
    
    await Order.findByIdAndUpdate(orderId, { paymentStatus });

    return res.status(201).json(payment);
  } catch (error) {
    console.error('Error creating payment:', error);
    return res.status(500).json({ message: 'Failed to create payment', error });
  }
};

// Get all payments
export const getPayments = async (req: Request, res: Response) => {
  try {
    const { orderId, status, method, startDate, endDate, page = 1, limit = 20 } = req.query;
    
    const query: any = {};
    
    if (orderId) query.orderId = new mongoose.Types.ObjectId(orderId as string);
    if (status) query.status = status;
    if (method) query.paymentMethod = method;
    
    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) query.paymentDate.$gte = new Date(startDate as string);
      if (endDate) query.paymentDate.$lte = new Date(endDate as string);
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const payments = await Payment.find(query)
      .sort({ paymentDate: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('orderId', 'orderNumber customerName total')
      .populate('createdBy', 'name');
      
    const total = await Payment.countDocuments(query);
    
    return res.status(200).json({
      payments,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return res.status(500).json({ message: 'Failed to fetch payments', error });
  }
};

// Get payment by ID
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('orderId')
      .populate('createdBy', 'name');
      
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    return res.status(200).json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    return res.status(500).json({ message: 'Failed to fetch payment', error });
  }
};

// Update payment status (for refunds, etc.)
export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body;
    
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    payment.status = status;
    if (notes) payment.notes = notes;
    payment.updatedBy = req.user?._id;
    
    await payment.save();
    
    // Update order payment status
    const order = await Order.findById(payment.orderId);
    if (order) {
      const orderPayments = await Payment.find({ 
        orderId: order._id, 
        status: 'completed' 
      });
      
      const totalPaid = orderPayments.reduce((sum, p) => sum + p.amount, 0);
      
      let paymentStatus = 'pending';
      if (totalPaid >= order.total) {
        paymentStatus = 'paid';
      } else if (totalPaid > 0) {
        paymentStatus = 'partially paid';
      }
      
      await Order.findByIdAndUpdate(payment.orderId, { paymentStatus });
    }
    
    return res.status(200).json(payment);
  } catch (error) {
    console.error('Error updating payment:', error);
    return res.status(500).json({ message: 'Failed to update payment', error });
  }
};

// Process a stripe payment
export const processStripePayment = async (req: Request, res: Response) => {
  try {
    // This would require Stripe integration
    // For now, we'll return a placeholder message
    return res.status(200).json({ 
      message: 'Stripe payment processing would go here',
      implementationNote: 'This requires integrating with Stripe API'
    });
  } catch (error) {
    console.error('Error processing Stripe payment:', error);
    return res.status(500).json({ message: 'Failed to process payment', error });
  }
};

// Process a bKash payment
export const processBkashPayment = async (req: Request, res: Response) => {
  try {
    // This would require bKash integration
    // For now, we'll return a placeholder message
    return res.status(200).json({ 
      message: 'bKash payment processing would go here',
      implementationNote: 'This requires integrating with bKash API'
    });
  } catch (error) {
    console.error('Error processing bKash payment:', error);
    return res.status(500).json({ message: 'Failed to process payment', error });
  }
};
