import {NextResponse} from "next/server";
import {removeUserAccount} from "@/actions/auth.actions";

export async function DELETE(request: Request) {
    try {
        const result = await removeUserAccount();

        if (!result.success) {
            return NextResponse.json({error: result.message}, {status: 400});
        }

        return NextResponse.json({message: "Account removed successfully."}, {status: 200});
    } catch (error: any) {
        return NextResponse.json(
            {error: error.message || "Something went wrong."},
            {status: 500}
        );
    }
}