'use server';
import {Home, LibraryIcon, List} from "lucide-react"

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
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {UserPanel} from "@/app/(root)/(components)/AppSidebar/(components)/UserPanel";


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

const AuthLinks = () => <div>
    <Link className={buttonVariants({variant: 'outline'})}
          href={'/app/auth/signIn'}>SignIn</Link>
    <Link
        className={buttonVariants({variant: 'outline'})}
        href={'/app/auth/signUp'}>SignUp</Link>
</div>

export const AppSidebar = async () => {

    const session = await auth();


    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className='items-center pt-4'>
                            <SidebarMenuItem className='w-full flex-col items-center' key='userInfo'>
                                {session && session.user ?
                                    <UserPanel name={session.user.name ?? ''} email={session.user.email ?? ''}/>
                                    : <div><AuthLinks/></div>
                                }
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
