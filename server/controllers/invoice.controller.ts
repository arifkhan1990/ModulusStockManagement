
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Invoice from "../models/invoice.model";
import Order from "../models/order.model";
import Customer from "../models/customer.model";
import { AppError } from "../utils/error";
import { successResponse } from "../utils/helpers";
import SystemLog from "../models/system-log.model";

// Helper function to generate invoice number
const generateInvoiceNumber = async (companyId: string): Promise<string> => {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const prefix = `INV-${currentYear}${currentMonth}-`;
  
  // Find the last invoice number with this prefix
  const lastInvoice = await Invoice.findOne({ 
    companyId,
    invoiceNumber: new RegExp(`^${prefix}`)
  }).sort({ invoiceNumber: -1 });
  
  let nextNumber = 1;
  if (lastInvoice) {
    const lastNumber = parseInt(lastInvoice.invoiceNumber.split('-').pop() || '0');
    nextNumber = lastNumber + 1;
  }
  
  return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
};

// Helper function to log system activity
const logActivity = async (
  companyId: string, 
  userId: string, 
  action: string, 
  entityType: string, 
  entityId: string | null = null, 
  details: any = null,
  req: Request
) => {
  try {
    await SystemLog.create({
      companyId,
      action,
      entityType,
      entityId,
      userId,
      details,
      ipAddress: req.ip,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Create a new invoice
export const createInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const companyId = req.company._id;
    const invoiceData = { ...req.body };

    // Generate invoice number if not provided
    if (!invoiceData.invoiceNumber) {
      invoiceData.invoiceNumber = await generateInvoiceNumber(companyId.toString());
    }

    // Validate customer info
    if (invoiceData.customerInfo?.customerId) {
      const customer = await Customer.findById(invoiceData.customerInfo.customerId);
      if (customer) {
        // Populate customer info if not provided
        if (!invoiceData.customerInfo.name) {
          invoiceData.customerInfo.name = customer.name;
        }
        if (!invoiceData.customerInfo.email) {
          invoiceData.customerInfo.email = customer.email;
        }
        if (!invoiceData.customerInfo.phone) {
          invoiceData.customerInfo.phone = customer.phone;
        }
      }
    }

    // Set company and user info
    invoiceData.companyId = companyId;
    invoiceData.createdBy = req.user._id;
    
    // Create the invoice
    const invoice = await Invoice.create([invoiceData], { session });
    
    // Log activity
    await logActivity(
      companyId.toString(),
      req.user._id.toString(),
      'invoice_created',
      'Invoice',
      invoice[0]._id.toString(),
      { invoiceNumber: invoice[0].invoiceNumber },
      req
    );
    
    // If this is linked to an order, update the order
    if (invoiceData.orderId) {
      await Order.findByIdAndUpdate(
        invoiceData.orderId,
        { 
          invoiceId: invoice[0]._id,
          updatedBy: req.user._id,
          updatedAt: new Date()
        },
        { session }
      );
    }

    await session.commitTransaction();

    res
      .status(201)
      .json(successResponse("Invoice created successfully", invoice[0]));
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// Get all invoices for a company
export const getInvoices = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = req.company._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Build query based on filters
    const queryObj: any = { companyId };

    // Filter by status if provided
    if (req.query.status) {
      queryObj.status = req.query.status;
    }

    // Filter by payment status if provided
    if (req.query.paymentStatus) {
      queryObj.paymentStatus = req.query.paymentStatus;
    }

    // Filter by customer ID if provided
    if (req.query.customerId) {
      queryObj['customerInfo.customerId'] = req.query.customerId;
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      queryObj.issueDate = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string),
      };
    }

    // Filter by due date
    if (req.query.dueBefore) {
      queryObj.dueDate = { $lte: new Date(req.query.dueBefore as string) };
    }

    if (req.query.dueAfter) {
      queryObj.dueDate = { 
        ...queryObj.dueDate,
        $gte: new Date(req.query.dueAfter as string) 
      };
    }

    // Search by invoice number or customer name
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      queryObj.$or = [
        { invoiceNumber: searchRegex },
        { 'customerInfo.name': searchRegex },
        { 'customerInfo.email': searchRegex }
      ];
    }

    // Get total count
    const total = await Invoice.countDocuments(queryObj);

    // Get invoices with pagination
    const invoices = await Invoice.find(queryObj)
      .populate('customerInfo.customerId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(
      successResponse("Invoices retrieved successfully", {
        invoices,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      }),
    );
  } catch (error) {
    next(error);
  }
};

// Get a single invoice
export const getInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid invoice ID", 400));
    }

    const invoice = await Invoice.findOne({ _id: id, companyId })
      .populate('customerInfo.customerId', 'name email phone address')
      .populate('orderId', 'orderNumber status')
      .populate('createdBy', 'name email');

    if (!invoice) {
      return next(new AppError("Invoice not found", 404));
    }

    res
      .status(200)
      .json(successResponse("Invoice retrieved successfully", invoice));
  } catch (error) {
    next(error);
  }
};

