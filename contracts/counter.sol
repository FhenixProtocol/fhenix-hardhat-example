// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity >=0.8.13 <0.9.0;

import "@fhenixprotocol/contracts/FHE.sol";

contract Counter {
    euint32 private counter;

    constructor() {
        counter = FHE.asEuint32(0);
    }

    function add(bytes calldata encryptedValue) public {
        euint32 value = FHE.asEuint32(encryptedValue);
        counter = FHE.add(counter, value);
    }

    function getCounter(bytes32 publicKey) public view returns (bytes memory) {
        return FHE.sealoutput(counter, publicKey);
    }
}