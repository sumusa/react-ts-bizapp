import { Product } from "./product";

import { ProductVariation } from "./product";

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product: Product;
  quantity: number;
  price: number;
  variation_id?: number;
  variation?: ProductVariation;
}

export interface Order {
  id: number;
  customer_name: string;
  email: string;
  phone: string;
  shipping_address: string;
  billing_address: string;
  payment_method: string;
  created_at: string;
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: {
    id: string;
    price: number;
    quantity: number;
    product: {
      name: string;
    };
    variation?: {
      color: string;
      size: string;
    };
  }[];
}
