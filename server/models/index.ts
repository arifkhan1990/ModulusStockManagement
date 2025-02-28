
import User from './user.model';
import mongoose from 'mongoose';
import { 
  DemoRequest, 
  Location, 
  Supplier, 
  Product, 
  Inventory, 
  StockMovement 
} from '@shared/schema';

export {
  User,
  DemoRequest,
  Location,
  Supplier,
  Product,
  Inventory,
  StockMovement
};

export const db = { mongoose };
