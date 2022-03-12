require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  paths: {
    artifacts: "./app/artifacts",
  },
  networks: {
    localhost: {
      url: "http://localhost:8545",
      chainId: 31337
    }
  }
};

