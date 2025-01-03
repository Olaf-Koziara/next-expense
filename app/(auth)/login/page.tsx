import React from 'react';
import SignInForm from "@/components/form/SignInForm";

const Page = () => {
    return (
        <div className="h-screen flex justify-center items-center">
            <div className="w-1/3 py-32  mb-64 ">
                <div className='w-80 text-center mx-auto'>
                    <h1 className='text-3xl pb-3'>Login</h1>
                    <SignInForm/>
                </div>
            </div>

        </div>
    );
};

export default Page;