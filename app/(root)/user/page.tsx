'use client';

import { useEffect, useState } from 'react';
import { useCurrencies } from '@/hooks/useCurrencies';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import UserPasswordChanger from "@/app/(root)/user/(components)/UserPasswordChanger";
import UserRemover from "@/app/(root)/user/(components)/UserRemover";

export default function UserSettings() {
    const { data: session } = useSession();
    const router = useRouter();
    const { currencies, loading } = useCurrencies();

    useEffect(() => {
        if (!session) {
            router.push('/auth/signIn');
        }
    }, [session, router]);



  

    if (!session) {
        return null;
    }

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle>User Settings</CardTitle>
                    <CardDescription>Manage your account settings</CardDescription>
                            <h2 className="text-lg font-bold">Name: {session.user?.name}</h2>
                            <h2 className="text-lg">Email: {session.user?.email}</h2>

                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Default Currency</label>
                            
                        </div>
                        <UserPasswordChanger/>
                        <UserRemover/>


                    </div>
                </CardContent>
            </Card>
        </div>
    );
}