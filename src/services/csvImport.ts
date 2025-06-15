
import Papa from 'papaparse';
import { Product } from '@/types';
import { addProduct } from './products';

export interface CSVImportResult {
  success: boolean;
  imported: number;
  errors: Array<{
    row: number;
    error: string;
  }>;
  data: Partial<Product>[];
}

export interface FieldMapping {
  [csvField: string]: keyof Product | 'ignore';
}

// Auto-detect field mappings based on common column names
export const autoDetectFields = (headers: string[]): FieldMapping => {
  const mapping: FieldMapping = {};
  
  headers.forEach(header => {
    const lowerHeader = header.toLowerCase().trim();
    
    if (lowerHeader.includes('name') || lowerHeader.includes('title') || lowerHeader === 'product') {
      mapping[header] = 'name';
    } else if (lowerHeader.includes('description') || lowerHeader.includes('desc')) {
      mapping[header] = 'description';
    } else if (lowerHeader.includes('price') && !lowerHeader.includes('original')) {
      mapping[header] = 'price';
    } else if (lowerHeader.includes('original') && lowerHeader.includes('price')) {
      mapping[header] = 'originalPrice';
    } else if (lowerHeader.includes('category') || lowerHeader.includes('cat')) {
      mapping[header] = 'category';
    } else if (lowerHeader.includes('image') || lowerHeader.includes('photo') || lowerHeader.includes('picture')) {
      mapping[header] = 'images';
    } else if (lowerHeader.includes('inventory') || lowerHeader.includes('stock') || lowerHeader.includes('quantity')) {
      mapping[header] = 'inventory';
    } else if (lowerHeader.includes('weight')) {
      mapping[header] = 'weight';
    } else if (lowerHeader.includes('tag')) {
      mapping[header] = 'tags';
    } else {
      mapping[header] = 'ignore';
    }
  });
  
  return mapping;
};

// Parse CSV file and return structured data
export const parseCSVFile = (file: File): Promise<{ headers: string[]; data: any[] }> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
          return;
        }
        
        const headers = results.meta.fields || [];
        resolve({
          headers,
          data: results.data as any[]
        });
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

// Convert CSV row to Product format
export const convertRowToProduct = (row: any, mapping: FieldMapping): Partial<Product> => {
  const product: Partial<Product> = {
    inStock: true,
    rating: 0,
    reviews: 0,
    createdAt: new Date()
  };

  Object.entries(mapping).forEach(([csvField, productField]) => {
    if (productField === 'ignore' || !row[csvField]) return;

    const value = row[csvField];

    switch (productField) {
      case 'name':
      case 'description':
      case 'category':
        product[productField] = String(value).trim();
        break;
      
      case 'price':
      case 'originalPrice':
      case 'weight':
        const numValue = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
        if (!isNaN(numValue) && numValue >= 0) {
          product[productField] = numValue;
        }
        break;
      
      case 'inventory':
        const intValue = parseInt(String(value).replace(/[^0-9]/g, ''));
        if (!isNaN(intValue) && intValue >= 0) {
          product[productField] = intValue;
        }
        break;
      
      case 'images':
        // Split by comma, semicolon, or pipe and clean URLs
        const imageUrls = String(value)
          .split(/[,;|]/)
          .map(url => url.trim())
          .filter(url => url.length > 0);
        if (imageUrls.length > 0) {
          product[productField] = imageUrls;
        }
        break;
      
      case 'tags':
        // Split by comma and clean tags
        const tags = String(value)
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);
        if (tags.length > 0) {
          product[productField] = tags;
        }
        break;
    }
  });

  return product;
};

// Validate product data
export const validateProduct = (product: Partial<Product>, rowIndex: number): string | null => {
  if (!product.name || product.name.trim().length === 0) {
    return `Row ${rowIndex + 1}: Product name is required`;
  }
  
  if (!product.description || product.description.trim().length === 0) {
    return `Row ${rowIndex + 1}: Product description is required`;
  }
  
  if (!product.price || product.price <= 0) {
    return `Row ${rowIndex + 1}: Valid price is required`;
  }

  if (product.originalPrice && product.originalPrice <= product.price) {
    return `Row ${rowIndex + 1}: Original price must be higher than current price`;
  }

  return null;
};

// Import products from CSV data
export const importProductsFromCSV = async (
  data: any[],
  mapping: FieldMapping
): Promise<CSVImportResult> => {
  const result: CSVImportResult = {
    success: false,
    imported: 0,
    errors: [],
    data: []
  };

  for (let i = 0; i < data.length; i++) {
    try {
      const product = convertRowToProduct(data[i], mapping);
      const validationError = validateProduct(product, i);
      
      if (validationError) {
        result.errors.push({ row: i + 1, error: validationError });
        continue;
      }

      // Set default values
      const completeProduct = {
        ...product,
        category: product.category || 'Uncategorized',
        images: product.images || [],
        inventory: product.inventory || 0,
        tags: product.tags || [],
      } as Omit<Product, 'id'>;

      await addProduct(completeProduct);
      result.imported++;
      result.data.push(completeProduct);
      
    } catch (error) {
      result.errors.push({ 
        row: i + 1, 
        error: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  }

  result.success = result.imported > 0;
  return result;
};
