import {NextResponse} from "next/server";
import {connectMongoDB} from "@/lib/mongodb";
import {auth,} from "@/auth";
import {Wallet} from "@/models/wallet";
import {User} from "@/models/user";
import {Income} from "@/types/Income";


export const POST = async (req: Request) => {
    try {
        await connectMongoDB();
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({error: "Unauthorized!"}, {status: 401});
        }

        const {selectedWalletId, ...incomeData}: { selectedWalletId: string } & Income = await req.json();

        const walletOwner = await User.findOne({
            email: session.user.email,
            wallets: selectedWalletId
        });

        if (!walletOwner) {
            return NextResponse.json({error: "Wallet doesn't belong to user"}, {status: 404});

        }


        const wallet = await Wallet.findByIdAndUpdate(
            selectedWalletId,
            {$push: {incomes: incomeData}, $inc: {balance: incomeData.amount}}, {new: true}
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

        const walletId = url.searchParams.get("wallet")

        const wallet = await Wallet.findOne({_id: walletId}, {incomes: 1});
        return NextResponse.json(wallet.incomes, {status: 200});
    } catch (error) {
        return NextResponse.json({message: 'Error', error}, {status: 500});
    }
};