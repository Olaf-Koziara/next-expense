'use server';
import React from 'react';
import SignUpForm from "@/app/auth/signUp/(components)/SignUpForm";

const Page = async () => {
    return (
        <div className="h-screen flex justify-center items-center">
            <div className="w-1/3 py-32  mb-64 ">
                <div className='w-80 text-center mx-auto'>
                    <h1 className='text-3xl pb-3'>Register</h1>
                    <SignUpForm/>
                </div>
            </div>
        </div>
    );
};

export default Page;