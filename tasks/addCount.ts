import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import {Counter} from "../typechain-types";

task("task:addCount")
    .addParam("amount", "Amount to add to the counter (plaintext number)", "1")
    .setAction(async function (taskArguments: TaskArguments, hre) {
  const { fhenixjs, ethers, deployments } = hre;
  const [signer] = await ethers.getSigners();
  const fhenixClient = fhenixjs.client;

  const amountToAdd = Number(taskArguments.amount);
  const Counter = await deployments.get("Counter");

  console.log(`Running addCount, targeting contract at: ${Counter.address}`);

  const contract = await ethers.getContractAt("Counter", Counter.address);

  let x = await fhenixClient.encrypt_uint32(amountToAdd);

  let contractWithSigner = contract.connect(signer) as Counter;

  try {
    let result = await contractWithSigner.add(x.data);
  } catch (e) {
    console.log(`Failed to send add transaction: ${e}`);
    return;
  }

});

