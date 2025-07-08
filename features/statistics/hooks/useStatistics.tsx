import { useState, useCallback } from "react";
import { WalletStats } from "@/features/statistics/types/Stats";
import { dateRangeValuesToString } from "@/utils/date";

interface DateRange {
  from: Date;
  to: Date;
}

export const useStatistics = () => {
  const [statistics, setStatistics] = useState<WalletStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(
    async (walletId: string, dateRange: DateRange) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/stats?walletId=${walletId}&${dateRangeValuesToString(
            dateRange
          )}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }
        const data = await response.json();
        setStatistics(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch statistics"
        );
        setStatistics(null);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    statistics,
    isLoading,
    error,
    fetchStatistics,
  };
};
