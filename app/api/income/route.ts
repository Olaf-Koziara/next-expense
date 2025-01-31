import {NextResponse} from "next/server";
import {connectMongoDB} from "@/lib/mongodb";
import {auth,} from "@/auth";
import {Wallet} from "@/models/wallet";
import {User} from "@/models/user";
import {getSortParamsFromUrl, sortItems} from "@/app/utils/sort";
import {Income} from "@/types/Income";
import mongoose, {PipelineStage} from "mongoose";
import {getFilterMatchStageFromUrl} from "@/app/api/expense/filter";


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

        const url = new URL(req.url);
        const walletId = url.searchParams.get("walletId");
        if (!walletId) {
            return NextResponse.json({error: 'Wallet id required',}, {status: 400});
        }
        const {sortBy, sortOrder} = getSortParamsFromUrl(url);

        const matchStage = getFilterMatchStageFromUrl(url);
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

        const [result] = await Wallet.aggregate(pipeline);

        return NextResponse.json(result?.incomes || [], {status: 200});
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

        const {walletId, _id, ...updateData}: { walletId: string, _id: string } & Partial<Income> = await req.json();

        const walletOwner = await User.findOne({
            email: session.user.email,
            wallets: walletId
        });

        if (!walletOwner) {
            return NextResponse.json({error: "Wallet doesn't belong to user"}, {status: 404});
        }

        const wallet = await Wallet.findOneAndUpdate(
            {_id: new mongoose.Types.ObjectId(walletId), "incomes._id": new mongoose.Types.ObjectId(_id)},
            {$set: {"incomes.$": updateData}},
            {new: false}
        );

        if (!wallet) {
            return NextResponse.json({error: "Wallet or income not found!"}, {status: 404});
        }

        return NextResponse.json(wallet, {status: 200});
    } catch (error) {
        return NextResponse.json({message: 'Error', error}, {status: 500});
    }
};