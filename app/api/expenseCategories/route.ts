import {NextApiRequest} from "next";
import {connectMongoDB} from "@/lib/mongodb";
import {Expense, ExpenseCategory} from "@/models/expense";

export const GET = async(req:NextApiRequest)=>{
    try {
        await connectMongoDB();
        const expenseCategories = await ExpenseCategory.find({});
        return Response.json({expenseCategories},{status:200});
    }catch (error){
        return Response.json({message:'Error',error},{status:500})
    }
}