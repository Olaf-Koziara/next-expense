"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { WalletProvider } from "@/context/WalletContext";
import { CurrencyProvider } from "@/context/CurrencyContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <WalletProvider>
        <CurrencyProvider>{children}</CurrencyProvider>
      </WalletProvider>
    </SessionProvider>
  );
}
