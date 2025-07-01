"use client";

import { memo } from "react";
import { WalletList } from "./WalletList";

function WalletListWrapper() {
  return <WalletList />;
}

export const MemoizedWalletListWrapper = memo(WalletListWrapper);
export { WalletListWrapper };
