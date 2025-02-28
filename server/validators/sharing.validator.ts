import { body, param, query } from "express-validator";
import mongoose from "mongoose";
import { validateResource } from "../middleware/validator";

// Create sharing validator
export const createSharingValidator = [
  body("documentId")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid document ID"),

  body("documentType")
    .isIn(["invoice", "report", "order", "product", "customer", "payment"])
    .withMessage("Invalid document type"),

  body("channel")
    .isIn([
      "facebook",
      "messenger",
      "twitter",
      "linkedin",
      "discord",
      "email",
      "whatsapp",
      "instagram",
      "tiktok",
      "direct_link",
    ])
    .withMessage("Invalid sharing channel"),

  body("message")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Message must be at most 500 characters"),

  body("expiresInHours")
    .optional()
    .isInt({ min: 1, max: 720 })
    .withMessage("Expiration time must be between 1 and 720 hours (30 days)"),

  validateResource,
];

// Get sharings validator
export const getSharingsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("documentType")
    .optional()
    .isIn(["invoice", "report", "order", "product", "customer", "payment"])
    .withMessage("Invalid document type"),

  query("channel")
    .optional()
    .isIn([
      "facebook",
      "messenger",
      "twitter",
      "linkedin",
      "discord",
      "email",
      "whatsapp",
      "instagram",
      "tiktok",
      "direct_link",
    ])
    .withMessage("Invalid sharing channel"),

  query("status")
    .optional()
    .isIn(["active", "expired", "revoked", "error"])
    .withMessage("Invalid status"),

  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date"),

  validateResource,
];

// Revoke sharing validator
export const revokeSharingValidator = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid sharing ID"),

  validateResource,
];

// Create download validator
export const createDownloadValidator = [
  body("documentId")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid document ID"),

  body("documentType")
    .isIn(["invoice", "report", "order", "product", "customer", "payment"])
    .withMessage("Invalid document type"),

  body("format")
    .isIn(["pdf", "csv", "xlsx", "json"])
    .withMessage("Invalid format"),

  body("sharingId")
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid sharing ID"),

  validateResource,
];

export default {
  createSharingValidator,
  getSharingsValidator,
  revokeSharingValidator,
  createDownloadValidator,
};
