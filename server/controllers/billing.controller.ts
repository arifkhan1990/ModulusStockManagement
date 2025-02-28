
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Company from "../models/company.model";
import SubscriptionTier from "../models/subscription-tier.model";
import { AppError } from "../utils/error";
import { successResponse } from "../utils/helpers";
import { billingService } from "../services/billing.service";

// Process subscription payment
export const processSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { companyId, tierId, paymentMethod, billingCycle } = req.body;

    // Validate subscription tier exists
    const tier = await SubscriptionTier.findById(tierId);
    if (!tier) {
      return next(new AppError("Subscription tier not found", 404));
    }

    // Validate company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return next(new AppError("Company not found", 404));
    }

    // Process payment with billing service
    const result = await billingService.createSubscription(
      company,
      tier,
      billingCycle,
      paymentMethod
    );

    res
      .status(200)
      .json(successResponse("Subscription processed successfully", result));
  } catch (error) {
    next(error);
  }
};

// Update subscription
export const updateSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { companyId } = req.params;
    const { tierId, billingCycle } = req.body;

    // Validate subscription tier exists
    const tier = await SubscriptionTier.findById(tierId);
    if (!tier) {
      return next(new AppError("Subscription tier not found", 404));
    }

    // Validate company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return next(new AppError("Company not found", 404));
    }

    // Update subscription
    const result = await billingService.updateSubscription(
      company,
      tier,
      billingCycle
    );

    res
      .status(200)
      .json(successResponse("Subscription updated successfully", result));
  } catch (error) {
    next(error);
  }
};

// Cancel subscription
export const cancelSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { companyId } = req.params;
    const { reason } = req.body;

    // Validate company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return next(new AppError("Company not found", 404));
    }

    // Cancel subscription
    const result = await billingService.cancelSubscription(company, reason);

    res
      .status(200)
      .json(successResponse("Subscription cancelled successfully", result));
  } catch (error) {
    next(error);
  }
};

// Get subscription details
export const getSubscriptionDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = req.company._id;

    // Get subscription details
    const subscription = await billingService.getSubscriptionDetails(companyId);

    res
      .status(200)
      .json(successResponse("Subscription details retrieved successfully", subscription));
  } catch (error) {
    next(error);
  }
};

// Get billing history
export const getBillingHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = req.company._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Get billing history
    const history = await billingService.getBillingHistory(companyId, page, limit);

    res
      .status(200)
      .json(successResponse("Billing history retrieved successfully", history));
  } catch (error) {
    next(error);
  }
};

export default {
  processSubscription,
  updateSubscription,
  cancelSubscription,
  getSubscriptionDetails,
  getBillingHistory,
};
