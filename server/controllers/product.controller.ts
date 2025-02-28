import mongoose from "mongoose";
import Product from "../models/product.model";
import Inventory from "../models/inventory.model";
import { AppError } from "../utils/error";
import { successResponse } from "../utils/helpers";

// Create a new product
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = req.company._id;

    // Check if SKU already exists for this company
    const existingProduct = await Product.findOne({
      companyId,
      sku: req.body.sku,
    });

    if (existingProduct) {
      return next(new AppError("Product with this SKU already exists", 409));
    }

    // Create the product
    const product = await Product.create({
      ...req.body,
      companyId,
    });

    // Create inventory records for each location if locations provided
    if (req.body.locationIds && req.body.locationIds.length > 0) {
      const bulkInventoryOps = req.body.locationIds.map(
        (locationId: string) => ({
          insertOne: {
            document: {
              companyId,
              productId: product._id,
              locationId,
              quantity: 0,
              reservedQuantity: 0,
              availableQuantity: 0,
            },
          },
        }),
      );

      await Inventory.bulkWrite(bulkInventoryOps);
    }

    res
      .status(201)
      .json(successResponse("Product created successfully", product));
  } catch (error) {
    next(error);
  }
};

// Get all products for a company
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = req.company._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Build query based on filters
    const queryObj: any = { companyId };

    // Filter by status if provided
    if (req.query.status) {
      queryObj.status = req.query.status;
    }

    // Filter by category if provided
    if (req.query.category) {
      queryObj.category = req.query.category;
    }

    // Search by name or SKU
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, "i");
      queryObj.$or = [{ name: searchRegex }, { sku: searchRegex }];
    }

    // Filter by stock threshold
    if (req.query.lowStock === "true") {
      queryObj.$expr = {
        $lte: ["$stockQuantity", "$lowStockThreshold"],
      };
    }

    // Get total count
    const total = await Product.countDocuments(queryObj);

    // Get products with pagination
    const products = await Product.find(queryObj)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(
      successResponse("Products retrieved successfully", {
        products,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      }),
    );
  } catch (error) {
    next(error);
  }
};

// Get a single product
export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid product ID", 400));
    }

    const product = await Product.findOne({ _id: id, companyId });

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    // Get inventory levels for this product
    const inventoryItems = await Inventory.find({
      productId: id,
      companyId,
    }).populate("locationId", "name type");

    res.status(200).json(
      successResponse("Product retrieved successfully", {
        product,
        inventory: inventoryItems,
      }),
    );
  } catch (error) {
    next(error);
  }
};

// Update a product
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid product ID", 400));
    }

    // If SKU is changing, check for uniqueness
    if (req.body.sku) {
      const existingProduct = await Product.findOne({
        companyId,
        sku: req.body.sku,
        _id: { $ne: id },
      });

      if (existingProduct) {
        return next(new AppError("Product with this SKU already exists", 409));
      }
    }

    const product = await Product.findOneAndUpdate(
      { _id: id, companyId },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true },
    );

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    res
      .status(200)
      .json(successResponse("Product updated successfully", product));
  } catch (error) {
    next(error);
  }
};

// Delete a product
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid product ID", 400));
    }

    // Check if product exists
    const product = await Product.findOne({ _id: id, companyId });

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    // Check if product has any inventory
    const inventoryCount = await Inventory.countDocuments({
      productId: id,
      companyId,
      quantity: { $gt: 0 },
    });

    if (inventoryCount > 0) {
      return next(
        new AppError(
          "Cannot delete product with inventory. Please update status to discontinued instead.",
          400,
        ),
      );
    }

    // Delete all inventory records
    await Inventory.deleteMany({ productId: id, companyId });

    // Delete the product
    await Product.deleteOne({ _id: id, companyId });

    res.status(200).json(successResponse("Product deleted successfully", null));
  } catch (error) {
    next(error);
  }
};

// Get categories (unique list)
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = req.company._id;

    // Aggregate to get unique categories
    const categories = await Product.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId.toString()),
        },
      },
      { $group: { _id: "$category" } },
      { $match: { _id: { $ne: null } } },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json(
      successResponse(
        "Categories retrieved successfully",
        categories.map((item) => item._id),
      ),
    );
  } catch (error) {
    next(error);
  }
};

// Import products from CSV
export const importProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = req.company._id;
    const products = req.body.products;

    if (!Array.isArray(products) || products.length === 0) {
      return next(new AppError("No products provided for import", 400));
    }

    // Validate SKU uniqueness
    const skus = products.map((p) => p.sku);
    const existingProducts = await Product.find({
      companyId,
      sku: { $in: skus },
    });

    if (existingProducts.length > 0) {
      const existingSkus = existingProducts.map((p) => p.sku);
      return next(
        new AppError(
          `The following SKUs already exist: ${existingSkus.join(", ")}`,
          409,
        ),
      );
    }

    // Add companyId to each product
    const productsWithCompany = products.map((product) => ({
      ...product,
      companyId,
    }));

    // Insert all products
    const result = await Product.insertMany(productsWithCompany);

    res.status(201).json(
      successResponse("Products imported successfully", {
        count: result.length,
        products: result,
      }),
    );
  } catch (error) {
    next(error);
  }
};
