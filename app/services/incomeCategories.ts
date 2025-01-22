import {api} from "@/app/services/api";
import {Category} from "@/types/Category";
import {endpoints} from "@/app/services/endpoints";

const getAll = async () => {
    return api.GET<Category[]>(endpoints.incomeCategory)
}
const add = async (category: Category) => {
    return api.POST<Category>(endpoints.incomeCategory, category)
}
const deleteOne = async (_id: string) => {
    return api.DELETE<{ _id: string }>(endpoints.incomeCategory, {_id})
}
export const incomeCategoriesService = {
    getAll, add, deleteOne
}
