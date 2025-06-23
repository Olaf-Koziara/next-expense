import { Income } from "@/types/Income";
import { endpoints } from "@/app/services/endpoints";
import { Service } from "@/types/Service";
import { createBaseService } from "./baseService";

export const incomesService: Service<Income> = createBaseService<Income>(
  endpoints.income
);
