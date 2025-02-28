
import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export default function TestAuthPage() {
  const { user, isLoading, isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
          <CardDescription>Verifying database authentication status</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading authentication status...</p>
          ) : isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-green-600 font-semibold">✅ Authentication working properly</p>
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">User Information:</h3>
                <p><strong>ID:</strong> {user?.id}</p>
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Username:</strong> {user?.username}</p>
                <p><strong>Role:</strong> {user?.role}</p>
              </div>
            </div>
          ) : (
            <p className="text-amber-600">
              Not authenticated. Please <a href="/auth" className="underline">sign in</a> to test.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
