'use server';
import {AppSidebar} from "@/app/(root)/(components)/AppSidebar/AppSidebar";
import ClientProviders from "@/app/(root)/(components)/ClientProviders";
import {SidebarProvider} from "@/components/ui/sidebar";

const Layout = ({children}: Readonly<{ children: React.ReactNode }>) => {
    return (
        <div className="flex">
            <ClientProviders>
                <div className='w-auto'>
                    <SidebarProvider>
                        <AppSidebar/>
                    </SidebarProvider>
                </div>

                <main className="w-full pt-10 px-2">
                    {children}
                </main>
            </ClientProviders>
        </div>
    );
};

export default Layout;
