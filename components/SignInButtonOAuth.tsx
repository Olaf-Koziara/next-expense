"use client";
import React, {ReactNode} from 'react';
import {Button} from "@/components/ui/button";
import {signIn} from 'next-auth/react';
import {BuiltInProviderType} from "next-auth/providers/index";


const SignInButtonOAuth = ({children, providerType, options, className}: {
    children: ReactNode,
    providerType: BuiltInProviderType
    className?: string
    options?: FormData | ({ redirectTo?: string, } & Record<string, any>)
}) => {
    const handleSignIn = async (providerType: BuiltInProviderType) => {
        await signIn(providerType, {callbackUrl: '/'}).catch(err => {
            console.error(err);
        })
    }
    return (
        <Button className={className} variant="outline" size='sm'
                onClick={() => handleSignIn(providerType)}>{children}</Button>)

}
export default SignInButtonOAuth;