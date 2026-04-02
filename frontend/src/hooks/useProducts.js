import { useApp } from '../context/AppContext';

export const useProducts = () => {
  const { products, productsLoading } = useApp();

  return {
    products,
    loading: productsLoading,
    error: null,
  };
};
