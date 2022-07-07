// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "./utils/Context.sol";
import "./extensions/ERC20.sol";

contract LNPToken is Context, ERC20 {

    constructor () ERC20("LNPToken", "LNP") {
        _mint(_msgSender(), 10000 * (10 ** 18));
    }

    function setApproval(address owner, address spender, uint256 amount) external {
        _approve(owner, spender, amount);
    }
}