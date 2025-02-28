
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Integration from '../models/integration.model';
import { AppError } from '../utils/error';
import { successResponse } from '../utils/helpers';
import SystemLog from '../models/system-log.model';
import { encrypt, decrypt } from '../utils/encryption';

// Get available integrations
export const getAvailableIntegrations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // This would typically come from a database or configuration
    const availableIntegrations = [
      {
        provider: 'quickbooks',
        name: 'QuickBooks',
        description: 'Sync accounting data with QuickBooks',
        icon: 'quickbooks-icon.png',
        categories: ['accounting'],
        requiredFields: ['clientId', 'clientSecret']
      },
      {
        provider: 'mailchimp',
        name: 'Mailchimp',
        description: 'Email marketing automation',
        icon: 'mailchimp-icon.png',
        categories: ['marketing'],
        requiredFields: ['apiKey']
      },
      {
        provider: 'stripe',
        name: 'Stripe',
        description: 'Payment processing',
        icon: 'stripe-icon.png',
        categories: ['payments'],
        requiredFields: ['apiKey', 'secretKey']
      },
      {
        provider: 'shopify',
        name: 'Shopify',
        description: 'E-commerce platform',
        icon: 'shopify-icon.png',
        categories: ['e-commerce'],
        requiredFields: ['apiKey', 'apiSecret', 'storeUrl']
      }
    ];

    res.status(200).json(
      successResponse('Available integrations retrieved successfully', availableIntegrations)
    );
  } catch (error) {
    next(error);
  }
};

// Create a new integration
export const createIntegration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.company._id;
    const { provider, name, description, credentials, settings } = req.body;

    // Check if integration already exists for this company
    const existingIntegration = await Integration.findOne({
      companyId,
      provider
    });

    if (existingIntegration) {
      return next(new AppError(`An integration with provider '${provider}' already exists`, 400));
    }

    // Encrypt sensitive data (credentials)
    const encryptedCredentials: any = {};
    for (const [key, value] of Object.entries(credentials || {})) {
      encryptedCredentials[key] = encryptData(value as string);
    }

    // Create the integration
    const integration = await Integration.create({
      companyId,
      provider,
      name: name || provider,
      description,
      isActive: true,
      credentials: encryptedCredentials,
      settings: settings || {},
      createdBy: req.user._id,
      updatedBy: req.user._id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Log creation
    await SystemLog.create({
      companyId,
      userId: req.user._id,
      action: 'integration_created',
      resource: 'integration',
      resourceId: integration._id,
      timestamp: new Date(),
      ipAddress: req.ip,
      details: {
        integrationId: integration._id,
        provider
      }
    });

    // Return integration without showing credentials
    const responseIntegration = integration.toObject();
    delete responseIntegration.credentials;

    res.status(201).json(
      successResponse('Integration created successfully', responseIntegration)
    );
  } catch (error) {
    next(error);
  }
};

// Get all integrations for a company
export const getIntegrations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.company._id;

    // Build query based on filters
    const queryObj: any = { companyId };

    // Filter by active status if provided
    if (req.query.isActive !== undefined) {
      queryObj.isActive = req.query.isActive === 'true';
    }

    // Filter by provider if provided
    if (req.query.provider) {
      queryObj.provider = req.query.provider;
    }

    // Fetch integrations
    const integrations = await Integration.find(queryObj)
      .select('-credentials') // Don't return credentials
      .sort({ updatedAt: -1 });

    res.status(200).json(
      successResponse('Integrations retrieved successfully', integrations)
    );
  } catch (error) {
    next(error);
  }
};

// Get a single integration
export const getIntegration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid integration ID', 400));
    }

    const integration = await Integration.findOne({ _id: id, companyId })
      .select('-credentials'); // Don't return credentials

    if (!integration) {
      return next(new AppError('Integration not found', 404));
    }

    res.status(200).json(
      successResponse('Integration retrieved successfully', integration)
    );
  } catch (error) {
    next(error);
  }
};

