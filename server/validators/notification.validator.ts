import { body, param, query } from "express-validator";
import mongoose from "mongoose";
import { validateResource } from "../middleware/validator";

// Create notification validator
export const createNotificationValidator = [
  body("recipientType")
    .isIn(["subscriber", "customer", "employee"])
    .withMessage("Invalid recipient type"),

  body("recipientId")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid recipient ID"),

  body("recipientEmail")
    .optional()
    .isEmail()
    .withMessage("Invalid email address"),

  body("recipientPhone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Invalid phone number"),

  body("channel")
    .isIn([
      "email",
      "push",
      "sms",
      "messenger",
      "discord",
      "whatsapp",
      "telegram",
    ])
    .withMessage("Invalid notification channel"),

  body("eventType")
    .isIn([
      "product_added",
      "order_placed",
      "order_shipped",
      "order_delivered",
      "payment_received",
      "payment_due",
      "payment_overdue",
      "invoice_created",
      "invoice_shared",
      "report_generated",
      "report_shared",
      "low_stock",
      "support_ticket_created",
      "support_ticket_resolved",
      "custom",
    ])
    .withMessage("Invalid event type"),

  body("title").isString().trim().notEmpty().withMessage("Title is required"),

  body("content")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Content is required"),

  body("referenceId")
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid reference ID"),

  body("referenceType")
    .optional()
    .isIn([
      "order",
      "invoice",
      "product",
      "payment",
      "customer",
      "support_ticket",
    ])
    .withMessage("Invalid reference type"),

  body("metadata")
    .optional()
    .isObject()
    .withMessage("Metadata must be an object"),

  validateResource,
];

// Mark notification as read validator
export const markAsReadValidator = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid notification ID"),

  validateResource,
];

// Mark multiple notifications as read validator
export const markMultipleAsReadValidator = [
  body("ids").isArray().withMessage("IDs must be an array"),

  body("ids.*")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid notification ID"),

  validateResource,
];

// Update notification preference validator
export const updateNotificationPreferenceValidator = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid preference ID"),

  body("channels")
    .optional()
    .isObject()
    .withMessage("Channels must be an object"),

  body("channels.email")
    .optional()
    .isBoolean()
    .withMessage("Email channel must be a boolean"),

  body("channels.push")
    .optional()
    .isBoolean()
    .withMessage("Push channel must be a boolean"),

  body("channels.sms")
    .optional()
    .isBoolean()
    .withMessage("SMS channel must be a boolean"),

  body("channels.messenger")
    .optional()
    .isBoolean()
    .withMessage("Messenger channel must be a boolean"),

  body("channels.discord")
    .optional()
    .isBoolean()
    .withMessage("Discord channel must be a boolean"),

  body("templates")
    .optional()
    .isObject()
    .withMessage("Templates must be an object"),

  body("enabled")
    .optional()
    .isBoolean()
    .withMessage("Enabled must be a boolean"),

  validateResource,
];

// Get notifications validator
export const getNotificationsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("recipientType")
    .optional()
    .isIn(["subscriber", "customer", "employee"])
    .withMessage("Invalid recipient type"),

  query("channel")
    .optional()
    .isIn([
      "email",
      "push",
      "sms",
      "messenger",
      "discord",
      "whatsapp",
      "telegram",
    ])
    .withMessage("Invalid notification channel"),

  query("eventType")
    .optional()
    .isIn([
      "product_added",
      "order_placed",
      "order_shipped",
      "order_delivered",
      "payment_received",
      "payment_due",
      "payment_overdue",
      "invoice_created",
      "invoice_shared",
      "report_generated",
      "report_shared",
      "low_stock",
      "support_ticket_created",
      "support_ticket_resolved",
      "custom",
    ])
    .withMessage("Invalid event type"),

  query("status")
    .optional()
    .isIn(["pending", "sent", "delivered", "failed"])
    .withMessage("Invalid status"),

  query("isRead")
    .optional()
    .isIn(["true", "false"])
    .withMessage("isRead must be true or false"),

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

export default {
  createNotificationValidator,
  markAsReadValidator,
  markMultipleAsReadValidator,
  updateNotificationPreferenceValidator,
  getNotificationsValidator,
};
