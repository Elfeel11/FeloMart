"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Loader2 } from "lucide-react";
import { renderStars } from "@/helpers/rating";
import { formatPrice } from "@/helpers/currency";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import AddToCartButton from "./AddProductButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/redux/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/redux/slices/wishlistSlice";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const [addToCartLoading, setaddToCartLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session } = useSession();

  const isInWishlist = useAppSelector((state) =>
    state.wishlist.productIds.includes(product._id)
  );
  const isWishlistMutating = useAppSelector((state) =>
    state.wishlist.mutatingIds.includes(product._id)
  );

  async function HandleAddProductToCart(productId: string, setLoading: (v: boolean) => void) {
    if (!session?.token) {
      toast.error("Please sign in to add items to your cart", { position: "bottom-right" });
      router.push("/login");
      return;
    }

    setLoading(true);
    const result = await dispatch(addToCart({ productId, token: session.token }));
    setLoading(false);

    if (addToCart.fulfilled.match(result) && result.payload.status === "success") {
      toast.success(result.payload.message, { position: "bottom-right" });
    } else {
      toast.error("Error. Please try again.", { position: "bottom-right" });
    }
  }

  function handleToggleWishlist() {
    if (!session?.token) {
      toast.error("Please sign in to use your wishlist", { position: "bottom-right" });
      router.push("/login");
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist({ productId: product._id, token: session.token })).then(
        (result) => {
          if (removeFromWishlist.fulfilled.match(result)) {
            toast.success("Removed from wishlist", { position: "bottom-right" });
          }
        }
      );
    } else {
      dispatch(addToWishlist({ productId: product._id, token: session.token })).then((result) => {
        if (addToWishlist.fulfilled.match(result)) {
          toast.success("Added to wishlist", { position: "bottom-right" });
        }
      });
    }
  }

  const WishlistButton = (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleWishlist}
      disabled={isWishlistMutating}
      className={cn(viewMode === "grid" && "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white")}
    >
      {isWishlistMutating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart className={cn("h-4 w-4", isInWishlist && "fill-red-500 text-red-500")} />
      )}
    </Button>
  );

  if (viewMode === "list") {
    return (
      <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
        <div className="relative w-32 h-32 flex-shrink-0">
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            className="object-cover rounded-md"
            sizes="128px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-2">
              <Link
                href={`/products/${product.id}`}
                className="hover:text-primary transition-colors"
              >
                {product.title}
              </Link>
            </h3>
            {WishlistButton}
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              {renderStars(product.ratingsAverage)}
              <span className="text-sm text-muted-foreground ml-1">
                ({product.ratingsQuantity})
              </span>
            </div>

            <span className="text-sm text-muted-foreground">
              {product.sold} sold
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  Brand:{" "}
                  <Link
                    href={`/brands/${product.brand._id}`}
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    {product.brand.name}
                  </Link>
                </span>
                <span>
                  Category:{" "}
                  <Link
                    href={`/categories/${product.category._id}`}
                    className="hover:text-primary hover:underline transition-colors"
                  >
                    {product.category.name}
                  </Link>
                </span>
              </div>
            </div>

            <Button
              onClick={() => HandleAddProductToCart(product._id, setaddToCartLoading)}
              disabled={addToCartLoading}
            >
              {addToCartLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ShoppingCart className="h-4 w-4 mr-2" />
              )}
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col justify-between relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">

      <div className="">
        {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.imageCover}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* Wishlist Button */}
        {WishlistButton}

        {/* Badge for sold items */}
        { product.sold > 100 && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Popular
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
          <Link
            href={`/brands/${product.brand._id}`}
            className="hover:text-primary hover:underline transition-colors"
            >
              {product.brand.name}
            </Link>

        </p>

        {/* Title */}
        <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
          <Link href={`/products/${product.id}`}>
          {product.title}
          </Link>
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">{renderStars(product.ratingsAverage)}</div>
          <span className="text-xs text-muted-foreground">({product.ratingsQuantity})</span>
        </div>

        {/* Category */}
        <p className="text-xs text-muted-foreground mb-2">
          <Link
            href={`/categories/${product.category._id}`}
            className="hover:text-primary hover:underline transition-colors"
          >
            {product.category.name}
          </Link>
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-muted-foreground"> {product.sold} sold</span>
        </div>


      </div>
</div>


      {/* Add to Cart Button */}
      <div className="p-4 ">
        <AddToCartButton
          HandleAddProductToCart={() => HandleAddProductToCart(product._id, setaddToCartLoading)}
          addToCartLoading={addToCartLoading}
          productQuantity={product.quantity}
        />
      </div>
    </div>
  );
}
