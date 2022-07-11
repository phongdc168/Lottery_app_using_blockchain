import './App.css'
import { useEffect, useState } from 'react'
import { Contract, ethers } from 'ethers'
import lotteryAbi from "./lottery.abi.json"
import { resolveProperties } from 'ethers/lib/utils';
import useInterval from './useInterval.js';
import { dblClick } from '@testing-library/user-event/dist/click';
import { getAllByDisplayValue } from '@testing-library/dom';

function App() {

  var lotteryId = 1;
  
  //----------------------- Declare variables using State ----------------------

  const [errorMessage, setErrorMessage] = useState();
  const [defaultAccount, setDefaultAccount] = useState('Connect Wallet');
  const [lotteryContract, setLotteryContract] = useState();
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [prizePool, setPrizePool] = useState('0');
  const [amountPlayer, setAmountPlayer] = useState('0');
  const [resultLottery, setResultLottery] = useState('0');
  const [amountWinner, setAmountWinner] = useState('0')

  //----------------------------- Update State ---------------------------------

  useEffect(() => {
    updateState()
  }, [lotteryContract])

  const updateState = () => {
    if (lotteryContract) getBalance();
    if (lotteryContract) getAmountPlayer();
    if (lotteryContract) getPlayers();
    if (lotteryContract) getResultLottery();
    if (lotteryContract) getAmountWinner();
    if (lotteryContract) getListWinner();
  }

  //----------------------------- Countdown lottery ---------------------------------

  window.onload = function start() {
    var time_in_minutes = 1;
    var current_time = Date.parse(new Date());
    var deadline = new Date(current_time + time_in_minutes * 60 * 1000);

    function time_remaining(endtime) {
      var t = Date.parse(endtime) - Date.parse(new Date());
      var seconds = Math.floor((t / 1000) % 60);
      var minutes = Math.floor((t / 1000 / 60) % 60);
      var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
      var days = Math.floor(t / (1000 * 60 * 60 * 24));
      return { 'total': t, 'days': days, 'hours': hours, 'minutes': minutes, 'seconds': seconds };
    }
    function run_clock(id, endtime) {
      var clock = document.getElementById(id);
      function update_clock() {
        var t = time_remaining(endtime);
        clock.innerHTML = t.minutes + '  phút' + '<br>' + t.seconds + '  giây';
        if (t.total <= 0) {
          // pickWinner();
          
          clearInterval(timeinterval);
        }
      }
      update_clock(); // run function once at first to avoid delay
      var timeinterval = setInterval(update_clock, 1000);
    }
    run_clock('clockdiv', deadline);

  }
  //------------------------ Connect to contract -------------------------------

  const declareContract = () => {
    // let lotteryAddress = "0x1d28BfF108F4AcF1c76bFF9777a1350Ed3635F3b"; // Contract Rinkeby
    let lotteryAddress = "0x790a36Cd2128Ecdd7d0fd91612213B16ad4f9739"; // Contract Rinkeby
    let tmpProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tmpProvider);
    let tmpSigner = tmpProvider.getSigner();
    setSigner(tmpSigner);
    let tmpContract = new ethers.Contract(lotteryAddress, lotteryAbi, tmpSigner);
    setLotteryContract(tmpContract);
  }

  //--------------------------- Connect wallet ---------------------------------

  const connectWalletHandler = () => {
  setInterval(declareContract, 8000);
    
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log('MetaMask Here!');

      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(result => {
          accountChangedHandler(result[0]);
        })
        .catch(error => {
          setErrorMessage(error.message);

        });

    } else {
      console.log('Need to install MetaMask');
      setErrorMessage('Please install MetaMask browser extension to interact');
    }
  }
  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
  }
  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
  }
  // listen for account changes
  window.ethereum.on('accountsChanged', accountChangedHandler);

  window.ethereum.on('chainChanged', chainChangedHandler);

  //--------------------------- Get balance --------------------------------------

  const getBalance = async () => {
    const pot = await lotteryContract.getBalance();
    setPrizePool(parseInt(Object.values(pot)[0], 16));
    console.log("Balance: ", prizePool);
  }

  //---------------------- Buy ticket and pick number ticket ---------------------

  const enter = () => {
    // setCostTicket();
    let numTicket = document.getElementById("getNumber").value;
    if (numTicket == "") numTicket = Math.floor(Math.random() * 10) + 1;
    // const costTicket = ethers.BigNumber.from("5");
    lotteryContract.enter(numTicket);
    document.getElementById("getNumber").value = "";
  }

  //--------------------------- Get amount player one game -----------------------

  const getAmountPlayer = async () => {
    const cntPlayer = await lotteryContract.getAmountPlayer();
    setAmountPlayer(parseInt(Object.values(cntPlayer)[0], 16));
    console.log("Amount Player: ", parseInt(Object.values(cntPlayer)[0], 16));
  }

  //----------------- Get list player and number ticket of player ----------------

  const getPlayers = async () => {
    const listNumberTicket = [];

    // Reset list player
    let menuPlayers = document.getElementById("listPlayer");
    menuPlayers.innerHTML = '';

    // Reset list ticket number
    let menuNumberTicket = document.getElementById("listNumTicket");
    menuNumberTicket.innerHTML = '';
    for (let i = 0; i < amountPlayer; i++) {
      const player = await lotteryContract.getPlayers(i);
      const numTicketPlayer = Object.values(player)[1];

      // Create list player
      const newLiPlayer = document.createElement("li");
      newLiPlayer.className = "li-player short-text";
      newLiPlayer.innerHTML = Object.values(player)[0];
      document.getElementById("listPlayer").appendChild(newLiPlayer);

      // Create list number ticket
      const newLiNumberTicket = document.createElement("li");
      newLiNumberTicket.className = "li-number-ticket short-text";
      newLiNumberTicket.innerHTML = parseInt(Object.values(numTicketPlayer)[0], 16);
      document.getElementById("listNumTicket").appendChild(newLiNumberTicket);
      console.log("Number Ticket: ", parseInt(Object.values(numTicketPlayer)[0], 16));
    }
  }

  //----------------------------- Reset lottery --------------------------------

  const resetLottery = async() =>{
    await lotteryContract._reset();
  }

  //----------------------------- Result lottery -------------------------------

  const getResultLottery = async () => {
    const res = await lotteryContract.getLuckyNumber();
    console.log("Result lottery", parseInt(Object.values(res)[0], 16));
    setResultLottery(parseInt(Object.values(res)[0], 16));
  }

  //----------------------------- Get amount winner one game -------------------
  
  const getAmountWinner = async() =>{
    const amountWinner = await lotteryContract.getAmountWinner();
    console.log("Amount Winner: ", parseInt(Object.values(amountWinner)[0], 16));
    setAmountWinner(parseInt(Object.values(amountWinner)[0], 16));
  }
  //----------------------------- Get list winner ------------------------------------

  const getListWinner = async () => {
    // Reset list winner
    let menuWinner = document.getElementById("listWinner");
    menuWinner.innerHTML='';

    for (let i = 0; i < amountWinner; i++) {
      const winner = await lotteryContract.getListWinner(i);
      
      // Create list winner lottery
      const newLiWinner = document.createElement("li");
      newLiWinner.className = "li-winner short-text";
      newLiWinner.innerHTML = winner;
      document.getElementById("listWinner").appendChild(newLiWinner);
    }
  }

  //----------------------------- Pick winner ------------------------------------

  const pickWinner = async () => {
    await lotteryContract._requestRandomWords();
    getResultLottery();
    getListWinner();
  }
  console.log("LotteryId", lotteryId);

  //-----------------------------------------------------------------------------

  return (
    <div className="main">
      <div className="layout-header">
        <div className="navbar-brand">
        &emsp;LOTTERY APP
        </div>
        <div className="navbar-end">
          <button onClick={connectWalletHandler} className="connect-wallet short-text">
            {defaultAccount}
          </button>
        </div>
      </div>
      <div className="layout-body">
        <div className="lottery-area">
          <div className="run-lottery">
            {/* <div className="info-lottery"> */}
              <div>
                Giá vé: 5 Token MTK
                <div className="pay-money">
                  <input type="text" placeholder="Chọn số từ 1->10" id="getNumber" className="get-number" />
                  <button onClick={enter} className="get-player bt1">
                    Mua vé
                  </button>
                </div>
              </div>
              <div className="pot">
                <div className="prize-pool">
                Tổng giải thưởng:
                <br/>
                <span style={{ color: 'rgb(64, 101, 224)', fontSize:80}}>{prizePool} tỉ</span>
                </div>
                <div className="countdown">
                <span id="headline">Kết thúc đợt {lotteryId} trong:</span>             
              <div id="clockdiv"></div>
              </div>
              </div>
            
            <button className="bt2" onClick={pickWinner}>Xổ số</button>
            <button className="bt2" onClick={resetLottery}>Reset</button>

            {/* </div> */}
          </div>
          <div className="result-lottery">
            <h2>Kết quả:</h2>
          <ul id="listWinner">
            <p>Kết quả đợt {lotteryId}:<br />
              Số may mắn: {resultLottery}<br />
              Danh sách chiến thắng: {amountWinner} người</p>
              
           </ul>
          </div>
        </div>
        <div className="participants">
          <div className="amount-players">
            <p style={{ color: 'rgb(240, 240, 84)' }}>Người tham gia:  </p> <p style={{ color: 'rgb(98, 132, 245)' }}>{amountPlayer}</p>
          </div>
          <div className="player-title">
            <div className="address-player">&emsp;Địa chỉ người chơi
              <ul id="listPlayer">

              </ul>
            </div>
            <div className="ticket-player">Số đã chọn
              <ul id="listNumTicket">

              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

}

export default App;
