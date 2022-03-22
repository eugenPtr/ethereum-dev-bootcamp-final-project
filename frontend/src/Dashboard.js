import './DashBoard.css'
import {useState, useEffect} from "react";
import * as Wallet from "./components/Wallet";
import {ethers} from "ethers"
import NavBar from './NavBar';
import {DEPLOYER_CONTRACT} from "./utils.js";
import Deployer from "./contracts/Deployer.json";
import ReverseMortgage from "./contracts/ReverseMortgage.json";


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
  const [contractBalance, setContractBalance] = useState("");
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const deployerContract = new ethers.Contract(DEPLOYER_CONTRACT, Deployer.abi, signer);


  useEffect( async () => {
    let accounts = await provider.send("eth_requestAccounts", []);
        
    if (accounts.length != 0) {
        console.log("Found authorized account:", accounts[0]);
        setConnectedAccount(accounts[0]);
    }
  })


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

     let contractBalance = await provider.getBalance(connectedContract.address);
     console.log("Contract balance: ", ethers.utils.formatEther(contractBalance));
     setContractBalance(ethers.utils.formatEther(contractBalance));
  }

  useEffect( async () => {
   
    const reverseMortgageAddress = await deployerContract.contractAddresses(0);
    if (reverseMortgageAddress != "0x0000000000000000000000000000000000000000") {
      const reverseMortgageContract = new ethers.Contract(reverseMortgageAddress, ReverseMortgage.abi, signer);
      console.log("Reverse Mortgage Address:", reverseMortgageContract.address);
      setConnectedContract(reverseMortgageContract);
    } else {
      console.log("No reverse mortgage address");
    }
  }, [connectedAccount])

  useEffect( async () => {
    if (connectedContract) {
      await fetchContractData();
      connectedContract.on("Payment",async () => {
        await fetchContractData();
      })
      connectedContract.on("Withdrawal", async () => {
        await fetchContractData();
      })
    }


  }, [connectedContract]);

  const makePayment = async () => {
    await connectedContract.pay({value: ethers.utils.parseEther(monthlyPaymentValue)});
  }

  const withdrawFunds = async () => {
    await connectedContract.withdraw();
  }

 const renderBorrowerView = () => (
   <div>
      <p>Contract balance: {contractBalance} ETH</p>
      <button onClick={withdrawFunds} className="button3">Withdraw funds</button>
   </div>
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
      <p>Contract Address: {connectedContract.address}</p>
    </div>

    <div className="parentbox">
      <div className="bufferbox">
        <div className="childbox1">Accumulated Loan: {borrowedAmount}</div>
        <div className="childbox1">Loan Progress: {monthsPassed}/{termLength*12}</div>
        <div className="childbox1">Total Principle Paid: {monthlyPaymentValue * monthsPassed} ETH</div>
        <div className="childbox1">Total Interest Paid {borrowedAmount - (monthlyPaymentValue * monthsPassed)} ETH</div>
        <div className="childbox1">Monthly Principle: {monthlyPaymentValue} ETH</div>
        <div className="childbox1">Transaction Fees</div>
      </div>
    </div>

    { connectedAccount.toLowerCase() === borrowerAddress.toLowerCase() ? renderBorrowerView() : renderLenderView()}

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
