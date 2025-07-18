import { createBaseService } from "@/services/baseService";
import { endpoints } from "@/services/endpoints";
import { Service } from "@/types/Service";
import { Income } from "../types/Income";

export const incomesService: Service<Income> = createBaseService<Income>(
  endpoints.income
);
