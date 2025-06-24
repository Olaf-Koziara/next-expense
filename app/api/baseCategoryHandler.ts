import { connectMongoDB } from "@/lib/mongodb";
import { auth } from "@/auth";
import { User } from "@/models/user";
import { Category } from "@/types/Category";

export interface CategoryModel {
  create: (data: { name: string }) => Promise<any>;
  findByIdAndDelete: (id: string) => Promise<any>;
  findByIdAndUpdate: (id: string, data: any, options?: any) => Promise<any>;
}

export interface BaseCategoryHandlerConfig {
  categoryModel: CategoryModel;
  userCategoryField: "expenseCategories" | "incomeCategories";
}

export async function handleCategoryGET(config: BaseCategoryHandlerConfig) {
  try {
    await connectMongoDB();
    const session = await auth();

    if (session && session.user) {
      const user = await User.findOne({ email: session.user.email }).populate(
        config.userCategoryField
      );

      if (!user) {
        return Response.json({ message: "User not found" }, { status: 404 });
      }

      const categories = user[config.userCategoryField] || [];
      const length = categories.length;

      return Response.json(
        { data: categories, totalCount: length },
        { status: 200 }
      );
    }

    return Response.json({ message: "Unauthorized" }, { status: 401 });
  } catch (error) {
    return Response.json({ message: "Error", error }, { status: 500 });
  }
}

export async function handleCategoryPOST(
  req: Request,
  config: BaseCategoryHandlerConfig
) {
  try {
    await connectMongoDB();
    const session = await auth();

    if (!session?.user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();

    if (!name) {
      return Response.json({ message: "Name is required" }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email }).populate(
      config.userCategoryField
    );

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const existingCategory = user[config.userCategoryField].find(
      (category: Category) => category.name.toLowerCase() === name.toLowerCase()
    );

    if (existingCategory) {
      return Response.json(
        {
          message: "Category with this name already exists",
          category: existingCategory,
        },
        { status: 409 }
      );
    }

    const newCategory = await config.categoryModel.create({ name });

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $push: {
          [config.userCategoryField]: newCategory._id,
        },
      },
      { new: true }
    ).populate(config.userCategoryField);

    if (!updatedUser) {
      await config.categoryModel.findByIdAndDelete(newCategory._id);
      return Response.json(
        { message: "Failed to update user" },
        { status: 500 }
      );
    }

    return Response.json(
      { message: "Category created successfully", category: newCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function handleCategoryDELETE(
  req: Request,
  config: BaseCategoryHandlerConfig
) {
  try {
    await connectMongoDB();
    const session = await auth();

    if (!session?.user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { _id } = await req.json();

    if (!_id) {
      return Response.json(
        { message: "Category ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $pull: { [config.userCategoryField]: _id } },
      { new: true }
    );

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    await config.categoryModel.findByIdAndDelete(_id);

    return Response.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function handleCategoryPATCH(
  req: Request,
  config: BaseCategoryHandlerConfig
) {
  try {
    await connectMongoDB();
    const session = await auth();

    if (!session?.user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const categoryData: Category = await req.json();

    if (!categoryData._id) {
      return Response.json(
        { message: "Category ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const updatedCategory = await config.categoryModel.findByIdAndUpdate(
      categoryData._id,
      categoryData,
      { new: true }
    );

    if (!updatedCategory) {
      return Response.json({ message: "Category not found" }, { status: 404 });
    }

    return Response.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error("Error updating category:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
