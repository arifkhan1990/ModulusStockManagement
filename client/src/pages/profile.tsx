
import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p>{user?.name}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p>{user?.email}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Username</h3>
              <p>{user?.username}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
              <p>{user?.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
