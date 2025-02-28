
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Sharing from '../models/sharing.model';
import Download from '../models/download.model';
import Invoice from '../models/invoice.model';
import { AppError } from '../utils/error';
import { successResponse } from '../utils/helpers';
import { sharingService } from '../services/sharing.service';
import { documentService } from '../services/document.service';

// Create a new sharing link
export const createSharing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.company._id;
    const userId = req.user._id;
    
    const { documentId, documentType, channel, message, expiresInHours = 24 } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return next(new AppError('Invalid document ID', 400));
    }
    
    // Check if document exists based on type
    let document;
    switch (documentType) {
      case 'invoice':
        document = await Invoice.findOne({ _id: documentId, companyId });
        break;
      // Add more document types as needed
      default:
        return next(new AppError(`Unsupported document type: ${documentType}`, 400));
    }
    
    if (!document) {
      return next(new AppError(`${documentType} not found`, 404));
    }
    
    // Generate unique access token
    const accessToken = uuidv4();
    
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);
    
    // Generate sharing URL
    const sharingUrl = `${req.protocol}://${req.get('host')}/api/shares/${accessToken}`;
    
    // Create sharing record
    const sharing = await Sharing.create({
      companyId,
      userId,
      documentId,
      documentType,
      channel,
      sharingUrl,
      accessToken,
      message,
      expiresAt,
      viewCount: 0,
      downloadCount: 0,
      status: 'active',
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Generate short URL if needed
    if (channel !== 'direct_link') {
      try {
        const shortUrl = await sharingService.generateShortUrl(sharingUrl);
        if (shortUrl) {
          sharing.shortUrl = shortUrl;
          await sharing.save();
        }
      } catch (error) {
        console.error('Error generating short URL:', error);
        // Continue without short URL
      }
    }
    
    // Share to social platform if requested
    if (channel !== 'direct_link' && channel !== 'email') {
      try {
        await sharingService.shareToSocialPlatform(sharing);
      } catch (error) {
        console.error(`Error sharing to ${channel}:`, error);
        // Continue without social sharing
      }
    }
    
    res.status(201).json(successResponse('Sharing link created successfully', sharing));
  } catch (error) {
    next(error);
  }
};

// Get all sharing links
export const getSharings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.company._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    // Build query based on filters
    const queryObj: any = { companyId };
    
    // Filter by document type if provided
    if (req.query.documentType) {
      queryObj.documentType = req.query.documentType;
    }
    
    // Filter by channel if provided
    if (req.query.channel) {
      queryObj.channel = req.query.channel;
    }
    
    // Filter by status if provided
    if (req.query.status) {
      queryObj.status = req.query.status;
    }
    
    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      queryObj.createdAt = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string)
      };
    }
    
    // Get total count
    const total = await Sharing.countDocuments(queryObj);
    
    // Get sharings with pagination
    const sharings = await Sharing.find(queryObj)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.status(200).json(
      successResponse('Sharing links retrieved successfully', {
        sharings,
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

// Get a single sharing link
export const getSharing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid sharing ID', 400));
    }
    
    const sharing = await Sharing.findOne({ _id: id, companyId });
    
    if (!sharing) {
      return next(new AppError('Sharing link not found', 404));
    }
    
    res.status(200).json(successResponse('Sharing link retrieved successfully', sharing));
  } catch (error) {
    next(error);
  }
};

