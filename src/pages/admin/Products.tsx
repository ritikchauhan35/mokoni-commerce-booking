import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Eye, Upload } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProducts, deleteProduct } from '@/services';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';
import ProductFormModal from '@/components/admin/ProductFormModal';
import ProductDetailModal from '@/components/admin/ProductDetailModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import CSVImportModal from '@/components/admin/CSVImportModal';

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isCSVImportOpen, setIsCSVImportOpen] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: getProducts,
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    setFormMode('create');
    setSelectedProduct(null);
    setIsFormModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setFormMode('edit');
    setSelectedProduct(product);
    setIsFormModalOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;

    setDeleteLoading(true);
    try {
      await deleteProduct(selectedProduct.id);
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-olive-800">Product Management</h1>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setIsCSVImportOpen(true)}
            variant="outline" 
            className="border-olive-300"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Button onClick={() => setIsFormModalOpen(true)} className="bg-olive-600 hover:bg-olive-700">
            Add Product
          </Button>
        </div>
      </div>

      <Card className="bg-pearl-50 border-olive-200">
        <CardHeader>
          <CardTitle className="text-olive-800">Products ({products.length})</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-olive-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 border-olive-300 focus:border-olive-500"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-olive-700">Image</TableHead>
                <TableHead className="text-olive-700">Name</TableHead>
                <TableHead className="text-olive-700">Category</TableHead>
                <TableHead className="text-olive-700">Price</TableHead>
                <TableHead className="text-olive-700">Stock</TableHead>
                <TableHead className="text-olive-700">Status</TableHead>
                <TableHead className="text-olive-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img 
                      src={product.images[0] || "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop"} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-olive-800">
                    {product.name}
                  </TableCell>
                  <TableCell className="text-olive-600">{product.category}</TableCell>
                  <TableCell className="text-olive-600">${product.price}</TableCell>
                  <TableCell className="text-olive-600">{product.inventory}</TableCell>
                  <TableCell>
                    <Badge variant={product.inStock ? 'default' : 'destructive'}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-olive-300"
                        onClick={() => handleViewProduct(product)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-olive-300"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteProduct(product)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        product={selectedProduct}
        mode={formMode}
      />

      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        product={selectedProduct}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        description={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
        isLoading={deleteLoading}
      />

      <CSVImportModal
        isOpen={isCSVImportOpen}
        onClose={() => setIsCSVImportOpen(false)}
      />
    </div>
  );
};

export default AdminProducts;
