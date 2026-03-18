"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Counter Dapp Application",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "367e7033f1d106ae8bdbbd60e7c478a9",
  chains: [sepolia],
  ssr: true,
});
