export interface ProductVariation {
  id: number;
  product_id: number;
  color: string;
  size: string;
  stock: number;
  price: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  cost: number;
  stock: number;
  status: string;
  category: string;
  sku: string;
  description?: string;
  variations?: ProductVariation[];
}
