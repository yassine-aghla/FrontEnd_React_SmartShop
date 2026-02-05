// src/components/products/ProductTable.tsx
import React from 'react';
import type  { Product } from '../../types/product';
import { formatPrice } from '../../utils/formatters';

interface ProductTableProps {
  products: Product[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Nom</th>
            <th className="py-2 px-4 border-b">Prix HT</th>
            <th className="py-2 px-4 border-b">Stock</th>
            <th className="py-2 px-4 border-b">Statut</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{product.id}</td>
              <td className="py-2 px-4 border-b">{product.nom}</td>
              <td className="py-2 px-4 border-b">{formatPrice(product.prix)} DH</td>
              <td className="py-2 px-4 border-b">
                <span className={product.stock < 10 ? 'text-red-600 font-bold' : ''}>
                  {product.stock}
                </span>
              </td>
              <td className="py-2 px-4 border-b">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    product.deleted
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {product.deleted ? 'Supprimé' : 'Actif'}
                </span>
              </td>
              <td className="py-2 px-4 border-b space-x-2">
                <button
                  onClick={() => onEdit(product.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Modifier
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  disabled={product.deleted}
                  className={`px-3 py-1 rounded ${
                    product.deleted
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;