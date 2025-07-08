import {z} from "zod";

export type Category = z.infer<typeof CategorySchema>

export const CategorySchema = z.object({
    _id: z.string(),
    createdAt: z.string(),
    name: z.string(),
})
export const CategoryArraySchema = z.array(CategorySchema)