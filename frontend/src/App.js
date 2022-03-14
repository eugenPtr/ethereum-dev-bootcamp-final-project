import './App.css';
import {useState, useEffect} from "react";
import * as Wallet from "./components/Wallet";
import {ethers} from "ethers"

function App() {
  const [connectedAccount, setConnectedAccount] = useState("");
  const [connectedContract, setConnectedContract] = useState(null);
  const [mortgageValue, setMortgageValue] = useState("");
  const [monthlyPaymentValue, setMonthlyPaymentValue] = useState("");
  const [borrowedAmount, setBorrowedAmount] = useState("");
  
  const checkWalletConnection = async () => {
    await Wallet.checkIfWalletIsConnected(setConnectedAccount, setConnectedContract);
  }

  useEffect( () => {
    checkWalletConnection();

    console.log("Connected contract ", connectedContract);
    console.log("Connected account:", connectedAccount);
  }, [])

  useEffect( async () => {
    if (connectedContract) {
     let mortgageValue = await connectedContract.mortgageValue();
     setMortgageValue(mortgageValue);

     let monthlyPaymentValue = await connectedContract.monthlyPaymentValue();
     console.log("Monthly: ", monthlyPaymentValue);
     setMonthlyPaymentValue(ethers.utils.formatEther(monthlyPaymentValue));
      
     let borrowedAmount = await connectedContract.borrowedAmount();
     setBorrowedAmount(ethers.utils.formatEther(borrowedAmount));
    }
    

  }, [connectedContract])

  const makePayment = async () => {
    await connectedContract.pay({value: monthlyPaymentValue});
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <p>Mortgage value: {mortgageValue.toString()} ETH</p>
          <p>Monthly payment value: {monthlyPaymentValue} ETH</p>
          <p>Borrowed amount: {borrowedAmount} ETH</p>
          <button onClick={makePayment} className="button">
            Pay
          </button>

        </div>
       
      </header>
    </div>
  );
}

export default App;
