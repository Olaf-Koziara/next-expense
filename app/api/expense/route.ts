import {NextResponse} from "next/server";
import {connectMongoDB} from "@/lib/mongodb";
import {auth} from "@/auth";
import {Wallet} from "@/models/wallet";
import {User} from "@/models/user";
import mongoose, {PipelineStage} from "mongoose";
import {Expense} from "@/types/Expense";
import {NextRequest} from "next/server";


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

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        await connectMongoDB();
        if (!session?.user?.email) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401});
        }

        const {searchParams} = new URL(request.url);
        const walletId = searchParams.get('walletId');

        if (!walletId) {
            return NextResponse.json({error: 'Wallet ID is required'}, {status: 400});
        }

        if (!mongoose.Types.ObjectId.isValid(walletId)) {
            return NextResponse.json({error: 'Invalid wallet ID format'}, {status: 400});
        }

        const pipeline: PipelineStage[] = [
            {
                $match: {_id: new mongoose.Types.ObjectId(walletId)}
            },
            {
                $unwind: '$expenses'
            },
            {
                $project: {
                    _id: '$expenses._id',
                    title: '$expenses.title',
                    amount: '$expenses.amount',
                    category: '$expenses.category',
                    date: '$expenses.date',
                    currency: '$expenses.currency'
                }
            }
        ];

        const expenses = await Wallet.aggregate(pipeline);
        return NextResponse.json({data:expenses,totalCount:expenses.length});
    } catch (error) {
        console.error('Error fetching expenses:', error);
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}

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

        const wallet = await Wallet.findOne({
            _id: new mongoose.Types.ObjectId(walletId),
            "expenses._id": new mongoose.Types.ObjectId(_id)
        });

        if (!wallet) {
            return NextResponse.json({error: "Wallet or expense not found!"}, {status: 404});
        }

        // Get the old expense amount
        const oldExpense = wallet.expenses.id(_id);
        const oldAmount = oldExpense.amount;
        const newAmount = updateData.amount || oldAmount;

        // Update the expense and adjust the balance
        await Wallet.findOneAndUpdate(
            {_id: new mongoose.Types.ObjectId(walletId), "expenses._id": new mongoose.Types.ObjectId(_id)},
            {
                $set: {"expenses.$": {_id, ...updateData}},
                $inc: {balance: oldAmount - newAmount} // Subtract the difference
            },
            {new: true}
        );

        return NextResponse.json({message: "Expense updated successfully"}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: 'Error', error}, {status: 500});
    }
};