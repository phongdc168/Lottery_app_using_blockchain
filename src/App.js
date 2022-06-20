import './App.css'
import { useState } from 'react'
// import Web3 from "web3/dist/web3.min.js"
import { ethers } from "ethers";

function App() {
  const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState('Connect Wallet');
	const [userBalance, setUserBalance] = useState(null);
  const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {
			console.log('MetaMask Here!');

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				getAccountBalance(result[0]);
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
  getAccountBalance(newAccount.toString());
}

const getAccountBalance = (account) => {
  window.ethereum.request({method: 'eth_getBalance', params: [account, 'latest']})
  .then(balance => {
    setUserBalance(ethers.utils.formatEther(balance));
  })
  .catch(error => {
    setErrorMessage(error.message);
  });
};

const chainChangedHandler = () => {
  // reload the page to avoid any errors with chain change mid use of application
  window.location.reload();
}


// listen for account changes
window.ethereum.on('accountsChanged', accountChangedHandler);

window.ethereum.on('chainChanged', chainChangedHandler);

  return (
       <div className="main">
        <div className="layout-header">
        <div className="navbar-brand">
        LOTTERY APP
    </div>
      <div className="navbar-end">
          <button onClick={connectWalletHandler} className="connect-wallet">
            {}
          {defaultAccount}
          </button>
          </div>
        </div>
        <div className="layout-body">
          <div className="lottery-area">
            <div className="run-lottery">
              <div className="pay-money">
              Nạp 0.01 ETH để tham gia 
              <button className="play-game">
            NẠP
          </button>
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
