const hre = require("hardhat");

async function main() {
  const name = "MyToken";
  const symbol = "MTK";
  const initialSupply = 1000000; // 1M tokens

  const Token = await hre.ethers.getContractFactory("MyToken");
  const token = await Token.deploy(name, symbol, initialSupply);

  await token.waitForDeployment();

  console.log("MyToken deployed at:", token.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
