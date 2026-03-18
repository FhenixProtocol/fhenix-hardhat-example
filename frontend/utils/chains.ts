import { Chain } from "viem";

export const fhenixHelium: Chain = {
  id: 8008135,
  name: "Fhenix Helium",
  nativeCurrency: {
    decimals: 18,
    name: "tFHE",
    symbol: "tFHE",
  },
  rpcUrls: {
    default: {
      http: ["https://api.helium.fhenix.zone"],
    },
    public: {
      http: ["https://api.helium.fhenix.zone"],
    },
  },
  blockExplorers: {
    default: {
      name: "Fhenix Helium Explorer",
      url: "https://explorer.helium.fhenix.zone",
    },
  },
  testnet: true,
};

