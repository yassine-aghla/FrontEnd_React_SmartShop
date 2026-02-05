// src/pages/products/ProductNewPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import type  { ProductDTO } from '../../types/product';
import ProductForm from '../../components/products/ProductForm';

const ProductNewPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (productData: ProductDTO) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await productService.createProduct(productData);
      alert('Produit créé avec succès !');
      navigate('/products');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erreur lors de la création du produit';
      setError(errorMessage);
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/products')}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          &larr; Retour à la liste
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Créer un nouveau produit
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <ProductForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ProductNewPage;