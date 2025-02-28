import mongoose from 'mongoose';
import { 
  User, 
  Location,
  Supplier,
  Product,
  Inventory,
  StockMovement,
  Order,
  Payment
} from '../models';
import { 
  InsertUser, 
  InsertDemoRequest,
  InsertLocation,
  InsertSupplier,
  InsertProduct,
  InsertInventory,
  InsertStockMovement 
} from '@shared/schema';

// User-related operations
export const getUser = async (id: string) => {
  return await User.findById(id).select('-password');
};

export const getUserByUsername = async (username: string) => {
  return await User.findOne({ username });
};

export const getUserByProviderId = async (provider: string, providerId: string) => {
  return await User.findOne({ provider, providerId });
};

export const createUser = async (userData: InsertUser) => {
  const user = new User(userData);
  await user.save();
  // Remove password from response
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

// Demo Request operations
export const createDemoRequest = async (demoRequestData: InsertDemoRequest) => {
  const demoRequest = new DemoRequest(demoRequestData);
  return await demoRequest.save();
};

// Location operations
export const getLocations = async () => {
  return await Location.find({ isActive: true });
};

export const getLocation = async (id: string) => {
  return await Location.findById(id);
};

export const createLocation = async (locationData: InsertLocation) => {
  const location = new Location(locationData);
  return await location.save();
};

export const updateLocation = async (id: string, locationData: Partial<InsertLocation>) => {
  return await Location.findByIdAndUpdate(
    id, 
    { ...locationData, updatedAt: new Date() }, 
    { new: true }
  );
};

export const deleteLocation = async (id: string) => {
  return await Location.findByIdAndUpdate(
    id, 
    { isActive: false, updatedAt: new Date() }, 
    { new: true }
  );
};

// Supplier operations
export const getSuppliers = async () => {
  return await Supplier.find({ isActive: true });
};

export const getSupplier = async (id: string) => {
  return await Supplier.findById(id);
};

export const createSupplier = async (supplierData: InsertSupplier) => {
  const supplier = new Supplier(supplierData);
  return await supplier.save();
};

export const updateSupplier = async (id: string, supplierData: Partial<InsertSupplier>) => {
  return await Supplier.findByIdAndUpdate(
    id, 
    { ...supplierData, updatedAt: new Date() }, 
    { new: true }
  );
};

export const deleteSupplier = async (id: string) => {
  return await Supplier.findByIdAndUpdate(
    id, 
    { isActive: false, updatedAt: new Date() }, 
    { new: true }
  );
};

// Product operations
export const getProducts = async () => {
  return await Product.find().populate('supplierId');
};

export const getProduct = async (id: string) => {
  return await Product.findById(id).populate('supplierId');
};

export const createProduct = async (productData: InsertProduct) => {
  const product = new Product({
    ...productData,
    supplierId: productData.supplierId ? new mongoose.Types.ObjectId(productData.supplierId) : undefined
  });
  return await product.save();
};

export const updateProduct = async (id: string, productData: Partial<InsertProduct>) => {
  const updateData = { ...productData, updatedAt: new Date() };

  if (productData.supplierId) {
    updateData.supplierId = new mongoose.Types.ObjectId(productData.supplierId);
  }

  return await Product.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteProduct = async (id: string) => {
  return await Product.findByIdAndDelete(id);
};

// Inventory operations
export const getInventory = async (productId: string, locationId: string) => {
  return await Inventory.findOne({ 
    productId: new mongoose.Types.ObjectId(productId), 
    locationId: new mongoose.Types.ObjectId(locationId) 
  });
};

export const getInventoryByLocation = async (locationId: string) => {
  return await Inventory.find({ 
    locationId: new mongoose.Types.ObjectId(locationId) 
  }).populate('productId');
};

export const createInventory = async (inventoryData: InsertInventory) => {
  const inventory = new Inventory({
    ...inventoryData,
    productId: new mongoose.Types.ObjectId(inventoryData.productId),
    locationId: new mongoose.Types.ObjectId(inventoryData.locationId)
  });
  return await inventory.save();
};

export const updateInventory = async (id: string, inventoryData: any) => {
  return await Inventory.findByIdAndUpdate(
    id, 
    { ...inventoryData, lastUpdated: new Date() }, 
    { new: true }
  );
};

// Stock Movement operations
export const createStockMovement = async (movementData: InsertStockMovement) => {
  const movement = new StockMovement({
    ...movementData,
    productId: new mongoose.Types.ObjectId(movementData.productId),
    fromLocationId: new mongoose.Types.ObjectId(movementData.fromLocationId),
    toLocationId: movementData.toLocationId ? new mongoose.Types.ObjectId(movementData.toLocationId) : undefined,
    createdBy: new mongoose.Types.ObjectId(movementData.createdBy)
  });
  return await movement.save();
};

export const getStockMovements = async (productId: string) => {
  return await StockMovement.find({ 
    productId: new mongoose.Types.ObjectId(productId) 
  })
  .populate('productId')
  .populate('fromLocationId')
  .populate('toLocationId')
  .populate('createdBy');
};

export const getAllStockMovements = async () => {
  return await StockMovement.find()
  .populate('productId')
  .populate('fromLocationId')
  .populate('toLocationId')
  .populate('createdBy');
};


// Payment operations
export const getPayments = async (query = {}, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  return await Payment.find(query)
    .sort({ paymentDate: -1 })
    .skip(skip)
    .limit(limit)
    .populate('orderId', 'orderNumber customerName total')
    .populate('createdBy', 'name');
};

export const getPayment = async (id: string) => {
  return await Payment.findById(id)
    .populate('orderId')
    .populate('createdBy', 'name');
};

export const createPayment = async (paymentData: any) => {
  const payment = new Payment(paymentData);
  await payment.save();

  // Update order payment status
  const order = await Order.findById(payment.orderId);
  if (order) {
    const orderPayments = await Payment.find({ 
      orderId: order._id, 
      status: 'completed' 
    });

    const totalPaid = orderPayments.reduce((sum, p) => sum + p.amount, 0);

    let paymentStatus = 'pending';
    if (totalPaid >= order.total) {
      paymentStatus = 'paid';
    } else if (totalPaid > 0) {
      paymentStatus = 'partially paid';
    }

    await Order.findByIdAndUpdate(payment.orderId, { paymentStatus });
  }

  return payment;
};

export const updatePaymentStatus = async (id: string, status: string, updatedBy: string) => {
  const payment = await Payment.findByIdAndUpdate(
    id,
    { status, updatedBy },
    { new: true }
  );

  if (payment) {
    // Update order payment status
    const order = await Order.findById(payment.orderId);
    if (order) {
      const orderPayments = await Payment.find({ 
        orderId: order._id, 
        status: 'completed' 
      });

      const totalPaid = orderPayments.reduce((sum, p) => sum + p.amount, 0);

      let paymentStatus = 'pending';
      if (totalPaid >= order.total) {
        paymentStatus = 'paid';
      } else if (totalPaid > 0) {
        paymentStatus = 'partially paid';
      }

      await Order.findByIdAndUpdate(payment.orderId, { paymentStatus });
    }
  }

  return payment;
};