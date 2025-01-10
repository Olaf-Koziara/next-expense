import React from 'react';
import SignInButtonOAuth from "@/components/SignInButtonOAuth";
import SignInForm from "@/app/auth/signIn/(components)/SignInForm";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";

const Page = () => {
    return (
        <div className="h-screen flex justify-center items-center">
            <div className="w-1/3 py-32  mb-64 ">
                <div className='w-80 text-center mx-auto'>
                    <h1 className='text-3xl pb-3'>Login</h1>
                    <SignInForm/>
                    <div className='pt-3 flex content-stretch'>
                        <SignInButtonOAuth className='basis-full' providerType={'google'}>
                            Sign in with Google
                        </SignInButtonOAuth>
                    </div>
                    <div className='pt-3 '>
                        <Link href='/auth/signUp' className={buttonVariants({variant: "outline"}) + ' w-full'}>
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Page;