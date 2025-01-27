import {QueryParams} from "@/app/services/api";

export type Service<T> = {
    getAll: (...args: any[]) => Promise<T[]>,
    add: (data: T, ...args: any[]) => Promise<void>,
    remove: (_id: string, ...args: any[]) => Promise<void>,
    patch: (data: T, ...args: any[]) => Promise<T>,
    put?: (data: T, ...args: any[]) => Promise<T>
}