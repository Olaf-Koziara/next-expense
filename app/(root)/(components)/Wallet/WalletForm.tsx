import { WalletForm } from "@/components/WalletForm";

type WalletFormProps = {
  onSuccess?: () => void;
};

const WalletFormComponent = ({ onSuccess }: WalletFormProps) => {
  return <WalletForm onSuccess={onSuccess} />;
};

export default WalletFormComponent;
