
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction, Clock } from 'lucide-react';

const MaintenanceMode = () => {
  return (
    <div className="min-h-screen bg-pearl-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-olive-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 bg-olive-100 rounded-full flex items-center justify-center">
            <Construction className="h-6 w-6 text-olive-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-olive-800">
            Site Under Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-olive-600">
            We're currently performing scheduled maintenance to improve your experience.
          </p>
          <div className="flex items-center justify-center space-x-2 text-olive-500">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Please check back soon</span>
          </div>
          <p className="text-sm text-olive-400">
            We apologize for any inconvenience this may cause.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceMode;
