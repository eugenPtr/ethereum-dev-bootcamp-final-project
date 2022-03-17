const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Deployer", () => {
  const mortgageValue = 900;
  const interestRate = 5;
  const termLength = 30;

  let owner;
  let lender;
  let borrower;
  let receipt;

  beforeEach(async () => {
    [owner, lender, borrower] = await ethers.getSigners();

    const Deployer = await ethers.getContractFactory("Deployer");
    
    contract = await Deployer.deploy();
    
    await contract.deployed();

  })

  describe("After contract deployment", () => {

    it("Owner should be set", async () => {

      expect((await contract.owner()).toString()).to.equal(await owner.getAddress());
    
    });

    it("Should increase proposalsCount when a new proposal is created", async () => {
        const createProposalTx = await contract.createProposal(borrower.address, mortgageValue, interestRate, termLength);
        await createProposalTx.wait();

        expect((await contract.proposalsCount()).toString()).to.equal("1");
  
    })

  })

  describe("When a proposal is accepted", async () => {
    beforeEach(async () => {
        const createProposalTx = await contract.connect(lender).createProposal(borrower.address, mortgageValue, interestRate, termLength);
        await createProposalTx.wait();
    });

    it("Should increase deployed contracts count", async () => {
        const acceptProposalTx = await contract.connect(borrower).acceptProposal(0);
        await acceptProposalTx.wait();

        expect((await contract.deployedContractsCount()).toString()).to.equal("1");
    })

    it("Should emit DeployedContract with correct args", async () => {
        const acceptProposalTx = await contract.connect(borrower).acceptProposal(0);
        receipt = await acceptProposalTx.wait();

        let event = receipt.events?.filter((x) => {return x.event == "DeployedContract"})[0];
    
        expect((event.args._contractId).toString()).to.equal("0");
        expect((event.args._proposalId).toString()).to.equal("0");
    })
  });
  
});
