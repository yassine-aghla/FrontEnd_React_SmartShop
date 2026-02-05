// src/pages/products/ProductListPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import type  { Product, ProductPage } from '../../types/product';
import ProductTable from '../../components/products/ProductTable';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pageInfo, setPageInfo] = useState<ProductPage | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let data: ProductPage;
      
      if (searchTerm.trim()) {
        data = await productService.searchProducts(searchTerm, {
          page: currentPage,
          size: pageSize,
        });
      } else {
        data = await productService.getProductsPaginated({
          page: currentPage,
          size: pageSize,
        });
      }
      
      setProducts(data.content);
      setPageInfo(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors du chargement des produits');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(0);
  };

  const handleEdit = (id: number) => {
    navigate(`/products/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await productService.deleteProduct(id);
        fetchProducts(); // Rafraîchir la liste
        alert('Produit supprimé avec succès');
      } catch (err) {
        alert('Erreur lors de la suppression');
        console.error('Erreur:', err);
      }
    }
  };

  const handleCreateNew = () => {
    navigate('/products/new');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Produits</h1>
        <button
          onClick={handleCreateNew}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          + Nouveau Produit
        </button>
      </div>

      <div className="mb-6">
        <SearchBar
          placeholder="Rechercher un produit par nom..."
          onSearch={handleSearch}
          delay={500}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Chargement des produits...</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-600">
              {pageInfo?.totalElements || 0} produit(s) trouvé(s)
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
              <button
                onClick={handleCreateNew}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Créer votre premier produit
              </button>
            </div>
          ) : (
            <>
              <ProductTable
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              
              {pageInfo && pageInfo.totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={pageInfo.totalPages}
                    onPageChange={setCurrentPage}
                    pageSize={pageSize}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductListPage;