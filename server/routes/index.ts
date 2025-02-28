import { Express } from 'express';
import { createServer, type Server } from 'http';
import authRoutes from './auth.routes';
import demoRequestRoutes from './demoRequest.routes';
import locationRoutes from './location.routes';
import supplierRoutes from './supplier.routes';
import productRoutes from './product.routes';
import inventoryRoutes from './inventory.routes';
import stockMovementRoutes from './stockMovement.routes';
import paymentRoutes from './payment.routes';
import { setupAuth } from '../auth';
import { requireAuth } from '../middleware/auth';

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // API routes
  app.use('/api', authRoutes);
  app.use('/api', demoRequestRoutes);

  // Protected routes
  app.use('/api/locations', locationRoutes);
  app.use('/api/suppliers', supplierRoutes);
  app.use('/api', productRoutes); 
  app.use('/api/inventory', requireAuth, inventoryRoutes);
  app.use('/api/stock-movements', stockMovementRoutes);
  app.use('/api/payments', paymentRoutes);

  return createServer(app);
}

//Dummy payment.routes.ts file.  Replace with your actual implementation.
//This is a placeholder and needs significant expansion.
import { Router } from 'express';
const paymentRouter = Router();

paymentRouter.post('/', (req,res) => {
    res.send('Payment route placeholder');
})

export default paymentRouter;