import { api } from "@/services/api";
import { endpoints } from "@/services/endpoints";

const remove = async () => {
  return api.DELETE(endpoints.user, {});
};

export const userService = { remove };
