// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import "hardhat/console.sol";

contract MockFheOps {
    /*
    FheUint8 = 0
    FheUint16 = 1
    FheUint32 = 2
    FheUint64 = 3
    FheUint128 = 4
    FheUint256 = 5
    FheInt8 = 6
    FheInt16 = 7
    FheInt32 = 8
    FheInt64 = 9
    FheInt128 = 10
    FheInt256 = 11
    FheAddress = 12
    FheBool = 13
    */

    function maxValue(uint8 utype) public pure returns (uint256) {
        uint256 result = 0;
        if (utype == 0) {
            result = uint256(type(uint8).max) + 1;
        } else if (utype == 1) {
            result = uint256(type(uint16).max) + 1;
        } else if (utype == 2) {
            result = uint256(type(uint32).max) + 1;
        } else if (utype == 3) {
            result = uint256(type(uint64).max) + 1;
        } else if (utype == 4) {
            result = uint256(type(uint128).max) + 1;
        } else if (utype == 5) {
            result = 1;
        } else if (utype > 5 && utype < 12) {
            revert("Unsupported type");
        } else if (utype == 12) {
            result = uint256(type(uint160).max) + 1; //address
        } else if (utype == 13) {
            result = 1; //bool (we want anything non-zero to be false)
        } else {
            revert("Unsupported type");
        }

        return result;
    }



    function bytes32ToBytes(bytes32 input, uint8 utype) internal pure returns (bytes memory) {
        // console.log("bytes32To", uint256(input));
        return abi.encodePacked(input);
//        uint256 length;
//        if (utype == 0) length = 1; // uint8
//        else if (utype == 1) length = 2; // uint16
//        else if (utype == 2) length = 4; // uint32
//        else if (utype == 3) length = 8; // uint64
//        else if (utype == 4) length = 16; // uint128
//        else if (utype == 5) length = 32; // uint256
//        else if (utype == 12) length = 20; // uint160
//        else if (utype == 13) length = 1; // bool (uint8)
//        else revert("Unsupported type");
//
//        bytes memory result = new bytes(length);
//
//        // Copy the relevant bytes from bytes32 to the result
//        for (uint256 i = 0; i < length; i++) {
//            result[length - i - 1] = input[i];
//        }
//
//        return result;
    }

    //For converting back to bytes
    function uint256ToBytes(uint256 value) public pure returns (bytes memory) {
        bytes memory result = new bytes(32);

        assembly {
            mstore(add(result, 32), value)
        }

        return result;
    }

    function boolToBytes(bool value) public pure returns (bytes memory) {
        bytes memory result = new bytes(1);

        if (value) {
            result[0] = 0x01;
        } else {
            result[0] = 0x00;
        }

        return result;
    }

    //for unknown size of bytes - we could instead just encode it as bytes32 because it's always uint256 but for now lets keep it like this
    function bytesToUint(bytes memory b) internal pure virtual returns (uint256) {
        require(b.length <= 32, "Bytes length exceeds 32.");
        uint256 result = abi.decode(abi.encodePacked(new bytes(32 - b.length), b), (uint256));
//        console.log("bytesToUint", result);
        return result;
    }

    function bytesToBool(bytes memory b) internal pure virtual returns (bool) {
        require(b.length <= 32, "Bytes length exceeds 32.");
        uint8 value = uint8(b[0]);
        return value != 0;
    }

    function trivialEncrypt(bytes memory input, uint8 toType, int32) external pure returns (bytes memory) {
//        bytes32 result = bytes32(input);
//        return bytes32ToBytes(result, toType);
        return input;
    }

    function add(uint8 utype, bytes memory lhsHash, bytes memory rhsHash) external pure returns (bytes memory) {
        uint256 result = (bytesToUint(lhsHash) + bytesToUint(rhsHash)) % maxValue(utype);
        return uint256ToBytes(result);
    }

    function sealOutput(uint8, bytes memory ctHash, bytes memory) external pure returns (string memory) {
        string memory test = uint2str(bytesToUint(ctHash));
//        console.log("sealOutput", test);
        return test;
    }

    function verify(uint8, bytes memory input, int32) external pure returns (bytes memory) {
//        console.log("verify", bytesToUint(input));
        return input;
    }

    function cast(uint8, bytes memory input, uint8 toType) external pure returns (bytes memory) {
//        console.log("cast", bytesToUint(input));
        bytes32 result = bytes32(input);
        return bytes32ToBytes(result, toType);
    }

    function log(string memory s) external pure {
        console.log(s);
    }

    function decrypt(uint8, bytes memory input) external pure returns (uint256) {
        uint256 result = bytesToUint(input);
//        console.log("decrypt", result);
        return result;
    }

    function lte(uint8 utype, bytes memory lhsHash, bytes memory rhsHash) external pure returns (bytes memory)    {
        bool result = (bytesToUint(lhsHash) % maxValue(utype)) <= (bytesToUint(rhsHash) % maxValue(utype));
        return boolToBytes(result);
    }

    function sub(uint8 utype, bytes memory lhsHash, bytes memory rhsHash) external pure returns (bytes memory)    {
        uint256 result = (bytesToUint(lhsHash) - bytesToUint(rhsHash)) % maxValue(utype);
        return uint256ToBytes(result);
    }

    function mul(uint8 utype, bytes memory lhsHash, bytes memory rhsHash) external pure returns (bytes memory)    {
        uint256 result = (bytesToUint(lhsHash) * bytesToUint(rhsHash)) % maxValue(utype);
        return uint256ToBytes(result);
    }

    function lt(uint8 utype, bytes memory lhsHash, bytes memory rhsHash) external pure returns (bytes memory)    {
        bool result = (bytesToUint(lhsHash) % maxValue(utype)) < (bytesToUint(rhsHash) % maxValue(utype));
        return boolToBytes(result);
    }

    function select(uint8, bytes memory controlHash, bytes memory ifTrueHash, bytes memory ifFalseHash) external pure returns (bytes memory)    {
        bool control = bytesToBool(controlHash);
        if (control) return ifTrueHash;
        return ifFalseHash;
    }

    function req(uint8, bytes memory input) external pure returns (bytes memory)    {
        return input;
    }

    function div(uint8 utype, bytes memory lhsHash, bytes memory rhsHash) external pure returns (bytes memory)    {
        uint256 result = (bytesToUint(lhsHash) / bytesToUint(rhsHash)) % maxValue(utype);
        return uint256ToBytes(result);
    }

    function gt(uint8 utype, bytes memory lhsHash, bytes memory rhsHash) external pure returns (bytes memory)    {
        bool result = (bytesToUint(lhsHash) % maxValue(utype)) > (bytesToUint(rhsHash) % maxValue(utype));
        return boolToBytes(result);
    }

    function gte(uint8 utype, bytes memory lhsHash, bytes memory rhsHash) external pure returns (bytes memory)    {
        bool result = (bytesToUint(lhsHash) % maxValue(utype)) >= (bytesToUint(rhsHash) % maxValue(utype));
        return boolToBytes(result);
    }

    function rem(uint8 utype, bytes memory lhsHash, bytes memory rhsHash) external pure returns (bytes memory)    {
        uint256 result = (bytesToUint(lhsHash) % bytesToUint(rhsHash)) % maxValue(utype);
        return uint256ToBytes(result);
    }

    function and(uint8 utype, bytes memory lhsHash, bytes memory rhsHash) external pure returns (bytes memory)    {
        bytes32 result = bytes32(lhsHash) & bytes32(rhsHash);
        return bytes32ToBytes(result, utype);
    }

    function or(uint8 utype, bytes memory lhsHash, bytes memory rhsHash) external pure returns (bytes memory)    {
        bytes32 result = bytes32(lhsHash) | bytes32(rhsHash);
        return bytes32ToBytes(result, utype);
    }

    function xor(uint8 utype, bytes memory lhsHash, bytes memory rhsHash) external pure returns (bytes memory)    {
        bytes32 result = bytes32(lhsHash) ^ bytes32(rhsHash);
        return bytes32ToBytes(result, utype);
    }

    function eq(uint8 utype, bytes memory lhsHash, bytes memory rhsHash) external pure returns (bytes memory)    {
        bool result = (bytesToUint(lhsHash) % maxValue(utype)) == (bytesToUint(rhsHash) % maxValue(utype));
        return boolToBytes(result);
    }

    function ne(uint8 utype, bytes memory lhsHash, bytes memory rhsHash) external pure returns (bytes memory)    {
        bool result = (bytesToUint(lhsHash) % maxValue(utype)) != (bytesToUint(rhsHash) % maxValue(utype));
        return boolToBytes(result);
    }

    function min(uint8 utype, bytes memory lhsHash, bytes memory rhsHash) external pure returns (bytes memory)    {
        bool result = (bytesToUint(lhsHash) % maxValue(utype)) >= (bytesToUint(rhsHash) % maxValue(utype));
        if (result == true) {
            return rhsHash;
        }
        return lhsHash;
    }

    function max(uint8 utype, bytes memory lhsHash, bytes memory rhsHash) external pure returns (bytes memory)    {
        bool result = (bytesToUint(lhsHash) % maxValue(utype)) >= (bytesToUint(rhsHash) % maxValue(utype));
        if (result == true) {
            return lhsHash;
        }
        return rhsHash;
    }

    function shl(uint8, bytes memory lhsHash, bytes memory rhsHash) external pure returns (bytes memory)    {
        uint256 lhs = bytesToUint(lhsHash);
        uint256 rhs = bytesToUint(rhsHash);

        uint256 result = lhs << rhs;

        return uint256ToBytes(result);
    }

    function shr(uint8, bytes memory lhsHash, bytes memory rhsHash) external pure returns (bytes memory)    {
        uint256 lhs = bytesToUint(lhsHash);
        uint256 rhs = bytesToUint(rhsHash);

        uint256 result = lhs >> rhs;

        return uint256ToBytes(result);
    }

    function not(uint8 utype, bytes memory value) external pure returns (bytes memory)    {
        bytes32 result = ~bytes32(value);
        return bytes32ToBytes(result, utype);
    }

    function getNetworkPublicKey(int32) external pure returns (bytes memory)    {
        string memory x = "((-(-_(-_-)_-)-)) You've stepped into the wrong neighborhood pal.";
        return bytes(x);
    }

    function random(uint8 utype, uint64, int32) external pure returns (bytes memory) {
        return uint256ToBytes(maxValue(utype));
    }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}
