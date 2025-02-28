
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Customer from '../models/customer.model';
import { AppError } from '../utils/error';
import { successResponse } from '../utils/helpers';

// Create a new customer
export const createCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.company._id;
    
    const customerData = {
      ...req.body,
      companyId,
      createdBy: req.user._id,
      updatedBy: req.user._id
    };
    
    const customer = await Customer.create(customerData);
    
    res.status(201).json(successResponse('Customer created successfully', customer));
  } catch (error) {
    next(error);
  }
};

// Get all customers with filtering and pagination
export const getCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.company._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    // Build query filters
    const queryObj: any = { companyId };
    
    // Filter by customer type
    if (req.query.customerType) {
      queryObj.customerType = req.query.customerType;
    }
    
    // Filter by business size
    if (req.query.businessSize) {
      queryObj.businessSize = req.query.businessSize;
    }
    
    // Filter by active status
    if (req.query.isActive !== undefined) {
      queryObj.isActive = req.query.isActive === 'true';
    }
    
    // Search by name, email, or phone
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      queryObj.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { company: searchRegex }
      ];
    }
    
    // Count total matching customers
    const total = await Customer.countDocuments(queryObj);
    
    // Get customers with pagination
    const customers = await Customer.find(queryObj)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.status(200).json(
      successResponse('Customers retrieved successfully', {
        customers,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

// Get a single customer by ID
export const getCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid customer ID', 400));
    }
    
    const customer = await Customer.findOne({ _id: id, companyId });
    
    if (!customer) {
      return next(new AppError('Customer not found', 404));
    }
    
    res.status(200).json(successResponse('Customer retrieved successfully', customer));
  } catch (error) {
    next(error);
  }
};

// Update a customer
export const updateCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid customer ID', 400));
    }
    
    // Add updater info
    const updates = {
      ...req.body,
      updatedBy: req.user._id,
      updatedAt: new Date()
    };
    
    const customer = await Customer.findOneAndUpdate(
      { _id: id, companyId },
      updates,
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      return next(new AppError('Customer not found', 404));
    }
    
    res.status(200).json(successResponse('Customer updated successfully', customer));
  } catch (error) {
    next(error);
  }
};

// Delete a customer (soft delete by setting isActive to false)
export const deleteCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid customer ID', 400));
    }
    
    const customer = await Customer.findOneAndUpdate(
      { _id: id, companyId },
      { 
        isActive: false,
        updatedBy: req.user._id,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!customer) {
      return next(new AppError('Customer not found', 404));
    }
    
    res.status(200).json(successResponse('Customer deleted successfully', null));
  } catch (error) {
    next(error);
  }
};

// Get customer statistics
export const getCustomerStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.company._id;
    
    // Total customers
    const totalCustomers = await Customer.countDocuments({ companyId });
    
    // Active customers
    const activeCustomers = await Customer.countDocuments({ companyId, isActive: true });
    
    // Customers by type
    const customersByType = await Customer.aggregate([
      { $match: { companyId: new mongoose.Types.ObjectId(companyId.toString()) } },
      { $group: { _id: '$customerType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Customers by business size
    const customersBySize = await Customer.aggregate([
      { $match: { companyId: new mongoose.Types.ObjectId(companyId.toString()) } },
      { $group: { _id: '$businessSize', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Recent customers
    const recentCustomers = await Customer.find({ companyId })
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.status(200).json(
      successResponse('Customer statistics retrieved successfully', {
        totalCustomers,
        activeCustomers,
        customersByType,
        customersBySize,
        recentCustomers
      })
    );
  } catch (error) {
    next(error);
  }
};

export default {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerStats
};
