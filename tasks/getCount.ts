import { Counter } from "../typechain-types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:getCount").setAction(async function (
  _taskArguments: TaskArguments,
  hre,
) {
  const { fhenixsdk, ethers, deployments } = hre;
  const [signer] = await ethers.getSigners();

  await fhenixsdk.initializeWithHHSigner({ signer, projects: ["COUNTER"] });

  const Counter = await deployments.get("Counter");

  console.log(`Running getCount, targeting contract at: ${Counter.address}`);

  const contract = (await ethers.getContractAt(
    "Counter",
    Counter.address,
  )) as unknown as unknown as Counter;

  const sealed = await contract.getUserCounterPermitSealed(
    fhenixsdk.encrypt("permission" as const).data!,
  );

  const unsealed = await fhenixsdk.unseal(sealed);

  console.log(`got unsealed result: ${unsealed.data}`);
});
