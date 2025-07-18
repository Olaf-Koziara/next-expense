import { connectMongoDB } from "@/lib/mongodb";
import { User } from "@/features/auth/schemas/user";
import { auth } from "@/auth";
import { Wallet } from "@/app/api/wallet/model/wallet";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("Unauthorization!");
  }
  const { email } = session.user;

  await connectMongoDB();
  const user = await User.findOne({ email }).populate(
    "wallets",
    "name currency"
  );
  if (!user) {
    throw new Error("User does not exist!");
  }
  const wallets = user.wallets.map(
    (wallet: { _id: string; name: string; currency: string }) => ({
      _id: wallet._id.toString(),
      name: wallet.name,
      currency: wallet.currency,
    })
  );

  return Response.json(wallets, { status: 200 });
};
export const POST = async (req: Request) => {
  try {
    await connectMongoDB();
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const { email } = session.user;

    const { name, currency } = await req.json();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    const newWallet = new Wallet({ name, currency, balance: 0 });
    user.wallets.push(newWallet);
    await newWallet.save();
    await user.save();

    return NextResponse.json(
      { id: newWallet._id.toString(), name: newWallet.name },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
};

export const PATCH = async (req: Request) => {
  try {
    await connectMongoDB();
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const { email } = session.user;
    const { _id, ...updateData } = await req.json();

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

    // Update wallet fields
    Object.assign(wallet, updateData);
    await wallet.save();

    return NextResponse.json(
      {
        _id: wallet._id.toString(),
        name: wallet.name,
        currency: wallet.currency,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
};
