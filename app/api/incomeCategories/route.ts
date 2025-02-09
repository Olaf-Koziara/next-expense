import {NextApiRequest} from "next";
import {connectMongoDB} from "@/lib/mongodb";
import {auth} from "@/auth";
import {User} from "@/models/user";
import {IncomeCategory} from "@/models/incomeCategory";
import {Category} from "@/types/Category";

export const GET = async () => {
    try {
        await connectMongoDB();
        const session = await auth();
        if (session && session.user) {


            const user = await User.findOne({email: session.user.email})
                .populate('incomeCategories');

            if (!user) {
                return Response.json({message: 'User not found'}, {status: 404});
            }
            const length = user.incomeCategories.length | 0;

            return Response.json({data: user.incomeCategories, totalCount: length}, {status: 200});
        }
    } catch (error) {
        return Response.json({message: 'Error', error}, {status: 500})
    }
}
export const POST = async (req: Request) => {
    try {
        await connectMongoDB();
        const session = await auth();

        if (!session?.user) {
            return Response.json({message: 'Unauthorized'}, {status: 401});
        }

        const {name} = await req.json();

        if (!name) {
            return Response.json({message: 'Name is required'}, {status: 400});
        }

        const newCategory = await IncomeCategory.create({name});

        const user = await User.findOneAndUpdate(
            {email: session.user.email},
            {
                $push: {
                    incomeCategories: newCategory._id
                }
            },
            {
                new: true
            }
        ).populate('incomeCategories');

        if (!user) {
            // Cleanup the created category if user update fails
            await IncomeCategory.findByIdAndDelete(newCategory._id);
            return Response.json({message: 'User not found'}, {status: 404});
        }

        return Response.json(
            {status: 201}
        );
    } catch (error) {
        console.error('Error creating income category:', error);
        return Response.json(
            {message: 'Internal server error'},
            {status: 500}
        );
    }
};
export const DELETE = async (req: Request) => {
    try {
        await connectMongoDB();
        const session = await auth();

        if (!session?.user) {
            return Response.json({message: 'Unauthorized'}, {status: 401});
        }

        const {_id} = await req.json();

        if (!_id) {
            return Response.json({message: 'Category ID is required'}, {status: 400});
        }

        const user = await User.findOneAndUpdate(
            {email: session.user.email},
            {$pull: {incomeCategories: _id}},
            {new: true}
        );

        if (!user) {
            return Response.json({message: 'User not found'}, {status: 404});
        }


        await IncomeCategory.findByIdAndDelete(_id);

        return Response.json({message: 'Category deleted successfully'}, {status: 200});
    } catch (error) {
        console.error('Error deleting income category:', error);
        return Response.json({message: 'Internal server error'}, {status: 500});
    }
}
export const PATCH = async (req: Request) => {
    try {
        await connectMongoDB();
        const session = await auth();

        if (!session?.user) {
            return Response.json({message: 'Unauthorized'}, {status: 401});
        }

        const categoryData: Category = await req.json();

        if (!categoryData._id) {
            return Response.json({message: 'Category ID is required'}, {status: 400});
        }

        const user = await User.findOne({email: session.user.email});

        if (!user) {
            return Response.json({message: 'User not found'}, {status: 404});
        }

        const updatedCategory = await IncomeCategory.findByIdAndUpdate(categoryData._id, categoryData, {new: true});

        if (!updatedCategory) {
            return Response.json({message: 'Category not found'}, {status: 404});
        }

        return Response.json(updatedCategory, {status: 200});
    } catch (error) {
        console.error('Error updating income category:', error);
        return Response.json({message: 'Internal server error'}, {status: 500});
    }
};