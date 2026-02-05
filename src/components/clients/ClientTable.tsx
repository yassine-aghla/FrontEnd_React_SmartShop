// src/components/clients/ClientTable.tsx
import React from 'react';
import type { Client } from '../../types/client';
import { CustomerTierLabels, CustomerTierColors } from '../../constants/client';

interface ClientTableProps {
  clients: Client[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onViewDetails: (id: number) => void;
}

const ClientTable: React.FC<ClientTableProps> = ({ 
  clients, 
  onEdit, 
  onDelete,
  onViewDetails 
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
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
            <th className="py-3 px-4 border-b text-left">ID</th>
            <th className="py-3 px-4 border-b text-left">Nom</th>
            <th className="py-3 px-4 border-b text-left">Email</th>
            <th className="py-3 px-4 border-b text-left">Tier</th>
            <th className="py-3 px-4 border-b text-left">Commandes</th>
            <th className="py-3 px-4 border-b text-left">Total dépensé</th>
            <th className="py-3 px-4 border-b text-left">Statut</th>
            <th className="py-3 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-50">
              <td className="py-3 px-4 border-b">{client.id}</td>
              <td className="py-3 px-4 border-b font-medium">{client.nom}</td>
              <td className="py-3 px-4 border-b text-blue-600">{client.email}</td>
              <td className="py-3 px-4 border-b">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${CustomerTierColors[client.customerTier]}`}>
                  {CustomerTierLabels[client.customerTier]}
                </span>
              </td>
              <td className="py-3 px-4 border-b">
                <span className="font-semibold">{client.totalOrders}</span>
              </td>
              <td className="py-3 px-4 border-b font-semibold">
                {formatCurrency(client.totalSpent)}
              </td>
              <td className="py-3 px-4 border-b">
                <span className={`px-2 py-1 rounded text-xs ${
                  client.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {client.isActive ? 'Actif' : 'Inactif'}
                </span>
              </td>
              <td className="py-3 px-4 border-b">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onViewDetails(client.id)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded text-sm"
                    title="Voir détails"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => onEdit(client.id)}
                    className="bg-yellow-100 hover:bg-yellow-200 text-yellow-600 px-3 py-1 rounded text-sm"
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(client.id)}
                    disabled={!client.isActive}
                    className={`px-3 py-1 rounded text-sm ${
                      client.isActive
                        ? 'bg-red-100 hover:bg-red-200 text-red-600'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    title={client.isActive ? "Désactiver" : "Déjà inactif"}
                  >
                    {client.isActive ? '❌' : '🚫'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;