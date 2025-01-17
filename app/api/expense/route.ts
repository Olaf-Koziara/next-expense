import {NextResponse} from "next/server";
import {connectMongoDB} from "@/lib/mongodb";
import {auth} from "@/auth";
import {Wallet} from "@/models/wallet";
import {User} from "@/models/user";
import {Expense} from "@/types/Expense";
import {getSortParamsFromUrl, sortItems, SortOrder} from "@/utils/sort";


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
            {$push: {expenses: expenseData}, $inc: {balance: -expenseData.amount}}, {new: true}
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
        const {sortBy, sortOrder} = getSortParamsFromUrl(url);

        const wallet = await Wallet.findOne({_id: walletId}, {expenses: 1});

        const sortedExpenses = sortItems<Expense>(wallet.expenses, sortBy as keyof Expense, sortOrder)

        return NextResponse.json(sortedExpenses, {status: 200});
    } catch (error) {
        return NextResponse.json({message: 'Error', error}, {status: 500});
    }
};