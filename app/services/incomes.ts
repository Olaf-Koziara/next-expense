import {api, QueryParams} from "@/app/services/api";
import {Income} from "@/types/Income";
import {endpoints} from "@/app/services/endpoints";
import {ResponseWithArray, Service} from "@/types/Service";

const getAll = async (params: QueryParams, walletId: string): Promise<ResponseWithArray<Income>> => {

    return api.GET<ResponseWithArray<Income>>(endpoints.income, {walletId, ...params})
}
type AddIncomeData = {
    selectedWalletId: string,
} & Income;
const add = async (income: Income, walletId: string) => {
    return api.POST<AddIncomeData>(endpoints.income, {selectedWalletId: walletId, ...income})
}
const remove = async (walletId: string, _id: string) => {
    return api.DELETE<{ walletId: string, _id: string }>(endpoints.income, {walletId: walletId, _id})
}
const patch = async (data: Partial<Income>, parentId: string): Promise<Income> => {
    return api.PATCH<Income>(endpoints.income, {...data, walletId: parentId});
};

const put = async (data: Income, parentId: string): Promise<Income> => {
    return api.PUT<Income>(endpoints.income, {...data});
};
export const incomesService: Service<Income> = {
    getAll, add, remove, patch, put
}
