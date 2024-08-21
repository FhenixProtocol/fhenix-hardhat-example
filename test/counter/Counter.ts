import { createPermitForContract } from "../../utils/instance";
import type { Signers } from "../types";
import { shouldBehaveLikeCounter } from "./Counter.behavior";
import { deployCounterFixture, getTokensFromFaucet } from "./Counter.fixture";
import hre from "hardhat";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    // get tokens from faucet if we're on localfhenix and don't have a balance
    await getTokensFromFaucet();
    // deploy test contract

    if (hre.network.name === "hardhat") {
      const mockOperations = await ethers.getContractFactory("MockFheOps");
      const mockOperationsDeployment = await mockOperations.deploy(); // we deploy a new contract to extract the bytecode further
      const mockOperationsCode = await hre.network.provider.send("eth_getCode", [mockOperationsDeployment.target]); // we take the new Bytecode
      // let result = await mockOperationsDeployment.decrypt("0x01", "0x01");
      // console.log("MockFheOps add result: ", result);
      await hre.network.provider.send("hardhat_setCode", ["0x0000000000000000000000000000000000000080", mockOperationsCode]);
    }

    const { counter, address } = await deployCounterFixture();
    this.counter = counter;

    // initiate fhenixjs
    this.permission = await createPermitForContract(hre, address);
    this.fhenixjs = hre.fhenixjs;

    // set admin account/signer
    const signers = await hre.ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("Counter", function () {
    shouldBehaveLikeCounter();
  });
});
