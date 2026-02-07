import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import type { Order, OrderStatus } from '../../types/order';
import OrderTable from '../../components/orders/OrderTable';
import SearchBar from '../../components/common/SearchBar';
import { OrderStatusLabels } from '../../constants/order';

const OrderListPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    totalRevenue: 0
  });
  
  const navigate = useNavigate();

  const fetchOrders = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
      setFilteredOrders(data);
      
      // Calculer les statistiques
      const pendingOrders = data.filter(o => o.statut === 'PENDING');
      const confirmedOrders = data.filter(o => o.statut === 'CONFIRMED');
      const totalRevenue = data.reduce((sum, order) => sum + order.totalTTC, 0);
      
      setStats({
        totalOrders: data.length,
        pendingOrders: pendingOrders.length,
        confirmedOrders: confirmedOrders.length,
        totalRevenue
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors du chargement des commandes');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;
    
    // Filtrer par statut
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(order => order.statut === statusFilter);
    }
    
    // Filtrer par recherche
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.reference.toLowerCase().includes(term) ||
        order.clientNom.toLowerCase().includes(term) ||
        order.clientEmail.toLowerCase().includes(term)
      );
    }
    
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const handleSearch = (term: string): void => {
    setSearchTerm(term);
  };

  const handleViewDetails = (id: number): void => {
    navigate(`/orders/${id}`);
  };

  const handleConfirm = async (id: number): Promise<void> => {
    if (window.confirm('Confirmer cette commande ?')) {
      try {
        await orderService.confirmOrder(id);
        await fetchOrders();
        alert('Commande confirmée avec succès');
      } catch (err: any) {
        alert(err.response?.data?.error || 'Erreur lors de la confirmation');
      }
    }
  };

  const handleCancel = async (id: number): Promise<void> => {
    if (window.confirm('Annuler cette commande ?')) {
      try {
        await orderService.cancelOrder(id);
        await fetchOrders();
        alert('Commande annulée avec succès');
      } catch (err: any) {
        alert(err.response?.data?.error || 'Erreur lors de l\'annulation');
      }
    }
  };

  const handleReject = async (id: number): Promise<void> => {
    const reason = prompt('Raison du rejet :');
    if (reason !== null) {
      try {
        await orderService.rejectOrder(id, reason);
        await fetchOrders();
        alert('Commande rejetée avec succès');
      } catch (err: any) {
        alert(err.response?.data?.error || 'Erreur lors du rejet');
      }
    }
  };

  const handleCreateNew = (): void => {
    navigate('/orders/new');
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Commandes</h1>
        <button
          onClick={handleCreateNew}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle Commande
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Total Commandes</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">En attente</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Confirmées</h3>
          <p className="text-3xl font-bold text-green-600">{stats.confirmedOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Chiffre d'affaires</h3>
          <p className="text-3xl font-bold text-purple-600">
            {formatCurrency(stats.totalRevenue)}
          </p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <SearchBar
              placeholder="Rechercher par référence, client..."
              onSearch={handleSearch}
              delay={300}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrer par statut
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Tous les statuts</option>
              {Object.entries(OrderStatusLabels).map(([status, label]) => (
                <option key={status} value={status}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Chargement des commandes...</p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">
              {filteredOrders.length} commande(s) trouvée(s)
              {statusFilter !== 'ALL' && (
                <span className="ml-2">(Statut: {OrderStatusLabels[statusFilter as OrderStatus]})</span>
              )}
              {searchTerm && (
                <span className="ml-2 text-blue-600">
                  pour la recherche: "{searchTerm}"
                </span>
              )}
            </p>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500 text-lg">Aucune commande trouvée</p>
              {(searchTerm || statusFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('ALL');
                  }}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <OrderTable
                orders={filteredOrders}
                onViewDetails={handleViewDetails}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                onReject={handleReject}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderListPage;