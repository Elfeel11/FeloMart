"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { formatPrice } from "@/helpers/currency";
import { Heart, Loader2, ShoppingCart, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchWishlist, removeFromWishlist } from "@/redux/slices/wishlistSlice";
import { addToCart } from "@/redux/slices/cartSlice";

export default function WishlistPage() {
  const { data: session, status: sessionStatus } = useSession();
  const dispatch = useAppDispatch();
  const { items, status, mutatingIds } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    if (session?.token) {
      dispatch(fetchWishlist(session.token));
    }
  }, [session?.token, dispatch]);

  async function handleRemove(productId: string) {
    if (!session?.token) return;
    const result = await dispatch(removeFromWishlist({ productId, token: session.token }));
    if (removeFromWishlist.fulfilled.match(result)) {
      toast.success("Removed from wishlist", { position: "bottom-right" });
    }
  }

  async function handleAddToCart(productId: string) {
    if (!session?.token) return;
    const result = await dispatch(addToCart({ productId, token: session.token }));
    if (addToCart.fulfilled.match(result) && result.payload.status === "success") {
      toast.success(result.payload.message, { position: "bottom-right" });
    } else {
      toast.error("Error. Please try again.", { position: "bottom-right" });
    }
  }

  if (sessionStatus === "loading" || status === "loading" || status === "idle") {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="flex justify-center items-center min-h-[300px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
        <p className="text-muted-foreground">
          {items.length > 0
            ? `${items.length} item${items.length > 1 ? "s" : ""} saved for later`
            : "Products you save will show up here."}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center flex flex-col items-center gap-4 py-16">
          <Heart className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-gray-800">Your wishlist is empty</h2>
          <Button variant="outline" asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between border rounded-xl p-5 bg-white shadow-sm gap-4"
            >
              <div className="flex items-center gap-5 min-w-0">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={item.imageCover}
                    alt={item.title}
                    fill
                    className="object-cover rounded-lg"
                    sizes="80px"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold line-clamp-2">
                    <Link
                      href={`/products/${item.id ?? item._id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground text-sm">{item.brand?.name}</p>
                  <p className="font-medium mt-1">{formatPrice(item.price)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(item._id)}
                  disabled={item.quantity === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(item._id)}
                  disabled={mutatingIds.includes(item._id)}
                  className="text-gray-600 hover:text-red-500"
                >
                  {mutatingIds.includes(item._id) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
