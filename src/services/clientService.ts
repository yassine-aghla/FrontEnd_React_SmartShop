// src/services/clientService.ts
import api from './api';
import type { Client, ClientDTO, ClientPage, CustomerTier } from '../types/client';

export const clientService = {
  // Récupérer tous les clients
  getAllClients: async (): Promise<Client[]> => {
    const response = await api.get<Client[]>('/clients');
    return response.data;
  },

  // Récupérer les clients actifs
  getActiveClients: async (): Promise<Client[]> => {
    const response = await api.get<Client[]>('/clients/active');
    return response.data;
  },

  // Récupérer les clients actifs avec pagination
  getActiveClientsPaginated: async (page: number = 0, size: number = 10): Promise<ClientPage> => {
    const response = await api.get<ClientPage>('/clients/active/paginated', {
      params: { page, size, sort: 'createdAt,desc' }
    });
    return response.data;
  },

  // Récupérer un client par ID
  getClientById: async (id: number): Promise<Client> => {
    const response = await api.get<Client>(`/clients/${id}`);
    return response.data;
  },

  // Récupérer un client par email
  getClientByEmail: async (email: string): Promise<Client> => {
    const response = await api.get<Client>(`/clients/email/${email}`);
    return response.data;
  },

  // Récupérer les clients par tier
  getClientsByTier: async (tier: CustomerTier): Promise<Client[]> => {
    const response = await api.get<Client[]>(`/clients/tier/${tier}`);
    return response.data;
  },

  // Récupérer les clients par tier avec pagination
  getClientsByTierPaginated: async (tier: CustomerTier, page: number = 0, size: number = 10): Promise<ClientPage> => {
    const response = await api.get<ClientPage>(`/clients/tier/${tier}/paginated`, {
      params: { page, size }
    });
    return response.data;
  },

  // Créer un nouveau client
  createClient: async (clientData: ClientDTO, userId: number): Promise<Client> => {
    const response = await api.post<Client>('/clients', clientData, {
      params: { userId }
    });
    return response.data;
  },

  // Mettre à jour un client
  updateClient: async (id: number, clientData: ClientDTO): Promise<Client> => {
    const response = await api.put<Client>(`/clients/${id}`, clientData);
    return response.data;
  },

  // Supprimer un client (soft delete)
  deleteClient: async (id: number): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },

  // Récupérer les statistiques d'un client
  getClientStatistics: async (id: number): Promise<Client> => {
    const response = await api.get<Client>(`/clients/${id}/statistics`);
    return response.data;
  },

  // Vérifier si un email existe
  checkEmailExists: async (email: string): Promise<boolean> => {
    const response = await api.get<boolean>(`/clients/exists/email/${email}`);
    return response.data;
  },

  // Compter les clients actifs
  countActiveClients: async (): Promise<number> => {
    const response = await api.get<number>('/clients/count/active');
    return response.data;
  },

  // Compter les clients par tier
  countClientsByTier: async (tier: CustomerTier): Promise<number> => {
    const response = await api.get<number>(`/clients/count/tier/${tier}`);
    return response.data;
  },

  // Rechercher des clients
  searchClients: async (searchTerm: string): Promise<Client[]> => {
    const response = await api.get<Client[]>('/clients/search', {
      params: { q: searchTerm }
    });
    return response.data;
  }
};