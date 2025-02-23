'use client';
import React from 'react';
import {Button} from "@/components/ui/button";
import {changeUserPassword} from "@/actions/auth.actions";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {SubmitHandler, useForm} from "react-hook-form";
import {PasswordChangeForm, passwordChangeScheme} from "@/types/User";
import {zodResolver} from "@hookform/resolvers/zod";
import useStatus from "@/hooks/useStatus";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";


const UserPasswordChanger = () => {
    const {handleSubmit, register, setError, formState: {errors}} = useForm<PasswordChangeForm>({
        resolver: zodResolver(passwordChangeScheme)
    })
    const {setStatus, status, setMessage, message, error} = useStatus();
    const handlePasswordChange: SubmitHandler<PasswordChangeForm> = async (data, event) => {
        setStatus('pending');
        await changeUserPassword(data).then((res) => {
            console.log(res)
            if (res.success) {
                setStatus('success')
            } else {
                setStatus('error')
                setMessage(res.message ?? '')
            }
        })
    }
    return (
        <div>

            <Dialog>
                <DialogTrigger className='button rounded-md bg-blue-700 px-4 py-2 text-sm'>

                    Change password

                </DialogTrigger>
                <DialogContent>
                    <form onSubmit={handleSubmit(handlePasswordChange)} className='flex flex-col gap-2'>
                        <Input error={errors.oldPassword}
                               type='password'
                               placeholder='Old password' {...register('oldPassword', {required: true})}/>
                        <Input error={errors.newPassword}
                               type={'password'}
                               autoComplete={'off'}
                               placeholder='New password' {...register('newPassword', {required: true})}/>
                        <Button type='submit'>Confirm</Button>
                    </form>
                    {status === 'success' ?
                        <Alert variant={'default'}>
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>Password has been changed</AlertDescription>
                        </Alert>
                        : status === 'error' ?
                            <Alert variant={'destructive'}>
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{message}</AlertDescription>
                            </Alert> : null}

                </DialogContent>
            </Dialog>

        </div>
    );
};

export default UserPasswordChanger;