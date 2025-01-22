import {NextResponse} from "next/server";
import {connectMongoDB} from "@/lib/mongodb";
import {auth,} from "@/auth";
import {Wallet} from "@/models/wallet";
import {User} from "@/models/user";
import {getSortParamsFromUrl, sortItems} from "@/app/utils/sort";
import {Income} from "@/types/Income";
import {expenseFilterParamConfig} from "@/app/api/expense/filter";
import {incomeFilterParamConfig} from "@/app/api/income/filter";
import mongoose, {PipelineStage} from "mongoose";


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