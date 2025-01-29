import {Expense, ExpenseWithWalletId} from "@/types/Expense";
import {api, QueryParams} from "@/app/services/api";
import {endpoints} from "@/app/services/endpoints";
import {Service} from "@/types/Service";

const getAll = async (params: QueryParams, walletId: string): Promise<Expense[]> => {

    return api.GET<Expense[]>(endpoints.expense, {walletId, ...params});

};

const add = async (data: Expense, walletId: string): Promise<void> => {

    return api.POST<ExpenseWithWalletId>(endpoints.expense, {walletId, ...data});
};

const remove = async (_id: string, walletId: string): Promise<void> => {

    return api.DELETE<{ walletId: string; _id: string }>(endpoints.expense, {
        walletId,
        _id,
    });
};

const patch = async (data: Partial<Expense>, walletId: string): Promise<Expense> => {

    return api.PATCH<Expense>(endpoints.expense, {...data, walletId});
};

const put = async (data: Expense, walletId: string): Promise<Expense> => {

    return api.PUT<Expense>(endpoints.expense, {...data});
};

export const expensesService: Service<Expense> = {
    getAll,
    add,
    remove,
    patch,
    put,
};
