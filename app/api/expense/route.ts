import { NextRequest } from "next/server";
import {
  handleTransactionPOST,
  handleTransactionGET,
  handleTransactionDELETE,
  handleTransactionPATCH,
  BaseRouteHandlerConfig,
} from "../baseRouteHandler";

const expenseConfig: BaseRouteHandlerConfig = {
  collectionField: "expenses",
  balanceUpdateField: "amount",
  balanceUpdateOperation: -1,
};

export const POST = (req: Request) => handleTransactionPOST(req, expenseConfig);
export const GET = (req: NextRequest) =>
  handleTransactionGET(req, expenseConfig);
export const DELETE = (req: Request) =>
  handleTransactionDELETE(req, expenseConfig);
export const PATCH = (req: Request) =>
  handleTransactionPATCH(req, expenseConfig);
