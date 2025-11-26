import { LoadingSpinner } from "@/components";
import { apiServices } from "@/services/api";
import { Minus, Plus, Trash2 } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/helpers/currency";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default async function Cart() {
  async function fetchCart() {
    const response = await apiServices.getUserCart();
    return response;
  }

  const cart = (await fetchCart()).data;

  cart.products[0].product.title;

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
        <p className="text-muted-foreground mb-8">
          <span className="font-semibold">
            {cart.products.length} item
            {cart.products.length > 1 ? "s" : ""}
          </span>{" "}
          in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT SIDE — Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-5">
            {cart.products.map((item) => (
              <div key={item._id} className="flex items-center justify-between border rounded-xl p-5 bg-white shadow-sm"
              >
                {/* item Info */}
                <div className="flex items-center gap-5">
                  {/* Image */}
                  <img
                    src={item.product.imageCover}
                    alt={item.product.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  {/* Text Info */}
                  <div>
                    <h3 className="font-semibold line-clamp-2">
                      <Link
                      href={`/products/${item.product._id}`}
                      className="hover:text-primary transition-colors"
                      >
                      {item.product.title}
                      </Link>
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {item.product.brand.name}
                    </p>
                    {/* <p className="text-muted-foreground text-sm">{product.product.brand}</p> */}
                    <p className="font-medium  mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls + Delete */}
                <div className="flex flex-col items-end gap-4">
                  {/* Delete Icon */}
                  <div className=" ">
                  <Button
                    //   onClick={() => onRemoveItem(item.product._id)}
                    className="text-gray-600 hover:text-red-500"
                    variant="ghost"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  </div>

                  <div className="flex items-center rounded-lg px-3 py-2">
                    <Button
                      // onClick={() => onUpdateQty(product.product._id, product.count - 1)}
                      className="  "
                      size="sm"
                      // disabled={item.count <= 1}
                      variant="secondary"
                      >
                      <Minus className="w-4 h-4" />
                    </Button>

                    <span className="mx-2 font-semibold">{item.count}</span>

                    <Button
                      // onClick={() => onUpdateQty(item.product._id, item.count + 1)}
                      className="p-1"
                      size="sm"
                      variant="secondary"
                      disabled={item.count >= item.product.quantity}  
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                </div>
              </div>
            ))}
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
              <span>Subtotal ({cart.products.length} items)</span>
              <span>{formatPrice(cart.totalCartPrice)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>

            <Separator className="my-5" />

            <div className=" pt-4 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatPrice(cart.totalCartPrice)}</span>
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
    </div>
  );
}
