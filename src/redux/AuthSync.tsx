"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "@/redux/hooks";
import { setAuthUser, clearAuthUser } from "@/redux/slices/authSlice";
import { fetchCart, resetCart } from "@/redux/slices/cartSlice";
import { fetchWishlist, resetWishlist } from "@/redux/slices/wishlistSlice";

/**
 * Bridges next-auth's session (source of truth for who is logged in)
 * into the redux store, and kicks off the initial cart/wishlist fetch
 * whenever a user signs in.
 */
export default function AuthSync() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const lastToken = useRef<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated" && session?.token) {
      dispatch(
        setAuthUser({
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
          token: session.token,
        }),
      );

      if (lastToken.current !== session.token) {
        lastToken.current = session.token;
        dispatch(fetchCart(session.token));
        dispatch(fetchWishlist(session.token));
      }
    } else {
      lastToken.current = null;
      dispatch(clearAuthUser());
      dispatch(resetCart());
      dispatch(resetWishlist());
    }
  }, [status, session, dispatch]);

  return null;
}
