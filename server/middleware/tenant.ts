
import { Request, Response, NextFunction } from 'express';
import { Company } from '../models';

/**
 * Middleware to enforce tenant isolation
 * This ensures that users can only access data belonging to their company
 */
export const tenantIsolation = (req: any, res: Response, next: NextFunction) => {
  // Skip for public routes or admin-only routes
  if (!req.user) {
    return next();
  }
  
  // Add company ID to the request for use in controllers
  req.tenantId = req.user.companyId;
  
  next();
};

/**
 * Middleware to check if operation is within company limits
 * @param resourceType The type of resource being checked (users, products, locations)
 */
export const checkCompanyLimits = (resourceType: string) => {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      // Skip for super admins
      if (req.user.role === 'admin' && !req.user.companyId) {
        return next();
      }
      
      const company = await Company.findById(req.user.companyId);
      
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }
      
      // Check if company subscription is active
      if (company.subscriptionStatus !== 'active') {
        return res.status(403).json({
          success: false,
          message: 'Subscription is not active'
        });
      }
      
      // Get current counts
      let currentCount = 0;
      let maxAllowed = 0;
      
      switch (resourceType) {
        case 'users':
          // This would typically be a database query to count users
          // currentCount = await User.countDocuments({ companyId: req.user.companyId });
          maxAllowed = company.maxUsers;
          break;
        case 'products':
          // currentCount = await Product.countDocuments({ companyId: req.user.companyId });
          maxAllowed = company.maxProducts;
          break;
        case 'locations':
          // currentCount = await Location.countDocuments({ companyId: req.user.companyId });
          maxAllowed = company.maxLocations;
          break;
        default:
          return next();
      }
      
      // Check if operation would exceed limits
      if (currentCount >= maxAllowed && req.method === 'POST') {
        return res.status(403).json({
          success: false,
          message: `You have reached the maximum number of ${resourceType} allowed for your subscription plan`
        });
      }
      
      next();
    } catch (error) {
      console.error(`Error checking company limits:`, error);
      next(error);
    }
  };
};
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../utils/error';

/**
 * Middleware to extract and validate tenant (company) information
 * This adds multi-tenancy support to our API
 */
export const tenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Skip tenant handling for public endpoints
    const publicPaths = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/forgot-password',
      '/api/auth/reset-password',
      '/api/auth/verify-email',
      '/api/demo-request',
      '/api/health',
      '/api/health/detailed',
      '/api/health/ready'
    ];

    if (publicPaths.includes(req.path)) {
      return next();
    }

    // Skip if no user is authenticated
    if (!req.user) {
      return next();
    }

    // Handle special cases: subdomains or X-Company-ID header
    let companyId: string | undefined;

    // Option 1: Extract from subdomain (e.g. company-name.example.com)
    if (req.headers.host && req.headers.host.includes('.')) {
      const subdomain = req.headers.host.split('.')[0];
      if (subdomain !== 'www' && subdomain !== 'api') {
        // Look up company by subdomain in the database
        const Company = mongoose.model('Company');
        const company = await Company.findOne({ subdomain });
        
        if (company) {
          companyId = company._id.toString();
        }
      }
    }

    // Option 2: Extract from custom header (useful for API calls)
    if (!companyId && req.headers['x-company-id']) {
      companyId = req.headers['x-company-id'] as string;
    }

    // Option 3: Use the user's company if they only have one
    if (!companyId && req.user && req.user.companyId) {
      companyId = req.user.companyId.toString();
    }

    // If still no company ID found, check if the user belongs to multiple companies
    if (!companyId && req.user) {
      const User = mongoose.model('User');
      const user = await User.findById(req.user._id).populate('companies');
      
      if (user && user.companies && user.companies.length === 1) {
        // If user belongs to only one company, use that
        companyId = user.companies[0]._id.toString();
      } else if (user && user.companies && user.companies.length > 1) {
        // If user belongs to multiple companies and no company is specified, return error
        return next(new AppError('Please specify a company ID', 400));
      }
    }

    // Verify the company ID is valid
    if (companyId) {
      if (!mongoose.Types.ObjectId.isValid(companyId)) {
        return next(new AppError('Invalid company ID', 400));
      }

      // Get the company
      const Company = mongoose.model('Company');
      const company = await Company.findById(companyId);

      if (!company) {
        return next(new AppError('Company not found', 404));
      }

      // Check if user has access to this company
      // This might need more complex logic depending on your app
      const User = mongoose.model('User');
      const user = await User.findOne({
        _id: req.user._id,
        $or: [
          { companyId: companyId },
          { companies: { $in: [companyId] } }
        ]
      });

      if (!user) {
        return next(new AppError('You do not have access to this company', 403));
      }

      // Attach company to request
      req.company = company;
    } else {
      // If no company is found and it's not a public endpoint, return error
      return next(new AppError('Company context is required', 400));
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default tenantMiddleware;
