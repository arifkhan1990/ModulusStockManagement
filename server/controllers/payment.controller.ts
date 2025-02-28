import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Payment from "../models/payment.model";
import Order from "../models/order.model";
import { AppError } from "../utils/error";
import { successResponse } from "../utils/helpers";

// Create a new payment
export const createPayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const companyId = req.company._id;

    // Validate order exists
    const order = await Order.findOne({
      _id: req.body.orderId,
      companyId,
    });

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    // Create the payment
    const paymentData = {
      ...req.body,
      companyId,
      orderNumber: order.orderNumber,
      createdBy: req.user._id,
    };

    const payment = await Payment.create([paymentData], { session });

    // Update order payment status
    // Get total payments for this order including the new one
    const totalPayments = await Payment.aggregate([
      {
        $match: {
          orderId: new mongoose.Types.ObjectId(order._id.toString()),
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalPaid = totalPayments.length ? totalPayments[0].total : 0;

    let paymentStatus = "pending";
    if (totalPaid >= order.total) {
      paymentStatus = "paid";
    } else if (totalPaid > 0) {
      paymentStatus = "partially_paid";
    }

    await Order.findByIdAndUpdate(
      order._id,
      {
        paymentStatus,
        updatedBy: req.user._id,
        updatedAt: new Date(),
      },
      { session },
    );

    await session.commitTransaction();

    res
      .status(201)
      .json(successResponse("Payment created successfully", payment[0]));
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// Get all payments for a company
export const getPayments = async (
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

    // Filter by payment method if provided
    if (req.query.paymentMethod) {
      queryObj.paymentMethod = req.query.paymentMethod;
    }

    // Filter by order id if provided
    if (req.query.orderId) {
      queryObj.orderId = req.query.orderId;
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      queryObj.paymentDate = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string),
      };
    }

    // Search by order number or transaction id
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, "i");
      queryObj.$or = [
        { orderNumber: searchRegex },
        { transactionId: searchRegex },
      ];
    }

    // Get total count
    const total = await Payment.countDocuments(queryObj);

    // Get payments with pagination
    const payments = await Payment.find(queryObj)
      .populate("orderId", "orderNumber orderStatus")
      .sort({ paymentDate: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(
      successResponse("Payments retrieved successfully", {
        payments,
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

// Get a single payment
export const getPayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid payment ID", 400));
    }

    const payment = await Payment.findOne({ _id: id, companyId }).populate(
      "orderId",
      "orderNumber orderStatus customerName total",
    );

    if (!payment) {
      return next(new AppError("Payment not found", 404));
    }

    res
      .status(200)
      .json(successResponse("Payment retrieved successfully", payment));
  } catch (error) {
    next(error);
  }
};

// Update a payment
export const updatePayment = async (
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
      return next(new AppError("Invalid payment ID", 400));
    }

    // Get current payment
    const existingPayment = await Payment.findOne({ _id: id, companyId });

    if (!existingPayment) {
      return next(new AppError("Payment not found", 404));
    }

    // Only allow updating specific fields
    const allowedUpdates = [
      "status",
      "transactionId",
      "notes",
      "receiptUrl",
      "metadata",
    ];

    const updates: any = {};

    // Filter only allowed fields
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Add updater info and timestamp
    updates.updatedBy = req.user._id;
    updates.updatedAt = new Date();

    const payment = await Payment.findOneAndUpdate(
      { _id: id, companyId },
      updates,
      { new: true, session, runValidators: true },
    );

    // If status changed, update order payment status
    if (req.body.status && req.body.status !== existingPayment.status) {
      // Get all completed payments for this order
      const totalPayments = await Payment.aggregate([
        {
          $match: {
            orderId: existingPayment.orderId,
            status: "completed",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      const order = await Order.findById(existingPayment.orderId);

      if (order) {
        const totalPaid = totalPayments.length ? totalPayments[0].total : 0;

        let paymentStatus = "pending";
        if (totalPaid >= order.total) {
          paymentStatus = "paid";
        } else if (totalPaid > 0) {
          paymentStatus = "partially_paid";
        }

        await Order.findByIdAndUpdate(
          order._id,
          {
            paymentStatus,
            updatedBy: req.user._id,
            updatedAt: new Date(),
          },
          { session },
        );
      }
    }

    await session.commitTransaction();

    res
      .status(200)
      .json(successResponse("Payment updated successfully", payment));
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// Get payment statistics
export const getPaymentStatistics = async (
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

    // Get totals by payment method
    const paymentMethodTotals = await Payment.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId.toString()),
          paymentDate: { $gte: startDate, $lte: endDate },
          status: "completed",
        },
      },
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { amount: -1 } },
    ]);

    // Get daily payment data
    const dailyPayments = await Payment.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId.toString()),
          paymentDate: { $gte: startDate, $lte: endDate },
          status: "completed",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$paymentDate" } },
          count: { $sum: 1 },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json(
      successResponse("Payment statistics retrieved successfully", {
        paymentMethodTotals,
        dailyPayments,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export default {
  createPayment,
  getPayments,
  getPayment,
  updatePayment,
  getPaymentStatistics,
};
