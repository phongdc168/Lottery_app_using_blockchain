// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

    // Rinkeby coordinator: 0x6168499c0cFfCaCD319c818142124B7A15E857ab
contract Lottery is VRFConsumerBaseV2(0x6168499c0cFfCaCD319c818142124B7A15E857ab) {
    VRFCoordinatorV2Interface constant COORDINATOR = 
    VRFCoordinatorV2Interface(0x6168499c0cFfCaCD319c818142124B7A15E857ab);

    //------------------------------ Declare variable -------------------------------

    // Your subscription ID.
     uint64 constant s_subscriptionId = 7130;

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
    address s_owner = msg.sender;
    
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
    uint256 prizePool;

    //--------------------------------------------------------------------------------

    function getWinnerByLottery(uint lottery) public view returns (address payable) {
        return lotteryHistory[lottery];
    }

    function getBalance() public view returns (uint) {
        return prizePool;
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
    function enter(uint _numTicket) public payable {
        require(msg.value > 2 wei, "Not enough token");
        prizePool += msg.value;
        require(_numTicket >= 1 && _numTicket <= 10, "Number ticket out of range");
        Participants storage newPlayer = allLottery[playerCount];
        newPlayer.player = payable(msg.sender);
        newPlayer.numTicket = _numTicket;
        ListNumberTicket storage addTicket = groupTicket[newPlayer.numTicket];
        addTicket.groupPlayer.push(payable(msg.sender));
        increasePlayerCount();
    }

         function increasePlayerCount() internal {
        playerCount++;
    }
    //-------------------------- Get random number ---------------------------------------------

    // Assumes the subscription is funded sufficiently.
    function requestRandomWords() external onlyOwner {
        // Will revert if subscription is not set and funded.
        s_requestId = COORDINATOR.requestRandomWords(
        keyHash,
        s_subscriptionId,
        requestConfirmations,
        callbackGasLimit,
        numWords
        ) % playerCount;
    }

    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        s_randomWords = randomWords;
    }
   
    //-------------------------------------------------------------------------------------------
    
    function closeLottery() external onlyOwner{
        requestRandomWords();
        
    }
    function getLuckyNumber() public view returns(uint){
        return allLottery[s_requestId].numTicket;
    }

    // function claimReward() external{
    //     uint256 winnerPrize = 
    // }
    modifier onlyOwner() {
      require(msg.sender == s_owner);
      _;
    }
}