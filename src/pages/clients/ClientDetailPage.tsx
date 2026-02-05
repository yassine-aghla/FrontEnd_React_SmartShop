// src/pages/clients/ClientDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientService } from '../../services/clientService';
import type { Client } from '../../types/client';
import { CustomerTierLabels, CustomerTierColors, CustomerTierDiscounts } from '../../constants/client';

const ClientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await clientService.getClientById(parseInt(id));
        setClient(data);
      } catch (err: any) {
        setError('Client non trouvé');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Chargement du client...</p>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Client non trouvé'}
        </div>
        <button
          onClick={() => navigate('/clients')}
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
          onClick={() => navigate('/clients')}
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
              <h1 className="text-3xl font-bold text-gray-800">{client.nom}</h1>
              <div className="flex items-center mt-2 space-x-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${CustomerTierColors[client.customerTier]}`}>
                  {CustomerTierLabels[client.customerTier]}
                </span>
                <span className={`px-3 py-1 rounded text-sm ${
                  client.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {client.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/clients/${client.id}/edit`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Modifier
                </button>
                {client.isActive && (
                  <button
                    onClick={async () => {
                      if (window.confirm('Désactiver ce client ?')) {
                        try {
                          await clientService.deleteClient(client.id);
                          alert('Client désactivé');
                          navigate('/clients');
                        } catch (err) {
                          alert('Erreur lors de la désactivation');
                        }
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Désactiver
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Informations du client</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-600">Email:</span>
                  <p className="text-gray-800">{client.email}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Utilisateur associé:</span>
                  <p className="text-gray-800">{client.userUsername} (ID: {client.userId})</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Date de création:</span>
                  <p className="text-gray-800">{formatDate(client.createdAt)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Dernière mise à jour:</span>
                  <p className="text-gray-800">{formatDate(client.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Statistiques</h2>
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <span className="font-medium text-gray-600">Nombre de commandes:</span>
                  <p className="text-2xl font-bold text-blue-600">{client.totalOrders}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <span className="font-medium text-gray-600">Total dépensé:</span>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(client.totalSpent)}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <span className="font-medium text-gray-600">Remise fidélité:</span>
                  <p className="text-2xl font-bold text-purple-600">
                    {CustomerTierDiscounts[client.customerTier]}%
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Applicable à partir de {client.customerTier === 'SILVER' ? '500 MAD' : 
                                        client.customerTier === 'GOLD' ? '800 MAD' : 
                                        client.customerTier === 'PLATINUM' ? '1200 MAD' : '0 MAD'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Historique des commandes */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Historique des commandes</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              {client.firstOrderDate ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-600">Première commande:</span>
                    <p className="text-gray-800">{formatDate(client.firstOrderDate)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Dernière commande:</span>
                    <p className="text-gray-800">{formatDate(client.lastOrderDate)}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Aucune commande pour le moment</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Actions</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate(`/orders/new?clientId=${client.id}`)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nouvelle commande
              </button>
              <button
                onClick={() => navigate('/clients')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Retour à la liste
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailPage;