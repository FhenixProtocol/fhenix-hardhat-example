import { Counter } from "../types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:getCount").setAction(async function (
  _taskArguments: TaskArguments,
  hre,
) {
  const { fhenixjs, ethers, deployments } = hre;
  const [signer] = await ethers.getSigners();

  const Counter = await deployments.get("Counter");

  console.log(`Running getCount, targeting contract at: ${Counter.address}`);

  const contract = (await ethers.getContractAt(
    "Counter",
    Counter.address,
  )) as unknown as unknown as Counter;

  let permit = await fhenixjs.generatePermit(
    Counter.address,
    undefined, // use the internal provider
    signer,
  );

  const result = await contract.getCounterPermit(permit);
  console.log(`got count: ${result.toString()}`);

  const sealedResult = await contract.getCounterPermitSealed(permit);
  let unsealed = fhenixjs.unseal(Counter.address, sealedResult);

  console.log(`got unsealed result: ${unsealed.toString()}`);
});
