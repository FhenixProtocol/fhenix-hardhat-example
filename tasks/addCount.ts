import { Counter } from "../types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:addCount")
  .addParam("amount", "Amount to add to the counter (plaintext number)", "1")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { fhenixjs, ethers, deployments } = hre;
    const [signer] = await ethers.getSigners();

    if ((await ethers.provider.getBalance(signer.address)).toString() === "0") {
      await fhenixjs.getFunds(signer.address);
    }

    const amountToAdd = Number(taskArguments.amount);
    const Counter = await deployments.get("Counter");

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
