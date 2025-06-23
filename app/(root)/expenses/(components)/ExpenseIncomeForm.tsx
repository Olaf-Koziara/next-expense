"use client";
import { TransactionForm } from "@/components/TransactionForm";

interface ExpenseIncomeFormProps {
  type: "expense" | "income";
  onFormSubmitted?: () => void;
}

const ExpenseIncomeForm = ({
  type,
  onFormSubmitted,
}: ExpenseIncomeFormProps) => {
  return <TransactionForm type={type} onFormSubmitted={onFormSubmitted} />;
};

export default ExpenseIncomeForm;
