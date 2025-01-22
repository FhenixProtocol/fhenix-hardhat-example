import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "fhenix-hardhat-docker";
import "fhenix-hardhat-plugin";
import "fhenix-hardhat-network";

import "./tasks";

// If not set, it uses our default Alchemy API key.
// You can get your own at https://dashboard.alchemyapi.io
const providerApiKey =
  process.env.ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";

// If not set, it uses the Hardhat default account (index 0).
const deployerPrivateKey =
  process.env.DEPLOYER_PRIVATE_KEY ??
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

// If not set, it uses our default Etherscan API key.
const etherscanApiKey =
  process.env.ETHERSCAN_API_KEY || "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // Recommended Solidity optimizer settings
      },
    },
  },
  // The default network for deployments and interactions
  defaultNetwork: "localfhenix",
  namedAccounts: {
    deployer: {
      default: 0, // Uses the first Hardhat account as deployer
    },
  },
  networks: {
    // These are the pre-configured networks. 
    // If the one you need is missing, you can add it below.
    helium: {
      url: "https://api.testnet.fhenix.zone:7747",
      chainId: 42069,
      accounts: [deployerPrivateKey],
    },
    nitrogen: {
      url: "https://api.nitrogen.fhenix.zone",
      chainId: 8008148,
      accounts: [deployerPrivateKey],
    },
    localhost: {
      chainId: 31337,
    },
    hardhat: {
      chainId: 31337,
    },
  },
  // Configuration for hardhat-verify plugin
  etherscan: {
    apiKey: etherscanApiKey,
  },
  // Configuration for etherscan-verify from hardhat-deploy plugin
  verify: {
    etherscan: {
      apiKey: etherscanApiKey,
    },
  },
  sourcify: {
    enabled: false,
  },
};

export default config;