// Get shared document by access token (public route)
export const getSharedDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accessToken } = req.params;
    
    const sharing = await Sharing.findOne({ accessToken });
    
    if (!sharing) {
      return next(new AppError('Invalid or expired sharing link', 404));
    }
    
    // Check if expired
    if (sharing.expiresAt < new Date()) {
      sharing.status = 'expired';
      await sharing.save();
      return next(new AppError('This sharing link has expired', 403));
    }
    
    // Check if revoked
    if (sharing.status === 'revoked') {
      return next(new AppError('This sharing link has been revoked', 403));
    }
    
    // Update view count and last viewed time
    sharing.viewCount += 1;
    sharing.lastViewedAt = new Date();
    sharing.updatedAt = new Date();
    await sharing.save();
    
    // Get the document based on type
    let document;
    switch (sharing.documentType) {
      case 'invoice':
        document = await Invoice.findById(sharing.documentId)
          .select('-__v -createdBy -updatedBy');
        break;
      // Add more document types as needed
      default:
        return next(new AppError(`Unsupported document type: ${sharing.documentType}`, 400));
    }
    
    if (!document) {
      return next(new AppError(`${sharing.documentType} not found`, 404));
    }
    
    res.status(200).json(
      successResponse('Shared document retrieved successfully', {
        document,
        sharing: {
          documentType: sharing.documentType,
          expiresAt: sharing.expiresAt,
          message: sharing.message
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

// Revoke a sharing link
export const revokeSharing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid sharing ID', 400));
    }
    
    const sharing = await Sharing.findOneAndUpdate(
      { _id: id, companyId },
      { 
        status: 'revoked', 
        updatedAt: new Date() 
      },
      { new: true }
    );
    
    if (!sharing) {
      return next(new AppError('Sharing link not found', 404));
    }
    
    res.status(200).json(successResponse('Sharing link revoked successfully', sharing));
  } catch (error) {
    next(error);
  }
};

// Create a document download link
export const createDownload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.company._id;
    const userId = req.user._id;
    
    const { documentId, documentType, format, sharingId } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return next(new AppError('Invalid document ID', 400));
    }
    
    // Check if document exists based on type
    let document;
    switch (documentType) {
      case 'invoice':
        document = await Invoice.findOne({ _id: documentId, companyId });
        break;
      // Add more document types as needed
      default:
        return next(new AppError(`Unsupported document type: ${documentType}`, 400));
    }
    
    if (!document) {
      return next(new AppError(`${documentType} not found`, 404));
    }
    
    // Check sharing if provided
    if (sharingId && !mongoose.Types.ObjectId.isValid(sharingId)) {
      return next(new AppError('Invalid sharing ID', 400));
    }
    
    // Generate file based on format
    const result = await documentService.generateDocumentFile(document, documentType, format);
    
    if (!result.success) {
      return next(new AppError(`Failed to generate ${format} file: ${result.error}`, 500));
    }
    
    // Calculate expiration date (24 hours by default)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    // Create download record
    const download = await Download.create({
      companyId,
      userId,
      documentId,
      documentType,
      sharingId: sharingId || null,
      format,
      fileName: result.fileName,
      fileUrl: result.fileUrl,
      fileSize: result.fileSize,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'created',
      expiresAt,
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Update sharing download count if applicable
    if (sharingId) {
      await Sharing.findByIdAndUpdate(sharingId, {
        $inc: { downloadCount: 1 },
        updatedAt: new Date()
      });
    }
    
    res.status(201).json(
      successResponse('Download link created successfully', {
        download,
        downloadUrl: result.fileUrl
      })
    );
  } catch (error) {
    next(error);
  }
};

// Download a document (public route)
export const downloadDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid download ID', 400));
    }
    
    const download = await Download.findById(id);
    
    if (!download) {
      return next(new AppError('Download not found', 404));
    }
    
    // Check if expired
    if (download.expiresAt < new Date()) {
      download.status = 'expired';
      await download.save();
      return next(new AppError('This download link has expired', 403));
    }
    
    // Update download status
    download.status = 'downloaded';
    download.downloadedAt = new Date();
    download.updatedAt = new Date();
    await download.save();
    
    // Stream the file to the client
    res.redirect(download.fileUrl);
  } catch (error) {
    next(error);
  }
};

// Get download statistics
export const getDownloadStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.company._id;
    
    // Default date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    // Override dates if provided
    if (req.query.startDate) {
      startDate.setTime(new Date(req.query.startDate as string).getTime());
    }
    
    if (req.query.endDate) {
      endDate.setTime(new Date(req.query.endDate as string).getTime());
    }
    
    // Get counts by format
    const formatCounts = await Download.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId.toString()),
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$format',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get counts by document type
    const documentTypeCounts = await Download.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId.toString()),
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$documentType',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get daily download counts
    const dailyCounts = await Download.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId.toString()),
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json(
      successResponse('Download statistics retrieved successfully', {
        formatCounts,
        documentTypeCounts,
        dailyCounts
      })
    );
  } catch (error) {
    next(error);
  }
};

export default {
  createSharing,
  getSharings,
  getSharing,
  getSharedDocument,
  revokeSharing,
  createDownload,
  downloadDocument,
  getDownloadStatistics
};
