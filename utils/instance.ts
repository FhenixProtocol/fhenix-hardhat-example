import { HardhatRuntimeEnvironment } from "hardhat/types/runtime";

export async function createPermitForContract(
  hre: HardhatRuntimeEnvironment,
  contractAddress: string,
): Promise<any> {
  const provider = hre.ethers.provider;
  const signer = await hre.ethers.getSigners();
  const fhenixjs = hre.fhenixjs;

  const permit = await fhenixjs.generatePermit(contractAddress, provider, signer[0]);
  return fhenixjs.extractPermitPermission(permit);
}