// Update an integration
export const updateIntegration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    const { name, description, isActive, credentials, settings } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid integration ID', 400));
    }

    // Get current integration to keep existing credentials if not provided
    const existingIntegration = await Integration.findOne({ _id: id, companyId });

    if (!existingIntegration) {
      return next(new AppError('Integration not found', 404));
    }

    // Prepare update data
    const updateData: any = {
      updatedBy: req.user._id,
      updatedAt: new Date()
    };

    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (settings) updateData.settings = settings;

    // Handle credentials update if provided
    if (credentials && Object.keys(credentials).length > 0) {
      const encryptedCredentials: any = {};
      for (const [key, value] of Object.entries(credentials)) {
        encryptedCredentials[key] = encryptData(value as string);
      }
      updateData.credentials = encryptedCredentials;
    }

    // Update the integration
    const integration = await Integration.findOneAndUpdate(
      { _id: id, companyId },
      updateData,
      { new: true, runValidators: true }
    ).select('-credentials'); // Don't return credentials

    // Log update
    await SystemLog.create({
      companyId,
      userId: req.user._id,
      action: 'integration_updated',
      resource: 'integration',
      resourceId: integration._id,
      timestamp: new Date(),
      ipAddress: req.ip,
      details: {
        integrationId: integration._id,
        provider: integration.provider,
        changedFields: Object.keys(req.body)
      }
    });

    res.status(200).json(
      successResponse('Integration updated successfully', integration)
    );
  } catch (error) {
    next(error);
  }
};

// Delete an integration
export const deleteIntegration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid integration ID', 400));
    }

    const integration = await Integration.findOneAndDelete({ _id: id, companyId });

    if (!integration) {
      return next(new AppError('Integration not found', 404));
    }

    // Log deletion
    await SystemLog.create({
      companyId,
      userId: req.user._id,
      action: 'integration_deleted',
      resource: 'integration',
      resourceId: id,
      timestamp: new Date(),
      ipAddress: req.ip,
      details: {
        integrationId: id,
        provider: integration.provider
      }
    });

    res.status(200).json(
      successResponse('Integration deleted successfully', null)
    );
  } catch (error) {
    next(error);
  }
};

// Sync data with integration
export const syncIntegration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    const { dataTypes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid integration ID', 400));
    }

    if (!dataTypes || !Array.isArray(dataTypes) || dataTypes.length === 0) {
      return next(new AppError('At least one data type must be selected for sync', 400));
    }

    const integration = await Integration.findOne({ _id: id, companyId });

    if (!integration) {
      return next(new AppError('Integration not found', 404));
    }

    if (!integration.isActive) {
      return next(new AppError('Cannot sync with inactive integration', 400));
    }

    // Update sync status
    await Integration.findByIdAndUpdate(id, {
      syncStatus: 'in_progress',
      updatedAt: new Date()
    });

    // Log sync initiation
    await SystemLog.create({
      companyId,
      userId: req.user._id,
      action: 'integration_sync_initiated',
      resource: 'integration',
      resourceId: integration._id,
      timestamp: new Date(),
      ipAddress: req.ip,
      details: {
        integrationId: integration._id,
        provider: integration.provider,
        dataTypes
      }
    });

    // This would be a non-blocking operation in a real implementation
    // Simulate sync process
    setTimeout(async () => {
      try {
        // In a real implementation, this would call the appropriate service based on the provider
        // For now, just mark it as successful
        await Integration.findByIdAndUpdate(id, {
          syncStatus: 'success',
          lastSyncAt: new Date(),
          updatedAt: new Date()
        });

        // Log success
        await SystemLog.create({
          companyId,
          userId: req.user._id,
          action: 'integration_sync_completed',
          resource: 'integration',
          resourceId: integration._id,
          timestamp: new Date(),
          ipAddress: req.ip,
          details: {
            integrationId: integration._id,
            provider: integration.provider,
            dataTypes
          }
        });
      } catch (error: any) {
        // Update status to failed
        await Integration.findByIdAndUpdate(id, {
          syncStatus: 'failed',
          syncError: error.message || 'Unknown error occurred',
          updatedAt: new Date()
        });

        // Log failure
        await SystemLog.create({
          companyId,
          userId: req.user._id,
          action: 'integration_sync_failed',
          resource: 'integration',
          resourceId: integration._id,
          timestamp: new Date(),
          ipAddress: req.ip,
          details: {
            integrationId: integration._id,
            provider: integration.provider,
            error: error.message || 'Unknown error occurred'
          }
        });
      }
    }, 2000);

    res.status(200).json(
      successResponse('Integration sync initiated', {
        integrationId: id,
        provider: integration.provider,
        status: 'in_progress'
      })
    );
  } catch (error) {
    next(error);
  }
};

export default {
  getAvailableIntegrations,
  createIntegration,
  getIntegrations,
  getIntegration,
  updateIntegration,
  deleteIntegration,
  syncIntegration
};
