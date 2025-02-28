
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Backup from '../models/backup.model';
import { AppError } from '../utils/error';
import { successResponse } from '../utils/helpers';
import SystemLog from '../models/system-log.model';
import { createExport, importData } from '../utils/data';

// Create a new backup
export const createBackup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.company._id;
    const { name, description, dataTypes } = req.body;

    if (!dataTypes || !Array.isArray(dataTypes) || dataTypes.length === 0) {
      return next(new AppError('At least one data type must be selected', 400));
    }

    // Create backup record
    const backup = await Backup.create({
      companyId,
      name: name || `Backup ${new Date().toISOString()}`,
      description,
      fileUrl: '', // Will be updated once export is complete
      fileSize: 0, // Will be updated once export is complete
      backupType: 'manual',
      status: 'pending',
      dataTypes,
      createdBy: req.user._id,
      createdAt: new Date()
    });

    // Initiate backup process (non-blocking)
    createExport(companyId.toString(), dataTypes, backup._id.toString())
      .then(async (result) => {
        // Update backup record with file info
        await Backup.findByIdAndUpdate(backup._id, {
          fileUrl: result.fileUrl,
          fileSize: result.fileSize,
          status: 'completed',
          completedAt: new Date()
        });

        // Log success
        await SystemLog.create({
          companyId,
          userId: req.user._id,
          action: 'backup_completed',
          resource: 'backup',
          resourceId: backup._id,
          timestamp: new Date(),
          ipAddress: req.ip,
          details: {
            backupId: backup._id,
            dataTypes
          }
        });
      })
      .catch(async (error) => {
        // Update backup record with error
        await Backup.findByIdAndUpdate(backup._id, {
          status: 'failed',
          errorMessage: error.message || 'Unknown error occurred'
        });

        // Log error
        await SystemLog.create({
          companyId,
          userId: req.user._id,
          action: 'backup_failed',
          resource: 'backup',
          resourceId: backup._id,
          timestamp: new Date(),
          ipAddress: req.ip,
          details: {
            backupId: backup._id,
            error: error.message || 'Unknown error occurred'
          }
        });
      });

    res.status(201).json(successResponse('Backup initiated successfully', backup));
  } catch (error) {
    next(error);
  }
};

// Get all backups for a company
export const getBackups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.company._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build query based on filters
    const queryObj: any = { companyId };

    // Filter by status if provided
    if (req.query.status) {
      queryObj.status = req.query.status;
    }

    // Filter by backup type if provided
    if (req.query.backupType) {
      queryObj.backupType = req.query.backupType;
    }

    // Count total backups
    const total = await Backup.countDocuments(queryObj);

    // Fetch backups with pagination
    const backups = await Backup.find(queryObj)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(
      successResponse('Backups retrieved successfully', {
        backups,
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

// Get a single backup
export const getBackup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid backup ID', 400));
    }

    const backup = await Backup.findOne({ _id: id, companyId });

    if (!backup) {
      return next(new AppError('Backup not found', 404));
    }

    res.status(200).json(successResponse('Backup retrieved successfully', backup));
  } catch (error) {
    next(error);
  }
};

// Restore from a backup
export const restoreBackup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    const { dataTypes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid backup ID', 400));
    }

    if (!dataTypes || !Array.isArray(dataTypes) || dataTypes.length === 0) {
      return next(new AppError('At least one data type must be selected for restore', 400));
    }

    const backup = await Backup.findOne({ _id: id, companyId });

    if (!backup) {
      return next(new AppError('Backup not found', 404));
    }

    if (backup.status !== 'completed') {
      return next(new AppError('Cannot restore from an incomplete backup', 400));
    }

    // Check if all requested data types exist in the backup
    const missingTypes = dataTypes.filter(type => !backup.dataTypes.includes(type));
    if (missingTypes.length > 0) {
      return next(new AppError(`The following data types are not available in this backup: ${missingTypes.join(', ')}`, 400));
    }

    // Create a restore log
    await SystemLog.create({
      companyId,
      userId: req.user._id,
      action: 'backup_restore_initiated',
      resource: 'backup',
      resourceId: backup._id,
      timestamp: new Date(),
      ipAddress: req.ip,
      details: {
        backupId: backup._id,
        dataTypes
      }
    });

    // Initiate restore process (should be implemented in utils/data.ts)
    // This would be a non-blocking operation in a real implementation
    try {
      await importData(companyId.toString(), backup.fileUrl, dataTypes);
      
      // Log success
      await SystemLog.create({
        companyId,
        userId: req.user._id,
        action: 'backup_restore_completed',
        resource: 'backup',
        resourceId: backup._id,
        timestamp: new Date(),
        ipAddress: req.ip,
        details: {
          backupId: backup._id,
          dataTypes
        }
      });

      res.status(200).json(successResponse('Backup restored successfully', null));
    } catch (error: any) {
      // Log failure
      await SystemLog.create({
        companyId,
        userId: req.user._id,
        action: 'backup_restore_failed',
        resource: 'backup',
        resourceId: backup._id,
        timestamp: new Date(),
        ipAddress: req.ip,
        details: {
          backupId: backup._id,
          error: error.message || 'Unknown error occurred'
        }
      });

      return next(new AppError(`Restore failed: ${error.message || 'Unknown error'}`, 500));
    }
  } catch (error) {
    next(error);
  }
};

// Delete a backup
export const deleteBackup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid backup ID', 400));
    }

    const backup = await Backup.findOneAndDelete({ _id: id, companyId });

    if (!backup) {
      return next(new AppError('Backup not found', 404));
    }

    // Log deletion
    await SystemLog.create({
      companyId,
      userId: req.user._id,
      action: 'backup_deleted',
      resource: 'backup',
      resourceId: id,
      timestamp: new Date(),
      ipAddress: req.ip,
      details: {
        backupId: id,
        backupName: backup.name
      }
    });

    // Delete the actual file (would need to be implemented based on storage solution)
    // e.g., deleteFile(backup.fileUrl);

    res.status(200).json(successResponse('Backup deleted successfully', null));
  } catch (error) {
    next(error);
  }
};

export default {
  createBackup,
  getBackups,
  getBackup,
  restoreBackup,
  deleteBackup
};
