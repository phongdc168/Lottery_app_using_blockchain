// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.11;
contract LotteryUpgradable{
     uint256 public startAt;
    uint256 public endAt;
    uint256 public costTicket;
    address public callee;
    constructor (address _callee) public {
        callee = _callee;
    }

    function delegateCallStartAt(uint256 _startAt) external{
        (bool success,) = callee.call(abi.encodeWithSignature("setStartAt(uint256)", _startAt));
        require(success, "Delegate call failed");
    }
        function delegateCallEndAt(uint256 _endAt) external{
        (bool success,) = callee.call(abi.encodeWithSignature("setEndAt(uint256)",_endAt));
        require(success, "Delegate call failed");
    }
        function delegateCallCostTicket(uint256 _costTicket) external{
        (bool success,) = callee.call(abi.encodeWithSignature("setCostTicket(uint256)", _costTicket * (10**18)));
        require(success, "Delegate call failed");
    }
 
}
