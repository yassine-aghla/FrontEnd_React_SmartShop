// src/pages/products/ProductEditPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import type  { Product, ProductDTO } from '../../types/product';
import ProductForm from '../../components/products/ProductForm';

const ProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setIsLoadingData(true);
      try {
        const data = await productService.getProductById(parseInt(id));
        setProduct(data);
      } catch (err: any) {
        setError('Produit non trouvé');
        console.error('Erreur:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (productData: ProductDTO) => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await productService.updateProduct(parseInt(id), productData);
      alert('Produit modifié avec succès !');
      navigate('/products');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erreur lors de la modification';
      setError(errorMessage);
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-600">Chargement du produit...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Produit non trouvé'}
        </div>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          &larr; Retour à la liste
        </button>
      </div>
    );
  }

  const initialData: ProductDTO = {
    nom: product.nom,
    prix: product.prix,
    stock: product.stock,
    description: product.description,
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

      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Modifier le produit
      </h1>
      <p className="text-gray-600 mb-6">ID: {product.id}</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <ProductForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ProductEditPage;