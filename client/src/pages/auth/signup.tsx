
import React from 'react';
import { Link } from 'react-router-dom';

export default function Signup() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        <p className="text-center text-muted-foreground">Signup form will be implemented here</p>
        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-primary hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
