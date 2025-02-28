
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import SupportTicket from '../models/support-ticket.model';
import { AppError } from '../utils/error';
import { successResponse } from '../utils/helpers';
import SystemLog from '../models/system-log.model';
import { sendEmail } from '../utils/email';

// Create a new support ticket
export const createTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.company._id;
    
    const ticketData = {
      ...req.body,
      companyId,
      status: 'open',
      createdBy: req.user._id,
      messages: [{
        sender: req.user._id,
        message: req.body.description,
        attachments: req.body.attachments || [],
        createdAt: new Date(),
        isAdminResponse: false
      }]
    };

    const ticket = await SupportTicket.create(ticketData);

    // Create system log
    await SystemLog.create({
      companyId,
      userId: req.user._id,
      action: 'support_ticket_created',
      resource: 'support_ticket',
      resourceId: ticket._id,
      timestamp: new Date(),
      ipAddress: req.ip,
      details: {
        ticketId: ticket._id,
        subject: ticket.subject,
        priority: ticket.priority
      }
    });

    // Send notification email to admin (placeholder for actual implementation)
    try {
      await sendEmail({
        to: process.env.SUPPORT_EMAIL || 'support@example.com',
        subject: `New Support Ticket: ${ticket.subject}`,
        html: `
          <h1>New Support Ticket</h1>
          <p><strong>Subject:</strong> ${ticket.subject}</p>
          <p><strong>Priority:</strong> ${ticket.priority}</p>
          <p><strong>Description:</strong> ${ticket.description}</p>
          <p><strong>Company ID:</strong> ${companyId}</p>
          <p><strong>Created By:</strong> ${req.user._id}</p>
        `
      });
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json(successResponse('Support ticket created successfully', ticket));
  } catch (error) {
    next(error);
  }
};

// Get all tickets for a company
export const getTickets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.company._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build query based on filters
    const queryObj: any = { companyId };

    // Filter by status if provided
    if (req.query.status) {
      queryObj.status = req.query.status;
    }

    // Filter by priority if provided
    if (req.query.priority) {
      queryObj.priority = req.query.priority;
    }

    // Search by subject
    if (req.query.search) {
      queryObj.subject = new RegExp(req.query.search as string, 'i');
    }

    // Count total tickets
    const total = await SupportTicket.countDocuments(queryObj);

    // Fetch tickets with pagination
    const tickets = await SupportTicket.find(queryObj)
      .select('subject status priority createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(
      successResponse('Support tickets retrieved successfully', {
        tickets,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      })
    );
  } catch (error) {
    next(error);
  }
};

// Get a single ticket
export const getTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid ticket ID', 400));
    }

    const ticket = await SupportTicket.findOne({ _id: id, companyId })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('messages.sender', 'name email');

    if (!ticket) {
      return next(new AppError('Support ticket not found', 404));
    }

    res.status(200).json(successResponse('Support ticket retrieved successfully', ticket));
  } catch (error) {
    next(error);
  }
};

// Add a message to a ticket
export const addMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    const { message, attachments } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid ticket ID', 400));
    }

    if (!message) {
      return next(new AppError('Message is required', 400));
    }

    const ticket = await SupportTicket.findOne({ _id: id, companyId });

    if (!ticket) {
      return next(new AppError('Support ticket not found', 404));
    }

    const newMessage = {
      sender: req.user._id,
      message,
      attachments: attachments || [],
      createdAt: new Date(),
      isAdminResponse: req.user.role === 'admin'
    };

    // Update ticket with new message and status
    const updatedTicket = await SupportTicket.findOneAndUpdate(
      { _id: id, companyId },
      {
        $push: { messages: newMessage },
        status: req.user.role === 'admin' ? 'in_progress' : ticket.status,
        updatedBy: req.user._id,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    // Log activity
    await SystemLog.create({
      companyId,
      userId: req.user._id,
      action: 'support_ticket_message_added',
      resource: 'support_ticket',
      resourceId: ticket._id,
      timestamp: new Date(),
      ipAddress: req.ip,
      details: {
        ticketId: ticket._id,
        isAdminResponse: req.user.role === 'admin'
      }
    });

    // Send notification email to the other party
    try {
      // If user added message, notify admin
      if (req.user.role !== 'admin') {
        await sendEmail({
          to: process.env.SUPPORT_EMAIL || 'support@example.com',
          subject: `New Message on Ticket: ${ticket.subject}`,
          html: `
            <h1>New Message on Support Ticket</h1>
            <p><strong>Ticket:</strong> ${ticket.subject}</p>
            <p><strong>Message:</strong> ${message}</p>
            <p><strong>Company ID:</strong> ${companyId}</p>
            <p><strong>Sender:</strong> ${req.user._id}</p>
          `
        });
      } 
      // If admin added message, notify ticket creator
      else {
        // Get user's email (would need to be populated in a real implementation)
        // Implement later once we have the User model available
      }
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(200).json(successResponse('Message added successfully', updatedTicket));
  } catch (error) {
    next(error);
  }
};

// Update ticket status
export const updateTicketStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const companyId = req.company._id;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid ticket ID', 400));
    }

    if (!status || !['open', 'in_progress', 'resolved', 'closed'].includes(status)) {
      return next(new AppError('Valid status is required', 400));
    }

    const updateData: any = {
      status,
      updatedBy: req.user._id,
      updatedAt: new Date()
    };

    // If status is 'closed', add closedAt date
    if (status === 'closed') {
      updateData.closedAt = new Date();
    }

    const ticket = await SupportTicket.findOneAndUpdate(
      { _id: id, companyId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!ticket) {
      return next(new AppError('Support ticket not found', 404));
    }

    // Log status change
    await SystemLog.create({
      companyId,
      userId: req.user._id,
      action: 'support_ticket_status_updated',
      resource: 'support_ticket',
      resourceId: ticket._id,
      timestamp: new Date(),
      ipAddress: req.ip,
      details: {
        ticketId: ticket._id,
        newStatus: status
      }
    });

    res.status(200).json(successResponse('Ticket status updated successfully', ticket));
  } catch (error) {
    next(error);
  }
};

export default {
  createTicket,
  getTickets,
  getTicket,
  addMessage,
  updateTicketStatus
};
