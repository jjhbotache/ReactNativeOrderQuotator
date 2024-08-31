export interface Product {
  id?: number;
  name: string;
  unit: string;
  price: number;
}

export interface Order {
  id: number;
  name: string;
  companyName: string;
  companyNit: string;
  productOrders: ProductOrder[];
}

export interface ProductOrder {
  id: number;
  id_product: number;
  id_order: number;
  amount: number | string ;
}

