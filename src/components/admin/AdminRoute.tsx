
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, userProfile, loading } = useAuth();

  // Show loading spinner while checking authentication and role
  if (loading) {
    return (
      <div className="min-h-screen bg-pearl-50 flex items-center justify-center">
        <Card className="w-96 bg-pearl-50 border-olive-200">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-olive-600 animate-pulse" />
            <h2 className="text-xl font-semibold text-olive-800 mb-2">Verifying Access</h2>
            <p className="text-olive-600">Checking your permissions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Show access denied if not admin
  if (!userProfile || (userProfile.role !== 'admin' && userProfile.role !== 'super_admin')) {
    return (
      <div className="min-h-screen bg-pearl-50 flex items-center justify-center">
        <Card className="w-96 bg-pearl-50 border-red-200">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-600" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Access Denied</h2>
            <p className="text-red-600 mb-4">
              You don't have permission to access the admin panel.
            </p>
            <p className="text-sm text-red-500">
              Contact your administrator if you believe this is an error.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
