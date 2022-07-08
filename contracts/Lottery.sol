// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./MyToken.sol";

    // Rinkeby coordinator: 0x6168499c0cFfCaCD319c818142124B7A15E857ab
contract Lottery is VRFConsumerBaseV2(0x6168499c0cFfCaCD319c818142124B7A15E857ab) {
    VRFCoordinatorV2Interface constant COORDINATOR = 
    VRFCoordinatorV2Interface(0x6168499c0cFfCaCD319c818142124B7A15E857ab);
    address public admin;
    MyToken public token;
 constructor(MyToken _token) public{
     token = _token;
 }

    //------------------------------ Declare variable -------------------------------------

    // Your subscription ID.
     uint64 constant s_subscriptionId = 7370;

    // The gas lane to use, which specifies the maximum gas price to bump to.
    bytes32 constant keyHash = 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
    
    uint32 callbackGasLimit = 100000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // For this example, retrieve 2 random values in one request.
    // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
    uint32 numWords =  2;

    uint256[] public s_randomWords;
    uint256 public s_requestId;
    
    uint public lotteryId;

    struct ListNumberTicket{
        address payable [] groupPlayer;
    }
    mapping (uint => ListNumberTicket) internal groupTicket;

    struct Participants {
        address payable player;
        uint256 numTicket;
    }
    mapping(uint => Participants) internal allLottery;  

    uint internal playerCount = 0;
    uint256 prizePool;
    uint256 public luckyNumber;
    uint256 numTicketPlayer;
    uint256 public costTicket = 5 * (10**18);
    // MyToken public token;

    //--------------------------------------------------------------------------------------


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
    
    function getAmountPlayer() public view returns (uint){
        return playerCount;
    }

    function enter(uint256 numTicket) public payable {
        require(costTicket >= 5, "Not enough token");
        require(numTicket >= 0 && numTicket <= 10, "Number ticket out of range");
        token.setApproval(msg.sender, address(this), costTicket);
        token.transferFrom(msg.sender, address(this), costTicket);
        prizePool += msg.value;
        Participants storage newPlayer = allLottery[playerCount];
        newPlayer.player = payable(msg.sender);
        newPlayer.numTicket = numTicket;
        ListNumberTicket storage addTicket = groupTicket[newPlayer.numTicket];
        addTicket.groupPlayer.push(payable(msg.sender));
        increasePlayerCount();
    }

    function increasePlayerCount() internal {
        playerCount++;
    }

    //------------------------------------Get random number --------------------------------------

    // Assumes the subscription is funded sufficiently.
    function _requestRandomWords() external {
        // Will revert if subscription is not set and funded.
        require(playerCount != 0, "Amount player null");
        s_requestId = COORDINATOR.requestRandomWords(
        keyHash,
        s_subscriptionId,
        requestConfirmations,
        callbackGasLimit,
        numWords
        ) % playerCount ;
        luckyNumber = allLottery[s_requestId].numTicket;
        closeLottery();
        
    }

    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        s_randomWords = randomWords;
    }
   
    //------------------------------------- Claim reward ----------------------------------------

    function closeLottery() private {
        uint256 lenWinner = groupTicket[luckyNumber].groupPlayer.length;
        uint256 winnerPrize = prizePool / lenWinner;
        require(address(this).balance !=0, "prizePool is empty");
        require(lenWinner != 0, "No winner");
        for(uint256 i = 0; i < lenWinner; i++){
            _transferPrize(winnerPrize * (10**18), groupTicket[luckyNumber].groupPlayer[i]);
           
        }
        // _reset();
    }
    
    function _transferPrize(uint256 _winnerPrize, address payable winner) private{
        prizePool -= _winnerPrize;
        // winner.transfer(_winnerPrize);
        token.setApproval(address(this), winner, _winnerPrize);
        token.transfer(winner, _winnerPrize);
    }

    function getAmountWinner() public view returns(uint256){
        return groupTicket[luckyNumber].groupPlayer.length;
    }

    function getListWinner(uint256 index) public view returns(address){
        return groupTicket[luckyNumber].groupPlayer[index];
    }

    function getLuckyNumber() public view returns(uint256){
        return luckyNumber;
    }

    //------------------------------------- Reset lottery ------------------------------------

    function _reset() private{
        for(uint256 i = 0;i < playerCount; i++){
            delete allLottery[i];
        }
        playerCount = 0;
        luckyNumber = 0;
    }

    //------------------------------------------------------------------------------------------

   
}