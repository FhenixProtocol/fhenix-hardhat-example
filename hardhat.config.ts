// Plugins
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-fhenix";
import "hardhat-fhenix-docker";
import "hardhat-deploy";
import { HardhatUserConfig } from "hardhat/config";

// Tasks
import "./tasks";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  defaultNetwork: "localfhenix",
};

export default config;
