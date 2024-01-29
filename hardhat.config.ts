// Plugins
import "@nomicfoundation/hardhat-toolbox";
import "fhenix-hardhat-plugin";
import "hardhat-deploy";
import { HardhatUserConfig } from "hardhat/config";

// Tasks
import "./tasks/counter";

const config: HardhatUserConfig = {
  defaultNetwork: "localfhenix",
  networks: {
    localfhenix: {
      url: "http://127.0.0.1:8545",
      accounts: {
        mnemonic:
          "demand hotel mass rally sphere tiger measure sick spoon evoke fashion comfort",
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      },
    },
  },
  solidity: {
    version: "0.8.19",
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/hardhat-template/issues/31
        bytecodeHash: "none",
      },
      // Disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: false,
        runs: 800,
      },
    },
  },
};

export default config;
