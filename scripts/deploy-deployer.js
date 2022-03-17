const {ethers} = require("hardhat");

async function main() {

  // We get the contract to deploy
  const Deployer = await ethers.getContractFactory("Deployer");
  const [owner, lender, borrower] = await ethers.getSigners();

  const mortgageValue = 900;
  const annualInterestRate = 5;
  const termLength = 30;


  const deployer = await Deployer.deploy();


  await deployer.deployed();

  console.log("Contract deployed to:", deployer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
