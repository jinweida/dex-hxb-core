

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
async function main() {

  const addrs =  hre.network.config.attachs;

  const TokenLock = await hre.ethers.getContractFactory("TokenLock");
  const tokenLock = await TokenLock.deploy(addrs.ddx);
  await tokenLock.deployed();
  console.log("TokenLock deploy to:", tokenLock.address);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
