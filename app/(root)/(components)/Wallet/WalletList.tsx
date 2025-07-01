"use client";
import React, { useCallback, memo, useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { Wallet } from "@/types/Wallet";
import { PlusCircleIcon, Wallet2, Settings2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { WalletForm } from "./WalletForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WalletInfo } from "@/app/(root)/(components)/Wallet/WalletInfo";
import Link from "next/link";

function WalletList() {
  const { wallets, selectedWallet, setSelectedWallet } = useWallet();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleSelectWallet = useCallback(
    (wallet: Wallet) => {
      setSelectedWallet(wallet);
    },
    [setSelectedWallet]
  );

  const handleAddWallet = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopoverOpen(true);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="w-full bg-blue-950 rounded-md hover:bg-gray-700">
          <DropdownMenuLabel className="mx-auto w-full flex flex-col items-center">
            <Wallet2 />
            <WalletInfo />
          </DropdownMenuLabel>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <DropdownMenuLabel>Wallets</DropdownMenuLabel>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">Select a wallet</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenuSeparator />
          {wallets.length > 0 ? (
            wallets.map((wallet) => (
              <DropdownMenuItem
                key={wallet._id}
                className={
                  selectedWallet?._id === wallet._id ? "bg-gray-600" : ""
                }
                onClick={() => handleSelectWallet(wallet)}
              >
                {wallet.name}
              </DropdownMenuItem>
            ))
          ) : (
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger
                onClick={handleAddWallet}
                className="w-full bg-blue-950 rounded-md hover:bg-gray-700 p-2 flex items-center justify-center gap-2"
              >
                Add new <PlusCircleIcon className="inline" />
              </PopoverTrigger>
              <PopoverContent>
                <WalletForm onSuccess={() => setIsPopoverOpen(false)} />
              </PopoverContent>
            </Popover>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link
              href="/wallet-management"
              className="flex items-center gap-2 w-full"
            >
              <Settings2 className="h-4 w-4" />
              <span>Manage Wallets</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export const MemoizedWalletList = memo(WalletList);
export { WalletList };
