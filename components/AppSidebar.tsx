import {
    DiamondMinus,
    DiamondPlus,
    DoorClosedIcon,
    Home,
    PlusCircleIcon,
    Search,
    Settings,
    UserIcon,
    UserPenIcon
} from "lucide-react"

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
import {auth} from "@/auth";

// Menu items.
const items = [
    {
        title: "Summary",
        url: "#",
        icon: Home,
    },
    {
        title: "Expenses",
        url: "/expenses",
        icon: DiamondMinus,
        children: [{
            title: "Add expense",
            url: "/expenses/add",
            icon: PlusCircleIcon
        }]
    },
    {
        title: "Incomes",
        url: "#",
        icon: DiamondPlus,
    },
    {
        title: "Search",
        url: "#",
        icon: Search,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
]

const UserInfo = ({name, email}: { name: string, email: string }) =>
    <div className="flex items-center justify-around">
        <div>
            <div className="flex items-center font-bold">
                <UserIcon/>
                {name}
            </div>
            {email}
        </div>
        <SignOut><DoorClosedIcon/></SignOut>

    </div>
const AuthButtons = () =>
    <div className='flex justify-between'>
        <div className='flex items-center gap-1'><UserIcon/> <Link className={buttonVariants({variant: 'outline'})}
                                                                   href={'/login'}>Login</Link></div>
        <div className='flex items-center gap-1'><UserPenIcon/><Link className={buttonVariants({variant: 'outline'})}
                                                                     href={'/register'}>Register</Link>
        </div>
    </div>
export const AppSidebar = async () => {
    const session = await auth();

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem className="p-2">
                                {session && session.user ?
                                    <UserInfo name={session.user.name ?? ''}
                                              email={session.user.email ?? ''}/> :
                                    <AuthButtons/>

                                }

                            </SidebarMenuItem>
                            {
                                items.map((item) => (
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
