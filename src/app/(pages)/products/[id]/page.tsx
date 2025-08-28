"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Product } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ShoppingCart, Heart, Truck, Shield, RotateCcw } from "lucide-react";
import Link from "next/link";
import { renderStars } from "@/helpers/rating";

export default function ProductDetailPage() {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Product not found"}</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <Image
              src={""}
              alt={""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Thumbnail Images */}
          {/* {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )} */}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand */}
          <div className="text-sm text-muted-foreground uppercase tracking-wide">
            <Link
              href={``}
              className="hover:text-primary hover:underline transition-colors"
            >
              {"Brand"}
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold">{"productTitle"}</h1>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {renderStars(5)}
              <span className="ml-2 text-sm text-muted-foreground">
                {"4.5"} ({"1000"} reviews)
              </span>
            </div>
            <span className="text-sm text-muted-foreground">{"1500"} sold</span>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-primary">
            {formatPrice(1500)}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {"product description"}
            </p>
          </div>

          {/* Category & Subcategory */}
          <div className="flex flex-wrap gap-2">
            <Link
              href={``}
              className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80 transition-colors"
            >
              {"categoryName"}
            </Link>
            {/* {product.subcategory.map((sub) => (
              <span
                key={sub._id}
                className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
              >
                {sub.name}
              </span>
            ))} */}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Stock:</span>
            <span
              className={`text-sm ${
                15 > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {15 > 0
                ? `${15} available`
                : "Out of stock"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              // disabled={15 === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" size="lg">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Free Shipping</p>
                <p className="text-xs text-muted-foreground">
                  On orders over $50
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Secure Payment</p>
                <p className="text-xs text-muted-foreground">
                  100% secure checkout
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Easy Returns</p>
                <p className="text-xs text-muted-foreground">
                  30-day return policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
