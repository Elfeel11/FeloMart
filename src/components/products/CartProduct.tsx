"use client";
import { formatPrice } from "@/helpers/currency";
import {  Loader2, Minus, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui";
import { CartProduct as CartProductI, InnerCartProduct } from "@/interfaces";
import { Product } from "@/interfaces";
import Link from "next/link";
import { apiServices } from "@/services/api";
import toast from "react-hot-toast";
import { it } from "node:test";

interface cartproductProps {
  item: CartProductI<InnerCartProduct>;
  handlrRemoveCartItem: ( ProductId: string, setIsRemovingProduct: (Value: boolean) => void ) => void;
}

export default function CartProduct({ item, handlrRemoveCartItem}: cartproductProps) {
    const [IsRemovingProduct, setIsRemovingProduct] = useState(false)


  



  return (
    <div
      key={item._id}
      className="flex items-center justify-between border rounded-xl p-5 bg-white shadow-sm"
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
          <p className="font-medium  mt-1">{formatPrice(item.price)}</p>
        </div>
      </div>

      {/* Quantity Controls + Delete */}
      <div className="flex flex-col items-end gap-4">
        {/* Delete Icon */}
        <div className=" ">
          <Button
            onClick={() => handlrRemoveCartItem(item.product._id, setIsRemovingProduct)}
            className="text-gray-600 hover:text-red-500"
            variant="ghost"
            size="sm"
          >
            { IsRemovingProduct ? <Loader2 className="animate-spin" />  : <Trash2 className="w-4 h-4" />}
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
  );
}
