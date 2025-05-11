'use client';
import React, { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Trash2, Settings2, Plus } from 'lucide-react';
import { CurrencySelect } from '@/app/(root)/(components)/Currency/CurrencySelect';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WalletManagementPage = () => {
    const { wallets, removeWallet, updateWallet, createWallet } = useWallet();
    const [newWalletName, setNewWalletName] = useState('');
    const [newWalletCurrency, setNewWalletCurrency] = useState('USD');

    const handleCurrencyChange = async (walletId: string, currency: string) => {
        await updateWallet(walletId, { currency: currency });
    };

    const handleRemoveWallet = async (walletId: string) => {
        if (confirm('Are you sure you want to remove this wallet? This action cannot be undone.')) {
            await removeWallet(walletId);
        }
    };

    const handleAddWallet = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWalletName.trim()) return;
        
        await createWallet({
            name: newWalletName,
            currency: newWalletCurrency,
            balance: 0
        });
        setNewWalletName('');
        setNewWalletCurrency('USD');
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Wallet Management</h1>
            
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="new-wallet">
                    <AccordionTrigger className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            <span>Add New Wallet</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <Card className="mb-6">
                            <CardContent className="pt-6">
                                <form onSubmit={handleAddWallet} className="flex items-end gap-4">
                                    <div className="flex-1">
                                        <label htmlFor="walletName" className="text-sm font-medium mb-1 block">
                                            Wallet Name
                                        </label>
                                        <Input
                                            id="walletName"
                                            value={newWalletName}
                                            onChange={(e) => setNewWalletName(e.target.value)}
                                            placeholder="Enter wallet name"
                                            required
                                        />
                                    </div>
                                    <div className="w-[180px]">
                                        <label className="text-sm font-medium mb-1 block">
                                          Currency
                                        </label>
                                        <CurrencySelect
                                            value={newWalletCurrency}
                                            onValueChange={setNewWalletCurrency}
                                            className="w-full"
                                        />
                                    </div>
                                    <Button type="submit" className="h-10">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Wallet
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Your Wallets</h2>
                <Accordion type='multiple' className='w-full bg-muted/50 rounded-lg px-4'>
                    {wallets.map((wallet) => (
                        <AccordionItem key={wallet._id} value={wallet._id} className="border-none">
                            <AccordionTrigger className="flex items-center justify-between hover:no-underline">
                                <div className="flex items-center gap-2">
                                    <Settings2 className="h-4 w-4" />
                                    <span>{wallet.name}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        <span>Currency:</span>
                                        <CurrencySelect
                                            value={wallet.currency || 'USD'}
                                            onValueChange={(value) => handleCurrencyChange(wallet._id, value)}
                                            className="w-[180px]"
                                        />
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleRemoveWallet(wallet._id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
};

export default WalletManagementPage; 