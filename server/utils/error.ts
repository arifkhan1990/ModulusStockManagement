
export class AppError extends Error {
  status: number;
  
  constructor(message: string, status: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err: any, req: any, res: any, next: any) => {
  console.error("Error:", err);
  
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: {
        message: err.message,
        status: err.status,
      },
    });
  }
  
  // Handle mongoose validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: {
        message: "Validation Error",
        details: Object.values(err.errors).map((e: any) => e.message),
        status: 400,
      },
    });
  }
  
  // Handle mongoose duplicate key errors
  if (err.code === 11000) {
    return res.status(409).json({
      error: {
        message: "Duplicate Error",
        details: `${Object.keys(err.keyValue)} already exists`,
        status: 409,
      },
    });
  }
  
  // Default server error
  return res.status(500).json({
    error: {
      message: "Internal Server Error",
      status: 500,
    },
  });
};
