
import { useQuery } from '@tanstack/react-query';
import { getProperties, getProperty } from '@/services';
import { Property } from '@/types';

export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => getProperty(id),
    enabled: !!id,
  });
};
