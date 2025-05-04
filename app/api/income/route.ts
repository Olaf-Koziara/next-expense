import {NextResponse} from "next/server";
import {connectMongoDB} from "@/lib/mongodb";
import {auth,} from "@/auth";
import {Wallet} from "@/models/wallet";
import {User} from "@/models/user";
import {getSortParamsFromUrl} from "@/app/utils/sort";
import {Income} from "@/types/Income";
import mongoose, {PipelineStage} from "mongoose";
import {getFilterMatchStageFromUrl} from "@/app/api/expense/filter";
import {getPaginationFromUrl} from "@/utils/pagination";


export const POST = async (req: Request) => {
    try {
        await connectMongoDB();
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({error: "Unauthorized!"}, {status: 401});
        }

        const {selectedWalletId, ...incomeData} = await req.json();

        const walletOwner = await User.findOne({
            email: session.user.email,
            wallets: selectedWalletId
        });

        if (!walletOwner) {
            throw new Error('Wallet not found or unauthorized');

        }


        const wallet = await Wallet.findByIdAndUpdate(
            selectedWalletId,
            {$push: {incomes: incomeData}, $inc: {balance: incomeData.amount}},
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
        const walletId = url.searchParams.get("walletId");
        if (!walletId) {
            return NextResponse.json({error: 'Wallet id required',}, {status: 400});
        }
        const {sortBy, sortOrder} = getSortParamsFromUrl(url);
        const {skip, pageSize} = getPaginationFromUrl(url);

        const matchStage = getFilterMatchStageFromUrl(url);
        const pipeline: PipelineStage[] = [
            {
                $match: {_id: new mongoose.Types.ObjectId(walletId)}
            },
            {
                $unwind: '$incomes'
            },
            {
                $match: matchStage
            },
            {
                $sort: {
                    [`incomes.${sortBy}`]: sortOrder === 'asc' ? 1 : -1
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
                                incomes: {$push: '$incomes'}
                            }
                        }
                    ],
                    totalCount: [
                        {
                            $count: 'count'
                        }
                    ]
                }
            }
        ];

        const [result] = await Wallet.aggregate(pipeline);
        const totalCount = result?.totalCount[0]?.count || 0;
        const incomes = result?.data[0]?.incomes || [];


        return NextResponse.json({
            data: incomes || [], totalCount
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


        const {walletId, _id} = await req.json();

        if (!walletId || !_id) {
            return NextResponse.json({error: "walletId and incomeId are required."}, {status: 400});
        }


        const walletOwner = await User.findOne({
            email: session.user.email,
            wallets: walletId
        });

        if (!walletOwner) {
            return NextResponse.json({error: "Wallet doesn't belong to user"}, {status: 404});
        }

        // Find the wallet and the specific income
        const wallet = await Wallet.findOne({
            _id: new mongoose.Types.ObjectId(walletId),
            "incomes._id": new mongoose.Types.ObjectId(_id)
        });


        if (!wallet) {
            return NextResponse.json({error: "Wallet or income not found!"}, {status: 404});
        }

        // Extract the amount of the income to be deleted
        const income = wallet.incomes.id(_id);
        const amountToRestore = income.amount;

        wallet.incomes = wallet.incomes.filter((income: Income & {
            _id: string
        }) => income._id.toString() !== _id);


        wallet.balance += amountToRestore;

        // Save the updated wallet
        await wallet.save()

        return NextResponse.json(
            {message: "income deleted successfully"},
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

        const {walletId, ...incomeData}: { walletId: string, _id: string } & Partial<Income> = await req.json();

        const walletOwner = await User.findOne({
            email: session.user.email,
            wallets: walletId
        });

        if (!walletOwner) {
            return NextResponse.json({error: "Wallet doesn't belong to user"}, {status: 404});
        }

        const wallet = await Wallet.findOne({
            _id: new mongoose.Types.ObjectId(walletId),
            "incomes._id": new mongoose.Types.ObjectId(incomeData._id)
        });

        if (!wallet) {
            return NextResponse.json({error: "Wallet or income not found!"}, {status: 404});
        }

        // Get the old income amount
        const oldIncome = wallet.incomes.id(incomeData._id);
        const oldAmount = oldIncome.amount;
        const newAmount = incomeData.amount || oldAmount;

        // Update the income and adjust the balance
        await Wallet.findOneAndUpdate(
            {_id: new mongoose.Types.ObjectId(walletId), "incomes._id": new mongoose.Types.ObjectId(incomeData._id)},
            {
                $set: {"incomes.$": incomeData},
                $inc: {balance: newAmount - oldAmount}
            },
            {new: true}
        );

        return NextResponse.json({message: "Income updated successfully"}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: 'Error', error}, {status: 500});
    }
};