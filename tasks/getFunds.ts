import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:getFunds")
.addPositionalParam("address", "Wallet Address")  
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { fhenixjs } = hre;
    await fhenixjs.getFunds(taskArguments.address);
    console.log(`Done!`);
  });