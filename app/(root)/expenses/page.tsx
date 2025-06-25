"use client";
import React from "react";
import { ExpenseIncomeTable } from "@/app/(root)/expenses/(components)/ExpenseIncomeTable";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ExpenseIncomeTotals from "./(components)/ExpenseIncomeTotals";
import { useWallet } from "@/context/WalletContext";

export default function ExpensesPage() {
  const { transactionType, setTransactionType } = useWallet();

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <RadioGroup
          defaultValue="expense"
          className="flex gap-4"
          onValueChange={(value) =>
            setTransactionType(value as "expense" | "income")
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="expense" id="expense" />
            <Label htmlFor="expense">Expenses</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="income" id="income" />
            <Label htmlFor="income">Income</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="mb-4">
        <ExpenseIncomeTotals type={transactionType} />
      </div>
      <ExpenseIncomeTable />
    </div>
  );
}
