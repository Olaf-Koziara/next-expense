'use client';
import React from 'react';
import {useWallet} from '@/context/WalletContext';
import {Wallet} from '@/types/Wallet';
import {PlusCircleIcon, Wallet2} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import WalletForm from "@/components/WalletList/WalletForm";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const WalletList = () => {
    const {wallets, selectedWallet, setSelectedWallet} = useWallet();

    const handleSelectWallet = (wallet: Wallet) => {
        setSelectedWallet(wallet);
    };


    return (

        <div className=''>


            <DropdownMenu modal={false}>
                <DropdownMenuTrigger> <Wallet2/></DropdownMenuTrigger>
                <DropdownMenuContent key={selectedWallet?._id}>
                    <DropdownMenuLabel>Wallets</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    {wallets.map(wallet =>
                        <DropdownMenuItem key={wallet._id}
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