const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("ReverseMortgage", () => {
  const mortgageValue = 900;
  const annualInterestRate = 5;
  const termLength = 30;

  let contract;
  let lenderSigner;
  let borrowerSigner;
  let lenderAddress;
  let borrowerAddress;

  beforeEach(async () => {
    lenderSigner = await ethers.provider.getSigner(0);
    borrowerSigner = await ethers.provider.getSigner(1);

    lenderAddress = await lenderSigner.getAddress();
    borrowerAddress = await borrowerSigner.getAddress();

    const ReverseMortgage = await ethers.getContractFactory("ReverseMortgage");
    contract = await ReverseMortgage.deploy(
      lenderAddress, 
      borrowerAddress, 
      mortgageValue, 
      annualInterestRate, 
      termLength
    );
    
    await contract.deployed();

  })

  describe("After contract deployment", function () {

    it("Should correctly set contract terms and conditions", async function () {

      expect((await contract.mortgageValue()).toString()).to.equal(mortgageValue.toString());
      expect((await contract.annualInterestRate()).toString()).to.equal(annualInterestRate.toString());
      expect((await contract.termLength()).toString()).to.equal(termLength.toString());
  
    });

  })

  describe("After a month", async () => {
    beforeEach(async () => {
      let seconds = 10;
      await ethers.provider.send('evm_increaseTime', [seconds]);
      await ethers.provider.send('evm_mine', []);
    })

    it("Should have made the first payment", async function () {

      let paymentValue = mortgageValue / termLength / 12;
      let paymentValueInWei = ethers.utils.parseEther(paymentValue.toString());

      const payTx = await contract.connect(lenderSigner).pay({value: paymentValueInWei});
      // Wait for the tx to be mined  
      await payTx.wait();

      
      let currentBorrowedAmount = ethers.utils.formatEther(await contract.borrowedAmount()).toString();
      
      let monthlyInterestRate = Number.parseFloat( (annualInterestRate / 12).toPrecision(3) );
      let expectedBorrowedAmmount = paymentValue + (paymentValue * monthlyInterestRate / 100);
      
      expect(currentBorrowedAmount).to.equal(expectedBorrowedAmmount.toFixed(4));
      
    });

  });
  
});
