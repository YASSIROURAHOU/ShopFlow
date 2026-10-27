export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
    active: boolean;
  }
  
  export interface CartItem {
    product: Product;
    quantity: number;
  }
  
  export interface UserAuth {
    token: string;
    email: string;
    role: string;
  }