
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import InvoiceTemplate from "../models/invoice-template.model";
import { AppError } from "../utils/error";
import { successResponse } from "../utils/helpers";
import SystemLog from "../models/system-log.model";

// Create a new template
export const createTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = req.company._id;
    const templateData = { ...req.body, companyId, createdBy: req.user._id };

    // If marked as default, unset other defaults
    if (templateData.isDefault) {
      await InvoiceTemplate.updateMany(
        { companyId, isDefault: true },
        { isDefault: false }
      );
    }

    const template = await InvoiceTemplate.create(templateData);

    // Log activity
    try {
      await SystemLog.create({
        companyId,
        action: 'template_created',
        entityType: 'InvoiceTemplate',
        entityId: template._id,
        userId: req.user._id,
        details: { templateName: template.name },
        ipAddress: req.ip,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }

    res
      .status(201)
      .json(successResponse("Invoice template created successfully", template));
  } catch (error) {
    next(error);
  }
};

// Get all templates for a company
export const getTemplates = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = req.company._id;
    
    const templates = await InvoiceTemplate.find({ companyId })
      .sort({ isDefault: -1, name: 1 });

    res
      .status(200)
      .json(successResponse("Invoice templates retrieved successfully", templates));
  } catch (error) {
    next(error);
  }
};

// Get a single template
export const getTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid template ID", 400));
    }

    const template = await InvoiceTemplate.findOne({ _id: id, companyId });

    if (!template) {
      return next(new AppError("Template not found", 404));
    }

    res
      .status(200)
      .json(successResponse("Template retrieved successfully", template));
  } catch (error) {
    next(error);
  }
};

// Update a template
export const updateTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    const updateData = { ...req.body, updatedBy: req.user._id, updatedAt: new Date() };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid template ID", 400));
    }

    // If making this template default, unset others
    if (updateData.isDefault) {
      await InvoiceTemplate.updateMany(
        { companyId, _id: { $ne: id }, isDefault: true },
        { isDefault: false }
      );
    }

    const template = await InvoiceTemplate.findOneAndUpdate(
      { _id: id, companyId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!template) {
      return next(new AppError("Template not found", 404));
    }

    // Log activity
    try {
      await SystemLog.create({
        companyId,
        action: 'template_updated',
        entityType: 'InvoiceTemplate',
        entityId: template._id,
        userId: req.user._id,
        details: { templateName: template.name },
        ipAddress: req.ip,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }

    res
      .status(200)
      .json(successResponse("Template updated successfully", template));
  } catch (error) {
    next(error);
  }
};

// Delete a template
export const deleteTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid template ID", 400));
    }

    // Don't allow deleting default templates
    const template = await InvoiceTemplate.findOne({ _id: id, companyId });
    
    if (!template) {
      return next(new AppError("Template not found", 404));
    }
    
    if (template.isDefault) {
      return next(new AppError("Cannot delete the default template", 400));
    }

    await InvoiceTemplate.deleteOne({ _id: id, companyId });

    // Log activity
    try {
      await SystemLog.create({
        companyId,
        action: 'template_deleted',
        entityType: 'InvoiceTemplate',
        entityId: id,
        userId: req.user._id,
        details: { templateName: template.name },
        ipAddress: req.ip,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }

    res
      .status(200)
      .json(successResponse("Template deleted successfully", null));
  } catch (error) {
    next(error);
  }
};

// Set template as default
export const setDefaultTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid template ID", 400));
    }

    // Unset all other default templates first
    await InvoiceTemplate.updateMany(
      { companyId, isDefault: true },
      { isDefault: false }
    );

    // Set this one as default
    const template = await InvoiceTemplate.findOneAndUpdate(
      { _id: id, companyId },
      { 
        isDefault: true,
        updatedBy: req.user._id,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!template) {
      return next(new AppError("Template not found", 404));
    }

    // Log activity
    try {
      await SystemLog.create({
        companyId,
        action: 'template_set_default',
        entityType: 'InvoiceTemplate',
        entityId: template._id,
        userId: req.user._id,
        details: { templateName: template.name },
        ipAddress: req.ip,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }

    res
      .status(200)
      .json(successResponse("Template set as default", template));
  } catch (error) {
    next(error);
  }
};

export default {
  createTemplate,
  getTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate,
  setDefaultTemplate,
};
