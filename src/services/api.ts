import { ProductsResponse, SingleProductResponse } from "@/types";
import { AddToCartResponse, GetUserCartResponse } from './../interfaces';



// const baseUrl = process.env.NEXT_PUPLIC_API_BASE_URL;


class ApiServices {


    #baseUrl: string = "https://ecommerce.routemisr.com/" 
    // constructor(){
    //     this.baseUrl = baseUrl ?? "";
    // } 

  async getAllProducts(): Promise<ProductsResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/products",{      
        next: {
        revalidate: 60
        },
        cache : "no-cache"
      }
    ).then((res) => res.json());
  }

  
  async getProductDetails(productId: string): Promise<SingleProductResponse> {
    return await fetch(
      this.#baseUrl + "api/v1/products/" + productId
    ).then((res) => res.json());
  }

  #getHeaders(){
    return {
      "Content-Type": "application/json",
       token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MTA4ZmZjNTE0MThhZjVhOGNiMjYxNyIsIm5hbWUiOiJBaG1lZCBBYmQgQWwtTXV0aSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzYzMDc5NTUzLCJleHAiOjE3NzA4NTU1NTN9.SsM0OForvTZyaW33dc4gCx1U1jxftmgui7g6SfhEG5M`
    }
  }
  async addProductToCart(productId: string): Promise<AddToCartResponse>{
    return await fetch(
      this.#baseUrl + "api/v1/cart" , {
        method: "POST",
        body: JSON.stringify({ productId }),
        headers: this.#getHeaders()
      }
    ).then((res) => res.json());
  }


async getUserCart(): Promise<GetUserCartResponse> {
return await fetch(
      this.#baseUrl + "api/v1/cart" , {
      headers: this.#getHeaders()
      }).then((res) => res.json());
}

async removeCartProduct(productId: string): Promise<any>{
  return await fetch(this.#baseUrl + "api/v1/cart/" + productId , {
    method: "delete",
    headers: this.#getHeaders()
  }).then((res) => res.json());
}



}


export const apiServices = new ApiServices();