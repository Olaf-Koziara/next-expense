import { useWallet } from "../context/WalletContext";

export function WalletInfo() {
  const { selectedWallet } = useWallet();
  if (!selectedWallet) return null;
  return (
    <div>
      <p className="text-center">{selectedWallet.name}</p>
    </div>
  );
}
