// Import dependencies
import { Request, Response } from 'express';
import { Product, Category } from '../models';

// Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// Get public products
export const getPublicProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ isPublic: true });
    res.json(products);
  } catch (error) {
    console.error('Error fetching public products:', error);
    res.status(500).json({ message: 'Failed to fetch public products' });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

// Create new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

// Bulk create products
export const bulkCreateProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.insertMany(req.body);
    res.status(201).json(products);
  } catch (error) {
    console.error('Error bulk creating products:', error);
    res.status(500).json({ message: 'Failed to bulk create products' });
  }
};

// Bulk update products
export const bulkUpdateProducts = async (req: Request, res: Response) => {
  try {
    const bulkOps = req.body.map((product: any) => ({
      updateOne: {
        filter: { _id: product._id },
        update: product
      }
    }));
    await Product.bulkWrite(bulkOps);
    res.json({ message: 'Products updated successfully' });
  } catch (error) {
    console.error('Error bulk updating products:', error);
    res.status(500).json({ message: 'Failed to bulk update products' });
  }
};

// Adjust stock
export const adjustStock = async (req: Request, res: Response) => {
  try {
    const { adjustment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.stockQuantity += adjustment;
    await product.save();

    res.json(product);
  } catch (error) {
    console.error('Error adjusting stock:', error);
    res.status(500).json({ message: 'Failed to adjust stock' });
  }
};

// Transfer stock
export const transferStock = async (req: Request, res: Response) => {
  try {
    const { fromProductId, toProductId, quantity, reason } = req.body;

    // Find source and destination products
    const sourceProduct = await Product.findById(fromProductId);
    const destProduct = await Product.findById(toProductId);

    if (!sourceProduct || !destProduct) {
      return res.status(404).json({ message: 'One or both products not found' });
    }

    // Check if source has enough stock
    if (sourceProduct.stockQuantity < quantity) {
      return res.status(400).json({ message: 'Not enough stock to transfer' });
    }

    // Update stock quantities
    sourceProduct.stockQuantity -= quantity;
    destProduct.stockQuantity += quantity;

    await sourceProduct.save();
    await destProduct.save();

    res.json({ 
      message: 'Stock transferred successfully',
      sourceProduct,
      destProduct
    });
  } catch (error) {
    console.error('Error transferring stock:', error);
    res.status(500).json({ message: 'Failed to transfer stock' });
  }
};

// Get low stock products
export const getLowStockProducts = async (req: Request, res: Response) => {
  try {
    const threshold = req.query.threshold ? parseInt(req.query.threshold as string) : 10;
    const products = await Product.find({ stockQuantity: { $lte: threshold } });
    res.json(products);
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({ message: 'Failed to fetch low stock products' });
  }
};

// Get categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

// Create category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Failed to create category' });
  }
};

// Update category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Failed to update category' });
  }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Failed to delete category' });
  }
};

// Product analytics
export const getProductSalesAnalytics = async (req: Request, res: Response) => {
  try {
    // Mock analytics data for now
    const analytics = {
      totalSales: 12500,
      topSellingProducts: [
        { id: '1', name: 'Product A', sales: 500 },
        { id: '2', name: 'Product B', sales: 350 },
        { id: '3', name: 'Product C', sales: 275 }
      ],
      salesByCategory: [
        { category: 'Electronics', sales: 5000 },
        { category: 'Clothing', sales: 3500 },
        { category: 'Home Goods', sales: 2500 }
      ]
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error getting product sales analytics:', error);
    res.status(500).json({ message: 'Failed to get product sales analytics' });
  }
};

// Stock level analytics
export const getStockLevelAnalytics = async (req: Request, res: Response) => {
  try {
    // Mock analytics data for now
    const analytics = {
      totalStock: 2500,
      stockByCategory: [
        { category: 'Electronics', stock: 800 },
        { category: 'Clothing', stock: 1200 },
        { category: 'Home Goods', stock: 500 }
      ],
      lowStockItems: 15,
      outOfStockItems: 3
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error getting stock level analytics:', error);
    res.status(500).json({ message: 'Failed to get stock level analytics' });
  }
};