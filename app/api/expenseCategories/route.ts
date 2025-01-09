import {NextApiRequest} from "next";
import {connectMongoDB} from "@/lib/mongodb";
import {auth} from "@/auth";
import {User} from "@/models/user";
import {ExpenseCategory} from "@/models/expenseCategory";

export const GET = async (req: NextApiRequest) => {
    try {
        await connectMongoDB();
        const session = await auth();
        if (session && session.user) {


            const user = await User.findOne({email: session.user.email})
                .populate('expenseCategories');

            if (!user) {
                return Response.json({message: 'User not found'}, {status: 404});
            }


            return Response.json({expenseCategories: user.expenseCategories}, {status: 200});
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

        // Create new expense category
        const newCategory = await ExpenseCategory.create({name});

        // Add reference to user's expenseCategories array
        const user = await User.findOneAndUpdate(
            {email: session.user.email},
            {
                $push: {
                    expenseCategories: newCategory._id
                }
            },
            {
                new: true
            }
        ).populate('expenseCategories');

        if (!user) {
            // Cleanup the created category if user update fails
            await ExpenseCategory.findByIdAndDelete(newCategory._id);
            return Response.json({message: 'User not found'}, {status: 404});
        }

        return Response.json(
            {status: 201}
        );
    } catch (error) {
        console.error('Error creating expense category:', error);
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
            {$pull: {expenseCategories: _id}},
            {new: true}
        );

        if (!user) {
            return Response.json({message: 'User not found'}, {status: 404});
        }


        await ExpenseCategory.findByIdAndDelete(_id);

        return Response.json({message: 'Category deleted successfully'}, {status: 200});
    } catch (error) {
        console.error('Error deleting expense category:', error);
        return Response.json({message: 'Internal server error'}, {status: 500});
    }
}
