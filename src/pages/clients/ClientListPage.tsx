// src/pages/clients/ClientListPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientService } from '../../services/clientService';
import { userService } from '../../services/userService';
import type { Client } from '../../types/client';
import type { User } from '../../types/user';
import ClientTable from '../../components/clients/ClientTable';
import SearchBar from '../../components/common/SearchBar';
import { CustomerTierLabels } from '../../constants/client';

const ClientListPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  });
  
  const navigate = useNavigate();

  const fetchClients = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await clientService.getActiveClients();
      setClients(data);
      setFilteredClients(data);
      
      // Calculer les statistiques
      const activeClients = data.filter(c => c.isActive);
      const totalRevenue = activeClients.reduce((sum, client) => sum + client.totalSpent, 0);
      const totalOrders = activeClients.reduce((sum, client) => sum + client.totalOrders, 0);
      
      setStats({
        totalClients: data.length,
        activeClients: activeClients.length,
        totalRevenue,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors du chargement des clients');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async (): Promise<void> => {
    setLoadingUsers(true);
    try {
      const users = await userService.getAllUsers();
      // Filtrer les utilisateurs qui ne sont pas encore associés à un client
      // (vous devrez peut-être ajuster cette logique)
      setAvailableUsers(users.filter(user => user.role === 'CLIENT'));
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchAvailableUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client =>
        client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        CustomerTierLabels[client.customerTier].toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  const handleSearch = (term: string): void => {
    setSearchTerm(term);
  };

  const handleViewDetails = (id: number): void => {
    navigate(`/clients/${id}`);
  };

  const handleEdit = (id: number): void => {
    navigate(`/clients/${id}/edit`);
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm('Êtes-vous sûr de vouloir désactiver ce client ?')) {
      try {
        await clientService.deleteClient(id);
        await fetchClients();
        alert('Client désactivé avec succès');
      } catch (err) {
        alert('Erreur lors de la désactivation');
        console.error('Erreur:', err);
      }
    }
  };

  const handleCreateNew = (): void => {
    navigate('/clients/new');
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
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Clients</h1>
        <button
          onClick={handleCreateNew}
          disabled={loadingUsers || availableUsers.length === 0}
          className={`bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center ${
            (loadingUsers || availableUsers.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouveau Client
        </button>
      </div>

      {loadingUsers && availableUsers.length === 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700">
            Chargement des utilisateurs disponibles...
          </p>
        </div>
      )}

      {!loadingUsers && availableUsers.length === 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">
            Aucun utilisateur disponible pour créer un client. Créez d'abord un utilisateur avec le rôle "CLIENT".
          </p>
          <button
            onClick={() => navigate('/users/new')}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Créer un nouvel utilisateur
          </button>
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Total Clients</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalClients}</p>
          <p className="text-sm text-gray-500 mt-1">{stats.activeClients} actifs</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Revenu Total</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(stats.totalRevenue)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Panier Moyen</h3>
          <p className="text-3xl font-bold text-purple-600">
            {formatCurrency(stats.averageOrderValue)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Utilisateurs</h3>
          <p className="text-3xl font-bold text-orange-600">
            {availableUsers.length}
          </p>
          <p className="text-sm text-gray-500 mt-1">disponibles</p>
        </div>
      </div>

      {/* Recherche */}
      <div className="mb-6">
        <SearchBar
          placeholder="Rechercher par nom, email ou niveau..."
          onSearch={handleSearch}
          delay={300}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Chargement des clients...</p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">
              {filteredClients.length} client(s) trouvé(s)
              {searchTerm && (
                <span className="ml-2 text-blue-600">
                  pour la recherche: "{searchTerm}"
                </span>
              )}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate('/clients/inactive')}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                Voir les clients inactifs
              </button>
            </div>
          </div>

          {filteredClients.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500 text-lg">Aucun client trouvé</p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Effacer la recherche
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <ClientTable
                clients={filteredClients}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClientListPage;