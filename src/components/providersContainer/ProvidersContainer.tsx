"use client";
import { store } from "@/redux/store";
import AuthSync from "@/redux/AuthSync";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { Provider } from "react-redux";

export default function ProvidersContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <AuthSync />
        {children}
      </Provider>
    </SessionProvider>
  );
}
