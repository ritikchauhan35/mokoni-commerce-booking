
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CSVFieldMapperProps {
  header: string;
  value: string;
  onValueChange: (header: string, value: string) => void;
}

const CSVFieldMapper: React.FC<CSVFieldMapperProps> = ({
  header,
  value,
  onValueChange
}) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="font-medium text-sm w-32 truncate">
        {header}:
      </span>
      <Select
        value={value}
        onValueChange={(newValue) => onValueChange(header, newValue)}
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
  );
};

export default CSVFieldMapper;
