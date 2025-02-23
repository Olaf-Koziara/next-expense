import {auth} from "@/auth";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import UserPasswordChanger from "@/app/(root)/user/(components)/UserPasswordChanger";
import React from "react";
import UserRemover from "@/app/(root)/user/(components)/UserRemover";

const Page = async () => {
    const session = await auth()
    if (!session) return null

    return (
        <div className='flex justify-center'>
            <Card>
                <CardHeader>
                    <CardTitle className={'text-center text-lg'}>User Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2 items-center justify-center space-x-4">
                        <div>
                            <h2 className="text-lg font-bold">Name: {session.user?.name}</h2>
                            <h2 className="text-lg">Email: {session.user?.email}</h2>
                        </div>
                        <UserPasswordChanger/>
                        <UserRemover/>

                    </div>

                </CardContent>
            </Card>
        </div>
    );
};

export default Page;