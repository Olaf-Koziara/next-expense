import { auth } from "@/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { Wallet } from "@/models/wallet";
import mongoose from "mongoose";
import { getFilterMatchStageFromUrl } from "@/app/api/expense/filter";

type TransactionType = "expense" | "income";

const createTransactionPipeline = (
  type: TransactionType,
  filters: Record<string, any>
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

const buildResponse = (result: any, type: "expense" | "income" | "both") => {
  const baseResponse = {
    currency: result.wallet.currency || "USD",
    walletBalance: result.wallet.balance || 0,
  };

  const response: any = { ...baseResponse };

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

  const [result] = await Wallet.aggregate(pipeline);
  const response = buildResponse(result, type);

  return NextResponse.json(response, { status: 200 });
};
