"use client";
import { Button, Separator } from "@/components";
import CartProduct from "@/components/products/CartProduct";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { formatPrice } from "@/helpers/currency";
import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchCart,
  removeCartItem,
  updateCartItemQuantity,
  clearCart,
} from "@/redux/slices/cartSlice";

export default function InnerCart() {
  const { data: session, status: sessionStatus } = useSession();
  const dispatch = useAppDispatch();
  const { products, numOfCartItems, totalCartPrice, status } = useAppSelector(
    (state) => state.cart
  );
  const [isClearingCart, setIsClearingCart] = useState(false);

  useEffect(() => {
    if (session?.token) {
      dispatch(fetchCart(session.token));
    }
  }, [session?.token, dispatch]);

  async function handlrRemoveCartItem(
    productId: string,
    setIsRemovingProduct: (value: boolean) => void
  ) {
    if (!session?.token) return;
    setIsRemovingProduct(true);
    await dispatch(removeCartItem({ productId, token: session.token }));
    toast.success("Product removed from cart successfully", {
      position: "bottom-right",
    });
    setIsRemovingProduct(false);
  }

  async function handleUpdateCartProductQuantity(productId: string, count: number) {
    if (!session?.token) return;
    await dispatch(updateCartItemQuantity({ productId, count, token: session.token }));
  }

  async function handleClearCart() {
    if (!session?.token) return;
    setIsClearingCart(true);
    await dispatch(clearCart(session.token));
    toast.success("Cart cleared successfully", { position: "bottom-right" });
    setIsClearingCart(false);
  }

  if (sessionStatus === "loading" || status === "loading" || status === "idle") {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
        {numOfCartItems > 0 && (
          <p className="text-muted-foreground mb-8">
            <span className="font-semibold">
              {numOfCartItems} item
              {numOfCartItems > 1 ? "s" : ""}
            </span>{" "}
            in your cart
          </p>
        )}
      </div>

      {numOfCartItems > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT SIDE — Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-5">
              {products.map((item) => (
                <CartProduct
                  key={item._id}
                  handlrRemoveCartItem={handlrRemoveCartItem}
                  item={item}
                  updateCartProductQuantity={handleUpdateCartProductQuantity}
                />
              ))}
            </div>

            <div className="mt-6"></div>
            {/* Clear Cart */}
            <Button
              onClick={() => {
                handleClearCart();
              }}
              disabled={isClearingCart}
              variant="outline"
            >
              {isClearingCart ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Clear Cart
            </Button>
          </div>

          {/* RIGHT SIDE — Order Summary */}
          <div className="border rounded-xl shadow-sm p-6 bg-white h-fit">
            <h2 className="text-xl font-semibold mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal ({numOfCartItems} items)</span>
                <span>{formatPrice(totalCartPrice)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>

              <Separator className="my-5" />

              <div className=" pt-4 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatPrice(totalCartPrice)}</span>
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
      ) : (
        <div className="text-center lg:col-span-3 flex flex-col justify-center items-center gap-4  ">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            No Product In Your Cart
          </h2>
          <Button variant="outline" className=" w-fit mt-2 ">
            <Link href="/products">Add One Now</Link>
          </Button>
        </div>
      )}
    </>
  );
}
