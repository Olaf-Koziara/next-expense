import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { auth } from "@/auth";
import { Wallet } from "@/models/wallet";
import { User } from "@/models/user";
import mongoose, { PipelineStage } from "mongoose";
import { getPaginationFromUrl } from "@/utils/pagination";
import { getSortParamsFromUrl } from "@/utils/sort";
import { getFilterMatchStageFromUrl } from "./expense/filter";

export interface BaseRouteHandlerConfig {
  collectionField: "expenses" | "incomes";
  balanceUpdateField: "amount";
  balanceUpdateOperation: 1 | -1;
}

export async function handleTransactionPOST(
  req: Request,
  config: BaseRouteHandlerConfig
) {
  try {
    await connectMongoDB();
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const { walletId, ...transactionData } = await req.json();

    const walletOwner = await User.findOne({
      email: session.user.email,
      wallets: walletId,
    });

    if (!walletOwner) {
      return NextResponse.json(
        { error: "Wallet doesn't belong to user" },
        { status: 404 }
      );
    }

    const updateOperation = {
      $push: { [config.collectionField]: transactionData },
      $inc: {
        balance:
          config.balanceUpdateOperation *
          transactionData[config.balanceUpdateField],
      },
    };

    const wallet = await Wallet.findByIdAndUpdate(walletId, updateOperation, {
      new: true,
    });

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found!" }, { status: 404 });
    }

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function handleTransactionGET(
  request: NextRequest,
  config: BaseRouteHandlerConfig
) {
  try {
    const session = await auth();
    await connectMongoDB();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const walletId = searchParams.get("walletId");

    if (!walletId) {
      return NextResponse.json(
        { error: "Wallet ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(walletId)) {
      return NextResponse.json(
        { error: "Invalid wallet ID format" },
        { status: 400 }
      );
    }

    const url = new URL(request.url);
    const { sortBy, sortOrder } = getSortParamsFromUrl(url);
    const { skip, pageSize } = getPaginationFromUrl(url);

    const matchStage = getFilterMatchStageFromUrl(url);
    const pipeline: PipelineStage[] = [
      {
        $match: { _id: new mongoose.Types.ObjectId(walletId) },
      },
      {
        $unwind: `$${config.collectionField}`,
      },
      {
        $match: matchStage,
      },
      {
        $sort: {
          [`${config.collectionField}.${sortBy}`]: sortOrder === "asc" ? 1 : -1,
        },
      },
      {
        $facet: {
          data: [
            {
              $group: {
                _id: null,
                [config.collectionField]: {
                  $push: `$${config.collectionField}`,
                },
              },
            },
            {
              $project: {
                _id: 0,
                [config.collectionField]: {
                  $slice: [`$${config.collectionField}`, skip, pageSize],
                },
              },
            },
          ],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ];

    const [result] = await Wallet.aggregate(pipeline);
    const totalCount = result?.totalCount[0]?.count || 0;
    const transactions = result?.data[0]?.[config.collectionField] || [];

    return NextResponse.json({ data: transactions, totalCount });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function handleTransactionDELETE(
  req: Request,
  config: BaseRouteHandlerConfig
) {
  try {
    await connectMongoDB();
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const { walletId, _id } = await req.json();

    if (!walletId || !_id) {
      return NextResponse.json(
        { error: "walletId and transactionId are required." },
        { status: 400 }
      );
    }

    const walletOwner = await User.findOne({
      email: session.user.email,
      wallets: walletId,
    });

    if (!walletOwner) {
      return NextResponse.json(
        { error: "Wallet doesn't belong to user" },
        { status: 404 }
      );
    }

    const wallet = await Wallet.findOne({
      _id: new mongoose.Types.ObjectId(walletId),
      [`${config.collectionField}._id`]: new mongoose.Types.ObjectId(_id),
    });

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet or transaction not found!" },
        { status: 404 }
      );
    }

    const transaction = wallet[config.collectionField].id(_id);
    const amountToRestore = transaction[config.balanceUpdateField];

    wallet[config.collectionField] = wallet[config.collectionField].filter(
      (item: any) => item._id.toString() !== _id
    );

    wallet.balance += config.balanceUpdateOperation * amountToRestore;
    await wallet.save();

    return NextResponse.json(
      { message: "Transaction deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function handleTransactionPATCH(
  req: Request,
  config: BaseRouteHandlerConfig
) {
  try {
    await connectMongoDB();
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const { walletId, _id, ...updateData } = await req.json();

    const walletOwner = await User.findOne({
      email: session.user.email,
      wallets: walletId,
    });

    if (!walletOwner) {
      return NextResponse.json(
        { error: "Wallet doesn't belong to user" },
        { status: 404 }
      );
    }

    const wallet = await Wallet.findOne({
      _id: new mongoose.Types.ObjectId(walletId),
      [`${config.collectionField}._id`]: new mongoose.Types.ObjectId(_id),
    });

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet or transaction not found!" },
        { status: 404 }
      );
    }

    const transaction = wallet[config.collectionField].id(_id);
    const oldAmount = transaction[config.balanceUpdateField];
    const newAmount = updateData[config.balanceUpdateField] || oldAmount;

    Object.assign(transaction, updateData);
    wallet.balance += config.balanceUpdateOperation * (newAmount - oldAmount);
    await wallet.save();

    return NextResponse.json(transaction, { status: 200 });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
