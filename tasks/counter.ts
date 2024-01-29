import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("counter").setAction(async function (_taskArguments: TaskArguments, hre) {
  const { fhenix, ethers, deployments } = hre;
  const [signer] = await ethers.getSigners();

  if ((await ethers.provider.getBalance(signer.address)) === 0n) {
    await fhenix.getFunds(signer.address);
  }

  const { deploy } = deployments;

  const deployResult = await deploy("Counter", {
    from: signer.address,
    args: [],
    log: true,
    skipIfAlreadyDeployed: false,
  });

  console.log("contract:", deployResult.address);

  const contract = await ethers.getContractAt("Counter", deployResult.address);

  await contract.connect(signer).add(await fhenix.encrypt_uint32(12));

  const permit = await fhenix.generatePermit(deployResult.address);

  const sealedResult = await contract
    .connect(signer)
    .counter("0x" + permit.sealingKey.publicKey);

  const result = permit.sealingKey.unseal(sealedResult);

  console.log("result:", result);
});
