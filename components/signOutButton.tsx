import {ReactNode} from "react";
import {signOut} from "next-auth/react";

export const SignOut = async ({children}: { children: ReactNode }) => {
    return (
        <form
            action={async () => {
                'use server';
                await signOut({redirect: true})
            }}
        >
            <button type="submit">{children}</button>
        </form>
    )
}