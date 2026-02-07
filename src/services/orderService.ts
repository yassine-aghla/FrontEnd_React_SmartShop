
import api from './api';
import type { 
  Order, 
  CreateOrderDTO, 
  OrderPage, 
  OrderStatus,
  Payment 
} from '../types/order';

export const orderService = {
  // Récupérer toutes les commandes
  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },

  // Récupérer les commandes avec pagination
  getOrdersPaginated: async (page: number = 0, size: number = 10): Promise<OrderPage> => {
    const response = await api.get<OrderPage>('/orders/paginated', {
      params: { page, size, sort: 'orderDate,desc' }
    });
    return response.data;
  },

  // Récupérer une commande par ID
  getOrderById: async (id: number): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  // Récupérer une commande par référence
  getOrderByReference: async (reference: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/reference/${reference}`);
    return response.data;
  },

  // Récupérer les commandes d'un client
  getOrdersByClient: async (clientId: number): Promise<Order[]> => {
    const response = await api.get<Order[]>(`/orders/client/${clientId}`);
    return response.data;
  },

  // Récupérer les commandes d'un client avec pagination
  getOrdersByClientPaginated: async (clientId: number, page: number = 0, size: number = 10): Promise<OrderPage> => {
    const response = await api.get<OrderPage>(`/orders/client/${clientId}/paginated`, {
      params: { page, size }
    });
    return response.data;
  },

  // Récupérer les commandes par statut
  getOrdersByStatus: async (status: OrderStatus): Promise<Order[]> => {
    const response = await api.get<Order[]>(`/orders/status/${status}`);
    return response.data;
  },

  // Récupérer les commandes en attente
  getPendingOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/orders/pending');
    return response.data;
  },

  // Récupérer l'historique des commandes d'un client
  getClientOrderHistory: async (clientId: number): Promise<Order[]> => {
    const response = await api.get<Order[]>(`/orders/client/${clientId}/history`);
    return response.data;
  },

  // Créer une nouvelle commande
  createOrder: async (orderData: CreateOrderDTO): Promise<Order> => {
    const response = await api.post<Order>('/orders', orderData);
    return response.data;
  },

  // Confirmer une commande
  confirmOrder: async (id: number): Promise<Order> => {
    const response = await api.put<Order>(`/orders/${id}/confirm`);
    return response.data;
  },

  // Annuler une commande
  cancelOrder: async (id: number): Promise<Order> => {
    const response = await api.put<Order>(`/orders/${id}/cancel`);
    return response.data;
  },

  // Rejeter une commande
  rejectOrder: async (id: number, reason?: string): Promise<Order> => {
    const response = await api.put<Order>(`/orders/${id}/reject`, null, {
      params: { reason }
    });
    return response.data;
  },

  // Compter les commandes par statut
  countOrdersByStatus: async (status: OrderStatus): Promise<number> => {
    const response = await api.get<number>(`/orders/count/status/${status}`);
    return response.data;
  },

  // Obtenir le total dépensé par un client
  getTotalSpentByClient: async (clientId: number): Promise<number> => {
    const response = await api.get<{ totalSpent: number }>(`/orders/client/${clientId}/total-spent`);
    return response.data.totalSpent;
  },

  // Compter les commandes confirmées d'un client
  countConfirmedOrdersByClient: async (clientId: number): Promise<number> => {
    const response = await api.get<{ confirmedOrders: number }>(`/orders/client/${clientId}/count-confirmed`);
    return response.data.confirmedOrders;
  },

  // Services de paiement (si vous avez un controller payment)
  getOrderPayments: async (orderId: number): Promise<Payment[]> => {
    const response = await api.get<Payment[]>(`/payments/order/${orderId}`);
    return response.data;
  },

  // Ajouter un paiement
  addPayment: async (paymentData: any): Promise<Payment> => {
    const response = await api.post<Payment>('/payments', paymentData);
    return response.data;
  }
};