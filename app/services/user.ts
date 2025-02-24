import {api} from "@/app/services/api";
import {endpoints} from "@/app/services/endpoints";


const remove = async () => {
    return api.DELETE(endpoints.user, {})
}

export const userService = {remove};