// src/pages/clients/ClientEditPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientService } from '../../services/clientService';
import type { Client, ClientDTO } from '../../types/client';
import ClientForm from '../../components/clients/ClientForm';

const ClientEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return;
      
      setIsLoadingData(true);
      try {
        const data = await clientService.getClientById(parseInt(id));
        setClient(data);
      } catch (err: any) {
        setError('Client non trouvé');
        console.error('Erreur:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleSubmit = async (clientData: ClientDTO) => {
    if (!id || !client) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await clientService.updateClient(parseInt(id), clientData);
      alert('Client modifié avec succès !');
      navigate(`/clients/${id}`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erreur lors de la modification';
      setError(errorMessage);
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
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

  const initialData: ClientDTO = {
    nom: client.nom,
    email: client.email,
    customerTier: client.customerTier,
    isActive: client.isActive
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/clients/${client.id}`)}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour aux détails
        </button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Modifier le client
      </h1>
      <p className="text-gray-600 mb-2">ID: {client.id}</p>
      <p className="text-gray-600 mb-6">Créé le: {new Date(client.createdAt).toLocaleDateString('fr-FR')}</p>

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

      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-sm">
            <span className="font-semibold">Note:</span> Vous pouvez modifier les informations de base du client.
            Le niveau de fidélité sera recalculé automatiquement en fonction des achats futurs.
          </p>
        </div>
        
        <ClientForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isEdit={true}
        />
      </div>
    </div>
  );
};

export default ClientEditPage;