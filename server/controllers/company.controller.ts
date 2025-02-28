
import { Request, Response } from 'express';
import { Company } from '../models';
import { generateApiKey } from '../utils/helpers';

// Get all companies (super admin only)
export const getAllCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await Company.find()
      .select('-apiKey')
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: companies.length,
      data: companies
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get company details
export const getCompanyDetails = async (req: Request, res: Response) => {
  try {
    // Get company ID from authenticated user
    const companyId = req.user.companyId;
    
    const company = await Company.findById(companyId).select('-apiKey');
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Error fetching company details:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create a new company (used during signup or by super admin)
export const createCompany = async (req: Request, res: Response) => {
  try {
    const {
      name,
      businessType,
      businessSize,
      subscriptionPlan,
      contactEmail,
      contactPhone,
      address
    } = req.body;
    
    // Calculate subscription end date based on plan
    const startDate = new Date();
    const endDate = new Date();
    
    switch (subscriptionPlan) {
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'quarterly':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'biannual':
        endDate.setMonth(endDate.getMonth() + 6);
        break;
      case 'annual':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      default:
        // Trial period (14 days)
        endDate.setDate(endDate.getDate() + 14);
    }
    
    // Generate API key
    const apiKey = generateApiKey();
    
    // Create company with defaults based on subscription plan
    const company = await Company.create({
      name,
      businessType,
      businessSize,
      subscriptionPlan,
      subscriptionStatus: 'active',
      subscriptionStartDate: startDate,
      subscriptionEndDate: endDate,
      contactEmail,
      contactPhone,
      address,
      apiKey,
      // Set limits based on business size
      maxUsers: businessSize === 'small' ? 5 : businessSize === 'medium' ? 20 : 50,
      maxProducts: businessSize === 'small' ? 1000 : businessSize === 'medium' ? 5000 : 1000000,
      maxLocations: businessSize === 'small' ? 3 : businessSize === 'medium' ? 10 : 100
    });
    
    return res.status(201).json({
      success: true,
      data: {
        ...company.toObject(),
        apiKey: undefined // Don't return API key in response
      }
    });
  } catch (error) {
    console.error('Error creating company:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update company details
export const updateCompany = async (req: Request, res: Response) => {
  try {
    const companyId = req.user.companyId;
    const { name, contactEmail, contactPhone, address, settings } = req.body;
    
    const company = await Company.findById(companyId);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    // Update allowed fields
    if (name) company.name = name;
    if (contactEmail) company.contactEmail = contactEmail;
    if (contactPhone) company.contactPhone = contactPhone;
    if (address) company.address = address;
    if (settings) {
      company.settings = {
        ...company.settings,
        ...settings
      };
    }
    
    await company.save();
    
    return res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Error updating company:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Regenerate API key
export const regenerateApiKey = async (req: Request, res: Response) => {
  try {
    const companyId = req.user.companyId;
    
    const company = await Company.findById(companyId);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    // Generate new API key
    company.apiKey = generateApiKey();
    await company.save();
    
    return res.status(200).json({
      success: true,
      data: {
        apiKey: company.apiKey
      }
    });
  } catch (error) {
    console.error('Error regenerating API key:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
