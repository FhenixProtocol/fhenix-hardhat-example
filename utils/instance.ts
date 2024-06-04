import { HardhatRuntimeEnvironment } from "hardhat/types/runtime";

// // 
// import type { FhenixClient, Permission } from "fhenixjs";

// until we export the types properly from the plugin, or the types in a separate lib or something - it's annoying to import fhenix.js just for this, but you can 
// do that if typing what you need
export interface FheInstance {
  instance: any;
  //instance: FhenixClient;
  permission: any;
  //permission: Permission;
}

export async function createFheInstance(
  hre: HardhatRuntimeEnvironment,
  contractAddress: string,
): Promise<FheInstance> {
  const provider = hre.ethers.provider;
  const signer = await hre.ethers.getSigners();
  const instance = hre.fhenixjs;
  
  const permit = await instance.generatePermit(contractAddress, provider, signer[0]);
  const permission = instance.extractPermitPermission(permit);

  return Promise.all([instance, permission]).then(([instance, permission]) => ({
    instance,
    permission,
  }));
}
