import * as storageService from './services/storage.service';

// Export all service functions 
export const storage = {
  getUser: storageService.getUser,
  getUserByUsername: storageService.getUserByUsername,
  getUserByProviderId: storageService.getUserByProviderId,
  createUser: storageService.createUser,
  createDemoRequest: storageService.createDemoRequest,
  getLocations: storageService.getLocations,
  getLocation: storageService.getLocation,
  createLocation: storageService.createLocation,
  updateLocation: storageService.updateLocation,
  deleteLocation: storageService.deleteLocation,
  getSuppliers: storageService.getSuppliers,
  getSupplier: storageService.getSupplier,
  createSupplier: storageService.createSupplier,
  updateSupplier: storageService.updateSupplier,
  deleteSupplier: storageService.deleteSupplier,
  getProducts: storageService.getProducts,
  getProduct: storageService.getProduct,
  createProduct: storageService.createProduct,
  updateProduct: storageService.updateProduct,
  deleteProduct: storageService.deleteProduct,
  getInventory: storageService.getInventory,
  getInventoryByLocation: storageService.getInventoryByLocation,
  createInventory: storageService.createInventory,
  updateInventory: storageService.updateInventory,
  createStockMovement: storageService.createStockMovement,
  getStockMovements: storageService.getStockMovements,
  getAllStockMovements: storageService.getAllStockMovements
};