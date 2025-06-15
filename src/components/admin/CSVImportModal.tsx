import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { 
  parseCSVFile, 
  autoDetectFields, 
  importProductsFromCSV, 
  FieldMapping,
  CSVImportResult 
} from '@/services/csvImport';
import { useQueryClient } from '@tanstack/react-query';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CSVImportModal: React.FC<CSVImportModalProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<{ headers: string[]; data: any[] } | null>(null);
  const [fieldMapping, setFieldMapping] = useState<FieldMapping>({});
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<CSVImportResult | null>(null);
  const [step, setStep] = useState<'upload' | 'mapping' | 'result'>('upload');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    try {
      setFile(selectedFile);
      const parsed = await parseCSVFile(selectedFile);
      setCsvData(parsed);
      
      // Auto-detect field mappings
      const autoMapping = autoDetectFields(parsed.headers);
      setFieldMapping(autoMapping);
      setStep('mapping');
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const handleImport = async () => {
    if (!csvData) return;

    setIsImporting(true);
    try {
      const result = await importProductsFromCSV(csvData.data, fieldMapping);
      setImportResult(result);
      setStep('result');
      
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        toast({
          title: "Import Successful",
          description: `Imported ${result.imported} products successfully`,
        });
      } else {
        toast({
          title: "Import Failed",
          description: "No products were imported due to errors",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Import Error",
        description: `Failed to import products: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const resetModal = () => {
    setFile(null);
    setCsvData(null);
    setFieldMapping({});
    setImportResult(null);
    setStep('upload');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const downloadTemplate = () => {
    const template = `name,description,price,originalPrice,category,images,inventory,weight,tags
"Sample Product","This is a sample product description",19.99,24.99,"Electronics","https://example.com/image1.jpg,https://example.com/image2.jpg",50,0.5,"electronics,gadget,popular"
"Another Product","Another sample description",29.99,,"Home & Garden","https://example.com/image3.jpg",25,1.2,"home,garden"`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Fix the field mapping update function
  const updateFieldMapping = (header: string, value: string) => {
    setFieldMapping(prev => ({
      ...prev,
      [header]: value as keyof Product | 'ignore'
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Products from CSV</DialogTitle>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-6">
            <div className="text-center">
              <Button
                variant="outline"
                onClick={downloadTemplate}
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
                  onChange={handleFileUpload}
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
        )}

        {step === 'mapping' && csvData && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Map CSV Fields to Product Fields</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {csvData.headers.map((header) => (
                    <div key={header} className="flex items-center space-x-2">
                      <span className="font-medium text-sm w-32 truncate">
                        {header}:
                      </span>
                      <Select
                        value={fieldMapping[header] || 'ignore'}
                        onValueChange={(value) => updateFieldMapping(header, value)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ignore">Ignore</SelectItem>
                          <SelectItem value="name">Product Name</SelectItem>
                          <SelectItem value="description">Description</SelectItem>
                          <SelectItem value="price">Price</SelectItem>
                          <SelectItem value="originalPrice">Original Price</SelectItem>
                          <SelectItem value="category">Category</SelectItem>
                          <SelectItem value="images">Images (URLs)</SelectItem>
                          <SelectItem value="inventory">Inventory</SelectItem>
                          <SelectItem value="weight">Weight</SelectItem>
                          <SelectItem value="tags">Tags</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setStep('upload')}>
                Back
              </Button>
              <Button 
                onClick={handleImport} 
                disabled={isImporting}
                className="bg-olive-600 hover:bg-olive-700"
              >
                {isImporting ? 'Importing...' : `Import ${csvData.data.length} Products`}
              </Button>
            </div>
          </div>
        )}

        {step === 'result' && importResult && (
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
              <Button variant="outline" onClick={resetModal}>
                Import Another File
              </Button>
              <Button onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CSVImportModal;
