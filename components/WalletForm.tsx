import React, { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WalletFormProps {
  onSuccess?: () => void;
  className?: string;
}

export const WalletForm = ({ onSuccess, className = "" }: WalletFormProps) => {
  const { createWallet } = useWallet();
  const [walletName, setWalletName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (walletName.trim() === "") return;

    await createWallet({
      name: walletName,
      balance: 0,
      currency: "USD",
    });
    setWalletName("");
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-2">
        <Label htmlFor="walletName">Wallet Name</Label>
        <Input
          type="text"
          id="walletName"
          value={walletName}
          onChange={(e) => setWalletName(e.target.value)}
          placeholder="Enter wallet name"
          required
        />
      </div>
      <Button type="submit" className="w-full mt-4">
        Add Wallet
      </Button>
    </form>
  );
};
