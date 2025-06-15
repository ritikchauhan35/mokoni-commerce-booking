
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Download } from 'lucide-react';

interface FileUploadStepProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadTemplate: () => void;
}

const FileUploadStep: React.FC<FileUploadStepProps> = ({
  onFileUpload,
  onDownloadTemplate
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Button
          variant="outline"
          onClick={onDownloadTemplate}
          className="mb-4"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Template
        </Button>
      </div>

      <Card className="border-dashed border-2 border-olive-300">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Upload className="h-12 w-12 text-olive-500 mb-4" />
          <p className="text-lg font-medium text-olive-700 mb-2">
            Upload your CSV file
          </p>
          <p className="text-sm text-olive-500 mb-4">
            Supported format: CSV files
          </p>
          <input
            type="file"
            accept=".csv"
            onChange={onFileUpload}
            className="hidden"
            id="csv-upload"
          />
          <Button asChild>
            <label htmlFor="csv-upload" className="cursor-pointer">
              Choose File
            </label>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUploadStep;
