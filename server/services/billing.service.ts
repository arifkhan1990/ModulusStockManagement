
import mongoose from "mongoose";
import Company from "../models/company.model";
import SubscriptionTier from "../models/subscription-tier.model";
import { AppError } from "../utils/error";

// Interface for billing service result
interface BillingResult {
  success: boolean;
  message: string;
  data?: any;
}

// Interface for subscription details
interface SubscriptionDetails {
  id: string;
  status: string;
  tier: any;
  currentPeriodEnd: Date;
  billingCycle: string;
  paymentMethod: string;
}

// Billing service class
class BillingService {
  /**
   * Create a new subscription
   */
  async createSubscription(
    company: any,
    tier: any,
    billingCycle: string,
    paymentMethod: string
  ): Promise<BillingResult> {
    try {
      // Get pricing based on billing cycle
      const price = billingCycle === 'yearly' ? tier.price.yearly : tier.price.monthly;
      
      // Initialize payment provider here (Stripe/PayPal/etc.)
      // This is a simplified implementation
      
      // Update company subscription
      await Company.findByIdAndUpdate(company._id, {
        subscription: {
          tierId: tier._id,
          status: 'active',
          billingCycle,
          currentPeriodStart: new Date(),
          currentPeriodEnd: this.calculatePeriodEnd(new Date(), billingCycle),
          paymentMethod,
          price
        },
        updatedAt: new Date()
      });
      
      return {
        success: true,
        message: "Subscription created successfully",
        data: {
          tierId: tier._id,
          tierName: tier.name,
          billingCycle,
          price
        }
      };
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw new AppError("Failed to create subscription", 500);
    }
  }
  
  /**
   * Update existing subscription
   */
  async updateSubscription(
    company: any,
    newTier: any,
    billingCycle: string
  ): Promise<BillingResult> {
    try {
      if (!company.subscription) {
        throw new AppError("No active subscription found", 400);
      }
      
      // Get pricing based on billing cycle
      const price = billingCycle === 'yearly' ? newTier.price.yearly : newTier.price.monthly;
      
      // Handle payment provider subscription update
      // This is a simplified implementation
      
      // Update company subscription
      await Company.findByIdAndUpdate(company._id, {
        'subscription.tierId': newTier._id,
        'subscription.billingCycle': billingCycle,
        'subscription.price': price,
        updatedAt: new Date()
      });
      
      return {
        success: true,
        message: "Subscription updated successfully",
        data: {
          tierId: newTier._id,
          tierName: newTier.name,
          billingCycle,
          price
        }
      };
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw new AppError("Failed to update subscription", 500);
    }
  }
  
  /**
   * Cancel subscription
   */
  async cancelSubscription(
    company: any,
    reason: string
  ): Promise<BillingResult> {
    try {
      if (!company.subscription) {
        throw new AppError("No active subscription found", 400);
      }
      
      // Handle payment provider subscription cancellation
      // This is a simplified implementation
      
      // Update company subscription
      await Company.findByIdAndUpdate(company._id, {
        'subscription.status': 'cancelled',
        'subscription.cancelReason': reason,
        'subscription.cancelledAt': new Date(),
        updatedAt: new Date()
      });
      
      return {
        success: true,
        message: "Subscription cancelled successfully"
      };
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      throw new AppError("Failed to cancel subscription", 500);
    }
  }
  
  /**
   * Get subscription details
   */
  async getSubscriptionDetails(
    companyId: mongoose.Types.ObjectId
  ): Promise<SubscriptionDetails> {
    try {
      const company = await Company.findById(companyId)
        .populate('subscription.tierId')
        .select('subscription');
      
      if (!company || !company.subscription) {
        throw new AppError("No subscription found", 404);
      }
      
      return {
        id: company.subscription._id.toString(),
        status: company.subscription.status,
        tier: company.subscription.tierId,
        currentPeriodEnd: company.subscription.currentPeriodEnd,
        billingCycle: company.subscription.billingCycle,
        paymentMethod: company.subscription.paymentMethod
      };
    } catch (error) {
      console.error("Error getting subscription details:", error);
      throw new AppError("Failed to get subscription details", 500);
    }
  }
  
  /**
   * Get billing history
   */
  async getBillingHistory(
    companyId: mongoose.Types.ObjectId,
    page: number = 1,
    limit: number = 10
  ): Promise<any> {
    try {
      // This would typically fetch from a payments collection
      // Simplified implementation returns empty array for now
      const history = [];
      
      return {
        history,
        pagination: {
          total: 0,
          page,
          limit,
          pages: 0
        }
      };
    } catch (error) {
      console.error("Error getting billing history:", error);
      throw new AppError("Failed to get billing history", 500);
    }
  }
  
  /**
   * Handle subscription payment success
   */
  async handleSubscriptionPaymentSuccess(
    customerId: string,
    subscriptionId: string,
    invoiceId: string,
    amount: number
  ): Promise<void> {
    try {
      // Find company by external customer ID
      const company = await Company.findOne({ 'subscription.externalCustomerId': customerId });
      
      if (!company) {
        console.error(`Company not found for customer ID: ${customerId}`);
        return;
      }
      
      // Update subscription details
      await Company.findByIdAndUpdate(company._id, {
        'subscription.status': 'active',
        'subscription.lastPaymentId': invoiceId,
        'subscription.lastPaymentAmount': amount,
        'subscription.lastPaymentDate': new Date(),
        updatedAt: new Date()
      });
      
      // Record payment in billing history (if implementing a separate collection)
    } catch (error) {
      console.error("Error handling subscription payment success:", error);
    }
  }
  
  /**
   * Sync subscription status from payment provider
   */
  async syncSubscriptionStatus(
    customerId: string,
    subscriptionId: string,
    status: string,
    currentPeriodEnd: number
  ): Promise<void> {
    try {
      // Find company by external customer ID
      const company = await Company.findOne({ 'subscription.externalCustomerId': customerId });
      
      if (!company) {
        console.error(`Company not found for customer ID: ${customerId}`);
        return;
      }
      
      // Map external status to internal status
      let internalStatus = 'active';
      switch (status) {
        case 'active':
          internalStatus = 'active';
          break;
        case 'past_due':
          internalStatus = 'past_due';
          break;
        case 'canceled':
          internalStatus = 'cancelled';
          break;
        case 'unpaid':
          internalStatus = 'unpaid';
          break;
        default:
          internalStatus = status;
      }
      
      // Update subscription status
      await Company.findByIdAndUpdate(company._id, {
        'subscription.status': internalStatus,
        'subscription.currentPeriodEnd': new Date(currentPeriodEnd),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error syncing subscription status:", error);
    }
  }
  
  /**
   * Handle subscription cancellation from payment provider
   */
  async handleSubscriptionCancellation(
    customerId: string,
    subscriptionId: string
  ): Promise<void> {
    try {
      // Find company by external customer ID
      const company = await Company.findOne({ 'subscription.externalCustomerId': customerId });
      
      if (!company) {
        console.error(`Company not found for customer ID: ${customerId}`);
        return;
      }
      
      // Update subscription status
      await Company.findByIdAndUpdate(company._id, {
        'subscription.status': 'cancelled',
        'subscription.cancelledAt': new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error handling subscription cancellation:", error);
    }
  }
  
  /**
   * Calculate subscription period end date
   */
  private calculatePeriodEnd(startDate: Date, billingCycle: string): Date {
    const endDate = new Date(startDate);
    
    if (billingCycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }
    
    return endDate;
  }
}

export const billingService = new BillingService();
