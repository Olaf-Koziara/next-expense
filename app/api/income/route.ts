import { NextRequest } from "next/server";
import {
  handleTransactionPOST,
  handleTransactionGET,
  handleTransactionDELETE,
  handleTransactionPATCH,
  BaseRouteHandlerConfig,
} from "../baseRouteHandler";

const incomeConfig: BaseRouteHandlerConfig = {
  collectionField: "incomes",
  balanceUpdateField: "amount",
  balanceUpdateOperation: 1,
};

export const POST = (req: Request) => handleTransactionPOST(req, incomeConfig);
export const GET = (req: NextRequest) =>
  handleTransactionGET(req, incomeConfig);
export const DELETE = (req: Request) =>
  handleTransactionDELETE(req, incomeConfig);
export const PATCH = (req: Request) =>
  handleTransactionPATCH(req, incomeConfig);
