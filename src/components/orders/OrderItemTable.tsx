
import React from 'react';
import type { OrderItem } from '../../types/order';

interface OrderItemTableProps {
  items: OrderItem[];
}

const OrderItemTable: React.FC<OrderItemTableProps> = ({ items }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-left">Produit</th>
            <th className="py-2 px-4 border-b text-left">Quantité</th>
            <th className="py-2 px-4 border-b text-left">Prix unitaire</th>
            <th className="py-2 px-4 border-b text-left">Total ligne</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">
                <div>
                  <div className="font-medium">{item.productNom}</div>
                  <div className="text-sm text-gray-500">ID: {item.productId}</div>
                </div>
              </td>
              <td className="py-2 px-4 border-b">{item.quantite}</td>
              <td className="py-2 px-4 border-b">{formatCurrency(item.prixUnitaire)}</td>
              <td className="py-2 px-4 border-b font-semibold">
                {formatCurrency(item.totalLigne)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-50">
            <td colSpan={3} className="py-2 px-4 border-t text-right font-semibold">
              Sous-total:
            </td>
            <td className="py-2 px-4 border-t font-semibold">
              {formatCurrency(items.reduce((sum, item) => sum + item.totalLigne, 0))}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default OrderItemTable;