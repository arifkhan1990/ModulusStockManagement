
import { Request } from "express";
import { IUser } from "../models/user.model";

export async function createSession(req: Request, user: IUser): Promise<void> {
  if (!req.session) {
    throw new Error("Session middleware not configured");
  }
  
  req.session.userId = user.id;
  
  return new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function destroySession(req: Request): void {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }
    });
  }
}
