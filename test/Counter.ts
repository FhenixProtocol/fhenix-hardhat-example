/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect } from "chai";
import hre, { ethers, fhenixjs } from "hardhat";
import { Counter } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import {
  createPermissionForContract,
  getTokensFromFaucet,
} from "../utils/instance";

describe("Counter", function () {
  let signer: SignerWithAddress;

  let counter: Counter;
  let counterAddress: string;

  before(async () => {
    signer = (await ethers.getSigners())[0];
    await getTokensFromFaucet(hre, signer.address);

    const counterFactory = await ethers.getContractFactory("Counter");
    counter = await counterFactory.deploy();
    await counter.waitForDeployment();
    counterAddress = await counter.getAddress();
  });

  describe("Deployment", function () {
    it("Should have the correct initial count on deploy", async function () {
      const counterVal = await counter.getCounter();
      expect(await counter.getCounter()).to.equal(0n);
    });

    it("should add amount to the counter successfully", async function () {
      const toCount = 10;

      // Before sending the amount to count to the Counter contract
      // It must first be encrypted outside the contract (within this test / frontend)
      const encToCount = await fhenixjs.encrypt_uint32(toCount);

      // Add to the counter
      await counter.connect(signer).add(encToCount);

      const permission = await createPermissionForContract(
        hre,
        signer,
        counterAddress,
      );

      const sealedCountedAmount = await counter
        .connect(signer)
        .getCounterPermitSealed(permission);

      const unsealedCountedAmount = fhenixjs.unseal(
        counterAddress,
        sealedCountedAmount,
        signer.address,
      );

      expect(unsealedCountedAmount).to.equal(
        toCount,
        "The unsealed counted amount should increase by toCount",
      );

      // The Counter contract has a view function that decrypts the counter as a sanity check
      // This function leaks data, and should not be used in prod
      const decryptedCountedAmount = await counter.getCounter();
      expect(decryptedCountedAmount).to.equal(
        toCount,
        "The decrypted counted amount should increase by toCount",
      );
    });
  });
});
