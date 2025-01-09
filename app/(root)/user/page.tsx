'use client';
import {auth} from "@/auth";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";


const Page = async () => {
    const session = await auth()
    if (!session) return null
    return (

        <Card>
            <CardHeader>
                <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-4">
                    <img src={session.user?.image ?? undefined} alt={`${session.user?.name}'s profile`}
                         className="w-16 h-16 rounded-full"/>
                    <div>
                        <h2 className="text-lg font-bold">{session.user?.name}</h2>
                        <p className="text-sm text-gray-600">{session.user?.email}</p>
                    </div>
                </div>
                <Button className="mt-4">
                    Change password
                </Button>

            </CardContent>
        </Card>
    );
};

export default Page;