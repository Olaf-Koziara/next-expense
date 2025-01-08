'use client'
import {ReactNode} from "react";
import {signOut} from "next-auth/react";

export const SignOut = ({children}: { children: ReactNode }) => {
    return (
        <form
            action={async () => {
                await signOut({redirect: true})
            }}
        >
            <button type="submit">{children}</button>
        </form>
    )
}