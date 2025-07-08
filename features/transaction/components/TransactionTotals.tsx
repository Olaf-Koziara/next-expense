"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/global";
import { useTotals } from "@/features/transaction/hooks/useTotals";
import { useWallet } from "@/features/wallet/context/WalletContext";
import { TotalsResponse } from "../service/totals";

type Props = {
  type: "expense" | "income";
};

type TransactionConfig = {
  title: string;
  borderColor: string;
  textColor: string;
  getTotal: (totals: TotalsResponse) => number;
  animation?: {
    duration?: number;
    steps?: number;
    loop?: boolean;
    loopDelay?: number;
  };
};

const TRANSACTION_CONFIGS: Record<"expense" | "income", TransactionConfig> = {
  expense: {
    title: "Total Expenses",
    borderColor: "border-red-500",
    textColor: "text-red-500",
    getTotal: (totals: TotalsResponse) => totals.expenseTotal || 0,
    animation: {
      duration: 1,
      steps: 60,
      loop: true,
      loopDelay: 2000,
    },
  },
  income: {
    title: "Total Income",
    borderColor: "border-green-500",
    textColor: "text-green-500",
    getTotal: (totals: TotalsResponse) => totals.incomeTotal || 0,
    animation: {
      duration: 1,
      steps: 60,
      loop: true,
      loopDelay: 2000,
    },
  },
};

const AnimatedCard = ({
  title,
  value,
  currency,
  borderColor,
  textColor,
}: {
  title: string;
  value: number;
  currency: string;
  borderColor: string;
  textColor: string;
}) => (
  <Card className={cn("border-2", "text-center", borderColor)}>
    <CardHeader className="px-6 pt-3 pb-0">
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent
      className={cn("text-xl font-bold", textColor, "px-6 pt-0 pb-3")}
    >
      {formatCurrency(value, currency)}
    </CardContent>
  </Card>
);

const useAnimatedValues = (
  totals: TotalsResponse,
  type: "expense" | "income"
) => {
  const [displayTotal, setDisplayTotal] = useState(0);
  const [displayBalance, setDisplayBalance] = useState(0);
  const prevTotalRef = React.useRef(0);
  const prevBalanceRef = React.useRef(0);

  useEffect(() => {
    if (!totals) return;

    const config = TRANSACTION_CONFIGS[type];
    const total = config.getTotal(totals);
    const balance = totals.walletBalance || 0;
    const animationConfig = config.animation || {
      duration: 1,
      steps: 60,
      loop: false,
    };

    const duration = animationConfig.duration || 1;
    const steps = animationConfig.steps || 60;
    const stepDuration = (duration * 1000) / steps;

    // Start from previous value
    let startTotal = prevTotalRef.current;
    let startBalance = prevBalanceRef.current;

    const incrementTotal = (total - startTotal) / steps;
    const incrementBalance = (balance - startBalance) / steps;

    let currentStep = 0;
    setDisplayTotal(startTotal);
    setDisplayBalance(startBalance);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setDisplayTotal((prev) => prev + incrementTotal);
        setDisplayBalance((prev) => prev + incrementBalance);
      } else {
        setDisplayTotal(total);
        setDisplayBalance(balance);
        clearInterval(interval);
      }
    }, stepDuration);

    // Update refs for next animation
    prevTotalRef.current = total;
    prevBalanceRef.current = balance;

    return () => clearInterval(interval);
  }, [totals, type]);

  return { displayTotal, displayBalance };
};

const ExpenseIncomeTotals = ({ type }: Props) => {
  const { selectedWallet, transactions } = useWallet();
  const { data: totals, refetch } = useTotals({
    walletId: selectedWallet?._id || "",
    type: type,
    enabled: !!selectedWallet?._id,
  });
  useEffect(() => {
    refetch();
  }, [transactions]);
  const { displayTotal, displayBalance } = useAnimatedValues(
    totals ?? {
      expenseTotal: 0,
      incomeTotal: 0,
      walletBalance: 0,
      currency: selectedWallet?.currency ?? "",
    },
    type
  );
  const config = TRANSACTION_CONFIGS[type];

  if (!selectedWallet) return null;

  return (
    <div className="grid grid-cols-2 gap-4 mb-2">
      <AnimatedCard
        title={config.title}
        value={displayTotal}
        currency={selectedWallet.currency}
        borderColor={config.borderColor}
        textColor={config.textColor}
      />

      <AnimatedCard
        title="Wallet Balance"
        value={displayBalance}
        currency={selectedWallet.currency}
        borderColor="border-blue-500"
        textColor={displayBalance > 0 ? "text-green-500" : "text-red-500"}
      />
    </div>
  );
};

export default ExpenseIncomeTotals;
