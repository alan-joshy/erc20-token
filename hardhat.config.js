require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    sepolia: {
      url: "https://sep.boltnode.org",
      accounts: ["7db68fd3a0aec38febd85f893989334df6c943019003b137fae85febcd4e12aa"]
    }
  }
};
