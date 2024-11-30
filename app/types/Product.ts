
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    imageData: string;
    [key: string]: any;
  }
