import {auth} from "@/auth";
import {User} from "@/models/user";
import {connectMongoDB} from "@/lib/mongodb";
import {NextResponse} from "next/server";
import {getSortParamsFromUrl, sortItems} from "@/utils/sort";
import {Wallet} from "@/models/wallet";
import {Expense, SummedExpenseByCategory} from "@/types/Expense";
import {getCategoryWithBiggestSum, getHighestByKey, sumByKey, sumByKeys} from "@/utils/calculate";
import {Income} from "@/types/Income";
import {pieChartColors} from "@/utils/charts";
import {getFilterMatchStageFromUrl} from "@/app/api/expense/filter";
import mongoose, {PipelineStage} from "mongoose";

export const GET = async (req: Request) => {

    await connectMongoDB();
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({error: "Unauthorized!"}, {status: 401});
    }
    const url = new URL(req.url)

    const walletId = url.searchParams.get("walletId");
    if (!walletId) {
        return NextResponse.json({error: 'Wallet id required',}, {status: 400});
    }
    const dateStart = url.searchParams.get("dateFrom");
    const dateEnd = url.searchParams.get("dateTo");

    const dateFilter: Record<string, any> = {};
    if (dateStart) {
        dateFilter.$gte = new Date(dateStart);
    }
    if (dateEnd) {
        dateFilter.$lte = new Date(dateEnd);
    }

    const pipeline = [
        {
            // Match the wallet first
            $match: {_id: new mongoose.Types.ObjectId(walletId)}
        },
        {
            // Create two mini-pipelines: one for expenses, one for incomes
            $facet: {
                expenses: [
                    {$unwind: "$expenses"},
                    {
                        // Adjust the field as needed; e.g. "expenses.date" if that's your field
                        $match: {
                            "expenses.date": {
                                ...(dateStart ? {$gte: new Date(dateStart)} : {}),
                                ...(dateEnd ? {$lte: new Date(dateEnd)} : {})
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$_id",
                            expenses: {$push: "$expenses"}
                        }
                    }
                ],
                incomes: [
                    {$unwind: "$incomes"},
                    {
                        // Similarly for incomes
                        $match: {
                            "incomes.date": {
                                ...(dateStart ? {$gte: new Date(dateStart)} : {}),
                                ...(dateEnd ? {$lte: new Date(dateEnd)} : {})
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$_id",
                            incomes: {$push: "$incomes"}
                        }
                    }
                ],
                doc: [
                    {
                        $project: {
                            _id: 1,
                            balance: 1 // Directly keep balance (primitive number)
                        }
                    }
                ]

            },

        },
        {

            $project: {
                expenses: {$ifNull: [{$arrayElemAt: ["$expenses.expenses", 0]}, []]},
                incomes: {$ifNull: [{$arrayElemAt: ["$incomes.incomes", 0]}, []]},
                balance: {
                    $ifNull: [{$arrayElemAt: ["$doc.balance", 0]}, 0]
                }
            }
        }
    ];
    const [result] = await Wallet.aggregate(pipeline);

    const summedExpenseCategories = sumByKey<Expense>(result.expenses, 'amount', 'category').map(remapCategorySumData)
    const summedIncomeCategories = sumByKey<Income>(result.incomes, 'amount', 'category').map(remapCategorySumData)
    const summedExpenseCategoriesAndDate = sumByKeys(result.expenses, ['category', 'date'], 'amount');
    const summedIncomeCategoriesAndDate = sumByKeys(result.incomes, ['category', 'date'], 'amount');

    let highestExpenseCategory = getHighestByKey(summedExpenseCategories, 'total');
    let highestIncomeCategory = getHighestByKey(summedIncomeCategories, 'total');
    const balance = result.balance;
    const stats = {
        summedExpenseCategories,
        summedIncomeCategories,
        summedExpenseCategoriesAndDate,
        summedIncomeCategoriesAndDate,
        highestExpenseCategory,
        highestIncomeCategory,
        balance
    }

    return NextResponse.json(stats, {status: 200})


}
const remapCategorySumData = (item: { keyValue: string, total: number }, index: number) => ({
    category: item.keyValue,
    total: item.total,
    fill: [pieChartColors[index < pieChartColors.length ? index : index % pieChartColors.length]]
})
