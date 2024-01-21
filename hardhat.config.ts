// Plugins
import "@nomicfoundation/hardhat-toolbox";
import "fhenix-hardhat-plugin";
import "hardhat-deploy";
import { HardhatUserConfig } from "hardhat/config";

// Tasks
import "./tasks/counter";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork: "localfhenix",
  networks: {
    // docker run --rm -it -p 8545:8547 -p 8548:8548 -p 3000:3000 --name localfhenix ghcr.io/fhenixprotocol/fhenix-node-dev:v0.0.9-standalone
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
};

export default config;
