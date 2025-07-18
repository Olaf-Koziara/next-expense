import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { auth } from "@/auth";
import { User } from "@/features/auth/schemas/user";
import { Wallet } from "@/app/api/wallet/model/wallet";

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await connectMongoDB();
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const { email } = session.user;
    const { id: _id } = await params;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    const wallet = await Wallet.findById(_id);
    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found!" }, { status: 404 });
    }

    // Verify that the wallet belongs to the user
    if (!user.wallets.includes(wallet._id)) {
      return NextResponse.json(
        { error: "Unauthorized access to wallet!" },
        { status: 403 }
      );
    }

    // Remove wallet from user's wallets array
    user.wallets = user.wallets.filter(
      (walletId: string | number) => walletId.toString() !== _id
    );
    await user.save();

    // Delete the wallet
    await Wallet.findByIdAndDelete(_id);

    return NextResponse.json(
      { message: "Wallet deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
};
