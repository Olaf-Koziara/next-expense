"use client";
import { TransactionForm } from "@/components/TransactionForm";

interface ExpenseIncomeFormProps {
  type: "expense" | "income";
  onFormSubmitted?: () => void;
}

export const ExpenseIncomeForm = ({
  type,
  onFormSubmitted,
}: ExpenseIncomeFormProps) => {
  return <TransactionForm type={type} onFormSubmitted={onFormSubmitted} />;
};
