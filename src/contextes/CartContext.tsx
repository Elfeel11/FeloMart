"use client";
import { apiServices } from "@/services/api";
import React, { createContext, Dispatch, useEffect, useState } from "react";
import toast from "react-hot-toast";


type CartContexrType = {
  CartCount?: number;
  setCartCount?: Dispatch<React.SetStateAction<number>>;
  IsLioadingCount?: boolean;
  HandleAddProductToCart?: (
    porductId: string,
    setaddToCartLoading: Dispatch<React.SetStateAction<boolean>>
  ) => Promise<void>;

}



export const cartContext = createContext<CartContexrType>({});

export default function CartContextProvider({
  children,
}: {
  children: React.ReactNode;

}) {
  const [CartCount, setCartCount] = useState(0);
  const [IsLioadingCount, setIsLioadingCount] = useState(true)

  

   async function HandleAddProductToCart(porductId: string, setaddToCartLoading: Dispatch<React.SetStateAction<boolean>>){
    setaddToCartLoading(true);
      const data = await apiServices.addProductToCart(porductId);

      if(data.status != "success"){
        toast.error("Error. Please try again.",{
            position: "bottom-right"
            })
      }else{
        toast.success(data.message,{
            position: "bottom-right"
           })
           setCartCount(data.numOfCartItems)
      }
      
    setaddToCartLoading(false);
   }


  async function getCart(){
    setIsLioadingCount(true)
    const response = await apiServices.getUserCart()
    setCartCount(response.numOfCartItems)
    setIsLioadingCount(false)
  }

  

  useEffect(() => {

    getCart()

  },[])

  return (
    <cartContext.Provider value={{ CartCount, setCartCount, IsLioadingCount, HandleAddProductToCart }}>
      {children}
    </cartContext.Provider>
  );
}
