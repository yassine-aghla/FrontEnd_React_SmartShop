// src/services/userService.ts
import api from './api';
import type { User, UserDTO, UserPage, UserRole } from '../types/user';

export const userService = {
  // Récupérer tous les utilisateurs
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  // Récupérer un utilisateur par ID
  getUserById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  // Récupérer un utilisateur par username
  getUserByUsername: async (username: string): Promise<User> => {
    const response = await api.get<User>(`/users/username/${username}`);
    return response.data;
  },

  // Récupérer les utilisateurs par rôle
  getUsersByRole: async (role: UserRole): Promise<User[]> => {
    const response = await api.get<User[]>(`/users/role/${role}`);
    return response.data;
  },

  // Créer un nouvel utilisateur
  createUser: async (userData: UserDTO): Promise<User> => {
    const response = await api.post<User>('/users', userData);
    return response.data;
  },

  // Mettre à jour un utilisateur
  updateUser: async (id: number, userData: UserDTO): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, userData);
    return response.data;
  },

  // Supprimer un utilisateur
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // Vérifier si un username existe
  checkUsernameExists: async (username: string): Promise<boolean> => {
    const response = await api.get<boolean>(`/users/exists/${username}`);
    return response.data;
  },

  // Recherche d'utilisateurs (si vous implémentez la pagination côté backend)
  searchUsers: async (searchTerm: string): Promise<User[]> => {
    const response = await api.get<User[]>('/users/search', {
      params: { term: searchTerm }
    });
    return response.data;
  }
};