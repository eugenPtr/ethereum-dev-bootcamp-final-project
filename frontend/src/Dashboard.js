import './DashBoard.css'
import {useState, useEffect} from "react";
import * as Wallet from "./components/Wallet";
import {ethers} from "ethers"
import NavBar from './NavBar';


function Dashboard() {
  const [connectedAccount, setConnectedAccount] = useState("");
  const [connectedContract, setConnectedContract] = useState(null);
  const [borrowerAddress, setBorrowerAddress] = useState("");
  const [lenderAddress, setLenderAddress] = useState("");
  const [mortgageValue, setMortgageValue] = useState("");
  const [monthlyPaymentValue, setMonthlyPaymentValue] = useState("");
  const [borrowedAmount, setBorrowedAmount] = useState("");
  const [monthsPassed, setMonthsPassed] = useState(0);
  const [termLength, setTermLength] = useState(0);
  
  const checkWalletConnection = async () => {
    await Wallet.checkIfWalletIsConnected(setConnectedAccount, setConnectedContract);
  }


  const fetchContractData = async () => {
    let borrowerAddress = await connectedContract.borrower();
     console.log("Borrower address:", borrowerAddress);
     setBorrowerAddress(borrowerAddress);

     let lenderAddress = await connectedContract.lender();
     console.log("Lender address: ", lenderAddress);
     setLenderAddress(lenderAddress);

     let mortgageValue = await connectedContract.mortgageValue();
     setMortgageValue(mortgageValue);

     let monthlyPaymentValue = await connectedContract.monthlyPaymentValue();
     setMonthlyPaymentValue(ethers.utils.formatEther(monthlyPaymentValue));
      
     let borrowedAmount = await connectedContract.borrowedAmount();
     setBorrowedAmount(ethers.utils.formatEther(borrowedAmount));

     let monthsPassed = await connectedContract.monthsPassed();
     setMonthsPassed(monthsPassed.toNumber());

     let termLength = await connectedContract.termLength();
     setTermLength(termLength);
  }

  useEffect( () => {
    checkWalletConnection();

    console.log("Connected contract ", connectedContract);
    console.log("Connected account:", connectedAccount);
  }, [])

  useEffect( async () => {
    if (connectedContract) {
      fetchContractData();

      connectedContract.on("Payment", () => {
        fetchContractData();
      })
    }
    

  }, [connectedContract])

  const makePayment = async () => {
    await connectedContract.pay({value: ethers.utils.parseEther(monthlyPaymentValue)});
  }

  const withdrawFunds = async () => {
    await connectedContract.withdraw();
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
 const renderBorrowerView = () => (
  <button onClick={withdrawFunds} className="button3">Withdraw funds</button>
 )

 const renderLenderView = () => (
  <button onClick={makePayment} className="button3">Pay</button>
 )

 const renderNoDeployedContractDashboard = () => (
   <p> There is currently no deployed contract for this account</p>
 )

 const renderContractDashboard = () => (
  <div>

    <div className="App-header-sub">
      <h1>RM Contract Dashboard</h1>
      <p>Contract Address: {window.reverseMortgageAddress}</p>
    </div>

    <div className="parentbox">
      <div className="bufferbox">
        <div className="childbox1">Accumulated Loan: {borrowedAmount}</div>
        <div className="childbox1">Loan Progress: {monthsPassed}/{termLength*12}</div>
        <div className="childbox1">Total Principle Paid: {monthlyPaymentValue * monthsPassed}</div>
        <div className="childbox1">Total Interest Paid {borrowedAmount - (monthlyPaymentValue * monthsPassed)}</div>
        <div className="childbox1">Monthly Principle: {monthlyPaymentValue} ETH</div>
        <div className="childbox1">Transaction Fees</div>
      </div>
    </div>

    { connectedAccount === borrowerAddress ? renderBorrowerView() : renderLenderView()}

  </div>
 )

 

  return (
    <div className="App">
    <NavBar/>
      <header className="App-header">
        {connectedContract ? renderContractDashboard() : renderNoDeployedContractDashboard()}
      </header>
    
    </div>
  );
}

export default Dashboard;
