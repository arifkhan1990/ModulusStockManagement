
import { createContext } from "react";
import { type User } from "@shared/schema";

export type LoginData = {
  username: string;
  password: string;
};

export type InsertUser = {
  username: string;
  email: string;
  password: string;
  name: string;
};

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (data: LoginData) => void;
  logout: () => void;
  register: (data: InsertUser) => void;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isRegistering: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);
