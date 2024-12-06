export type Product = {
    id: number;
    name: string;
    description: string;
    price: string | number;
    category: string;
    imageData: string;
    [key: string]: any;
  }
