
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Analytics from '../models/analytics.model';
import Feature from '../models/feature.model';
import Company from '../models/company.model';
import User from '../models/user.model';
import Order from '../models/order.model';
import { AppError } from '../utils/error';
import { successResponse } from '../utils/helpers';

// Track feature usage (for subscribers)
export const trackFeatureUsage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.company._id;
    const { featureKey, timeSpent = 0 } = req.body;

    // Validate the feature exists
    const feature = await Feature.findOne({ key: featureKey });
    if (!feature) {
      return next(new AppError('Feature not found', 404));
    }

    // Get today's date with time set to 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find analytics document for today
    let analytics = await Analytics.findOne({
      companyId,
      date: today
    });

    if (!analytics) {
      // Create a new analytics entry for today
      analytics = await Analytics.create({
        companyId,
        date: today,
        summary: {
          activeUsers: 0,
          newUsers: 0,
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0
        },
        features: [{
          key: featureKey,
          usageCount: 1,
          totalTime: timeSpent
        }],
        pageViews: [],
        system: {
          apiCalls: 1,
          errors: 0,
          averageResponseTime: 0
        }
      });
    } else {
      // Update existing analytics
      const featureIndex = analytics.features.findIndex(f => f.key === featureKey);
      
      if (featureIndex === -1) {
        // Add new feature to the array
        analytics.features.push({
          key: featureKey,
          usageCount: 1,
          totalTime: timeSpent
        });
      } else {
        // Update existing feature count
        analytics.features[featureIndex].usageCount += 1;
        analytics.features[featureIndex].totalTime += timeSpent;
      }

      // Update system api calls
      analytics.system.apiCalls += 1;
      
      await analytics.save();
    }

    res.status(200).json(successResponse('Feature usage tracked successfully', null));
  } catch (error) {
    next(error);
  }
};

// Track page view
export const trackPageView = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.company._id;
    const { path } = req.body;

    if (!path) {
      return next(new AppError('Path is required', 400));
    }

    // Get today's date with time set to 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find analytics document for today
    let analytics = await Analytics.findOne({
      companyId,
      date: today
    });

    if (!analytics) {
      // Create a new analytics entry for today
      analytics = await Analytics.create({
        companyId,
        date: today,
        summary: {
          activeUsers: 0,
          newUsers: 0,
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0
        },
        features: [],
        pageViews: [{
          path,
          count: 1
        }],
        system: {
          apiCalls: 1,
          errors: 0,
          averageResponseTime: 0
        }
      });
    } else {
      // Update existing analytics
      const pageIndex = analytics.pageViews.findIndex(p => p.path === path);
      
      if (pageIndex === -1) {
        // Add new path to the array
        analytics.pageViews.push({
          path,
          count: 1
        });
      } else {
        // Update existing path count
        analytics.pageViews[pageIndex].count += 1;
      }

      // Update system api calls
      analytics.system.apiCalls += 1;
      
      await analytics.save();
    }

    res.status(200).json(successResponse('Page view tracked successfully', null));
  } catch (error) {
    next(error);
  }
};

// Track error (for error monitoring)
export const trackError = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.company._id;
    const { error, responseTime = 0 } = req.body;

    // Get today's date with time set to 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find analytics document for today
    let analytics = await Analytics.findOne({
      companyId,
      date: today
    });

    if (!analytics) {
      // Create a new analytics entry for today
      analytics = await Analytics.create({
        companyId,
        date: today,
        summary: {
          activeUsers: 0,
          newUsers: 0,
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0
        },
        features: [],
        pageViews: [],
        system: {
          apiCalls: 1,
          errors: 1,
          averageResponseTime: responseTime
        }
      });
    } else {
      // Update existing analytics
      analytics.system.errors += 1;
      
      // Update average response time
      const totalCalls = analytics.system.apiCalls;
      const currentAvg = analytics.system.averageResponseTime;
      const newAvg = ((currentAvg * (totalCalls - 1)) + responseTime) / totalCalls;
      analytics.system.averageResponseTime = newAvg;
      analytics.system.apiCalls += 1;
      
      await analytics.save();
    }

    res.status(200).json(successResponse('Error tracked successfully', null));
  } catch (error) {
    next(error);
  }
};

