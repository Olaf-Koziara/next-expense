import { Wallet } from "@/features/wallet/types/Wallet";
import { api, BASE_URL } from "@/services/api";
import { endpoints } from "@/services/endpoints";

const getAll = async (): Promise<Wallet[]> => {
  return await api.GET<Wallet[]>(BASE_URL + endpoints.wallet);
};

type AddWallet = Omit<Wallet, "_id" | "balance">;
const add = async (wallet: AddWallet): Promise<void> => {
  return api.POST<AddWallet>(BASE_URL + endpoints.wallet, wallet);
};

const remove = async (walletId: string): Promise<Wallet> => {
  return await api.DELETE<{ _id: string }>(
    BASE_URL + endpoints.wallet + `/${walletId}`,
    { _id: walletId }
  );
};

type UpdateWallet = Partial<Omit<Wallet, "_id">>;
const patch = async (walletId: string, data: UpdateWallet): Promise<Wallet> => {
  return api.PATCH<Wallet>(BASE_URL + endpoints.wallet, {
    _id: walletId,
    ...data,
  });
};

export const walletsService = {
  add,
  getAll,
  remove,
  patch,
};
