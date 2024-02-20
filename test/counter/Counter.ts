import { createFheInstance } from "../../utils/instance";
import type { Signers } from "../types";
import { shouldBehaveLikeCounter } from "./Counter.behavior";
import { deployCounterFixture, getTokensFromFaucet } from "./Counter.fixture";
import { expect } from "chai";
import hre from "hardhat";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    // get tokens from faucet if we're on localfhenix and don't have a balance
    await getTokensFromFaucet();
    // deploy test contract
    const { counter, address } = await deployCounterFixture();
    this.counter = counter;

    // initiate fhenixjs
    this.instance = await createFheInstance(hre, address);

    // set admin account/signer
    const signers = await hre.ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("Counter", function () {
    it("should add amount to the counter and verify the result", async function () {
      const amountToCount = 10;

      const eAmountCount = await this.instance.instance.encrypt_uint32(
        amountToCount,
      );
      await this.counter.add(eAmountCount);

      // await waitForBlock(hre);

      const eAmount = await this.counter
        .connect(this.signers.admin)
        .getCounterPermitSealed(this.instance.permission);
      const amount = this.instance.instance.unseal(
        await this.counter.getAddress(),
        eAmount,
      );
      console.log(amount);

      expect(amount).to.equal(amountToCount);
    });
  });
});
