import './App.css'
import { useEffect, useState } from 'react'
import { Contract, ethers } from 'ethers'
import lotteryAbi from "./lottery.abi.json"
import { resolveProperties } from 'ethers/lib/utils';


function App() {

  //----------------------- Declare variables using State ----------------------

  const [errorMessage, setErrorMessage] = useState();
  const [defaultAccount, setDefaultAccount] = useState('Connect Wallet');
  const [lotteryContract, setLotteryContract] = useState();
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [prizePool, setPrizePool] = useState('0');
  const [amountPlayer, setAmountPlayer] = useState('0');


  //----------------------------- Update State ---------------------------------

  useEffect(() => {
    updateState()
  }, [lotteryContract])

  const updateState = () => {
    if (lotteryContract) getBalance();
    if (lotteryContract) getAmountPlayer();
    if (lotteryContract) getPlayers();
  }

  //------------------------ Connect to contract -------------------------------

  const declareContract =  () =>{
  let lotteryAddress = "0x4C1dA878740194Cc71f44A6047307eb7ec035526"; // Contract Rinkeby
  // let lotteryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Contract Localhost

  let tmpProvider = new ethers.providers.Web3Provider(window.ethereum);
  setProvider(tmpProvider);
  let tmpSigner = tmpProvider.getSigner();
  setSigner(tmpSigner);
  let tmpContract = new ethers.Contract(lotteryAddress, lotteryAbi, tmpSigner);
  setLotteryContract(tmpContract);
  }

  //--------------------------- Connect Wallet ---------------------------------

  const connectWalletHandler = () => {
    declareContract();
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



  /* Get player */
  //==============================================================================

  const getBalance = async () =>{
    const pot = await lotteryContract.getBalance();
    setPrizePool(parseInt(Object.values(pot)[0], 16));
    console.log(prizePool);
} 
  

  const enter = () => {
    const numTicket = document.getElementById("getNumber").value;
    const costTicket = ethers.BigNumber.from("5");
    lotteryContract.enter(numTicket, {value: costTicket});
  }
 
  const getAmountPlayer = async () =>{
    const cntPlayer = await lotteryContract.getAmountPlayer();
    setAmountPlayer(parseInt(Object.values(cntPlayer)[0], 16));
    console.log(amountPlayer);
  }

  const getPlayers = async () =>{
    for(let i = 0; i < amountPlayer; i++){
    const player = await lotteryContract.getPlayers(i);
    console.log(Object.values(player)[1]);
    }
  }

  //==============================================================================


  return (
    <div className="main">
      <div className="layout-header">
        <div className="navbar-brand">
          LOTTERY APP
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
            <div>
              Giá vé: 5 wei
        <div className="pay-money">
                <input type="text" placeholder="Chọn số từ 1->10" id="getNumber" className="get-number" />
                <button  onClick={enter}className="get-player bt1">
                  Mua vé
          </button>
              </div>
            </div>
            <div className="pot">
              Tổng giải thưởng:
              <p>{prizePool}</p>
          </div>
          <button className="bt2">
                  Xổ số
          </button>
          </div>
          <div className="result-lottery">
            Kết quả đợt trước:
            </div>
        </div>
        <div className="participants">
          <div className="amount-players">
            <p style={{color: 'yellow'}}>Người tham gia:  </p> <p style={{color: 'rgb(65, 212, 176)'}}>{amountPlayer}</p>
          </div>
          <div className="list-player">          
          <div className="address-player">Địa chỉ</div>
          <div className="ticket-player">Số</div>
          </div>
          </div>
      </div>
    </div>
  );
}

export default App;
