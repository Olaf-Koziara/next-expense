'use client'
import React from 'react';
import {Input} from "@/components/ui/input";
import {SubmitHandler, useForm} from "react-hook-form";
import {signIn} from "next-auth/react";
import {Button} from "@/components/ui/button";

type signInFormData = {
    email: string;
    password: string;
}
const SignInForm = () => {
    const {register, handleSubmit} = useForm<signInFormData>()
    const onSubmit: SubmitHandler<signInFormData> = async (data) => {
        await signIn('credentials', {email: data.email, password: data.password}).catch(err => {
            console.error(err);
        })

    }
    return (
        <form className='flex flex-col gap-3 ' onSubmit={handleSubmit(onSubmit)}>
            <Input placeholder='E-mail' {...register('email')} />
            <Input placeholder='Password' {...register('password')}/>
            <Button>Submit</Button>
        </form>
    );
};

export default SignInForm;