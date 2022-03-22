import React from "react";
import NavBar from "./NavBar";
import {useEffect} from "react";
import {ethers} from "ethers";
import './BorrowersProposal.css'
import Deployer from "./contracts/Deployer.json";

import {DEPLOYER_CONTRACT} from "./utils.js";

export default function BorrowersProposal() {
  const [lenderAddress, setLenderAddress] = React.useState("");
  const [borrowerAddress, setBorrowerAddress] = React.useState("");
  const [maxLoanAmount, setMaxLoanAmount] = React.useState("");
  const [termLength, setTermLength] = React.useState("");
  const [interestRate, setInterestRate] = React.useState("");
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const [validProposals, setValidProposals] = React.useState(false);
  const [connectedAccount, setConnectedAccount] = React.useState("");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const deployerContract = new ethers.Contract(DEPLOYER_CONTRACT, Deployer.abi, signer);

  
   deployerContract.on("DeployedContract", (contractId, proposalId, contractAddress) => {
     console.log(contractId.toNumber(), proposalId.toNumber(), contractAddress);
     window.reverseMortgageAddress = contractAddress;
   })
  
   useEffect( async () => {
    let accounts = await provider.send("eth_requestAccounts", []);
        
        if (accounts.length != 0) {
            console.log("Found authorized account:", accounts[0]);
            setConnectedAccount(accounts[0]);
        }
    })

  useEffect( async () => {
    console.log("Deployed contract check:", await provider.getCode(DEPLOYER_CONTRACT));
    let proposalCount = await deployerContract.proposalsCount();
    
    if (proposalCount.toNumber() > 0) {

      let proposal = await deployerContract.proposals(0);
      setLenderAddress(proposal.lender.toString());
      setBorrowerAddress(proposal.borrower);
      setMaxLoanAmount(proposal.mortgageValue.toNumber());
      setTermLength(proposal.termLength.toNumber());
      setInterestRate(proposal.interestRate.toNumber());

      console.log(proposal);
      if (proposal.accepted === false) {
        setValidProposals(true);
      }

      console.log(connectedAccount, proposal.lender, proposal.borrower);

    }
  }, [connectedAccount])

  const handleSubmit = async (event) => {
    console.log(`
      Lender Address: ${lenderAddress}
      Maximum Loan Amount: ${maxLoanAmount}
      Term Length: ${termLength}
      Interest Rate: ${interestRate}
      Accepted Terms: ${acceptedTerms}
    `);

    event.preventDefault();

    await deployerContract.acceptProposal(0);
  };

  const renderNoProposalsForm = () => (
    <div>
      <p> There are currently no proposals for you.</p>
    </div>
  )

  const renderConnectBorrowerWallet = () => (
    <div>
      <p> Please connect borrower wallet to view the proposal </p>
    </div>
  )

  const renderProposalForm = () => (
    
    <form onSubmit={handleSubmit}>

    <label>Lenders Address</label>
      <div className="termField">
      {lenderAddress}
      </div>
    <label>Maximum Loan Amount</label>
      <div className="termField">
      {maxLoanAmount} ETH
      </div>
    <label>Term Length</label>
      <div className="termField">
      {termLength} Years
      </div>
    <label>Annual Interest Rate</label> 
      <div className="termField">
      {interestRate}%
      </div>
    <label> Monthly Transaction Fee</label>
      <div className="termField">
      $20.00
      </div>

      <div className="forum">
        <label>
          <input
            name="acceptedTerms"
            type="checkbox"
            onChange={(e) => setAcceptedTerms(e.target.value)}
            required
          />
          I accept the terms of service
        </label>
      </div>

      <button className="button2">Accept Proposal</button>
    </form>
  )

  return (
    <div className="App">
      <NavBar />

      <header className="App-header">
        <h1>Proposals</h1>
        {(validProposals && borrowerAddress.toLowerCase() == connectedAccount.toLowerCase()) ? renderProposalForm() : renderNoProposalsForm()} 
      </header>
    </div>
  );
}