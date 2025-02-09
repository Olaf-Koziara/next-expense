'use server';
import {Home, LibraryIcon, List, UserIcon,} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {auth} from "@/auth";
import WalletListWrapper from "@/app/(root)/(components)/WalletList/WalletListWrapper";
import ClientProviders from "@/app/(root)/(components)/ClientProviders";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";


const items = [

    {
        url: "/",
        icon: Home,
        title: 'Dashboard'
    },
    {
        title: "Expenses/Incomes",
        url: "/expenses",
        icon: List,

    },
    {
        title: "Categories",
        url: "/categories",
        icon: LibraryIcon,
    }


]

const UserInfo = async ({name}: { name: string, email: string }) =>
    <div>

        <div className="flex items-center justify-between pb-2">
            <div>
                <div className="font-bold pb-2">

                    <div className='flex items-center justify-center'>
                        <Link className='hover:scale-125' href='/user'>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <UserIcon/>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {name}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Link>

                    </div>
                </div>
                <WalletListWrapper/>
            </div>

        </div>
    </div>
const AuthLinks = () => <div>
    <Link className={buttonVariants({variant: 'outline'})}
          href={'/auth/signIn'}>SignIn</Link>
    <Link
        className={buttonVariants({variant: 'outline'})}
        href={'/auth/signUp'}>SignUp</Link>
</div>

export const AppSidebar = async () => {

    const session = await auth();


    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className='items-center pt-4'>
                            <SidebarMenuItem key='userInfo'>
                                <ClientProviders>
                                    {session && session.user ?
                                        <UserInfo name={session.user.name ?? ''} email={session.user.email ?? ''}/>
                                        : <div><AuthLinks/></div>
                                    }
                                </ClientProviders>

                            </SidebarMenuItem>
                            {
                                session && items.map((item) => (
                                    <SidebarMenuItem key={item.url} className='pb-2'>
                                        <SidebarMenuButton asChild>
                                            <TooltipProvider>
                                                <Tooltip delayDuration={200}>
                                                    <TooltipTrigger>
                                                        <a href={item.url}>
                                                            <div>
                                                                <item.icon className='hover:scale-125 duration-150'/>
                                                            </div>
                                                        </a>
                                                    </TooltipTrigger>
                                                    <TooltipContent side={'right'} hideWhenDetached={true}>
                                                        {item.title}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
