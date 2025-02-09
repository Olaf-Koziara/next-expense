'use client';
import React from 'react';
import {useWallet} from '@/context/WalletContext';
import {Wallet} from '@/types/Wallet';
import {PlusCircleIcon, Wallet2} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import WalletForm from "@/app/(root)/(components)/WalletList/WalletForm";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

const WalletList = () => {
    const {wallets, selectedWallet, setSelectedWallet} = useWallet();

    const handleSelectWallet = (wallet: Wallet) => {
        setSelectedWallet(wallet);
    };


    return (

        <div className=''>


            <DropdownMenu modal={false}>
                <DropdownMenuTrigger>
                    <DropdownMenuLabel>
                        <Wallet2/>
                    </DropdownMenuLabel>
                </DropdownMenuTrigger>
                <DropdownMenuContent key='WalletListContent'>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <DropdownMenuLabel>Wallets</DropdownMenuLabel>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className='text-xs'>Select a wallet</div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <DropdownMenuSeparator/>
                    {wallets.map(wallet =>
                        <DropdownMenuItem key={wallet._id}
                                          className={selectedWallet?._id === wallet._id ? 'bg-gray-600' : ''}
                                          onClick={() => handleSelectWallet(wallet)}>{wallet.name}</DropdownMenuItem>)}
                    <DropdownMenuItem>
                        <Popover modal={true}>
                            <PopoverTrigger onClick={(e) => e.stopPropagation()} className='w-full'>Add
                                new <PlusCircleIcon
                                    className='inline'/></PopoverTrigger>
                            <PopoverContent onClick={(e) => e.stopPropagation()}><WalletForm/></PopoverContent>
                        </Popover>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </div>
    );
};

export default WalletList;