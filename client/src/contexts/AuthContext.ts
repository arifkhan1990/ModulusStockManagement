import { createContext } from "react";
import { type User } from "@shared/schema";

// Define the shape of login data
export type LoginData = {
  username: string;
  password: string;
};

// Define the shape of registration data
export type InsertUser = {
  username: string;
  email: string;
  password: string;
  name: string;
};

// Define the AuthContext type
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

// Create the context with an initial value of undefined
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
