"use client";

import React from "react";
import { useWallet } from "@/context/WalletContext";
import { TransactionForm } from "@/components/TransactionForm";

export const ExpenseIncomeForm = () => {
  const { transactionType } = useWallet();

  return (
    <TransactionForm
      type={transactionType}
      showBorder={false}
      className="space-y-4"
    />
  );
};
