
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import type { Order, Payment } from '../../types/order';
import OrderItemTable from '../../components/orders/OrderItemTable';
import OrderSummary from '../../components/orders/OrderSummary';
import { OrderStatusLabels, OrderStatusColors } from '../../constants/order';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentType, setPaymentType] = useState<string>('ESPÈCES');
  const [addingPayment, setAddingPayment] = useState<boolean>(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const orderData = await orderService.getOrderById(parseInt(id));
        setOrder(orderData);
        
      } catch (err: any) {
        setError('Commande non trouvée');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [id]);

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

  const handleAddPayment = async () => {
    if (!order || !paymentAmount || parseFloat(paymentAmount) <= 0) {
      alert('Veuillez entrer un montant valide');
      return;
    }

    setAddingPayment(true);
    try {
    
      
      alert('Paiement ajouté avec succès');
      setPaymentAmount('');
      
      // Recharger les données de la commande
      const updatedOrder = await orderService.getOrderById(order.id);
      setOrder(updatedOrder);
      
    } catch (err) {
      alert('Erreur lors de l\'ajout du paiement');
    } finally {
      setAddingPayment(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!order) return;
    
    if (window.confirm('Confirmer cette commande ?')) {
      try {
        await orderService.confirmOrder(order.id);
        const updatedOrder = await orderService.getOrderById(order.id);
        setOrder(updatedOrder);
        alert('Commande confirmée avec succès');
      } catch (err: any) {
        alert(err.response?.data?.error || 'Erreur lors de la confirmation');
      }
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    
    if (window.confirm('Annuler cette commande ?')) {
      try {
        await orderService.cancelOrder(order.id);
        const updatedOrder = await orderService.getOrderById(order.id);
        setOrder(updatedOrder);
        alert('Commande annulée avec succès');
      } catch (err: any) {
        alert(err.response?.data?.error || 'Erreur lors de l\'annulation');
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Chargement de la commande...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Commande non trouvée'}
        </div>
        <button
          onClick={() => navigate('/orders')}
          className="mt-4 text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/orders')}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à la liste
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Commande {order.reference}</h1>
              <div className="flex items-center mt-2 space-x-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${OrderStatusColors[order.statut]}`}>
                  {OrderStatusLabels[order.statut]}
                </span>
                <span className="text-gray-600">
                  {formatDate(order.orderDate)}
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              {order.statut === 'PENDING' && (
                <div className="flex space-x-2">
                  {order.montantRestant === 0 && (
                    <button
                      onClick={handleConfirmOrder}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                      Confirmer la commande
                    </button>
                  )}
                  <button
                    onClick={handleCancelOrder}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Informations du client</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-600">Nom:</span>
                    <p className="text-gray-800">{order.clientNom}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Email:</span>
                    <p className="text-gray-800">{order.clientEmail}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">ID Client:</span>
                    <p className="text-gray-800">{order.clientId}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => navigate(`/clients/${order.clientId}`)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Voir profil client →
                    </button>
                  </div>
                </div>
              </div>

              {/* Articles de la commande */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Articles commandés</h2>
                <OrderItemTable items={order.orderItems} />
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">Notes</h2>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-gray-700">{order.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Récapitulatif et paiements */}
            <div className="space-y-6">
              <OrderSummary order={order} />

              {/* Ajout de paiement */}
              {order.statut === 'PENDING' && order.montantRestant > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Ajouter un paiement</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type de paiement
                      </label>
                      <select
                        value={paymentType}
                        onChange={(e) => setPaymentType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="ESPÈCES">Espèces</option>
                        <option value="CHÈQUE">Chèque</option>
                        <option value="VIREMENT">Virement</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Montant (max: {formatCurrency(order.montantRestant)})
                      </label>
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        min="0"
                        max={order.montantRestant}
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="0.00"
                      />
                    </div>
                    <button
                      onClick={handleAddPayment}
                      disabled={addingPayment || !paymentAmount || parseFloat(paymentAmount) <= 0}
                      className={`w-full px-4 py-2 rounded-md text-white ${
                        addingPayment || !paymentAmount || parseFloat(paymentAmount) <= 0
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {addingPayment ? 'Ajout en cours...' : 'Ajouter le paiement'}
                    </button>
                  </div>
                </div>
              )}

              {/* Historique des paiements */}
              {payments.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Historique des paiements</h3>
                  <div className="space-y-2">
                    {payments.map((payment) => (
                      <div key={payment.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <span className="font-medium">{payment.type}</span>
                          {payment.reference && (
                            <span className="text-sm text-gray-500 ml-2">({payment.reference})</span>
                          )}
                        </div>
                        <div className="font-semibold">
                          {formatCurrency(payment.montant)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Actions</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/orders')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Retour à la liste
              </button>
              <button
                onClick={() => navigate(`/orders/new?clientId=${order.clientId}`)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Nouvelle commande pour ce client
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;