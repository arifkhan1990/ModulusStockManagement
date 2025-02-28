
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Page from '../models/page.model';
import { AppError } from '../utils/error';
import { successResponse } from '../utils/helpers';

// Create a new page
export const createPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.company._id;
    
    // Check if a page with the same type and slug already exists for this company
    const existingPage = await Page.findOne({
      companyId,
      slug: req.body.slug
    });

    if (existingPage) {
      return next(new AppError('A page with this slug already exists', 400));
    }

    // Create new page
    const pageData = {
      ...req.body,
      companyId,
      createdBy: req.user._id,
      updatedBy: req.user._id,
      versions: [{
        content: req.body.content,
        updatedAt: new Date(),
        updatedBy: req.user._id
      }]
    };

    const page = await Page.create(pageData);

    res.status(201).json(successResponse('Page created successfully', page));
  } catch (error) {
    next(error);
  }
};

// Get all pages for a company
export const getPages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.company._id;
    const { type, isPublished } = req.query;

    // Build query based on filters
    const queryObj: any = { companyId };

    // Filter by type if provided
    if (type) {
      queryObj.type = type;
    }

    // Filter by published status if provided
    if (isPublished !== undefined) {
      queryObj.isPublished = isPublished === 'true';
    }

    const pages = await Page.find(queryObj)
      .select('title type slug isPublished createdAt updatedAt')
      .sort({ updatedAt: -1 });

    res.status(200).json(successResponse('Pages retrieved successfully', pages));
  } catch (error) {
    next(error);
  }
};

// Get a single page
export const getPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid page ID', 400));
    }

    const page = await Page.findOne({ _id: id, companyId });

    if (!page) {
      return next(new AppError('Page not found', 404));
    }

    res.status(200).json(successResponse('Page retrieved successfully', page));
  } catch (error) {
    next(error);
  }
};

// Get a public page by slug
export const getPublicPageBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const companyId = req.company._id;

    const page = await Page.findOne({ 
      companyId, 
      slug, 
      isPublished: true 
    }).select('-versions');

    if (!page) {
      return next(new AppError('Page not found', 404));
    }

    res.status(200).json(successResponse('Page retrieved successfully', page));
  } catch (error) {
    next(error);
  }
};

// Update a page
export const updatePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid page ID', 400));
    }

    // First get the current page to check if content has changed
    const currentPage = await Page.findOne({ _id: id, companyId });

    if (!currentPage) {
      return next(new AppError('Page not found', 404));
    }

    // Check if slug is unique if it's being changed
    if (req.body.slug && req.body.slug !== currentPage.slug) {
      const existingPage = await Page.findOne({
        companyId,
        slug: req.body.slug,
        _id: { $ne: id }
      });

      if (existingPage) {
        return next(new AppError('A page with this slug already exists', 400));
      }
    }

    // Create data for update
    const updateData: any = {
      ...req.body,
      updatedBy: req.user._id,
      updatedAt: new Date()
    };

    // If content has changed, add a new version
    if (req.body.content && req.body.content !== currentPage.content) {
      updateData.$push = {
        versions: {
          content: req.body.content,
          updatedAt: new Date(),
          updatedBy: req.user._id
        }
      };
    }

    const page = await Page.findOneAndUpdate(
      { _id: id, companyId },
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json(successResponse('Page updated successfully', page));
  } catch (error) {
    next(error);
  }
};

// Delete a page
export const deletePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid page ID', 400));
    }

    const page = await Page.findOneAndDelete({ _id: id, companyId });

    if (!page) {
      return next(new AppError('Page not found', 404));
    }

    res.status(200).json(successResponse('Page deleted successfully', null));
  } catch (error) {
    next(error);
  }
};

export default {
  createPage,
  getPages,
  getPage,
  getPublicPageBySlug,
  updatePage,
  deletePage
};
