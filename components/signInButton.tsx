import React, {ReactNode} from 'react';
import {Button} from "@/components/ui/button";
import {BuiltInProviderType} from "@auth/core/providers";
import {signIn} from 'next-auth/react';


const SignIn = ({children, providerType, options}: {
    children: ReactNode,
    providerType: BuiltInProviderType,
    options?: FormData | ({ redirectTo?: string, } & Record<string, any>)
}) =>
    <form action={async () => {
        'use server';
        await signIn(providerType)
    }}><Button variant="outline" size='sm' type="submit">{children}</Button></form>


export default SignIn;