// SPDX-License-Identifier: MIT

pragma solidity >=0.8.13 <0.9.0;

import "@fhenixprotocol/contracts/FHE.sol";
import "@fhenixprotocol/contracts/access/PermissionedV2.sol";

contract Counter is PermissionedV2 {
  mapping(address => euint32) private userCounter;
  uint256 a;
  address public owner;

  constructor() PermissionedV2("COUNTER") {
    owner = msg.sender;
  }

  function add(inEuint32 calldata encryptedValue) public {
    euint32 value = FHE.asEuint32(encryptedValue);
    userCounter[msg.sender] = userCounter[msg.sender] + value;
  }

  function getUserCounter(address user) public view returns (uint256) {
    return FHE.decrypt(userCounter[user]);
  }

  function getUserCounterPermit(
    PermissionV2 memory permission
  ) public view withPermission(permission) returns (uint256) {
    // NOTE: Return data of `permission.issuer`, not `msg.sender`
    return FHE.decrypt(userCounter[permission.issuer]);
  }

  function getUserCounterPermitSealed(
    PermissionV2 memory permission
  ) public view withPermission(permission) returns (SealedUint memory) {
    // NOTE: Return data of `permission.issuer`, sealed with `permission.sealingKey` to be unsealed in client
    // NOTE: Uses `FHE.sealoutputTyped` to return a `SealedUint` instead of `string memory`
    return
      FHE.sealoutputTyped(
        userCounter[permission.issuer],
        permission.sealingKey
      );
  }

  function getSealedBool() public view returns (SealedBool memory test) {}
  function getSealedAddress() public view returns (SealedAddress memory test) {}
}
