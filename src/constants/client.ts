// src/constants/client.ts
export const CUSTOMER_TIERS = ['BASIC', 'SILVER', 'GOLD', 'PLATINUM'] as const;
export type CustomerTier = typeof CUSTOMER_TIERS[number];

export const CustomerTierLabels: Record<CustomerTier, string> = {
  BASIC: 'Basique',
  SILVER: 'Argent',
  GOLD: 'Or',
  PLATINUM: 'Platine'
};

export const CustomerTierColors: Record<CustomerTier, string> = {
  BASIC: 'bg-gray-100 text-gray-800',
  SILVER: 'bg-gray-200 text-gray-800',
  GOLD: 'bg-yellow-100 text-yellow-800',
  PLATINUM: 'bg-purple-100 text-purple-800'
};

export const CustomerTierDiscounts: Record<CustomerTier, number> = {
  BASIC: 0,
  SILVER: 5,
  GOLD: 10,
  PLATINUM: 15
};