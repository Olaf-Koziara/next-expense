import {z} from "zod";

export const passwordChangeScheme = z.object({
    oldPassword: z.string(),
    newPassword: z.string()
})
export type PasswordChangeForm = z.infer<typeof passwordChangeScheme>;