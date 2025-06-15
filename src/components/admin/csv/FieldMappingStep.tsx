
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FieldMapping } from '@/services/csvImport';
import CSVFieldMapper from './CSVFieldMapper';

interface FieldMappingStepProps {
  csvData: { headers: string[]; data: any[] };
  fieldMapping: FieldMapping;
  onFieldMappingChange: (header: string, value: string) => void;
  onBack: () => void;
  onImport: () => void;
  isImporting: boolean;
}

const FieldMappingStep: React.FC<FieldMappingStepProps> = ({
  csvData,
  fieldMapping,
  onFieldMappingChange,
  onBack,
  onImport,
  isImporting
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Map CSV Fields to Product Fields</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {csvData.headers.map((header) => (
              <CSVFieldMapper
                key={header}
                header={header}
                value={fieldMapping[header] || 'ignore'}
                onValueChange={onFieldMappingChange}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onImport} 
          disabled={isImporting}
          className="bg-olive-600 hover:bg-olive-700"
        >
          {isImporting ? 'Importing...' : `Import ${csvData.data.length} Products`}
        </Button>
      </div>
    </div>
  );
};

export default FieldMappingStep;
