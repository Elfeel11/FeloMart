import React from 'react'
import { Button } from '../ui'
import { Loader2, ShoppingCart } from 'lucide-react'

interface AddToCartButtonProps {
  productQuantity: number;
  addToCartLoading: boolean;
  HandleAddProductToCart: () => Promise<void>;

}

export default function AddToCartButton ({ productQuantity, addToCartLoading,HandleAddProductToCart  } : AddToCartButtonProps  ) {
  return (
   <Button
              size="lg"
              className="flex-1 w-full"
              disabled={productQuantity === 0 || addToCartLoading}
              onClick={HandleAddProductToCart}
            >
              {addToCartLoading && <Loader2 className="animate-spin " />}
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
  )
}
