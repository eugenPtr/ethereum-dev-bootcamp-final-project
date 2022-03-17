const {ethers} = require("hardhat");

async function main() {

  // We get the contract to deploy
  const ReverseMortgage = await ethers.getContractFactory("ReverseMortgage");
  
  const mortgageValue = 900;
  const annualInterestRate = 5;
  const termLength = 30;
  const lenderAddress = (await ethers.provider.getSigner(0)).getAddress();
  const borrowerAddress = (await ethers.provider.getSigner(1)).getAddress();

  const rm = await ReverseMortgage.deploy(
    lenderAddress,
    borrowerAddress,
    mortgageValue,
    annualInterestRate,
    termLength
  );

  await rm.deployed();

  console.log("Contract deployed to:", rm.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
