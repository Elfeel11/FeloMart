import { apiServices } from "@/services/api";
import React from "react";
import InnerCart from "./InnerCart";


export default async function Cart() {
  async function fetchCart() {
    const response = await apiServices.getUserCart();
    return response;
  }

  const cart = (await fetchCart()).data;

  cart.products[0].product.title;

  return (
    <div className="container mx-auto px-4 py-10">
    <InnerCart cartData= {cart} />  
    </div>
  );
}
