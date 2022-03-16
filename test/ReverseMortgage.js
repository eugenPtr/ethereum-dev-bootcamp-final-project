const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("ReverseMortgage", () => {
  const mortgageValue = 900;
  const annualInterestRate = 5;
  const termLength = 30;
  
  const paymentValue = mortgageValue / termLength / 12;
  const monthlyInterestRate = Number.parseFloat( (annualInterestRate / 12).toPrecision(3) );
  const expectedBorrowedAmountAfterOneMonth = paymentValue + (paymentValue * monthlyInterestRate / 100);

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

  describe("After first payment", async () => {
    beforeEach(async () => {
      let paymentValueInWei = ethers.utils.parseEther(paymentValue.toString());

      const payTx = await contract.connect(lenderSigner).pay({value: paymentValueInWei});
      // Wait for the tx to be mined  
      await payTx.wait();
    })

    it("Should update borrowed amount", async function () {
      
      let currentBorrowedAmount = ethers.utils.formatEther(await contract.borrowedAmount()).toString();
      
      expect(currentBorrowedAmount).to.equal(expectedBorrowedAmountAfterOneMonth.toFixed(4));
      
    });

    it("Should allow borrower to withdraw funds", async () => {
        const previousContractBalance = await ethers.provider.getBalance(contract.address);
        expect(ethers.utils.formatEther(previousContractBalance))
          .to.equal(paymentValue.toString());
        
        const withdrawTx = await contract.connect(borrowerSigner).withdraw();
        await withdrawTx.wait();

        const currentContractBalance = await ethers.provider.getBalance(contract.address);
        expect(ethers.utils.formatEther(currentContractBalance))
          .to.equal("0.0");


    })

    it("Should revert when someone else tries to withdraw funds", async () => {
      expect(contract.connect(lenderSigner).withdraw())
        .to.be.revertedWith('Only the borrower can call this function');
      
    })

  });
  
});
