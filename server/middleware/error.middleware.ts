
import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../utils/error";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  errorHandler(err, req, res, next);
};
