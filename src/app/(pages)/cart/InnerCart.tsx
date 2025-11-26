"use client"
import { Button, Separator } from '@/components'
import CartProduct from '@/components/products/CartProduct'
import { formatPrice } from '@/helpers/currency'
import { CartResponseData, InnerCartProduct } from '@/interfaces'
import { apiServices } from '@/services/api'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { Product } from './../../../interfaces/product';
import toast from 'react-hot-toast'


interface InnerCartProps {
    cartData : CartResponseData<InnerCartProduct>
}

export default function InnerCart( {cartData}: InnerCartProps ) {
    const [InnerCartData, setInnerCartData] = useState<CartResponseData<InnerCartProduct>>(cartData)

      async function handlrRemoveCartItem( ProductId: string, setIsRemovingProduct: (Value: boolean) => void ){
        setIsRemovingProduct(true);
        const response = await apiServices.removeCartProduct(ProductId)
        toast.success("Product removed from cart successfully",{
            position: "bottom-right"
        });
        setIsRemovingProduct(false);
        
        const newCartData = await apiServices.getUserCart();
        setInnerCartData(newCartData.data);    
    }    





  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
        <p className="text-muted-foreground mb-8">
          <span className="font-semibold">
            {InnerCartData.products.length} item
            {InnerCartData.products.length > 1 ? "s" : ""}
          </span>{" "}
          in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT SIDE — Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-5">
            {InnerCartData.products.map((item) =>
            <CartProduct handlrRemoveCartItem={handlrRemoveCartItem} item={item}/> 
            )}
          </div>

        <div className="mt-6"></div>
          {/* Clear Cart */}
          <Button variant="outline">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        {/* RIGHT SIDE — Order Summary */}
        <div className="border rounded-xl shadow-sm p-6 bg-white h-fit">
          <h2 className="text-xl font-semibold mb-5">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal ({InnerCartData.products.length} items)</span>
              <span>{formatPrice(InnerCartData.totalCartPrice)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>

            <Separator className="my-5" />

            <div className=" pt-4 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatPrice(InnerCartData.totalCartPrice)}</span>
            </div>
          </div>

          <Button className="w-full text-base py-6 mt-6" size="lg">
            Proceed to Checkout
          </Button>

          <Button variant="outline" className="w-full text-base py-6 mt-2">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    
    </>
  )
}
