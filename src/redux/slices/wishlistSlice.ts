import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiServices } from "@/services/api";
import { Product } from "@/interfaces";

interface WishlistState {
  items: Product[];
  productIds: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  mutatingIds: string[];
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  productIds: [],
  status: "idle",
  mutatingIds: [],
  error: null,
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (token: string) => {
    return await apiServices.getWishlist(token);
  },
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ productId, token }: { productId: string; token: string }) => {
    const response = await apiServices.addToWishlist(productId, token);
    return { response, productId };
  },
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async ({ productId, token }: { productId: string; token: string }) => {
    const response = await apiServices.removeFromWishlist(productId, token);
    return { response, productId };
  },
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    resetWishlist(state) {
      state.items = [];
      state.productIds = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.data;
        state.productIds = action.payload.data.map((product) => product._id);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load wishlist";
      })

      .addCase(addToWishlist.pending, (state, action) => {
        state.mutatingIds.push(action.meta.arg.productId);
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.mutatingIds = state.mutatingIds.filter(
          (id) => id !== action.payload.productId,
        );
        if (action.payload.response.status === "success") {
          state.productIds = action.payload.response.data;
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.mutatingIds = state.mutatingIds.filter(
          (id) => id !== action.meta.arg.productId,
        );
      })

      .addCase(removeFromWishlist.pending, (state, action) => {
        state.mutatingIds.push(action.meta.arg.productId);
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.mutatingIds = state.mutatingIds.filter(
          (id) => id !== action.payload.productId,
        );
        if (action.payload.response.status === "success") {
          state.productIds = action.payload.response.data;
        }
        state.items = state.items.filter(
          (item) => item._id !== action.payload.productId,
        );
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.mutatingIds = state.mutatingIds.filter(
          (id) => id !== action.meta.arg.productId,
        );
      });
  },
});

export const { resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
