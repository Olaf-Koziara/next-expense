'use client'
import React, {createContext, useContext} from "react";
import {AppSidebar} from "@/components/AppSidebar";
import {SidebarProvider} from "@/components/ui/sidebar";
import {SessionProvider} from "next-auth/react";
import {WalletProvider} from "@/context/WalletContext";


const layout = ({children}: Readonly<{ children: React.ReactNode }>) => {
    return (
        <SessionProvider>
            <WalletProvider>
                <SidebarProvider>

                    <AppSidebar/>


                    <main className='w-full pt-10 px-2'>
                        {children}
                    </main>
                </SidebarProvider>
            </WalletProvider>
        </SessionProvider>


    )
}
export default layout;