// Get company analytics (for subscribers)
export const getCompanyAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.company._id;
    const { startDate, endDate } = req.query;
    
    // Default to last 30 days if no dates provided
    const end = endDate ? new Date(endDate as string) : new Date();
    const start = startDate ? new Date(startDate as string) : new Date(end);
    start.setDate(start.getDate() - 30);

    // Set end to end of day and start to start of day
    end.setHours(23, 59, 59, 999);
    start.setHours(0, 0, 0, 0);

    // Get analytics for date range
    const analyticsData = await Analytics.find({
      companyId,
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });

    // Calculate summary data
    const summary = {
      activeUsers: 0,
      newUsers: 0,
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      totalApiCalls: 0,
      totalErrors: 0,
      errorRate: 0
    };

    // Combine data from all days
    analyticsData.forEach(day => {
      summary.activeUsers += day.summary.activeUsers;
      summary.newUsers += day.summary.newUsers;
      summary.totalOrders += day.summary.totalOrders;
      summary.totalRevenue += day.summary.totalRevenue;
      summary.totalApiCalls += day.system.apiCalls;
      summary.totalErrors += day.system.errors;
    });

    // Calculate averages
    summary.averageOrderValue = summary.totalOrders > 0 
      ? summary.totalRevenue / summary.totalOrders 
      : 0;
    
    summary.errorRate = summary.totalApiCalls > 0 
      ? (summary.totalErrors / summary.totalApiCalls) * 100 
      : 0;

    // Get most used features
    const featureUsage: Record<string, { usageCount: number, totalTime: number }> = {};
    
    analyticsData.forEach(day => {
      day.features.forEach(feature => {
        if (!featureUsage[feature.key]) {
          featureUsage[feature.key] = {
            usageCount: 0,
            totalTime: 0
          };
        }
        featureUsage[feature.key].usageCount += feature.usageCount;
        featureUsage[feature.key].totalTime += feature.totalTime;
      });
    });

    // Convert to array and sort by usage
    const topFeatures = Object.entries(featureUsage)
      .map(([key, data]) => ({
        key,
        ...data
      }))
      .sort((a, b) => b.usageCount - a.usageCount);

    // Get most viewed pages
    const pageViews: Record<string, number> = {};
    
    analyticsData.forEach(day => {
      day.pageViews.forEach(page => {
        if (!pageViews[page.path]) {
          pageViews[page.path] = 0;
        }
        pageViews[page.path] += page.count;
      });
    });

    // Convert to array and sort by views
    const topPages = Object.entries(pageViews)
      .map(([path, count]) => ({
        path,
        count
      }))
      .sort((a, b) => b.count - a.count);

    // Daily trend data
    const dailyData = analyticsData.map(day => ({
      date: day.date,
      activeUsers: day.summary.activeUsers,
      newUsers: day.summary.newUsers,
      orders: day.summary.totalOrders,
      revenue: day.summary.totalRevenue,
      apiCalls: day.system.apiCalls,
      errors: day.system.errors,
      avgResponseTime: day.system.averageResponseTime
    }));

    res.status(200).json(
      successResponse('Analytics retrieved successfully', {
        summary,
        topFeatures: topFeatures.slice(0, 10), // Top 10 features
        topPages: topPages.slice(0, 10), // Top 10 pages
        dailyData,
        dateRange: {
          start,
          end
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

// Get SaaS-wide analytics (for system admins)
export const getSaasAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if user is system admin
    if (req.user.type !== 'system_admin') {
      return next(new AppError('Unauthorized access', 403));
    }

    const { startDate, endDate } = req.query;
    
    // Default to last 30 days if no dates provided
    const end = endDate ? new Date(endDate as string) : new Date();
    const start = startDate ? new Date(startDate as string) : new Date(end);
    start.setDate(start.getDate() - 30);

    // Set end to end of day and start to start of day
    end.setHours(23, 59, 59, 999);
    start.setHours(0, 0, 0, 0);

    // Get some key metrics
    // 1. Total active subscribers
    const activeCompanies = await Company.countDocuments({
      'subscription.status': 'active'
    });

    // 2. New subscribers in period
    const newCompanies = await Company.countDocuments({
      createdAt: { $gte: start, $lte: end }
    });

    // 3. Total active users
    const activeUsers = await User.countDocuments({
      isActive: true
    });

    // 4. Total orders in period
    const orderStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      }
    ]);

    const totalOrders = orderStats.length > 0 ? orderStats[0].total : 0;
    const totalRevenue = orderStats.length > 0 ? orderStats[0].revenue : 0;

    // 5. Feature usage across all companies
    const featureUsage = await Analytics.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end }
        }
      },
      {
        $unwind: '$features'
      },
      {
        $group: {
          _id: '$features.key',
          usageCount: { $sum: '$features.usageCount' },
          totalTime: { $sum: '$features.totalTime' }
        }
      },
      {
        $sort: { usageCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // 6. System health metrics
    const systemMetrics = await Analytics.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          totalApiCalls: { $sum: '$system.apiCalls' },
          totalErrors: { $sum: '$system.errors' },
          avgResponseTime: { $avg: '$system.averageResponseTime' }
        }
      }
    ]);

    const systemHealth = systemMetrics.length > 0 ? {
      totalApiCalls: systemMetrics[0].totalApiCalls,
      totalErrors: systemMetrics[0].totalErrors,
      errorRate: (systemMetrics[0].totalErrors / systemMetrics[0].totalApiCalls) * 100,
      avgResponseTime: systemMetrics[0].avgResponseTime
    } : {
      totalApiCalls: 0,
      totalErrors: 0,
      errorRate: 0,
      avgResponseTime: 0
    };

    // 7. Daily trend data
    const dailyTrends = await Analytics.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          activeUsers: { $sum: '$summary.activeUsers' },
          newUsers: { $sum: '$summary.newUsers' },
          orders: { $sum: '$summary.totalOrders' },
          revenue: { $sum: '$summary.totalRevenue' },
          apiCalls: { $sum: '$system.apiCalls' },
          errors: { $sum: '$system.errors' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const formattedDailyTrends = dailyTrends.map(day => ({
      date: day._id,
      activeUsers: day.activeUsers,
      newUsers: day.newUsers,
      orders: day.orders,
      revenue: day.revenue,
      apiCalls: day.apiCalls,
      errors: day.errors
    }));

    // 8. Subscription tier distribution
    const tierDistribution = await Company.aggregate([
      {
        $group: {
          _id: '$subscription.tierId',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json(
      successResponse('SaaS analytics retrieved successfully', {
        subscribers: {
          active: activeCompanies,
          new: newCompanies
        },
        users: {
          active: activeUsers
        },
        business: {
          orders: totalOrders,
          revenue: totalRevenue
        },
        features: featureUsage,
        system: systemHealth,
        tierDistribution,
        dailyTrends: formattedDailyTrends,
        dateRange: {
          start,
          end
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

export default {
  trackFeatureUsage,
  trackPageView,
  trackError,
  getCompanyAnalytics,
  getSaasAnalytics
};
