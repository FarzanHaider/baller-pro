export type OrderStatus = 'Delivered' | 'Shipped' | 'Processing';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  price: number;
}
