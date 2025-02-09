import {connectMongoDB} from "@/lib/mongodb";
import {User} from "@/models/user";
import {auth} from "@/auth";
import {Wallet} from "@/models/wallet";
import {NextResponse} from "next/server";

export const GET = async () => {

    const session = await auth();

    if (!session || !session.user) {
        throw new Error("Unauthorization!");
    }
    const {email} = session.user;

    await connectMongoDB();
    const user = await User.findOne({email}).populate("wallets", "name");
    if (!user) {
        throw new Error("User does not exist!");
    }
    const wallets = user.wallets.map((wallet: { _id: string; name: string }) => ({
        _id: wallet._id.toString(),
        name: wallet.name,
    }));

    return Response.json(wallets, {status: 200});

}
export const POST = async (req: Request) => {
    try {
        await connectMongoDB();
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({error: "Unauthorized!"}, {status: 401});
        }

        const {email} = session.user;

        const {name} = await req.json();
        const user = await User.findOne({email});

        if (!user) {
            return NextResponse.json({error: "User not found!"}, {status: 404});
        }


        const newWallet = new Wallet({name});
        user.wallets.push(newWallet);
        await newWallet.save();
        await user.save();

        return NextResponse.json({id: newWallet._id.toString(), name: newWallet.name}, {status: 201});
    } catch (error) {
        return NextResponse.json({message: 'Error', error}, {status: 500});
    }
}