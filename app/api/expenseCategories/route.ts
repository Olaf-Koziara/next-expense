import {connectMongoDB} from "@/lib/mongodb";
import {auth} from "@/auth";
import {User} from "@/models/user";
import {ExpenseCategory} from "@/models/expenseCategory";
import {Category} from "@/types/Category";

export const GET = async () => {
    try {
        await connectMongoDB();
        const session = await auth();
        if (session && session.user) {


            const user = await User.findOne({email: session.user.email})
                .populate('expenseCategories');

            if (!user) {
                return Response.json({message: 'User not found'}, {status: 404});
            }
            const length = user.expenseCategories.length | 0;
            const expenseCategories = user.expenseCategories || [];
            return Response.json({data: expenseCategories, totalCount: length}, {status: 200});


        }
        return Response.json({message: 'Unauthorized'}, {status: 401})
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

        // Find user first
        const user = await User.findOne({email: session.user.email})
            .populate('expenseCategories');

        if (!user) {
            return Response.json({message: 'User not found'}, {status: 404});
        }

        // Check if category with same name already exists for this user
        const existingCategory = user.expenseCategories.find(
            (category: Category) => category.name.toLowerCase() === name.toLowerCase()
        );

        if (existingCategory) {
            return Response.json(
                {message: 'Category with this name already exists', category: existingCategory},
                {status: 409}
            );
        }

        // Create new category if it doesn't exist
        const newCategory = await ExpenseCategory.create({name});

        // Update user with new category
        const updatedUser = await User.findOneAndUpdate(
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

        if (!updatedUser) {
            // Cleanup the created category if user update fails
            await ExpenseCategory.findByIdAndDelete(newCategory._id);
            return Response.json({message: 'Failed to update user'}, {status: 500});
        }

        return Response.json(
            {message: 'Category created successfully', category: newCategory},
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

        const updatedCategory = await ExpenseCategory.findByIdAndUpdate(categoryData._id, categoryData, {new: true});

        if (!updatedCategory) {
            return Response.json({message: 'Category not found'}, {status: 404});
        }

        return Response.json(updatedCategory, {status: 200});
    } catch (error) {
        console.error('Error updating expense category:', error);
        return Response.json({message: 'Internal server error'}, {status: 500});
    }
};
