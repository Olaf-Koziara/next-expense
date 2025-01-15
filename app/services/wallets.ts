import {Wallet} from "@/types/Wallet";
import {api, BASE_URL} from "./api";
import {endpoints} from "@/app/services/endpoints";

const getAll = async (): Promise<Wallet[]> => {
    return await api.GET<Wallet[]>(BASE_URL + endpoints.wallet);
};

type AddWallet = Omit<Wallet, "_id">;
const add = async (wallet: AddWallet): Promise<Wallet> => {
    return await api.POST<AddWallet, Wallet>(BASE_URL + endpoints.wallet, wallet);
};

export const walletsService = {
    add,
    getAll,
};
