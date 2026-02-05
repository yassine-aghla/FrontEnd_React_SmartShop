export interface Product {
  id: number;
  nom: string;
  prix: number;
  stock: number;
  deleted: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDTO {
  nom: string;
  prix: number;
  stock: number;
  description?: string;
}

export interface ProductPage {
  content: Product[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}