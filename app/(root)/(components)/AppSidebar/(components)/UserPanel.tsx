import Link from "next/link";
import WalletListWrapper from "@/app/(root)/(components)/WalletList/WalletListWrapper";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {DoorOpen, Settings2, UserIcon} from "lucide-react";
import {SignOut} from "@/app/(root)/(components)/signOutButton";

export const UserPanel = async ({name}: { name: string, email: string }) =>
    <div>

        <div className="flex items-center justify-between pb-2">
            <div>
                <div className="font-bold pb-2">

                    <div className='flex items-center justify-center'>

                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <UserIcon/>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <div className=' flex flex-col gap-2 items-center p-3'>
                                    <div className=' text-center'>Hi {name}</div>
                                    <Link
                                        className='text-sm flex items-center p-2 rounded bg-fuchsia-950 hover:bg-fuchsia-800 transition'
                                        href='/user'>Menage <Settings2 size={'1.25rem'}/></Link>
                                    <SignOut>Sign out<DoorOpen/></SignOut>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>


                    </div>
                </div>
                <WalletListWrapper/>
            </div>

        </div>
    </div>