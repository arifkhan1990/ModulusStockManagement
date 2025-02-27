
import { createContext } from 'react';
import { User } from '@/types';
import { UseMutationResult } from '@tanstack/react-query';

export type LoginData = {
  email: string;
  password: string;
};

export type InsertUser = {
  email: string;
  password: string;
  name?: string;
};

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, InsertUser>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
