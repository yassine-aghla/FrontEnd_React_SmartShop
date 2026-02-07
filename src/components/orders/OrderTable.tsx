
import React from 'react';
import type { Order } from '../../types/order';
import { OrderStatusLabels, OrderStatusColors } from '../../constants/order';

interface OrderTableProps {
  orders: Order[];
  onViewDetails: (id: number) => void;
  onConfirm: (id: number) => void;
  onCancel: (id: number) => void;
  onReject: (id: number) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ 
  orders, 
  onViewDetails, 
  onConfirm, 
  onCancel,
  onReject 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
            <th className="py-3 px-4 border-b text-left">Référence</th>
            <th className="py-3 px-4 border-b text-left">Client</th>
            <th className="py-3 px-4 border-b text-left">Date</th>
            <th className="py-3 px-4 border-b text-left">Total TTC</th>
            <th className="py-3 px-4 border-b text-left">Payé</th>
            <th className="py-3 px-4 border-b text-left">Reste</th>
            <th className="py-3 px-4 border-b text-left">Statut</th>
            <th className="py-3 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="py-3 px-4 border-b">
                <span className="font-mono text-blue-600">{order.reference}</span>
              </td>
              <td className="py-3 px-4 border-b">
                <div>
                  <div className="font-medium">{order.clientNom}</div>
                  <div className="text-sm text-gray-500">{order.clientEmail}</div>
                </div>
              </td>
              <td className="py-3 px-4 border-b text-sm text-gray-600">
                {formatDate(order.orderDate)}
              </td>
              <td className="py-3 px-4 border-b font-semibold">
                {formatCurrency(order.totalTTC)}
              </td>
              <td className="py-3 px-4 border-b">
                {formatCurrency(order.montantPaye)}
              </td>
              <td className="py-3 px-4 border-b">
                <span className={order.montantRestant > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}>
                  {formatCurrency(order.montantRestant)}
                </span>
              </td>
              <td className="py-3 px-4 border-b">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${OrderStatusColors[order.statut]}`}>
                  {OrderStatusLabels[order.statut]}
                </span>
              </td>
              <td className="py-3 px-4 border-b">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onViewDetails(order.id)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded text-sm"
                    title="Voir détails"
                  >
                    👁️
                  </button>
                  {order.statut === 'PENDING' && (
                    <>
                      {order.montantRestant === 0 && (
                        <button
                          onClick={() => onConfirm(order.id)}
                          className="bg-green-100 hover:bg-green-200 text-green-600 px-3 py-1 rounded text-sm"
                          title="Confirmer"
                        >
                          ✅
                        </button>
                      )}
                      <button
                        onClick={() => onCancel(order.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded text-sm"
                        title="Annuler"
                      >
                        ❌
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;