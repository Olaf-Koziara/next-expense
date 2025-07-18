import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DoorOpen, Settings2, UserIcon } from "lucide-react";
import { SignOut } from "@/features/auth/components/signOutButton";
import { WalletListWrapper } from "@/features/wallet/components/WalletListWrapper";

interface UserPanelProps {
  name: string;
}

export function UserSidebarDropdown({ name }: UserPanelProps) {
  return (
    <div>
      <div className="flex flex-col items-center justify-center pb-2">
        <div className="font-bold pb-2">
          <div className="flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <UserIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="w-full flex flex-col gap-2 items-center p-3">
                  <div className=" text-center">Hi {name}</div>
                  <Link
                    className="text-sm flex items-center p-2 rounded dark:bg-fuchsia-950 hover:text-gray-700 dark:hover-text-white dark:hover:bg-fuchsia-800 transition"
                    href="/user"
                  >
                    Menage <Settings2 size={"1.25rem"} />
                  </Link>
                  <SignOut>
                    Sign out
                    <DoorOpen />
                  </SignOut>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <WalletListWrapper />
      </div>
    </div>
  );
}
