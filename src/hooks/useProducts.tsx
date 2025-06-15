
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getProduct } from '@/services/firestore';
import { Product } from '@/types';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });
};
