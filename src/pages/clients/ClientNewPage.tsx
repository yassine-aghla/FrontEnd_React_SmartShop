// src/pages/clients/ClientNewPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientService } from '../../services/clientService';
import { userService } from '../../services/userService';
import type { ClientDTO } from '../../types/client';
import type { User } from '../../types/user';
import ClientForm from '../../components/clients/ClientForm';

const ClientNewPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [availableUsers, setAvailableUsers] = useState<Array<{ id: number; username: string }>>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableUsers = async () => {
      try {
        const users = await userService.getAllUsers();
        // Filtrer les utilisateurs clients non associés
        const clientUsers = users
          .filter(user => user.role === 'CLIENT')
          .map(user => ({ id: user.id, username: user.username }));
        
        setAvailableUsers(clientUsers);
      } catch (err) {
        console.error('Erreur lors du chargement des utilisateurs:', err);
        setError('Impossible de charger les utilisateurs disponibles');
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchAvailableUsers();
  }, []);

  const handleSubmit = async (clientData: ClientDTO): Promise<void> => {
    if (!clientData.userId) {
      setError('Veuillez sélectionner un utilisateur');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await clientService.createClient(clientData, clientData.userId);
      alert('Client créé avec succès !');
      navigate('/clients');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.err || 'Erreur lors de la création du client';
      setError(errorMessage);
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

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

      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Créer un nouveau client
      </h1>
      <p className="text-gray-600 mb-6">
        Remplissez le formulaire pour créer un nouveau client dans le système
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {isLoadingUsers ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Chargement des utilisateurs disponibles...</p>
        </div>
      ) : availableUsers.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-6">
          <p>Aucun utilisateur disponible. Créez d'abord un utilisateur avec le rôle "CLIENT".</p>
          <button
            onClick={() => navigate('/users/new')}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Créer un nouvel utilisateur
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <ClientForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
                   isEdit={false}
            availableUsers={availableUsers}
          />
        </div>
      )}
    </div>
  );
};

export default ClientNewPage;