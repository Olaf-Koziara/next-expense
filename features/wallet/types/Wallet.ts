import { z } from "zod";

export const WalletSchema = z.object({
  _id: z.string(),
  name: z.string(),
  balance: z.number(),
  currency: z.string().default("USD"),
});

export type Wallet = z.infer<typeof WalletSchema>;
