import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("counter").setAction(async function (_taskArguments: TaskArguments, hre) {
  const { fhenix, ethers, deployments } = hre;
  const [signer] = await ethers.getSigners();

  await fhenix.getFunds(signer.address);

  const { deploy } = deployments;

  const deployResult = await deploy("Counter", {
    from: signer.address,
    args: [],
    log: true,
    skipIfAlreadyDeployed: false,
  });

  console.log("contract:", deployResult.address);

  const contract = await ethers.getContractAt("Counter", deployResult.address);

  const fhenixjs = await fhenix.fhenixjs;

  await contract.connect(signer).add(fhenixjs.encrypt_uint32(12));

  const sealedResult = contract.callStatic.counter(
    (await fhenixjs.fhePublicKey)?.serialize()
  );

  fhenixjs.unseal(deployResult.address, await sealedResult);
});
