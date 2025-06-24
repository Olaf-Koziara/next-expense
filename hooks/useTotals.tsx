import { useState, useEffect, useMemo, useCallback } from "react";
import {
  totalsService,
  TotalsParams,
  TotalsResponse,
} from "@/app/services/totals";

type UseTotalsOptions = {
  walletId: string;
  type?: "expense" | "income" | "both";
  filters?: {
    category?: string;
    amountStart?: number;
    amountEnd?: number;
    title?: string;
    dateStart?: string;
    dateEnd?: string;
  };
  enabled?: boolean;
};

export const useTotals = (options: UseTotalsOptions) => {
  const { walletId, type = "both", filters = {}, enabled = true } = options;

  const params = useMemo(
    (): TotalsParams => ({
      walletId,
      type,
      ...filters,
    }),
    [walletId, type, JSON.stringify(filters)]
  );

  const [data, setData] = useState<TotalsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTotals = useCallback(async () => {
    if (!enabled || !walletId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await totalsService.getTotals(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch totals");
    } finally {
      setLoading(false);
    }
  }, [params, enabled, walletId]);

  useEffect(() => {
    fetchTotals();
  }, [fetchTotals]);

  return {
    data,
    loading,
    error,
    refetch: fetchTotals,
    isEnabled: enabled && !!walletId,
  };
};
