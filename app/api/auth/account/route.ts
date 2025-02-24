import {NextResponse} from "next/server";
import {removeUserAccount} from "@/actions/auth.actions";

export async function DELETE() {
    try {
        const result = await removeUserAccount();

        if (!result.success) {
            return NextResponse.json({error: result.message}, {status: 400});
        }

        return NextResponse.json({message: "Account removed successfully."}, {status: 200});
    } catch (error: unknown) {
        return NextResponse.json(
            {error: (error as Error).message || "Something went wrong."},
            {status: 500}
        );
    }
}