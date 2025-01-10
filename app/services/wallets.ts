import { Wallet } from "@/types/Wallet";
import { api, BASE_URL, enpoints } from "./api";

const getAll = async (): Promise<Wallet[]> => {
  return await api.get<Wallet[]>(BASE_URL + enpoints.wallet);
};

type AddWallet = Omit<Wallet, "_id">;
const add = async (wallet: AddWallet): Promise<Wallet> => {
  return await api.post<Wallet, AddWallet>(BASE_URL + enpoints.wallet, wallet);
};

export const walletsSercice = {
  add,
  getAll,
};
