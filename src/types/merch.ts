export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  isAccent?: boolean;
}

export interface Category {
  id: string;
  label: string;
}
