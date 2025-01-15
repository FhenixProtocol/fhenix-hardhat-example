Fhenixjs MigrationGuide

#### CONTRACT

- Replace `fhenix-contracts:Permissioned.sol` with `fhenix-contracts:PermissionedV2.sol`.
- Inherit from `PermissionedV2`, add constructor `PermissionedV2("PROJECT_NAME")`
- Replace instances of `Permission memory permission` with `PermissionV2 memory permission`
- Replace `onlySender` modifier with `withPermission` modifier
- Replace `permission.publicKey` with `permission.sealingKey`
- IF returning user data : ONLY return data belonging to `permission.issuer`
- Use `SealedXXXX` structs:
  - Replace return type `string memory` with `SealedXXXX` structs. Use `SealedUint` for uints, `SealedBool` for bools, and `SealedAddress` for addresses.
  - Replace `FHE.sealoutput` with `FHE.sealoutputTyped`

#### HARDHAT TESTS
