'use client'
import {ReactNode} from "react";
import {signOut} from "next-auth/react";
import {Button} from "@/components/ui/button";

export const SignOut = ({children}: { children: ReactNode }) => {
    return (
        <form
            action={async () => {
                await signOut({redirect: true, redirectTo: '/auth/signIn'})
            }}
        >
            <Button type="submit">{children}</Button>
        </form>
    )
}