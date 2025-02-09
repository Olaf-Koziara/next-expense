import {NextResponse} from "next/server";
import {connectMongoDB} from "@/lib/mongodb";
import {auth} from "@/auth";
import {Wallet} from "@/models/wallet";
import {User} from "@/models/user";
import {getSortParamsFromUrl} from "@/utils/sort";
import mongoose, {PipelineStage} from "mongoose";
import {getFilterMatchStageFromUrl} from "@/app/api/expense/filter";
import {Expense} from "@/types/Expense";
import {getPaginationFromUrl} from "@/utils/pagination";

// Define the filter parameter types

export const POST = async (req: Request) => {
    try {
        await connectMongoDB();
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({error: "Unauthorized!"}, {status: 401});
        }

        const {walletId, ...expenseData}: { walletId: string } & Expense = await req.json();

        const walletOwner = await User.findOne({
            email: session.user.email,
            wallets: walletId
        });

        if (!walletOwner) {
            return NextResponse.json({error: "Wallet doesn't belong to user"}, {status: 404});
        }


        const wallet = await Wallet.findByIdAndUpdate(
            walletId,
            {$push: {expenses: expenseData}, $inc: {balance: -expenseData.amount}},
            {new: true}
        );

        if (!wallet) {
            return NextResponse.json({error: "Wallet not found!"}, {status: 404});
        }

        return NextResponse.json({}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: 'Internal Server Error'}, {status: 500});
    }
};

export const GET = async (req: Request) => {
    try {
        await connectMongoDB();
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({error: "Unauthorized!"}, {status: 401});
        }

        const url = new URL(req.url);
        const walletId = url.searchParams.get("walletId");
        if (!walletId) {
            return NextResponse.json({error: 'Wallet id required',}, {status: 400});
        }
        const {skip, pageSize} = getPaginationFromUrl(url);
        const {sortBy, sortOrder} = getSortParamsFromUrl(url);

        const matchStage = getFilterMatchStageFromUrl(url);
        const pipeline: PipelineStage[] = [
            {
                $match: {_id: new mongoose.Types.ObjectId(walletId)}
            },
            {
                $unwind: '$expenses'
            },
            {
                $match: matchStage
            },
            {
                $sort: {
                    [`expenses.${sortBy}`]: sortOrder === 'asc' ? 1 : -1
                }
            },
            {
                $facet: {
                    data: [
                        {$skip: skip},
                        {$limit: pageSize},
                        {
                            $group: {
                                _id: '$_id',
                                expenses: {$push: '$expenses'}
                            }
                        }
                    ],
                    totalCount: [
                        {
                            $count: 'count'
                        }
                    ]
                }
            },

        ];

        const [result] = await Wallet.aggregate(pipeline);
        const totalCount = result?.totalCount[0]?.count || 0;

        return NextResponse.json({
            data: result?.data[0]?.expenses || [], totalCount
        }, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: 'Internal Server Error'}, {status: 500});
    }
};
export const DELETE = async (req: Request) => {
    try {
        await connectMongoDB();
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({error: "Unauthorized!"}, {status: 401});
        }

        // Parse JSON body to get walletId and expenseId
        const {walletId, _id} = await req.json();

        if (!walletId || !_id) {
            return NextResponse.json({error: "walletId and expenseId are required."}, {status: 400});
        }

        // Verify the user owns the wallet
        const walletOwner = await User.findOne({
            email: session.user.email,
            wallets: walletId
        });

        if (!walletOwner) {
            return NextResponse.json({error: "Wallet doesn't belong to user"}, {status: 404});
        }

        // Find the wallet and the specific expense
        const wallet = await Wallet.findOne({
            _id: new mongoose.Types.ObjectId(walletId),
            "expenses._id": new mongoose.Types.ObjectId(_id)
        });


        if (!wallet) {
            return NextResponse.json({error: "Wallet or expense not found!"}, {status: 404});
        }
        console.log(wallet)

        // Extract the amount of the expense to be deleted
        const expense = wallet.expenses.id(_id);
        const amountToRestore = expense.amount;

        wallet.expenses = wallet.expenses.filter((expense: Expense & {
            _id: string
        }) => expense._id.toString() !== _id);


        wallet.balance += amountToRestore;

        // Save the updated wallet
        await wallet.save()

        return NextResponse.json(
            {message: "Expense deleted successfully"},
            {status: 200}
        );
    } catch (error) {
        return NextResponse.json({message: "Error", error}, {status: 500});
    }
};
export const PATCH = async (req: Request) => {
    try {
        await connectMongoDB();
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({error: "Unauthorized!"}, {status: 401});
        }

        const {walletId, _id, ...updateData}: { walletId: string, _id: string } & Partial<Expense> = await req.json();

        const walletOwner = await User.findOne({
            email: session.user.email,
            wallets: walletId
        });

        if (!walletOwner) {
            return NextResponse.json({error: "Wallet doesn't belong to user"}, {status: 404});
        }

        const wallet = await Wallet.findOneAndUpdate(
            {_id: new mongoose.Types.ObjectId(walletId), "expenses._id": new mongoose.Types.ObjectId(_id)},
            {$set: {"expenses.$": {_id, ...updateData}}},
            {new: false}
        );

        if (!wallet) {
            return NextResponse.json({error: "Wallet or expense not found!"}, {status: 404});
        }

        return NextResponse.json(wallet, {status: 200});
    } catch (error) {
        return NextResponse.json({message: 'Error', error}, {status: 500});
    }
};