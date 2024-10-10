import { Counter } from "../typechain-types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import {Deployment} from "hardhat-deploy/dist/types";

task("task:addCount")
  .addParam("amount", "Amount to add to the counter (plaintext number)", "1")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { fhenixjs, ethers, deployments } = hre;
    const [signer] = await ethers.getSigners();

    if ((await ethers.provider.getBalance(signer.address)).toString() === "0") {
      await fhenixjs.getFunds(signer.address);
    }

    const amountToAdd = Number(taskArguments.amount);
    let Counter: Deployment;
    try {
      Counter = await deployments.get("Counter");
    } catch (e) {
      console.log(`${e}`);
      if (hre.network.name === "hardhat") {
        console.log("You're running on Hardhat network, which is ephemeral. Contracts you deployed with deploy scripts are not available.")
        console.log("Either run the local node with npx hardhat node and use --localhost on tasks, or write tasks that deploy the contracts themselves")
      }
      return;
    }

    console.log(
      `Running addCount(${amountToAdd}), targeting contract at: ${Counter.address}`,
    );

    const contract = await ethers.getContractAt("Counter", Counter.address);

    const encryptedAmount = await fhenixjs.encrypt_uint32(amountToAdd);

    let contractWithSigner = contract.connect(signer) as unknown as Counter;

    try {
      await contractWithSigner.add(encryptedAmount);
    } catch (e) {
      console.log(`Failed to send add transaction: ${e}`);
      return;
    }
  });
