import './DashBoard.css'
import {useState, useEffect} from "react";
import * as Wallet from "./components/Wallet";
import {ethers} from "ethers"
import NavBar from './NavBar';


function Dashboard() {
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

  /*
   <div>
          <p>Mortgage value: {mortgageValue.toString()} ETH</p>
          <p>Monthly payment value: {monthlyPaymentValue} ETH</p>
          <p>Borrowed amount: {borrowedAmount} ETH</p>
          <button onClick={makePayment} className="button2">
            Pay
          </button>

        </div>
  */

  return (
    <div className="App">
    <NavBar/>
      <header className="App-header">
      <div className="App-header-sub">
      <h1>RM Contract Dashboard</h1>
      <p>Contract Address:</p>
      </div>
      <div className="parentbox">

      <div className="bufferbox">
  
      <div className="childbox1">Mortgage value: {mortgageValue.toString()} ETH Accumulated Loan</div>
      <div className="childbox1">Loan Progress</div>
      <div className="childbox1">Total Principle Paid</div>
      <div className="childbox1">Total Interest Paid</div>
      <div className="childbox1">Monthly Principle</div>
      <div className="childbox1">Transaction Fees</div>
  
      </div>
      
      
      </div>
      <button onClick={makePayment} className="button3">Pay</button>
       
      </header>
    </div>
  );
}

export default Dashboard;
