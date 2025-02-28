import { Router } from "express";
import { requireAuth, restrictTo } from "../middleware/auth";
import { cacheMiddleware } from "../middleware/cache"; // Corrected import
import * as inventoryController from "../controllers/inventory.controller";

const router = Router();

// Apply auth middleware to all routes
router.use(requireAuth);

// Inventory routes
router.get(
  "/low-stock",
  cacheMiddleware(300), // Corrected function call
  inventoryController.getLowStockInventory,
);
router.get(
  "/product/:productId",
  cacheMiddleware(60), // Corrected function call
  inventoryController.getProductInventory,
);
router.put(
  "/product/:productId/location/:locationId",
  restrictTo("admin", "manager", "staff"),
  inventoryController.updateInventory,
);
router.post(
  "/product/:productId/location/:locationId/adjust",
  restrictTo("admin", "manager", "staff"),
  inventoryController.adjustInventory,
);
router.post(
  "/product/:productId/transfer",
  restrictTo("admin", "manager", "staff"),
  inventoryController.transferInventory,
);

export default router;