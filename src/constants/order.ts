
export const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'CANCELED', 'REJECTED'] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];

export const OrderStatusLabels: Record<OrderStatus, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  CANCELED: 'Annulée',
  REJECTED: 'Rejetée'
};

export const OrderStatusColors: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELED: 'bg-red-100 text-red-800',
  REJECTED: 'bg-gray-100 text-gray-800'
};

export const PAYMENT_TYPES = ['ESPÈCES', 'CHÈQUE', 'VIREMENT'] as const;
export type PaymentType = typeof PAYMENT_TYPES[number];