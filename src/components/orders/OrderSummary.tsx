
import React from 'react';
import type { Order } from '../../types/order';

interface OrderSummaryProps {
  order: Order;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Récapitulatif de la commande</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Sous-total:</span>
          <span className="font-medium">{formatCurrency(order.sousTotal)}</span>
        </div>
        
        {order.remiseFideliteMontant > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">
              Remise fidélité ({order.remiseFidelitePourcentage}%):
            </span>
            <span className="font-medium text-green-600">
              -{formatCurrency(order.remiseFideliteMontant)}
            </span>
          </div>
        )}
        
        {order.remisePromoPourcentage_montant > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">
              Remise promo ({order.remisePromoPourcentage}%):
            </span>
            <span className="font-medium text-green-600">
              -{formatCurrency(order.remisePromoPourcentage_montant)}
            </span>
          </div>
        )}
        
        <div className="flex justify-between border-t pt-3">
          <span className="text-gray-600">HT après remise:</span>
          <span className="font-medium">{formatCurrency(order.montantHT)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">TVA (20%):</span>
          <span className="font-medium">{formatCurrency(order.montantTVA)}</span>
        </div>
        
        <div className="flex justify-between border-t pt-3 font-semibold text-lg">
          <span className="text-gray-800">Total TTC:</span>
          <span className="text-blue-600">{formatCurrency(order.totalTTC)}</span>
        </div>
        
        <div className="flex justify-between border-t pt-3">
          <span className="text-gray-600">Montant payé:</span>
          <span className="font-medium text-green-600">
            {formatCurrency(order.montantPaye)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Montant restant:</span>
          <span className={`font-semibold ${
            order.montantRestant > 0 ? 'text-red-600' : 'text-green-600'
          }`}>
            {formatCurrency(order.montantRestant)}
          </span>
        </div>
        
        {order.montantRestant === 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm font-medium">
              ✓ Commande entièrement payée - Prête à être confirmée
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;