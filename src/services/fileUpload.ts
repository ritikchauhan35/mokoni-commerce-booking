
export interface FileUploadConfig {
  maxSize: number; // in MB
  allowedTypes: string[];
  maxFiles?: number;
}

export const DEFAULT_IMAGE_CONFIG: FileUploadConfig = {
  maxSize: 5, // 5MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  maxFiles: 10
};

export const validateFile = (file: File, config: FileUploadConfig): string | null => {
  // Check file size
  if (file.size > config.maxSize * 1024 * 1024) {
    return `File size should be less than ${config.maxSize}MB`;
  }

  // Check file type
  if (!config.allowedTypes.includes(file.type)) {
    return `File type not supported. Allowed types: ${config.allowedTypes.join(', ')}`;
  }

  return null;
};

export const uploadFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export const compressImage = (file: File, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions (max 1200px width)
      const maxWidth = 1200;
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};
