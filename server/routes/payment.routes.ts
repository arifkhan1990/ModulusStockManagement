import express from "express";
import * as paymentController from "../controllers/payment.controller";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

// Payment routes
router.post("/", paymentController.createPayment);
router.get("/", paymentController.getPayments);
router.get("/statistics", paymentController.getPaymentStatistics);
router.get("/:id", paymentController.getPayment);
router.patch("/:id", paymentController.updatePayment);

export default router;