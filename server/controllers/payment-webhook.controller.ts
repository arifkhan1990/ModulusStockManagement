
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import mongoose from "mongoose";
import Payment from "../models/payment.model";
import Order from "../models/order.model";
import { AppError } from "../utils/error";
import { successResponse } from "../utils/helpers";
import { billingService } from "../services/billing.service";
import config from "../config";

// Handle Stripe webhook events
export const stripeWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const signature = req.headers["stripe-signature"] as string;

  if (!signature) {
    return next(new AppError("Stripe signature missing", 400));
  }

  try {
    // Verify webhook signature
    const stripeWebhookSecret = config.stripe.webhookSecret;
    const event = verifyStripeSignature(req.body, signature, stripeWebhookSecret);

    // Handle specific Stripe events
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return 200 success response to Stripe
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return next(new AppError("Invalid signature", 400));
  }
};

// Handle PayPal webhook events
export const paypalWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const event = req.body;
    
    // Verify webhook authenticity (implement in production)
    // const verified = verifyPayPalWebhook(req.body, req.headers);
    // if (!verified) return next(new AppError("Invalid PayPal webhook signature", 400));

    // Handle specific PayPal events
    switch (event.event_type) {
      case "PAYMENT.CAPTURE.COMPLETED":
        await handlePayPalPaymentCompleted(event.resource);
        break;
      case "BILLING.SUBSCRIPTION.ACTIVATED":
        await handlePayPalSubscriptionActivated(event.resource);
        break;
      case "BILLING.SUBSCRIPTION.UPDATED":
        await handlePayPalSubscriptionUpdated(event.resource);
        break;
      case "BILLING.SUBSCRIPTION.CANCELLED":
        await handlePayPalSubscriptionCancelled(event.resource);
        break;
      default:
        console.log(`Unhandled PayPal event type: ${event.event_type}`);
    }

    // Return 200 success response to PayPal
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    return next(new AppError("PayPal webhook processing error", 400));
  }
};

// Helper functions for Stripe webhook event handling
function verifyStripeSignature(payload: any, signature: string, secret: string) {
  // This is a simplified implementation
  // In production, use the stripe library's webhook verification
  return JSON.parse(payload);
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Extract order ID from metadata
    const orderId = paymentIntent.metadata.orderId;
    if (!orderId) return;

    // Find order
    const order = await Order.findById(orderId);
    if (!order) return;

    // Create payment record
    await Payment.create([{
      orderId: order._id,
      companyId: order.companyId,
      amount: paymentIntent.amount / 100, // Stripe amount is in cents
      currency: paymentIntent.currency,
      paymentMethod: 'stripe',
      transactionId: paymentIntent.id,
      status: 'completed',
      paymentDate: new Date(),
      receiptUrl: paymentIntent.charges.data[0]?.receipt_url,
      metadata: {
        paymentIntentId: paymentIntent.id,
        stripeCustomerId: paymentIntent.customer,
      }
    }], { session });

    // Update order payment status
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
        updatedAt: new Date(),
      },
      { session },
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.error('Error handling payment intent succeeded:', error);
  } finally {
    session.endSession();
  }
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  try {
    // Update company subscription status
    if (invoice.subscription) {
      await billingService.handleSubscriptionPaymentSuccess(
        invoice.customer,
        invoice.subscription,
        invoice.id,
        invoice.amount_paid / 100
      );
    }
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  try {
    await billingService.syncSubscriptionStatus(
      subscription.customer,
      subscription.id,
      subscription.status,
      subscription.current_period_end * 1000 // Convert Unix timestamp to milliseconds
    );
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  try {
    await billingService.handleSubscriptionCancellation(
      subscription.customer,
      subscription.id
    );
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

// Helper functions for PayPal webhook event handling
async function handlePayPalPaymentCompleted(paymentResource: any) {
  // Implementation for PayPal payment completed event
  console.log('PayPal payment completed', paymentResource);
}

async function handlePayPalSubscriptionActivated(subscriptionResource: any) {
  // Implementation for PayPal subscription activated event
  console.log('PayPal subscription activated', subscriptionResource);
}

async function handlePayPalSubscriptionUpdated(subscriptionResource: any) {
  // Implementation for PayPal subscription updated event
  console.log('PayPal subscription updated', subscriptionResource);
}

async function handlePayPalSubscriptionCancelled(subscriptionResource: any) {
  // Implementation for PayPal subscription cancelled event
  console.log('PayPal subscription cancelled', subscriptionResource);
}

export default {
  stripeWebhook,
  paypalWebhook,
};
