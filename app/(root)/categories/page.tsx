"use client";
import React, { useState } from "react";
import { DataTable } from "@/components/DataTable/DataTable";
import { expenseCategoriesService } from "@/features/category/services/expenseCategories";

import TransactionTypeToggle from "@/features/transaction/components/TransactionTypeToggle";
import { TransactionType } from "@/features/transaction/types/Expense";
import { incomeCategoriesService } from "@/features/category/services/incomeCategories";

const Page = () => {
  const [transactionType, setTransactionType] =
    useState<TransactionType>("expense");
  const schema = {
    name: {
      type: "text" as const,
      label: "Name",
      editable: true,
    },
  };
  return (
    <div className="pt-3">
      <h2 className="text-center text-3xl pb-3">Categories</h2>

      <div className="w-1/2 mx-auto">
        <TransactionTypeToggle onChange={setTransactionType} />

        <DataTable
          schema={schema}
          itemRemovable={true}
          form={true}
          service={
            transactionType === "expense"
              ? expenseCategoriesService
              : incomeCategoriesService
          }
        ></DataTable>
      </div>
    </div>
  );
};

export default Page;
