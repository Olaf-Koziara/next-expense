'use server';
import {BookOpen, Home, UserIcon,} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,

} from "@/components/ui/sidebar"
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {auth} from "@/auth";
import WalletListWrapper from "@/components/WalletList/WalletListWrapper";
import ClientProviders from "@/components/ClientProviders";


const items = [

    {
        url: "/",
        icon: Home,
    },
    {
        title: "Expenses",
        url: "/expenses",
        icon: BookOpen,

    },


]

const UserInfo = async ({name, email}: { name: string, email: string }) =>
    <div>

        <div className="flex items-center justify-between pb-2">
            <div>
                <div className="font-bold pb-2">

                    <div className='flex items-center gap-1 pb-2'>
                        <Link className='hover:scale-125' href='/user'>
                            <UserIcon/>
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
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className='items-center'>
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
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <a href={item.url}>
                                                <div>
                                                    <item.icon className='hover:scale-125 duration-150'/>
                                                </div>
                                            </a>
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
