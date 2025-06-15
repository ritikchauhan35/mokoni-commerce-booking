
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { CSVImportResult } from '@/services/csvImport';

interface ImportResultStepProps {
  importResult: CSVImportResult;
  onReset: () => void;
  onClose: () => void;
}

const ImportResultStep: React.FC<ImportResultStepProps> = ({
  importResult,
  onReset,
  onClose
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {importResult.success ? (
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
            )}
            Import Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Products Imported:</span>
              <span className="font-bold text-green-600">{importResult.imported}</span>
            </div>
            <div className="flex justify-between">
              <span>Errors:</span>
              <span className="font-bold text-red-600">{importResult.errors.length}</span>
            </div>
            
            {importResult.errors.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Errors:</h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {importResult.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-600">
                      {error.error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onReset}>
          Import Another File
        </Button>
        <Button onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default ImportResultStep;
