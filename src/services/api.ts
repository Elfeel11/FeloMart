import { ProductsResponse, SingleProductResponse } from "@/types";
import {
  AddToCartResponse,
  GetUserCartResponse,
  WishlistResponse,
  AddOrRemoveWishlistResponse,
  SignInResponse,
  SignInPayload,
  SignUpResponse,
  SignUpPayload,
} from "@/interfaces";

class ApiServices {
  #baseUrl: string = "https://ecommerce.routemisr.com/";

  #getHeaders(token?: string) {
    return {
      "Content-Type": "application/json",
      ...(token ? { token } : {}),
    };
  }

  // ---------- Products ----------
  async getAllProducts(): Promise<ProductsResponse> {
    return await fetch(this.#baseUrl + "api/v1/products", {
      next: {
        revalidate: 60,
      },
    }).then((res) => res.json());
  }

  async getProductDetails(productId: string): Promise<SingleProductResponse> {
    return await fetch(this.#baseUrl + "api/v1/products/" + productId).then(
      (res) => res.json(),
    );
  }

  // ---------- Auth ----------
  async signIn(payload: SignInPayload): Promise<SignInResponse> {
    return await fetch(this.#baseUrl + "api/v1/auth/signin", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: this.#getHeaders(),
    }).then((res) => res.json());
  }

  async signUp(payload: SignUpPayload): Promise<SignUpResponse> {
    return await fetch(this.#baseUrl + "api/v1/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: this.#getHeaders(),
    }).then((res) => res.json());
  }

  // ---------- Cart ----------
  async addProductToCart(
    productId: string,
    token: string,
  ): Promise<AddToCartResponse> {
    return await fetch(this.#baseUrl + "api/v1/cart", {
      method: "POST",
      body: JSON.stringify({ productId }),
      headers: this.#getHeaders(token),
    }).then((res) => res.json());
  }

  async getUserCart(token: string): Promise<GetUserCartResponse> {
    return await fetch(this.#baseUrl + "api/v1/cart", {
      headers: this.#getHeaders(token),
      cache: "no-store",
    }).then((res) => res.json());
  }

  async removeCartProduct(
    productId: string,
    token: string,
  ): Promise<{ status: string }> {
    return await fetch(this.#baseUrl + "api/v1/cart/" + productId, {
      method: "delete",
      headers: this.#getHeaders(token),
    }).then((res) => res.json());
  }

  async clearCart(token: string): Promise<{ status: string }> {
    return await fetch(this.#baseUrl + "api/v1/cart/", {
      method: "delete",
      headers: this.#getHeaders(token),
    }).then((res) => res.json());
  }

  async updateCartProductQuantity(
    productId: string,
    count: number,
    token: string,
  ): Promise<{ status: string }> {
    return await fetch(this.#baseUrl + "api/v1/cart/" + productId, {
      method: "PUT",
      headers: this.#getHeaders(token),
      body: JSON.stringify({ count }),
    }).then((res) => res.json());
  }

  // ---------- Wishlist ----------
  async getWishlist(token: string): Promise<WishlistResponse> {
    return await fetch(this.#baseUrl + "api/v1/wishlist", {
      headers: this.#getHeaders(token),
      cache: "no-store",
    }).then((res) => res.json());
  }

  async addToWishlist(
    productId: string,
    token: string,
  ): Promise<AddOrRemoveWishlistResponse> {
    return await fetch(this.#baseUrl + "api/v1/wishlist", {
      method: "POST",
      body: JSON.stringify({ productId }),
      headers: this.#getHeaders(token),
    }).then((res) => res.json());
  }

  async removeFromWishlist(
    productId: string,
    token: string,
  ): Promise<AddOrRemoveWishlistResponse> {
    return await fetch(this.#baseUrl + "api/v1/wishlist/" + productId, {
      method: "delete",
      headers: this.#getHeaders(token),
    }).then((res) => res.json());
  }
}

export const apiServices = new ApiServices();
