import './App.css'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import lotteryAbi from "./lottery.abi.json"

function App() {

  /* Declare variables using State */
  //==============================================================================


  const [errorMessage, setErrorMessage] = useState();
  const [defaultAccount, setDefaultAccount] = useState('Connect Wallet');
  const [contract, setContract] = useState();
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();


  /* Update State */
  //==============================================================================

  /* Load contract */
  //==============================================================================

  /* Declare variable connect to contract */
  //==============================================================================

  const declareContract = async () =>{
  let lotteryAddress = "0x9f1411a8f8A7df26e1B69ed063E54BbeC324D47F";

  const lotteryContract = new ethers.Contract(lotteryAddress, lotteryAbi, provider);
  let tmpProvider = new ethers.providers.Web3Provider(window.ethereum);
  setProvider(tmpProvider);
  let tmpSigner = tmpProvider.getSigner();
  setSigner(tmpSigner);
  let tmpContract = new ethers.Contract(lotteryAddress, lotteryAbi, tmpSigner);
  setContract(tmpContract);

  }
  /* Connect Wallet */
  //==============================================================================


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

  /* Load Lottery */
  //==============================================================================
  // const runLottery = () =>{
  //   lotteryContract.startLottery(1, 10, 600);
  // }


  /* Get player */
  //==============================================================================


  const getPlayers = async () => {
    let numTicket = document.getElementById("getNumber").value;
    // event.preventDefault();
    await (await contract.enter({value:10})).wait();
    console.log(contract.getPlayers());
    // let player = await contract.enter({value:10});
  }


  //==============================================================================


    // useEffect(() => {
    //   declareContract()
    // }, [])

  return (
    <div className="main">
      <div className="layout-header">
        <div className="navbar-brand">
          LOTTERY APP
    </div>
        <div className="navbar-end">
          <button onClick={connectWalletHandler} className="connect-wallet">
            {defaultAccount}
          </button>
        </div>
      </div>
      <div className="layout-body">
        <div className="lottery-area">
          <div className="run-lottery">
            <div>
              Giá vé số: 2 wei
        <div className="pay-money">
                <input type="text" placeholder="Chọn số từ 1->10" id="getNumber" className="get-number" />
                <button  onClick={getPlayers}className="play-game">
                  Mua vé
          </button>
              </div>
            </div>
            <div className="pot">
              Tổng giải thưởng:
          </div>
          </div>
          <div className="result-lottery">
            Kết quả đợt trước:
            </div>
        </div>
        <div className="participants">
          Người tham gia:
          </div>
      </div>
    </div>
  );
}

export default App;
