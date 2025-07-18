"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { WalletProvider } from "@/features/wallet/context/WalletContext";
import { CurrencyProvider } from "@/features/currency/context/CurrencyContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <WalletProvider>
        <CurrencyProvider>{children}</CurrencyProvider>
      </WalletProvider>
    </SessionProvider>
  );
}
