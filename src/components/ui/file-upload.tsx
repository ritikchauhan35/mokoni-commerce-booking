
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Upload } from 'lucide-react';
import { validateFile, compressImage, FileUploadConfig, DEFAULT_IMAGE_CONFIG } from '@/services/fileUpload';

interface FileUploadProps {
  onFilesChange: (urls: string[]) => void;
  currentFiles?: string[];
  config?: FileUploadConfig;
  multiple?: boolean;
  showPreview?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  currentFiles = [],
  config = DEFAULT_IMAGE_CONFIG,
  multiple = true,
  showPreview = true
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const newUrls: string[] = [];
      const totalFiles = files.length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file
        const validationError = validateFile(file, config);
        if (validationError) {
          console.error(`File ${file.name}: ${validationError}`);
          continue;
        }

        // Upload and compress
        const url = await compressImage(file, 0.8);
        newUrls.push(url);
        
        // Update progress
        setUploadProgress(((i + 1) / totalFiles) * 100);
      }

      // Update files
      const updatedFiles = multiple ? [...currentFiles, ...newUrls] : newUrls;
      onFilesChange(updatedFiles);

    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // Reset input
      event.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    onFilesChange(updatedFiles);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-olive-400 transition-colors">
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <div className="space-y-2">
          <p className="text-gray-600">Upload images</p>
          <p className="text-sm text-gray-400">
            Supports: JPG, PNG, GIF, WebP (max {config.maxSize}MB each)
          </p>
          <input
            type="file"
            accept={config.allowedTypes.join(',')}
            multiple={multiple}
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <Button asChild variant="outline">
            <label htmlFor="file-upload" className="cursor-pointer">
              Choose Files
            </label>
          </Button>
        </div>
      </div>

      {uploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-gray-600 text-center">
            Processing... {Math.round(uploadProgress)}%
          </p>
        </div>
      )}

      {showPreview && currentFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentFiles.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
