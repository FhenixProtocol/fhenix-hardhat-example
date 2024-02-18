// Plugins
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import "fhenix-hardhat-plugin";
import "fhenix-hardhat-docker";
import "hardhat-deploy";
import { HardhatUserConfig } from "hardhat/config";

const keys = process.env.WALLET;

if (!keys) {
  throw new Error("Please set your MNEMONIC in a .env file");
}
const accounts: string[] = [keys];

// Tasks
import "./tasks";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  // Optional: defaultNetwork is already being set to "localfhenix" by fhenix-hardhat-plugin
  defaultNetwork: "localfhenix",
  networks: {
    testnet: {
      accounts,
      chainId: 412346,
      url: "https://test01.fhenix.zone/evm",
    },
  },
  typechain: {
    outDir: "types",
    target: "ethers-v6",
  },
};

export default config;
