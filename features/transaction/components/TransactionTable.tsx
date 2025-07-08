"use client";
import React, { useCallback } from "react";

import { Service } from "@/types/Service";
import { DataTable } from "@/components/DataTable/DataTable";
import useCategories from "@/features/category/hooks/useCategories";
import { useWallet } from "@/features/wallet/context/WalletContext";
import { expensesService } from "../service/expenses";
import { incomesService } from "../service/incomes";
import { Expense } from "../types/Expense";
import { Income } from "../types/Income";

type TransactionWithRequiredId = (Expense | Income) & { _id: string };

export const ExpenseIncomeTable = () => {
  const walletContext = useWallet();
  const { selectedWallet, setTransactions, transactionType, setData } =
    walletContext;
  const dataTableContext = () => ({
    setData,
  });
  const { categories } = useCategories(transactionType);

  const handleFetchData = useCallback(
    async (data: TransactionWithRequiredId[]) => {
      setTransactions((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(data)) {
          return prev;
        }
        return data;
      });
    },
    [setTransactions]
  );

  const schema = {
    _id: {
      type: "text" as const,
      label: "ID",
      editable: false,
      sortable: false,
      filterable: false,
    },
    date: {
      type: "date" as const,
      label: "Date",
      editable: true,
      sortable: true,
      filterable: true,
      filterVariant: "dateRange" as const,
    },
    title: {
      type: "text" as const,
      label: "Title",
      editable: true,
      sortable: true,
      filterable: true,
      filterVariant: "text" as const,
    },
    amount: {
      type: "number" as const,
      label: "Amount",
      editable: true,
      sortable: true,
      filterable: true,
      filterVariant: "range" as const,
    },
    category: {
      type: "select" as const,
      label: "Category",
      editable: true,
      sortable: true,
      filterable: true,
      filterVariant: "select" as const,
      options: categories?.map((category) => category.name) || [],
    },
  };

  if (!selectedWallet?._id) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">
          Please select a wallet to view transactions
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="max-h-[70vh] overflow-auto">
        <DataTable
          service={
            transactionType === "income"
              ? (incomesService as Service<TransactionWithRequiredId>)
              : (expensesService as Service<TransactionWithRequiredId>)
          }
          useContextHook={dataTableContext}
          schema={schema}
          dataParentId={selectedWallet._id}
          itemRemovable={true}
          onFetchData={handleFetchData}
          form={true}
        />
      </div>
    </div>
  );
};
