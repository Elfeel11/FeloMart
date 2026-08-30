import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  name: string | null;
  email: string | null;
  role: string | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  name: null,
  email: null,
  role: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser(
      state,
      action: PayloadAction<{
        name: string;
        email: string;
        role?: string | null;
        token?: string | null;
      }>,
    ) {
      state.isAuthenticated = true;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role ?? null;
      state.token = action.payload.token ?? null;
    },
    clearAuthUser(state) {
      state.isAuthenticated = false;
      state.name = null;
      state.email = null;
      state.role = null;
      state.token = null;
    },
  },
});

export const { setAuthUser, clearAuthUser } = authSlice.actions;
export default authSlice.reducer;
