// src/types/user.ts
export type UserRole = 'ADMIN' | 'CLIENT';

export interface User {
  id: number;
  username: string;
  password?: string; // Optionnel pour la récupération
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserDTO {
  username: string;
  password: string;
  role: UserRole;
}

export interface UserPage {
  content: User[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}