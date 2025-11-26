import { Brand } from "./brand";
import { Category, Subcategory } from "./category";

export interface AddToCartResponse {
  status: string;
  message: string;
  numOfCartItems: number;
  cartId: string;
  data: CartResponseData<string>;
}

export interface GetUserCartResponse {
  status: string;
  message: string;
  numOfCartItems: number;
  cartId: string;
  data: CartResponseData<Product>;
}

interface CartResponseData<T> {
  _id: string;
  cartOwner: string;
  products: CartProduct<T>[];
  createdAt: string;   
  updatedAt: string;   
  totalCartPrice: number;
}

interface CartProduct<T> {
  count: number;
  _id: string;
  product: T;
  price: number;
}

interface Product {
  subcategory: Subcategory[];
  _id: string;
  title: string;
  quantity: number;
  imageCover: string;
  category: Category;
  brand: Brand;
  ratingsAverage: number;
  id: string;
}
