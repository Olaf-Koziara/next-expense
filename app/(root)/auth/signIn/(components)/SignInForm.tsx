'use client'
import React, {useState} from 'react';
import {Input} from "@/components/ui/input";
import {SubmitHandler, useForm} from "react-hook-form";
import {signIn} from "next-auth/react";
import {Button} from "@/components/ui/button";
import ErrorAlert from "@/components/ui/errorAlert";
import {useRouter} from "next/navigation";


type signInFormData = {
    email: string;
    password: string;
}
const SignInForm = () => {
    const router = useRouter();
    const {register, handleSubmit, formState: {errors}} = useForm<signInFormData>()
    const [error, setError] = useState<string | null>(null)
    const onSubmit: SubmitHandler<signInFormData> = async (data, event) => {
        event?.preventDefault();
        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirectTo: '/',
            redirect: false
        });
        if (result?.error) {
            setError('Wrong email or password');
            return
        }
        router.push('/');


    }
    return (
        <form className='flex flex-col gap-3 ' onSubmit={handleSubmit(onSubmit)}>
            <Input placeholder='E-mail' type='email' {...register('email', {required: true})} />
            <Input placeholder='Password' type='password' {...register('password', {required: true, minLength: 8})}/>
            {errors.password?.type === 'minLength' && <span>Password must be at least 8 characters</span>}
            <Button>Submit</Button>
            {error && <ErrorAlert message={error}/>}
        </form>
    );
};

export default SignInForm;