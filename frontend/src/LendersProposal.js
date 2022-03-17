import React from "react";
import NavBar from "./NavBar";
import './LendersProposal.css';
import {ethers} from "ethers";
import Deployer from "./contracts/Deployer.json";
import {DEPLOYER_CONTRACT} from "./utils.js";

//const DEPLOYER_CONTRACT = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function LendersProposal() {
  const [borrowerAddress, setBorrowerAddress] = React.useState("");
  const [maxLoanAmount, setMaxLoanAmount] = React.useState("");
  const [termLength, setTermLength] = React.useState("");
  const [interestRate, setInterestRate] = React.useState("");
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);

  const handleSubmit = async (event) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const deployerContract = new ethers.Contract(DEPLOYER_CONTRACT, Deployer.abi, signer);

    console.log(`
      Borrower Address: ${borrowerAddress}
      Maximum Loan Amount: ${maxLoanAmount}
      Term Length: ${termLength}
      Interest Rate: ${interestRate}
      Accepted Terms: ${acceptedTerms}
    `);

    event.preventDefault();

    let createProposalTx = await deployerContract.createProposal(borrowerAddress, maxLoanAmount, interestRate, termLength);
  };

  return (
    <div className="App">
      <NavBar />

      <header className="App-header">
        <form onSubmit={handleSubmit}>
          <h1>Create Proposal</h1>

          <div className="forum">
          <label>
            Borrower Address:
        
          </label>
          <input
              name="borrowerAddress"
              type="text"
              value={borrowerAddress}
              onChange={(e) => setBorrowerAddress(e.target.value)}
              required
            />
          </div>

          <div className="forum">
            <label>
              Maximum Loan Amount:
            </label>
            <input
                name="maxLoanAmount"
                type="number"
                value={maxLoanAmount}
                onChange={(e) => setMaxLoanAmount(e.target.value)}
                required
              />
          </div>

          <div className="forum">
            <label>Term Length:</label>
            <input
              name="termLength"
              type="number"
              value={termLength}
              onChange={(e) => setTermLength(e.target.value)}
              required
            />
          </div>

          <div className="forum">
            <label>
              Annual Interest Rate:
            </label>
            <input
                name="interestRate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                required
              />
              <p>Additional 1% will be added by contract</p>
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

          <button className="button2">Send Proposal</button>
        </form>
      </header>
    </div>
  );
}
