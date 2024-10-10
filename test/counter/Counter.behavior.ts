import { expect, assert } from "chai";
import hre from "hardhat";

export function shouldBehaveLikeCounter(): void {
  it("should add amount to the counter and verify the result", async function () {
    const amountToCount = 10;

    const eAmountCount = await this.fhenixjs.encrypt_uint32(
      amountToCount,
    );

    // console.log(`eAmountCount: ${JSON.stringify(eAmountCount)}`);

    // test initial value
    let counterValue = await this.counter.getCounter();
    expect(Number(counterValue)).to.be.equal(0);

    // add amount to the counter
    await this.counter.connect(this.signers.admin).add(eAmountCount);

    // verify the result
    counterValue = await this.counter.getCounter();
    expect(Number(counterValue)).to.be.equal(amountToCount);

    //
    // console.log(`permit: ${JSON.stringify(this.permission)}`);
    //
    const eAmount = await this.counter
      .connect(this.signers.admin)
      .getCounterPermitSealed(this.permission);
    const amount = this.fhenixjs.unseal(
      await this.counter.getAddress(),
      eAmount,
    );

    expect(Number(amount)).to.be.equal(amountToCount);
  });
}
