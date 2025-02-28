
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import Invoice from '../models/invoice.model';
import Company from '../models/company.model';
import Customer from '../models/customer.model';
import SystemLog from '../models/system-log.model';
import config from '../config';

// File generation result type
interface FileGenerationResult {
  success: boolean;
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  error?: string;
}

/**
 * Generate a document file in the specified format
 * @param document Document object (invoice, report, etc.)
 * @param documentType Document type ('invoice', 'report', etc.)
 * @param format File format ('pdf', 'csv', 'xlsx', 'json')
 * @returns File generation result
 */
export const generateDocumentFile = async (
  document: any,
  documentType: string,
  format: string
): Promise<FileGenerationResult> => {
  try {
    // Generate a unique filename
    const fileName = `${documentType}_${document._id}_${Date.now()}.${format}`;
    
    // Create file based on document type and format
    let fileContent: any;
    let filePath: string;
    
    switch (documentType) {
      case 'invoice':
        fileContent = await generateInvoiceFile(document, format);
        break;
      // Add more document types as needed
      default:
        return {
          success: false,
          error: `Unsupported document type: ${documentType}`
        };
    }
    
    if (!fileContent) {
      return {
        success: false,
        error: `Failed to generate ${format} file for ${documentType}`
      };
    }
    
    // In a production environment, we would upload the file to a storage service (e.g., AWS S3)
    // For now, we'll simulate storing it locally
    
    // Create directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Write file to disk
    filePath = path.join(uploadDir, fileName);
    
    if (format === 'json') {
      fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2));
    } else if (format === 'csv') {
      fs.writeFileSync(filePath, fileContent);
    } else {
      // For other formats, assume binary content
      fs.writeFileSync(filePath, fileContent);
    }
    
    // Get file size
    const stats = fs.statSync(filePath);
    
    // Generate file URL
    // In production, this would be a signed URL to the cloud storage file
    const fileUrl = `${config.baseUrl}/api/downloads/${fileName}`;
    
    return {
      success: true,
      fileName,
      fileUrl,
      fileSize: stats.size
    };
  } catch (error) {
    console.error(`Error generating ${format} file:`, error);
    
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generate an invoice file in the specified format
 * @param invoice Invoice document
 * @param format File format ('pdf', 'csv', 'xlsx', 'json')
 * @returns File content
 */
const generateInvoiceFile = async (invoice: any, format: string): Promise<any> => {
  try {
    // Get additional data needed for the invoice
    const company = await Company.findById(invoice.companyId);
    const customer = await Customer.findById(invoice.customerId);
    
    // Generate file based on format
    switch (format) {
      case 'pdf':
        return generateInvoicePdf(invoice, company, customer);
      case 'csv':
        return generateInvoiceCsv(invoice);
      case 'xlsx':
        return generateInvoiceXlsx(invoice);
      case 'json':
        return generateInvoiceJson(invoice, company, customer);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  } catch (error) {
    console.error(`Error generating invoice ${format}:`, error);
    throw error;
  }
};

/**
 * Generate an invoice PDF
 * @param invoice Invoice document
 * @param company Company document
 * @param customer Customer document
 * @returns PDF content
 */
const generateInvoicePdf = async (invoice: any, company: any, customer: any): Promise<Buffer> => {
  try {
    // In a real implementation, you would use a PDF generation library like PDFKit
    // For now, we'll simulate PDF generation
    
    // For simulation purposes, return a Buffer with some content
    return Buffer.from(`Invoice PDF for ${invoice._id}`);
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    throw error;
  }
};

/**
 * Generate an invoice CSV
 * @param invoice Invoice document
 * @returns CSV content
 */
const generateInvoiceCsv = async (invoice: any): Promise<string> => {
  try {
    // Generate CSV header
    let csv = 'Item,Description,Quantity,Price,Total\n';
    
    // Add items
    for (const item of invoice.items) {
      csv += `"${item.name}","${item.description || ''}",${item.quantity},${item.price},${item.total}\n`;
    }
    
    // Add totals
    csv += `\n"","","","Subtotal",${invoice.subtotal}\n`;
    csv += `"","","","Tax (${invoice.taxRate}%)",${invoice.taxAmount}\n`;
    csv += `"","","","Discount",${invoice.discountAmount}\n`;
    csv += `"","","","Total",${invoice.total}\n`;
    
    return csv;
  } catch (error) {
    console.error('Error generating invoice CSV:', error);
    throw error;
  }
};

/**
 * Generate an invoice XLSX
 * @param invoice Invoice document
 * @returns XLSX content
 */
const generateInvoiceXlsx = async (invoice: any): Promise<Buffer> => {
  try {
    // In a real implementation, you would use a library like ExcelJS
    // For now, we'll simulate XLSX generation
    
    // For simulation purposes, return a Buffer with some content
    return Buffer.from(`Invoice XLSX for ${invoice._id}`);
  } catch (error) {
    console.error('Error generating invoice XLSX:', error);
    throw error;
  }
};

/**
 * Generate an invoice JSON
 * @param invoice Invoice document
 * @param company Company document
 * @param customer Customer document
 * @returns JSON content
 */
const generateInvoiceJson = async (invoice: any, company: any, customer: any): Promise<any> => {
  try {
    // Create a clean JSON representation of the invoice
    return {
      id: invoice._id.toString(),
      invoiceNumber: invoice.invoiceNumber,
      date: invoice.date,
      dueDate: invoice.dueDate,
      status: invoice.status,
      company: {
        id: company._id.toString(),
        name: company.name,
        email: company.email,
        phone: company.phone,
        address: company.address
      },
      customer: {
        id: customer._id.toString(),
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.billingAddress
      },
      items: invoice.items.map(item => ({
        id: item._id.toString(),
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      })),
      subtotal: invoice.subtotal,
      taxRate: invoice.taxRate,
      taxAmount: invoice.taxAmount,
      discountAmount: invoice.discountAmount,
      total: invoice.total,
      notes: invoice.notes,
      terms: invoice.terms,
      createdAt: invoice.createdAt
    };
  } catch (error) {
    console.error('Error generating invoice JSON:', error);
    throw error;
  }
};

export const documentService = {
  generateDocumentFile
};
