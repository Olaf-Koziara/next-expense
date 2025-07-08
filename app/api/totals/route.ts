import { auth } from "@/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { Wallet } from "@/app/api/wallet/model/wallet";
import mongoose from "mongoose";
import { getFilterMatchStageFromUrl } from "@/app/api/expense/filter";
import { MongoQuery } from "@/app/api/expense/filter";

type TransactionType = "expense" | "income";

interface AggregationTotals {
  total: number;
  count: number;
}

interface AggregationWallet {
  balance: number;
  currency: string;
}

interface AggregationResult {
  expenses: AggregationTotals;
  incomes: AggregationTotals;
  wallet: AggregationWallet;
}

interface TotalsResponse {
  currency: string;
  walletBalance: number;
  expenseTotal?: number;
  expenseCount?: number;
  incomeTotal?: number;
  incomeCount?: number;
  netAmount?: number;
}

const createTransactionPipeline = (
  type: TransactionType,
  filters: Record<string, MongoQuery>
) => [
  { $unwind: `$${type}s` },
  ...(Object.keys(filters).length > 0 ? [{ $match: filters }] : []),
  {
    $group: {
      _id: null,
      total: { $sum: `$${type}s.amount` },
      count: { $sum: 1 },
    },
  },
];

const buildResponse = (
  result: AggregationResult,
  type: "expense" | "income" | "both"
): TotalsResponse => {
  const baseResponse = {
    currency: result.wallet.currency || "USD",
    walletBalance: result.wallet.balance || 0,
  };

  const response: TotalsResponse = { ...baseResponse };

  if (type === "expense" || type === "both") {
    response.expenseTotal = result.expenses.total || 0;
    response.expenseCount = result.expenses.count || 0;
  }

  if (type === "income" || type === "both") {
    response.incomeTotal = result.incomes.total || 0;
    response.incomeCount = result.incomes.count || 0;
  }

  if (type === "both") {
    response.netAmount =
      (result.incomes.total || 0) - (result.expenses.total || 0);
  }

  return response;
};

export const GET = async (req: Request) => {
  await connectMongoDB();
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
  }

  const url = new URL(req.url);
  const walletId = url.searchParams.get("walletId");
  const type = url.searchParams.get("type") as "expense" | "income" | "both";

  if (!walletId) {
    return NextResponse.json({ error: "Wallet id required" }, { status: 400 });
  }

  const expenseFilters = getFilterMatchStageFromUrl(url, "expense");
  const incomeFilters = getFilterMatchStageFromUrl(url, "income");

  const pipeline = [
    {
      $match: { _id: new mongoose.Types.ObjectId(walletId) },
    },
    {
      $facet: {
        expenses: createTransactionPipeline("expense", expenseFilters),
        incomes: createTransactionPipeline("income", incomeFilters),
        wallet: [
          {
            $project: {
              _id: 1,
              balance: 1,
              currency: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        expenses: {
          $ifNull: [{ $arrayElemAt: ["$expenses", 0] }, { total: 0, count: 0 }],
        },
        incomes: {
          $ifNull: [{ $arrayElemAt: ["$incomes", 0] }, { total: 0, count: 0 }],
        },
        wallet: {
          $ifNull: [
            { $arrayElemAt: ["$wallet", 0] },
            { balance: 0, currency: "USD" },
          ],
        },
      },
    },
  ];

  const [result] = (await Wallet.aggregate(pipeline)) as AggregationResult[];
  const response = buildResponse(result, type);

  return NextResponse.json(response, { status: 200 });
};
