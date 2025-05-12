import React, {useState} from 'react';
import {useWallet} from '@/context/WalletContext';
import {Button} from '@/components/ui/button';

type WalletFormProps = {
    onSuccess?: () => void;
}

const WalletForm = ({ onSuccess }: WalletFormProps) => {
    const {addWallet} = useWallet();
    const [walletName, setWalletName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (walletName.trim() === '') return;

        await addWallet({name: walletName});
        setWalletName('');
        onSuccess?.();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="walletName">Wallet Name</label>
                <input
                    type="text"
                    id="walletName"
                    value={walletName}
                    onChange={(e) => setWalletName(e.target.value)}
                    required
                />
            </div>
            <Button type="submit">Add Wallet</Button>
        </form>
    );
};

export default WalletForm;