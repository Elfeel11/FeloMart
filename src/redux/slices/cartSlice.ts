import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiServices } from "@/services/api";
import { CartProduct, InnerCartProduct } from "@/interfaces";

interface CartState {
  cartId: string | null;
  products: CartProduct<InnerCartProduct>[];
  numOfCartItems: number;
  totalCartPrice: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  mutationLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cartId: null,
  products: [],
  numOfCartItems: 0,
  totalCartPrice: 0,
  status: "idle",
  mutationLoading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (token: string) => {
    return await apiServices.getUserCart(token);
  },
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, token }: { productId: string; token: string }) => {
    return await apiServices.addProductToCart(productId, token);
  },
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async ({ productId, token }: { productId: string; token: string }) => {
    await apiServices.removeCartProduct(productId, token);
    // The route API doesn't return the full cart on delete, so re-fetch it.
    return await apiServices.getUserCart(token);
  },
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async (
    { productId, count, token }: { productId: string; count: number; token: string },
  ) => {
    await apiServices.updateCartProductQuantity(productId, count, token);
    return await apiServices.getUserCart(token);
  },
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (token: string) => {
    await apiServices.clearCart(token);
    return true;
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart(state) {
      state.cartId = null;
      state.products = [];
      state.numOfCartItems = 0;
      state.totalCartPrice = 0;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartId = action.payload.cartId;
        state.numOfCartItems = action.payload.numOfCartItems;
        state.products = action.payload.data?.products ?? [];
        state.totalCartPrice = action.payload.data?.totalCartPrice ?? 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load cart";
      })

      // addToCart
      .addCase(addToCart.pending, (state) => {
        state.mutationLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.mutationLoading = false;
        if (action.payload.status === "success") {
          state.numOfCartItems = action.payload.numOfCartItems;
          state.cartId = action.payload.cartId;
        }
      })
      .addCase(addToCart.rejected, (state) => {
        state.mutationLoading = false;
      })

      // removeCartItem
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.cartId = action.payload.cartId;
        state.numOfCartItems = action.payload.numOfCartItems;
        state.products = action.payload.data?.products ?? [];
        state.totalCartPrice = action.payload.data?.totalCartPrice ?? 0;
      })

      // updateCartItemQuantity
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.cartId = action.payload.cartId;
        state.numOfCartItems = action.payload.numOfCartItems;
        state.products = action.payload.data?.products ?? [];
        state.totalCartPrice = action.payload.data?.totalCartPrice ?? 0;
      })

      // clearCart
      .addCase(clearCart.fulfilled, (state) => {
        state.products = [];
        state.numOfCartItems = 0;
        state.totalCartPrice = 0;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
