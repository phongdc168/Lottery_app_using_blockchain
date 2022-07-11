// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "./MyToken.sol";
contract ERC20Upgrade {
    MyToken public token;
    function initialize(MyToken _token) external {
        token = _token;
    }
}