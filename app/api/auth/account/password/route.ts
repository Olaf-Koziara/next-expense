import {NextResponse} from "next/server";
import {changeUserPassword} from "@/actions/auth.actions";


export async function PUT(request: Request) {
    try {

        const {oldPassword, newPassword} = await request.json();

        if (!oldPassword || !newPassword) {
            return NextResponse.json({error: "Missing old or new password."}, {status: 400});
        }

        const result = await changeUserPassword({oldPassword, newPassword});

        if (!result.success) {
            return NextResponse.json({error: result.message}, {status: 400});
        }

        return NextResponse.json({message: "Password updated successfully."});
    } catch (error: any) {
        return NextResponse.json({error: error.message || "Something went wrong."}, {status: 500});
    }
}