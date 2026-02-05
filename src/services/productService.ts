// src/services/productService.ts
import api from './api';
import type  { Product, ProductDTO, ProductPage, PaginationParams } from '../types/product';

export const productService = {
  // Récupérer tous les produits (sans pagination)
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  // Récupérer les produits avec pagination
  getProductsPaginated: async (params: PaginationParams): Promise<ProductPage> => {
    const { page = 0, size = 10, sort } = params;
    const response = await api.get<ProductPage>('/products/paginated', {
      params: { page, size, sort },
    });
    return response.data;
  },

  // Rechercher des produits par nom
  searchProducts: async (term: string, params: PaginationParams = {}): Promise<ProductPage> => {
    const { page = 0, size = 10 } = params;
    const response = await api.get<ProductPage>('/products/search/paginated', {
      params: { terme: term, page, size },
    });
    return response.data;
  },

  // Récupérer un produit par ID
  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Créer un nouveau produit
  createProduct: async (productData: ProductDTO): Promise<Product> => {
    const response = await api.post<Product>('/products', productData);
    return response.data;
  },

  // Mettre à jour un produit
  updateProduct: async (id: number, productData: ProductDTO): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, productData);
    return response.data;
  },

  // Supprimer un produit (soft delete)
  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  // Restaurer un produit
  restoreProduct: async (id: number): Promise<void> => {
    await api.put(`/products/${id}/restore`);
  },

  // Vérifier le stock
  checkStock: async (id: number, quantity: number): Promise<boolean> => {
    const response = await api.get<boolean>(`/products/check-stock/${id}`, {
      params: { quantite: quantity },
    });
    return response.data;
  },

  // Produits en rupture de stock
  getOutOfStockProducts: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products/out-of-stock');
    return response.data;
  },

  // Produits avec stock faible
  getLowStockProducts: async (threshold: number): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products/low-stock', {
      params: { seuil: threshold },
    });
    return response.data;
  },
};