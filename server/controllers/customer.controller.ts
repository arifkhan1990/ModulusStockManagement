
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Customer from '../models/customer.model';
import { AppError } from '../utils/error';
import { successResponse } from '../utils/helpers';

// Create a new customer
export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.company._id;
    
    // Check if this email already exists for this company
    if (req.body.email) {
      const existingCustomer = await Customer.findOne({ 
        companyId, 
        email: req.body.email
      });
      
      if (existingCustomer) {
        return next(new AppError('Customer with this email already exists', 409));
      }
    }
    
    const customer = await Customer.create({
      ...req.body,
      companyId
    });
    
    res.status(201).json(successResponse('Customer created successfully', customer));
  } catch (error) {
    next(error);
  }
};

// Get all customers for a company
export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.company._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    // Build query based on filters
    const queryObj: any = { companyId };
    
    // Filter by business size if provided
    if (req.query.businessSize) {
      queryObj.businessSize = req.query.businessSize;
    }
    
    // Filter by customer type if provided
    if (req.query.customerType) {
      queryObj.customerType = req.query.customerType;
    }
    
    // Filter by active status
    if (req.query.isActive) {
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
    
    // Get total count
    const total = await Customer.countDocuments(queryObj);
    
    // Get customers with pagination
    const customers = await Customer.find(queryObj)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.status(200).json(successResponse('Customers retrieved successfully', {
      customers,
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

// Get a single customer
export const getCustomer = async (req: Request, res: Response, next: NextFunction) => {
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
export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid customer ID', 400));
    }
    
    // If email is changing, check for uniqueness
    if (req.body.email) {
      const existingCustomer = await Customer.findOne({ 
        companyId, 
        email: req.body.email,
        _id: { $ne: id }
      });
      
      if (existingCustomer) {
        return next(new AppError('Customer with this email already exists', 409));
      }
    }
    
    const customer = await Customer.findOneAndUpdate(
      { _id: id, companyId },
      { ...req.body, updatedAt: new Date() },
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
export const deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid customer ID', 400));
    }
    
    const customer = await Customer.findOneAndUpdate(
      { _id: id, companyId },
      { isActive: false, updatedAt: new Date() },
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

// Get customer types (unique list)
export const getCustomerTypes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.company._id;
    
    // Aggregate to get unique customer types
    const customerTypes = await Customer.aggregate([
      { $match: { companyId: new mongoose.Types.ObjectId(companyId.toString()) } },
      { $group: { _id: '$customerType' } },
      { $match: { _id: { $ne: null } } },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json(successResponse('Customer types retrieved successfully', 
      customerTypes.map(item => item._id)
    ));
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
  getCustomerTypes
};
