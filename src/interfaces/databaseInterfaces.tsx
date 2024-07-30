interface Product {
  id?: number;
  name: string;
  unit: string;
  price: number;
}

interface Order {
  id?: number;
  name: string;
}

interface ProductOrder {
  id: number;
  id_product: number;
  id_order: number;
  amount: number;
}
