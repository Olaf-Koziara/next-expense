import React from "react";
import {AppSidebar} from "@/components/AppSidebar";
import {SidebarProvider} from "@/components/ui/sidebar";


const layout = async ({children}: Readonly<{ children: React.ReactNode }>) => {

    return (
        <SidebarProvider>
            <AppSidebar/>
            <main>
                {children}
            </main>
        </SidebarProvider>
    )
}
export default layout;