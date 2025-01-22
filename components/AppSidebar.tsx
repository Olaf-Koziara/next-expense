'use client';
import {BookOpen, DiamondMinus, DiamondPlus, DoorClosedIcon, Home, PlusCircleIcon, UserIcon, Wallet} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {SignOut} from "@/components/signOutButton";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {useSession} from "next-auth/react";
import WalletList from "@/components/WalletList/WalletList";

// Menu items.
const items = [

    {
        title: "Summary",
        url: "/",
        icon: Home,
    },
    {
        title: "Expenses",
        url: "/expenses",
        icon: DiamondMinus,
        children: [{title: 'Categories', url: '/expenses/categories', icon: BookOpen}]
    },
    {
        title: "Incomes",
        url: "/incomes",
        icon: DiamondPlus,
        children: [{title: 'Categories', url: '/incomes/categories', icon: BookOpen}]
    },

]

const UserInfo = ({name, email}: { name: string, email: string }) =>
    <div>

        <div className="flex items-center justify-between pb-2">
            <div>
                <div className="font-bold pb-2">

                    <div className='flex items-center gap-1 pb-2'>
                        <Link className={buttonVariants({variant: 'outline'})} href='/user'>
                            <UserIcon size={64}/>
                            {name}
                        </Link>

                        <SignOut>

                            <DoorClosedIcon
                                className='inline'/>Sign
                            Out

                        </SignOut>
                    </div>
                </div>
                <WalletList/>
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
export const AppSidebar = () => {


    const {data: session} = useSession();


    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem className="p-2">
                                {session && session.user ?
                                    <UserInfo name={session.user.name ?? ''} email={session.user.email ?? ''}/>
                                    : <div><AuthLinks/></div>
                                }

                            </SidebarMenuItem>
                            {
                                session && session.user && items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <a href={item.url}>
                                                <item.icon/>
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                        {item.children ?
                                            <SidebarMenuSub>
                                                {item.children.map((child, index) => (
                                                    <SidebarMenuSubItem key={index}>
                                                        <SidebarMenuSubButton asChild>
                                                            <a href={child.url}>
                                                                <child.icon/>
                                                                <span>{child.title}</span>
                                                            </a>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>))}
                                            </SidebarMenuSub> : null}
                                    </SidebarMenuItem>
                                ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
