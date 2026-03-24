export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  sizes: string[];
  colors: string[];
  imageUrl: string;
  additionalImages: string[];
  stockStatus: 'In Stock' | 'Out of Stock';
  quantity: number;
  rating: number;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
}
