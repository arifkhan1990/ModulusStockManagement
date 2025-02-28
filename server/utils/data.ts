
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { AppError } from './error';

// Models
import Product from '../models/product.model';
import Inventory from '../models/inventory.model';
import Customer from '../models/customer.model';
import Order from '../models/order.model';
import Invoice from '../models/invoice.model';
import Location from '../models/location.model';

/**
 * Create a data export for specified data types
 * @param companyId Company ID
 * @param dataTypes Array of data types to export (e.g., ['products', 'customers'])
 * @param backupId Backup ID
 * @returns Object with export details (fileUrl, fileSize)
 */
export async function createExport(
  companyId: string,
  dataTypes: string[],
  backupId: string
): Promise<{ fileUrl: string; fileSize: number }> {
  try {
    const data: Record<string, any> = {};
    
    // Fetch data for each requested type
    for (const dataType of dataTypes) {
      switch (dataType) {
        case 'products':
          data.products = await Product.find({ companyId });
          break;
        case 'inventory':
          data.inventory = await Inventory.find({ companyId });
          break;
        case 'customers':
          data.customers = await Customer.find({ companyId });
          break;
        case 'orders':
          data.orders = await Order.find({ companyId });
          break;
        case 'invoices':
          data.invoices = await Invoice.find({ companyId });
          break;
        case 'locations':
          data.locations = await Location.find({ companyId });
          break;
        default:
          // Skip unknown data types
          console.warn(`Unknown data type: ${dataType}`);
      }
    }
    
    // Create export directory if it doesn't exist
    const exportDir = path.join(__dirname, '..', '..', 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }
    
    // Create the export file
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filename = `backup_${companyId}_${backupId}_${timestamp}.json`;
    const filePath = path.join(exportDir, filename);
    
    // Write data to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    // Get file size
    const stats = fs.statSync(filePath);
    
    // In a real application, you would upload this file to a secure storage (e.g., S3)
    // and return the URL. For this example, we'll just return the local path.
    return {
      fileUrl: filePath,
      fileSize: stats.size
    };
  } catch (error) {
    console.error('Export error:', error);
    throw new AppError('Failed to create export', 500);
  }
}

/**
 * Import data from a backup file
 * @param companyId Company ID
 * @param fileUrl URL or path to the backup file
 * @param dataTypes Array of data types to import
 */
export async function importData(
  companyId: string,
  fileUrl: string,
  dataTypes: string[]
): Promise<void> {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Read the backup file
    const fileData = fs.readFileSync(fileUrl, 'utf8');
    const data = JSON.parse(fileData);
    
    // Import data for each requested type
    for (const dataType of dataTypes) {
      switch (dataType) {
        case 'products':
          if (data.products && Array.isArray(data.products)) {
            // Delete existing products for this company
            await Product.deleteMany({ companyId }, { session });
            
            // Insert new products
            if (data.products.length > 0) {
              await Product.insertMany(
                data.products.map((product: any) => ({
                  ...product,
                  _id: new mongoose.Types.ObjectId(product._id)
                })),
                { session }
              );
            }
          }
          break;
        case 'inventory':
          if (data.inventory && Array.isArray(data.inventory)) {
            // Delete existing inventory for this company
            await Inventory.deleteMany({ companyId }, { session });
            
            // Insert new inventory
            if (data.inventory.length > 0) {
              await Inventory.insertMany(
                data.inventory.map((item: any) => ({
                  ...item,
                  _id: new mongoose.Types.ObjectId(item._id)
                })),
                { session }
              );
            }
          }
          break;
        case 'customers':
          if (data.customers && Array.isArray(data.customers)) {
            // Delete existing customers for this company
            await Customer.deleteMany({ companyId }, { session });
            
            // Insert new customers
            if (data.customers.length > 0) {
              await Customer.insertMany(
                data.customers.map((customer: any) => ({
                  ...customer,
                  _id: new mongoose.Types.ObjectId(customer._id)
                })),
                { session }
              );
            }
          }
          break;
        case 'orders':
          if (data.orders && Array.isArray(data.orders)) {
            // Delete existing orders for this company
            await Order.deleteMany({ companyId }, { session });
            
            // Insert new orders
            if (data.orders.length > 0) {
              await Order.insertMany(
                data.orders.map((order: any) => ({
                  ...order,
                  _id: new mongoose.Types.ObjectId(order._id)
                })),
                { session }
              );
            }
          }
          break;
        case 'invoices':
          if (data.invoices && Array.isArray(data.invoices)) {
            // Delete existing invoices for this company
            await Invoice.deleteMany({ companyId }, { session });
            
            // Insert new invoices
            if (data.invoices.length > 0) {
              await Invoice.insertMany(
                data.invoices.map((invoice: any) => ({
                  ...invoice,
                  _id: new mongoose.Types.ObjectId(invoice._id)
                })),
                { session }
              );
            }
          }
          break;
        case 'locations':
          if (data.locations && Array.isArray(data.locations)) {
            // Delete existing locations for this company
            await Location.deleteMany({ companyId }, { session });
            
            // Insert new locations
            if (data.locations.length > 0) {
              await Location.insertMany(
                data.locations.map((location: any) => ({
                  ...location,
                  _id: new mongoose.Types.ObjectId(location._id)
                })),
                { session }
              );
            }
          }
          break;
        default:
          // Skip unknown data types
          console.warn(`Unknown data type: ${dataType}`);
      }
    }
    
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    // Abort the transaction on error
    await session.abortTransaction();
    session.endSession();
    console.error('Import error:', error);
    throw new AppError('Failed to import data', 500);
  }
}
