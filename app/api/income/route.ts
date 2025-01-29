import {NextResponse} from "next/server";
import {connectMongoDB} from "@/lib/mongodb";
import {auth,} from "@/auth";
import {Wallet} from "@/models/wallet";
import {User} from "@/models/user";
import {getSortParamsFromUrl, sortItems} from "@/app/utils/sort";
import {Income} from "@/types/Income";
import {incomeFilterParamConfig} from "@/app/api/income/filter";
import mongoose, {PipelineStage} from "mongoose";
import {Expense} from "@/types/Expense";


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
            {$push: {incomes: incomeData}}, {new: true}
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
        const url = new URL(req.url)
        const walletId = url.searchParams.get("wallet");
        if (!walletId) {
            return NextResponse.json({error: 'Wallet id required',}, {status: 400});
        }
        const {sortBy, sortOrder} = getSortParamsFromUrl(url);
        const matchStage: Record<string, any> = {};
        for (const [param, config] of Object.entries(incomeFilterParamConfig)) {
            const value = url.searchParams.get(param);
            if (value) {
                const transformedValue = config.transform ? config.transform(value) : value;

                // Handle special cases
                if (param === 'title') {
                    matchStage['incomes.title'] = {
                        $regex: transformedValue,
                        $options: 'i'
                    };
                } else if (param === 'dateStart' || param === 'dateEnd') {

                    matchStage['incomes.date'] = matchStage['incomes.date'] || {};
                    matchStage['incomes.date'][config.mongoOperator!] = transformedValue;
                } else if (param === 'amountStart' || param === 'amountEnd') {
                    matchStage['incomes.amount'] = matchStage['incomes.amount'] || {};
                    matchStage['incomes.amount'][config.mongoOperator!] = transformedValue;
                } else {
                    matchStage[`incomes.${param}`] = {
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
                $unwind: '$incomes'
            } as PipelineStage,
            {
                $match: matchStage
            } as PipelineStage,
            {
                $sort: {
                    [`incomes.${sortBy}`]: sortOrder === 'asc' ? 1 : -1
                }
            } as PipelineStage,
            {
                $group: {
                    _id: '$_id',
                    incomes: {$push: '$incomes'}
                }
            } as PipelineStage
        ];
        console.log(pipeline)
        const [result] = await Wallet.aggregate(pipeline);

        return NextResponse.json(result?.incomes || [], {status: 200});
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
            "incomes._id": new mongoose.Types.ObjectId(_id)
        });


        if (!wallet) {
            return NextResponse.json({error: "Wallet or expense not found!"}, {status: 404});
        }

        // Extract the amount of the expense to be deleted
        const income = wallet.incomes.id(_id);
        const amountToRestore = income.amount;

        wallet.incomes = wallet.incomes.filter((income: Income & {
            _id: string
        }) => income._id.toString() !== _id);


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
