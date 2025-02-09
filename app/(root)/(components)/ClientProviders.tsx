'use client';
import React from "react";
import {SessionProvider} from "next-auth/react";
import {WalletProvider} from "@/context/WalletContext";

const ClientProviders = ({children}: { children: React.ReactNode }) => {
    return (
        <SessionProvider>
            <WalletProvider>

                {children}

            </WalletProvider>
        </SessionProvider>
    );
};

export default ClientProviders;
