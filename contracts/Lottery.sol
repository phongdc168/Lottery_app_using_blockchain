

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

contract Lottery {

    // Declare variable
    address public owner;
    uint public lotteryId;
    mapping (uint => address payable) public lotteryHistory;

    struct ListNumberTicket{
        address payable [] groupPlayer;
    }
    mapping (uint => ListNumberTicket) internal groupTicket;

    struct Participants {
        address payable player;
        uint numTicket;
    }
    mapping(uint => Participants) internal allLottery;  

    uint internal playerCount = 0;
    bytes32 internal keyHash; // identifies which Chainlink oracle to use
    uint internal fee;        // fee to get random number
    uint public randomResult;
    function getWinnerByLottery(uint lottery) public view returns (address payable) {
        return lotteryHistory[lottery];
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getPlayers(uint _index) public view returns (address payable, uint) {
        Participants storage participant = allLottery[_index];
        return(
            participant.player,
            participant.numTicket
        );
    }
    
    function getNumberPlayer() public view returns (uint){
        return playerCount;
    }
    function enter(uint _numTicket) public payable {
        require(msg.value > 2 wei, "Not enough token");
        require(_numTicket >= 1 && _numTicket <= 10, "Number ticket out of range");
        Participants storage newPlayer = allLottery[playerCount];
        newPlayer.player = payable(msg.sender);
        newPlayer.numTicket = _numTicket;
        ListNumberTicket storage addTicket = groupTicket[newPlayer.numTicket];
        addTicket.groupPlayer.push(payable(msg.sender));
        increasePlayerCount();
    }

    function getAmountTicket(uint index) public view returns (uint, address[] memory){
        address[] getListPlayer;
        for(uint i = 0; i < groupTicket[index].groupPlayer.length; i++){
            getListPlayer.push(groupTicket[index].groupPlayer[i]);
        }
        return (groupTicket[index].groupPlayer.length, getListPlayer);
    }
    // function getNumberTicket()
    // function payWinner() public {
    //     require(randomResult > 0, "Must have a source of randomness before choosing winner");
    //     uint index = randomResult % players.length;
    //     players[index].transfer(address(this).balance);

    //     lotteryHistory[lotteryId] = players[index];
    //     lotteryId++;
        
    //     // reset the state of the contract
    //     players = new address payable[](0);
    //     randomResult = 0;
    // }
    function increasePlayerCount() internal {
    playerCount++;
  }

    modifier onlyowner() {
      require(msg.sender == owner);
      _;
    }
}