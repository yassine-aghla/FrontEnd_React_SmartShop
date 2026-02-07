
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'REJECTED';

export interface OrderItem {
  id: number;
  productId: number;
  productNom: string;
  quantite: number;
  prixUnitaire: number;
  totalLigne: number;
}

export interface Order {
  id: number;
  reference: string;
  clientId: number;
  clientNom: string;
  clientEmail: string;
  orderDate: string;
  statut: OrderStatus;
  sousTotal: number;
  remiseFidelitePourcentage: number;
  remiseFideliteMontant: number;
  remisePromoPourcentage: number;
  remisePromoPourcentage_montant: number;
  remiseTotale: number;
  montantHT: number;
  montantTVA: number;
  totalTTC: number;
  montantPaye: number;
  montantRestant: number;
  notes?: string;
  confirmedAt?: string;
  canceledAt?: string;
  orderItems: OrderItem[];
}

export interface CreateOrderItemDTO {
  productId: number;
  quantite: number;
}

export interface CreateOrderDTO {
  clientId: number;
  items: CreateOrderItemDTO[];
  promoCode?: string;
  notes?: string;
}

export interface OrderPage {
  content: Order[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface Payment {
  id: number;
  orderId: number;
  montant: number;
  type: 'ESPÈCES' | 'CHÈQUE' | 'VIREMENT';
  reference?: string;
  banque?: string;
  numeroCheque?: string;
  dateEcheance?: string;
  createdAt: string;
}