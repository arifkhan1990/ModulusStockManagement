import { Router } from "express";
import { requireAuth, restrictTo } from "../middleware/auth";
import { cacheResponse } from "../middleware/cache";
import * as locationController from "../controllers/location.controller";

const router = Router();

// Apply auth middleware to all routes
router.use(requireAuth);

// Location routes
router.post(
  "/",
  restrictTo("admin", "manager"),
  locationController.createLocation,
);
router.get("/", cacheResponse(300), locationController.getLocations);
router.get("/:id", cacheResponse(300), locationController.getLocation);
router.put(
  "/:id",
  restrictTo("admin", "manager"),
  locationController.updateLocation,
);
router.delete(
  "/:id",
  restrictTo("admin", "manager"),
  locationController.deleteLocation,
);

export default router;
