import {api} from "@/app/services/api";
import {Category} from "@/types/Category";
import {endpoints} from "@/app/services/endpoints";

const getAll = async () => {
    return api.GET<Category[]>(endpoints.expenseCategory)
}
const add = async (category: Category) => {
    return api.POST<Category, void>(endpoints.expenseCategory, category)
}
const deleteOne = async (_id: string) => {
    return api.DELETE<{ _id: string }, void>(endpoints.expenseCategory, {_id})
}
export const expenseCategoriesService = {
    getAll, add, deleteOne
}