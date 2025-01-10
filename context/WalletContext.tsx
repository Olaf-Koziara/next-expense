import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Wallet } from "@/types/Wallet";
import { api } from "@/app/services/api";
import { walletsSercice } from "@/app/services/wallets";

type WalletContextType = {
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  setSelectedWallet: (wallet: Wallet) => void;
  addWallet: (wallet: { name: string }) => Promise<void>;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

  useEffect(() => {
    if (!session) return;

    walletsSercice.getAll().then((data) => {
      setWallets(data);
      setSelectedWallet(data[0] || null);
    });
  }, [session]);

  const addWallet = async (wallet: { name: string }) => {
    if (!session) return;

    const newWallet = await walletsSercice.add(wallet);
    setWallets((prevWallets) => [...prevWallets, newWallet]);
  };

  return (
    <WalletContext.Provider
      value={{ wallets, selectedWallet, setSelectedWallet, addWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
