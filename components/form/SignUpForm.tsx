'use client';
import React from 'react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {SubmitHandler, useForm} from "react-hook-form";
import {signUpWithCredentials} from "@/actions/auth.actions";

type SignUpFormData = {
    name: string;
    email: string;
    password: string;
}
const SignUpForm = () => {
    const {register, handleSubmit} = useForm<SignUpFormData>()
    const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
        await signUpWithCredentials(data);
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Input placeholder='email' {...register('email')}/>
            <Input placeholder='name' {...register('name')}/>
            <Input placeholder='password' {...register('password')} type="password"/>
            <Button>Submit</Button>
        </form>
    );
};

export default SignUpForm;