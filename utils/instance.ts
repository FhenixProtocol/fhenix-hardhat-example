import { FhenixClient, Permission, getPermit } from "fhenixjs";
import { HardhatRuntimeEnvironment } from "hardhat/types/runtime";

export interface FheInstance {
  instance: FhenixClient;
  permission: Permission;
}

export async function createFheInstance(
  hre: HardhatRuntimeEnvironment,
  contractAddress: string,
): Promise<FheInstance> {
  const provider = hre.ethers.provider;
  const instance = new FhenixClient({ provider });

  const permit = await getPermit(contractAddress, provider);

  instance.storePermit(permit);
  const permission = instance.extractPermitPermission(permit);

  return Promise.all([instance, permission]).then(([instance, permission]) => ({
    instance,
    permission,
  }));
}
