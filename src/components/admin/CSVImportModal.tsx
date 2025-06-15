
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  parseCSVFile, 
  autoDetectFields, 
  importProductsFromCSV, 
  FieldMapping,
  CSVImportResult 
} from '@/services/csvImport';
import { useQueryClient } from '@tanstack/react-query';
import FileUploadStep from './csv/FileUploadStep';
import FieldMappingStep from './csv/FieldMappingStep';
import ImportResultStep from './csv/ImportResultStep';

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

  const updateFieldMapping = (header: string, value: string) => {
    setFieldMapping(prev => ({
      ...prev,
      [header]: value as keyof import('@/types').Product | 'ignore'
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Products from CSV</DialogTitle>
        </DialogHeader>

        {step === 'upload' && (
          <FileUploadStep 
            onFileUpload={handleFileUpload}
            onDownloadTemplate={downloadTemplate}
          />
        )}

        {step === 'mapping' && csvData && (
          <FieldMappingStep
            csvData={csvData}
            fieldMapping={fieldMapping}
            onFieldMappingChange={updateFieldMapping}
            onBack={() => setStep('upload')}
            onImport={handleImport}
            isImporting={isImporting}
          />
        )}

        {step === 'result' && importResult && (
          <ImportResultStep
            importResult={importResult}
            onReset={resetModal}
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CSVImportModal;
