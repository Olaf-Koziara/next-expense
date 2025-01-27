import {auth} from "@/auth";
import {User} from "@/models/user";
import {connectMongoDB} from "@/lib/mongodb";
import {NextResponse} from "next/server";
import {getSortParamsFromUrl, sortItems} from "@/utils/sort";
import {Wallet} from "@/models/wallet";
import {Expense, SummedExpenseByCategory} from "@/types/Expense";
import {getCategoryWithBiggestSum, getHighestByKey, sumByKey} from "@/utils/calculate";
import {Income} from "@/types/Income";
import {pieChartColors} from "@/utils/charts";

export const GET = async (req: Request) => {

    await connectMongoDB();
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({error: "Unauthorized!"}, {status: 401});
    }
    const url = new URL(req.url)

    const walletId = url.searchParams.get("wallet")

    const wallet = await Wallet.findOne({_id: walletId}, {expenses: 1, incomes: 1});
    const sumExpenseCategories = sumByKey<Expense>(wallet.expenses, 'amount', 'category').map(remapCategorySumData)
    const sumIncomeCategories = sumByKey<Income>(wallet.incomes, 'amount', 'category').map(remapCategorySumData)
    let highestExpenseCategory = getHighestByKey(sumExpenseCategories, 'total');
    let highestIncomeCategory = getHighestByKey(sumIncomeCategories, 'total');
    const balance = wallet.balance;
    const stats = {sumExpenseCategories, sumIncomeCategories, highestExpenseCategory, highestIncomeCategory, balance}

    return NextResponse.json(stats, {status: 200})

}
const remapCategorySumData = (item: { keyValue: string, total: number }, index: number) => ({
    category: item.keyValue,
    total: item.total,
    fill: [pieChartColors[index < pieChartColors.length ? index : index % pieChartColors.length]]
})
