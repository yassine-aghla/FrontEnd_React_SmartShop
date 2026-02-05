// src/types/client.ts
export type CustomerTier = 'BASIC' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface Client {
  id: number;
  nom: string;
  email: string;
  customerTier: CustomerTier;
  totalOrders: number;
  totalSpent: number;
  firstOrderDate?: string;
  lastOrderDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number;
  userUsername: string;
}

export interface ClientDTO {
  nom: string;
  email: string;
  customerTier: CustomerTier;
  isActive?: boolean;
  userId?: number;
}

export interface ClientPage {
  content: Client[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface ClientStatistics {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  firstOrderDate?: string;
  lastOrderDate?: string;
}