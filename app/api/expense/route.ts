import {NextApiRequest} from "next";
import {NextResponse} from "next/server";
import {Expense} from "@/models/expense";
import {connectMongoDB} from "@/lib/mongodb";

export const POST = async(req:NextApiRequest) => {
    try{
        await connectMongoDB();
        const body = JSON.parse(req.body)
        await Expense.create(body);
        return Response.json({},{status:200});
    }catch (error){
        return  Response.json({message:'Error',error},{status:500})
    }
}
export const GET = async(req:NextApiRequest)=>{
    try {
        await connectMongoDB();
        const expenses = await Expense.find({});
        return Response.json({expenses},{status:200});
    }catch (error){
        return Response.json({message:'Error',error},{status:500})
    }
}