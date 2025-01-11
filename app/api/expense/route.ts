import {NextApiRequest} from "next";
import {NextResponse} from "next/server";
import {connectMongoDB} from "@/lib/mongodb";
import {getServerSession} from "next-auth/next";
import {auth, authOptions} from "@/auth";
import {Wallet} from "@/models/wallet";
import {User} from "@/models/user";


export const POST = async (req: Request) => {
    try {
        await connectMongoDB();
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({error: "Unauthorized!"}, {status: 401});
        }

        const {selectedWalletId, ...expenseData} = await req.json();

        const walletOwner = await User.findOne({
            email: session.user.email,
            wallets: selectedWalletId
        });

        if (!walletOwner) {
            throw new Error('Wallet not found or unauthorized');

        }


        const wallet = await Wallet.findByIdAndUpdate(
            selectedWalletId,
            {$push: {expenses: expenseData}}, {new: true}
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
        const sortBy = url.searchParams.get("sortBy") ?? 'title';
        console.log(sortBy)
        const order = url.searchParams.get("order") ?? 'asc';
        console.log(order)


        const wallet = await Wallet.findOne({_id: walletId}, {expenses: 1});
        const sortedExpenses = [...wallet.expenses].sort((a, b) => {
            const valueA = a[sortBy].toString().toLowerCase();
            const valueB = b[sortBy].toString().toLowerCase();
            if (order === "asc") {
                return valueA > valueB ? 1 : -1;
            }
            return valueA < valueB ? 1 : -1;
        });
        return NextResponse.json(sortedExpenses, {status: 200});
    } catch (error) {
        return NextResponse.json({message: 'Error', error}, {status: 500});
    }
};