import {NextResponse} from "next/server";
import {connectMongoDB} from "@/lib/mongodb";
import {auth} from "@/auth";
import {Wallet} from "@/models/wallet";
import {User} from "@/models/user";
import {getSortParamsFromUrl, sortItems, SortOrder} from "@/utils/sort";
import mongoose, {PipelineStage} from "mongoose";
import {expenseFilterParamConfig} from "@/app/api/expense/filter";
import {Expense} from "@/types/Expense";

// Define the filter parameter types

export const POST = async (req: Request) => {
    try {
        await connectMongoDB();
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({error: "Unauthorized!"}, {status: 401});
        }

        const {selectedWalletId, ...expenseData}: { selectedWalletId: string } & Expense = await req.json();

        const walletOwner = await User.findOne({
            email: session.user.email,
            wallets: selectedWalletId
        });

        if (!walletOwner) {
            return NextResponse.json({error: "Wallet doesn't belong to user"}, {status: 404});
        }


        const wallet = await Wallet.findByIdAndUpdate(
            selectedWalletId,
            {$push: {expenses: expenseData}, $inc: {balance: -expenseData.amount}},
            {new: true}
        );

        if (!wallet) {
            return NextResponse.json({error: "Wallet not found!"}, {status: 404});
        }

        return NextResponse.json({}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: 'Error', error}, {status: 500});
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
        const walletId = url.searchParams.get("wallet");
        if (!walletId) {
            return NextResponse.json({error: 'Wallet id required',}, {status: 400});
        }
        const {sortBy, sortOrder} = getSortParamsFromUrl(url);
        const matchStage: Record<string, any> = {};

        // Process each parameter from URL
        for (const [param, config] of Object.entries(expenseFilterParamConfig)) {
            const value = url.searchParams.get(param);
            if (value) {
                const transformedValue = config.transform ? config.transform(value) : value;

                // Handle special cases
                if (param === 'title') {
                    matchStage['expenses.title'] = {
                        $regex: transformedValue,
                        $options: 'i'
                    };
                } else if (param === 'dateStart' || param === 'dateEnd') {

                    matchStage['expenses.date'] = matchStage['expenses.date'] || {};
                    matchStage['expenses.date'][config.mongoOperator!] = transformedValue;
                } else if (param === 'amountStart' || param === 'amountEnd') {
                    matchStage['expenses.amount'] = matchStage['expenses.amount'] || {};
                    matchStage['expenses.amount'][config.mongoOperator!] = transformedValue;
                } else {
                    matchStage[`expenses.${param}`] = {
                        [config.mongoOperator!]: transformedValue
                    };
                }
            }
        }

        const pipeline: PipelineStage[] = [
            {
                $match: {_id: new mongoose.Types.ObjectId(walletId)}
            } as PipelineStage,
            {
                $unwind: '$expenses'
            } as PipelineStage,
            {
                $match: matchStage
            } as PipelineStage,
            {
                $sort: {
                    [`expenses.${sortBy}`]: sortOrder === 'asc' ? 1 : -1
                }
            } as PipelineStage,
            {
                $group: {
                    _id: '$_id',
                    expenses: {$push: '$expenses'}
                }
            } as PipelineStage
        ];

        const [result] = await Wallet.aggregate(pipeline);

        return NextResponse.json(result?.expenses || [], {status: 200});
    } catch (error) {
        return NextResponse.json({message: 'Error', error}, {status: 500});
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
        await wallet.save().catch(err => console.log(err))

        return NextResponse.json(
            {message: "Expense deleted successfully"},
            {status: 200}
        );
    } catch (error) {
        return NextResponse.json({message: "Error", error}, {status: 500});
    }
};