// Update an invoice
export const updateInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const companyId = req.company._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid invoice ID", 400));
    }

    // Exclude fields that shouldn't be updated directly
    const { invoiceNumber, companyId: _, createdBy, createdAt, ...updateData } = req.body;

    // Add updater info
    updateData.updatedBy = req.user._id;
    updateData.updatedAt = new Date();

    const invoice = await Invoice.findOneAndUpdate(
      { _id: id, companyId },
      updateData,
      { new: true, session, runValidators: true }
    ).populate('customerInfo.customerId', 'name email phone');

    if (!invoice) {
      return next(new AppError("Invoice not found", 404));
    }

    // Log activity
    await logActivity(
      companyId.toString(),
      req.user._id.toString(),
      'invoice_updated',
      'Invoice',
      invoice._id.toString(),
      { invoiceNumber: invoice.invoiceNumber },
      req
    );

    await session.commitTransaction();

    res
      .status(200)
      .json(successResponse("Invoice updated successfully", invoice));
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// Mark invoice as sent
export const markInvoiceAsSent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid invoice ID", 400));
    }

    const invoice = await Invoice.findOneAndUpdate(
      { _id: id, companyId },
      { 
        status: 'sent',
        updatedBy: req.user._id,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!invoice) {
      return next(new AppError("Invoice not found", 404));
    }

    // Log activity
    await logActivity(
      companyId.toString(),
      req.user._id.toString(),
      'invoice_sent',
      'Invoice',
      invoice._id.toString(),
      { invoiceNumber: invoice.invoiceNumber },
      req
    );

    res
      .status(200)
      .json(successResponse("Invoice marked as sent", invoice));
  } catch (error) {
    next(error);
  }
};

// Add payment to invoice
export const addInvoicePayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const companyId = req.company._id;
    const { amount, method, reference, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid invoice ID", 400));
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return next(new AppError("Valid payment amount is required", 400));
    }

    if (!method) {
      return next(new AppError("Payment method is required", 400));
    }

    // Get the invoice
    const invoice = await Invoice.findOne({ _id: id, companyId });

    if (!invoice) {
      return next(new AppError("Invoice not found", 404));
    }

    // Create the payment record
    const paymentRecord = {
      amount,
      method,
      date: new Date(),
      reference,
      notes
    };

    // Update the invoice with the payment
    const updatedInvoice = await Invoice.findOneAndUpdate(
      { _id: id, companyId },
      { 
        $push: { paymentHistory: paymentRecord },
        updatedBy: req.user._id,
        updatedAt: new Date()
      },
      { new: true, session }
    );

    // Calculate total paid amount
    const totalPaid = updatedInvoice!.paymentHistory.reduce(
      (sum, payment) => sum + payment.amount, 0
    );

    // Update payment status
    let paymentStatus = 'unpaid';
    let status = updatedInvoice!.status;

    if (totalPaid >= updatedInvoice!.total) {
      paymentStatus = 'paid';
      status = 'paid';
    } else if (totalPaid > 0) {
      paymentStatus = 'partially_paid';
      status = 'partially_paid';
    }

    // Update the payment status
    const finalInvoice = await Invoice.findOneAndUpdate(
      { _id: id, companyId },
      { 
        paymentStatus,
        status,
        updatedBy: req.user._id,
        updatedAt: new Date()
      },
      { new: true, session }
    );

    // Log activity
    await logActivity(
      companyId.toString(),
      req.user._id.toString(),
      'invoice_payment_added',
      'Invoice',
      id,
      { 
        invoiceNumber: finalInvoice!.invoiceNumber,
        amount,
        method,
        paymentStatus
      },
      req
    );

    await session.commitTransaction();

    res
      .status(200)
      .json(successResponse("Payment added to invoice", finalInvoice));
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// Cancel an invoice
export const cancelInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    const { cancellationReason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid invoice ID", 400));
    }

    const invoice = await Invoice.findOneAndUpdate(
      { _id: id, companyId },
      { 
        status: 'canceled',
        notes: cancellationReason ? `${invoice?.notes || ''}\n\nCancellation Reason: ${cancellationReason}` : invoice?.notes,
        updatedBy: req.user._id,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!invoice) {
      return next(new AppError("Invoice not found", 404));
    }

    // Log activity
    await logActivity(
      companyId.toString(),
      req.user._id.toString(),
      'invoice_canceled',
      'Invoice',
      invoice._id.toString(),
      { 
        invoiceNumber: invoice.invoiceNumber,
        reason: cancellationReason
      },
      req
    );

    res
      .status(200)
      .json(successResponse("Invoice canceled successfully", invoice));
  } catch (error) {
    next(error);
  }
};

// Get invoice statistics
export const getInvoiceStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

    // Get count by status
    const statusCounts = await Invoice.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId.toString()),
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          total: { $sum: "$total" },
        },
      },
    ]);

    // Get count by payment status
    const paymentStatusCounts = await Invoice.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId.toString()),
        },
      },
      {
        $group: {
          _id: "$paymentStatus",
          count: { $sum: 1 },
          total: { $sum: "$total" },
        },
      },
    ]);

    // Get daily invoice data
    const dailyInvoices = await Invoice.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId.toString()),
          issueDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$issueDate" } },
          count: { $sum: 1 },
          total: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get overdue invoice total
    const currentDate = new Date();
    const overdueInvoices = await Invoice.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId.toString()),
          dueDate: { $lt: currentDate },
          status: { $nin: ['paid', 'canceled'] },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          total: { $sum: "$total" },
        },
      },
    ]);

    const overdueTotal = overdueInvoices.length ? overdueInvoices[0] : { count: 0, total: 0 };

    res.status(200).json(
      successResponse("Invoice statistics retrieved successfully", {
        statusCounts,
        paymentStatusCounts,
        dailyInvoices,
        overdueInvoices: {
          count: overdueTotal.count,
          total: overdueTotal.total,
        },
      }),
    );
  } catch (error) {
    next(error);
  }
};

export default {
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoice,
  markInvoiceAsSent,
  addInvoicePayment,
  cancelInvoice,
  getInvoiceStatistics,
};
