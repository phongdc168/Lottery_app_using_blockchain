import './App.css'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import lotteryAbi from "./lottery.abi.json"


function App() {

  /* Declare variables using State */
  //==============================================================================


  const [errorMessage, setErrorMessage] = useState();
  const [defaultAccount, setDefaultAccount] = useState('Connect Wallet');
  const [lotteryContract, setLotteryContract] = useState();
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [prizePool, setPrizePool] = useState('0');


  /* Update State */
  //==============================================================================
  // useEffect(() => {
  //   updateState()
  // }, [lotteryContract])

  // const updateState = () => {
  //   if (lotteryContract) getBalance();
  //   // if (lcContract) getPlayers()
  //   // if (lcContract) getLotteryId()
  // }

  /* Declare variable connect to contract */
  //==============================================================================

  const declareContract =  () =>{
  let lotteryAddress = "0x9f61cc0314d8Db9E39e669Bc157468A0ee76E1cc"; // Contract Rinkeby
  // let lotteryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Contract Localhost

  let tmpProvider = new ethers.providers.Web3Provider(window.ethereum);
  setProvider(tmpProvider);
  let tmpSigner = tmpProvider.getSigner();
  setSigner(tmpSigner);
  let tmpContract = new ethers.Contract(lotteryAddress, lotteryAbi, tmpSigner);
  setLotteryContract(tmpContract);
  // const lotteryContract = new ethers.Contract(lotteryAddress, lotteryAbi, provider);
  // setContract(lotteryContract);

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


  /* Get player */
  //==============================================================================


  const enter = () => {
    const numTicket = document.getElementById("getNumber").value;
    const costTicket = ethers.BigNumber.from("5");
    // await (await contract.enter(numTicket).wait());
    lotteryContract.enter(numTicket, {value: costTicket});
    // setPrizePool(ethers.BigNumber.from(lotteryContract.getBalance()));
    console.log(lotteryContract.getBalance());
  }
  // const getBalance = async () =>{
  //   const pot = await ethers.BigNumber(lotteryContract.getBalance().toString());
  //   setPrizePool(pot);
  //   console.log(pot);
  // }

  //==============================================================================


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
              Giá vé: 2 wei
        <div className="pay-money">
                <input type="text" placeholder="Chọn số từ 1->10" id="getNumber" className="get-number" />
                <button  onClick={enter}className="play-game">
                  Mua vé
          </button>
              </div>
            </div>
            <div className="pot">
              Tổng giải thưởng:
              <p>{prizePool}</p>
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
