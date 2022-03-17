import React from "react";
import NavBar from "./NavBar";
import './BorrowersProposal.css'

export default function BorrowersProposal() {
  const [lenderAddress, setLenderAddress] = React.useState("");
  const [maxLoanAmount, setMaxLoanAmount] = React.useState("");
  const [termLength, setTermLength] = React.useState("");
  const [interestRate, setInterestRate] = React.useState("");
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);

   
  //let lenderAddress = await connectedContract.lenderAddress();
  //setLenderAddress(ethers.utils.formatEther(lenderAddress));

  //let maxLoanAmount = await connectedContract.maxLoanAmount();
  //setMaxLoanAmount(ethers.utils.formatEther(maxLoanAmount));

  //let termLength = await connectedContract.termLength();
  //setTermLength(ethers.utils.formatEther(termLength));

  //let interestRate = await connectedContract.interestRate();
  //setInterestRate(ethers.utils.formatEther(interestRate));

  const handleSubmit = (event) => {
    console.log(`
      Lender Address: ${lenderAddress}
      Maximum Loan Amount: ${maxLoanAmount}
      Term Length: ${termLength}
      Interest Rate: ${interestRate}
      Accepted Terms: ${acceptedTerms}
    `);

    event.preventDefault();
  };

  return (
    <div className="App">
      <NavBar />

      <header className="App-header">
        <form onSubmit={handleSubmit}>
          <h1>Lender's Proposal</h1>

        <label>Lenders Address</label>
          <div className="termField">
          {lenderAddress}
          </div>
        <label>Maximum Loan Amount</label>
          <div className="termField">
          ${maxLoanAmount}
          </div>
        <label>Term Length</label>
          <div className="termField">
          {termLength} Year
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
      </header>
    </div>
  );
}